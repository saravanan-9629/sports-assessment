import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Trophy, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
            isActive('/dashboard') ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          to="/assessment"
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
            isActive('/assessment') ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Assess</span>
        </Link>

        <Link
          to="/recommendations"
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
            isActive('/recommendations') ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">AI Drills</span>
        </Link>

        <Link
          to="/leaderboard"
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
            isActive('/leaderboard') ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Ranks</span>
        </Link>

        {user?.role === 'COACH' ? (
          <Link
            to="/coach"
            className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
              isActive('/coach') ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Coach</span>
          </Link>
        ) : user?.role === 'ADMIN' ? (
          <Link
            to="/admin"
            className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
              isActive('/admin') ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Admin</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
};
