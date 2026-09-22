import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { RequestPickupPage } from './pages/citizen/RequestPickupPage';
import { MyPickupsPage } from './pages/citizen/MyPickupsPage';
import { EcoCreditsWalletPage } from './pages/citizen/EcoCreditsWalletPage';
import { RewardsMarketplacePage } from './pages/citizen/RewardsMarketplacePage';
import { ImpactPage } from './pages/citizen/ImpactPage';
import { LeaderboardPage } from './pages/citizen/LeaderboardPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Collector Pages
import { CollectorDashboard } from './pages/collector/CollectorDashboard';
import { AssignedPickupsPage } from './pages/collector/AssignedPickupsPage';
import { TodaysRoutePage } from './pages/collector/TodaysRoutePage';
import { CollectorProfilePage } from './pages/collector/CollectorProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CitizenManagementPage } from './pages/admin/CitizenManagementPage';
import { CollectorManagementPage } from './pages/admin/CollectorManagementPage';
import { PickupManagementPage } from './pages/admin/PickupManagementPage';
import { RewardManagementPage } from './pages/admin/RewardManagementPage';
import { AnalyticsReportsPage } from './pages/admin/AnalyticsReportsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Citizen Routes */}
            <Route element={<ProtectedRoute requiredRole="CITIZEN" />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/request-pickup" element={<RequestPickupPage />} />
              <Route path="/citizen/my-pickups" element={<MyPickupsPage />} />
              <Route path="/citizen/wallet" element={<EcoCreditsWalletPage />} />
              <Route path="/citizen/rewards" element={<RewardsMarketplacePage />} />
              <Route path="/citizen/impact" element={<ImpactPage />} />
              <Route path="/citizen/leaderboard" element={<LeaderboardPage />} />
              <Route path="/citizen/profile" element={<ProfilePage />} />
            </Route>

            {/* Collector Routes */}
            <Route element={<ProtectedRoute requiredRole="COLLECTOR" />}>
              <Route path="/collector/dashboard" element={<CollectorDashboard />} />
              <Route path="/collector/pickups" element={<AssignedPickupsPage />} />
              <Route path="/collector/route" element={<TodaysRoutePage />} />
              <Route path="/collector/profile" element={<CollectorProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/citizens" element={<CitizenManagementPage />} />
              <Route path="/admin/collectors" element={<CollectorManagementPage />} />
              <Route path="/admin/pickups" element={<PickupManagementPage />} />
              <Route path="/admin/rewards" element={<RewardManagementPage />} />
              <Route path="/admin/analytics" element={<AnalyticsReportsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
