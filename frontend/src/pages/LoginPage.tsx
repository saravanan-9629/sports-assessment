import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Zap, LogIn, Sparkles, UserCheck, Shield } from 'lucide-react';
import { Badge } from '../components/Badge';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      login(res.token, res.user);
      if (res.user.role === 'COACH') navigate('/coach');
      else if (res.user.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'ATHLETE' | 'COACH' | 'ADMIN') => {
    await quickDemoLogin(role);
    if (role === 'COACH') navigate('/coach');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your sports assessment AI portal</p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <p className="text-[11px] uppercase font-bold text-amber-400 flex items-center justify-center space-x-1 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Access (One-Click)</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemo('ATHLETE')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
            >
              Athlete
            </button>
            <button
              onClick={() => handleDemo('COACH')}
              className="px-2 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition"
            >
              Coach
            </button>
            <button
              onClick={() => handleDemo('ADMIN')}
              className="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold transition"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@sportstalent.ai"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
