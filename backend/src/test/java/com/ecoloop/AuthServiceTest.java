package com.ecoloop;

import com.ecoloop.dto.AuthResponse;
import com.ecoloop.dto.RegisterRequest;
import com.ecoloop.entity.Role;
import com.ecoloop.exception.BadRequestException;
import com.ecoloop.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void testCitizenRegistrationSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Kavita Rao");
        request.setEmail("kavita.rao" + System.currentTimeMillis() + "@gmail.com");
        request.setPassword("Secret@123");
        request.setPhone("+91 98765 43210");
        request.setAddress("45 Lake View Road");
        request.setCity("Bangalore");

        AuthResponse response = authService.registerCitizen(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(Role.CITIZEN, response.getRole());
        assertEquals("Kavita Rao", response.getName());
    }

    @Test
    void testDuplicateEmailRegistrationThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Duplicate User");
        request.setEmail("admin@ecoloop.com");
        request.setPassword("Password@123");

        assertThrows(BadRequestException.class, () -> {
            authService.registerCitizen(request);
        });
    }
}