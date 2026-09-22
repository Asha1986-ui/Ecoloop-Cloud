package com.ecoloop.dto;

import com.ecoloop.entity.RedemptionStatus;
import java.time.LocalDateTime;

public class RedeemRewardResponse {
    private Long redemptionId;
    private Long rewardId;
    private String rewardName;
    private Integer creditsUsed;
    private String redemptionCode;
    private RedemptionStatus status;
    private LocalDateTime redeemedAt;
    private String instructions;

    public RedeemRewardResponse() {}
    public Long getRedemptionId() { return redemptionId; }
    public void setRedemptionId(Long redemptionId) { this.redemptionId = redemptionId; }
    public Long getRewardId() { return rewardId; }
    public void setRewardId(Long rewardId) { this.rewardId = rewardId; }
    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }
    public Integer getCreditsUsed() { return creditsUsed; }
    public void setCreditsUsed(Integer creditsUsed) { this.creditsUsed = creditsUsed; }
    public String getRedemptionCode() { return redemptionCode; }
    public void setRedemptionCode(String redemptionCode) { this.redemptionCode = redemptionCode; }
    public RedemptionStatus getStatus() { return status; }
    public void setStatus(RedemptionStatus status) { this.status = status; }
    public LocalDateTime getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long redemptionId; private Long rewardId; private String rewardName; private Integer creditsUsed;
        private String redemptionCode; private RedemptionStatus status; private LocalDateTime redeemedAt; private String instructions;
        public Builder redemptionId(Long r) { this.redemptionId = r; return this; }
        public Builder rewardId(Long r) { this.rewardId = r; return this; }
        public Builder rewardName(String n) { this.rewardName = n; return this; }
        public Builder creditsUsed(Integer c) { this.creditsUsed = c; return this; }
        public Builder redemptionCode(String code) { this.redemptionCode = code; return this; }
        public Builder status(RedemptionStatus s) { this.status = s; return this; }
        public Builder redeemedAt(LocalDateTime t) { this.redeemedAt = t; return this; }
        public Builder instructions(String i) { this.instructions = i; return this; }
        public RedeemRewardResponse build() {
            RedeemRewardResponse res = new RedeemRewardResponse();
            res.setRedemptionId(redemptionId); res.setRewardId(rewardId); res.setRewardName(rewardName);
            res.setCreditsUsed(creditsUsed); res.setRedemptionCode(redemptionCode); res.setStatus(status);
            res.setRedeemedAt(redeemedAt); res.setInstructions(instructions); return res;
        }
    }
}
