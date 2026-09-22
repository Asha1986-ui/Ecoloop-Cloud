import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services';
import { Recycle, ArrowRight, Lock, Mail, Sparkles, User, Truck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const data = await authService.login(cleanEmail, password);
      login(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        address: data.address,
        city: data.city,
      });

      showToast(`Welcome back, ${data.name}! 🌱`, 'success');

      // STRICT ROLE ROUTING
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'COLLECTOR') {
        navigate('/collector/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail.trim().toLowerCase());
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Recycle className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Eco<span className="text-emerald-600">Loop</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mt-1">Select your role or enter your credentials</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> One-Click Demo Logins
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('citizen.arun@gmail.com', 'Citizen@123')}
                className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200/80 transition-colors flex flex-col items-center gap-0.5 border border-emerald-200"
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('collector.rajesh@ecoloop.com', 'Collector@123')}
                className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-blue-100/70 text-blue-800 hover:bg-blue-200/80 transition-colors flex flex-col items-center gap-0.5 border border-blue-200"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Collector</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@ecoloop.com', 'Admin@123')}
                className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-purple-100/70 text-purple-800 hover:bg-purple-200/80 transition-colors flex flex-col items-center gap-0.5 border border-purple-200"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
              Register as Citizen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
