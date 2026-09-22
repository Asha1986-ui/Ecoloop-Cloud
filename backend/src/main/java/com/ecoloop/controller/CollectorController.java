package com.ecoloop.controller;

import com.ecoloop.dto.*;
import com.ecoloop.service.CollectorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collector")
@PreAuthorize("hasRole('COLLECTOR')")
public class CollectorController {

    private final CollectorService collectorService;

    public CollectorController(CollectorService collectorService) {
        this.collectorService = collectorService;
    }

    @GetMapping("/pickups")
    public ResponseEntity<ApiResponse<List<PickupResponse>>> getAssignedPickups(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupResponse> pickups = collectorService.getAssignedPickups(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Assigned pickups retrieved", pickups));
    }

    @GetMapping("/available-pickups")
    public ResponseEntity<ApiResponse<List<PickupResponse>>> getAvailablePickups(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupResponse> pickups = collectorService.getAvailablePickups(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Available pickups retrieved", pickups));
    }

    @PostMapping("/pickups/{id}/claim")
    public ResponseEntity<ApiResponse<PickupResponse>> claimPickup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        PickupResponse response = collectorService.claimPickup(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Pickup claimed successfully", response));
    }

    @PostMapping("/pickups/claim-all")
    public ResponseEntity<ApiResponse<List<PickupResponse>>> claimAllAvailable(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupResponse> response = collectorService.claimAllAvailable(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All available pickups claimed successfully", response));
    }

    @PutMapping("/pickups/{id}/status")
    public ResponseEntity<ApiResponse<PickupResponse>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePickupStatusRequest request) {
        PickupResponse response = collectorService.updatePickupStatus(id, userDetails.getUsername(), request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Pickup status updated to " + request.getStatus(), response));
    }

    @PostMapping("/pickups/{id}/verify")
    public ResponseEntity<ApiResponse<PickupResponse>> verifyPickup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody PickupVerificationRequest request) {
        PickupResponse response = collectorService.verifyPickup(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Pickup Verified Successfully 🎉 EcoCredits awarded to citizen.", response));
    }

    @GetMapping("/route")
    public ResponseEntity<ApiResponse<List<PickupRouteDto>>> getTodayRoute(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PickupRouteDto> route = collectorService.getTodayRoute(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Optimized route sequence generated", route));
    }
}
