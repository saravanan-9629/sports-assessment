import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ScoreRing } from '../components/ScoreRing';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Assessment, AIRecommendation } from '../types';
import {
  Trophy,
  Activity,
  Zap,
  Target,
  Sparkles,
  Flame,
  ArrowRight,
  BarChart2,
  Calendar,
  Award
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const histRes = await api.getHistory().catch(() => ({ assessments: [] }));
        const recRes = await api.getRecommendations().catch(() => ({ recommendation: null }));

        let loadedHistory = histRes.assessments || [];
        if (loadedHistory.length === 0) {
          // Sample initial assessments for rich demo visuals
          loadedHistory = [
            {
              _id: 'asm-1',
              userId: user?.id || 'demo-athlete-1',
              sport: (user?.preferredSport as any) || 'Cricket',
              assessmentType: 'National Scouting Combine',
              metrics: { sprintTimeSec: 3.8, jumpHeightCm: 55, reactionTimeMs: 220, pushupsReps: 38, situpsReps: 45, accuracyScore: 85 },
              subScores: { speed: 82, agility: 85, endurance: 78, strength: 80, skill: 86 },
              overallScore: profile?.overallScore || 84,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'asm-0',
              userId: user?.id || 'demo-athlete-1',
              sport: (user?.preferredSport as any) || 'Cricket',
              assessmentType: 'Baseline Fitness Assessment',
              metrics: { sprintTimeSec: 4.1, jumpHeightCm: 48, reactionTimeMs: 250, pushupsReps: 30, situpsReps: 38, accuracyScore: 78 },
              subScores: { speed: 72, agility: 75, endurance: 68, strength: 70, skill: 76 },
              overallScore: 75,
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
        }

        setAssessments(loadedHistory);
        setRecommendation(recRes.recommendation || null);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, profile]);

  const latestAssessment = assessments[0];
  const subScores = latestAssessment?.subScores || { speed: 75, agility: 80, endurance: 70, strength: 75, skill: 82 };
  const currentScore = latestAssessment?.overallScore || profile?.overallScore || 82;
  const level = profile?.performanceLevel || 'Advanced';

  // Radar Chart Attributes
  const radarData = [
    { subject: 'Speed', A: subScores.speed, fullMark: 100 },
    { subject: 'Agility', A: subScores.agility, fullMark: 100 },
    { subject: 'Endurance', A: subScores.endurance, fullMark: 100 },
    { subject: 'Strength', A: subScores.strength, fullMark: 100 },
    { subject: 'Skill', A: subScores.skill, fullMark: 100 }
  ];

  // Progress Trend Data
  const trendData = assessments
    .slice()
    .reverse()
    .map((a, index) => ({
      name: `Session ${index + 1}`,
      Score: a.overallScore
    }));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {user?.fullName || 'Athlete'}!
              </h1>
              <Badge text={level} variant={level === 'Elite' ? 'cyan' : 'emerald'} size="sm" />
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Primary Sport: <span className="text-emerald-400 font-bold">{user?.preferredSport || 'Athletics'}</span> • Location: {user?.location || 'India'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/assessment"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition"
            >
              <Target className="w-4 h-4" />
              <span>New Sports Assessment</span>
            </Link>
          </div>
        </div>

        {/* Top Grid Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Overall Score"
            value={`${currentScore} / 100`}
            subtext="AI Combined Metric"
            icon={Trophy}
            trend="+9.0 vs baseline"
            color="emerald"
          />
          <StatCard
            title="Speed & Sprint"
            value={`${subScores.speed} / 100`}
            subtext="20m Acceleration"
            icon={Zap}
            color="cyan"
          />
          <StatCard
            title="Agility & Reaction"
            value={`${subScores.agility} / 100`}
            subtext="Shuttle & Decision Time"
            icon={Activity}
            color="purple"
          />
          <StatCard
            title="Technical Skill"
            value={`${subScores.skill} / 100`}
            subtext="Precision Control"
            icon={Target}
            color="amber"
          />
        </div>

        {/* Middle Section: Score Dial + Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Dial Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Current Talent Rating</h3>
            <ScoreRing score={currentScore} size={160} strokeWidth={12} label="Overall" />
            <div className="mt-4 pt-4 border-t border-slate-800/80 w-full flex justify-around text-center">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Tier</span>
                <span className="text-emerald-400 font-extrabold text-sm">{level}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Total Tests</span>
                <span className="text-white font-extrabold text-sm">{assessments.length}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Scout Rank</span>
                <span className="text-cyan-400 font-extrabold text-sm">Top 12%</span>
              </div>
            </div>
          </div>

          {/* Athletic Attribute Radar Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Athletic Attribute Radar</h3>
                <p className="text-xs text-slate-400">Normalized sub-scores derived from physical drills</p>
              </div>
              <Badge text="Live AI Analysis" variant="cyan" size="sm" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Attributes" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Recommendations Teaser & Performance History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Personalized Insights</h3>
              </div>
              <Link to="/recommendations" className="text-xs text-emerald-400 font-bold hover:underline flex items-center space-x-1">
                <span>View Full Routine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">Key Strengths</span>
                <p className="text-xs text-slate-300">
                  {recommendation?.strengths?.join(' • ') || 'Explosive Speed & Technical Accuracy'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-bold uppercase text-amber-400 block mb-1">Target Limiter</span>
                <p className="text-xs text-slate-300">
                  {recommendation?.weaknesses?.join(' • ') || 'Cardiovascular Endurance'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">Top Recommended Drill</span>
                <p className="text-xs text-slate-200">
                  {recommendation?.recommendations?.[0] || 'Perform 20-minute interval shuttle runs (40s sprint / 20s rest) twice weekly.'}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Trend Line */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Performance Progress</h3>
              </div>
              <Link to="/history" className="text-xs text-slate-400 font-bold hover:text-white">
                View History
              </Link>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="Score" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
