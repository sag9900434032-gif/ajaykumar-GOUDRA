import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Role } from '../types';
import { DEMO_USERS } from '../services/authService';
import campusImg from '../assets/college-campus.jpg';
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface LoginProps {
  onLogin: (role: Role) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@akrdevi.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('super_admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const personas: { role: Role; label: string; desc: string; color: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Full institutional root access', color: 'from-blue-600 to-indigo-600' },
    { role: 'principal', label: 'Principal', desc: 'Dr. Padmavati Rao (Academic head)', color: 'from-cyan-600 to-blue-600' },
    { role: 'hod', label: 'HOD Science', desc: 'Dr. Rajesh Kumar (Department lead)', color: 'from-emerald-600 to-teal-600' },
    { role: 'accountant', label: 'Finance Officer', desc: 'Pradeep Gaddi (Treasury & payroll)', color: 'from-amber-600 to-orange-600' },
    { role: 'faculty', label: 'Faculty Member', desc: 'Dr. Priya Sharma (Chemistry)', color: 'from-purple-600 to-pink-600' },
    { role: 'student', label: 'Student', desc: 'Ravi Kumar (#2026-SCI-01)', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-20 md:pt-4 relative overflow-hidden bg-[#060B18]">
      {/* High-Resolution College Campus Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 20%, rgba(37, 99, 235, 0.32) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(245, 158, 11, 0.22) 0%, transparent 50%),
            linear-gradient(180deg, rgba(6, 11, 24, 0.70) 0%, rgba(6, 11, 24, 0.84) 55%, rgba(6, 11, 24, 0.96) 100%),
            url(${campusImg})
          `,
          backgroundPosition: 'center 36%',
          filter: 'contrast(1.18) brightness(1.05) saturate(1.25)',
        }}
      />

      {/* Subtle Ambient Glowing Blobs */}
      <div className="blob blob-1 opacity-20 pointer-events-none" />
      <div className="blob blob-2 opacity-15 pointer-events-none" />

      {/* Top Header Bar with Public College Portal References */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between">
        <a
          href="../index.html"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold backdrop-blur-xl transition-all shadow-lg hover:scale-105"
          title="Return to Main College Website"
        >
          <ArrowLeft className="w-4 h-4 text-[#F59E0B]" />
          <span>← Public College Portal</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
            Sriramnagar Main Campus · Code: RK0112
          </span>
          <a
            href="../admission-portal.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md hover:bg-emerald-500/25 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Admissions Live <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </header>

      {/* Center Interactive Login Container */}
      <div className="w-full max-w-4xl z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Hero Branding Column */}
        <div className="md:col-span-5 space-y-6 text-left p-6 sm:p-8 rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-semibold text-white tracking-wider uppercase">Next-Gen Campus OS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              <MapPin className="w-3 h-3 text-[#F59E0B]" /> Sriramnagar
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center shadow-xl shadow-blue-600/40 text-white">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">AURORA</h1>
                <p className="text-xs text-white/70 font-medium">AKR Devi Memorial PU College</p>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed mt-4">
              Unified enterprise administration suite for Sriramnagar Campus. Real-time biometric attendance telemetry, automated payroll governance, and state board PU admissions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>WCAG 2.1 AA & Zero-Trust RBAC Architecture</span>
            </div>
            <p className="text-[11px] text-white/50">
              Select any institutional role on the right to preview specialized access permissions and dashboard telemetry.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Public Portal Synchronized</span>
            <a href="../index.html" className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1">
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Glass Login Card */}
        <div className="md:col-span-7">
          <GlassCard className="p-6 md:p-8 space-y-6 bg-slate-900/85 border-white/15 backdrop-blur-2xl shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Institutional Single Sign-On</h2>
              <p className="text-xs text-white/50 mt-1">Select a demo persona or authenticate with institutional credentials.</p>
            </div>

            {/* Persona Quick Picker Grid */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                Quick 1-Click Persona Login
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {personas.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(p.role);
                        setEmail(DEMO_USERS[p.role].email);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-blue-600/25 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{p.label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 truncate">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Password / Security Key</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-white/60 hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded bg-white/10 border-white/20 text-blue-600" />
                  <span>Remember Session</span>
                </label>
                <a href="#reset" onClick={e => { e.preventDefault(); alert('Password reset link sent to institutional email.'); }} className="text-amber-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Enter AURORA Control Panel</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
