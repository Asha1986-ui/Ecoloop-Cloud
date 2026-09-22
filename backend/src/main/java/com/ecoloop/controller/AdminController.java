package com.ecoloop.controller;

import com.ecoloop.dto.*;
import com.ecoloop.entity.PickupStatus;
import com.ecoloop.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminStatisticsResponse>> getStatistics() {
        AdminStatisticsResponse stats = adminService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Admin statistics retrieved", stats));
    }

    @GetMapping("/citizens")
    public ResponseEntity<ApiResponse<List<CitizenDto>>> getAllCitizens() {
        List<CitizenDto> citizens = adminService.getAllCitizens();
        return ResponseEntity.ok(ApiResponse.success("Citizens list retrieved", citizens));
    }

    @GetMapping("/collectors")
    public ResponseEntity<ApiResponse<List<CollectorDto>>> getAllCollectors() {
        List<CollectorDto> collectors = adminService.getAllCollectors();
        return ResponseEntity.ok(ApiResponse.success("Collectors list retrieved", collectors));
    }

    @PostMapping("/collectors")
    public ResponseEntity<ApiResponse<CollectorDto>> createCollector(@Valid @RequestBody RegisterRequest request) {
        CollectorDto collector = adminService.createCollector(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Collector account created successfully", collector));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User active status updated", null));
    }

    @GetMapping("/pickups")
    public ResponseEntity<ApiResponse<List<PickupResponse>>> getAllPickups(
            @RequestParam(value = "status", required = false) PickupStatus status) {
        List<PickupResponse> pickups = adminService.getAllPickups(status);
        return ResponseEntity.ok(ApiResponse.success("All pickups retrieved", pickups));
    }

    @PostMapping("/pickups/{id}/assign")
    public ResponseEntity<ApiResponse<PickupResponse>> assignCollector(
            @PathVariable Long id,
            @Valid @RequestBody AssignCollectorRequest request) {
        PickupResponse response = adminService.assignCollector(id, request.getCollectorId());
        return ResponseEntity.ok(ApiResponse.success("Collector assigned successfully", response));
    }

    @PostMapping("/rewards")
    public ResponseEntity<ApiResponse<RewardResponse>> createReward(@Valid @RequestBody CreateRewardRequest request) {
        RewardResponse reward = adminService.createReward(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Reward created successfully", reward));
    }

    @PutMapping("/rewards/{id}")
    public ResponseEntity<ApiResponse<RewardResponse>> updateReward(
            @PathVariable Long id,
            @Valid @RequestBody CreateRewardRequest request) {
        RewardResponse reward = adminService.updateReward(id, request);
        return ResponseEntity.ok(ApiResponse.success("Reward updated successfully", reward));
    }

    @DeleteMapping("/rewards/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReward(@PathVariable Long id) {
        adminService.deleteReward(id);
        return ResponseEntity.ok(ApiResponse.success("Reward deactivated", null));
    }
}
