import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'emerald' | 'cyan' | 'purple' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'emerald'
}) => {
  const iconColors = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        {trend && <span className="text-[11px] font-medium text-emerald-400 mt-1 block">{trend}</span>}
      </div>
      <div className={`p-3 rounded-lg border ${iconColors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
