package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.BottleEstimateResponse;
import com.ecoloop.service.BottleDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final BottleDetectionService bottleDetectionService;

    public AiController(BottleDetectionService bottleDetectionService) {
        this.bottleDetectionService = bottleDetectionService;
    }

    @PostMapping("/bottle-estimate")
    public ResponseEntity<ApiResponse<BottleEstimateResponse>> estimateBottles(
            @RequestParam(value = "image", required = false) MultipartFile file) {
        BottleEstimateResponse estimate = bottleDetectionService.estimateBottles(file);
        return ResponseEntity.ok(ApiResponse.success("AI bottle estimation completed", estimate));
    }
}
