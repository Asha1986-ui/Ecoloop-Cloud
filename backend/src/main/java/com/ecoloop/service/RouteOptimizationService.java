package com.ecoloop.service;

import com.ecoloop.dto.PickupRouteDto;
import java.time.LocalDate;
import java.util.List;

public interface RouteOptimizationService {
    List<PickupRouteDto> getOptimizedRouteForCollector(Long collectorId, LocalDate date);
}
