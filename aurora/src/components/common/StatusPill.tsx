import React from 'react';
import clsx from 'clsx';

export type StatusType = 'present' | 'absent' | 'late' | 'excused' | 'paid' | 'partial' | 'overdue' | 'active' | 'on_leave' | 'pending' | 'approved' | 'rejected' | 'Draft' | 'Under Review' | 'Approved' | 'Paid';

interface StatusPillProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  className
}) => {
  const norm = String(status).toLowerCase();

  let bgClass = 'bg-white/10 text-white/80 border-white/20';
  let dotClass = 'bg-white/60';

  if (['present', 'paid', 'approved', 'active'].includes(norm)) {
    bgClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    dotClass = 'bg-emerald-400';
  } else if (['late', 'partial', 'pending', 'under review', 'draft'].includes(norm)) {
    bgClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    dotClass = 'bg-amber-400';
  } else if (['absent', 'overdue', 'rejected', 'danger'].includes(norm)) {
    bgClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    dotClass = 'bg-rose-400';
  } else if (['excused', 'on_leave'].includes(norm)) {
    bgClass = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    dotClass = 'bg-cyan-400';
  }

  const label = norm.charAt(0).toUpperCase() + norm.slice(1);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm shadow-sm select-none',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
        bgClass,
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', dotClass)} />
      {label}
    </span>
  );
};
