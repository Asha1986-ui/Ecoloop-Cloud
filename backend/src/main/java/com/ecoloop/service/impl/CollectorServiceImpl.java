package com.ecoloop.service.impl;

import com.ecoloop.dto.PickupResponse;
import com.ecoloop.dto.PickupRouteDto;
import com.ecoloop.dto.PickupVerificationRequest;
import com.ecoloop.entity.PickupRequest;
import com.ecoloop.entity.PickupStatus;
import com.ecoloop.entity.PickupVerification;
import com.ecoloop.entity.User;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.PickupRequestRepository;
import com.ecoloop.repository.PickupVerificationRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollectorServiceImpl implements CollectorService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ImpactService impactService;
    private final NotificationService notificationService;
    private final RouteOptimizationService routeOptimizationService;

    public CollectorServiceImpl(PickupRequestRepository pickupRequestRepository, PickupVerificationRepository verificationRepository, UserRepository userRepository, WalletService walletService, ImpactService impactService, NotificationService notificationService, RouteOptimizationService routeOptimizationService) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.impactService = impactService;
        this.notificationService = notificationService;
        this.routeOptimizationService = routeOptimizationService;
    }

    @Value("${ecoloop.credits.rate-per-bottle:5}")
    private int ratePerBottle;

    @Override
    @Transactional(readOnly = true)
    public List<PickupResponse> getAssignedPickups(String collectorEmail) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        return pickupRequestRepository.findByAssignedCollectorIdOrderByCreatedAtDesc(collector.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupResponse> getAvailablePickups(String collectorEmail) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        List<PickupRequest> available;
        if (collector.getCity() != null && !collector.getCity().trim().isEmpty()) {
            available = pickupRequestRepository.findByCityIgnoreCaseAndStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(
                    collector.getCity().trim(), PickupStatus.REQUESTED);
            if (available.isEmpty()) {
                available = pickupRequestRepository.findByStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(PickupStatus.REQUESTED);
            }
        } else {
            available = pickupRequestRepository.findByStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(PickupStatus.REQUESTED);
        }

        return available.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupResponse claimPickup(Long pickupId, String collectorEmail) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getAssignedCollector() != null && !pickup.getAssignedCollector().getId().equals(collector.getId())) {
            throw new BadRequestException("This pickup request has already been assigned to another collector");
        }

        pickup.setAssignedCollector(collector);
        if (pickup.getStatus() == PickupStatus.REQUESTED) {
            pickup.setStatus(PickupStatus.ASSIGNED);
        }
        pickup = pickupRequestRepository.save(pickup);

        notificationService.sendNotification(pickup.getUser(),
                "Collector Assigned 🚛",
                "Worker " + collector.getName() + " has accepted Pickup #" + pickup.getId() + " and will visit your doorstep on " + pickup.getPickupDate(),
                "COLLECTOR_ASSIGNED");

        return mapToResponse(pickup);
    }

    @Override
    @Transactional
    public List<PickupResponse> claimAllAvailable(String collectorEmail) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        List<PickupRequest> available;
        if (collector.getCity() != null && !collector.getCity().trim().isEmpty()) {
            available = pickupRequestRepository.findByCityIgnoreCaseAndStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(
                    collector.getCity().trim(), PickupStatus.REQUESTED);
            if (available.isEmpty()) {
                available = pickupRequestRepository.findByStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(PickupStatus.REQUESTED);
            }
        } else {
            available = pickupRequestRepository.findByStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(PickupStatus.REQUESTED);
        }

        for (PickupRequest p : available) {
            p.setAssignedCollector(collector);
            p.setStatus(PickupStatus.ASSIGNED);
            pickupRequestRepository.save(p);
            notificationService.sendNotification(p.getUser(),
                    "Collector Assigned 🚛",
                    "Worker " + collector.getName() + " has accepted Pickup #" + p.getId() + " and will visit your doorstep on " + p.getPickupDate(),
                    "COLLECTOR_ASSIGNED");
        }

        return available.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupResponse updatePickupStatus(Long pickupId, String collectorEmail, PickupStatus newStatus) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getAssignedCollector() == null) {
            pickup.setAssignedCollector(collector);
        }

        pickup.setStatus(newStatus);
        pickup = pickupRequestRepository.save(pickup);

        if (newStatus == PickupStatus.COLLECTOR_ON_THE_WAY) {
            notificationService.sendNotification(pickup.getUser(),
                    "Collector On The Way! 🚛",
                    "Collector " + collector.getName() + " is heading to your doorstep for Pickup #" + pickup.getId() + ".",
                    "STATUS_UPDATE");
        } else if (newStatus == PickupStatus.COLLECTED) {
            notificationService.sendNotification(pickup.getUser(),
                    "Bottles Collected 📦",
                    "Your recyclable bottles have been picked up. Verification is underway.",
                    "STATUS_UPDATE");
        }

        return mapToResponse(pickup);
    }

    @Override
    @Transactional
    public PickupResponse verifyPickup(Long pickupId, String collectorEmail, PickupVerificationRequest request) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));

        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getStatus() == PickupStatus.VERIFIED || pickup.getStatus() == PickupStatus.CREDITS_AWARDED) {
            throw new BadRequestException("This pickup has already been verified and credited!");
        }

        pickup.setActualBottleCount(request.getActualBottleCount());
        pickup.setActualWeight(request.getActualWeight());
        pickup.setStatus(PickupStatus.VERIFIED);
        pickup.setCompletedAt(LocalDateTime.now());
        if (pickup.getAssignedCollector() == null) {
            pickup.setAssignedCollector(collector);
        }

        PickupVerification verification = PickupVerification.builder()
                .pickup(pickup)
                .collector(collector)
                .actualBottleCount(request.getActualBottleCount())
                .actualWeight(request.getActualWeight())
                .verificationImage(request.getVerificationImage())
                .notes(request.getNotes())
                .build();
        verificationRepository.save(verification);

        // Core business logic: Award EcoCredits to citizen's wallet
        walletService.awardCreditsForPickup(pickup.getUser(), pickup.getId(), request.getActualBottleCount());

        // Update environmental impact
        impactService.recordRecycledBottles(pickup.getUser().getId(), request.getActualBottleCount(), request.getActualWeight());

        int earnedCredits = request.getActualBottleCount() * ratePerBottle;
        pickup.setStatus(PickupStatus.CREDITS_AWARDED);
        pickup = pickupRequestRepository.save(pickup);

        notificationService.sendNotification(pickup.getUser(),
                "Pickup Verified & EcoCredits Awarded! 🎉",
                "Successfully verified " + request.getActualBottleCount() + " bottles (" + request.getActualWeight() + " kg). +" + earnedCredits + " EcoCredits added to your wallet!",
                "CREDITS_AWARDED");

        return mapToResponse(pickup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupRouteDto> getTodayRoute(String collectorEmail) {
        User collector = userRepository.findByEmail(collectorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found"));
        return routeOptimizationService.getOptimizedRouteForCollector(collector.getId(), LocalDate.now());
    }

    private PickupResponse mapToResponse(PickupRequest p) {
        Integer creditsAwarded = null;
        if (p.getActualBottleCount() != null && (p.getStatus() == PickupStatus.VERIFIED || p.getStatus() == PickupStatus.CREDITS_AWARDED)) {
            creditsAwarded = p.getActualBottleCount() * ratePerBottle;
        }

        return PickupResponse.builder()
                .id(p.getId())
                .citizenId(p.getUser().getId())
                .citizenName(p.getUser().getName())
                .citizenPhone(p.getUser().getPhone())
                .collectorId(p.getAssignedCollector() != null ? p.getAssignedCollector().getId() : null)
                .collectorName(p.getAssignedCollector() != null ? p.getAssignedCollector().getName() : null)
                .address(p.getAddress())
                .city(p.getCity())
                .pickupDate(p.getPickupDate())
                .timeSlot(p.getTimeSlot())
                .estimatedBottleCount(p.getEstimatedBottleCount())
                .actualBottleCount(p.getActualBottleCount())
                .estimatedWeight(p.getEstimatedWeight())
                .actualWeight(p.getActualWeight())
                .aiConfidence(p.getAiConfidence())
                .status(p.getStatus())
                .notes(p.getNotes())
                .imageUrl(p.getImageUrl())
                .createdAt(p.getCreatedAt())
                .completedAt(p.getCompletedAt())
                .creditsAwarded(creditsAwarded)
                .build();
    }
}
