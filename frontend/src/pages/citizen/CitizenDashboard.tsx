import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { pickupService, walletService, impactService } from '../../services';
import { PickupRequest, Wallet, EnvironmentalImpact, Transaction } from '../../types';
import { 
  Recycle, Coins, Leaf, PackageCheck, PlusCircle, 
  TrendingUp, Calendar, MapPin, Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    pickupService.getCitizenPickups().then(setPickups).catch(() => {});
    walletService.getWallet().then(setWallet).catch(() => {});
    impactService.getUserImpact().then(setImpact).catch(() => {});
    walletService.getTransactions().then((t) => setTransactions(t.slice(0, 4))).catch(() => {});
  }, []);

  const recentPickup = pickups.length > 0 ? pickups[0] : null;

  const chartData = [
    { month: 'May', bottles: 18 },
    { month: 'Jun', bottles: 26 },
    { month: 'Jul', bottles: 34 },
    { month: 'Aug', bottles: 48 },
    { month: 'Sep', bottles: impact ? impact.bottlesRecycled : 72 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/60 text-emerald-100 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Citizen Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name || 'Arun'} 🌱
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Every bottle you recycle makes a difference. Track your environmental contribution and redeem verified rewards.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/citizen/request-pickup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Request Doorstep Pickup</span>
            </Link>
            <Link
              to="/citizen/rewards"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/70 hover:bg-emerald-600 text-white font-semibold text-sm border border-emerald-500/50 transition-colors"
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Recycle className="w-96 h-96 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Bottles Recycled" value={impact?.bottlesRecycled ?? 0} subtitle="All-time bottles" icon={Recycle} color="emerald" />
        <StatCard title="Plastic Diverted" value={`${impact?.plasticWeightKg ?? 0} kg`} subtitle="Clean recycled plastic" icon={Leaf} color="teal" />
        <StatCard title="EcoCredits Balance" value={wallet?.balance ?? 0} subtitle={`Earned: ${wallet?.totalEarned ?? 0}`} icon={Coins} color="amber" />
        <StatCard title="Successful Pickups" value={pickups.filter(p => p.status === 'VERIFIED' || p.status === 'CREDITS_AWARDED').length} subtitle={`${pickups.length} scheduled`} icon={PackageCheck} color="blue" />
        <StatCard title="CO₂ Reduction" value={`${impact?.estimatedCO2ReductionKg ?? 0} kg`} subtitle="Greenhouse gas saved" icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Recent Pickup</h2>
              <Link to="/citizen/my-pickups" className="text-xs font-semibold text-emerald-600 hover:underline">View All</Link>
            </div>

            {recentPickup ? (
              <div className="mt-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">#{recentPickup.id}</span>
                    <h3 className="font-bold text-slate-800 text-sm">{recentPickup.timeSlot}</h3>
                  </div>
                  <StatusBadge status={recentPickup.status} />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>{recentPickup.pickupDate}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{recentPickup.address}</span></div>
                  <div className="flex items-center gap-2"><Recycle className="w-3.5 h-3.5 text-slate-400" /><span>Est: <strong>{recentPickup.estimatedBottleCount} bottles</strong> (~{recentPickup.estimatedWeight} kg)</span></div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">No pickups yet 🌱</div>
            )}
          </div>
          <Link to="/citizen/request-pickup" className="mt-6 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors border border-slate-200">
            + Request Another Pickup
          </Link>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recycling Activity & Growth</h2>
              <p className="text-xs text-slate-400 mt-0.5">Bottles recycled over the last months</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+42% MoM</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBottles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }} />
                <Area type="monotone" dataKey="bottles" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorBottles)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900 text-base">Recent EcoCredits Activity</h2>
          <Link to="/citizen/wallet" className="text-xs font-semibold text-emerald-600 hover:underline">View Full Ledger</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div key={t.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold text-slate-800">{t.description}</p>
                <span className="text-slate-400 text-[11px]">{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={`font-bold text-sm ${t.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.amount > 0 ? `+${t.amount}` : t.amount} Credits
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};