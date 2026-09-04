import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Activity, Award, User, LogOut, ShieldAlert, Users, Zap, Sparkles } from 'lucide-react';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                SportsTalent<span className="text-emerald-400">.AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/dashboard') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/assessment"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/assessment') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Assessment
            </Link>
            <Link
              to="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/history') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              History
            </Link>
            <Link
              to="/recommendations"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/recommendations') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              AI Drills
            </Link>
            <Link
              to="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/leaderboard') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Leaderboard
            </Link>

            {user?.role === 'COACH' || user?.role === 'ADMIN' ? (
              <Link
                to="/coach"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/coach') ? 'bg-slate-800 text-cyan-400' : 'text-cyan-400/90 hover:text-cyan-300'
                }`}
              >
                Coach Portal
              </Link>
            ) : null}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/admin') ? 'bg-slate-800 text-purple-400' : 'text-purple-400/90 hover:text-purple-300'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Controls & Quick Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Role: {user?.role || 'Guest'}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    Quick Role Switch
                  </div>
                  <button
                    onClick={() => {
                      quickDemoLogin('ATHLETE');
                      setShowRoleMenu(false);
                      navigate('/dashboard');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Athlete Mode</span>
                    <Badge text="Athlete" variant="emerald" size="sm" />
                  </button>
                  <button
                    onClick={() => {
                      quickDemoLogin('COACH');
                      setShowRoleMenu(false);
                      navigate('/coach');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Coach Mode</span>
                    <Badge text="Coach" variant="cyan" size="sm" />
                  </button>
                  <button
                    onClick={() => {
                      quickDemoLogin('ADMIN');
                      setShowRoleMenu(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Admin Mode</span>
                    <Badge text="Admin" variant="purple" size="sm" />
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold hover:border-emerald-400 transition"
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
