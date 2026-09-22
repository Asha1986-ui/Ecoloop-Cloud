package com.ecoloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ecocredit_transactions")
public class EcoCreditTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    @Column(nullable = false)
    private Integer amount;
    @Column(nullable = false)
    private String description;
    @Column(name = "pickup_id")
    private Long pickupId;
    @Column(name = "reward_id")
    private Long rewardId;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public EcoCreditTransaction() {}

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getPickupId() { return pickupId; }
    public void setPickupId(Long pickupId) { this.pickupId = pickupId; }
    public Long getRewardId() { return rewardId; }
    public void setRewardId(Long rewardId) { this.rewardId = rewardId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private TransactionType type; private Integer amount;
        private String description; private Long pickupId; private Long rewardId; private LocalDateTime createdAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder type(TransactionType type) { this.type = type; return this; }
        public Builder amount(Integer amount) { this.amount = amount; return this; }
        public Builder description(String d) { this.description = d; return this; }
        public Builder pickupId(Long p) { this.pickupId = p; return this; }
        public Builder rewardId(Long r) { this.rewardId = r; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public EcoCreditTransaction build() {
            EcoCreditTransaction t = new EcoCreditTransaction();
            t.setId(id); t.setUser(user); t.setType(type); t.setAmount(amount);
            t.setDescription(description); t.setPickupId(pickupId); t.setRewardId(rewardId);
            if (createdAt != null) t.setCreatedAt(createdAt);
            return t;
        }
    }
}
