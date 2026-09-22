package com.ecoloop.dto;

import com.ecoloop.entity.PickupStatus;
import jakarta.validation.constraints.NotNull;

public class UpdatePickupStatusRequest {
    @NotNull(message = "Status is required")
    private PickupStatus status;
    public UpdatePickupStatusRequest() {}
    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }
}
