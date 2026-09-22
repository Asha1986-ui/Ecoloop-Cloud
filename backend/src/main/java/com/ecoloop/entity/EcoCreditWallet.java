package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ecocredit_wallets")
public class EcoCreditWallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(nullable = false)
    private Integer balance = 0;
    @Column(name = "total_earned", nullable = false)
    private Integer totalEarned = 0;
    @Column(name = "total_redeemed", nullable = false)
    private Integer totalRedeemed = 0;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public EcoCreditWallet() {}
    public EcoCreditWallet(Long id, User user, Integer balance, Integer totalEarned, Integer totalRedeemed) {
        this.id = id; this.user = user;
        this.balance = balance != null ? balance : 0;
        this.totalEarned = totalEarned != null ? totalEarned : 0;
        this.totalRedeemed = totalRedeemed != null ? totalRedeemed : 0;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getBalance() { return balance; }
    public void setBalance(Integer balance) { this.balance = balance; }
    public Integer getTotalEarned() { return totalEarned; }
    public void setTotalEarned(Integer totalEarned) { this.totalEarned = totalEarned; }
    public Integer getTotalRedeemed() { return totalRedeemed; }
    public void setTotalRedeemed(Integer totalRedeemed) { this.totalRedeemed = totalRedeemed; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private Integer balance = 0; private Integer totalEarned = 0; private Integer totalRedeemed = 0;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder balance(Integer b) { this.balance = b; return this; }
        public Builder totalEarned(Integer e) { this.totalEarned = e; return this; }
        public Builder totalRedeemed(Integer r) { this.totalRedeemed = r; return this; }
        public EcoCreditWallet build() { return new EcoCreditWallet(id, user, balance, totalEarned, totalRedeemed); }
    }
}
