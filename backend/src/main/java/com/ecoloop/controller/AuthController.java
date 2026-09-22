package com.ecoloop.controller;

import com.ecoloop.dto.ApiResponse;
import com.ecoloop.dto.AuthResponse;
import com.ecoloop.dto.LoginRequest;
import com.ecoloop.dto.RegisterRequest;
import com.ecoloop.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCitizen(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerCitizen(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! Welcome to EcoLoop.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
