package com.ecoloop.service;

import com.ecoloop.dto.*;

public interface AuthService {
    AuthResponse registerCitizen(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileResponse getCurrentUserProfile(String email);
    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
}
