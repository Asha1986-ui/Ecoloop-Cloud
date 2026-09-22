package com.ecoloop.service;

import com.ecoloop.dto.LeaderboardEntryDto;
import java.util.List;

public interface LeaderboardService {
    List<LeaderboardEntryDto> getLeaderboard(String currentUserEmail, String timeframe);
}
