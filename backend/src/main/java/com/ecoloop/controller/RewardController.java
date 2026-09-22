package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.RedeemRewardResponse;
import com.ecoloop.dto.RedemptionHistoryResponse;
import com.ecoloop.dto.RewardResponse;
import com.ecoloop.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RewardResponse>>> getRewards() {
        List<RewardResponse> rewards = rewardService.getActiveRewards();
        return ResponseEntity.ok(ApiResponse.success("Active rewards catalog", rewards));
    }

    @PostMapping("/{id}/redeem")
    public ResponseEntity<ApiResponse<RedeemRewardResponse>> redeemReward(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        RedeemRewardResponse response = rewardService.redeemReward(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Reward Redeemed Successfully 🎉", response));
    }

    @GetMapping("/redemptions")
    public ResponseEntity<ApiResponse<List<RedemptionHistoryResponse>>> getMyRedemptions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<RedemptionHistoryResponse> history = rewardService.getMyRedemptions(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("My redemptions retrieved", history));
    }
}
