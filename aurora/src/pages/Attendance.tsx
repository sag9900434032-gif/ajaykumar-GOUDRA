import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatusPill } from '../components/common/StatusPill';
import { HeatmapCalendar } from '../components/common/HeatmapCalendar';
import {
  CalendarCheck,
  QrCode,
  Fingerprint,
  MapPin,
  AlertTriangle,
  Download,
  Send,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { attendanceService } from '../services/attendanceService';

interface AttendanceProps {
  students: Student[];
  records: AttendanceRecord[];
  onUpdateRecord: (id: string, status: 'present' | 'absent' | 'late' | 'excused') => void;
  onSelectStudent: (student: Student) => void;
}

export const Attendance: React.FC<AttendanceProps> = ({
  students,
  records,
  onUpdateRecord,
  onSelectStudent
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'defaulters' | 'qr' | 'biometric' | 'heatmap'>('register');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [threshold, setThreshold] = useState(attendanceService.getDefaulterThreshold());
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  // QR & Biometric Simulators state
  const [qrInput, setQrInput] = useState('');
  const [qrMessage, setQrMessage] = useState<string | null>(null);
  const [biometricCardInput, setBiometricCardInput] = useState('');
  const [biometricLog, setBiometricLog] = useState<string[]>([]);

  const stats = attendanceService.getStats();
  const defaulters = attendanceService.getDefaulters(students, threshold);

  // Filtered attendance records for register
  const filteredRecords = records.filter(r => {
    const student = students.find(s => s.id === r.studentId);
    const matchesDept = filterDept === 'all' || (student && student.department === filterDept);
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const handleNotifyDefaulters = () => {
    const res = attendanceService.notifyDefaulters(defaulters);
    setNotificationStatus(res.message);
    setTimeout(() => setNotificationStatus(null), 5000);
  };

  const handleSimulateQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput) return;
    const res = attendanceService.processQrCheckin(qrInput.trim());
    setQrMessage(res.message);
    if (res.record) {
      onUpdateRecord(res.record.id, 'present');
    }
    setQrInput('');
    setTimeout(() => setQrMessage(null), 4000);
  };

  const handleSimulateBiometric = (rollNo: string) => {
    const res = attendanceService.simulateBiometricSwipe(rollNo);
    const time = new Date().toLocaleTimeString();
    setBiometricLog(prev => [`[${time}] ${res.message}`, ...prev.slice(0, 5)]);
    if (res.record) {
      onUpdateRecord(res.record.id, 'present');
    }
  };

  const handleExportCsv = () => {
    const csvContent = attendanceService.exportAttendanceCsv();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Live Today Board Counters Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-emerald-400">Present</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-3xl font-extrabold text-white numeral-tabular mt-2">
            {stats.present}
          </div>
          <p className="text-[11px] text-white/50 mt-1">{stats.rate}% of strength logged</p>
        </GlassCard>

        <GlassCard className="border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-rose-400">Absent</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white numeral-tabular mt-2">
            {stats.absent}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Pending parent updates</p>
        </GlassCard>

        <GlassCard className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-amber-300">Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-extrabold text-white numeral-tabular mt-2">
            {stats.late}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Check-in post 09:15 AM</p>
        </GlassCard>

        <GlassCard className="border-accent/40 bg-accent/10">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-accent">Defaulters</span>
            <AlertTriangle className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-white numeral-tabular mt-2">
            {defaulters.length}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Below {threshold}% threshold</p>
        </GlassCard>
      </div>

      {/* Tabs & Module Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Daily Register ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('defaulters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'defaulters' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Defaulter Engine ({defaulters.length})
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qr' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" /> QR Check-in
          </button>
          <button
            onClick={() => setActiveTab('biometric')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'biometric' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4" /> Biometric/RFID Feed
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'heatmap' ? 'bg-accent-cyan text-slate-900 font-bold shadow-lg shadow-cyan-500/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Heatmap
          </button>
        </div>

        {/* Export CSV button */}
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {notificationStatus && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* VIEW 1: DAILY REGISTER */}
      {activeTab === 'register' && (
        <GlassCard padding="none" className="overflow-hidden">
          {/* Table Search & Filter Bar */}
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search student or roll number..."
                className="w-full bg-transparent border-none text-white placeholder-white/40 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-white/40" />
                <select
                  value={filterDept}
                  onChange={e => setFilterDept(e.target.value)}
                  className="bg-[#070812] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">All Streams</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-[#070812] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>

              <button
                onClick={() => attendanceService.bulkMarkAll('present')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-400 font-semibold"
              >
                <CheckSquare className="w-3.5 h-3.5" /> Mark All Present
              </button>
            </div>
          </div>

          {/* Table Grid */}
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#070812]/95 backdrop-blur-xl border-b border-white/10 text-white/40 uppercase font-bold tracking-wider text-[10px] z-10">
                <tr>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Class & Stream</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Check-in Method</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Quick Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map(rec => {
                  const student = students.find(s => s.id === rec.studentId);
                  return (
                    <tr key={rec.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="py-3 px-4 font-mono font-bold text-accent">{rec.rollNo}</td>
                      <td className="py-3 px-4">
                        <div
                          onClick={() => student && onSelectStudent(student)}
                          className="font-semibold text-white hover:text-accent cursor-pointer transition-colors"
                        >
                          {rec.studentName}
                        </div>
                        {student && <div className="text-[11px] text-white/40">{student.attendancePct}% Cumulative</div>}
                      </td>
                      <td className="py-3 px-4 text-white/70">{rec.classId}</td>
                      <td className="py-3 px-4">
                        <StatusPill status={rec.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono tracking-wider text-white/60">
                        {rec.method}
                      </td>
                      <td className="py-3 px-4 text-white/50 font-mono">{rec.markedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            title="Mark Present"
                            onClick={() => onUpdateRecord(rec.id, 'present')}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              rec.status === 'present'
                                ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                                : 'bg-white/5 border-white/10 hover:bg-emerald-500/20 text-white/50 hover:text-emerald-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Mark Late"
                            onClick={() => onUpdateRecord(rec.id, 'late')}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              rec.status === 'late'
                                ? 'bg-amber-500/30 border-amber-500 text-amber-300'
                                : 'bg-white/5 border-white/10 hover:bg-amber-500/20 text-white/50 hover:text-amber-300'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Mark Absent"
                            onClick={() => onUpdateRecord(rec.id, 'absent')}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              rec.status === 'absent'
                                ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                                : 'bg-white/5 border-white/10 hover:bg-rose-500/20 text-white/50 hover:text-rose-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* VIEW 2: DEFAULTER ENGINE */}
      {activeTab === 'defaulters' && (
        <div className="space-y-6">
          <GlassCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" /> Automated Defaulter Enforcement Engine
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  Students below the statutory threshold are identified for academic counseling and automated parent alerts.
                </p>
              </div>

              {/* Threshold Slider */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Sliders className="w-4 h-4 text-accent" />
                <span className="text-xs text-white/70">Threshold:</span>
                <input
                  type="range"
                  min="60"
                  max="85"
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-24 accent-accent cursor-pointer"
                />
                <span className="text-sm font-bold text-accent numeral-tabular">{threshold}%</span>
              </div>
            </div>

            {/* Notify Button Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">Notice Action Required</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {defaulters.length} students currently in violation of the {threshold}% attendance requirement
                </div>
              </div>
              <button
                onClick={handleNotifyDefaulters}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/30 shrink-0"
              >
                <Send className="w-4 h-4" /> 1-Click Notify Students & Guardians
              </button>
            </div>
          </GlassCard>

          {/* Defaulter Table */}
          <GlassCard padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#070812]/95 border-b border-white/10 text-white/40 uppercase font-bold tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Roll No</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Attendance %</th>
                    <th className="py-3.5 px-4">Guardian Contact</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {defaulters.map(st => (
                    <tr key={st.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">{st.rollNo}</td>
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onSelectStudent(st)}
                          className="font-bold text-white hover:text-accent cursor-pointer"
                        >
                          {st.name}
                        </div>
                        <div className="text-[11px] text-white/40">{st.class}</div>
                      </td>
                      <td className="py-3 px-4 text-white/70">{st.department}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${st.attendancePct}%` }} />
                          </div>
                          <span className="font-bold text-rose-400 font-mono">{st.attendancePct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">
                        <div>{st.fatherName}</div>
                        <div className="text-[11px] font-mono text-white/40">{st.emergencyPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Warning notice drafted for ${st.name}`)}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* VIEW 3: QR CODE CHECK-IN SIMULATOR */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dynamic Session QR Code</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
                  Students scan this QR from their portal app. Dynamic security hash rotates every 15 seconds.
                </p>
              </div>

              {/* Mock QR Canvas Display */}
              <div className="w-48 h-48 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 grid grid-cols-6 gap-1 bg-white">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35)
                          ? 'bg-slate-900'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-[11px] font-mono text-cyan-300">
                HASH: #AKR-PHY-2026-TOKEN-8472
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-accent-cyan" /> Scan Simulator & Verification
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Simulate a student device scanning the QR code or enter roll number.
            </p>

            <form onSubmit={handleSimulateQr} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">Student Roll Number or ID</label>
                <input
                  type="text"
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="e.g. 2026-SCI-01 or STU-001"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/25"
              >
                Simulate QR Check-in
              </button>
            </form>

            {qrMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {qrMessage}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* VIEW 4: BIOMETRIC / RFID DEVICE FEED */}
      {activeTab === 'biometric' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Fingerprint className="w-5 h-5 text-purple-400" /> Hardware Device Adapter Interface
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Mock interface connected to Campus Turnstile RFID & Mantra Optical Fingerprint devices.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-white/50">Device Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ONLINE (Port 8080)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Device Model</span>
                <span className="font-mono text-white/80">Mantra MFS100 / eSSL RFID Gate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Webhook Endpoint</span>
                <span className="font-mono text-white/80">POST /api/v1/attendance/webhook</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-white/80">Simulate Hardware Tag Scan:</div>
              <div className="flex flex-wrap gap-2">
                {students.slice(0, 5).map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSimulateBiometric(s.rollNo)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 text-white text-xs font-mono transition-colors"
                  >
                    Swipe {s.rollNo}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-emerald-400" /> Device Telemetry Stream
            </h3>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-white/70 h-64 overflow-y-auto space-y-2">
              <div className="text-emerald-400">&gt; Daemon initialized on turnstile-01.local</div>
              <div className="text-white/40">&gt; Polling biometric socket stream...</div>
              {biometricLog.map((log, i) => (
                <div key={i} className="text-cyan-300">{log}</div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* VIEW 5: MONTHLY HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <HeatmapCalendar monthName="October" year={2026} />
        </div>
      )}
    </div>
  );
};
