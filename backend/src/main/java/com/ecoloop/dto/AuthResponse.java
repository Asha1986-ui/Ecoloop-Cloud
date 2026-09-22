package com.ecoloop.dto;

import com.ecoloop.entity.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String address;
    private String city;

    public AuthResponse() {}
    public AuthResponse(String token, String type, Long id, String name, String email, Role role, String phone, String address, String city) {
        this.token = token; this.type = type != null ? type : "Bearer"; this.id = id; this.name = name;
        this.email = email; this.role = role; this.phone = phone; this.address = address; this.city = city;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String token; private String type = "Bearer"; private Long id; private String name;
        private String email; private Role role; private String phone; private String address; private String city;
        public Builder token(String t) { this.token = t; return this; }
        public Builder type(String t) { this.type = t; return this; }
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder role(Role r) { this.role = r; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public Builder address(String a) { this.address = a; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public AuthResponse build() { return new AuthResponse(token, type, id, name, email, role, phone, address, city); }
    }
}
