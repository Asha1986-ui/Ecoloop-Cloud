package com.ecoloop.repository;

import com.ecoloop.entity.EcoCreditTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcoCreditTransactionRepository extends JpaRepository<EcoCreditTransaction, Long> {
    List<EcoCreditTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
