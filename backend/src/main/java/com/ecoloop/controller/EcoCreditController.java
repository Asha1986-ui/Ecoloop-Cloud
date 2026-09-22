package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.TransactionResponse;
import com.ecoloop.dto.WalletResponse;
import com.ecoloop.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ecocredits")
public class EcoCreditController {

    private final WalletService walletService;

    public EcoCreditController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<WalletResponse>> getWallet(@AuthenticationPrincipal UserDetails userDetails) {
        WalletResponse wallet = walletService.getWallet(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Wallet retrieved", wallet));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        List<TransactionResponse> transactions = walletService.getTransactions(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved", transactions));
    }
}
