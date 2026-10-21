import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Calendar, ChevronRight } from 'lucide-react';
import { User } from '../../types';

interface TopbarProps {
  currentPage: string;
  currentUser: User;
  onOpenCommandPalette: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  currentUser,
  onOpenCommandPalette,
  isDarkTheme,
  onToggleTheme
}) => {
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Defaulter Alert', desc: '8 students fallen below 75% attendance', time: '10m ago', urgent: true },
    { id: 2, title: 'Payroll Ready', desc: 'July payroll draft generated for review', time: '1h ago', urgent: false },
    { id: 3, title: 'RFID Sync Complete', desc: '142 morning gate check-ins logged', time: '2h ago', urgent: false },
  ];

  const formatBreadcrumb = (page: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Executive Overview',
      admissions: 'Admissions & Student Intake',
      attendance: 'Attendance Live Monitor',
      payroll: 'Payroll & Salary Slips',
      people: 'Students & Faculty Records',
      academics: 'Courses & Examination',
      finance: 'Fee Ledger & Collections',
      reports: 'Reports & Analytics',
      system: 'RBAC & Configuration'
    };
    return titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-white/10 bg-[#070812]/70 backdrop-blur-2xl px-6 flex items-center justify-between">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="text-white/40">Aurora</span>
        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
        <span className="text-white font-semibold">{formatBreadcrumb(currentPage)}</span>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Command Palette Button (⌘K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all text-xs group"
        >
          <Search className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Search anything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/60 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Academic Year Selector */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={academicYear}
            onChange={e => setAcademicYear(e.target.value)}
            className="bg-transparent border-none text-white/80 focus:outline-none cursor-pointer text-xs"
          >
            <option value="2026-27" className="bg-[#070812]">AY 2026-27</option>
            <option value="2025-26" className="bg-[#070812]">AY 2025-26</option>
            <option value="2024-25" className="bg-[#070812]">AY 2024-25</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Light/Dark Glass Mode"
          className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#FB7185]" />
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel bg-[#070812]/95 border border-white/20 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alerts & Dispatch</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold">3 NEW</span>
              </div>
              <div className="divide-y divide-white/5 mt-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span className={n.urgent ? 'text-rose-400 font-bold' : ''}>{n.title}</span>
                      <span className="text-[10px] text-white/40">{n.time}</span>
                    </div>
                    <p className="text-white/60 text-[11px] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent-cyan text-white font-bold flex items-center justify-center text-xs shadow-md shadow-accent/20">
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-white/40 font-mono capitalize">{currentUser.role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
