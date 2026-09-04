import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AIRecommendation } from '../types';
import { Badge } from '../components/Badge';
import { Sparkles, CheckCircle2, Flame, Calendar, Dumbbell, Zap, Target } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.getRecommendations().catch(() => ({ recommendation: null }));
        let data = res.recommendation;
        if (!data) {
          data = {
            userId: 'demo-athlete-1',
            assessmentId: 'asm-101',
            overallScore: 84,
            performanceLevel: 'Advanced',
            strengths: ['Explosive Sprint Speed', 'Target Accuracy'],
            weaknesses: ['Cardiovascular Endurance'],
            recommendations: [
              'Your agility score is below your other performance metrics. Add ladder drills, cone drills, and short-distance acceleration exercises to your weekly training.',
              'Perform high-intensity interval training (HIIT) with 40s work / 20s rest blocks.',
              'Prioritize 8 hours of sleep for neuromuscular recovery and log assessments bi-weekly.'
            ],
            trainingPlan: [
              'Monday: 5x30m Acceleration starts & 4 sets plyometric depth jumps',
              'Tuesday: Upper body explosive push/pull supersets',
              'Wednesday: 20-minute interval shuttle runs (40s work / 20s rest)',
              'Thursday: Agility ladder icky-shuffle & lateral bounds',
              'Friday: Sport precision target drills under fatiguing conditions',
              'Saturday: Active recovery & mobility stretches'
            ]
          };
        }
        setRecommendation(data);
      } catch (err) {
        console.error('Recommendations error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge text="AI Training Engine" variant="emerald" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center space-x-2">
              <Sparkles className="w-7 h-7 text-amber-400" />
              <span>Personalized AI Drill Recommendations</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Custom workout routines generated based on your latest assessment limiters</p>
          </div>

          <Badge text={`Level: ${recommendation?.performanceLevel || 'Advanced'}`} variant="cyan" size="md" />
        </div>

        {/* Priority Focus Drills */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Targeted Performance Advice</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {(recommendation?.recommendations || []).map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Actionable Drill #{i + 1}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Training Plan Schedule */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Weekly Micro-Cycle Training Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(recommendation?.trainingPlan || []).map((dayItem, index) => {
              const parts = dayItem.split(':');
              const dayName = parts[0] || `Day ${index + 1}`;
              const drillText = parts[1] || dayItem;

              return (
                <div key={index} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-400 block mb-1">{dayName}</span>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{drillText}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Intensity: High</span>
                    <span>30-45 mins</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
