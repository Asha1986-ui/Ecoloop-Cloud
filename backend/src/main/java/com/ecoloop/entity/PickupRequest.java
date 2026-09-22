package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_requests")
public class PickupRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_worker_id")
    private User assignedCollector;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private String city;
    @Column(name = "pickup_date", nullable = false)
    private LocalDate pickupDate;
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;
    @Column(name = "estimated_bottle_count")
    private Integer estimatedBottleCount;
    @Column(name = "actual_bottle_count")
    private Integer actualBottleCount;
    @Column(name = "estimated_weight")
    private Double estimatedWeight;
    @Column(name = "actual_weight")
    private Double actualWeight;
    @Column(name = "ai_confidence")
    private Double aiConfidence;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status;
    @Column(length = 1000)
    private String notes;
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public PickupRequest() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = PickupStatus.REQUESTED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public User getAssignedCollector() { return assignedCollector; }
    public void setAssignedCollector(User assignedCollector) { this.assignedCollector = assignedCollector; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public Integer getEstimatedBottleCount() { return estimatedBottleCount; }
    public void setEstimatedBottleCount(Integer count) { this.estimatedBottleCount = count; }
    public Integer getActualBottleCount() { return actualBottleCount; }
    public void setActualBottleCount(Integer count) { this.actualBottleCount = count; }
    public Double getEstimatedWeight() { return estimatedWeight; }
    public void setEstimatedWeight(Double weight) { this.estimatedWeight = weight; }
    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double weight) { this.actualWeight = weight; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double confidence) { this.aiConfidence = confidence; }
    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private User assignedCollector; private String address;
        private String city; private LocalDate pickupDate; private String timeSlot; private Integer estimatedBottleCount;
        private Integer actualBottleCount; private Double estimatedWeight; private Double actualWeight;
        private Double aiConfidence; private PickupStatus status; private String notes; private String imageUrl; private LocalDateTime completedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder assignedCollector(User c) { this.assignedCollector = c; return this; }
        public Builder address(String a) { this.address = a; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder pickupDate(LocalDate d) { this.pickupDate = d; return this; }
        public Builder timeSlot(String s) { this.timeSlot = s; return this; }
        public Builder estimatedBottleCount(Integer b) { this.estimatedBottleCount = b; return this; }
        public Builder actualBottleCount(Integer b) { this.actualBottleCount = b; return this; }
        public Builder estimatedWeight(Double w) { this.estimatedWeight = w; return this; }
        public Builder actualWeight(Double w) { this.actualWeight = w; return this; }
        public Builder aiConfidence(Double c) { this.aiConfidence = c; return this; }
        public Builder status(PickupStatus s) { this.status = s; return this; }
        public Builder notes(String n) { this.notes = n; return this; }
        public Builder imageUrl(String img) { this.imageUrl = img; return this; }
        public Builder completedAt(LocalDateTime at) { this.completedAt = at; return this; }

        public PickupRequest build() {
            PickupRequest p = new PickupRequest();
            p.setId(id); p.setUser(user); p.setAssignedCollector(assignedCollector); p.setAddress(address);
            p.setCity(city); p.setPickupDate(pickupDate); p.setTimeSlot(timeSlot); p.setEstimatedBottleCount(estimatedBottleCount);
            p.setActualBottleCount(actualBottleCount); p.setEstimatedWeight(estimatedWeight); p.setActualWeight(actualWeight);
            p.setAiConfidence(aiConfidence); p.setStatus(status != null ? status : PickupStatus.REQUESTED);
            p.setNotes(notes); p.setImageUrl(imageUrl); p.setCompletedAt(completedAt);
            return p;
        }
    }
}
