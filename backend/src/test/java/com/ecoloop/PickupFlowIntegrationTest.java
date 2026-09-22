package com.ecoloop;

import com.ecoloop.entity.PickupRequest;
import com.ecoloop.entity.PickupStatus;
import com.ecoloop.entity.User;
import com.ecoloop.repository.EcoCreditWalletRepository;
import com.ecoloop.repository.PickupRequestRepository;
import com.ecoloop.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class PickupFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EcoCreditWalletRepository walletRepository;

    private String loginAndGetToken(String email, String password) throws Exception {
        String loginPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").path("token").asText();
    }

    @Test
    @DisplayName("Complete End-to-End Flow: Citizen Request -> Admin Assign -> Collector Route/Verify -> Credits Awarded")
    void testCompleteCitizenToCollectorFlow() throws Exception {
        // Step 1: Login Citizen, Admin, and Collector
        String citizenToken = loginAndGetToken("citizen.arun@gmail.com", "Citizen@123");
        String adminToken = loginAndGetToken("admin@ecoloop.com", "Admin@123");
        String collectorToken = loginAndGetToken("collector.rajesh@ecoloop.com", "Collector@123");

        assertNotNull(citizenToken, "Citizen token should not be null");
        assertNotNull(adminToken, "Admin token should not be null");
        assertNotNull(collectorToken, "Collector token should not be null");

        User collectorRajesh = userRepository.findByEmail("collector.rajesh@ecoloop.com")
                .orElseThrow(() -> new AssertionError("Collector Rajesh not found"));

        // Step 2: Citizen creates a new pickup request
        String pickupPayload = String.format("{\n" +
                "  \"address\": \"42 Indiranagar 100ft Road\",\n" +
                "  \"city\": \"Bangalore\",\n" +
                "  \"pickupDate\": \"%s\",\n" +
                "  \"timeSlot\": \"09:00 - 11:00 AM\",\n" +
                "  \"estimatedBottleCount\": 30,\n" +
                "  \"estimatedWeight\": 0.75,\n" +
                "  \"aiConfidence\": 93.5,\n" +
                "  \"notes\": \"Sorted clean bottles in a bag\"\n" +
                "}", LocalDate.now().plusDays(1));

        MvcResult createResult = mockMvc.perform(post("/api/pickups")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pickupPayload))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode createResponse = objectMapper.readTree(createResult.getResponse().getContentAsString());
        long pickupId = createResponse.path("data").path("id").asLong();
        assertTrue(pickupId > 0, "Pickup ID should be greater than 0");
        assertEquals("REQUESTED", createResponse.path("data").path("status").asText());

        // Step 3: Verify pickup exists in the database
        PickupRequest dbPickup = pickupRequestRepository.findById(pickupId)
                .orElseThrow(() -> new AssertionError("Pickup not found in database"));
        assertEquals("citizen.arun@gmail.com", dbPickup.getUser().getEmail());
        assertNull(dbPickup.getAssignedCollector(), "Assigned collector must initially be null");
        assertEquals(PickupStatus.REQUESTED, dbPickup.getStatus());

        // Step 4: Admin views pickups and confirms the new request is listed
        MvcResult adminListResult = mockMvc.perform(get("/api/admin/pickups")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        String adminListJson = adminListResult.getResponse().getContentAsString();
        assertTrue(adminListJson.contains(String.valueOf(pickupId)), "Admin should see the new pickup ID");

        // Step 5: Admin assigns pickup to Collector Rajesh
        String assignPayload = String.format("{\"collectorId\": %d}", collectorRajesh.getId());
        MvcResult assignResult = mockMvc.perform(post("/api/admin/pickups/" + pickupId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(assignPayload))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode assignResponse = objectMapper.readTree(assignResult.getResponse().getContentAsString());
        assertEquals("ASSIGNED", assignResponse.path("data").path("status").asText());
        assertEquals(collectorRajesh.getId(), assignResponse.path("data").path("collectorId").asLong());

        // Step 6: Verify in Database that assigned_worker_id and status are updated
        PickupRequest assignedDbPickup = pickupRequestRepository.findById(pickupId).orElseThrow();
        assertNotNull(assignedDbPickup.getAssignedCollector(), "Assigned collector should not be null in DB");
        assertEquals(collectorRajesh.getId(), assignedDbPickup.getAssignedCollector().getId());
        assertEquals(PickupStatus.ASSIGNED, assignedDbPickup.getStatus());

        // Step 7: Collector Rajesh views his assigned pickups
        MvcResult collectorPickupsResult = mockMvc.perform(get("/api/collector/pickups")
                        .header("Authorization", "Bearer " + collectorToken))
                .andExpect(status().isOk())
                .andReturn();

        String collectorPickupsJson = collectorPickupsResult.getResponse().getContentAsString();
        assertTrue(collectorPickupsJson.contains(String.valueOf(pickupId)),
                "Assigned pickup must appear in Collector's assigned pickups list");

        // Step 8: Collector updates status to COLLECTOR_ON_THE_WAY
        String statusUpdatePayload = "{\"status\": \"COLLECTOR_ON_THE_WAY\"}";
        mockMvc.perform(put("/api/collector/pickups/" + pickupId + "/status")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(statusUpdatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COLLECTOR_ON_THE_WAY"));

        // Step 9: Collector audits and verifies pickup
        int initialWallet = walletRepository.findByUserId(dbPickup.getUser().getId()).orElseThrow().getBalance();
        String verifyPayload = "{\n" +
                "  \"actualBottleCount\": 30,\n" +
                "  \"actualWeight\": 0.75,\n" +
                "  \"notes\": \"Verified all grade 1 PET\"\n" +
                "}";

        mockMvc.perform(post("/api/collector/pickups/" + pickupId + "/verify")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(verifyPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CREDITS_AWARDED"))
                .andExpect(jsonPath("$.data.actualBottleCount").value(30))
                .andExpect(jsonPath("$.data.creditsAwarded").value(150));

        // Step 10: Verify Citizen wallet received 30 * 5 = 150 EcoCredits
        int updatedWallet = walletRepository.findByUserId(dbPickup.getUser().getId()).orElseThrow().getBalance();
        assertEquals(initialWallet + 150, updatedWallet, "Citizen wallet should have increased by 150 credits");

        // Step 11: Citizen and Admin can see the completed status
        mockMvc.perform(get("/api/pickups/" + pickupId)
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CREDITS_AWARDED"))
                .andExpect(jsonPath("$.data.actualBottleCount").value(30));
    }
}
