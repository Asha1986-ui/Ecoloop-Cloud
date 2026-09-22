package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.LeaderboardEntryDto;
import com.ecoloop.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getLeaderboard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "timeframe", defaultValue = "overall") String timeframe) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        List<LeaderboardEntryDto> leaderboard = leaderboardService.getLeaderboard(email, timeframe);
        return ResponseEntity.ok(ApiResponse.success("Community leaderboard retrieved", leaderboard));
    }
}
