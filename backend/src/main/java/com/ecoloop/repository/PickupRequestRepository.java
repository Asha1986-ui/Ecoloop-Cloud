package com.ecoloop.repository;

import com.ecoloop.entity.PickupRequest;
import com.ecoloop.entity.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {
    List<PickupRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<PickupRequest> findByUserIdAndStatus(Long userId, PickupStatus status);
    List<PickupRequest> findByAssignedCollectorIdOrderByPickupDateAsc(Long collectorId);
    List<PickupRequest> findByAssignedCollectorIdOrderByCreatedAtDesc(Long collectorId);
    List<PickupRequest> findByAssignedCollectorIdAndPickupDate(Long collectorId, LocalDate pickupDate);
    List<PickupRequest> findByStatusOrderByCreatedAtDesc(PickupStatus status);
    List<PickupRequest> findByStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(PickupStatus status);
    List<PickupRequest> findByCityAndStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(String city, PickupStatus status);
    List<PickupRequest> findByCityIgnoreCaseAndStatusAndAssignedCollectorIsNullOrderByCreatedAtDesc(String city, PickupStatus status);
    List<PickupRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(PickupStatus status);

    @Query("SELECT COALESCE(SUM(p.actualBottleCount), 0) FROM PickupRequest p WHERE p.status = 'VERIFIED' OR p.status = 'CREDITS_AWARDED'")
    Long sumTotalBottlesCollected();

    @Query("SELECT COALESCE(SUM(p.actualWeight), 0.0) FROM PickupRequest p WHERE p.status = 'VERIFIED' OR p.status = 'CREDITS_AWARDED'")
    Double sumTotalPlasticWeightCollected();
}
