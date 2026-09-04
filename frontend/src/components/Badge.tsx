import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'blue' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'emerald', size = 'sm' }) => {
  const styles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${styles[variant]} ${sizeStyles[size]} tracking-wide uppercase`}>
      {text}
    </span>
  );
};
