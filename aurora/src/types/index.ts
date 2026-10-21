export type Role = 'super_admin' | 'principal' | 'hod' | 'accountant' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: 'Science' | 'Commerce' | 'Arts';
  semester: string;
  class: string;
  gender: 'Male' | 'Female' | 'Other';
  category: string;
  attendancePct: number;
  feeStatus: 'paid' | 'partial' | 'overdue';
  gpa: number;
  dob: string;
  bloodGroup: string;
  emergencyPhone: string;
  address: string;
  fatherName: string;
  motherName: string;
}

export interface Faculty {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  department: 'Science' | 'Commerce' | 'Arts' | 'Engineering' | 'Administration';
  designation: string;
  qualification: string;
  experience: number;
  basicPay: number;
  bankAccount: string;
  ifsc: string;
  pan: string;
  uan: string;
  joiningDate: string;
  status: 'active' | 'on_leave';
  assignedSubjects: string[];
  leaveBalance: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  date: string;
  period?: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  method: 'manual' | 'qr' | 'biometric' | 'geo';
  markedAt: string;
  remarks?: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  empCode: string;
  designation: string;
  department: string;
  period: string; // '2026-07'
  workingDays: number;
  paidDays: number;
  lopDays: number; // Loss of Pay days auto-calculated from attendance
  earnings: { label: string; amount: number }[];
  deductions: { label: string; amount: number }[];
  gross: number;
  totalDeductions: number;
  netPay: number;
  inWords: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Paid';
  generatedAt: string;
  pan: string;
  uan: string;
  bankAccount: string;
  ifsc: string;
}

export interface PayrollRun {
  id: string;
  period: string;
  totalEmployees: number;
  totalGross: number;
  totalNet: number;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Paid';
  approvedBy?: string;
  approvedAt?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: 'Science' | 'Commerce' | 'Arts';
  credits: number;
  semester: string;
  facultyInCharge: string;
  totalStudents: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'overdue';
  dueDate: string;
  lastPaymentDate?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  semester: string;
  examName: string;
  gpa: number;
  subjects: { name: string; marks: number; maxMarks: number; grade: string }[];
}

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  role: 'faculty' | 'student';
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
}

export interface AdmissionApplication {
  id: string | number;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  stream: 'Science' | 'Commerce' | 'Arts' | string;
  course: string;
  grade?: string;
  sslcScore?: string | number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  category?: string;
  bloodGroup?: string;
  address?: string;
  emergencyPhone?: string;
  schoolName?: string;
  board?: string;
  passingYear?: string;
  income?: string;
  message?: string;
  created_at: string;
}
