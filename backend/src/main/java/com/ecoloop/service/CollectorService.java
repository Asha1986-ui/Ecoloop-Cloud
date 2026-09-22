package com.ecoloop.service;

import com.ecoloop.dto.PickupResponse;
import com.ecoloop.dto.PickupRouteDto;
import com.ecoloop.dto.PickupVerificationRequest;
import com.ecoloop.entity.PickupStatus;

import java.util.List;

public interface CollectorService {
    List<PickupResponse> getAssignedPickups(String collectorEmail);
    List<PickupResponse> getAvailablePickups(String collectorEmail);
    PickupResponse claimPickup(Long pickupId, String collectorEmail);
    List<PickupResponse> claimAllAvailable(String collectorEmail);
    PickupResponse updatePickupStatus(Long pickupId, String collectorEmail, PickupStatus status);
    PickupResponse verifyPickup(Long pickupId, String collectorEmail, PickupVerificationRequest request);
    List<PickupRouteDto> getTodayRoute(String collectorEmail);
}
