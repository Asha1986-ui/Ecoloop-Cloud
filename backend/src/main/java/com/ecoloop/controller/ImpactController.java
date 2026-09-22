package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.EnvironmentalImpactResponse;
import com.ecoloop.service.ImpactService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<EnvironmentalImpactResponse>> getUserImpact(
            @AuthenticationPrincipal UserDetails userDetails) {
        EnvironmentalImpactResponse impact = impactService.getUserImpact(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Personal impact metrics retrieved", impact));
    }

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<EnvironmentalImpactResponse>> getGlobalImpact() {
        EnvironmentalImpactResponse globalImpact = impactService.getGlobalImpact();
        return ResponseEntity.ok(ApiResponse.success("Global impact metrics retrieved", globalImpact));
    }
}
