package com.ecoloop.service;

import com.ecoloop.dto.*;
import com.ecoloop.entity.PickupStatus;

import java.util.List;

public interface AdminService {
    AdminStatisticsResponse getStatistics();
    List<CitizenDto> getAllCitizens();
    List<CollectorDto> getAllCollectors();
    List<PickupResponse> getAllPickups(PickupStatus statusFilter);
    PickupResponse assignCollector(Long pickupId, Long collectorId);
    CollectorDto createCollector(RegisterRequest request);
    void toggleUserStatus(Long userId);
    RewardResponse createReward(CreateRewardRequest request);
    RewardResponse updateReward(Long rewardId, CreateRewardRequest request);
    void deleteReward(Long rewardId);
}
