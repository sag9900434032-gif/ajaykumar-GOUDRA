import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { StatusPill } from '../components/common/StatusPill';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { AdmissionApplication, Student } from '../types';
import { admissionService } from '../services/admissionService';
import { studentService } from '../services/studentService';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  School,
  FileText,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Send
} from 'lucide-react';

interface AdmissionsProps {
  onStudentEnrolled?: (student: Student) => void;
}

export const Admissions: React.FC<AdmissionsProps> = ({ onStudentEnrolled }) => {
  const [applications, setApplications] = useState<AdmissionApplication[]>(admissionService.getAllSync());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New application manual entry state
  const [newApplicant, setNewApplicant] = useState({
    fullName: '',
    email: '',
    phone: '',
    stream: 'Science',
    course: 'PUC Science - PCMB',
    sslcScore: 85,
    fatherName: '',
    category: 'General'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshApplications = async () => {
    const list = await admissionService.getAll();
    setApplications([...list]);
  };

  useEffect(() => {
    refreshApplications();

    // Listen to real-time events from main website or storage changes
    const handleUpdate = () => {
      refreshApplications();
    };

    window.addEventListener('aurora_admissions_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Auto-poll every 6 seconds to capture submissions from the main website
    const interval = setInterval(refreshApplications, 6000);

    return () => {
      window.removeEventListener('aurora_admissions_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const stats = admissionService.getStats();

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = !search ||
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesStream = streamFilter === 'all' ||
      (app.stream && app.stream.toLowerCase().includes(streamFilter.toLowerCase())) ||
      (app.course && app.course.toLowerCase().includes(streamFilter.toLowerCase()));
    return matchesSearch && matchesStatus && matchesStream;
  });

  const handleStatusChange = async (appId: string | number, newStatus: 'pending' | 'under_review' | 'approved' | 'rejected') => {
    const updated = await admissionService.updateStatus(appId, newStatus);
    refreshApplications();

    if (newStatus === 'approved' && updated) {
      // Create student record in student store
      const dept = (updated.stream && updated.stream.toLowerCase().includes('comm') ? 'Commerce' :
                   (updated.stream && updated.stream.toLowerCase().includes('art') ? 'Arts' : 'Science')) as 'Science' | 'Commerce' | 'Arts';

      const rollCode = dept === 'Science' ? 'SCI' : (dept === 'Commerce' ? 'COM' : 'ART');
      const randomRoll = `${new Date().getFullYear()}-${rollCode}-${Math.floor(50 + Math.random() * 49)}`;

      const newStudent: Student = {
        id: `STU-${Date.now().toString().slice(-4)}`,
        rollNo: randomRoll,
        name: updated.fullName,
        email: updated.email || `${updated.fullName.toLowerCase().replace(/\s+/g, '.')}@akrdevi.edu`,
        phone: updated.phone || '+91 98765 00000',
        department: dept,
        semester: 'Sem 1',
        class: `PUC-I ${dept} A`,
        gender: (updated.gender === 'Female' ? 'Female' : 'Male'),
        category: updated.category || 'General',
        attendancePct: 100,
        feeStatus: 'partial',
        gpa: 8.5,
        dob: updated.dob || '2009-01-01',
        bloodGroup: updated.bloodGroup || 'O+',
        emergencyPhone: updated.emergencyPhone || updated.phone || '+91 98765 00000',
        address: updated.address || 'Koppal District, Karnataka',
        fatherName: updated.fatherName || 'Guardian',
        motherName: updated.motherName || 'Guardian'
      };

      studentService.create(newStudent);
      if (onStudentEnrolled) onStudentEnrolled(newStudent);
      showToast(`🎉 ${updated.fullName} approved and enrolled with Roll No ${randomRoll}!`);
    } else if (newStatus === 'rejected') {
      showToast(`Application marked as rejected.`);
    } else {
      showToast(`Application status updated to ${newStatus.replace('_', ' ')}.`);
    }

    if (selectedApp && String(selectedApp.id) === String(appId)) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.fullName || !newApplicant.email || !newApplicant.phone) {
      alert('Please fill in applicant full name, email, and phone number.');
      return;
    }

    const created = admissionService.addApplication({
      fullName: newApplicant.fullName,
      email: newApplicant.email,
      phone: newApplicant.phone,
      stream: newApplicant.stream,
      course: newApplicant.course,
      sslcScore: Number(newApplicant.sslcScore),
      fatherName: newApplicant.fatherName,
      category: newApplicant.category,
      created_at: new Date().toISOString()
    });

    refreshApplications();
    setShowAddModal(false);
    showToast(`✅ New applicant ${created.fullName} added to admissions queue.`);
    setNewApplicant({
      fullName: '',
      email: '',
      phone: '',
      stream: 'Science',
      course: 'PUC Science - PCMB',
      sslcScore: 85,
      fatherName: '',
      category: 'General'
    });
  };

  const handleExportCSV = () => {
    const headers = ['Application ID', 'Full Name', 'Email', 'Phone', 'Stream', 'Course', 'SSLC %', 'Status', 'Applied Date'];
    const rows = filteredApps.map(a => [
      a.id,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.stream}"`,
      `"${a.course}"`,
      a.sslcScore || '',
      a.status,
      a.created_at ? new Date(a.created_at).toLocaleDateString() : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Admissions_Applicants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ADMISSIONS HQ
            </span>
            <span className="text-white/40 text-xs">• Real-Time Intake Feed</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Admissions Verification & Enrollment Hub</h1>
          <p className="text-xs text-white/50">
            Real-time queue of applications submitted from the main college website and admission portal. Verify credentials, approve seats, and auto-enroll scholars.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Direct Link to Main Admission Portal */}
          <a
            href="/admission-portal.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-all group"
          >
            <span>Public Admission Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent-cyan group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-accent/25 hover:bg-accent/35 border border-accent/40 text-accent text-xs font-semibold shadow-lg shadow-accent/15 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>

          <button
            onClick={refreshApplications}
            title="Refresh Feed"
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.total}
          subtitle="Across Science, Commerce & Arts"
          change="+18% vs last week"
          isPositive={true}
          icon={Users}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Pending Verification"
          value={stats.pending}
          subtitle="Awaiting administrative review"
          change="Action required"
          isPositive={false}
          icon={Clock}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Approved & Enrolled"
          value={stats.approved}
          subtitle="Confirmed student seats"
          change="Ready for orientation"
          isPositive={true}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Under Document Review"
          value={stats.underReview}
          subtitle="Awaiting certificates / caste slips"
          icon={AlertCircle}
          iconColor="text-purple-400"
        />
      </div>

      {/* Live Applications Queue Table */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicant name, email, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-[#070812]">All Statuses</option>
              <option value="pending" className="bg-[#070812]">Pending (New)</option>
              <option value="under_review" className="bg-[#070812]">Under Review</option>
              <option value="approved" className="bg-[#070812]">Approved / Enrolled</option>
              <option value="rejected" className="bg-[#070812]">Rejected</option>
            </select>

            {/* Stream Filter */}
            <select
              value={streamFilter}
              onChange={e => setStreamFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-[#070812]">All Streams</option>
              <option value="Science" className="bg-[#070812]">Science (PCMB/C)</option>
              <option value="Commerce" className="bg-[#070812]">Commerce (EBAC)</option>
              <option value="Arts" className="bg-[#070812]">Arts (HEPS)</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 font-medium">
                <th className="py-3 px-4">Applicant & Contact</th>
                <th className="py-3 px-4">Stream / Preferred Course</th>
                <th className="py-3 px-4 text-center">10th / SSLC Score</th>
                <th className="py-3 px-4">Category & Guardian</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No admission applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    {/* Applicant details */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-accent-cyan transition-colors">
                        {app.fullName}
                      </div>
                      <div className="text-[11px] text-white/50 font-mono flex items-center gap-2 mt-0.5">
                        <span>{app.phone}</span>
                        {app.email && <span>• {app.email}</span>}
                      </div>
                    </td>

                    {/* Stream & Course */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-accent/20 text-accent font-semibold text-[10px] border border-accent/30 inline-block mb-1">
                        {app.stream || 'PUC'}
                      </span>
                      <div className="text-white/80 text-[11px] max-w-xs truncate">{app.course}</div>
                    </td>

                    {/* SSLC Marks */}
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg ${
                        Number(app.sslcScore) >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        (Number(app.sslcScore) >= 75 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/10 text-white/70')
                      }`}>
                        {app.sslcScore ? `${app.sslcScore}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Category & Father */}
                    <td className="py-3 px-4 text-white/70">
                      <div>{app.category || 'General'}</div>
                      <div className="text-[10px] text-white/40">{app.fatherName ? `Father: ${app.fatherName}` : 'Guardian on file'}</div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4 text-center">
                      <StatusPill status={app.status} />
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setIsDossierOpen(true);
                          }}
                          title="View Full Dossier"
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'approved')}
                            title="Approve & Enroll Student"
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            title="Reject Application"
                            className="p-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Applicant Full Dossier Drawer */}
      {selectedApp && (
        <Drawer
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          title={`Applicant Dossier — ${selectedApp.fullName}`}
          width="lg"
        >
          <div className="space-y-6 text-xs text-white">
            {/* Header Identity Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-accent-cyan flex items-center justify-center text-lg font-bold">
                {selectedApp.fullName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{selectedApp.fullName}</h4>
                <p className="text-white/50 font-mono text-[11px]">Application ID: #{selectedApp.id}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusPill status={selectedApp.status} />
                  <span className="text-[10px] text-white/40">
                    Applied: {new Date(selectedApp.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Merit Badge */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-300 block">10th / SSLC Examination Score</span>
                <span className="text-lg font-mono font-bold text-white">{selectedApp.sslcScore}%</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                {Number(selectedApp.sslcScore) >= 85 ? 'Eligible for Direct Merit Seat' : 'Standard Admission Pool'}
              </span>
            </div>

            {/* Program & Stream Particulars */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider text-white/50 mb-1">
                Program Selection
              </h5>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Stream:</span>
                <span className="font-semibold text-accent">{selectedApp.stream}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Selected Course:</span>
                <span className="font-medium text-white">{selectedApp.course}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Year / Level:</span>
                <span className="font-medium text-white">PUC-I (Academic Year 2026-27)</span>
              </div>
            </div>

            {/* Personal & Guardian Particulars */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider text-white/50 mb-1">
                Personal & Family Background
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="py-1">
                  <span className="text-white/50 block">Father / Guardian</span>
                  <span className="font-medium text-white">{selectedApp.fatherName || 'Not specified'}</span>
                </div>
                <div className="py-1">
                  <span className="text-white/50 block">Mother</span>
                  <span className="font-medium text-white">{selectedApp.motherName || 'Not specified'}</span>
                </div>
                <div className="py-1">
                  <span className="text-white/50 block">Category</span>
                  <span className="font-medium text-white">{selectedApp.category || 'General'}</span>
                </div>
                <div className="py-1">
                  <span className="text-white/50 block">Blood Group</span>
                  <span className="font-bold text-rose-400 font-mono">{selectedApp.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="py-1">
                  <span className="text-white/50 block">Contact Phone</span>
                  <span className="font-mono text-cyan-300">{selectedApp.phone}</span>
                </div>
                <div className="py-1">
                  <span className="text-white/50 block">Email Address</span>
                  <span className="text-white/80 truncate block">{selectedApp.email}</span>
                </div>
              </div>
              {selectedApp.address && (
                <div className="pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-white/50 block">Residential Address:</span>
                  <span className="text-white/80">{selectedApp.address}</span>
                </div>
              )}
            </div>

            {/* Prior Schooling */}
            {selectedApp.schoolName && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="text-white/50 block uppercase text-[10px] font-bold">Prior Schooling & Board</span>
                <div className="font-semibold text-white">{selectedApp.schoolName}</div>
                <div className="text-white/50">{selectedApp.board} • Passing Year {selectedApp.passingYear}</div>
              </div>
            )}

            {/* Applicant Statement */}
            {selectedApp.message && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-white/50 block uppercase text-[10px] font-bold">Applicant Statement</span>
                <p className="text-white/80 italic text-[11px] leading-relaxed">
                  "{selectedApp.message}"
                </p>
              </div>
            )}

            {/* Decision Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  handleStatusChange(selectedApp.id, 'approved');
                  setIsDossierOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Seat & Auto-Enroll into Student Roster</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleStatusChange(selectedApp.id, 'under_review');
                    setIsDossierOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedApp.id, 'rejected');
                    setIsDossierOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Manual Application Entry Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Direct Campus Admission Entry"
          maxWidth="md"
        >
          <form onSubmit={handleManualAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 font-medium mb-1">Applicant Full Name *</label>
              <input
                type="text"
                required
                value={newApplicant.fullName}
                onChange={e => setNewApplicant({ ...newApplicant, fullName: e.target.value })}
                placeholder="e.g. Ramesh Gowda"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newApplicant.email}
                  onChange={e => setNewApplicant({ ...newApplicant, email: e.target.value })}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs"
                />
              </div>
              <div>
                <label className="block text-white/70 font-medium mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newApplicant.phone}
                  onChange={e => setNewApplicant({ ...newApplicant, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Stream</label>
                <select
                  value={newApplicant.stream}
                  onChange={e => {
                    const st = e.target.value;
                    const c = st === 'Science' ? 'PUC Science - PCMB' : (st === 'Commerce' ? 'PUC Commerce - EBAC' : 'PUC Arts - HEPS');
                    setNewApplicant({ ...newApplicant, stream: st, course: c });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs"
                >
                  <option value="Science" className="bg-[#070812]">Science</option>
                  <option value="Commerce" className="bg-[#070812]">Commerce</option>
                  <option value="Arts" className="bg-[#070812]">Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">10th / SSLC Marks (%)</label>
                <input
                  type="number"
                  min={35}
                  max={100}
                  value={newApplicant.sslcScore}
                  onChange={e => setNewApplicant({ ...newApplicant, sslcScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Father / Guardian Name</label>
                <input
                  type="text"
                  value={newApplicant.fatherName}
                  onChange={e => setNewApplicant({ ...newApplicant, fatherName: e.target.value })}
                  placeholder="Father's Name"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs"
                />
              </div>
              <div>
                <label className="block text-white/70 font-medium mb-1">Social Category</label>
                <select
                  value={newApplicant.category}
                  onChange={e => setNewApplicant({ ...newApplicant, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-accent text-xs"
                >
                  <option value="General" className="bg-[#070812]">General</option>
                  <option value="OBC" className="bg-[#070812]">OBC</option>
                  <option value="SC" className="bg-[#070812]">SC</option>
                  <option value="ST" className="bg-[#070812]">ST</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan text-white text-xs font-semibold shadow-lg shadow-accent/25 hover:opacity-95"
              >
                Save Application
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
