import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  TrendingUp,
  UserPlus,
  PlusCircle,
  FileText,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Student, Faculty, AttendanceRecord, PayrollRun, AuditLog } from '../types';

interface DashboardProps {
  students: Student[];
  faculty: Faculty[];
  attendanceRecords: AttendanceRecord[];
  payrollRuns: PayrollRun[];
  auditLogs: AuditLog[];
  onNavigate: (page: string) => void;
  onQuickAction: (action: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  faculty,
  attendanceRecords,
  payrollRuns,
  auditLogs,
  onNavigate,
  onQuickAction
}) => {
  const [attendanceTrendRange, setAttendanceTrendRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Computed metrics
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  const todayAttendancePct = attendanceRecords.length > 0
    ? ((presentCount / attendanceRecords.length) * 100).toFixed(1)
    : '89.4';

  const defaultersCount = students.filter(s => s.attendancePct < 75).length;
  const currentMonthPayroll = payrollRuns[0]?.totalNet
    ? `₹${(payrollRuns[0].totalNet / 100000).toFixed(2)}L`
    : '₹15.30L';

  // Department Distribution
  const scienceStudents = students.filter(s => s.department === 'Science').length;
  const commerceStudents = students.filter(s => s.department === 'Commerce').length;
  const artsStudents = students.filter(s => s.department === 'Arts').length;

  // Trend data points based on range toggle
  const trendPointsMap = {
    '7d': [84, 88, 86, 91, 89, 93, 92],
    '30d': [82, 85, 87, 84, 89, 91, 90, 88, 92, 94, 91, 89, 93, 95],
    '90d': [79, 81, 84, 83, 86, 88, 90, 91, 89, 92, 94, 93, 95]
  };

  const trendData = trendPointsMap[attendanceTrendRange];
  const maxTrend = Math.max(...trendData);
  const minTrend = Math.min(...trendData);
  const trendSvgPath = trendData
    .map((v, idx) => {
      const x = (idx / (trendData.length - 1)) * 500;
      const y = 140 - ((v - minTrend) / (maxTrend - minTrend || 1)) * 100 - 10;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-accent/25 via-purple-600/15 to-accent-cyan/20 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Academic Session 2026-27 Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good afternoon, Administrator
          </h2>
          <p className="text-sm text-white/70 max-w-xl mt-1">
            Campus is currently at <strong className="text-emerald-400">{todayAttendancePct}% attendance</strong> with 142 gate RFID check-ins logged today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => onQuickAction('add-student')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-md shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-accent-cyan" /> New Student
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-md shadow-sm"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" /> Mark Attendance
          </button>
          <button
            onClick={() => onNavigate('payroll')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-lg shadow-accent/30"
          >
            <CreditCard className="w-4 h-4" /> Run Payroll
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          change="+4.2%"
          isPositive={true}
          icon={GraduationCap}
          iconColor="text-accent"
          sparklineData={[50, 54, 58, 60, 62, 60, 64]}
          onClick={() => onNavigate('people')}
        />
        <StatCard
          title="Teaching Faculty"
          value={totalFaculty}
          change="Full strength"
          isPositive={true}
          icon={Users}
          iconColor="text-cyan-400"
          sparklineData={[19, 19, 20, 20, 21, 21, 21]}
          onClick={() => onNavigate('people')}
        />
        <StatCard
          title="Today's Attendance"
          value={`${todayAttendancePct}%`}
          change="+1.8%"
          isPositive={true}
          icon={CalendarCheck}
          iconColor="text-emerald-400"
          sparklineData={[84, 86, 85, 89, 88, 91, 92]}
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title="Fee Collection (MTD)"
          value="₹18.4L"
          change="84% target"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-amber-300"
          sparklineData={[10, 12, 14, 15, 16, 17, 18]}
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Payroll This Month"
          value={currentMonthPayroll}
          change="21 staff paid"
          isPositive={true}
          icon={CreditCard}
          iconColor="text-purple-400"
          sparklineData={[14, 14.5, 14.8, 15.0, 15.3, 15.3]}
          onClick={() => onNavigate('payroll')}
        />
        <StatCard
          title="Defaulters (<75%)"
          value={defaultersCount}
          change="Requires notice"
          isPositive={false}
          icon={AlertCircle}
          iconColor="text-rose-400"
          sparklineData={[12, 11, 10, 9, 8, 9, 8]}
          onClick={() => onNavigate('attendance')}
        />
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends Area Chart */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-accent" /> Institutional Attendance Velocity
              </h3>
              <p className="text-xs text-white/50 mt-0.5">Aggregated student presence over selected interval</p>
            </div>
            {/* 7/30/90 Day Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              {(['7d', '30d', '90d'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setAttendanceTrendRange(period)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    attendanceTrendRange === period
                      ? 'bg-accent text-white shadow-md'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Smooth Area Chart */}
          <div className="w-full h-52 relative mt-4">
            <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Gradient Area Fill */}
              <path
                d={`${trendSvgPath} L 500 150 L 0 150 Z`}
                fill="url(#auroraGrad)"
              />
              {/* Glow Stroke Line */}
              <path
                d={trendSvgPath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
              <span>Day 1</span>
              <span>Mid Period</span>
              <span>Today ({todayAttendancePct}%)</span>
            </div>
          </div>
        </GlassCard>

        {/* Department Strength & Enrollment Breakdown */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Department Distribution
            </h3>
            <p className="text-xs text-white/50 mt-0.5">Strength breakdown across streams</p>

            <div className="space-y-4 mt-6">
              {/* Science */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Science (PCMB / PCMC)
                  </span>
                  <span className="font-mono text-white/80">{scienceStudents} students ({Math.round(scienceStudents / totalStudents * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full" style={{ width: `${(scienceStudents / totalStudents) * 100}%` }} />
                </div>
              </div>

              {/* Commerce */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Commerce (EBAC)
                  </span>
                  <span className="font-mono text-white/80">{commerceStudents} students ({Math.round(commerceStudents / totalStudents * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full" style={{ width: `${(commerceStudents / totalStudents) * 100}%` }} />
                </div>
              </div>

              {/* Arts */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Arts & Humanities (HEPS)
                  </span>
                  <span className="font-mono text-white/80">{artsStudents} students ({Math.round(artsStudents / totalStudents * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-rose-300 rounded-full" style={{ width: `${(artsStudents / totalStudents) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mt-6 text-xs flex items-center justify-between">
            <span className="text-white/60">Current Total Enrolled</span>
            <span className="font-bold text-white text-base numeral-tabular">{totalStudents}</span>
          </div>
        </GlassCard>
      </div>

      {/* Activity Timeline & Quick Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Operational Activity Timeline */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Real-time Audit & Activity Log
            </h3>
            <button onClick={() => onNavigate('system')} className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-accent/15 text-accent mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{log.action}</div>
                    <p className="text-xs text-white/60 mt-0.5">{log.details}</p>
                    <div className="text-[10px] text-white/40 mt-1">By {log.user} ({log.role})</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-white/40 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Action Panel / Shortcuts */}
        <GlassCard>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-4">
            <PlusCircle className="w-4 h-4 text-accent" /> Institutional Shortcuts
          </h3>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('admissions')}
              className="w-full p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">Review Admission Intake Queue</div>
                <div className="text-[11px] text-white/50">Verify new applications from main website</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('attendance')}
              className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-accent transition-colors">Notify Attendance Defaulters</div>
                <div className="text-[11px] text-white/50">Send 1-click warnings to {defaultersCount} students</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white" />
            </button>

            <button
              onClick={() => onNavigate('payroll')}
              className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-accent transition-colors">Download Salary Slips</div>
                <div className="text-[11px] text-white/50">Export verified slips for all 21 faculty</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white" />
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-accent transition-colors">Custom Report Builder</div>
                <div className="text-[11px] text-white/50">Generate bespoke CSV / PDF analytics</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
