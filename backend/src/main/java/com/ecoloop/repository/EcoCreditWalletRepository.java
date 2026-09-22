package com.ecoloop.repository;

import com.ecoloop.entity.EcoCreditWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EcoCreditWalletRepository extends JpaRepository<EcoCreditWallet, Long> {
    Optional<EcoCreditWallet> findByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(w.totalEarned), 0) FROM EcoCreditWallet w")
    Long sumTotalCreditsIssued();

    @Query("SELECT COALESCE(SUM(w.totalRedeemed), 0) FROM EcoCreditWallet w")
    Long sumTotalCreditsRedeemed();
}
