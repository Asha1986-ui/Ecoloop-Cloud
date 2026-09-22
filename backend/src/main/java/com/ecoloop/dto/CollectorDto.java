package com.ecoloop.dto;

public class CollectorDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private boolean active;
    private long completedPickupsCount;
    private long totalBottlesCollected;

    public CollectorDto() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public long getCompletedPickupsCount() { return completedPickupsCount; }
    public void setCompletedPickupsCount(long count) { this.completedPickupsCount = count; }
    public long getTotalBottlesCollected() { return totalBottlesCollected; }
    public void setTotalBottlesCollected(long bottles) { this.totalBottlesCollected = bottles; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name; private String email; private String phone;
        private String city; private boolean active; private long completedPickupsCount; private long totalBottlesCollected;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder active(boolean a) { this.active = a; return this; }
        public Builder completedPickupsCount(long cp) { this.completedPickupsCount = cp; return this; }
        public Builder totalBottlesCollected(long b) { this.totalBottlesCollected = b; return this; }
        public CollectorDto build() {
            CollectorDto c = new CollectorDto();
            c.setId(id); c.setName(name); c.setEmail(email); c.setPhone(phone); c.setCity(city);
            c.setActive(active); c.setCompletedPickupsCount(completedPickupsCount); c.setTotalBottlesCollected(totalBottlesCollected);
            return c;
        }
    }
}
