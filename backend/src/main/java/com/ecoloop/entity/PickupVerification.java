package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_verifications")
public class PickupVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pickup_id", nullable = false, unique = true)
    private PickupRequest pickup;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    private User collector;
    @Column(name = "actual_bottle_count", nullable = false)
    private Integer actualBottleCount;
    @Column(name = "actual_weight", nullable = false)
    private Double actualWeight;
    @Column(name = "verification_image", length = 1000)
    private String verificationImage;
    @Column(length = 1000)
    private String notes;
    @Column(name = "verified_at", nullable = false)
    private LocalDateTime verifiedAt;

    public PickupVerification() {}

    @PrePersist
    protected void onCreate() { this.verifiedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PickupRequest getPickup() { return pickup; }
    public void setPickup(PickupRequest pickup) { this.pickup = pickup; }
    public User getCollector() { return collector; }
    public void setCollector(User collector) { this.collector = collector; }
    public Integer getActualBottleCount() { return actualBottleCount; }
    public void setActualBottleCount(Integer actualBottleCount) { this.actualBottleCount = actualBottleCount; }
    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }
    public String getVerificationImage() { return verificationImage; }
    public void setVerificationImage(String verificationImage) { this.verificationImage = verificationImage; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private PickupRequest pickup; private User collector;
        private Integer actualBottleCount; private Double actualWeight; private String verificationImage; private String notes;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder pickup(PickupRequest p) { this.pickup = p; return this; }
        public Builder collector(User c) { this.collector = c; return this; }
        public Builder actualBottleCount(Integer b) { this.actualBottleCount = b; return this; }
        public Builder actualWeight(Double w) { this.actualWeight = w; return this; }
        public Builder verificationImage(String img) { this.verificationImage = img; return this; }
        public Builder notes(String n) { this.notes = n; return this; }
        public PickupVerification build() {
            PickupVerification v = new PickupVerification();
            v.setId(id); v.setPickup(pickup); v.setCollector(collector);
            v.setActualBottleCount(actualBottleCount); v.setActualWeight(actualWeight);
            v.setVerificationImage(verificationImage); v.setNotes(notes); v.setVerifiedAt(LocalDateTime.now());
            return v;
        }
    }
}
