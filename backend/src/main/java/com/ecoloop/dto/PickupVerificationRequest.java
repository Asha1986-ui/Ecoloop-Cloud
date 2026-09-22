package com.ecoloop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PickupVerificationRequest {
    @NotNull(message = "Actual bottle count is required")
    @Min(value = 1, message = "Bottle count must be at least 1")
    private Integer actualBottleCount;
    @NotNull(message = "Actual weight is required")
    @Min(value = 0, message = "Weight must be non-negative")
    private Double actualWeight;
    private String verificationImage;
    private String notes;

    public PickupVerificationRequest() {}
    public Integer getActualBottleCount() { return actualBottleCount; }
    public void setActualBottleCount(Integer count) { this.actualBottleCount = count; }
    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double weight) { this.actualWeight = weight; }
    public String getVerificationImage() { return verificationImage; }
    public void setVerificationImage(String image) { this.verificationImage = image; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
