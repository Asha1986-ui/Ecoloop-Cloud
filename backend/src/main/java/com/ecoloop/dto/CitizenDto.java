package com.ecoloop.dto;

import java.time.LocalDateTime;

public class CitizenDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private boolean active;
    private int totalPickups;
    private int bottlesRecycled;
    private int ecoCredits;
    private LocalDateTime joinedAt;

    public CitizenDto() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public int getTotalPickups() { return totalPickups; }
    public void setTotalPickups(int totalPickups) { this.totalPickups = totalPickups; }
    public int getBottlesRecycled() { return bottlesRecycled; }
    public void setBottlesRecycled(int bottlesRecycled) { this.bottlesRecycled = bottlesRecycled; }
    public int getEcoCredits() { return ecoCredits; }
    public void setEcoCredits(int ecoCredits) { this.ecoCredits = ecoCredits; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name; private String email; private String phone;
        private String address; private String city; private boolean active;
        private int totalPickups; private int bottlesRecycled; private int ecoCredits; private LocalDateTime joinedAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public Builder address(String a) { this.address = a; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder active(boolean a) { this.active = a; return this; }
        public Builder totalPickups(int tp) { this.totalPickups = tp; return this; }
        public Builder bottlesRecycled(int b) { this.bottlesRecycled = b; return this; }
        public Builder ecoCredits(int ec) { this.ecoCredits = ec; return this; }
        public Builder joinedAt(LocalDateTime j) { this.joinedAt = j; return this; }
        public CitizenDto build() {
            CitizenDto c = new CitizenDto();
            c.setId(id); c.setName(name); c.setEmail(email); c.setPhone(phone); c.setAddress(address);
            c.setCity(city); c.setActive(active); c.setTotalPickups(totalPickups); c.setBottlesRecycled(bottlesRecycled);
            c.setEcoCredits(ecoCredits); c.setJoinedAt(joinedAt); return c;
        }
    }
}
