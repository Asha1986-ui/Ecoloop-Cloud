package com.ecoloop.service.impl;

import com.ecoloop.dto.CreatePickupRequest;
import com.ecoloop.dto.PickupResponse;
import com.ecoloop.entity.PickupRequest;
import com.ecoloop.entity.PickupStatus;
import com.ecoloop.entity.Role;
import com.ecoloop.entity.User;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.PickupRequestRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.NotificationService;
import com.ecoloop.service.PickupService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupServiceImpl implements PickupService {

    private final PickupRequestRepository pickupRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PickupServiceImpl(PickupRequestRepository pickupRequestRepository, UserRepository userRepository, NotificationService notificationService) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Value("${ecoloop.credits.rate-per-bottle:5}")
    private int ratePerBottle;

    @Override
    @Transactional
    public PickupResponse createPickup(String userEmail, CreatePickupRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PickupRequest pickup = PickupRequest.builder()
                .user(user)
                .address(request.getAddress())
                .city(request.getCity())
                .pickupDate(request.getPickupDate())
                .timeSlot(request.getTimeSlot())
                .estimatedBottleCount(request.getEstimatedBottleCount() != null ? request.getEstimatedBottleCount() : 20)
                .estimatedWeight(request.getEstimatedWeight() != null ? request.getEstimatedWeight() : 0.5)
                .aiConfidence(request.getAiConfidence() != null ? request.getAiConfidence() : 92.0)
                .notes(request.getNotes())
                .imageUrl(request.getImageUrl())
                .status(PickupStatus.REQUESTED)
                .build();

        pickup = pickupRequestRepository.save(pickup);

        notificationService.sendNotification(user,
                "Pickup Request Created 🎉",
                "Your pickup request #" + pickup.getId() + " is scheduled for " + pickup.getPickupDate() + " (" + pickup.getTimeSlot() + "). An authorized collector will be assigned shortly.",
                "PICKUP_CREATED");

        return mapToResponse(pickup);
    }

    @Override
    public List<PickupResponse> getCitizenPickups(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return pickupRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PickupResponse getPickupById(Long pickupId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (!pickup.getUser().getId().equals(user.getId()) && user.getRole() == Role.CITIZEN) {
            throw new BadRequestException("You do not have permission to view this pickup request");
        }

        return mapToResponse(pickup);
    }

    @Override
    @Transactional
    public PickupResponse cancelPickup(Long pickupId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (!pickup.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only cancel your own pickups");
        }

        if (pickup.getStatus() == PickupStatus.COLLECTED || pickup.getStatus() == PickupStatus.VERIFIED || pickup.getStatus() == PickupStatus.CREDITS_AWARDED) {
            throw new BadRequestException("Cannot cancel a pickup that has already been collected or verified");
        }

        pickup.setStatus(PickupStatus.CANCELLED);
        pickup = pickupRequestRepository.save(pickup);

        notificationService.sendNotification(user,
                "Pickup Cancelled",
                "Pickup #" + pickup.getId() + " has been cancelled.",
                "PICKUP_CANCELLED");

        return mapToResponse(pickup);
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
