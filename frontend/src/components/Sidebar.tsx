import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, PlusCircle, PackageCheck, Coins, 
  Gift, Leaf, Trophy, User as UserIcon, Truck, MapPin, 
  Users, Building2, BarChart3, Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/request-pickup', label: 'Request Pickup', icon: PlusCircle },
    { to: '/citizen/my-pickups', label: 'My Pickups', icon: PackageCheck },
    { to: '/citizen/wallet', label: 'EcoCredits Wallet', icon: Coins },
    { to: '/citizen/rewards', label: 'Rewards Marketplace', icon: Gift },
    { to: '/citizen/impact', label: 'Environmental Impact', icon: Leaf },
    { to: '/citizen/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/citizen/profile', label: 'My Profile', icon: UserIcon },
  ];

  const collectorLinks = [
    { to: '/collector/dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { to: '/collector/pickups', label: 'Assigned Pickups', icon: PackageCheck },
    { to: '/collector/route', label: "Today's Optimized Route", icon: MapPin },
    { to: '/collector/profile', label: 'Collector Profile', icon: UserIcon },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/admin/citizens', label: 'Citizen Directory', icon: Users },
    { to: '/admin/collectors', label: 'Authorized Collectors', icon: Truck },
    { to: '/admin/pickups', label: 'Municipal Pickups', icon: PackageCheck },
    { to: '/admin/rewards', label: 'Manage Rewards', icon: Gift },
    { to: '/admin/analytics', label: 'Government Analytics', icon: BarChart3 },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'COLLECTOR' ? collectorLinks : citizenLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {role === 'ADMIN' ? 'Government & Platform' : role === 'COLLECTOR' ? 'Field Collection Operations' : 'Citizen Recycling Hub'}
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-sm shadow-emerald-500/5'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-1">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>EcoLoop Mission</span>
        </div>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          Every recycled bottle diverts plastic from our oceans and lowers city carbon emissions.
        </p>
      </div>
    </aside>
  );
};
