export type Role = 'CITIZEN' | 'COLLECTOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  city?: string;
  active?: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  city?: string;
}

export type PickupStatus = 
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'COLLECTOR_ON_THE_WAY'
  | 'COLLECTED'
  | 'VERIFIED'
  | 'CREDITS_AWARDED'
  | 'CANCELLED';

export interface PickupRequest {
  id: number;
  citizenId: number;
  citizenName: string;
  citizenPhone?: string;
  collectorId?: number;
  collectorName?: string;
  address: string;
  city: string;
  pickupDate: string;
  timeSlot: string;
  estimatedBottleCount?: number;
  actualBottleCount?: number;
  estimatedWeight?: number;
  actualWeight?: number;
  aiConfidence?: number;
  status: PickupStatus;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  completedAt?: string;
  creditsAwarded?: number;
}

export interface BottleEstimate {
  estimatedBottleCount: number;
  confidencePercentage: number;
  estimatedPlasticWeightKg: number;
  detectedItems: string[];
  disclaimer: string;
}

export interface PickupRoute {
  stopNumber: number;
  pickupId: number;
  citizenName: string;
  citizenPhone?: string;
  address: string;
  city: string;
  timeSlot: string;
  estimatedBottles?: number;
  status: PickupStatus;
  priority: string;
  estimatedDistanceKm: number;
  estimatedTravelTimeMinutes: number;
}

export interface Wallet {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
}

export interface Transaction {
  id: number;
  type: 'EARNED_PICKUP' | 'REDEEMED_REWARD' | 'BONUS' | 'ADJUSTMENT';
  amount: number;
  description: string;
  pickupId?: number;
  rewardId?: number;
  createdAt: string;
}

export type RewardCategory = 'COUPON' | 'TRANSPORT' | 'UTILITY' | 'SPECIAL';

export interface Reward {
  id: number;
  name: string;
  description: string;
  category: RewardCategory;
  creditsRequired: number;
  provider: string;
  governmentApproved: boolean;
  available: boolean;
  stockCount?: number;
  imageUrl?: string;
  expiryDate?: string;
}

export interface RedeemResult {
  redemptionId: number;
  rewardId: number;
  rewardName: string;
  creditsUsed: number;
  redemptionCode: string;
  status: string;
  redeemedAt: string;
  instructions: string;
}

export interface RedemptionHistory {
  id: number;
  rewardName: string;
  category: string;
  creditsUsed: number;
  redemptionCode: string;
  status: string;
  redeemedAt: string;
}

export interface EnvironmentalImpact {
  bottlesRecycled: number;
  plasticWeightKg: number;
  estimatedCO2ReductionKg: number;
  equivalentTreesPlanted: number;
  equivalentEnergySavedKwh: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  city: string;
  bottlesRecycled: number;
  plasticWeightKg: number;
  ecoCreditsEarned: number;
  isCurrentUser: boolean;
}

export interface AdminStatistics {
  totalCitizens: number;
  activeCitizens: number;
  totalCollectors: number;
  totalPickups: number;
  completedPickups: number;
  totalBottlesCollected: number;
  totalPlasticCollectedKg: number;
  totalEcoCreditsIssued: number;
  totalRewardsRedeemed: number;
  totalCo2ReducedKg: number;
}

export interface Citizen {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  active: boolean;
  totalPickups: number;
  bottlesRecycled: number;
  ecoCredits: number;
  joinedAt?: string;
}

export interface Collector {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  active: boolean;
  completedPickupsCount: number;
  totalBottlesCollected: number;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type?: string;
  createdAt: string;
}
