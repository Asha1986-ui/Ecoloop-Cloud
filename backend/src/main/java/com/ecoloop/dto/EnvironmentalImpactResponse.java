package com.ecoloop.dto;

public class EnvironmentalImpactResponse {
    private Integer bottlesRecycled;
    private Double plasticWeightKg;
    private Double estimatedCO2ReductionKg;
    private Double equivalentTreesPlanted;
    private Double equivalentEnergySavedKwh;

    public EnvironmentalImpactResponse() {}
    public Integer getBottlesRecycled() { return bottlesRecycled; }
    public void setBottlesRecycled(Integer bottlesRecycled) { this.bottlesRecycled = bottlesRecycled; }
    public Double getPlasticWeightKg() { return plasticWeightKg; }
    public void setPlasticWeightKg(Double plasticWeightKg) { this.plasticWeightKg = plasticWeightKg; }
    public Double getEstimatedCO2ReductionKg() { return estimatedCO2ReductionKg; }
    public void setEstimatedCO2ReductionKg(Double estimatedCO2ReductionKg) { this.estimatedCO2ReductionKg = estimatedCO2ReductionKg; }
    public Double getEquivalentTreesPlanted() { return equivalentTreesPlanted; }
    public void setEquivalentTreesPlanted(Double equivalentTreesPlanted) { this.equivalentTreesPlanted = equivalentTreesPlanted; }
    public Double getEquivalentEnergySavedKwh() { return equivalentEnergySavedKwh; }
    public void setEquivalentEnergySavedKwh(Double equivalentEnergySavedKwh) { this.equivalentEnergySavedKwh = equivalentEnergySavedKwh; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Integer bottlesRecycled; private Double plasticWeightKg;
        private Double estimatedCO2ReductionKg; private Double equivalentTreesPlanted; private Double equivalentEnergySavedKwh;
        public Builder bottlesRecycled(Integer b) { this.bottlesRecycled = b; return this; }
        public Builder plasticWeightKg(Double w) { this.plasticWeightKg = w; return this; }
        public Builder estimatedCO2ReductionKg(Double c) { this.estimatedCO2ReductionKg = c; return this; }
        public Builder equivalentTreesPlanted(Double t) { this.equivalentTreesPlanted = t; return this; }
        public Builder equivalentEnergySavedKwh(Double e) { this.equivalentEnergySavedKwh = e; return this; }
        public EnvironmentalImpactResponse build() {
            EnvironmentalImpactResponse res = new EnvironmentalImpactResponse();
            res.setBottlesRecycled(bottlesRecycled); res.setPlasticWeightKg(plasticWeightKg);
            res.setEstimatedCO2ReductionKg(estimatedCO2ReductionKg); res.setEquivalentTreesPlanted(equivalentTreesPlanted);
            res.setEquivalentEnergySavedKwh(equivalentEnergySavedKwh); return res;
        }
    }
}
