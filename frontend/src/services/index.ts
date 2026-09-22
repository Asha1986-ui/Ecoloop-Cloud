import api from './api';
import { 
  AuthResponse, PickupRequest, BottleEstimate, PickupRoute, 
  Wallet, Transaction, Reward, RedeemResult, RedemptionHistory, 
  EnvironmentalImpact, LeaderboardEntry, AdminStatistics, 
  Citizen, Collector, NotificationItem, User, PickupStatus 
} from '../types';

export const authService = {
  login: async (email: string, password: string):Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },
  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/profile');
    return res.data.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/users/profile', data);
    return res.data.data;
  }
};

export const pickupService = {
  createPickup: async (data: any): Promise<PickupRequest> => {
    const res = await api.post('/pickups', data);
    return res.data.data;
  },
  getCitizenPickups: async (): Promise<PickupRequest[]> => {
    const res = await api.get('/pickups');
    return res.data.data;
  },
  getPickupById: async (id: number): Promise<PickupRequest> => {
    const res = await api.get(`/pickups/${id}`);
    return res.data.data;
  },
  cancelPickup: async (id: number): Promise<PickupRequest> => {
    const res = await api.put(`/pickups/${id}/cancel`);
    return res.data.data;
  }
};

export const aiService = {
  estimateBottles: async (imageFile?: File): Promise<BottleEstimate> => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const res = await api.post('/ai/bottle-estimate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  }
};

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const res = await api.get('/ecocredits/wallet');
    return res.data.data;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await api.get('/ecocredits/transactions');
    return res.data.data;
  }
};

export const rewardService = {
  getRewards: async (): Promise<Reward[]> => {
    const res = await api.get('/rewards');
    return res.data.data;
  },
  redeemReward: async (id: number): Promise<RedeemResult> => {
    const res = await api.post(`/rewards/${id}/redeem`);
    return res.data.data;
  },
  getMyRedemptions: async (): Promise<RedemptionHistory[]> => {
    const res = await api.get('/rewards/redemptions');
    return res.data.data;
  }
};

export const collectorService = {
  getAssignedPickups: async (): Promise<PickupRequest[]> => {
    const res = await api.get('/collector/pickups');
    return res.data.data;
  },
  getAvailablePickups: async (): Promise<PickupRequest[]> => {
    const res = await api.get('/collector/available-pickups');
    return res.data.data;
  },
  claimPickup: async (id: number): Promise<PickupRequest> => {
    const res = await api.post(`/collector/pickups/${id}/claim`);
    return res.data.data;
  },
  claimAllAvailable: async (): Promise<PickupRequest[]> => {
    const res = await api.post('/collector/pickups/claim-all');
    return res.data.data;
  },
  updateStatus: async (id: number, status: PickupStatus): Promise<PickupRequest> => {
    const res = await api.put(`/collector/pickups/${id}/status`, { status });
    return res.data.data;
  },
  verifyPickup: async (id: number, data: { actualBottleCount: number; actualWeight: number; verificationImage?: string; notes?: string }): Promise<PickupRequest> => {
    const res = await api.post(`/collector/pickups/${id}/verify`, data);
    return res.data.data;
  },
  getTodayRoute: async (): Promise<PickupRoute[]> => {
    const res = await api.get('/collector/route');
    return res.data.data;
  }
};

export const impactService = {
  getUserImpact: async (): Promise<EnvironmentalImpact> => {
    const res = await api.get('/impact');
    return res.data.data;
  },
  getGlobalImpact: async (): Promise<EnvironmentalImpact> => {
    const res = await api.get('/impact/global');
    return res.data.data;
  },
  getLeaderboard: async (timeframe: string = 'overall'): Promise<LeaderboardEntry[]> => {
    const res = await api.get(`/leaderboard?timeframe=${timeframe}`);
    return res.data.data;
  }
};

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await api.get('/notifications');
    return res.data.data;
  },
  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  }
};

export const adminService = {
  getStatistics: async (): Promise<AdminStatistics> => {
    const res = await api.get('/admin/statistics');
    return res.data.data;
  },
  getCitizens: async (): Promise<Citizen[]> => {
    const res = await api.get('/admin/citizens');
    return res.data.data;
  },
  getCollectors: async (): Promise<Collector[]> => {
    const res = await api.get('/admin/collectors');
    return res.data.data;
  },
  createCollector: async (data: any): Promise<Collector> => {
    const res = await api.post('/admin/collectors', data);
    return res.data.data;
  },
  toggleUserStatus: async (id: number): Promise<void> => {
    await api.put(`/admin/users/${id}/toggle-status`);
  },
  getAllPickups: async (status?: string): Promise<PickupRequest[]> => {
    const url = status ? `/admin/pickups?status=${status}` : '/admin/pickups';
    const res = await api.get(url);
    return res.data.data;
  },
  assignCollector: async (pickupId: number, collectorId: number): Promise<PickupRequest> => {
    const res = await api.post(`/admin/pickups/${pickupId}/assign`, { collectorId });
    return res.data.data;
  },
  createReward: async (data: any): Promise<Reward> => {
    const res = await api.post('/admin/rewards', data);
    return res.data.data;
  },
  updateReward: async (id: number, data: any): Promise<Reward> => {
    const res = await api.put(`/admin/rewards/${id}`, data);
    return res.data.data;
  },
  deleteReward: async (id: number): Promise<void> => {
    await api.delete(`/admin/rewards/${id}`);
  }
};
