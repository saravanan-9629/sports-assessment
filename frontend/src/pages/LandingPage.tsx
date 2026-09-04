import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Target, ShieldCheck, Activity, Award, ArrowRight, Smartphone, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { Badge } from '../components/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI-Driven Sports Talent Assessment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Democratizing Sports Scouting for <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Every Athlete</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            No expensive hardware needed. Use mobile-first measurable assessments and AI performance analytics to unlock your athletic potential, get discovered by coaches, and train smarter.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-lg flex items-center justify-center space-x-2 transition"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>View Leaderboard</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xl font-extrabold text-emerald-400">10,000+</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Athletes Assessed</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xl font-extrabold text-cyan-400">4 Sports</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Cricket, Football, Basketball, Athletics</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xl font-extrabold text-purple-400">98.4%</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">AI Scoring Accuracy</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-3xl font-extrabold text-amber-400">500+</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Verified Scouts & Coaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge text="Simple 3-Step Process" variant="cyan" size="md" />
            <h2 className="text-3xl font-extrabold text-white mt-4">How SportsTalent.AI Works</h2>
            <p className="text-slate-400 mt-2">Empowering grassroots athletes with elite-level sports science and scouting tools.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Record & Enter Metrics</h3>
              <p className="text-slate-400 text-sm mt-2">
                Log measurable physical drills such as sprint times, vertical jumps, reaction speed, push-ups, and sport accuracy using any standard smartphone.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Instant AI Analysis</h3>
              <p className="text-slate-400 text-sm mt-2">
                Our AI Scoring Engine computes normalized scores for Speed, Agility, Endurance, Strength, and Skill, assigning a verified performance tier.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Get Discovered & Train</h3>
              <p className="text-slate-400 text-sm mt-2">
                Receive personalized drill recommendations, rank on national leaderboards, and get scouted directly by certified sports coaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Sports */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge text="Multi-Sport Ecosystem" variant="emerald" size="md" />
            <h2 className="text-3xl font-extrabold text-white mt-4">Supported Sports Disciplines</h2>
            <p className="text-slate-400 mt-2">Tailored assessment algorithms designed specifically for major sports categories.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cricket', icon: '🏏', desc: 'Sprint, Throwing Distance, Reaction & Batting/Bowling Accuracy' },
              { name: 'Football', icon: '⚽', desc: 'Dribble Agility, 20m Sprint, Endurance & Shooting Precision' },
              { name: 'Basketball', icon: '🏀', desc: 'Vertical Jump, Shuttle Agility, Free-Throw Accuracy & Stamina' },
              { name: 'Athletics', icon: '🏃', desc: '100m Sprint, Standing Broad Jump, Flexibility & Core Strength' }
            ].map((sport, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/50 transition">
                <div className="text-4xl mb-3">{sport.icon}</div>
                <h3 className="text-lg font-bold text-white">{sport.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{sport.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Athletes & Coaches */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge text="For Athletes" variant="emerald" size="sm" />
              <h2 className="text-3xl font-extrabold text-white mt-3">Level Up Your Athletic Career</h2>
              <ul className="mt-6 space-y-4">
                {[
                  '100% Mobile & Free - No expensive lab equipment required',
                  'Instant AI Radar chart breakdown of physical sub-scores',
                  'Personalized multi-week drill plans targeted at weak areas',
                  'National & regional leaderboards to showcase talent'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Badge text="For Coaches & Scouts" variant="cyan" size="sm" />
              <h2 className="text-3xl font-extrabold text-white mt-3">Discover Hidden Talent Anywhere</h2>
              <ul className="mt-6 space-y-4">
                {[
                  'Search & filter grassroots talent by age, sport, and location',
                  'Inspect verified metric breakdowns & AI strength evaluations',
                  'Shortlist top prospects & add direct scouting evaluations',
                  'Eliminate geographical and financial barriers in sports talent discovery'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#080B12] border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 SportsTalent.AI — Democratizing Sports Talent Assessment.</p>
      </footer>
    </div>
  );
};
