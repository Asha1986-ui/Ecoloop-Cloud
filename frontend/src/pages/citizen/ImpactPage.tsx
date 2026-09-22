import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  TreePine, 
  Zap, 
  Wind, 
  Scale, 
  Recycle, 
  Globe, 
  User as UserIcon, 
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { impactService } from '../../services';
import { EnvironmentalImpact } from '../../types';

export const ImpactPage: React.FC = () => {
  const [userImpact, setUserImpact] = useState<EnvironmentalImpact | null>(null);
  const [globalImpact, setGlobalImpact] = useState<EnvironmentalImpact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'personal' | 'community'>('personal');

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        setLoading(true);
        const [userData, globalData] = await Promise.all([
          impactService.getUserImpact(),
          impactService.getGlobalImpact()
        ]);
        setUserImpact(userData);
        setGlobalImpact(globalData);
      } catch (err) {
        console.error('Failed to load impact metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const activeImpact = viewMode === 'personal' ? userImpact : globalImpact;

  // Mock historical data for visualizations
  const trendData = [
    { month: 'Apr', bottles: 25, co2: 2.1, energy: 4.5 },
    { month: 'May', bottles: 40, co2: 3.4, energy: 7.2 },
    { month: 'Jun', bottles: 35, co2: 2.9, energy: 6.3 },
    { month: 'Jul', bottles: 55, co2: 4.6, energy: 9.9 },
    { month: 'Aug', bottles: 70, co2: 5.9, energy: 12.6 },
    { month: 'Sep', bottles: (activeImpact?.bottlesRecycled || 90), co2: (activeImpact?.estimatedCO2ReductionKg || 7.5), energy: (activeImpact?.equivalentEnergySavedKwh || 16.2) }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Leaf className="w-3.5 h-3.5" />
              Environmental Footprint Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Real Impact, Verifiable Science
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Every PET bottle verified through EcoLoop prevents microplastic leakage, reduces carbon dioxide emissions, and offsets municipal landfill stress.
            </p>
          </div>

          {/* Toggle Button */}
          <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 self-start md:self-center">
            <button
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'personal'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              My Impact
            </button>
            <button
              onClick={() => setViewMode('community')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'community'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              City Community
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plastic Diverted</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {loading ? '...' : (activeImpact?.plasticWeightKg?.toFixed(2) || '0.00')}
            </span>
            <span className="text-sm font-semibold text-gray-500">kg</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ≈ {loading ? '...' : activeImpact?.bottlesRecycled || 0} PET bottles kept off beaches
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">CO₂ Abatement</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {loading ? '...' : (activeImpact?.estimatedCO2ReductionKg?.toFixed(2) || '0.00')}
            </span>
            <span className="text-sm font-semibold text-gray-500">kg CO₂e</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Eliminated through circular PET re-polymerization
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tree Absorption Eq.</span>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {loading ? '...' : (activeImpact?.equivalentTreesPlanted?.toFixed(2) || '0.00')}
            </span>
            <span className="text-sm font-semibold text-gray-500">trees</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Equivalent annual carbon sequestration
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Energy Conserved</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {loading ? '...' : (activeImpact?.equivalentEnergySavedKwh?.toFixed(2) || '0.00')}
            </span>
            <span className="text-sm font-semibold text-gray-500">kWh</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Power saved vs. virgin crude oil plastic synthesis
          </p>
        </div>
      </div>

      {/* Visual Equivalencies Showcase */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">What Your Contribution Achieves</h2>
          <p className="text-sm text-gray-500">Translating abstract kilograms into daily ecological equivalencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Household LED Lighting</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Enough electrical energy saved to power a 10W standard household LED bulb continuously for{' '}
                <span className="font-bold text-emerald-700">
                  {Math.round((activeImpact?.equivalentEnergySavedKwh || 1) * 100)} hours
                </span>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Clean Commuting Offset</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Equivalent to removing a standard gasoline passenger vehicle off city roads for{' '}
                <span className="font-bold text-blue-700">
                  {Math.round((activeImpact?.estimatedCO2ReductionKg || 1) * 4.2)} km
                </span>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/20">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Ocean Bound Plastic Prevention</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                100% of your verified plastic batches are routed directly to certified closed-loop reprocessors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Monthly Bottles Recycled</h3>
              <p className="text-xs text-gray-500">Volume tracking across consecutive months</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              PET Units
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Bar dataKey="bottles" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Cumulative CO₂ Reduction Curve</h3>
              <p className="text-xs text-gray-500">Avoided carbon emissions trajectory (kg CO₂e)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg">
              Emissions
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Area type="monotone" dataKey="co2" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImpactPage;
