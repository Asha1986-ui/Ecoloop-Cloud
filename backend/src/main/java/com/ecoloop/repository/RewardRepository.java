package com.ecoloop.repository;

import com.ecoloop.entity.Reward;
import com.ecoloop.entity.RewardCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByAvailableTrue();
    List<Reward> findByCategory(RewardCategory category);
    List<Reward> findByAvailableTrueAndCategory(RewardCategory category);
}
