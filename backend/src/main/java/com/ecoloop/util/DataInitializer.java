package com.ecoloop.util;

import com.ecoloop.entity.*;
import com.ecoloop.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EcoCreditWalletRepository walletRepository;
    private final EcoCreditTransactionRepository transactionRepository;
    private final RewardRepository rewardRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final PickupVerificationRepository verificationRepository;
    private final EnvironmentalImpactRepository impactRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, EcoCreditWalletRepository walletRepository, EcoCreditTransactionRepository transactionRepository, RewardRepository rewardRepository, PickupRequestRepository pickupRequestRepository, PickupVerificationRepository verificationRepository, EnvironmentalImpactRepository impactRepository, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.rewardRepository = rewardRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.verificationRepository = verificationRepository;
        this.impactRepository = impactRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        logger.info("🌱 Seeding EcoLoop demo accounts, rewards, and initial data...");

        // 1. Admin Account
        User admin = User.builder()
                .name("Admin Govind")
                .email("admin@ecoloop.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .phone("+91 98800 11223")
                .address("Municipal City Hall, MG Road")
                .city("Bangalore")
                .role(Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        // 2. Collector Accounts
        User collector1 = User.builder()
                .name("Rajesh Kumar (Collector)")
                .email("collector.rajesh@ecoloop.com")
                .passwordHash(passwordEncoder.encode("Collector@123"))
                .phone("+91 97711 22334")
                .address("Indiranagar Ward 82 Depot")
                .city("Bangalore")
                .role(Role.COLLECTOR)
                .active(true)
                .build();
        userRepository.save(collector1);

        User collector2 = User.builder()
                .name("Priya Sharma (Collector)")
                .email("collector.priya@ecoloop.com")
                .passwordHash(passwordEncoder.encode("Collector@123"))
                .phone("+91 97722 33445")
                .address("Koramangala Ward 67 Depot")
                .city("Bangalore")
                .role(Role.COLLECTOR)
                .active(true)
                .build();
        userRepository.save(collector2);

        // 3. Citizen Arun (Demo primary user)
        User citizenArun = User.builder()
                .name("Arun Verma")
                .email("citizen.arun@gmail.com")
                .passwordHash(passwordEncoder.encode("Citizen@123"))
                .phone("+91 99440 55667")
                .address("Flat 402, Green Meadows, 12th Main, Indiranagar")
                .city("Bangalore")
                .role(Role.CITIZEN)
                .active(true)
                .build();
        citizenArun = userRepository.save(citizenArun);

        // Arun Wallet
        EcoCreditWallet arunWallet = EcoCreditWallet.builder()
                .user(citizenArun)
                .balance(350)
                .totalEarned(600)
                .totalRedeemed(250)
                .build();
        walletRepository.save(arunWallet);

        // Arun Impact (72 bottles, 1.8 kg, ~5.94 kg CO2)
        EnvironmentalImpact arunImpact = EnvironmentalImpact.builder()
                .user(citizenArun)
                .bottlesRecycled(72)
                .plasticWeight(1.8)
                .estimatedCO2Reduction(5.94)
                .build();
        impactRepository.save(arunImpact);

        // Arun Transactions
        transactionRepository.save(EcoCreditTransaction.builder()
                .user(citizenArun)
                .type(TransactionType.EARNED_PICKUP)
                .amount(200)
                .description("Earned from Pickup #1024 (40 verified bottles)")
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());

        transactionRepository.save(EcoCreditTransaction.builder()
                .user(citizenArun)
                .type(TransactionType.REDEEMED_REWARD)
                .amount(-200)
                .description("Redeemed for: Namma Metro 1-Day Pass")
                .createdAt(LocalDateTime.now().minusDays(3))
                .build());

        transactionRepository.save(EcoCreditTransaction.builder()
                .user(citizenArun)
                .type(TransactionType.EARNED_PICKUP)
                .amount(160)
                .description("Earned from Pickup #1029 (32 verified bottles)")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build());

        // 4. Citizen Sneha (Leaderboard competitor)
        User citizenSneha = User.builder()
                .name("Sneha Hegde")
                .email("citizen.sneha@gmail.com")
                .passwordHash(passwordEncoder.encode("Citizen@123"))
                .phone("+91 99112 33445")
                .address("Villa 18, Palm Meadows, Whitefield")
                .city("Bangalore")
                .role(Role.CITIZEN)
                .active(true)
                .build();
        citizenSneha = userRepository.save(citizenSneha);

        walletRepository.save(EcoCreditWallet.builder()
                .user(citizenSneha)
                .balance(550)
                .totalEarned(850)
                .totalRedeemed(300)
                .build());

        impactRepository.save(EnvironmentalImpact.builder()
                .user(citizenSneha)
                .bottlesRecycled(140)
                .plasticWeight(3.5)
                .estimatedCO2Reduction(11.55)
                .build());

        // 5. Rewards Catalog
        rewardRepository.save(Reward.builder()
                .name("₹100 Smart Supermarket Coupon")
                .description("Flat ₹100 discount on groceries and essentials at all partner stores.")
                .category(RewardCategory.COUPON)
                .creditsRequired(150)
                .provider("Smart Supermarket")
                .approved(true)
                .available(true)
                .stockCount(50)
                .expiryDate(LocalDate.now().plusMonths(6))
                .build());

        rewardRepository.save(Reward.builder()
                .name("₹250 Green Grocery Voucher")
                .description("Get ₹250 off organic vegetables and fruits online or in-store.")
                .category(RewardCategory.COUPON)
                .creditsRequired(300)
                .provider("Fresh Earth Grocers")
                .approved(true)
                .available(true)
                .stockCount(40)
                .expiryDate(LocalDate.now().plusMonths(3))
                .build());

        rewardRepository.save(Reward.builder()
                .name("Namma Metro 1-Day Eco Pass")
                .description("Unlimited daily travel on purple and green metro lines.")
                .category(RewardCategory.TRANSPORT)
                .creditsRequired(200)
                .provider("Bangalore Metro Rail (BMRCL)")
                .approved(true)
                .available(true)
                .stockCount(100)
                .expiryDate(LocalDate.now().plusMonths(12))
                .build());

        rewardRepository.save(Reward.builder()
                .name("City Express Bus 3-Day Pass")
                .description("3 consecutive days of city-wide AC & non-AC bus travel.")
                .category(RewardCategory.TRANSPORT)
                .creditsRequired(250)
                .provider("BMTC Public Transport")
                .approved(true)
                .available(true)
                .stockCount(75)
                .expiryDate(LocalDate.now().plusMonths(6))
                .build());

        rewardRepository.save(Reward.builder()
                .name("₹150 Electricity Bill Subsidy")
                .description("Direct deduction applied on your monthly municipal power utility bill.")
                .category(RewardCategory.UTILITY)
                .creditsRequired(300)
                .provider("State Electricity Supply Corp")
                .approved(true)
                .available(true)
                .stockCount(150)
                .expiryDate(LocalDate.now().plusMonths(12))
                .build());

        rewardRepository.save(Reward.builder()
                .name("₹100 Water Conservation Credit")
                .description("Discount applied directly to municipal water & sewerage utility account.")
                .category(RewardCategory.UTILITY)
                .creditsRequired(200)
                .provider("City Water Supply & Sewerage Board")
                .approved(true)
                .available(true)
                .stockCount(80)
                .expiryDate(LocalDate.now().plusMonths(6))
                .build());

        // 6. Seed Sample Pickups
        // Completed pickup for Arun
        PickupRequest p1 = PickupRequest.builder()
                .user(citizenArun)
                .assignedCollector(collector1)
                .address("Flat 402, Green Meadows, 12th Main, Indiranagar")
                .city("Bangalore")
                .pickupDate(LocalDate.now().minusDays(5))
                .timeSlot("09:00 - 11:00 AM")
                .estimatedBottleCount(35)
                .actualBottleCount(40)
                .estimatedWeight(0.88)
                .actualWeight(1.0)
                .aiConfidence(94.2)
                .status(PickupStatus.CREDITS_AWARDED)
                .notes("Bottles washed and sorted in cardboard carton")
                .completedAt(LocalDateTime.now().minusDays(5))
                .build();
        p1 = pickupRequestRepository.save(p1);

        verificationRepository.save(PickupVerification.builder()
                .pickup(p1)
                .collector(collector1)
                .actualBottleCount(40)
                .actualWeight(1.0)
                .notes("Verified all clean PET grade-1 plastic")
                .build());

        // Active Assigned pickup for Arun scheduled today!
        pickupRequestRepository.save(PickupRequest.builder()
                .user(citizenArun)
                .assignedCollector(collector1)
                .address("Flat 402, Green Meadows, 12th Main, Indiranagar")
                .city("Bangalore")
                .pickupDate(LocalDate.now())
                .timeSlot("10:00 - 12:00 PM")
                .estimatedBottleCount(28)
                .estimatedWeight(0.7)
                .aiConfidence(92.8)
                .status(PickupStatus.ASSIGNED)
                .notes("Two large blue bags at security gate")
                .build());

        // Completed pickup for Sneha
        PickupRequest p3 = PickupRequest.builder()
                .user(citizenSneha)
                .assignedCollector(collector2)
                .address("Villa 18, Palm Meadows, Whitefield")
                .city("Bangalore")
                .pickupDate(LocalDate.now().minusDays(2))
                .timeSlot("02:00 - 04:00 PM")
                .estimatedBottleCount(60)
                .actualBottleCount(60)
                .estimatedWeight(1.5)
                .actualWeight(1.5)
                .aiConfidence(95.0)
                .status(PickupStatus.CREDITS_AWARDED)
                .completedAt(LocalDateTime.now().minusDays(2))
                .build();
        pickupRequestRepository.save(p3);

        // Fresh unassigned pickup request for demonstration
        pickupRequestRepository.save(PickupRequest.builder()
                .user(citizenSneha)
                .address("Villa 18, Palm Meadows, Whitefield")
                .city("Bangalore")
                .pickupDate(LocalDate.now().plusDays(1))
                .timeSlot("04:00 - 06:00 PM")
                .estimatedBottleCount(30)
                .estimatedWeight(0.75)
                .aiConfidence(91.0)
                .status(PickupStatus.REQUESTED)
                .notes("Bottles collected during community cleanup")
                .build());

        // 7. Seed Notifications
        notificationRepository.save(Notification.builder()
                .user(citizenArun)
                .title("Welcome to EcoLoop! 🌱")
                .message("Your account is active. Earn EcoCredits with every plastic bottle you recycle!")
                .type("WELCOME")
                .read(true)
                .build());

        notificationRepository.save(Notification.builder()
                .user(citizenArun)
                .title("Pickup Scheduled 🚛")
                .message("Pickup #1031 is assigned to Collector Rajesh Kumar for today (10:00 - 12:00 PM).")
                .type("STATUS_UPDATE")
                .read(false)
                .build());

        logger.info("✅ EcoLoop initial data seeded successfully!");
    }
}
