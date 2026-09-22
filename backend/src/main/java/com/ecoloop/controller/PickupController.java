package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.CreatePickupRequest;
import com.ecoloop.dto.PickupResponse;
import com.ecoloop.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PickupResponse>> createPickup(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePickupRequest request) {
        PickupResponse response = pickupService.createPickup(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pickup request created successfully 🎉", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PickupResponse>>> getCitizenPickups(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupResponse> list = pickupService.getCitizenPickups(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Pickups fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PickupResponse>> getPickupById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        PickupResponse response = pickupService.getPickupById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Pickup details fetched", response));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<PickupResponse>> cancelPickup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        PickupResponse response = pickupService.cancelPickup(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Pickup cancelled successfully", response));
    }
}
