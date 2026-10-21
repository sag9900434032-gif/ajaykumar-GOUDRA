import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/shell/Sidebar';
import { Topbar } from './components/shell/Topbar';
import { CommandPalette } from './components/common/CommandPalette';
import { Drawer } from './components/common/Drawer';
import { Role, Student, Faculty } from './types';
import { authService, DEMO_USERS } from './services/authService';
import { studentService } from './services/studentService';
import { facultyService } from './services/facultyService';
import { attendanceService } from './services/attendanceService';
import { payrollService } from './services/payrollService';
import { initialAuditLogs } from './data/seedData';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Payroll } from './pages/Payroll';
import { People } from './pages/People';
import { Academics } from './pages/Academics';
import { Admissions } from './pages/Admissions';
import { Finance } from './pages/Finance';
import { Reports } from './pages/Reports';
import { System } from './pages/System';
import { Login } from './pages/Login';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>(authService.getCurrentRole());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Core Data State
  const [students, setStudents] = useState<Student[]>(studentService.getAll());
  const [faculty, setFaculty] = useState<Faculty[]>(facultyService.getAll());
  const [attendanceRecords, setAttendanceRecords] = useState(attendanceService.getTodayRecords());
  const [payrollRuns, setPayrollRuns] = useState(payrollService.getPayrollRuns());
  const [salarySlips, setSalarySlips] = useState(payrollService.getAllSlips());
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  // Inspector Drawer for Student
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);

  // Synchronize role change
  const handleRoleChange = (role: Role) => {
    const updatedUser = authService.setRole(role);
    setCurrentRole(role);
    setCurrentUser(updatedUser);

    // If active page is now forbidden for new role (e.g. Finance for faculty/student), navigate to dashboard
    const permissions = authService.getPermissions();
    if (currentPage === 'finance' && !permissions.canViewFinance) {
      setCurrentPage('dashboard');
    }
  };

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme synchronization
  const handleToggleTheme = () => {
    setIsDarkTheme(prev => {
      const nextTheme = !prev;
      if (!nextTheme) {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      return nextTheme;
    });
  };

  // Quick Action Handler from Dashboard shortcuts
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'view_admissions':
      case 'admissions':
        setCurrentPage('admissions');
        break;
      case 'mark_attendance':
      case 'view_defaulters':
        setCurrentPage('attendance');
        break;
      case 'run_payroll':
      case 'view_slips':
        setCurrentPage('payroll');
        break;
      case 'add_student':
      case 'view_students':
        setCurrentPage('people');
        break;
      case 'collect_fee':
        setCurrentPage('finance');
        break;
      case 'export_reports':
        setCurrentPage('reports');
        break;
      default:
        break;
    }
  };

  const handleUpdateAttendanceRecord = (id: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    attendanceService.updateRecordStatus(id, status);
    setAttendanceRecords([...attendanceService.getTodayRecords()]);
  };

  const handleRefreshData = () => {
    setStudents(studentService.getAll());
    setFaculty(facultyService.getAll());
    setAttendanceRecords(attendanceService.getTodayRecords());
    setPayrollRuns(payrollService.getPayrollRuns());
    setSalarySlips(payrollService.getAllSlips());
  };

  // Unauthenticated screen
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(role) => {
          handleRoleChange(role);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className={`aurora-canvas min-h-screen text-white relative selection:bg-accent/30 selection:text-white ${!isDarkTheme ? 'light-theme' : ''}`}>
      {/* 3 Slow-floating blurred glowing blobs behind content */}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* App Shell Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col min-h-screen ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Sticky Glass Topbar */}
        <Topbar
          currentPage={currentPage}
          currentUser={currentUser}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isDarkTheme={isDarkTheme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto relative z-10 animate-in fade-in duration-300">
          {currentPage === 'dashboard' && (
            <Dashboard
              students={students}
              faculty={faculty}
              attendanceRecords={attendanceRecords}
              payrollRuns={payrollRuns}
              auditLogs={auditLogs}
              onNavigate={setCurrentPage}
              onQuickAction={handleQuickAction}
            />
          )}

          {currentPage === 'attendance' && (
            <Attendance
              students={students}
              records={attendanceRecords}
              onUpdateRecord={handleUpdateAttendanceRecord}
              onSelectStudent={(s) => setSelectedStudentForDrawer(s)}
            />
          )}

          {currentPage === 'payroll' && (
            <Payroll
              faculty={faculty}
              payrollRuns={payrollRuns}
              salarySlips={salarySlips}
              currentRole={currentRole}
              onRefresh={handleRefreshData}
            />
          )}

          {currentPage === 'people' && (
            <People
              students={students}
              faculty={faculty}
              onRefresh={handleRefreshData}
              selectedStudentDrawer={selectedStudentForDrawer}
              onCloseDrawer={() => setSelectedStudentForDrawer(null)}
              onOpenSalarySlipForFaculty={(_facId) => {
                setCurrentPage('payroll');
              }}
            />
          )}

          {currentPage === 'admissions' && (
            <Admissions
              onStudentEnrolled={(newStudent) => {
                setStudents(prev => [newStudent, ...prev]);
              }}
            />
          )}

          {currentPage === 'academics' && <Academics />}

          {currentPage === 'finance' && <Finance />}

          {currentPage === 'reports' && <Reports />}

          {currentPage === 'system' && <System />}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-white/10 py-4 px-6 text-center text-xs text-white/40 glass-panel bg-[#070812]/40 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>AURORA Campus OS • AKRDevi Memorial PU College • Affiliation KA-KOP-PU-4402</span>
            <div className="flex items-center gap-4 text-white/50">
              <button onClick={() => setIsCommandPaletteOpen(true)} className="hover:text-white transition-colors">
                Command Palette (⌘K)
              </button>
              <span>•</span>
              <button onClick={() => setIsAuthenticated(false)} className="hover:text-rose-400 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsCommandPaletteOpen(false);
        }}
        students={students}
        faculty={faculty}
        onSelectStudent={(s) => {
          setSelectedStudentForDrawer(s);
          setCurrentPage('people');
          setIsCommandPaletteOpen(false);
        }}
        onSelectFaculty={(_f) => {
          setCurrentPage('people');
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Slide-out Inspector Drawer (Global) */}
      {selectedStudentForDrawer && (
        <Drawer
          isOpen={Boolean(selectedStudentForDrawer)}
          onClose={() => setSelectedStudentForDrawer(null)}
          title={`Student Profile — ${selectedStudentForDrawer.name}`}
          width="md"
        >
          <div className="space-y-5 text-xs text-white">
            {/* Student Header */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-accent-cyan flex items-center justify-center text-lg font-bold">
                {selectedStudentForDrawer.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm">{selectedStudentForDrawer.name}</h4>
                <p className="text-white/50 font-mono text-[11px]">{selectedStudentForDrawer.rollNo}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold text-[10px]">
                  {selectedStudentForDrawer.class}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Attendance</span>
                <span className={`text-base font-bold font-mono ${
                  selectedStudentForDrawer.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {selectedStudentForDrawer.attendancePct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Current GPA</span>
                <span className="text-base font-bold text-accent font-mono">{selectedStudentForDrawer.gpa} / 10.0</span>
              </div>
            </div>

            {/* Detailed Info Rows */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px]">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Department:</span>
                <span className="font-semibold">{selectedStudentForDrawer.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Fee Status:</span>
                <span className="font-semibold uppercase text-emerald-400">{selectedStudentForDrawer.feeStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Father / Guardian:</span>
                <span className="font-medium">{selectedStudentForDrawer.fatherName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Emergency Contact:</span>
                <span className="font-mono text-cyan-300">{selectedStudentForDrawer.emergencyPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Date of Birth:</span>
                <span className="font-mono">{selectedStudentForDrawer.dob}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Blood Group:</span>
                <span className="font-mono font-bold text-rose-400">{selectedStudentForDrawer.bloodGroup}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setSelectedStudentForDrawer(null);
                  setCurrentPage('academics');
                }}
                className="flex-1 py-2 rounded-xl bg-accent text-white font-semibold text-xs text-center shadow-lg shadow-accent/25 hover:opacity-90 transition-all"
              >
                View Academics
              </button>
              <button
                onClick={() => {
                  setSelectedStudentForDrawer(null);
                  setCurrentPage('finance');
                }}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs text-center hover:bg-white/15 transition-all"
              >
                Fee Ledger
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default App;
