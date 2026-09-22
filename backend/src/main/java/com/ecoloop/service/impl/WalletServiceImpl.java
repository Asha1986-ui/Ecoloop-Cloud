package com.ecoloop.service.impl;

import com.ecoloop.dto.TransactionResponse;
import com.ecoloop.dto.WalletResponse;
import com.ecoloop.entity.EcoCreditTransaction;
import com.ecoloop.entity.EcoCreditWallet;
import com.ecoloop.entity.TransactionType;
import com.ecoloop.entity.User;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.EcoCreditTransactionRepository;
import com.ecoloop.repository.EcoCreditWalletRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.WalletService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletServiceImpl implements WalletService {

    private final EcoCreditWalletRepository walletRepository;
    private final EcoCreditTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public WalletServiceImpl(EcoCreditWalletRepository walletRepository, EcoCreditTransactionRepository transactionRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Value("${ecoloop.credits.rate-per-bottle:5}")
    private int ratePerBottle;

    @Override
    public WalletResponse getWallet(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        EcoCreditWallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> createInitialWallet(user));

        return WalletResponse.builder()
                .balance(wallet.getBalance())
                .totalEarned(wallet.getTotalEarned())
                .totalRedeemed(wallet.getTotalRedeemed())
                .build();
    }

    @Override
    public List<TransactionResponse> getTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType())
                        .amount(t.getAmount())
                        .description(t.getDescription())
                        .pickupId(t.getPickupId())
                        .rewardId(t.getRewardId())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void awardCreditsForPickup(User user, Long pickupId, int bottleCount) {
        EcoCreditWallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> createInitialWallet(user));

        int credits = bottleCount * ratePerBottle;
        wallet.setBalance(wallet.getBalance() + credits);
        wallet.setTotalEarned(wallet.getTotalEarned() + credits);
        walletRepository.save(wallet);

        EcoCreditTransaction transaction = EcoCreditTransaction.builder()
                .user(user)
                .type(TransactionType.EARNED_PICKUP)
                .amount(credits)
                .description("Earned from Pickup #" + pickupId + " (" + bottleCount + " verified plastic bottles)")
                .pickupId(pickupId)
                .build();
        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void deductCreditsForReward(User user, Long rewardId, int amount, String rewardName) {
        EcoCreditWallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> createInitialWallet(user));

        if (wallet.getBalance() < amount) {
            throw new BadRequestException("Insufficient EcoCredits! Required: " + amount + ", Available: " + wallet.getBalance());
        }

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setTotalRedeemed(wallet.getTotalRedeemed() + amount);
        walletRepository.save(wallet);

        EcoCreditTransaction transaction = EcoCreditTransaction.builder()
                .user(user)
                .type(TransactionType.REDEEMED_REWARD)
                .amount(-amount)
                .description("Redeemed for: " + rewardName)
                .rewardId(rewardId)
                .build();
        transactionRepository.save(transaction);
    }

    private EcoCreditWallet createInitialWallet(User user) {
        EcoCreditWallet wallet = EcoCreditWallet.builder()
                .user(user)
                .balance(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build();
        return walletRepository.save(wallet);
    }
}
