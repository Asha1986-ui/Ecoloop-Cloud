package com.ecoloop.dto;

import com.ecoloop.entity.PickupStatus;

public class PickupRouteDto {
    private Integer stopNumber;
    private Long pickupId;
    private String citizenName;
    private String citizenPhone;
    private String address;
    private String city;
    private String timeSlot;
    private Integer estimatedBottles;
    private PickupStatus status;
    private String priority;
    private Double estimatedDistanceKm;
    private Integer estimatedTravelTimeMinutes;

    public PickupRouteDto() {}
    public Integer getStopNumber() { return stopNumber; }
    public void setStopNumber(Integer stopNumber) { this.stopNumber = stopNumber; }
    public Long getPickupId() { return pickupId; }
    public void setPickupId(Long pickupId) { this.pickupId = pickupId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public Integer getEstimatedBottles() { return estimatedBottles; }
    public void setEstimatedBottles(Integer b) { this.estimatedBottles = b; }
    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Double getEstimatedDistanceKm() { return estimatedDistanceKm; }
    public void setEstimatedDistanceKm(Double d) { this.estimatedDistanceKm = d; }
    public Integer getEstimatedTravelTimeMinutes() { return estimatedTravelTimeMinutes; }
    public void setEstimatedTravelTimeMinutes(Integer t) { this.estimatedTravelTimeMinutes = t; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Integer stopNumber; private Long pickupId; private String citizenName; private String citizenPhone;
        private String address; private String city; private String timeSlot; private Integer estimatedBottles;
        private PickupStatus status; private String priority; private Double estimatedDistanceKm; private Integer estimatedTravelTimeMinutes;
        public Builder stopNumber(Integer s) { this.stopNumber = s; return this; }
        public Builder pickupId(Long id) { this.pickupId = id; return this; }
        public Builder citizenName(String n) { this.citizenName = n; return this; }
        public Builder citizenPhone(String p) { this.citizenPhone = p; return this; }
        public Builder address(String a) { this.address = a; return this; }
        public Builder city(String c) { this.city = c; return this; }
        public Builder timeSlot(String ts) { this.timeSlot = ts; return this; }
        public Builder estimatedBottles(Integer b) { this.estimatedBottles = b; return this; }
        public Builder status(PickupStatus s) { this.status = s; return this; }
        public Builder priority(String p) { this.priority = p; return this; }
        public Builder estimatedDistanceKm(Double d) { this.estimatedDistanceKm = d; return this; }
        public Builder estimatedTravelTimeMinutes(Integer t) { this.estimatedTravelTimeMinutes = t; return this; }
        public PickupRouteDto build() {
            PickupRouteDto r = new PickupRouteDto();
            r.setStopNumber(stopNumber); r.setPickupId(pickupId); r.setCitizenName(citizenName); r.setCitizenPhone(citizenPhone);
            r.setAddress(address); r.setCity(city); r.setTimeSlot(timeSlot); r.setEstimatedBottles(estimatedBottles);
            r.setStatus(status); r.setPriority(priority); r.setEstimatedDistanceKm(estimatedDistanceKm);
            r.setEstimatedTravelTimeMinutes(estimatedTravelTimeMinutes); return r;
        }
    }
}
