package com.ecoloop.dto;

import java.time.LocalDateTime;

public class RedemptionHistoryResponse {
    private Long id;
    private String rewardName;
    private String category;
    private Integer creditsUsed;
    private String redemptionCode;
    private String status;
    private LocalDateTime redeemedAt;

    public RedemptionHistoryResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getCreditsUsed() { return creditsUsed; }
    public void setCreditsUsed(Integer creditsUsed) { this.creditsUsed = creditsUsed; }
    public String getRedemptionCode() { return redemptionCode; }
    public void setRedemptionCode(String redemptionCode) { this.redemptionCode = redemptionCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String rewardName; private String category;
        private Integer creditsUsed; private String redemptionCode; private String status; private LocalDateTime redeemedAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder rewardName(String n) { this.rewardName = n; return this; }
        public Builder category(String c) { this.category = c; return this; }
        public Builder creditsUsed(Integer c) { this.creditsUsed = c; return this; }
        public Builder redemptionCode(String code) { this.redemptionCode = code; return this; }
        public Builder status(String s) { this.status = s; return this; }
        public Builder redeemedAt(LocalDateTime t) { this.redeemedAt = t; return this; }
        public RedemptionHistoryResponse build() {
            RedemptionHistoryResponse r = new RedemptionHistoryResponse();
            r.setId(id); r.setRewardName(rewardName); r.setCategory(category); r.setCreditsUsed(creditsUsed);
            r.setRedemptionCode(redemptionCode); r.setStatus(status); r.setRedeemedAt(redeemedAt); return r;
        }
    }
}
