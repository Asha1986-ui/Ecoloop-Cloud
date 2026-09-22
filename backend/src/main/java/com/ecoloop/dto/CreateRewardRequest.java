package com.ecoloop.dto;

import com.ecoloop.entity.RewardCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateRewardRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Category is required")
    private RewardCategory category;
    @NotNull(message = "Credits required is mandatory")
    @Min(value = 1, message = "Credits required must be positive")
    private Integer creditsRequired;
    @NotBlank(message = "Provider is required")
    private String provider;
    private boolean governmentApproved = true;
    private boolean available = true;
    private Integer stockCount;
    private String imageUrl;
    private LocalDate expiryDate;

    public CreateRewardRequest() {}
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public RewardCategory getCategory() { return category; }
    public void setCategory(RewardCategory category) { this.category = category; }
    public Integer getCreditsRequired() { return creditsRequired; }
    public void setCreditsRequired(Integer creditsRequired) { this.creditsRequired = creditsRequired; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public boolean isGovernmentApproved() { return governmentApproved; }
    public void setGovernmentApproved(boolean governmentApproved) { this.governmentApproved = governmentApproved; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public Integer getStockCount() { return stockCount; }
    public void setStockCount(Integer stockCount) { this.stockCount = stockCount; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
