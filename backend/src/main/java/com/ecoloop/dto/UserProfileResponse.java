package com.ecoloop.dto;

import com.ecoloop.entity.Role;
import java.time.LocalDateTime;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String address;
    private String city;
    private boolean active;
    private LocalDateTime createdAt;

    public UserProfileResponse() {}
    public UserProfileResponse(Long id, String name, String email, Role role, String phone, String address, String city, boolean active, LocalDateTime createdAt) {
        this.id = id; this.name = name; this.email = email; this.role = role; this.phone = phone;
        this.address = address; this.city = city; this.active = active; this.createdAt = createdAt;
    }

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
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name; private String email; private Role role;
        private String phone; private String address; private String city; private boolean active; private LocalDateTime createdAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder role(Role r) { this.role = r; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public Builder address(String a) { this.address = a; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder active(boolean a) { this.active = a; return this; }
        public Builder createdAt(LocalDateTime t) { this.createdAt = t; return this; }
        public UserProfileResponse build() { return new UserProfileResponse(id, name, email, role, phone, address, city, active, createdAt); }
    }
}
