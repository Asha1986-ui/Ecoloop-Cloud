package com.ecoloop.service.impl;

import com.ecoloop.dto.RedeemRewardResponse;
import com.ecoloop.dto.RedemptionHistoryResponse;
import com.ecoloop.dto.RewardResponse;
import com.ecoloop.entity.RedemptionStatus;
import com.ecoloop.entity.Reward;
import com.ecoloop.entity.RewardRedemption;
import com.ecoloop.entity.User;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.RewardRedemptionRepository;
import com.ecoloop.repository.RewardRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.NotificationService;
import com.ecoloop.service.RewardService;
import com.ecoloop.service.WalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RewardServiceImpl implements RewardService {

    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public RewardServiceImpl(RewardRepository rewardRepository, RewardRedemptionRepository redemptionRepository, UserRepository userRepository, WalletService walletService, NotificationService notificationService) {
        this.rewardRepository = rewardRepository;
        this.redemptionRepository = redemptionRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    @Override
    public List<RewardResponse> getActiveRewards() {
        return rewardRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RedeemRewardResponse redeemReward(String userEmail, Long rewardId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with ID: " + rewardId));

        if (!reward.isAvailable()) {
            throw new BadRequestException("This reward is currently out of stock or unavailable");
        }

        if (reward.getExpiryDate() != null && reward.getExpiryDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("This reward has expired");
        }

        if (reward.getStockCount() != null && reward.getStockCount() <= 0) {
            throw new BadRequestException("Reward is out of stock");
        }

        walletService.deductCreditsForReward(user, reward.getId(), reward.getCreditsRequired(), reward.getName());

        if (reward.getStockCount() != null) {
            reward.setStockCount(reward.getStockCount() - 1);
            if (reward.getStockCount() == 0) {
                reward.setAvailable(false);
            }
            rewardRepository.save(reward);
        }

        String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        String code = "ECO-" + reward.getCategory().name().substring(0, Math.min(3, reward.getCategory().name().length())) + "-" + randomSuffix;

        RewardRedemption redemption = RewardRedemption.builder()
                .user(user)
                .reward(reward)
                .creditsUsed(reward.getCreditsRequired())
                .redemptionCode(code)
                .status(RedemptionStatus.ACTIVE)
                .build();

        redemption = redemptionRepository.save(redemption);

        notificationService.sendNotification(user,
                "Reward Redeemed Successfully 🎟️",
                "You redeemed '" + reward.getName() + "'. Voucher code: " + code + ". Show this at partner counter.",
                "REWARD_REDEEMED");

        return RedeemRewardResponse.builder()
                .redemptionId(redemption.getId())
                .rewardId(reward.getId())
                .rewardName(reward.getName())
                .creditsUsed(reward.getCreditsRequired())
                .redemptionCode(code)
                .status(redemption.getStatus())
                .redeemedAt(redemption.getRedeemedAt())
                .instructions("Present code " + code + " at " + reward.getProvider() + " checkout or enter during bill payment to apply discount.")
                .build();
    }

    @Override
    public List<RedemptionHistoryResponse> getMyRedemptions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return redemptionRepository.findByUserIdOrderByRedeemedAtDesc(user.getId())
                .stream()
                .map(r -> RedemptionHistoryResponse.builder()
                        .id(r.getId())
                        .rewardName(r.getReward().getName())
                        .category(r.getReward().getCategory().name())
                        .creditsUsed(r.getCreditsUsed())
                        .redemptionCode(r.getRedemptionCode())
                        .status(r.getStatus().name())
                        .redeemedAt(r.getRedeemedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private RewardResponse mapToResponse(Reward r) {
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
