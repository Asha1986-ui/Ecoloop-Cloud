package com.ecoloop.service.impl;

import com.ecoloop.dto.PickupRouteDto;
import com.ecoloop.entity.PickupRequest;
import com.ecoloop.entity.PickupStatus;
import com.ecoloop.repository.PickupRequestRepository;
import com.ecoloop.service.RouteOptimizationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RouteOptimizationServiceImpl implements RouteOptimizationService {

    private final PickupRequestRepository pickupRequestRepository;

    public RouteOptimizationServiceImpl(PickupRequestRepository pickupRequestRepository) {
        this.pickupRequestRepository = pickupRequestRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupRouteDto> getOptimizedRouteForCollector(Long collectorId, LocalDate date) {
        List<PickupRequest> pickups = pickupRequestRepository.findByAssignedCollectorIdOrderByPickupDateAsc(collectorId);

        List<PickupRequest> activePickups = pickups.stream()
                .filter(p -> p.getStatus() != PickupStatus.CANCELLED)
                .sorted(Comparator.comparing(
                        PickupRequest::getTimeSlot, Comparator.nullsLast(String::compareTo)
                ).thenComparing(
                        PickupRequest::getAddress, Comparator.nullsLast(String::compareTo)
                ))
                .toList();

        List<PickupRouteDto> route = new ArrayList<>();
        double currentDistance = 1.2;
        int currentTravelTime = 6;
        int stop = 1;

        for (PickupRequest p : activePickups) {
            String priority = (p.getEstimatedBottleCount() != null && p.getEstimatedBottleCount() > 30) ? "HIGH" : "NORMAL";
            route.add(PickupRouteDto.builder()
                    .stopNumber(stop++)
                    .pickupId(p.getId())
                    .citizenName(p.getUser().getName())
                    .citizenPhone(p.getUser().getPhone() != null ? p.getUser().getPhone() : "N/A")
                    .address(p.getAddress())
                    .city(p.getCity())
                    .timeSlot(p.getTimeSlot())
                    .estimatedBottles(p.getEstimatedBottleCount())
                    .status(p.getStatus())
                    .priority(priority)
                    .estimatedDistanceKm(Math.round(currentDistance * 10.0) / 10.0)
                    .estimatedTravelTimeMinutes(currentTravelTime)
                    .build());

            currentDistance += 1.4 + (stop * 0.3);
            currentTravelTime += 8;
        }

        return route;
    }
}
