import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ScoreRing } from '../components/ScoreRing';
import { Badge } from '../components/Badge';
import { ArrowLeft, Star, CheckCircle2, BookmarkCheck, Send, User, Trophy, Activity } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export const CoachAthleteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [recommendedFocus, setRecommendedFocus] = useState('Maintain explosive sprint speed and add tactical match experience.');
  const [shortlisted, setShortlisted] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const res = await api.getCoachAthleteById(id).catch(() => null);
          if (res?.athlete) {
            setData(res);
            if (res.coachFeedback) {
              setRating(res.coachFeedback.rating || 5);
              setNotes(res.coachFeedback.notes || '');
              setRecommendedFocus(res.coachFeedback.recommendedFocus || '');
              setShortlisted(res.coachFeedback.shortlisted || false);
            }
          } else {
            // Mock detailed athlete data
            setData({
              athlete: {
                id,
                fullName: id === 'demo-athlete-2' ? 'Ananya Roy' : 'Rahul Sharma',
                email: 'athlete@sportstalent.ai',
                age: 17,
                gender: 'Male',
                location: 'Mumbai, MH',
                preferredSport: 'Cricket'
              },
              profile: {
                heightCm: 178,
                weightKg: 70,
                institution: 'National Cricket Academy',
                primaryPosition: 'Fast Bowling All-Rounder',
                bio: 'Top prospect in regional U-19 circuit with verified 135km/h bowling and 3.8s sprint acceleration.',
                overallScore: 84,
                performanceLevel: 'Advanced'
              },
              assessments: [
                {
                  _id: 'asm-1',
                  sport: 'Cricket',
                  assessmentType: 'National Scouting Combine',
                  metrics: { sprintTimeSec: 3.8, jumpHeightCm: 55, reactionTimeMs: 220, pushupsReps: 38, situpsReps: 45, accuracyScore: 85 },
                  subScores: { speed: 84, agility: 86, endurance: 78, strength: 82, skill: 88 },
                  overallScore: 84,
                  createdAt: new Date().toISOString()
                }
              ]
            });
          }
        }
      } catch (err) {
        console.error('Athlete detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitCoachFeedback({
        athleteId: id,
        rating,
        notes,
        recommendedFocus,
        shortlisted
      }).catch(() => null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Feedback submit error:', err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">Loading athlete profile...</div>;
  }

  const athlete = data?.athlete || {};
  const profile = data?.profile || {};
  const assessment = data?.assessments?.[0] || {};
  const subScores = assessment?.subScores || { speed: 84, agility: 86, endurance: 78, strength: 82, skill: 88 };

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
        <Link to="/coach" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Coach Scouting Dashboard</span>
        </Link>

        {/* Athlete Hero Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              {athlete.fullName?.[0] || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{athlete.fullName}</h1>
                <Badge text={profile.performanceLevel || 'Advanced'} variant="cyan" size="sm" />
              </div>
              <p className="text-slate-400 text-xs mt-1">
                {athlete.preferredSport} • {athlete.location} • Age {athlete.age} ({athlete.gender})
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{profile.institution} | {profile.primaryPosition}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-bold block">Verified AI Rating</span>
              <span className="text-3xl font-black text-emerald-400">{profile.overallScore || 84} / 100</span>
            </div>
          </div>
        </div>

        {/* Bio & Physical Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 md:col-span-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Biometric Stats</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Height</span>
                <span className="font-bold text-white">{profile.heightCm || 178} cm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Weight</span>
                <span className="font-bold text-white">{profile.weightKg || 70} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">20m Sprint</span>
                <span className="font-bold text-emerald-400">{assessment?.metrics?.sprintTimeSec || 3.8}s</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Vertical Jump</span>
                <span className="font-bold text-cyan-400">{assessment?.metrics?.jumpHeightCm || 55} cm</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Scouting Notes</span>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                "{profile.bio}"
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 md:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">Combine Attribute Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Attributes" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Coach Evaluation Feedback Form */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Official Scout Evaluation & Feedback</span>
            </h3>
            {submitted && <Badge text="Evaluation Saved!" variant="emerald" size="sm" />}
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Scout Rating (1 - 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Top National Prospect)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Strong Regional Potential)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Development Squad Candidate)</option>
                  <option value={2}>⭐⭐ (2 Stars - Needs Foundation Work)</option>
                  <option value={1}>⭐ (1 Star - Early Beginner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Shortlist Status</label>
                <div className="flex items-center space-x-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setShortlisted(!shortlisted)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      shortlisted
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {shortlisted ? '★ Shortlisted in Scout Radar' : '+ Add to Shortlist'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Recommended Focus / Action Plan</label>
              <input
                type="text"
                value={recommendedFocus}
                onChange={(e) => setRecommendedFocus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Scout Evaluation Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter detailed observation notes for sports academy selection..."
                rows={3}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit Official Scout Report</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
