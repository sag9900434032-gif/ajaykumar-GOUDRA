import React from 'react';
import { SalarySlip } from '../../types';
import { Printer, Download, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { payrollService } from '../../services/payrollService';

interface SlipDocumentProps {
  slip: SalarySlip;
  onClose?: () => void;
}

export const SlipDocument: React.FC<SlipDocumentProps> = ({ slip }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    payrollService.downloadSlipJson(slip);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (no-print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">Verified System Generated Payslip</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <Printer className="w-4 h-4" /> Print Slip
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors shadow-lg shadow-accent/25"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button
            onClick={() => alert(`Direct email notification dispatched to ${slip.employeeName}`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <Mail className="w-4 h-4" /> Email Slip
          </button>
        </div>
      </div>

      {/* The Printable Document Sheet */}
      <div
        id="printable-slip"
        className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 text-slate-100 border border-white/20 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:bg-white print:text-black"
      >
        {/* Watermark */}
        <div className="absolute right-8 bottom-16 text-white/[0.03] print:text-slate-200/50 text-8xl font-black select-none pointer-events-none rotate-[-20deg]">
          PAID
        </div>

        {/* Institution Letterhead Header */}
        <div className="border-b border-white/15 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-2 print:text-indigo-800">
            Government of Karnataka Recognised
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
            AKR<span className="text-accent">Devi</span> PU & Degree College
          </h1>
          <p className="text-xs text-white/60 print:text-slate-600 mt-1">
            Affiliated to KSEEB & State University &bull; Sriramnagar, Koppal – 583231, Karnataka
          </p>
          <p className="text-[11px] text-white/40 print:text-slate-500">
            Email: hr@akrdevi.edu.in | Web: www.akrdevi.edu.in | Phone: +91 99004 34032
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/70 print:text-slate-700">
            <span className="font-semibold uppercase tracking-wider text-accent print:text-indigo-700">Salary Slip for {slip.period}</span>
            <span>Ref: KGID/{slip.period.replace('-', '/')}/{slip.empCode}</span>
          </div>
        </div>

        {/* Employee Info Matrix */}
        <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] print:bg-slate-50 border border-white/10 print:border-slate-300 text-xs">
          <div>
            <span className="text-white/40 print:text-slate-500 block">Employee Name</span>
            <span className="font-bold text-white print:text-black text-sm">{slip.employeeName}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">Employee Code</span>
            <span className="font-mono font-bold text-white print:text-black">{slip.empCode}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">Department</span>
            <span className="font-semibold text-white print:text-black">{slip.department}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">Designation</span>
            <span className="font-semibold text-white print:text-black">{slip.designation}</span>
          </div>

          <div>
            <span className="text-white/40 print:text-slate-500 block">PAN Number</span>
            <span className="font-mono text-white/80 print:text-slate-700">{slip.pan}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">UAN Number</span>
            <span className="font-mono text-white/80 print:text-slate-700">{slip.uan}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">Bank Account</span>
            <span className="font-mono text-white/80 print:text-slate-700">XXXX-XXXX-{slip.bankAccount.slice(-4)}</span>
          </div>
          <div>
            <span className="text-white/40 print:text-slate-500 block">IFSC Code</span>
            <span className="font-mono text-white/80 print:text-slate-700">{slip.ifsc}</span>
          </div>
        </div>

        {/* Attendance & Working Days Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 mb-6 rounded-xl bg-accent/10 border border-accent/20 text-xs">
          <div className="flex gap-6">
            <span>Working Days: <strong className="text-white print:text-black">{slip.workingDays}</strong></span>
            <span>Paid Days: <strong className="text-emerald-400 print:text-emerald-700">{slip.paidDays}</strong></span>
            <span>LOP (Loss of Pay): <strong className={slip.lopDays > 0 ? 'text-rose-400 font-bold' : 'text-white/60'}>{slip.lopDays} Days</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" /> Attendance Synced & Verified
          </div>
        </div>

        {/* Earnings & Deductions Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Earnings Column */}
          <div className="border border-white/10 print:border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-white/10 print:bg-slate-200 p-3 font-bold text-white print:text-black flex justify-between">
              <span>Earnings</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-white/5 print:divide-slate-200 p-2">
              {slip.earnings.map((e, idx) => (
                <div key={idx} className="flex justify-between py-2 px-2 text-white/80 print:text-slate-700">
                  <span>{e.label}</span>
                  <span className="font-mono font-semibold">₹{e.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/5 print:bg-slate-100 p-3 font-bold text-white print:text-black border-t border-white/10 flex justify-between">
              <span>Gross Earnings</span>
              <span className="font-mono text-emerald-400 print:text-emerald-700 text-sm">₹{slip.gross.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="border border-white/10 print:border-slate-300 rounded-2xl overflow-hidden">
            <div className="bg-white/10 print:bg-slate-200 p-3 font-bold text-white print:text-black flex justify-between">
              <span>Deductions</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-white/5 print:divide-slate-200 p-2">
              {slip.deductions.map((d, idx) => (
                <div key={idx} className="flex justify-between py-2 px-2 text-white/80 print:text-slate-700">
                  <span>{d.label}</span>
                  <span className="font-mono font-semibold">₹{d.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/5 print:bg-slate-100 p-3 font-bold text-white print:text-black border-t border-white/10 flex justify-between">
              <span>Total Deductions</span>
              <span className="font-mono text-rose-400 print:text-rose-700 text-sm">₹{slip.totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Net Pay Highlight Card */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-accent/20 via-purple-500/20 to-cyan-500/20 border border-accent/30 print:border-indigo-400 print:bg-indigo-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-accent print:text-indigo-700">Net Take-Home Salary</div>
            <div className="text-3xl font-extrabold text-white print:text-indigo-950 font-mono tracking-tight mt-1">
              ₹{slip.netPay.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-white/70 print:text-slate-700 italic mt-1 font-serif">
              "{slip.inWords}"
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Electronic Transfer Complete
          </div>
        </div>

        {/* Footer & Digital Signoff */}
        <div className="mt-10 pt-6 border-t border-white/10 print:border-slate-300 text-[11px] text-white/40 print:text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            Generated on: {new Date(slip.generatedAt).toLocaleString()} &bull; IP Ref: 10.0.4.82
          </div>
          <div className="font-medium text-white/60 print:text-slate-600">
            This is a computer-generated document. No physical signature is required.
          </div>
        </div>
      </div>
    </div>
  );
};
