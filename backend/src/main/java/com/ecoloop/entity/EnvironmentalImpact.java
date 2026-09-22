package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "environmental_impacts")
public class EnvironmentalImpact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(name = "bottles_recycled", nullable = false)
    private Integer bottlesRecycled = 0;
    @Column(name = "plastic_weight", nullable = false)
    private Double plasticWeight = 0.0;
    @Column(name = "estimated_co2_reduction", nullable = false)
    private Double estimatedCO2Reduction = 0.0;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public EnvironmentalImpact() {}

    @PrePersist
    @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getBottlesRecycled() { return bottlesRecycled; }
    public void setBottlesRecycled(Integer bottlesRecycled) { this.bottlesRecycled = bottlesRecycled; }
    public Double getPlasticWeight() { return plasticWeight; }
    public void setPlasticWeight(Double plasticWeight) { this.plasticWeight = plasticWeight; }
    public Double getEstimatedCO2Reduction() { return estimatedCO2Reduction; }
    public void setEstimatedCO2Reduction(Double estimatedCO2Reduction) { this.estimatedCO2Reduction = estimatedCO2Reduction; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private Integer bottlesRecycled = 0; private Double plasticWeight = 0.0; private Double estimatedCO2Reduction = 0.0;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder bottlesRecycled(Integer b) { this.bottlesRecycled = b; return this; }
        public Builder plasticWeight(Double w) { this.plasticWeight = w; return this; }
        public Builder estimatedCO2Reduction(Double co2) { this.estimatedCO2Reduction = co2; return this; }
        public EnvironmentalImpact build() {
            EnvironmentalImpact e = new EnvironmentalImpact();
            e.setId(id); e.setUser(user);
            e.setBottlesRecycled(bottlesRecycled != null ? bottlesRecycled : 0);
            e.setPlasticWeight(plasticWeight != null ? plasticWeight : 0.0);
            e.setEstimatedCO2Reduction(estimatedCO2Reduction != null ? estimatedCO2Reduction : 0.0);
            return e;
        }
    }
}
