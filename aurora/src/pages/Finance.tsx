import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { StatusPill } from '../components/common/StatusPill';
import { Modal } from '../components/common/Modal';
import { initialFees, numberToIndianWords } from '../data/seedData';
import { FeeRecord } from '../types';
import {
  PieChart,
  Search,
  Download,
  IndianRupee,
  BellRing,
  CheckCircle2,
  Receipt,
  Building,
  TrendingUp,
  Award
} from 'lucide-react';

export const Finance: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>(initialFees);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedFeeRecord, setSelectedFeeRecord] = useState<FeeRecord | null>(null);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{
    receiptNo: string;
    studentName: string;
    rollNo: string;
    amount: number;
    mode: string;
    date: string;
    inWords: string;
  } | null>(null);

  // Form state for payment collection
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [referenceNo, setReferenceNo] = useState<string>('');

  // Financial aggregates
  const totalAmount = fees.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = fees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDue = fees.reduce((acc, curr) => acc + curr.dueAmount, 0);
  const collectionPct = totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : '0';

  const filteredFees = fees.filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          f.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesDept = deptFilter === 'all' || f.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleOpenCollect = (rec: FeeRecord) => {
    setSelectedFeeRecord(rec);
    setCollectAmount(rec.dueAmount);
    setReferenceNo(`UPI-${Date.now().toString().slice(-6)}`);
    setShowCollectModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedFeeRecord) return;
    const paymentAmount = Number(collectAmount);
    if (paymentAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const updatedPaid = selectedFeeRecord.paidAmount + paymentAmount;
    const updatedDue = Math.max(0, selectedFeeRecord.totalAmount - updatedPaid);
    const updatedStatus: 'paid' | 'partial' | 'overdue' = updatedDue === 0 ? 'paid' : 'partial';

    setFees(prev => prev.map(item => item.id === selectedFeeRecord.id ? {
      ...item,
      paidAmount: updatedPaid,
      dueAmount: updatedDue,
      status: updatedStatus,
      lastPaymentDate: new Date().toISOString().split('T')[0]
    } : item));

    const receipt = {
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: selectedFeeRecord.studentName,
      rollNo: selectedFeeRecord.rollNo,
      amount: paymentAmount,
      mode: paymentMode,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      inWords: `${numberToIndianWords(paymentAmount)} Rupees Only`
    };

    setLastReceipt(receipt);
    setShowCollectModal(false);
    setShowReceiptModal(true);
  };

  const handleSendDueReminders = () => {
    const overdueCount = fees.filter(f => f.status === 'overdue').length;
    alert(`Sent automated WhatsApp & SMS fee due notifications to ${overdueCount} guardians!`);
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Roll No', 'Student Name', 'Department', 'Total Fee', 'Paid Fee', 'Due Amount', 'Status', 'Due Date'];
    const rows = filteredFees.map(f => [
      f.studentId,
      f.rollNo,
      `"${f.studentName}"`,
      f.department,
      f.totalAmount,
      f.paidAmount,
      f.dueAmount,
      f.status,
      f.dueDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              INSTITUTIONAL TREASURY
            </span>
            <span className="text-white/40 text-xs">• FY 2026-27</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Fee Management & Institutional Ledger</h1>
          <p className="text-xs text-white/50">Comprehensive fee schedules, real-time receipt generation, and recovery tracking.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSendDueReminders}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Remind Defaulters</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Realized Fees"
          value={`₹${(totalPaid / 100000).toFixed(2)}L`}
          subtitle={`From total demand of ₹${(totalAmount / 100000).toFixed(2)}L`}
          change="+12.4% vs last month"
          isPositive={true}
          icon={IndianRupee}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Outstanding Dues"
          value={`₹${(totalDue / 100000).toFixed(2)}L`}
          subtitle={`${fees.filter(f => f.status === 'overdue').length} overdue accounts`}
          change="4.2% pending"
          isPositive={false}
          icon={Building}
          iconColor="text-rose-400"
        />
        <StatCard
          title="Collection Efficiency"
          value={`${collectionPct}%`}
          subtitle="Above institutional benchmark (88%)"
          change="+3.1% improved"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Merit Scholarships"
          value="₹6.80L"
          subtitle="Awarded to 32 rural distinction scholars"
          icon={Award}
          iconColor="text-purple-400"
        />
      </div>

      {/* Fee Structure Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 border-l-4 border-l-cyan-400">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white">Science Program (PCMB/C)</span>
            <span className="text-xs font-mono font-bold text-cyan-300">₹45,000 / yr</span>
          </div>
          <p className="text-[11px] text-white/50">Tuition ₹28k • Physics/Chem Lab ₹12k • Library & Sports ₹5k</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-purple-400">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white">Commerce Program (EBAC)</span>
            <span className="text-xs font-mono font-bold text-purple-300">₹38,000 / yr</span>
          </div>
          <p className="text-[11px] text-white/50">Tuition ₹26k • Computer Lab ₹8k • Library & Sports ₹4k</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-amber-400">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white">Arts Program (HEPS)</span>
            <span className="text-xs font-mono font-bold text-amber-300">₹28,000 / yr</span>
          </div>
          <p className="text-[11px] text-white/50">Tuition ₹20k • Skill Workshops ₹4k • Library & Sports ₹4k</p>
        </GlassCard>
      </div>

      {/* Main Ledger Table with Filters */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-[#070812]">All Payment Status</option>
              <option value="paid" className="bg-[#070812]">Paid (Cleared)</option>
              <option value="partial" className="bg-[#070812]">Partial Balance</option>
              <option value="overdue" className="bg-[#070812]">Overdue Alert</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-[#070812]">All Departments</option>
              <option value="Science" className="bg-[#070812]">Science</option>
              <option value="Commerce" className="bg-[#070812]">Commerce</option>
              <option value="Arts" className="bg-[#070812]">Arts</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 font-medium">
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Total Demand</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFees.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{rec.studentName}</div>
                    <div className="text-[10px] font-mono text-white/40">{rec.rollNo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-white/70 border border-white/10">
                      {rec.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-white/90">
                    ₹{rec.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    ₹{rec.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">
                    {rec.dueAmount > 0 ? `₹${rec.dueAmount.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusPill status={rec.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rec.dueAmount > 0 ? (
                      <button
                        onClick={() => handleOpenCollect(rec)}
                        className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent/80 text-white font-semibold text-xs shadow-md shadow-accent/20 transition-all cursor-pointer"
                      >
                        Collect Fee
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setLastReceipt({
                            receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                            studentName: rec.studentName,
                            rollNo: rec.rollNo,
                            amount: rec.paidAmount,
                            mode: 'NetBanking / Direct Debit',
                            date: rec.lastPaymentDate || '2026-07-10',
                            inWords: `${numberToIndianWords(rec.paidAmount)} Rupees Only`
                          });
                          setShowReceiptModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-medium transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-accent" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Collect Payment Modal */}
      {showCollectModal && selectedFeeRecord && (
        <Modal
          isOpen={showCollectModal}
          onClose={() => setShowCollectModal(false)}
          title="Collect Student Fee Payment"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-white/60">Student:</span>
                <span className="font-semibold text-white">{selectedFeeRecord.studentName} ({selectedFeeRecord.rollNo})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total Outstanding Balance:</span>
                <span className="font-bold text-rose-400 font-mono">₹{selectedFeeRecord.dueAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Payment Amount (₹)</label>
              <input
                type="number"
                value={collectAmount}
                onChange={e => setCollectAmount(Number(e.target.value))}
                max={selectedFeeRecord.dueAmount}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={e => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
                >
                  <option value="UPI" className="bg-[#070812]">UPI / QR Code</option>
                  <option value="NetBanking" className="bg-[#070812]">NEFT / IMPS NetBanking</option>
                  <option value="Cheque" className="bg-[#070812]">Bank Cheque / DD</option>
                  <option value="Cash" className="bg-[#070812]">Cash at Counter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Reference / UTR No.</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  placeholder="e.g. UPI-998822"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-accent font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Instant official digital fee receipt will be generated and signed.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCollectModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan text-white text-xs font-semibold shadow-lg shadow-accent/25 hover:opacity-90"
              >
                Confirm Payment & Issue Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Receipt Modal */}
      {showReceiptModal && lastReceipt && (
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Institutional Fee Receipt"
          maxWidth="md"
        >
          <div className="p-6 bg-white text-slate-900 rounded-2xl font-sans space-y-5 border-2 border-slate-200 shadow-2xl relative">
            {/* College Header */}
            <div className="text-center border-b pb-3">
              <h3 className="font-extrabold text-base uppercase text-slate-900 tracking-tight">AKRDevi Memorial PU College</h3>
              <p className="text-[10px] text-slate-500">Koppal, Karnataka • Recognized by Govt. of Karnataka</p>
              <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                OFFICIAL FEE RECEIPT • PAID
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Receipt Number</span>
                <span className="font-mono font-bold text-slate-800">{lastReceipt.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Date of Payment</span>
                <span className="font-medium text-slate-800">{lastReceipt.date}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Student Name</span>
                <span className="font-bold text-slate-900">{lastReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Roll Number</span>
                <span className="font-mono text-slate-800">{lastReceipt.rollNo}</span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Amount Received</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                ₹{lastReceipt.amount.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-600 italic mt-1">{lastReceipt.inWords}</p>
            </div>

            {/* Payment Method & Cashier signature */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200">
              <div>
                <span>Payment Mode: <strong>{lastReceipt.mode}</strong></span>
                <div className="text-[10px] text-slate-400">System verified transaction</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-800">Pradeep Gaddi</div>
                <div className="text-[10px] text-slate-500">Accounts & Finance Officer</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
