import { SalarySlip, PayrollRun, Faculty } from '../types';
import { initialFaculty, initialPayrollRuns, initialSalarySlips, computeSalarySlip } from '../data/seedData';

let payrollRunsStore: PayrollRun[] = [...initialPayrollRuns];
let salarySlipsStore: SalarySlip[] = [...initialSalarySlips];

export const payrollService = {
  getPayrollRuns: (): PayrollRun[] => [...payrollRunsStore],

  getSlipsForPeriod: (period: string): SalarySlip[] => {
    return salarySlipsStore.filter(s => s.period === period);
  },

  getAllSlips: (): SalarySlip[] => [...salarySlipsStore],

  getSlipById: (id: string): SalarySlip | undefined => {
    return salarySlipsStore.find(s => s.id === id);
  },

  getFacultySlips: (facultyId: string): SalarySlip[] => {
    return salarySlipsStore.filter(s => s.employeeId === facultyId);
  },

  // Run new payroll month with automatic attendance-linked LOP
  runPayrollMonth: (period: string, facultyList: Faculty[] = initialFaculty): PayrollRun => {
    // Check if run already exists
    const existing = payrollRunsStore.find(r => r.period === period);
    if (existing) return existing;

    // Simulate attendance LOP days: random 0-4 days for realistic proration
    const newSlips: SalarySlip[] = facultyList.map((f, i) => {
      const simulatedLop = (i % 7 === 0) ? 3 : (i % 5 === 0 ? 1 : 0);
      return computeSalarySlip(f, period, simulatedLop);
    });

    const totalGross = newSlips.reduce((acc, s) => acc + s.gross, 0);
    const totalNet = newSlips.reduce((acc, s) => acc + s.netPay, 0);

    const newRun: PayrollRun = {
      id: `RUN-${period}`,
      period,
      totalEmployees: facultyList.length,
      totalGross,
      totalNet,
      status: 'Under Review'
    };

    payrollRunsStore.unshift(newRun);
    salarySlipsStore = [...newSlips, ...salarySlipsStore];
    return newRun;
  },

  approvePayrollRun: (id: string, approver: string): PayrollRun | null => {
    const run = payrollRunsStore.find(r => r.id === id);
    if (run) {
      run.status = 'Approved';
      run.approvedBy = approver;
      run.approvedAt = new Date().toISOString().split('T')[0];
      // Update associated slips
      salarySlipsStore.forEach(s => {
        if (`RUN-${s.period}` === id) s.status = 'Approved';
      });
      return run;
    }
    return null;
  },

  markPaid: (id: string): PayrollRun | null => {
    const run = payrollRunsStore.find(r => r.id === id);
    if (run) {
      run.status = 'Paid';
      salarySlipsStore.forEach(s => {
        if (`RUN-${s.period}` === id) s.status = 'Paid';
      });
      return run;
    }
    return null;
  },

  // Export JSON or simulated PDF
  downloadSlipJson: (slip: SalarySlip): void => {
    const blob = new Blob([JSON.stringify(slip, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${slip.employeeName.replace(/\s+/g, '_')}_${slip.period}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  bulkExportJson: (period: string): void => {
    const slips = salarySlipsStore.filter(s => s.period === period);
    const blob = new Blob([JSON.stringify(slips, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Payslips_${period}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
