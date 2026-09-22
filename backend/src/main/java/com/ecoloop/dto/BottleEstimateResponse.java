package com.ecoloop.dto;

import java.util.List;

public class BottleEstimateResponse {
    private Integer estimatedBottleCount;
    private Double confidencePercentage;
    private Double estimatedPlasticWeightKg;
    private List<String> detectedItems;
    private String disclaimer = "AI Estimate — Verified quantity will be confirmed by authorized collection worker upon doorstep inspection.";

    public BottleEstimateResponse() {}
    public Integer getEstimatedBottleCount() { return estimatedBottleCount; }
    public void setEstimatedBottleCount(Integer count) { this.estimatedBottleCount = count; }
    public Double getConfidencePercentage() { return confidencePercentage; }
    public void setConfidencePercentage(Double conf) { this.confidencePercentage = conf; }
    public Double getEstimatedPlasticWeightKg() { return estimatedPlasticWeightKg; }
    public void setEstimatedPlasticWeightKg(Double weight) { this.estimatedPlasticWeightKg = weight; }
    public List<String> getDetectedItems() { return detectedItems; }
    public void setDetectedItems(List<String> items) { this.detectedItems = items; }
    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Integer estimatedBottleCount; private Double confidencePercentage;
        private Double estimatedPlasticWeightKg; private List<String> detectedItems;
        private String disclaimer = "AI Estimate — Verified quantity will be confirmed by authorized collection worker upon doorstep inspection.";
        public Builder estimatedBottleCount(Integer b) { this.estimatedBottleCount = b; return this; }
        public Builder confidencePercentage(Double c) { this.confidencePercentage = c; return this; }
        public Builder estimatedPlasticWeightKg(Double w) { this.estimatedPlasticWeightKg = w; return this; }
        public Builder detectedItems(List<String> items) { this.detectedItems = items; return this; }
        public Builder disclaimer(String d) { this.disclaimer = d; return this; }
        public BottleEstimateResponse build() {
            BottleEstimateResponse r = new BottleEstimateResponse();
            r.setEstimatedBottleCount(estimatedBottleCount); r.setConfidencePercentage(confidencePercentage);
            r.setEstimatedPlasticWeightKg(estimatedPlasticWeightKg); r.setDetectedItems(detectedItems);
            r.setDisclaimer(disclaimer); return r;
        }
    }
}
