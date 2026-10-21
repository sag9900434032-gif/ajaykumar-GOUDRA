import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Users,
  GraduationCap,
  PieChart,
  FileBarChart,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  School,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { Role } from '../../types';
import { authService } from '../../services/authService';
import clsx from 'clsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentRole: Role;
  onRoleChange: (r: Role) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  currentRole,
  onRoleChange
}) => {
  const permissions = authService.getPermissions();

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, visible: true },
        { id: 'attendance', label: 'Attendance Live', icon: CalendarCheck, visible: permissions.canManageAttendance || currentRole === 'student' }
      ]
    },
    {
      group: 'STUDENTS & ADMISSIONS',
      items: [
        { id: 'admissions', label: 'Admissions Intake', icon: UserCheck, visible: true },
        { id: 'people', label: 'Students & Faculty', icon: Users, visible: permissions.canManageStudents || permissions.canManageFaculty },
      ]
    },
    {
      group: 'ACADEMICS',
      items: [
        { id: 'academics', label: 'Courses & Exams', icon: GraduationCap, visible: permissions.canManageAcademics || currentRole === 'student' }
      ]
    },
    {
      group: 'FINANCE & PAYROLL',
      items: [
        { id: 'payroll', label: 'Payroll & Slips', icon: CreditCard, visible: permissions.canRunPayroll || currentRole === 'faculty' },
        { id: 'finance', label: 'Fee Management', icon: PieChart, visible: permissions.canViewFinance } // Visibly hidden for faculty per RBAC rules!
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: FileBarChart, visible: permissions.canGenerateReports },
        { id: 'system', label: 'RBAC & Config', icon: ShieldAlert, visible: permissions.canAccessSystemSettings || currentRole === 'super_admin' }
      ]
    }
  ];

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 bottom-0 z-40 glass-panel border-r border-white/15 bg-[#070812]/80 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* 1px Inner Highlight */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10 pointer-events-none" />

      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white shrink-0">
              <School className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-base tracking-tight text-white">AURORA</h1>
                  <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-[10px] font-bold text-accent border border-accent/30">PRO</span>
                </div>
                <p className="text-[11px] text-white/50 truncate">AKRDevi PU College</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navGroups.map((grp, gIdx) => {
            const visibleItems = grp.items.filter(i => i.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-extrabold tracking-wider text-white/35 uppercase mb-1.5">
                    {grp.group}
                  </div>
                )}
                {visibleItems.map(item => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={clsx(
                        'w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all relative group',
                        isActive
                          ? 'bg-accent/25 text-white shadow-lg shadow-accent/20 border border-accent/40'
                          : 'text-white/65 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-accent shadow-[0_0_12px_#2563EB]" />
                      )}

                      <Icon
                        className={clsx(
                          'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                          isActive ? 'text-accent' : 'text-white/60'
                        )}
                      />

                      {!isCollapsed && (
                        <span className="truncate tracking-wide">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Switcher & Profile Footer */}
      <div className="p-3 border-t border-white/10 bg-black/20 space-y-2">
        <a
          href="../index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 transition-all',
            isCollapsed && 'justify-center px-0'
          )}
          title="Open Public College Website"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Public College Portal</span>}
        </a>

        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" /> Active Role
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono font-bold capitalize">
                {currentRole.replace('_', ' ')}
              </span>
            </div>
            <select
              value={currentRole}
              onChange={e => onRoleChange(e.target.value as Role)}
              className="w-full bg-[#060A16] text-xs font-medium text-white/90 border border-white/15 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="super_admin">👑 Super Admin</option>
              <option value="principal">🎓 Principal</option>
              <option value="hod">🔬 HOD (Science)</option>
              <option value="accountant">💰 Accountant</option>
              <option value="faculty">👩‍🏫 Faculty</option>
              <option value="student">🎒 Student</option>
            </select>
          </div>
        ) : (
          <div
            title={`Role: ${currentRole}`}
            className="w-10 h-10 mx-auto rounded-xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center text-xs font-bold"
          >
            {currentRole[0].toUpperCase()}
          </div>
        )}
      </div>
    </aside>
  );
};
