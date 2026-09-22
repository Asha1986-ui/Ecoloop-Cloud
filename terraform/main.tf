terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "location" {
  type        = string
  default     = "eastus2"
  description = "Azure deployment region"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Deployment target environment (dev, staging, prod)"
}

variable "db_admin_username" {
  type        = string
  default     = "ecoloop_admin"
  description = "Administrator login for MySQL Flexible Server"
}

variable "db_admin_password" {
  type        = string
  sensitive   = true
  description = "Secure password for MySQL database administrator"
}

variable "jwt_secret_key" {
  type        = string
  sensitive   = true
  description = "Base64 or 256-bit secret key for stateless JWT signing"
}

# -------------------------------------------------------------
# 1. Resource Group & Telemetry
# -------------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  name     = "rg-ecoloop-${var.environment}"
  location = var.location
  tags = {
    Environment = var.environment
    Project     = "EcoLoop"
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "log-ecoloop-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = "appi-ecoloop-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.logs.id
  application_type    = "web"
}

# -------------------------------------------------------------
# 2. Key Vault (Secure Secret Storage)
# -------------------------------------------------------------
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                       = "kv-ecoloop-${var.environment}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = var.jwt_secret_key
  key_vault_id = azurerm_key_vault.kv.id
}

# -------------------------------------------------------------
# 3. Azure Database for MySQL Flexible Server
# -------------------------------------------------------------
resource "azurerm_mysql_flexible_server" "mysql" {
  name                   = "mysql-ecoloop-${var.environment}"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  sku_name               = "B_Standard_B1ms"
  version                = "8.0.21"
  backup_retention_days  = 7

  storage {
    size_gb            = 20
    auto_grow_enabled  = true
    io_scaling_enabled = false
  }
}

resource "azurerm_mysql_flexible_database" "db" {
  name                = "ecoloop"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.mysql.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "allow_azure_services" {
  name                = "AllowAllWindowsAzureIps"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.mysql.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# -------------------------------------------------------------
# 4. App Service Plan & Container Web Apps
# -------------------------------------------------------------
resource "azurerm_service_plan" "asp" {
  name                = "asp-ecoloop-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# Backend App Service
resource "azurerm_linux_web_app" "backend" {
  name                = "app-ecoloop-backend-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    always_on = true
    application_stack {
      docker_image_name   = "ecoloop-backend:latest"
      docker_registry_url = "https://mcr.microsoft.com"
    }
  }

  app_settings = {
    "SPRING_PROFILES_ACTIVE"        = "prod"
    "SPRING_DATASOURCE_URL"         = "jdbc:mysql://${azurerm_mysql_flexible_server.mysql.fqdn}:3306/ecoloop?useSSL=true&requireSSL=false&serverTimezone=UTC"
    "SPRING_DATASOURCE_USERNAME"    = var.db_admin_username
    "SPRING_DATASOURCE_PASSWORD"    = var.db_admin_password
    "JWT_SECRET"                    = var.jwt_secret_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.appinsights.connection_string
  }
}

# Frontend Static Web App
resource "azurerm_static_web_app" "frontend" {
  name                = "stapp-ecoloop-frontend-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2"
  sku_tier            = "Free"
  sku_size            = "Free"
}

output "mysql_fqdn" {
  value       = azurerm_mysql_flexible_server.mysql.fqdn
  description = "Fully qualified domain name of Azure MySQL server"
}

output "backend_api_url" {
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
  description = "Public URL for Spring Boot REST API"
}

output "frontend_url" {
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
  description = "Public URL for EcoLoop React client"
}
