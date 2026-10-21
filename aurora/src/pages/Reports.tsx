import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { initialStudents, initialFaculty, initialFees, initialPayrollRuns, initialTodayAttendance } from '../data/seedData';
import {
  FileBarChart,
  Download,
  Filter,
  CheckCircle2,
  Table,
  Sparkles,
  Users,
  CreditCard,
  CalendarCheck,
  Building,
  RefreshCw
} from 'lucide-react';

export const Reports: React.FC = () => {
  // Query Builder State
  const [dataSource, setDataSource] = useState<'students' | 'faculty' | 'fees' | 'payroll'>('students');
  const [selectedFields, setSelectedFields] = useState<string[]>(['rollNo', 'name', 'department', 'attendancePct', 'feeStatus']);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterThreshold, setFilterThreshold] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  // Available fields per data source
  const fieldOptions: Record<string, { key: string; label: string }[]> = {
    students: [
      { key: 'rollNo', label: 'Roll Number' },
      { key: 'name', label: 'Student Name' },
      { key: 'department', label: 'Department' },
      { key: 'class', label: 'Class / Section' },
      { key: 'attendancePct', label: 'Attendance %' },
      { key: 'feeStatus', label: 'Fee Status' },
      { key: 'gpa', label: 'Current GPA' },
      { key: 'phone', label: 'Guardian Phone' }
    ],
    faculty: [
      { key: 'empCode', label: 'Employee Code' },
      { key: 'name', label: 'Faculty Name' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' },
      { key: 'basicPay', label: 'Basic Pay (₹)' },
      { key: 'leaveBalance', label: 'Leave Balance (Days)' },
      { key: 'status', label: 'Employment Status' }
    ],
    fees: [
      { key: 'rollNo', label: 'Roll Number' },
      { key: 'studentName', label: 'Student Name' },
      { key: 'department', label: 'Department' },
      { key: 'totalAmount', label: 'Total Demand (₹)' },
      { key: 'paidAmount', label: 'Paid Amount (₹)' },
      { key: 'dueAmount', label: 'Outstanding Due (₹)' },
      { key: 'status', label: 'Fee Status' }
    ],
    payroll: [
      { key: 'period', label: 'Pay Month' },
      { key: 'totalEmployees', label: 'Faculty Count' },
      { key: 'totalGross', label: 'Gross Disbursement (₹)' },
      { key: 'totalNet', label: 'Net Disbursed (₹)' },
      { key: 'status', label: 'Execution Status' },
      { key: 'approvedBy', label: 'Approving Authority' }
    ]
  };

  const handleToggleField = (fieldKey: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey) ? prev.filter(k => k !== fieldKey) : [...prev, fieldKey]
    );
  };

  const handleSourceChange = (src: 'students' | 'faculty' | 'fees' | 'payroll') => {
    setDataSource(src);
    // Set default initial fields
    const defaultFields = fieldOptions[src].slice(0, 5).map(f => f.key);
    setSelectedFields(defaultFields);
  };

  // Get filtered data based on query
  const getQueryResults = () => {
    if (dataSource === 'students') {
      return initialStudents.filter(s => {
        const matchesDept = filterDept === 'all' || s.department === filterDept;
        const matchesAtt = filterThreshold === 'all' || (filterThreshold === 'defaulters' ? s.attendancePct < 75 : s.attendancePct >= 75);
        return matchesDept && matchesAtt;
      });
    } else if (dataSource === 'faculty') {
      return initialFaculty.filter(f => filterDept === 'all' || f.department === filterDept);
    } else if (dataSource === 'fees') {
      return initialFees.filter(f => filterDept === 'all' || f.department === filterDept);
    } else {
      return initialPayrollRuns;
    }
  };

  const results = getQueryResults();

  const handleExecuteExport = () => {
    if (results.length === 0) {
      alert('No records match your query filters.');
      return;
    }

    if (exportFormat === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `Aurora_${dataSource}_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // CSV Export
      const headers = selectedFields.map(f => {
        const fieldMeta = fieldOptions[dataSource].find(m => m.key === f);
        return fieldMeta ? `"${fieldMeta.label}"` : `"${f}"`;
      });

      const rows = results.map(row => {
        return selectedFields.map(field => {
          const val = (row as any)[field];
          if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
          return val !== undefined ? val : '';
        });
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Aurora_${dataSource}_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ANALYTICS ENGINE
            </span>
            <span className="text-white/40 text-xs">• Dynamic Query Builder</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Institutional Reports & Custom Query Builder</h1>
          <p className="text-xs text-white/50">Cross-filter students, faculty, payroll runs, and treasury records with instant tabular and CSV downloads.</p>
        </div>

        <button
          onClick={handleExecuteExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-accent to-accent-cyan text-white text-xs font-semibold shadow-lg shadow-accent/25 hover:opacity-90 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Query Data ({exportFormat.toUpperCase()})</span>
        </button>
      </div>

      {/* 4 Instant Pre-built Report Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard
          onClick={() => {
            handleSourceChange('students');
            setFilterThreshold('defaulters');
          }}
          className="p-4 cursor-pointer hover:border-rose-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
              Defaulters &lt;75%
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
            Attendance Defaulters Report
          </h4>
          <p className="text-[11px] text-white/40 mt-1">Generates list of students failing 75% PUC board criterion.</p>
        </GlassCard>

        <GlassCard
          onClick={() => {
            handleSourceChange('payroll');
          }}
          className="p-4 cursor-pointer hover:border-emerald-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              6 Months
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
            Payroll Ledger Summary
          </h4>
          <p className="text-[11px] text-white/40 mt-1">Disbursements, PF/ESI deductions, and net payouts.</p>
        </GlassCard>

        <GlassCard
          onClick={() => {
            handleSourceChange('fees');
          }}
          className="p-4 cursor-pointer hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Treasury
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
            Fee Realization & Dues
          </h4>
          <p className="text-[11px] text-white/40 mt-1">Collected amounts vs pending balances per department.</p>
        </GlassCard>

        <GlassCard
          onClick={() => {
            handleSourceChange('faculty');
          }}
          className="p-4 cursor-pointer hover:border-accent-cyan/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
              21 Faculty
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
            Faculty Directory & Leaves
          </h4>
          <p className="text-[11px] text-white/40 mt-1">Designations, experience, basic pay, and leave balances.</p>
        </GlassCard>
      </div>

      {/* Interactive Query Builder Panel */}
      <GlassCard className="p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-white">Custom Query Engine</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/50">Output:</span>
            <button
              onClick={() => setExportFormat('csv')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                exportFormat === 'csv' ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              CSV
            </button>
            <button
              onClick={() => setExportFormat('json')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                exportFormat === 'json' ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        {/* Step 1: Select Data Source */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/70 block">Step 1: Select Data Entity</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['students', 'faculty', 'fees', 'payroll'] as const).map(source => (
              <button
                key={source}
                onClick={() => handleSourceChange(source)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border capitalize text-left transition-all ${
                  dataSource === source
                    ? 'bg-accent/25 border-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Fields */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/70 block">Step 2: Choose Columns to Include</label>
          <div className="flex flex-wrap gap-2">
            {fieldOptions[dataSource].map(field => {
              const isSelected = selectedFields.includes(field.key);
              return (
                <button
                  key={field.key}
                  onClick={() => handleToggleField(field.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{field.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1">Filter by Department</label>
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-[#070812]">All Departments</option>
              <option value="Science" className="bg-[#070812]">Science</option>
              <option value="Commerce" className="bg-[#070812]">Commerce</option>
              <option value="Arts" className="bg-[#070812]">Arts</option>
            </select>
          </div>

          {dataSource === 'students' && (
            <div>
              <label className="text-xs font-medium text-white/60 block mb-1">Attendance Threshold Filter</label>
              <select
                value={filterThreshold}
                onChange={e => setFilterThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-accent"
              >
                <option value="all" className="bg-[#070812]">All Attendance Ranges</option>
                <option value="defaulters" className="bg-[#070812]">Critical Defaulters (&lt; 75%)</option>
                <option value="eligible" className="bg-[#070812]">Eligible for Board Exams (≥ 75%)</option>
              </select>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Live Query Results Table */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-white">Live Query Output ({results.length} Matches)</h3>
          </div>
          <span className="text-[11px] text-white/40">Showing real-time client-side results</span>
        </div>

        <div className="overflow-x-auto max-h-[420px] rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#070812]/95 backdrop-blur-xl border-b border-white/10 text-white/60">
              <tr>
                {selectedFields.map(field => {
                  const meta = fieldOptions[dataSource].find(m => m.key === field);
                  return (
                    <th key={field} className="py-3 px-4 font-semibold">
                      {meta ? meta.label : field}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.slice(0, 30).map((row: any, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  {selectedFields.map(field => (
                    <td key={field} className="py-2.5 px-4 font-mono text-white/80">
                      {typeof row[field] === 'number'
                        ? row[field].toLocaleString('en-IN')
                        : String(row[field] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
