package com.ecoloop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreatePickupRequest {
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "City is required")
    private String city;
    @NotNull(message = "Pickup date is required")
    private LocalDate pickupDate;
    @NotBlank(message = "Time slot is required")
    private String timeSlot;
    private Integer estimatedBottleCount;
    private Double estimatedWeight;
    private Double aiConfidence;
    private String notes;
    private String imageUrl;

    public CreatePickupRequest() {}

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
    public Double getEstimatedWeight() { return estimatedWeight; }
    public void setEstimatedWeight(Double weight) { this.estimatedWeight = weight; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double conf) { this.aiConfidence = conf; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
