import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatusPill } from '../components/common/StatusPill';
import { Drawer } from '../components/common/Drawer';
import { Modal } from '../components/common/Modal';
import {
  Users,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileCheck,
  CheckCircle,
  Clock,
  IdCard
} from 'lucide-react';
import { Student, Faculty } from '../types';
import { studentService } from '../services/studentService';
import { facultyService } from '../services/facultyService';

interface PeopleProps {
  students: Student[];
  faculty: Faculty[];
  onRefresh: () => void;
  selectedStudentDrawer?: Student | null;
  onCloseDrawer?: () => void;
  onOpenSalarySlipForFaculty?: (facultyId: string) => void;
}

export const People: React.FC<PeopleProps> = ({
  students,
  faculty,
  onRefresh,
  selectedStudentDrawer,
  onCloseDrawer,
  onOpenSalarySlipForFaculty
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterFee, setFilterFee] = useState('all');

  // Selected for drawer
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(selectedStudentDrawer || null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // New Student modal
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '+91 9',
    department: 'Science' as 'Science' | 'Commerce' | 'Arts',
    semester: 'Sem 1',
    class: 'PUC-I Sci A',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    category: 'General',
    attendancePct: 92,
    feeStatus: 'paid' as 'paid' | 'partial' | 'overdue',
    gpa: 8.5,
    dob: '2009-01-01',
    bloodGroup: 'O+',
    emergencyPhone: '+91 9',
    address: 'Sriramnagar, Koppal',
    fatherName: '',
    motherName: ''
  });

  const filteredStudents = students.filter(s => {
    const matchDept = filterDept === 'all' || s.department === filterDept;
    const matchFee = filterFee === 'all' || s.feeStatus === filterFee;
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchFee && matchSearch;
  });

  const filteredFaculty = faculty.filter(f => {
    const matchDept = filterDept === 'all' || f.department === filterDept;
    const matchSearch = !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.empCode.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;
    studentService.create(newStudent);
    setIsAddStudentOpen(false);
    onRefresh();
  };

  const handleExportStudents = () => {
    const csv = studentService.exportCsv(filteredStudents);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Students_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Toggle & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Enrolled Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faculty' ? 'bg-accent-cyan text-slate-900 shadow-lg shadow-cyan-500/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Faculty & Staff ({faculty.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'students' && (
            <button
              onClick={handleExportStudents}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" /> Export Roster
            </button>
          )}
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-lg shadow-accent/25"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
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
                <option value="all">All Departments</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
                {activeTab === 'faculty' && <option value="Engineering">Engineering</option>}
                {activeTab === 'faculty' && <option value="Administration">Administration</option>}
              </select>
            </div>

            {activeTab === 'students' && (
              <select
                value={filterFee}
                onChange={e => setFilterFee(e.target.value)}
                className="bg-[#070812] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="all">All Fee Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            )}
          </div>
        </div>

        {/* STUDENTS TABLE */}
        {activeTab === 'students' && (
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#070812]/95 border-b border-white/10 text-white/40 uppercase font-bold tracking-wider text-[10px] z-10">
                <tr>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Stream & Class</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4">Fees</th>
                  <th className="py-3.5 px-4">GPA</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map(st => (
                  <tr key={st.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-accent">{st.rollNo}</td>
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setSelectedStudent(st)}
                        className="font-bold text-white hover:text-accent cursor-pointer transition-colors"
                      >
                        {st.name}
                      </div>
                      <div className="text-[11px] text-white/40">{st.email}</div>
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      <div>{st.department}</div>
                      <div className="text-[11px] text-white/40">{st.class}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${st.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {st.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={st.feeStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{st.gpa}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1 rounded-xl bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent text-white text-xs font-semibold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FACULTY TABLE */}
        {activeTab === 'faculty' && (
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#070812]/95 border-b border-white/10 text-white/40 uppercase font-bold tracking-wider text-[10px] z-10">
                <tr>
                  <th className="py-3.5 px-4">Emp Code</th>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Basic Pay</th>
                  <th className="py-3.5 px-4">Leave Bal.</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFaculty.map(f => (
                  <tr key={f.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{f.empCode}</td>
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setSelectedFaculty(f)}
                        className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                      >
                        {f.name}
                      </div>
                      <div className="text-[11px] text-white/40">{f.qualification}</div>
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      <div>{f.department}</div>
                      <div className="text-[11px] text-white/40">{f.designation}</div>
                    </td>
                    <td className="py-3 px-4 text-white/70">{f.experience} yrs</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">₹{f.basicPay.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400">{f.leaveBalance} days</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedFaculty(f)}
                          className="px-3 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 text-white text-xs font-semibold transition-all"
                        >
                          Inspect
                        </button>
                        {onOpenSalarySlipForFaculty && (
                          <button
                            onClick={() => onOpenSalarySlipForFaculty(f.id)}
                            className="px-2.5 py-1 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-semibold text-xs border border-accent/30 transition-colors"
                          >
                            Payslip
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* STUDENT INSPECTOR DRAWER (Right-side drawer per §5) */}
      {selectedStudent && (
        <Drawer
          isOpen={!!selectedStudent}
          onClose={() => { setSelectedStudent(null); onCloseDrawer?.(); }}
          title={selectedStudent.name}
          subtitle={`Student Dossier • ${selectedStudent.rollNo} • ${selectedStudent.department}`}
          width="xl"
        >
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent to-accent-cyan text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-accent/30">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{selectedStudent.name}</h4>
                <p className="text-xs text-white/60">{selectedStudent.class} &bull; {selectedStudent.department}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusPill status={selectedStudent.feeStatus} size="sm" />
                  <span className={`text-xs font-bold font-mono ${selectedStudent.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedStudent.attendancePct}% Attendance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Email Address</span>
              <span className="font-semibold text-white mt-1 block">{selectedStudent.email}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Mobile Phone</span>
              <span className="font-semibold text-white mt-1 block">{selectedStudent.phone}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Date of Birth</span>
              <span className="font-semibold text-white mt-1 block">{selectedStudent.dob}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Blood Group</span>
              <span className="font-semibold text-white mt-1 block">{selectedStudent.bloodGroup}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Father's Name</span>
              <span className="font-semibold text-white mt-1 block">{selectedStudent.fatherName}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Emergency Contact</span>
              <span className="font-mono text-white mt-1 block">{selectedStudent.emergencyPhone}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
            <span className="text-white/40 block">Residential Address</span>
            <span className="text-white/90 mt-1 block">{selectedStudent.address}</span>
          </div>

          {/* ID-Card Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-accent/20 via-purple-600/10 to-accent-cyan/15 border border-accent/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-accent">
              <span className="flex items-center gap-1.5"><IdCard className="w-4 h-4" /> Smart Campus Digital ID Card</span>
              <span>VALID AY 2026-27</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-white text-sm">{selectedStudent.name}</div>
                <div className="text-white/60 font-mono text-[11px]">{selectedStudent.rollNo}</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-white p-1">
                <div className="w-full h-full bg-slate-900 rounded grid grid-cols-3 gap-0.5 p-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[1px]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* FACULTY INSPECTOR DRAWER */}
      {selectedFaculty && (
        <Drawer
          isOpen={!!selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
          title={selectedFaculty.name}
          subtitle={`Faculty Profile • ${selectedFaculty.empCode} • ${selectedFaculty.department}`}
          width="xl"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 font-extrabold text-2xl flex items-center justify-center border border-cyan-500/30">
              {selectedFaculty.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{selectedFaculty.name}</h4>
              <p className="text-xs text-white/60">{selectedFaculty.designation} &bull; {selectedFaculty.department}</p>
              <div className="mt-2 text-xs font-semibold text-emerald-400">
                ₹{selectedFaculty.basicPay.toLocaleString('en-IN')} Basic Pay &bull; {selectedFaculty.experience} yrs exp
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">PAN</span>
              <span className="font-mono text-white mt-1 block">{selectedFaculty.pan}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">UAN</span>
              <span className="font-mono text-white mt-1 block">{selectedFaculty.uan}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">Bank Account</span>
              <span className="font-mono text-white mt-1 block">{selectedFaculty.bankAccount}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40 block">IFSC</span>
              <span className="font-mono text-white mt-1 block">{selectedFaculty.ifsc}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
            <span className="text-white/40 block mb-2 font-semibold uppercase">Assigned Subjects</span>
            <div className="flex flex-wrap gap-2">
              {selectedFaculty.assignedSubjects.map((sub, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </Drawer>
      )}

      {/* ADD STUDENT MODAL */}
      {isAddStudentOpen && (
        <Modal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          title="Enroll New Student"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Ramesh Nayak"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Email *</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="ramesh@akrdevi.edu"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Stream</label>
                <select
                  value={newStudent.department}
                  onChange={e => setNewStudent({ ...newStudent, department: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#070812] border border-white/15 text-white focus:outline-none"
                >
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Class Section</label>
                <input
                  type="text"
                  value={newStudent.class}
                  onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Phone</label>
                <input
                  type="text"
                  value={newStudent.phone}
                  onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/25"
              >
                Enroll Student
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
