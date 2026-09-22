package com.ecoloop.repository;

import com.ecoloop.entity.RewardRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    List<RewardRedemption> findByUserIdOrderByRedeemedAtDesc(Long userId);
    Optional<RewardRedemption> findByRedemptionCode(String redemptionCode);
    long count();
}
