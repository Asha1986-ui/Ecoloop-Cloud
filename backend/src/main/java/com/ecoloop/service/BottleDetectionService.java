package com.ecoloop.service;

import com.ecoloop.dto.BottleEstimateResponse;
import org.springframework.web.multipart.MultipartFile;

public interface BottleDetectionService {
    BottleEstimateResponse estimateBottles(MultipartFile file);
}
