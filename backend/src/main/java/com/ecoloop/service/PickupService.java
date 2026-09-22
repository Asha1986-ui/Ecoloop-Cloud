package com.ecoloop.service;

import com.ecoloop.dto.CreatePickupRequest;
import com.ecoloop.dto.PickupResponse;
import java.util.List;

public interface PickupService {
    PickupResponse createPickup(String userEmail, CreatePickupRequest request);
    List<PickupResponse> getCitizenPickups(String userEmail);
    PickupResponse getPickupById(Long pickupId, String userEmail);
    PickupResponse cancelPickup(Long pickupId, String userEmail);
}
