package com.ecoloop.service;

import com.ecoloop.dto.TransactionResponse;
import com.ecoloop.dto.WalletResponse;
import com.ecoloop.entity.User;

import java.util.List;

public interface WalletService {
    WalletResponse getWallet(String userEmail);
    List<TransactionResponse> getTransactions(String userEmail);
    void awardCreditsForPickup(User user, Long pickupId, int bottleCount);
    void deductCreditsForReward(User user, Long rewardId, int amount, String rewardName);
}
