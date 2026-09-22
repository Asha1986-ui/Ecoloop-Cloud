package com.ecoloop.service;

import com.ecoloop.dto.RedeemRewardResponse;
import com.ecoloop.dto.RedemptionHistoryResponse;
import com.ecoloop.dto.RewardResponse;

import java.util.List;

public interface RewardService {
    List<RewardResponse> getActiveRewards();
    RedeemRewardResponse redeemReward(String userEmail, Long rewardId);
    List<RedemptionHistoryResponse> getMyRedemptions(String userEmail);
}
