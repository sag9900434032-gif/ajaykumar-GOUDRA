import React from 'react';
import clsx from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  padding = 'md',
  className,
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={clsx(
        interactive ? 'glass-card cursor-pointer' : 'glass-panel',
        paddingMap[padding],
        'relative overflow-hidden',
        className
      )}
      {...props}
    >
      {/* 1px inner top highlight for true glassmorphic refraction */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />
      {children}
    </div>
  );
};

export const GlassPanel = GlassCard;
