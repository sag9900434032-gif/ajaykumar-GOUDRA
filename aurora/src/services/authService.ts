import type { Role, User } from '../types';

export const DEMO_USERS: Record<Role, User> = {
  super_admin: {
    id: 'USR-01',
    name: 'Mounesh V. (Chancellor)',
    email: 'admin@akrdevi.edu',
    role: 'super_admin',
    avatar: 'M'
  },
  principal: {
    id: 'USR-02',
    name: 'Dr. Padmavati Rao (Principal)',
    email: 'principal@akrdevi.edu',
    role: 'principal',
    department: 'Administration',
    avatar: 'P'
  },
  hod: {
    id: 'USR-03',
    name: 'Dr. Rajesh Kumar (HOD Science)',
    email: 'rajesh.kumar@akrdevi.edu',
    role: 'hod',
    department: 'Science',
    avatar: 'R'
  },
  accountant: {
    id: 'USR-04',
    name: 'Pradeep Gaddi (Finance Officer)',
    email: 'accounts@akrdevi.edu',
    role: 'accountant',
    department: 'Finance',
    avatar: 'A'
  },
  faculty: {
    id: 'USR-05',
    name: 'Dr. Priya Sharma (Chemistry)',
    email: 'priya.sharma@akrdevi.edu',
    role: 'faculty',
    department: 'Science',
    avatar: 'S'
  },
  student: {
    id: 'USR-06',
    name: 'Ravi Kumar (Student #2026-SCI-01)',
    email: 'ravi.kumar@akrdevi.edu',
    role: 'student',
    department: 'Science',
    avatar: 'R'
  }
};

export const PERMISSION_MATRIX: Record<Role, {
  canViewDashboard: boolean;
  canManageAttendance: boolean;
  canRunPayroll: boolean;
  canViewAllSalarySlips: boolean;
  canManageStudents: boolean;
  canManageFaculty: boolean;
  canManageAcademics: boolean;
  canViewFinance: boolean;
  canManageFinance: boolean;
  canGenerateReports: boolean;
  canAccessSystemSettings: boolean;
}> = {
  super_admin: {
    canViewDashboard: true,
    canManageAttendance: true,
    canRunPayroll: true,
    canViewAllSalarySlips: true,
    canManageStudents: true,
    canManageFaculty: true,
    canManageAcademics: true,
    canViewFinance: true,
    canManageFinance: true,
    canGenerateReports: true,
    canAccessSystemSettings: true,
  },
  principal: {
    canViewDashboard: true,
    canManageAttendance: true,
    canRunPayroll: true,
    canViewAllSalarySlips: true,
    canManageStudents: true,
    canManageFaculty: true,
    canManageAcademics: true,
    canViewFinance: true,
    canManageFinance: false,
    canGenerateReports: true,
    canAccessSystemSettings: true,
  },
  hod: {
    canViewDashboard: true,
    canManageAttendance: true,
    canRunPayroll: false,
    canViewAllSalarySlips: false,
    canManageStudents: true,
    canManageFaculty: true,
    canManageAcademics: true,
    canViewFinance: false,
    canManageFinance: false,
    canGenerateReports: true,
    canAccessSystemSettings: false,
  },
  accountant: {
    canViewDashboard: true,
    canManageAttendance: false,
    canRunPayroll: true,
    canViewAllSalarySlips: true,
    canManageStudents: true,
    canManageFaculty: false,
    canManageAcademics: false,
    canViewFinance: true,
    canManageFinance: true,
    canGenerateReports: true,
    canAccessSystemSettings: false,
  },
  faculty: {
    canViewDashboard: true,
    canManageAttendance: true,
    canRunPayroll: false,
    canViewAllSalarySlips: false, // self-view only
    canManageStudents: false,
    canManageFaculty: false,
    canManageAcademics: true,
    canViewFinance: false, // RBAC visibly hides Finance
    canManageFinance: false,
    canGenerateReports: false,
    canAccessSystemSettings: false,
  },
  student: {
    canViewDashboard: true,
    canManageAttendance: false,
    canRunPayroll: false,
    canViewAllSalarySlips: false,
    canManageStudents: false,
    canManageFaculty: false,
    canManageAcademics: false,
    canViewFinance: false,
    canManageFinance: false,
    canGenerateReports: false,
    canAccessSystemSettings: false,
  }
};

let currentRole: Role = 'super_admin';

export const authService = {
  getCurrentUser: (): User => DEMO_USERS[currentRole],
  getCurrentRole: (): Role => currentRole,
  setRole: (role: Role): User => {
    currentRole = role;
    localStorage.setItem('aurora_role', role);
    return DEMO_USERS[role];
  },
  hasPermission: (permission: keyof typeof PERMISSION_MATRIX['super_admin']): boolean => {
    return PERMISSION_MATRIX[currentRole][permission];
  },
  getPermissions: () => PERMISSION_MATRIX[currentRole],
  getAllRoles: (): Role[] => ['super_admin', 'principal', 'hod', 'accountant', 'faculty', 'student']
};
