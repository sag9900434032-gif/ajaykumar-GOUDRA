import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  sparklineData?: number[];
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-accent',
  subtitle,
  sparklineData = [12, 19, 15, 25, 22, 30, 28, 38],
  onClick
}) => {
  // Sparkline SVG path generator
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const height = 36;
  const width = 100;
  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <GlassCard
      interactive={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between group hover:border-accent/40"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-white/50">{title}</span>
          <div className="mt-1 text-2xl font-bold text-white numeral-tabular tracking-tight">
            {value}
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        {change && (
          <div className="flex items-center gap-1 font-medium">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
              {change}
            </span>
            {subtitle && <span className="text-white/40 ml-1">{subtitle}</span>}
          </div>
        )}

        {/* Mini SVG Sparkline */}
        <div className="w-24 h-9">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? '#10B981' : '#3B82F6'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </GlassCard>
  );
};
