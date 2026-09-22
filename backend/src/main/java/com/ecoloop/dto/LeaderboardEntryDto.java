package com.ecoloop.dto;

public class LeaderboardEntryDto {
    private Integer rank;
    private Long userId;
    private String name;
    private String city;
    private Integer bottlesRecycled;
    private Double plasticWeightKg;
    private Integer ecoCreditsEarned;
    private boolean isCurrentUser;

    public LeaderboardEntryDto() {}
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public Integer getBottlesRecycled() { return bottlesRecycled; }
    public void setBottlesRecycled(Integer bottlesRecycled) { this.bottlesRecycled = bottlesRecycled; }
    public Double getPlasticWeightKg() { return plasticWeightKg; }
    public void setPlasticWeightKg(Double plasticWeightKg) { this.plasticWeightKg = plasticWeightKg; }
    public Integer getEcoCreditsEarned() { return ecoCreditsEarned; }
    public void setEcoCreditsEarned(Integer ecoCreditsEarned) { this.ecoCreditsEarned = ecoCreditsEarned; }
    public boolean isCurrentUser() { return isCurrentUser; }
    public void setCurrentUser(boolean currentUser) { isCurrentUser = currentUser; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Integer rank; private Long userId; private String name; private String city;
        private Integer bottlesRecycled; private Double plasticWeightKg; private Integer ecoCreditsEarned; private boolean isCurrentUser;
        public Builder rank(Integer r) { this.rank = r; return this; }
        public Builder userId(Long id) { this.userId = id; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder bottlesRecycled(Integer b) { this.bottlesRecycled = b; return this; }
        public Builder plasticWeightKg(Double w) { this.plasticWeightKg = w; return this; }
        public Builder ecoCreditsEarned(Integer e) { this.ecoCreditsEarned = e; return this; }
        public Builder isCurrentUser(boolean curr) { this.isCurrentUser = curr; return this; }
        public LeaderboardEntryDto build() {
            LeaderboardEntryDto res = new LeaderboardEntryDto();
            res.setRank(rank); res.setUserId(userId); res.setName(name); res.setCity(city);
            res.setBottlesRecycled(bottlesRecycled); res.setPlasticWeightKg(plasticWeightKg);
            res.setEcoCreditsEarned(ecoCreditsEarned); res.setCurrentUser(isCurrentUser); return res;
        }
    }
}
