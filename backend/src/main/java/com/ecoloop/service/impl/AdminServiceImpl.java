package com.ecoloop.service.impl;

import com.ecoloop.dto.*;
import com.ecoloop.entity.*;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.*;
import com.ecoloop.service.AdminService;
import com.ecoloop.service.NotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final EcoCreditWalletRepository walletRepository;
    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final EnvironmentalImpactRepository impactRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AdminServiceImpl(UserRepository userRepository, PickupRequestRepository pickupRequestRepository, EcoCreditWalletRepository walletRepository, RewardRepository rewardRepository, RewardRedemptionRepository redemptionRepository, EnvironmentalImpactRepository impactRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.walletRepository = walletRepository;
        this.rewardRepository = rewardRepository;
        this.redemptionRepository = redemptionRepository;
        this.impactRepository = impactRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Value("${ecoloop.credits.rate-per-bottle:5}")
    private int ratePerBottle;

    @Override
    public AdminStatisticsResponse getStatistics() {
        long totalCitizens = userRepository.countByRole(Role.CITIZEN);
        long activeCitizens = userRepository.countByActiveTrue();
        long totalCollectors = userRepository.countByRole(Role.COLLECTOR);
        long totalPickups = pickupRequestRepository.count();
        long completedPickups = pickupRequestRepository.countByStatus(PickupStatus.VERIFIED)
                + pickupRequestRepository.countByStatus(PickupStatus.CREDITS_AWARDED);

        Long bottles = pickupRequestRepository.sumTotalBottlesCollected();
        Double weight = pickupRequestRepository.sumTotalPlasticWeightCollected();
        Long creditsIssued = walletRepository.sumTotalCreditsIssued();
        Long creditsRedeemed = walletRepository.sumTotalCreditsRedeemed();
        long totalRedemptions = redemptionRepository.count();

        long bottlesCount = (bottles != null) ? bottles : 0;
        double weightKg = (weight != null) ? Math.round(weight * 100.0) / 100.0 : 0.0;
        double co2Kg = Math.round((bottlesCount * 0.0825) * 100.0) / 100.0;

        return AdminStatisticsResponse.builder()
                .totalCitizens(totalCitizens)
                .activeCitizens(activeCitizens)
                .totalCollectors(totalCollectors)
                .totalPickups(totalPickups)
                .completedPickups(completedPickups)
                .totalBottlesCollected(bottlesCount)
                .totalPlasticCollectedKg(weightKg)
                .totalEcoCreditsIssued(creditsIssued != null ? creditsIssued : 0)
                .totalRewardsRedeemed(totalRedemptions)
                .totalCo2ReducedKg(co2Kg)
                .build();
    }

    @Override
    public List<CitizenDto> getAllCitizens() {
        return userRepository.findByRole(Role.CITIZEN).stream().map(c -> {
            var impact = impactRepository.findByUserId(c.getId()).orElse(null);
            var wallet = walletRepository.findByUserId(c.getId()).orElse(null);
            int pickups = pickupRequestRepository.findByUserIdOrderByCreatedAtDesc(c.getId()).size();

            return CitizenDto.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .email(c.getEmail())
                    .phone(c.getPhone())
                    .address(c.getAddress())
                    .city(c.getCity())
                    .active(c.isActive())
                    .totalPickups(pickups)
                    .bottlesRecycled(impact != null ? impact.getBottlesRecycled() : 0)
                    .ecoCredits(wallet != null ? wallet.getBalance() : 0)
                    .joinedAt(c.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<CollectorDto> getAllCollectors() {
        return userRepository.findByRole(Role.COLLECTOR).stream().map(col -> {
            var pickups = pickupRequestRepository.findByAssignedCollectorIdOrderByPickupDateAsc(col.getId());
            long completed = pickups.stream()
                    .filter(p -> p.getStatus() == PickupStatus.VERIFIED || p.getStatus() == PickupStatus.CREDITS_AWARDED)
                    .count();
            long bottles = pickups.stream()
                    .filter(p -> p.getActualBottleCount() != null)
                    .mapToLong(PickupRequest::getActualBottleCount)
                    .sum();

            return CollectorDto.builder()
                    .id(col.getId())
                    .name(col.getName())
                    .email(col.getEmail())
                    .phone(col.getPhone())
                    .city(col.getCity())
                    .active(col.isActive())
                    .completedPickupsCount(completed)
                    .totalBottlesCollected(bottles)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<PickupResponse> getAllPickups(PickupStatus statusFilter) {
        List<PickupRequest> list = (statusFilter != null)
                ? pickupRequestRepository.findByStatusOrderByCreatedAtDesc(statusFilter)
                : pickupRequestRepository.findAllByOrderByCreatedAtDesc();

        return list.stream().map(this::mapToPickupResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupResponse assignCollector(Long pickupId, Long collectorId) {
        PickupRequest pickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        User collector = userRepository.findById(collectorId)
                .orElseThrow(() -> new ResourceNotFoundException("Collector not found with ID: " + collectorId));

        if (collector.getRole() != Role.COLLECTOR) {
            throw new BadRequestException("Selected user is not an authorized collector");
        }

        pickup.setAssignedCollector(collector);
        if (pickup.getStatus() == PickupStatus.REQUESTED) {
            pickup.setStatus(PickupStatus.ASSIGNED);
        }

        pickup = pickupRequestRepository.save(pickup);

        notificationService.sendNotification(pickup.getUser(),
                "Collector Assigned 🚛",
                "Worker " + collector.getName() + " has been assigned to Pickup #" + pickup.getId() + " on " + pickup.getPickupDate(),
                "COLLECTOR_ASSIGNED");

        return mapToPickupResponse(pickup);
    }

    @Override
    @Transactional
    public CollectorDto createCollector(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User collector = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity() != null ? request.getCity() : "Bangalore")
                .role(Role.COLLECTOR)
                .active(true)
                .build();

        collector = userRepository.save(collector);

        return CollectorDto.builder()
                .id(collector.getId())
                .name(collector.getName())
                .email(collector.getEmail())
                .phone(collector.getPhone())
                .city(collector.getCity())
                .active(collector.isActive())
                .completedPickupsCount(0)
                .totalBottlesCollected(0)
                .build();
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public RewardResponse createReward(CreateRewardRequest request) {
        Reward reward = Reward.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .creditsRequired(request.getCreditsRequired())
                .provider(request.getProvider())
                .approved(request.isGovernmentApproved())
                .available(request.isAvailable())
                .stockCount(request.getStockCount() != null ? request.getStockCount() : 100)
                .imageUrl(request.getImageUrl())
                .expiryDate(request.getExpiryDate())
                .build();

        reward = rewardRepository.save(reward);

        return mapToRewardResponse(reward);
    }

    @Override
    @Transactional
    public RewardResponse updateReward(Long rewardId, CreateRewardRequest request) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found"));

        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setCategory(request.getCategory());
        reward.setCreditsRequired(request.getCreditsRequired());
        reward.setProvider(request.getProvider());
        reward.setApproved(request.isGovernmentApproved());
        reward.setAvailable(request.isAvailable());
        reward.setStockCount(request.getStockCount());
        if (request.getImageUrl() != null) reward.setImageUrl(request.getImageUrl());
        if (request.getExpiryDate() != null) reward.setExpiryDate(request.getExpiryDate());

        reward = rewardRepository.save(reward);
        return mapToRewardResponse(reward);
    }

    @Override
    @Transactional
    public void deleteReward(Long rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found"));
        reward.setAvailable(false);
        rewardRepository.save(reward);
    }

    private PickupResponse mapToPickupResponse(PickupRequest p) {
        Integer credits = null;
        if (p.getActualBottleCount() != null && (p.getStatus() == PickupStatus.VERIFIED || p.getStatus() == PickupStatus.CREDITS_AWARDED)) {
            credits = p.getActualBottleCount() * ratePerBottle;
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
                .creditsAwarded(credits)
                .build();
    }

    private RewardResponse mapToRewardResponse(Reward r) {
        return RewardResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .category(r.getCategory())
                .creditsRequired(r.getCreditsRequired())
                .provider(r.getProvider())
                .governmentApproved(r.isApproved())
                .available(r.isAvailable())
                .stockCount(r.getStockCount())
                .imageUrl(r.getImageUrl())
                .expiryDate(r.getExpiryDate())
                .build();
    }
}
