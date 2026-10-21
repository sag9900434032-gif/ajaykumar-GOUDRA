import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatusPill } from '../components/common/StatusPill';
import { Modal } from '../components/common/Modal';
import { initialCourses, initialStudents } from '../data/seedData';
import { Course } from '../types';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  Users,
  Search,
  Download,
  FileCheck,
  Clock,
  Sparkles,
  School,
  CheckCircle2
} from 'lucide-react';

export const Academics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'timetable' | 'exams' | 'certificates'>('courses');
  const [courses] = useState<Course[]>(initialCourses);
  const [selectedClass, setSelectedClass] = useState('PUC-I Sci A');
  const [examSearch, setExamSearch] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<typeof initialStudents[0] | null>(null);
  const [certType, setCertType] = useState<'bonafide' | 'transfer' | 'merit'>('bonafide');
  const [showCertModal, setShowCertModal] = useState(false);

  // Timetable seed structure
  const timetableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { num: 1, time: '09:00 - 10:00' },
    { num: 2, time: '10:00 - 11:00' },
    { num: 3, time: '11:15 - 12:15' },
    { num: 4, time: '12:15 - 01:15' },
    { num: 5, time: '02:00 - 03:00' },
    { num: 6, time: '03:00 - 04:00' }
  ];

  const timetableSchedule: Record<string, { subject: string; teacher: string; room: string }[]> = {
    Monday: [
      { subject: 'Physics (Optics)', teacher: 'Dr. Rajesh Kumar', room: 'Lab 1' },
      { subject: 'Chemistry (Organic)', teacher: 'Dr. Priya Sharma', room: 'Room 204' },
      { subject: 'Mathematics (Calculus)', teacher: 'Mr. Vikramjit Singh', room: 'Room 204' },
      { subject: 'Biology (Genetics)', teacher: 'Dr. Shweta Iyer', room: 'Bio Lab' },
      { subject: 'English Communication', teacher: 'Dr. Meera Nambiar', room: 'Room 204' },
      { subject: 'Computer Applications', teacher: 'Mr. Suresh Rao', room: 'Comp Lab 2' }
    ],
    Tuesday: [
      { subject: 'Mathematics (Algebra)', teacher: 'Mr. Vikramjit Singh', room: 'Room 204' },
      { subject: 'Physics Lab Practical', teacher: 'Dr. Rajesh Kumar', room: 'Physics Lab' },
      { subject: 'Physics Lab Practical', teacher: 'Mr. Chetan Kulkarni', room: 'Physics Lab' },
      { subject: 'Chemistry (Inorganic)', teacher: 'Dr. Padmavati Rao', room: 'Room 204' },
      { subject: 'Kannada Literature', teacher: 'Mrs. Rekha Nadiger', room: 'Room 204' },
      { subject: 'Tutorial & Mentorship', teacher: 'Dr. Rajesh Kumar', room: 'Room 204' }
    ],
    Wednesday: [
      { subject: 'Chemistry Lab', teacher: 'Dr. Priya Sharma', room: 'Chem Lab' },
      { subject: 'Chemistry Lab', teacher: 'Dr. Padmavati Rao', room: 'Chem Lab' },
      { subject: 'Physics (Mechanics)', teacher: 'Mr. Chetan Kulkarni', room: 'Room 204' },
      { subject: 'Mathematics (Vectors)', teacher: 'Mr. Vikramjit Singh', room: 'Room 204' },
      { subject: 'Biology (Anatomy)', teacher: 'Mrs. Kavita Joshi', room: 'Bio Lab' },
      { subject: 'Library & Research', teacher: 'Librarian', room: 'Central Library' }
    ],
    Thursday: [
      { subject: 'Biology (Physiology)', teacher: 'Dr. Shweta Iyer', room: 'Room 204' },
      { subject: 'Mathematics (Statistics)', teacher: 'Dr. Geeta Hosmani', room: 'Room 204' },
      { subject: 'Physics (Thermodynamics)', teacher: 'Dr. Rajesh Kumar', room: 'Room 204' },
      { subject: 'Chemistry (Physical)', teacher: 'Dr. Priya Sharma', room: 'Room 204' },
      { subject: 'Sports & Wellness', teacher: 'Coach Anand', room: 'Sports Ground' },
      { subject: 'Doubt Clearing Session', teacher: 'All Faculty', room: 'Seminar Hall' }
    ],
    Friday: [
      { subject: 'Computer Science Practical', teacher: 'Mr. Suresh Rao', room: 'Comp Lab 1' },
      { subject: 'Computer Science Practical', teacher: 'Mr. Kiran R.', room: 'Comp Lab 1' },
      { subject: 'Physics (Modern Physics)', teacher: 'Dr. Rajesh Kumar', room: 'Room 204' },
      { subject: 'Chemistry (Polymers)', teacher: 'Dr. Priya Sharma', room: 'Room 204' },
      { subject: 'Value Education', teacher: 'Prof. Anil Mehta', room: 'Auditorium' },
      { subject: 'Weekly Assessment', teacher: 'Exam Cell', room: 'Room 204' }
    ],
    Saturday: [
      { subject: 'Mathematics Revision', teacher: 'Mr. Vikramjit Singh', room: 'Room 204' },
      { subject: 'Physics Seminar', teacher: 'Dr. Rajesh Kumar', room: 'AV Room' },
      { subject: 'Career Guidance & NEET/KCET', teacher: 'Guest Lecturer', room: 'Auditorium' },
      { subject: 'Club Activities & Arts', teacher: 'Club Incharges', room: 'Campus Quad' },
      { subject: 'Campus Dispersal', teacher: 'Staff', room: 'Main Gate' },
      { subject: 'Faculty Meeting', teacher: 'Principal', room: 'Council Room' }
    ]
  };

  // Exam mock records
  const examRecords = initialStudents.slice(0, 18).map((s, idx) => ({
    studentId: s.id,
    rollNo: s.rollNo,
    name: s.name,
    class: s.class,
    physics: 70 + ((idx * 13) % 29),
    chemistry: 72 + ((idx * 11) % 27),
    maths: 68 + ((idx * 17) % 31),
    biologyOrCs: 75 + ((idx * 9) % 24),
    gpa: s.gpa,
    rank: idx + 1,
    status: s.gpa >= 8.5 ? 'Distinction' : (s.gpa >= 7.0 ? 'First Class' : 'Pass')
  }));

  const filteredExams = examRecords.filter(r =>
    r.name.toLowerCase().includes(examSearch.toLowerCase()) ||
    r.rollNo.toLowerCase().includes(examSearch.toLowerCase())
  );

  const handleOpenCertificate = (student: typeof initialStudents[0], type: 'bonafide' | 'transfer' | 'merit') => {
    setSelectedStudentForCert(student);
    setCertType(type);
    setShowCertModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              ACADEMIC INTELLIGENCE
            </span>
            <span className="text-white/40 text-xs">• Semester 1 & 3</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Curriculum, Timetables & Examinations</h1>
          <p className="text-xs text-white/50">Manage streams, schedule grid, student grade evaluations, and verifiable credentials.</p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'courses' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Programs ({courses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'timetable' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'exams' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Exams & GPA</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'certificates' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/60 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Certificates</span>
          </button>
        </div>
      </div>

      {/* TAB 1: COURSES & PROGRAMS */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <GlassCard key={course.id} className="p-5 flex flex-col justify-between hover:border-white/30 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-accent/20 text-accent font-mono text-xs font-bold border border-accent/30">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-medium text-white/50">{course.credits} Credits</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {course.name}
                  </h3>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Department:</span>
                      <span className="text-white font-medium">{course.department}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Faculty Lead:</span>
                      <span className="text-white font-medium truncate max-w-[140px]">{course.facultyInCharge}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Enrollment:</span>
                      <span className="text-emerald-400 font-semibold">{course.totalStudents} Active Students</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Syllabus: 68%</span>
                  </div>
                  <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-accent-cyan rounded-full w-[68%]" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Department Statistics Glass Card */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Academic Stream Distribution & Performance Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Science Stream (PUC I & II)</span>
                  <span className="text-xs font-bold text-accent">220 Enrolled</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">91.4% <span className="text-xs text-emerald-400 font-normal">Pass Rate</span></div>
                <p className="text-[11px] text-white/40">Includes PCMB and PCMC combinations. Top faculty lead: Dr. Rajesh Kumar.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Commerce Stream (PUC I & II)</span>
                  <span className="text-xs font-bold text-cyan-400">110 Enrolled</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">94.8% <span className="text-xs text-emerald-400 font-normal">Pass Rate</span></div>
                <p className="text-[11px] text-white/40">EBAC combination. Top department faculty: Dr. Sunita Patil & Dr. Latha Reddy.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Arts Stream (PUC I & II)</span>
                  <span className="text-xs font-bold text-purple-400">65 Enrolled</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">89.2% <span className="text-xs text-emerald-400 font-normal">Pass Rate</span></div>
                <p className="text-[11px] text-white/40">HEPS combination. Led by Prof. Anil Mehta with high humanities engagement.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: INTERACTIVE WEEKLY TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <h4 className="text-xs font-bold text-white">Active Class Schedule Matrix</h4>
                <p className="text-[11px] text-white/50">Weekly schedule with teacher assignments and allocated laboratory rooms.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Select Class:</span>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-accent"
              >
                <option value="PUC-I Sci A" className="bg-[#070812]">PUC-I Science A (PCMB)</option>
                <option value="PUC-I Sci B" className="bg-[#070812]">PUC-I Science B (PCMC)</option>
                <option value="PUC-II Com A" className="bg-[#070812]">PUC-II Commerce A (EBAC)</option>
                <option value="PUC-I Arts" className="bg-[#070812]">PUC-I Arts (HEPS)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[850px] space-y-3">
              {/* Header row with periods */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-white/50 px-2">
                <div className="text-left font-bold text-white/70">Day / Period</div>
                {periods.map(p => (
                  <div key={p.num} className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-white font-bold">P{p.num}</div>
                    <div className="text-[10px] text-white/40">{p.time}</div>
                  </div>
                ))}
              </div>

              {/* Day rows */}
              {timetableDays.map(day => (
                <div key={day} className="grid grid-cols-7 gap-2 items-stretch">
                  <div className="flex items-center p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white">
                    {day}
                  </div>
                  {timetableSchedule[day].map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                          {slot.subject}
                        </div>
                        <div className="text-[10px] text-white/50 truncate mt-1">{slot.teacher}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[9px] text-white/40 pt-1 border-t border-white/5">
                        <span className="font-mono">{slot.room}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXAM RESULTS & GPA */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or roll number..."
                value={examSearch}
                onChange={e => setExamSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">Mid-Term Board Mock 2026</span>
              <button
                onClick={() => alert('Exporting Official Merit List (PDF)...')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Merit List</span>
              </button>
            </div>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/50 font-medium">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student & Roll No</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Physics / Acc</th>
                    <th className="py-3 px-4 text-center">Chem / Bus</th>
                    <th className="py-3 px-4 text-center">Maths / Eco</th>
                    <th className="py-3 px-4 text-center">Bio / CS / Hist</th>
                    <th className="py-3 px-4 text-center">GPA</th>
                    <th className="py-3 px-4 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredExams.map((record) => (
                    <tr key={record.studentId} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          record.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                          (record.rank <= 3 ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40' : 'text-white/40')
                        }`}>
                          #{record.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{record.name}</div>
                        <div className="text-[10px] font-mono text-white/40">{record.rollNo}</div>
                      </td>
                      <td className="py-3 px-4 text-white/70">{record.class}</td>
                      <td className="py-3 px-4 text-center font-mono text-white/90">{record.physics}/100</td>
                      <td className="py-3 px-4 text-center font-mono text-white/90">{record.chemistry}/100</td>
                      <td className="py-3 px-4 text-center font-mono text-white/90">{record.maths}/100</td>
                      <td className="py-3 px-4 text-center font-mono text-white/90">{record.biologyOrCs}/100</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-accent font-mono text-sm">{record.gpa.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StatusPill status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 4: CERTIFICATES & CREDENTIALS */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent" />
                Institutional Certificate Generation Cell
              </h3>
              <p className="text-xs text-white/50">Issue verified Bonafide, Transfer (TC), and Merit Certificates with cryptographically stamped seals.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Karnataka State PU Board Seal Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialStudents.slice(0, 6).map((student) => (
              <GlassCard key={student.id} className="p-5 flex flex-col justify-between hover:border-white/30 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-white/40">{student.rollNo}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Verified Enrolled</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{student.name}</h4>
                  <p className="text-xs text-white/60 mt-0.5">{student.class} • {student.department}</p>
                  <div className="mt-3 text-[11px] text-white/40 space-y-1">
                    <div>Guardian: {student.fatherName}</div>
                    <div>Attendance: <span className="text-white font-medium">{student.attendancePct}%</span></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCertificate(student, 'bonafide')}
                    className="flex-1 py-1.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-[11px] font-semibold text-accent transition-all text-center"
                  >
                    Bonafide
                  </button>
                  <button
                    onClick={() => handleOpenCertificate(student, 'transfer')}
                    className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-medium text-white transition-all text-center"
                  >
                    TC Doc
                  </button>
                  <button
                    onClick={() => handleOpenCertificate(student, 'merit')}
                    className="flex-1 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-medium text-amber-300 transition-all text-center"
                  >
                    Merit
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && selectedStudentForCert && (
        <Modal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          title="Verifiable Institutional Certificate"
          maxWidth="lg"
        >
          <div className="p-6 bg-white text-slate-900 rounded-2xl font-serif space-y-6 border-4 border-amber-600/30 shadow-2xl relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <School className="w-80 h-80 text-black" />
            </div>

            {/* Header */}
            <div className="text-center border-b-2 border-slate-900/20 pb-4">
              <p className="text-[10px] tracking-widest font-sans font-bold uppercase text-slate-600">
                Government of Karnataka • Department of Pre-University Education
              </p>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase font-serif">
                AKRDevi Memorial PU College
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Affiliation Code: KA-KOP-PU-4402 • Sriramnagar, Koppal District, Karnataka - 583282
              </p>
            </div>

            {/* Title */}
            <div className="text-center">
              <span className="inline-block px-4 py-1 border-b-2 border-t-2 border-slate-900 font-sans font-extrabold text-sm uppercase tracking-wider text-slate-900">
                {certType === 'bonafide' ? 'STUDY / BONAFIDE CERTIFICATE' :
                 (certType === 'transfer' ? 'TRANSFER CERTIFICATE (TC)' : 'MERIT SCHOLASTIC CERTIFICATE')}
              </span>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-800">
              <p>
                This is to certify that <strong className="text-slate-900 underline underline-offset-4">{selectedStudentForCert.name}</strong>,
                bearing Roll Number <strong className="font-mono">{selectedStudentForCert.rollNo}</strong>,
                son/daughter of <strong className="text-slate-900">{selectedStudentForCert.fatherName}</strong> and <strong className="text-slate-900">{selectedStudentForCert.motherName}</strong>,
                is a bonafide registered student of this institution studying in <strong>{selectedStudentForCert.class}</strong> ({selectedStudentForCert.department} Department)
                for the Academic Session <strong>2026 - 2027</strong>.
              </p>
              <p>
                As per institutional records, their registered Date of Birth is <strong>{selectedStudentForCert.dob}</strong> and their scholastic attendance record stands at <strong>{selectedStudentForCert.attendancePct}%</strong>.
                Their conduct and moral character during the stay at this college have been found to be <strong>Exemplary / Very Good</strong>.
              </p>
              {certType === 'merit' && (
                <p className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                  ★ Awarded Distinction Honors for securing high scholastic rank with a Cumulative Grade Point Average (GPA) of <strong>{selectedStudentForCert.gpa}</strong>.
                </p>
              )}
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 flex items-end justify-between font-sans text-xs border-t border-slate-900/10">
              <div>
                <p className="text-[10px] text-slate-500">Date of Issue: 21 October 2026</p>
                <p className="text-[10px] text-slate-500">Place: Koppal, Karnataka</p>
                <div className="mt-2 w-16 h-16 border-2 border-dashed border-red-400 rounded-full flex items-center justify-center text-[9px] font-bold text-red-500 transform -rotate-12">
                  SEAL
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-900 mb-1" />
                <p className="font-bold text-slate-900">Dr. Padmavati Rao</p>
                <p className="text-[10px] text-slate-500">Principal & Head of Institution</p>
              </div>
            </div>

            {/* Print button */}
            <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 font-sans">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
