import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { PERMISSION_MATRIX } from '../services/authService';
import { initialAuditLogs } from '../data/seedData';
import { Role, AuditLog } from '../types';
import {
  ShieldAlert,
  Sliders,
  Building,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  Save,
  Server,
  Radio,
  Wifi,
  Lock,
  RefreshCw
} from 'lucide-react';

export const System: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'profile' | 'audit'>('rbac');
  const [matrix, setMatrix] = useState(PERMISSION_MATRIX);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [auditSearch, setAuditSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Institution profile form state
  const [collegeName, setCollegeName] = useState('AKRDevi Memorial PU College');
  const [affiliationCode, setAffiliationCode] = useState('KA-KOP-PU-4402');
  const [principalName, setPrincipalName] = useState('Dr. Padmavati Rao, Ph.D.');
  const [campusAddress, setCampusAddress] = useState('Sriramnagar, Koppal District, Karnataka - 583282');
  const [academicYear, setAcademicYear] = useState('AY 2026-27');

  const roles: Role[] = ['super_admin', 'principal', 'hod', 'accountant', 'faculty', 'student'];

  const permissionKeys: { key: keyof typeof PERMISSION_MATRIX['super_admin']; label: string }[] = [
    { key: 'canViewDashboard', label: 'View Dashboard' },
    { key: 'canManageAttendance', label: 'Manage Attendance' },
    { key: 'canRunPayroll', label: 'Run Payroll' },
    { key: 'canViewAllSalarySlips', label: 'View All Salary Slips' },
    { key: 'canManageStudents', label: 'Manage Students' },
    { key: 'canManageFaculty', label: 'Manage Faculty' },
    { key: 'canManageAcademics', label: 'Manage Academics' },
    { key: 'canViewFinance', label: 'View Finance Ledger' },
    { key: 'canManageFinance', label: 'Collect Payments' },
    { key: 'canGenerateReports', label: 'Generate Reports' },
    { key: 'canAccessSystemSettings', label: 'System Settings' }
  ];

  const handleTogglePermission = (role: Role, key: keyof typeof PERMISSION_MATRIX['super_admin']) => {
    // Keep super_admin locked for safety
    if (role === 'super_admin') return;

    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key]
      }
    }));
  };

  const handleSaveMatrix = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.entity.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              SECURITY & GOVERNANCE
            </span>
            <span className="text-white/40 text-xs">• Root Administrative Controls</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">RBAC Permissions & System Configuration</h1>
          <p className="text-xs text-white/50">Manage granular role matrices, hardware biometric integrations, and immutable audit trails.</p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'rbac' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>RBAC Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'profile' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Institution & IoT</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'audit' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE RBAC MATRIX EDITOR */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-accent" />
              <div>
                <h4 className="text-xs font-bold text-white">Live Granular RBAC Permission Matrix</h4>
                <p className="text-[11px] text-white/50">Toggle capabilities across 6 institutional personas. Changes update runtime authorization immediately.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Security policies synchronized!
                </span>
              )}
              <button
                onClick={handleSaveMatrix}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan text-white text-xs font-semibold shadow-lg shadow-accent/25 hover:opacity-95 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Matrix</span>
              </button>
            </div>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold">
                    <th className="py-3 px-4">Permission Scope</th>
                    {roles.map(r => (
                      <th key={r} className="py-3 px-4 text-center capitalize">
                        {r.replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {permissionKeys.map(({ key, label }) => (
                    <tr key={key} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white/90">
                        {label}
                      </td>
                      {roles.map(role => {
                        const isGranted = matrix[role][key];
                        const isLocked = role === 'super_admin';

                        return (
                          <td key={role} className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePermission(role, key)}
                              disabled={isLocked}
                              title={isLocked ? 'Super Admin permissions are immutable' : 'Click to toggle'}
                              className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                                isGranted
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-white/5 text-white/20 border border-white/10 hover:bg-white/10'
                              } ${isLocked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                            >
                              {isGranted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-white/30" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: INSTITUTION PROFILE & IOT GATEWAY */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institutional Info */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Building className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-white">Institutional Identity & Accreditation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1">College Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={e => setCollegeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1">Karnataka Board Affiliation Code</label>
                  <input
                    type="text"
                    value={affiliationCode}
                    onChange={e => setAffiliationCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1">Principal / Head of Institution</label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={e => setPrincipalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1">Current Academic Session</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-white/60 block mb-1">Campus Physical Address</label>
                  <input
                    type="text"
                    value={campusAddress}
                    onChange={e => setCampusAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => alert('Institution profile configuration saved.')}
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/80 text-white text-xs font-semibold transition-all"
                >
                  Update Profile
                </button>
              </div>
            </GlassCard>
          </div>

          {/* IoT Biometric Gateway Monitor */}
          <div className="space-y-4">
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Biometric IoT Gateway</h3>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5">
                  <span className="text-white/60">Gateway Controller:</span>
                  <span className="font-mono text-white">ESP32-WROOM-32</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5">
                  <span className="text-white/60">IP Address:</span>
                  <span className="font-mono text-white">192.168.1.105:8443</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5">
                  <span className="text-white/60">Connected Turnstiles:</span>
                  <span className="font-bold text-white">3 (Gate 1, 2, Library)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5">
                  <span className="text-white/60">Daily Scans Synced:</span>
                  <span className="font-bold text-emerald-400">142 today</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5">
                  <span className="text-white/60">Hardware Health:</span>
                  <span className="text-cyan-400 font-semibold">99.8% Uptime</span>
                </div>
              </div>

              <button
                onClick={() => alert('Sending sync ping to RFID turnstile controller... Success! Round-trip latency: 12ms.')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Test Gateway Handshake</span>
              </button>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by action or user..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
              />
            </div>

            <span className="text-xs text-white/50">Immutable Cryptographic Audit Trail</span>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/50 font-medium">
                    <th className="py-3 px-4">Event ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Scope</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-white/50">{log.id}</td>
                      <td className="py-3 px-4 font-mono text-white/60">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white">{log.action}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-white/70 border border-white/10">
                          {log.entity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{log.user}</div>
                        <div className="text-[10px] text-white/40">{log.role}</div>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-[11px] max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
