package com.ecoloop.service.impl;

import com.ecoloop.dto.EnvironmentalImpactResponse;
import com.ecoloop.entity.EnvironmentalImpact;
import com.ecoloop.entity.User;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.EnvironmentalImpactRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.service.ImpactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImpactServiceImpl implements ImpactService {

    private final EnvironmentalImpactRepository impactRepository;
    private final UserRepository userRepository;

    public ImpactServiceImpl(EnvironmentalImpactRepository impactRepository, UserRepository userRepository) {
        this.impactRepository = impactRepository;
        this.userRepository = userRepository;
    }

    private static final double CO2_PER_BOTTLE_KG = 0.0825;
    private static final double TREES_PER_CO2_KG = 0.045;
    private static final double ENERGY_PER_BOTTLE_KWH = 0.15;

    @Override
    public EnvironmentalImpactResponse getUserImpact(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EnvironmentalImpact impact = impactRepository.findByUserId(user.getId())
                .orElseGet(() -> createInitialImpact(user));

        double co2 = Math.round(impact.getEstimatedCO2Reduction() * 100.0) / 100.0;
        double trees = Math.round((co2 * TREES_PER_CO2_KG) * 10.0) / 10.0;
        double energy = Math.round((impact.getBottlesRecycled() * ENERGY_PER_BOTTLE_KWH) * 10.0) / 10.0;

        return EnvironmentalImpactResponse.builder()
                .bottlesRecycled(impact.getBottlesRecycled())
                .plasticWeightKg(Math.round(impact.getPlasticWeight() * 100.0) / 100.0)
                .estimatedCO2ReductionKg(co2)
                .equivalentTreesPlanted(trees)
                .equivalentEnergySavedKwh(energy)
                .build();
    }

    @Override
    public EnvironmentalImpactResponse getGlobalImpact() {
        Long totalBottles = impactRepository.sumTotalBottles();
        Double totalWeight = impactRepository.sumTotalPlasticWeight();
        Double totalCO2 = impactRepository.sumTotalCO2Reduction();

        long bottles = (totalBottles != null) ? totalBottles : 0;
        double weight = (totalWeight != null) ? Math.round(totalWeight * 100.0) / 100.0 : 0.0;
        double co2 = (totalCO2 != null) ? Math.round(totalCO2 * 100.0) / 100.0 : 0.0;
        double trees = Math.round((co2 * TREES_PER_CO2_KG) * 10.0) / 10.0;
        double energy = Math.round((bottles * ENERGY_PER_BOTTLE_KWH) * 10.0) / 10.0;

        return EnvironmentalImpactResponse.builder()
                .bottlesRecycled((int) bottles)
                .plasticWeightKg(weight)
                .estimatedCO2ReductionKg(co2)
                .equivalentTreesPlanted(trees)
                .equivalentEnergySavedKwh(energy)
                .build();
    }

    @Override
    @Transactional
    public void recordRecycledBottles(Long userId, int bottleCount, double weightKg) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EnvironmentalImpact impact = impactRepository.findByUserId(userId)
                .orElseGet(() -> createInitialImpact(user));

        double co2Reduction = bottleCount * CO2_PER_BOTTLE_KG;
        impact.setBottlesRecycled(impact.getBottlesRecycled() + bottleCount);
        impact.setPlasticWeight(impact.getPlasticWeight() + weightKg);
        impact.setEstimatedCO2Reduction(impact.getEstimatedCO2Reduction() + co2Reduction);

        impactRepository.save(impact);
    }

    private EnvironmentalImpact createInitialImpact(User user) {
        EnvironmentalImpact impact = EnvironmentalImpact.builder()
                .user(user)
                .bottlesRecycled(0)
                .plasticWeight(0.0)
                .estimatedCO2Reduction(0.0)
                .build();
        return impactRepository.save(impact);
    }
}
