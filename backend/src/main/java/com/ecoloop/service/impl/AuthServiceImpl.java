package com.ecoloop.service.impl;

import com.ecoloop.dto.*;
import com.ecoloop.entity.EnvironmentalImpact;
import com.ecoloop.entity.Role;
import com.ecoloop.entity.User;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.exception.ResourceNotFoundException;
import com.ecoloop.repository.EnvironmentalImpactRepository;
import com.ecoloop.repository.UserRepository;
import com.ecoloop.security.JwtTokenProvider;
import com.ecoloop.service.AuthService;
import com.ecoloop.service.NotificationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EnvironmentalImpactRepository impactRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthServiceImpl(UserRepository userRepository, EnvironmentalImpactRepository impactRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.impactRepository = impactRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public AuthResponse registerCitizen(RegisterRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("Email is already registered: " + normalizedEmail);
        }

        // Strictly CITIZEN role on public registration
        User user = User.builder()
                .name(request.getName() != null ? request.getName().trim() : "")
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .address(request.getAddress() != null ? request.getAddress().trim() : null)
                .city(request.getCity() != null && !request.getCity().isBlank() ? request.getCity().trim() : "Bangalore")
                .role(Role.CITIZEN)
                .active(true)
                .build();

        user = userRepository.save(user);

        EnvironmentalImpact impact = EnvironmentalImpact.builder()
                .user(user)
                .bottlesRecycled(0)
                .plasticWeight(0.0)
                .estimatedCO2Reduction(0.0)
                .build();
        impactRepository.save(impact);

        notificationService.sendNotification(user,
                "Welcome to EcoLoop! 🌱",
                "Your account is ready. Request your first doorstep bottle pickup to start earning EcoCredits!",
                "WELCOME");

        String token = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Account has been deactivated. Please contact platform administrators.");
        }

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .build();
    }

    @Override
    public UserProfileResponse getCurrentUserProfile(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());

        user = userRepository.save(user);

        return getCurrentUserProfile(email);
    }
}
