import React from 'react';
import clsx from 'clsx';

interface HeatmapCalendarProps {
  monthName?: string;
  year?: number;
  data?: Record<number, 'present' | 'absent' | 'late' | 'holiday' | 'weekend'>;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  monthName = 'October',
  year = 2026,
  data = {}
}) => {
  // 31 days grid
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getDayStatus = (d: number): 'present' | 'absent' | 'late' | 'holiday' | 'weekend' => {
    if (data[d]) return data[d];
    // Sundays
    if (d % 7 === 4) return 'weekend';
    if (d === 2 || d === 20) return 'holiday';
    if (d === 8 || d === 15) return 'absent';
    if (d === 12 || d === 24) return 'late';
    return 'present';
  };

  const statusColors = {
    present: 'bg-emerald-500/25 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/40',
    absent: 'bg-rose-500/25 border-rose-500/40 text-rose-300 hover:bg-rose-500/40',
    late: 'bg-amber-500/25 border-amber-500/40 text-amber-300 hover:bg-amber-500/40',
    holiday: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    weekend: 'bg-white/5 border-white/10 text-white/30'
  };

  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-white">{monthName} {year} Heatmap</h4>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40" /> Present</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40" /> Late</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/40" /> Absent</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white/10" /> Weekend</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-bold text-white/40 pb-1">
            {day}
          </div>
        ))}

        {days.map(d => {
          const st = getDayStatus(d);
          return (
            <div
              key={d}
              title={`Day ${d}: ${st.toUpperCase()}`}
              className={clsx(
                'h-9 rounded-xl border flex items-center justify-center font-mono text-xs font-semibold cursor-pointer transition-all',
                statusColors[st]
              )}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};
