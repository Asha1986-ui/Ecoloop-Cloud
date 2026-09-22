package com.ecoloop.repository;

import com.ecoloop.entity.PickupVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupVerificationRepository extends JpaRepository<PickupVerification, Long> {
    Optional<PickupVerification> findByPickupId(Long pickupId);
    List<PickupVerification> findByCollectorId(Long collectorId);
}
