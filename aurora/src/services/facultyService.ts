import { Faculty, LeaveApplication } from '../types';
import { initialFaculty } from '../data/seedData';

let facultyStore: Faculty[] = [...initialFaculty];
let leavesStore: LeaveApplication[] = [
  { id: 'LEV-01', applicantId: 'FAC-001', applicantName: 'Dr. Rajesh Kumar', role: 'faculty', type: 'Casual Leave', fromDate: '2026-10-25', toDate: '2026-10-26', days: 2, reason: 'Keynote Speaker at National Physics Conclave', status: 'approved', appliedAt: '2026-10-18' },
  { id: 'LEV-02', applicantId: 'FAC-002', applicantName: 'Dr. Sunita Patil', role: 'faculty', type: 'Sick Leave', fromDate: '2026-10-22', toDate: '2026-10-23', days: 2, reason: 'Seasonal Flu', status: 'pending', appliedAt: '2026-10-21' },
  { id: 'LEV-03', applicantId: 'FAC-004', applicantName: 'Dr. Priya Sharma', role: 'faculty', type: 'Earned Leave', fromDate: '2026-11-02', toDate: '2026-11-05', days: 4, reason: 'Family pilgrimage', status: 'pending', appliedAt: '2026-10-19' }
];

export const facultyService = {
  getAll: (): Faculty[] => [...facultyStore],

  getById: (id: string): Faculty | undefined => {
    return facultyStore.find(f => f.id === id);
  },

  create: (data: Omit<Faculty, 'id' | 'empCode'>): Faculty => {
    const count = facultyStore.length + 1;
    const newFaculty: Faculty = {
      ...data,
      id: `FAC-${String(count).padStart(3, '0')}`,
      empCode: `FAC-${String(count).padStart(3, '0')}`
    };
    facultyStore.unshift(newFaculty);
    return newFaculty;
  },

  update: (id: string, updates: Partial<Faculty>): Faculty | null => {
    const idx = facultyStore.findIndex(f => f.id === id);
    if (idx > -1) {
      facultyStore[idx] = { ...facultyStore[idx], ...updates };
      return facultyStore[idx];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const len = facultyStore.length;
    facultyStore = facultyStore.filter(f => f.id !== id);
    return facultyStore.length < len;
  },

  getLeaves: (): LeaveApplication[] => [...leavesStore],

  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'appliedAt' | 'status'>): LeaveApplication => {
    const newLeave: LeaveApplication = {
      ...leave,
      id: `LEV-${String(leavesStore.length + 1).padStart(2, '0')}`,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    leavesStore.unshift(newLeave);
    return newLeave;
  },

  updateLeaveStatus: (id: string, status: 'approved' | 'rejected'): LeaveApplication | null => {
    const leave = leavesStore.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      return leave;
    }
    return null;
  }
};
