package com.ecoloop.dto;

import com.ecoloop.entity.PickupStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PickupResponse {
    private Long id;
    private Long citizenId;
    private String citizenName;
    private String citizenPhone;
    private Long collectorId;
    private String collectorName;
    private String address;
    private String city;
    private LocalDate pickupDate;
    private String timeSlot;
    private Integer estimatedBottleCount;
    private Integer actualBottleCount;
    private Double estimatedWeight;
    private Double actualWeight;
    private Double aiConfidence;
    private PickupStatus status;
    private String notes;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Integer creditsAwarded;

    public PickupResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    public Long getCollectorId() { return collectorId; }
    public void setCollectorId(Long collectorId) { this.collectorId = collectorId; }
    public String getCollectorName() { return collectorName; }
    public void setCollectorName(String collectorName) { this.collectorName = collectorName; }
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
    public Integer getCreditsAwarded() { return creditsAwarded; }
    public void setCreditsAwarded(Integer creditsAwarded) { this.creditsAwarded = creditsAwarded; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Long citizenId; private String citizenName; private String citizenPhone;
        private Long collectorId; private String collectorName; private String address; private String city;
        private LocalDate pickupDate; private String timeSlot; private Integer estimatedBottleCount;
        private Integer actualBottleCount; private Double estimatedWeight; private Double actualWeight;
        private Double aiConfidence; private PickupStatus status; private String notes; private String imageUrl;
        private LocalDateTime createdAt; private LocalDateTime completedAt; private Integer creditsAwarded;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder citizenId(Long c) { this.citizenId = c; return this; }
        public Builder citizenName(String n) { this.citizenName = n; return this; }
        public Builder citizenPhone(String p) { this.citizenPhone = p; return this; }
        public Builder collectorId(Long c) { this.collectorId = c; return this; }
        public Builder collectorName(String n) { this.collectorName = n; return this; }
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
        public Builder createdAt(LocalDateTime t) { this.createdAt = t; return this; }
        public Builder completedAt(LocalDateTime t) { this.completedAt = t; return this; }
        public Builder creditsAwarded(Integer ca) { this.creditsAwarded = ca; return this; }

        public PickupResponse build() {
            PickupResponse p = new PickupResponse();
            p.setId(id); p.setCitizenId(citizenId); p.setCitizenName(citizenName); p.setCitizenPhone(citizenPhone);
            p.setCollectorId(collectorId); p.setCollectorName(collectorName); p.setAddress(address); p.setCity(city);
            p.setPickupDate(pickupDate); p.setTimeSlot(timeSlot); p.setEstimatedBottleCount(estimatedBottleCount);
            p.setActualBottleCount(actualBottleCount); p.setEstimatedWeight(estimatedWeight); p.setActualWeight(actualWeight);
            p.setAiConfidence(aiConfidence); p.setStatus(status); p.setNotes(notes); p.setImageUrl(imageUrl);
            p.setCreatedAt(createdAt); p.setCompletedAt(completedAt); p.setCreditsAwarded(creditsAwarded);
            return p;
        }
    }
}
