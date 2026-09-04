import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ScoreRing } from '../components/ScoreRing';
import { Badge } from '../components/Badge';
import { Assessment, AIRecommendation } from '../types';
import { Trophy, Sparkles, CheckCircle2, AlertTriangle, Calendar, ArrowRight, Share2, Award, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (id) {
          const res = await api.getResultsById(id).catch(() => null);
          if (res?.result) {
            setAssessment(res.result.assessment);
            setAiRec(res.result.aiRecommendation);
          } else {
            // Fallback sample mock result if detailed record isn't in database yet
            setAssessment({
              _id: id,
              userId: 'demo-athlete-1',
              sport: 'Cricket',
              assessmentType: 'National Scouting Combine',
              metrics: { sprintTimeSec: 3.8, jumpHeightCm: 55, reactionTimeMs: 220, pushupsReps: 38, situpsReps: 45, accuracyScore: 85 },
              subScores: { speed: 84, agility: 86, endurance: 78, strength: 82, skill: 88 },
              overallScore: 84,
              createdAt: new Date().toISOString()
            });
            setAiRec({
              userId: 'demo-athlete-1',
              assessmentId: id,
              overallScore: 84,
              performanceLevel: 'Advanced',
              strengths: ['Explosive Speed (84/100)', 'Technical Precision (88/100)'],
              weaknesses: ['Cardiovascular Endurance (78/100)'],
              recommendations: [
                'Incorporate 20-minute interval shuttle runs (40s work / 20s rest) twice weekly.',
                'Maintain high-level bowling/batting precision under fatigue.',
                'Prioritize 8 hours of sleep for neuromuscular recovery.'
              ],
              trainingPlan: [
                'Mon: 5x30m Acceleration starts & 4 sets plyometric depth jumps',
                'Wed: Target accuracy drills (50 repetitions under timed pressure)',
                'Fri: High-intensity interval conditioning & core stability'
              ]
            });
          }
        }
      } catch (err) {
        console.error('Results load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">
        Analyzing Assessment Data...
      </div>
    );
  }

  const subScores = assessment?.subScores || { speed: 84, agility: 86, endurance: 78, strength: 82, skill: 88 };
  const score = assessment?.overallScore || 84;
  const level = aiRec?.performanceLevel || 'Advanced';

  const radarData = [
    { subject: 'Speed', A: subScores.speed },
    { subject: 'Agility', A: subScores.agility },
    { subject: 'Endurance', A: subScores.endurance },
    { subject: 'Strength', A: subScores.strength },
    { subject: 'Skill', A: subScores.skill }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <Badge text={assessment?.sport || 'Cricket'} variant="cyan" size="sm" />
              <Badge text={level} variant={level === 'Elite' ? 'cyan' : 'emerald'} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">AI Talent Scouting Report</h1>
            <p className="text-slate-400 text-xs mt-1">
              Assessment ID: #{id?.slice(-8)} • Date: {new Date(assessment?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/history"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              View History
            </Link>
            <Link
              to="/assessment"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Take Another Test
            </Link>
          </div>
        </div>

        {/* Score & Attribute Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Dial Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
            <ScoreRing score={score} size={170} strokeWidth={12} label="Overall Score" />
            <div className="mt-4 pt-4 border-t border-slate-800 w-full text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Performance Tier</span>
              <span className="text-emerald-400 font-black text-lg mt-0.5 block">{level}</span>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">Physical Attribute Radar</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Attributes" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths, Weaknesses, Recommendations & Training Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Identified Key Strengths</span>
            </h3>
            <ul className="space-y-2.5">
              {(aiRec?.strengths || ['Explosive Speed', 'Technical Control']).map((s, i) => (
                <li key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>{s}</span>
                  <Badge text="Strong" variant="emerald" size="sm" />
                </li>
              ))}
            </ul>
          </div>

          {/* Limiters */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Target Improvement Limiters</span>
            </h3>
            <ul className="space-y-2.5">
              {(aiRec?.weaknesses || ['Cardiovascular Endurance']).map((w, i) => (
                <li key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>{w}</span>
                  <Badge text="Focus" variant="amber" size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Action Plan */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Training Recommendations & Multi-Week Plan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Actionable drills generated based on your specific metric limiter</p>
          </div>

          <div className="space-y-3">
            {(aiRec?.recommendations || []).map((rec, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold uppercase text-emerald-400 mb-3">Structured Training Protocol</h4>
            <div className="space-y-2">
              {(aiRec?.trainingPlan || []).map((planItem, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-medium">
                  {planItem}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssessmentDetailPage = ResultsPage;
