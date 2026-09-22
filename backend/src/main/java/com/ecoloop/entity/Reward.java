package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "rewards")
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RewardCategory category;
    @Column(name = "credits_required", nullable = false)
    private Integer creditsRequired;
    @Column(nullable = false)
    private String provider;
    @Column(name = "approved", nullable = false)
    private boolean approved = true;
    @Column(name = "available", nullable = false)
    private boolean available = true;
    @Column(name = "stock_count")
    private Integer stockCount;
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    public Reward() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public Integer getStockCount() { return stockCount; }
    public void setStockCount(Integer stockCount) { this.stockCount = stockCount; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name; private String description; private RewardCategory category;
        private Integer creditsRequired; private String provider; private boolean approved = true;
        private boolean available = true; private Integer stockCount; private String imageUrl; private LocalDate expiryDate;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String d) { this.description = d; return this; }
        public Builder category(RewardCategory c) { this.category = c; return this; }
        public Builder creditsRequired(Integer cr) { this.creditsRequired = cr; return this; }
        public Builder provider(String p) { this.provider = p; return this; }
        public Builder approved(boolean a) { this.approved = a; return this; }
        public Builder available(boolean a) { this.available = a; return this; }
        public Builder stockCount(Integer sc) { this.stockCount = sc; return this; }
        public Builder imageUrl(String img) { this.imageUrl = img; return this; }
        public Builder expiryDate(LocalDate ed) { this.expiryDate = ed; return this; }

        public Reward build() {
            Reward r = new Reward();
            r.setId(id); r.setName(name); r.setDescription(description); r.setCategory(category);
            r.setCreditsRequired(creditsRequired); r.setProvider(provider); r.setApproved(approved);
            r.setAvailable(available); r.setStockCount(stockCount); r.setImageUrl(imageUrl); r.setExpiryDate(expiryDate);
            return r;
        }
    }
}
