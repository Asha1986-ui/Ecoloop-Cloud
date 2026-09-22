package com.ecoloop.dto;

import jakarta.validation.constraints.NotNull;

public class AssignCollectorRequest {
    @NotNull(message = "Collector ID is required")
    private Long collectorId;
    public AssignCollectorRequest() {}
    public Long getCollectorId() { return collectorId; }
    public void setCollectorId(Long collectorId) { this.collectorId = collectorId; }
}
