package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_redemptions")
public class RewardRedemption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;
    @Column(name = "credits_used", nullable = false)
    private Integer creditsUsed;
    @Column(name = "redemption_code", nullable = false, unique = true)
    private String redemptionCode;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RedemptionStatus status;
    @Column(name = "redeemed_at", nullable = false)
    private LocalDateTime redeemedAt;

    public RewardRedemption() {}

    @PrePersist
    protected void onCreate() {
        this.redeemedAt = LocalDateTime.now();
        if (this.status == null) this.status = RedemptionStatus.ACTIVE;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Reward getReward() { return reward; }
    public void setReward(Reward reward) { this.reward = reward; }
    public Integer getCreditsUsed() { return creditsUsed; }
    public void setCreditsUsed(Integer creditsUsed) { this.creditsUsed = creditsUsed; }
    public String getRedemptionCode() { return redemptionCode; }
    public void setRedemptionCode(String redemptionCode) { this.redemptionCode = redemptionCode; }
    public RedemptionStatus getStatus() { return status; }
    public void setStatus(RedemptionStatus status) { this.status = status; }
    public LocalDateTime getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private Reward reward; private Integer creditsUsed;
        private String redemptionCode; private RedemptionStatus status;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User u) { this.user = u; return this; }
        public Builder reward(Reward r) { this.reward = r; return this; }
        public Builder creditsUsed(Integer c) { this.creditsUsed = c; return this; }
        public Builder redemptionCode(String code) { this.redemptionCode = code; return this; }
        public Builder status(RedemptionStatus s) { this.status = s; return this; }
        public RewardRedemption build() {
            RewardRedemption r = new RewardRedemption();
            r.setId(id); r.setUser(user); r.setReward(reward); r.setCreditsUsed(creditsUsed);
            r.setRedemptionCode(redemptionCode); r.setStatus(status != null ? status : RedemptionStatus.ACTIVE);
            r.setRedeemedAt(LocalDateTime.now());
            return r;
        }
    }
}
