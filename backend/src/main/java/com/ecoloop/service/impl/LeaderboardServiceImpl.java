package com.ecoloop.service.impl;

import com.ecoloop.dto.LeaderboardEntryDto;
import com.ecoloop.entity.EnvironmentalImpact;
import com.ecoloop.entity.Role;
import com.ecoloop.entity.User;
import com.ecoloop.repository.EcoCreditWalletRepository;
import com.ecoloop.repository.EnvironmentalImpactRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.LeaderboardService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardServiceImpl implements LeaderboardService {

    private final EnvironmentalImpactRepository impactRepository;
    private final EcoCreditWalletRepository walletRepository;
    private final UserRepository userRepository;

    public LeaderboardServiceImpl(EnvironmentalImpactRepository impactRepository, EcoCreditWalletRepository walletRepository, UserRepository userRepository) {
        this.impactRepository = impactRepository;
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<LeaderboardEntryDto> getLeaderboard(String currentUserEmail, String timeframe) {
        List<EnvironmentalImpact> impacts = impactRepository.findLeaderboardTopUsers();
        List<LeaderboardEntryDto> entries = new ArrayList<>();

        int rank = 1;
        for (EnvironmentalImpact imp : impacts) {
            User u = imp.getUser();
            if (u.getRole() != Role.CITIZEN) {
                continue;
            }

            int credits = walletRepository.findByUserId(u.getId())
                    .map(w -> w.getTotalEarned())
                    .orElse(0);

            boolean isCurrent = currentUserEmail != null && currentUserEmail.equalsIgnoreCase(u.getEmail());

            entries.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(u.getId())
                    .name(u.getName())
                    .city(u.getCity() != null ? u.getCity() : "Bangalore")
                    .bottlesRecycled(imp.getBottlesRecycled())
                    .plasticWeightKg(Math.round(imp.getPlasticWeight() * 10.0) / 10.0)
                    .ecoCreditsEarned(credits)
                    .isCurrentUser(isCurrent)
                    .build());

            if (entries.size() >= 50) break;
        }

        return entries;
    }
}
