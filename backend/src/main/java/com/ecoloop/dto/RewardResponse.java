package com.ecoloop.dto;

import com.ecoloop.entity.RewardCategory;
import java.time.LocalDate;

public class RewardResponse {
    private Long id;
    private String name;
    private String description;
    private RewardCategory category;
    private Integer creditsRequired;
    private String provider;
    private boolean governmentApproved;
    private boolean available;
    private Integer stockCount;
    private String imageUrl;
    private LocalDate expiryDate;

    public RewardResponse() {}
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

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name; private String description; private RewardCategory category;
        private Integer creditsRequired; private String provider; private boolean governmentApproved;
        private boolean available; private Integer stockCount; private String imageUrl; private LocalDate expiryDate;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder description(String d) { this.description = d; return this; }
        public Builder category(RewardCategory c) { this.category = c; return this; }
        public Builder creditsRequired(Integer cr) { this.creditsRequired = cr; return this; }
        public Builder provider(String p) { this.provider = p; return this; }
        public Builder governmentApproved(boolean ga) { this.governmentApproved = ga; return this; }
        public Builder available(boolean a) { this.available = a; return this; }
        public Builder stockCount(Integer s) { this.stockCount = s; return this; }
        public Builder imageUrl(String img) { this.imageUrl = img; return this; }
        public Builder expiryDate(LocalDate ed) { this.expiryDate = ed; return this; }
        public RewardResponse build() {
            RewardResponse r = new RewardResponse();
            r.setId(id); r.setName(name); r.setDescription(description); r.setCategory(category);
            r.setCreditsRequired(creditsRequired); r.setProvider(provider); r.setGovernmentApproved(governmentApproved);
            r.setAvailable(available); r.setStockCount(stockCount); r.setImageUrl(imageUrl); r.setExpiryDate(expiryDate);
            return r;
        }
    }
}
