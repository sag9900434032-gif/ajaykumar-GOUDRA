import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatusPill } from '../components/common/StatusPill';
import { Modal } from '../components/common/Modal';
import { SlipDocument } from '../components/common/SlipDocument';
import {
  CreditCard,
  PlusCircle,
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Printer
} from 'lucide-react';
import { Faculty, PayrollRun, SalarySlip, Role } from '../types';
import { payrollService } from '../services/payrollService';

interface PayrollProps {
  faculty: Faculty[];
  payrollRuns: PayrollRun[];
  salarySlips: SalarySlip[];
  currentRole: Role;
  onRefresh: () => void;
}

export const Payroll: React.FC<PayrollProps> = ({
  faculty,
  payrollRuns,
  salarySlips,
  currentRole,
  onRefresh
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-07');
  const [activeSlip, setActiveSlip] = useState<SalarySlip | null>(null);
  const [newRunPeriod, setNewRunPeriod] = useState('2026-08');
  const [search, setSearch] = useState('');

  // If faculty role, restrict to own slips
  const isFacultyRole = currentRole === 'faculty';
  const displayFaculty = isFacultyRole
    ? faculty.filter(f => f.name.includes('Priya'))
    : faculty;

  const currentSlips = salarySlips.filter(s => s.period === selectedPeriod);
  const activeRun = payrollRuns.find(r => r.period === selectedPeriod);

  const totalGross = currentSlips.reduce((acc, s) => acc + s.gross, 0);
  const totalNet = currentSlips.reduce((acc, s) => acc + s.netPay, 0);
  const totalLopDays = currentSlips.reduce((acc, s) => acc + s.lopDays, 0);

  const handleStartPayrollRun = () => {
    payrollService.runPayrollMonth(newRunPeriod, faculty);
    setSelectedPeriod(newRunPeriod);
    onRefresh();
  };

  const handleApprove = (runId: string) => {
    payrollService.approvePayrollRun(runId, 'Dr. Padmavati Rao (Principal)');
    onRefresh();
  };

  const handleMarkPaid = (runId: string) => {
    payrollService.markPaid(runId);
    onRefresh();
  };

  const filteredSlips = currentSlips.filter(s =>
    displayFaculty.some(f => f.id === s.employeeId) &&
    (s.employeeName.toLowerCase().includes(search.toLowerCase()) ||
     s.empCode.toLowerCase().includes(search.toLowerCase()) ||
     s.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Cards & KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-white/50">Current Payroll Run</span>
            <Calendar className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-white numeral-tabular mt-2">
            {selectedPeriod}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <StatusPill status={activeRun?.status || 'Paid'} size="sm" />
            <span className="text-xs text-white/40">{currentSlips.length} Staff Slips</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-white/50">Total Net Disbursement</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 numeral-tabular mt-2">
            ₹{totalNet.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-white/50 mt-1">Direct Bank Wire (NEFT/RTGS)</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-white/50">Total Gross Salary</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white numeral-tabular mt-2">
            ₹{totalGross.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-white/50 mt-1">Before PF, Tax & Deductions</p>
        </GlassCard>

        <GlassCard className="border-accent/40 bg-accent/10">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-accent">Attendance Linkage</span>
            <UserCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-white numeral-tabular mt-2">
            {totalLopDays} LOP Days
          </div>
          <p className="text-xs text-white/60 mt-1">Auto-deducted from attendance</p>
        </GlassCard>
      </div>

      {/* Pipeline Toolbar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Period Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white/70">Pay Period:</span>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="bg-[#070812] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-semibold cursor-pointer focus:outline-none focus:border-accent"
          >
            {payrollRuns.map(run => (
              <option key={run.id} value={run.period}>
                {run.period} ({run.status})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        {!isFacultyRole && (
          <div className="flex flex-wrap items-center gap-2">
            {activeRun?.status === 'Under Review' && (
              <button
                onClick={() => handleApprove(activeRun.id)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md"
              >
                Approve Run ({selectedPeriod})
              </button>
            )}

            {activeRun?.status === 'Approved' && (
              <button
                onClick={() => handleMarkPaid(activeRun.id)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md"
              >
                Disburse & Mark Paid
              </button>
            )}

            <button
              onClick={() => payrollService.bulkExportJson(selectedPeriod)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" /> Bulk Export All ({selectedPeriod})
            </button>

            {/* Run New Month Trigger */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <input
                type="text"
                value={newRunPeriod}
                onChange={e => setNewRunPeriod(e.target.value)}
                placeholder="YYYY-MM"
                className="w-24 px-2.5 py-1.5 rounded-xl bg-[#070812] border border-white/15 text-xs text-white font-mono focus:outline-none"
              />
              <button
                onClick={handleStartPayrollRun}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-lg shadow-accent/25"
              >
                <PlusCircle className="w-4 h-4" /> New Run
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Salary Slips Table */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            {isFacultyRole ? 'My Salary Slips' : `Verified Employee Slips for ${selectedPeriod}`}
          </div>
          <div className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search faculty or emp code..."
              className="w-full bg-transparent border-none text-white placeholder-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#070812]/95 border-b border-white/10 text-white/40 uppercase font-bold tracking-wider text-[10px] z-10">
              <tr>
                <th className="py-3.5 px-4">Emp Code</th>
                <th className="py-3.5 px-4">Faculty Member</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Paid / LOP Days</th>
                <th className="py-3.5 px-4">Gross Earnings</th>
                <th className="py-3.5 px-4">Net Take-Home</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSlips.map(slip => (
                <tr key={slip.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent">{slip.empCode}</td>
                  <td className="py-3 px-4 font-bold text-white">{slip.employeeName}</td>
                  <td className="py-3 px-4 text-white/70">
                    <div>{slip.department}</div>
                    <div className="text-[11px] text-white/40">{slip.designation}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald-400">{slip.paidDays} Paid</span>
                    {slip.lopDays > 0 ? (
                      <span className="ml-1 text-[11px] text-rose-400 font-bold">({slip.lopDays} LOP)</span>
                    ) : (
                      <span className="ml-1 text-[11px] text-white/40">(0 LOP)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-white/90">₹{slip.gross.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-extrabold text-emerald-400 text-sm">
                    ₹{slip.netPay.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <StatusPill status={slip.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveSlip(slip)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-semibold border border-accent/30 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Slip
                      </button>
                      <button
                        onClick={() => payrollService.downloadSlipJson(slip)}
                        title="Download JSON"
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Salary Slip Modal Preview & Print */}
      {activeSlip && (
        <Modal
          isOpen={!!activeSlip}
          onClose={() => setActiveSlip(null)}
          title={`Official Salary Slip - ${activeSlip.employeeName}`}
          maxWidth="4xl"
        >
          <SlipDocument slip={activeSlip} onClose={() => setActiveSlip(null)} />
        </Modal>
      )}
    </div>
  );
};
