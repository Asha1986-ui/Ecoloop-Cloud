package com.ecoloop.dto;

public class WalletResponse {
    private Integer balance;
    private Integer totalEarned;
    private Integer totalRedeemed;

    public WalletResponse() {}
    public WalletResponse(Integer balance, Integer totalEarned, Integer totalRedeemed) {
        this.balance = balance; this.totalEarned = totalEarned; this.totalRedeemed = totalRedeemed;
    }
    public Integer getBalance() { return balance; }
    public void setBalance(Integer balance) { this.balance = balance; }
    public Integer getTotalEarned() { return totalEarned; }
    public void setTotalEarned(Integer totalEarned) { this.totalEarned = totalEarned; }
    public Integer getTotalRedeemed() { return totalRedeemed; }
    public void setTotalRedeemed(Integer totalRedeemed) { this.totalRedeemed = totalRedeemed; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Integer balance; private Integer totalEarned; private Integer totalRedeemed;
        public Builder balance(Integer b) { this.balance = b; return this; }
        public Builder totalEarned(Integer e) { this.totalEarned = e; return this; }
        public Builder totalRedeemed(Integer r) { this.totalRedeemed = r; return this; }
        public WalletResponse build() { return new WalletResponse(balance, totalEarned, totalRedeemed); }
    }
}
