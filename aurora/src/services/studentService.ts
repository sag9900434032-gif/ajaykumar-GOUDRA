import { Student } from '../types';
import { initialStudents } from '../data/seedData';

let studentsStore: Student[] = [...initialStudents];

export const studentService = {
  getAll: (): Student[] => [...studentsStore],

  getById: (id: string): Student | undefined => {
    return studentsStore.find(s => s.id === id);
  },

  create: (data: Omit<Student, 'id' | 'rollNo'>): Student => {
    const count = studentsStore.length + 1;
    const deptPrefix = data.department.slice(0, 3).toUpperCase();
    const newStudent: Student = {
      ...data,
      id: `STU-${String(count).padStart(3, '0')}`,
      rollNo: `2026-${deptPrefix}-${String(count).padStart(2, '0')}`
    };
    studentsStore.unshift(newStudent);
    return newStudent;
  },

  update: (id: string, updates: Partial<Student>): Student | null => {
    const idx = studentsStore.findIndex(s => s.id === id);
    if (idx > -1) {
      studentsStore[idx] = { ...studentsStore[idx], ...updates };
      return studentsStore[idx];
    }
    return null;
  },

  delete: (id: string): boolean => {
    const lenBefore = studentsStore.length;
    studentsStore = studentsStore.filter(s => s.id !== id);
    return studentsStore.length < lenBefore;
  },

  filter: (dept?: string, feeStatus?: string, search?: string): Student[] => {
    return studentsStore.filter(s => {
      const matchDept = !dept || dept === 'all' || s.department === dept;
      const matchFee = !feeStatus || feeStatus === 'all' || s.feeStatus === feeStatus;
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchFee && matchSearch;
    });
  },

  exportCsv: (list: Student[] = studentsStore): string => {
    const headers = ['ID', 'Roll No', 'Name', 'Department', 'Semester', 'Class', 'Attendance %', 'Fee Status', 'GPA', 'Phone', 'Email'];
    const rows = list.map(s => [
      s.id,
      s.rollNo,
      `"${s.name}"`,
      s.department,
      s.semester,
      `"${s.class}"`,
      s.attendancePct,
      s.feeStatus.toUpperCase(),
      s.gpa,
      s.phone,
      s.email
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
