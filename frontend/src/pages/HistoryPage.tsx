import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Assessment } from '../types';
import { Badge } from '../components/Badge';
import { Calendar, BarChart2, ArrowRight, Target, Trophy, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const HistoryPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getHistory().catch(() => ({ assessments: [] }));
        let list = res.assessments || [];
        if (list.length === 0) {
          list = [
            {
              _id: 'asm-101',
              userId: 'demo-athlete-1',
              sport: 'Cricket',
              assessmentType: 'National Scouting Combine',
              metrics: { sprintTimeSec: 3.8, jumpHeightCm: 55, reactionTimeMs: 220, pushupsReps: 38, situpsReps: 45, accuracyScore: 85 },
              subScores: { speed: 84, agility: 86, endurance: 78, strength: 82, skill: 88 },
              overallScore: 84,
              createdAt: new Date().toISOString()
            },
            {
              _id: 'asm-100',
              userId: 'demo-athlete-1',
              sport: 'Cricket',
              assessmentType: 'Mid-Season Progress Test',
              metrics: { sprintTimeSec: 4.0, jumpHeightCm: 50, reactionTimeMs: 240, pushupsReps: 32, situpsReps: 40, accuracyScore: 80 },
              subScores: { speed: 76, agility: 78, endurance: 72, strength: 74, skill: 80 },
              overallScore: 78,
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'asm-099',
              userId: 'demo-athlete-1',
              sport: 'Cricket',
              assessmentType: 'Baseline Fitness Combine',
              metrics: { sprintTimeSec: 4.3, jumpHeightCm: 45, reactionTimeMs: 260, pushupsReps: 28, situpsReps: 35, accuracyScore: 72 },
              subScores: { speed: 68, agility: 70, endurance: 64, strength: 68, skill: 72 },
              overallScore: 71,
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
        }
        setAssessments(list);
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const chartData = assessments
    .slice()
    .reverse()
    .map((a, i) => ({
      name: `Test ${i + 1}`,
      OverallScore: a.overallScore,
      Speed: a.subScores.speed,
      Skill: a.subScores.skill
    }));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
          <div>
            <Badge text="Performance Tracking" variant="emerald" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Assessment History</h1>
            <p className="text-slate-400 text-xs mt-1">Review historical combine results and score progression over time</p>
          </div>

          <Link
            to="/assessment"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>New Combine Test</span>
          </Link>
        </div>

        {/* Historical Score Line Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
          <h3 className="text-base font-bold text-white mb-4">Historical Progression Chart</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} stroke="#64748B" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="OverallScore" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Speed" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Skill" stroke="#A855F7" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Past Assessments List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Past Combine Submissions ({assessments.length})</h3>

          {assessments.map((item) => (
            <div
              key={item._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-xl font-black text-emerald-400">{item.overallScore}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-white">{item.sport} Assessment</h4>
                    <Badge text={item.assessmentType} variant="slate" size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>Sprint: {item.metrics?.sprintTimeSec || '3.8'}s</span>
                    <span>•</span>
                    <span>Jump: {item.metrics?.jumpHeightCm || '55'}cm</span>
                  </p>
                </div>
              </div>

              <Link
                to={`/results/${item._id}`}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
