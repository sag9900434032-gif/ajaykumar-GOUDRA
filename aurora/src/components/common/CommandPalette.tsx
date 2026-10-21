import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, DollarSign, FileText, Settings, BookOpen, ArrowRight } from 'lucide-react';
import { Student, Faculty } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  students: Student[];
  faculty: Faculty[];
  onSelectStudent: (s: Student) => void;
  onSelectFaculty: (f: Faculty) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  students,
  faculty,
  onSelectStudent,
  onSelectFaculty
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pages = [
    { id: 'dashboard', name: 'Overview Dashboard', icon: FileText, category: 'Pages' },
    { id: 'admissions', name: 'Admissions & Student Intake Pipeline', icon: Users, category: 'Pages' },
    { id: 'attendance', name: 'Attendance Live Monitor & Defaulters', icon: Calendar, category: 'Pages' },
    { id: 'payroll', name: 'Payroll Runs & Salary Slips', icon: DollarSign, category: 'Pages' },
    { id: 'people', name: 'Students & Faculty Records', icon: Users, category: 'Pages' },
    { id: 'academics', name: 'Courses, Timetable & Exams', icon: BookOpen, category: 'Pages' },
    { id: 'finance', name: 'Fee Ledger & Collections', icon: DollarSign, category: 'Pages' },
    { id: 'reports', name: 'Reports & Analytics Export', icon: FileText, category: 'Pages' },
    { id: 'system', name: 'RBAC & System Settings', icon: Settings, category: 'Pages' },
  ];

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) || s.rollNo.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase()) || f.department.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel bg-[#070812]/90 border border-white/20 shadow-2xl rounded-3xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-accent" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, student name, or page... (Esc to close)"
            className="w-full bg-transparent border-none text-white placeholder-white/40 focus:outline-none text-base"
            autoFocus
          />
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50 border border-white/10">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider px-3 mb-2">Navigation</div>
              <div className="space-y-1">
                {filteredPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => { onNavigate(page.id); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent/20 text-accent transition-colors">
                        <page.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-white">{page.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider px-3 mb-2">Students</div>
              <div className="space-y-1">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => { onSelectStudent(student); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-xs text-white/40">{student.rollNo} • {student.department}</div>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold">{student.attendancePct}% Att.</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredFaculty.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider px-3 mb-2">Faculty</div>
              <div className="space-y-1">
                {filteredFaculty.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { onSelectFaculty(f); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{f.name}</div>
                        <div className="text-xs text-white/40">{f.designation} • {f.department}</div>
                      </div>
                    </div>
                    <div className="text-xs text-white/50">{f.empCode}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
