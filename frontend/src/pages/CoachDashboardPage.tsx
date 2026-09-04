import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { Search, UserCheck, Filter, ArrowRight, Star, BookmarkCheck, Users } from 'lucide-react';

export const CoachDashboardPage: React.FC = () => {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const res = await api.getCoachAthletes({
          search: search || undefined,
          sport: sportFilter !== 'All' ? sportFilter : undefined
        }).catch(() => ({ athletes: [] }));

        let data = res.athletes || [];
        if (data.length === 0) {
          data = [
            {
              id: 'demo-athlete-1',
              fullName: 'Rahul Sharma',
              email: 'athlete@sportstalent.ai',
              age: 17,
              gender: 'Male',
              location: 'Mumbai, MH',
              preferredSport: 'Cricket',
              institution: 'National Cricket Academy',
              primaryPosition: 'Fast Bowling All-Rounder',
              overallScore: 84,
              performanceLevel: 'Advanced',
              shortlisted: true,
              coachRating: 5
            },
            {
              id: 'demo-athlete-2',
              fullName: 'Ananya Roy',
              email: 'ananya@sportstalent.ai',
              age: 18,
              gender: 'Female',
              location: 'Kolkata, WB',
              preferredSport: 'Football',
              institution: 'St. Xavier High School',
              primaryPosition: 'Central Midfielder',
              overallScore: 88,
              performanceLevel: 'Elite',
              shortlisted: true,
              coachRating: 5
            },
            {
              id: 'demo-athlete-3',
              fullName: 'Vikram Singh',
              email: 'vikram@sportstalent.ai',
              age: 16,
              gender: 'Male',
              location: 'Bengaluru, KA',
              preferredSport: 'Basketball',
              institution: 'Bangalore Sports Center',
              primaryPosition: 'Point Guard',
              overallScore: 76,
              performanceLevel: 'Advanced',
              shortlisted: false,
              coachRating: 4
            },
            {
              id: 'demo-athlete-4',
              fullName: 'Priya Patel',
              email: 'priya@sportstalent.ai',
              age: 19,
              gender: 'Female',
              location: 'Ahmedabad, GJ',
              preferredSport: 'Athletics',
              institution: 'Gujarat Athletics Club',
              primaryPosition: '100m Sprint Specialist',
              overallScore: 91,
              performanceLevel: 'Elite',
              shortlisted: true,
              coachRating: 5
            }
          ];
        }

        setAthletes(data);
      } catch (err) {
        console.error('Coach athletes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [search, sportFilter]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge text="Certified Scout & Coach Portal" variant="cyan" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center space-x-2">
              <UserCheck className="w-7 h-7 text-cyan-400" />
              <span>Grassroots Talent Scouting Dashboard</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Search, evaluate, and shortlist promising grassroots athletes across India</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xl font-black text-cyan-400">{athletes.filter(a => a.shortlisted).length}</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Shortlisted</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search athlete by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase">Discipline:</span>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Sports</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Athletics">Athletics</option>
            </select>
          </div>
        </div>

        {/* Athletes List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {athletes.map((athlete) => (
            <div key={athlete.id} className="glass-panel p-6 rounded-2xl border border-slate-800 relative hover:border-cyan-500/50 transition">
              {athlete.shortlisted && (
                <div className="absolute top-4 right-4">
                  <Badge text="Shortlisted" variant="amber" size="sm" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-black flex items-center justify-center text-lg shrink-0">
                  {athlete.fullName[0]}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{athlete.fullName}</h3>
                  <p className="text-xs text-slate-400">{athlete.preferredSport} • {athlete.location}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{athlete.institution} ({athlete.primaryPosition})</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Talent Score</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-cyan-400">{athlete.overallScore}</span>
                    <Badge text={athlete.performanceLevel} variant={athlete.performanceLevel === 'Elite' ? 'cyan' : 'emerald'} size="sm" />
                  </div>
                </div>

                <Link
                  to={`/coach/athlete/${athlete.id}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/10 transition"
                >
                  <span>Evaluate Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
