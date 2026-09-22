package com.ecoloop.repository;

import com.ecoloop.entity.EnvironmentalImpact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnvironmentalImpactRepository extends JpaRepository<EnvironmentalImpact, Long> {
    Optional<EnvironmentalImpact> findByUserId(Long userId);

    @Query("SELECT e FROM EnvironmentalImpact e ORDER BY e.bottlesRecycled DESC")
    List<EnvironmentalImpact> findLeaderboardTopUsers();

    @Query("SELECT COALESCE(SUM(e.bottlesRecycled), 0) FROM EnvironmentalImpact e")
    Long sumTotalBottles();

    @Query("SELECT COALESCE(SUM(e.plasticWeight), 0.0) FROM EnvironmentalImpact e")
    Double sumTotalPlasticWeight();

    @Query("SELECT COALESCE(SUM(e.estimatedCO2Reduction), 0.0) FROM EnvironmentalImpact e")
    Double sumTotalCO2Reduction();
}
