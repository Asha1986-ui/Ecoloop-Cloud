package com.ecoloop.dto;

public class AdminStatisticsResponse {
    private long totalCitizens;
    private long activeCitizens;
    private long totalCollectors;
    private long totalPickups;
    private long completedPickups;
    private long totalBottlesCollected;
    private double totalPlasticCollectedKg;
    private long totalEcoCreditsIssued;
    private long totalRewardsRedeemed;
    private double totalCo2ReducedKg;

    public AdminStatisticsResponse() {}
    public long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; }
    public long getActiveCitizens() { return activeCitizens; }
    public void setActiveCitizens(long activeCitizens) { this.activeCitizens = activeCitizens; }
    public long getTotalCollectors() { return totalCollectors; }
    public void setTotalCollectors(long totalCollectors) { this.totalCollectors = totalCollectors; }
    public long getTotalPickups() { return totalPickups; }
    public void setTotalPickups(long totalPickups) { this.totalPickups = totalPickups; }
    public long getCompletedPickups() { return completedPickups; }
    public void setCompletedPickups(long completedPickups) { this.completedPickups = completedPickups; }
    public long getTotalBottlesCollected() { return totalBottlesCollected; }
    public void setTotalBottlesCollected(long totalBottlesCollected) { this.totalBottlesCollected = totalBottlesCollected; }
    public double getTotalPlasticCollectedKg() { return totalPlasticCollectedKg; }
    public void setTotalPlasticCollectedKg(double totalPlasticCollectedKg) { this.totalPlasticCollectedKg = totalPlasticCollectedKg; }
    public long getTotalEcoCreditsIssued() { return totalEcoCreditsIssued; }
    public void setTotalEcoCreditsIssued(long totalEcoCreditsIssued) { this.totalEcoCreditsIssued = totalEcoCreditsIssued; }
    public long getTotalRewardsRedeemed() { return totalRewardsRedeemed; }
    public void setTotalRewardsRedeemed(long totalRewardsRedeemed) { this.totalRewardsRedeemed = totalRewardsRedeemed; }
    public double getTotalCo2ReducedKg() { return totalCo2ReducedKg; }
    public void setTotalCo2ReducedKg(double totalCo2ReducedKg) { this.totalCo2ReducedKg = totalCo2ReducedKg; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private long totalCitizens; private long activeCitizens; private long totalCollectors;
        private long totalPickups; private long completedPickups; private long totalBottlesCollected;
        private double totalPlasticCollectedKg; private long totalEcoCreditsIssued; private long totalRewardsRedeemed; private double totalCo2ReducedKg;
        public Builder totalCitizens(long t) { this.totalCitizens = t; return this; }
        public Builder activeCitizens(long a) { this.activeCitizens = a; return this; }
        public Builder totalCollectors(long c) { this.totalCollectors = c; return this; }
        public Builder totalPickups(long p) { this.totalPickups = p; return this; }
        public Builder completedPickups(long cp) { this.completedPickups = cp; return this; }
        public Builder totalBottlesCollected(long b) { this.totalBottlesCollected = b; return this; }
        public Builder totalPlasticCollectedKg(double w) { this.totalPlasticCollectedKg = w; return this; }
        public Builder totalEcoCreditsIssued(long e) { this.totalEcoCreditsIssued = e; return this; }
        public Builder totalRewardsRedeemed(long r) { this.totalRewardsRedeemed = r; return this; }
        public Builder totalCo2ReducedKg(double co2) { this.totalCo2ReducedKg = co2; return this; }
        public AdminStatisticsResponse build() {
            AdminStatisticsResponse a = new AdminStatisticsResponse();
            a.setTotalCitizens(totalCitizens); a.setActiveCitizens(activeCitizens); a.setTotalCollectors(totalCollectors);
            a.setTotalPickups(totalPickups); a.setCompletedPickups(completedPickups); a.setTotalBottlesCollected(totalBottlesCollected);
            a.setTotalPlasticCollectedKg(totalPlasticCollectedKg); a.setTotalEcoCreditsIssued(totalEcoCreditsIssued);
            a.setTotalRewardsRedeemed(totalRewardsRedeemed); a.setTotalCo2ReducedKg(totalCo2ReducedKg); return a;
        }
    }
}
