import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Recycle, Bell, LogOut, User, CheckCircle, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (role === 'ADMIN') return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">🏛️ Admin</span>;
    if (role === 'COLLECTOR') return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">🚛 Collector</span>;
    return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">🌱 Citizen</span>;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Eco<span className="text-emerald-600">Loop</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 tracking-wider uppercase font-medium">Smart Recycling</span>
            </div>
          </Link>

          {/* User Nav */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {getRoleBadge()}

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                      <span className="text-xs text-slate-500 font-medium">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">No notifications yet 🌱</div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-emerald-50/40' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.read ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                              )}
                              <div>
                                <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity info */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                <span className="text-xs text-slate-400 leading-tight mt-0.5">{user.city || 'Bangalore'}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 hover:border-rose-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                Join EcoLoop
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
