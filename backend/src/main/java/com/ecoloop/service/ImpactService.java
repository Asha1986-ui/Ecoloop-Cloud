package com.ecoloop.service;

import com.ecoloop.dto.EnvironmentalImpactResponse;

public interface ImpactService {
    EnvironmentalImpactResponse getUserImpact(String userEmail);
    EnvironmentalImpactResponse getGlobalImpact();
    void recordRecycledBottles(Long userId, int bottleCount, double weightKg);
}
