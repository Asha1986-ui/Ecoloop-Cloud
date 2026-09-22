package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "EcoLoop Backend API");
        health.put("version", "1.0.0");
        health.put("timestamp", LocalDateTime.now());
        health.put("cloudReady", true);
        health.put("azureDevOps", "Ready for ACR / Container Apps");
        return ResponseEntity.ok(ApiResponse.success("EcoLoop API is healthy and operational", health));
    }
}
