package com.ecoloop.dto;

import com.ecoloop.entity.TransactionType;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private Integer amount;
    private String description;
    private Long pickupId;
    private Long rewardId;
    private LocalDateTime createdAt;

    public TransactionResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
        private Long id; private TransactionType type; private Integer amount; private String description;
        private Long pickupId; private Long rewardId; private LocalDateTime createdAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder type(TransactionType t) { this.type = t; return this; }
        public Builder amount(Integer a) { this.amount = a; return this; }
        public Builder description(String d) { this.description = d; return this; }
        public Builder pickupId(Long p) { this.pickupId = p; return this; }
        public Builder rewardId(Long r) { this.rewardId = r; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public TransactionResponse build() {
            TransactionResponse r = new TransactionResponse();
            r.setId(id); r.setType(type); r.setAmount(amount); r.setDescription(description);
            r.setPickupId(pickupId); r.setRewardId(rewardId); r.setCreatedAt(createdAt);
            return r;
        }
    }
}
