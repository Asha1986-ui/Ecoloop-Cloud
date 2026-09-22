import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  Package, 
  Coins, 
  Gift, 
  Wind, 
  Scale, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { adminService } from '../../services';
import { AdminStatistics } from '../../types';
import StatCard from '../../components/common/StatCard';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Visual trend datasets
  const monthlyTrends = [
    { month: 'Apr', collections: 120, credits: 600, weightKg: 18 },
    { month: 'May', collections: 240, credits: 1200, weightKg: 36 },
    { month: 'Jun', collections: 380, credits: 1900, weightKg: 57 },
    { month: 'Jul', collections: 510, credits: 2550, weightKg: 76.5 },
    { month: 'Aug', collections: 690, credits: 3450, weightKg: 103.5 },
    { month: 'Sep', collections: stats?.totalBottlesCollected || 850, credits: stats?.totalEcoCreditsIssued || 4250, weightKg: stats?.totalPlasticCollectedKg || 127.5 }
  ];

  const pickupDistribution = [
    { name: 'Completed', value: stats?.completedPickups || 8, color: '#10b981' },
    { name: 'In Progress', value: Math.max(0, (stats?.totalPickups || 10) - (stats?.completedPickups || 8)), color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Municipal Governance Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              EcoLoop Command Console
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Citywide oversight of residential plastic collection, automated AI verification audits, collector fleet dispatches, and EcoCredit redemptions.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/pickups"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Assign Pickups
            </Link>
            <Link
              to="/admin/collectors"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all"
            >
              Add Collector
            </Link>
            <Link
              to="/admin/rewards"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all"
            >
              Manage Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Registered Citizens"
          value={loading ? '...' : (stats?.totalCitizens || 0).toLocaleString()}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Field Collectors"
          value={loading ? '...' : (stats?.totalCollectors || 0).toLocaleString()}
          icon={Truck}
          color="teal"
        />
        <StatCard
          title="Total Pickups Fulfilled"
          value={loading ? '...' : `${stats?.completedPickups || 0} / ${stats?.totalPickups || 0}`}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Bottles Diverted"
          value={loading ? '...' : (stats?.totalBottlesCollected || 0).toLocaleString()}
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">EcoCredits Issued</span>
            <p className="text-2xl font-extrabold text-gray-900">
              {loading ? '...' : (stats?.totalEcoCreditsIssued || 0).toLocaleString()}
            </p>
            <span className="text-xs text-emerald-600 font-medium">5 credits per bottle verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Vouchers Redeemed</span>
            <p className="text-2xl font-extrabold text-gray-900">
              {loading ? '...' : (stats?.totalRewardsRedeemed || 0).toLocaleString()}
            </p>
            <span className="text-xs text-purple-600 font-medium">Transit, groceries, utility discounts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">CO₂ Abated (kg)</span>
            <p className="text-2xl font-extrabold text-gray-900">
              {loading ? '...' : (stats?.totalCo2ReducedKg?.toFixed(2) || '0.00')}
            </p>
            <span className="text-xs text-teal-600 font-medium">Circularity impact ledger</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collection Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Monthly PET Collection Volume</h3>
              <p className="text-xs text-gray-500">Municipal plastic inflow over time (Units)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              Trend
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="adminColorBottles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Area type="monotone" dataKey="collections" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#adminColorBottles)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pickup Completion Ratio */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Fulfillment Ratio</h3>
            <p className="text-xs text-gray-500">Completed vs pending collection requests</p>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pickupDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pickupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">Completed ({stats?.completedPickups || 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">In Pipeline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
