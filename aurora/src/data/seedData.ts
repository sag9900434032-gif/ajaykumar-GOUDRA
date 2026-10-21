import { Student, Faculty, AttendanceRecord, SalarySlip, PayrollRun, Course, FeeRecord, ExamResult, LeaveApplication, AuditLog } from '../types';

export const numberToIndianWords = (num: number): string => {
  if (num === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const n = Math.round(num);
  if (n < 20) return a[n];
  if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
  if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numberToIndianWords(n % 100) : '');
  if (n < 100000) return numberToIndianWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToIndianWords(n % 1000) : '');
  if (n < 10000000) return numberToIndianWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToIndianWords(n % 100000) : '');
  return numberToIndianWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToIndianWords(n % 10000000) : '');
};

// 60+ Realistic Students Seed Data
export const initialStudents: Student[] = [
  { id: 'STU-001', rollNo: '2026-SCI-01', name: 'Ravi Kumar', email: 'ravi.kumar@akrdevi.edu', phone: '+91 98765 43201', department: 'Science', semester: 'Sem 1', class: 'PUC-I Sci A', gender: 'Male', category: 'General', attendancePct: 88.5, feeStatus: 'paid', gpa: 9.2, dob: '2009-05-15', bloodGroup: 'O+', emergencyPhone: '+91 98765 43211', address: 'Sriramnagar, Koppal', fatherName: 'Suresh Kumar', motherName: 'Suma Kumar' },
  { id: 'STU-002', rollNo: '2026-COM-02', name: 'Sneha Patel', email: 'sneha.patel@akrdevi.edu', phone: '+91 98765 43202', department: 'Commerce', semester: 'Sem 3', class: 'PUC-II Com A', gender: 'Female', category: 'OBC', attendancePct: 94.0, feeStatus: 'paid', gpa: 8.8, dob: '2008-08-20', bloodGroup: 'B+', emergencyPhone: '+91 98765 43212', address: 'Gangavathi, Koppal', fatherName: 'Kiran Patel', motherName: 'Kavita Patel' },
  { id: 'STU-003', rollNo: '2026-SCI-03', name: 'Arjun Mehta', email: 'arjun.mehta@akrdevi.edu', phone: '+91 98765 43203', department: 'Science', semester: 'Sem 1', class: 'PUC-I Sci A', gender: 'Male', category: 'General', attendancePct: 69.5, feeStatus: 'partial', gpa: 8.2, dob: '2009-03-10', bloodGroup: 'A+', emergencyPhone: '+91 98765 43213', address: 'Koppal Town', fatherName: 'Vijay Mehta', motherName: 'Rekha Mehta' },
  { id: 'STU-004', rollNo: '2026-SCI-04', name: 'Priya Reddy', email: 'priya.reddy@akrdevi.edu', phone: '+91 98765 43204', department: 'Science', semester: 'Sem 3', class: 'PUC-II Sci B', gender: 'Female', category: 'SC', attendancePct: 92.0, feeStatus: 'paid', gpa: 9.0, dob: '2008-11-25', bloodGroup: 'AB+', emergencyPhone: '+91 98765 43214', address: 'Sriramnagar, Koppal', fatherName: 'Ramesh Reddy', motherName: 'Sujatha Reddy' },
  { id: 'STU-005', rollNo: '2026-COM-05', name: 'Vikram Singh', email: 'vikram.singh@akrdevi.edu', phone: '+91 98765 43205', department: 'Commerce', semester: 'Sem 1', class: 'PUC-I Com B', gender: 'Male', category: 'General', attendancePct: 71.0, feeStatus: 'overdue', gpa: 7.6, dob: '2009-07-30', bloodGroup: 'O-', emergencyPhone: '+91 98765 43215', address: 'Gangavathi, Koppal', fatherName: 'Jai Singh', motherName: 'Neelam Singh' },
  { id: 'STU-006', rollNo: '2026-ART-06', name: 'Ananya Sharma', email: 'ananya.sharma@akrdevi.edu', phone: '+91 98765 43206', department: 'Arts', semester: 'Sem 3', class: 'PUC-II Arts', gender: 'Female', category: 'OBC', attendancePct: 86.5, feeStatus: 'paid', gpa: 8.1, dob: '2008-09-12', bloodGroup: 'B-', emergencyPhone: '+91 98765 43216', address: 'Koppal Town', fatherName: 'Shyam Sharma', motherName: 'Geeta Sharma' },
  { id: 'STU-007', rollNo: '2026-SCI-07', name: 'Kiran Raj', email: 'kiran.raj@akrdevi.edu', phone: '+91 98765 43207', department: 'Science', semester: 'Sem 1', class: 'PUC-I Sci B', gender: 'Male', category: 'ST', attendancePct: 96.0, feeStatus: 'paid', gpa: 9.5, dob: '2009-01-18', bloodGroup: 'A-', emergencyPhone: '+91 98765 43217', address: 'Sriramnagar, Koppal', fatherName: 'Raju Raj', motherName: 'Meena Raj' },
  { id: 'STU-008', rollNo: '2026-COM-08', name: 'Meera Nair', email: 'meera.nair@akrdevi.edu', phone: '+91 98765 43208', department: 'Commerce', semester: 'Sem 3', class: 'PUC-II Com A', gender: 'Female', category: 'General', attendancePct: 89.0, feeStatus: 'paid', gpa: 8.4, dob: '2008-06-22', bloodGroup: 'AB-', emergencyPhone: '+91 98765 43218', address: 'Gangavathi, Koppal', fatherName: 'Gopal Nair', motherName: 'Sreedevi Nair' },
  { id: 'STU-009', rollNo: '2026-ART-09', name: 'Suresh Bhat', email: 'suresh.bhat@akrdevi.edu', phone: '+91 98765 43209', department: 'Arts', semester: 'Sem 1', class: 'PUC-I Arts', gender: 'Male', category: 'OBC', attendancePct: 67.0, feeStatus: 'overdue', gpa: 7.2, dob: '2009-04-05', bloodGroup: 'O+', emergencyPhone: '+91 98765 43219', address: 'Koppal Town', fatherName: 'Krishna Bhat', motherName: 'Lalitha Bhat' },
  { id: 'STU-010', rollNo: '2026-SCI-10', name: 'Lakshmi Iyer', email: 'lakshmi.iyer@akrdevi.edu', phone: '+91 98765 43210', department: 'Science', semester: 'Sem 3', class: 'PUC-II Sci A', gender: 'Female', category: 'General', attendancePct: 95.5, feeStatus: 'paid', gpa: 9.6, dob: '2008-10-14', bloodGroup: 'B+', emergencyPhone: '+91 98765 43220', address: 'Sriramnagar, Koppal', fatherName: 'Narayan Iyer', motherName: 'Rukmini Iyer' },
  { id: 'STU-011', rollNo: '2026-SCI-11', name: 'Aditya Deshmukh', email: 'aditya.d@akrdevi.edu', phone: '+91 98765 43221', department: 'Science', semester: 'Sem 1', class: 'PUC-I Sci A', gender: 'Male', category: 'General', attendancePct: 84.0, feeStatus: 'paid', gpa: 8.5, dob: '2009-02-11', bloodGroup: 'O+', emergencyPhone: '+91 98765 43231', address: 'Yelburga, Koppal', fatherName: 'Prakash Deshmukh', motherName: 'Vandana Deshmukh' },
  { id: 'STU-012', rollNo: '2026-COM-12', name: 'Bhavana Kulkarni', email: 'bhavana.k@akrdevi.edu', phone: '+91 98765 43222', department: 'Commerce', semester: 'Sem 1', class: 'PUC-I Com A', gender: 'Female', category: 'General', attendancePct: 73.5, feeStatus: 'partial', gpa: 7.8, dob: '2009-09-03', bloodGroup: 'A+', emergencyPhone: '+91 98765 43232', address: 'Kushtagi, Koppal', fatherName: 'Satish Kulkarni', motherName: 'Anita Kulkarni' },
  { id: 'STU-013', rollNo: '2026-ART-13', name: 'Chetan Heggade', email: 'chetan.h@akrdevi.edu', phone: '+91 98765 43223', department: 'Arts', semester: 'Sem 3', class: 'PUC-II Arts', gender: 'Male', category: 'ST', attendancePct: 81.0, feeStatus: 'paid', gpa: 8.0, dob: '2008-12-19', bloodGroup: 'B+', emergencyPhone: '+91 98765 43233', address: 'Gangavathi, Koppal', fatherName: 'Manjunath Heggade', motherName: 'Girija Heggade' },
  { id: 'STU-014', rollNo: '2026-SCI-14', name: 'Deepa Hegde', email: 'deepa.hegde@akrdevi.edu', phone: '+91 98765 43224', department: 'Science', semester: 'Sem 3', class: 'PUC-II Sci B', gender: 'Female', category: 'General', attendancePct: 91.5, feeStatus: 'paid', gpa: 9.1, dob: '2008-04-27', bloodGroup: 'AB+', emergencyPhone: '+91 98765 43234', address: 'Sriramnagar, Koppal', fatherName: 'Venkatesh Hegde', motherName: 'Sudha Hegde' },
  { id: 'STU-015', rollNo: '2026-COM-15', name: 'Eshwar Prasad', email: 'eshwar.p@akrdevi.edu', phone: '+91 98765 43225', department: 'Commerce', semester: 'Sem 3', class: 'PUC-II Com B', gender: 'Male', category: 'SC', attendancePct: 64.0, feeStatus: 'overdue', gpa: 6.9, dob: '2008-07-16', bloodGroup: 'O-', emergencyPhone: '+91 98765 43235', address: 'Koppal Town', fatherName: 'Dharma Prasad', motherName: 'Kamakshi Prasad' },
  { id: 'STU-016', rollNo: '2026-SCI-16', name: 'Farhan Ali', email: 'farhan.ali@akrdevi.edu', phone: '+91 98765 43226', department: 'Science', semester: 'Sem 1', class: 'PUC-I Sci A', gender: 'Male', category: 'OBC', attendancePct: 87.0, feeStatus: 'paid', gpa: 8.9, dob: '2009-08-09', bloodGroup: 'A-', emergencyPhone: '+91 98765 43236', address: 'Gangavathi, Koppal', fatherName: 'Bashir Ali', motherName: 'Fatima Ali' },
  { id: 'STU-017', rollNo: '2026-ART-17', name: 'Gowri Shankar', email: 'gowri.s@akrdevi.edu', phone: '+91 98765 43227', department: 'Arts', semester: 'Sem 1', class: 'PUC-I Arts', gender: 'Female', category: 'General', attendancePct: 90.0, feeStatus: 'paid', gpa: 8.7, dob: '2009-10-31', bloodGroup: 'B-', emergencyPhone: '+91 98765 43237', address: 'Sriramnagar, Koppal', fatherName: 'Shankar Murthy', motherName: 'Sharada Murthy' },
  { id: 'STU-018', rollNo: '2026-COM-18', name: 'Harish Babu', email: 'harish.babu@akrdevi.edu', phone: '+91 98765 43228', department: 'Commerce', semester: 'Sem 1', class: 'PUC-I Com A', gender: 'Male', category: 'OBC', attendancePct: 83.0, feeStatus: 'paid', gpa: 7.9, dob: '2009-03-24', bloodGroup: 'O+', emergencyPhone: '+91 98765 43238', address: 'Koppal Town', fatherName: 'Subba Babu', motherName: 'Padma Babu' },
  { id: 'STU-019', rollNo: '2026-SCI-19', name: 'Ishita Roy', email: 'ishita.roy@akrdevi.edu', phone: '+91 98765 43229', department: 'Science', semester: 'Sem 3', class: 'PUC-II Sci A', gender: 'Female', category: 'General', attendancePct: 93.0, feeStatus: 'paid', gpa: 9.3, dob: '2008-05-18', bloodGroup: 'A+', emergencyPhone: '+91 98765 43239', address: 'Gangavathi, Koppal', fatherName: 'Subrata Roy', motherName: 'Moushumi Roy' },
  { id: 'STU-020', rollNo: '2026-ART-20', name: 'Jitendra Sahu', email: 'jitendra.s@akrdevi.edu', phone: '+91 98765 43230', department: 'Arts', semester: 'Sem 3', class: 'PUC-II Arts', gender: 'Male', category: 'SC', attendancePct: 72.0, feeStatus: 'partial', gpa: 7.4, dob: '2008-01-29', bloodGroup: 'B+', emergencyPhone: '+91 98765 43240', address: 'Yelburga, Koppal', fatherName: 'Narendra Sahu', motherName: 'Urmila Sahu' }
];

// Add 40 more students programmatically to ensure 60+ full realism
const firstNames = ['Kavya', 'Lokesh', 'Madhuri', 'Naveen', 'Ojas', 'Pallavi', 'Qasim', 'Rashmi', 'Siddharth', 'Tanvi', 'Uday', 'Varun', 'Wahid', 'Xavier', 'Yamini', 'Zainab', 'Anil', 'Bindu', 'Chandra', 'Divya', 'Ganesh', 'Hema', 'Indira', 'Jagdish', 'Kiran', 'Leela', 'Mohan', 'Nalini', 'Omkar', 'Pooja', 'Rahul', 'Sahana', 'Tejas', 'Usha', 'Vidya', 'Yash', 'Zoya', 'Bhanu', 'Charan', 'Durga'];
const lastNames = ['Kamat', 'Joshi', 'Pai', 'Shenoy', 'Gowda', 'Shetty', 'Bhandary', 'Rao', 'Acharya', 'Nadkarni', 'Deshpande', 'Inamdar', 'Hosmani', 'Gaddi', 'Kudari', 'Angadi', 'Biradar', 'Badami', 'Patil', 'Belagavi'];

for (let i = 0; i < 40; i++) {
  const dept = (['Science', 'Commerce', 'Arts'] as const)[i % 3];
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const gender = (['Female', 'Male', 'Female', 'Male'] as const)[i % 4];
  const att = 60 + ((i * 17) % 39); // will produce some <75% defaulters naturally
  const fee = att < 70 ? 'overdue' : (att < 80 ? 'partial' : 'paid');

  initialStudents.push({
    id: `STU-${String(21 + i).padStart(3, '0')}`,
    rollNo: `2026-${dept.slice(0, 3).toUpperCase()}-${String(21 + i).padStart(2, '0')}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@akrdevi.edu`,
    phone: `+91 98765 ${String(43241 + i).padStart(5, '0')}`,
    department: dept,
    semester: i % 2 === 0 ? 'Sem 1' : 'Sem 3',
    class: `PUC-${i % 2 === 0 ? 'I' : 'II'} ${dept.slice(0, 3)} ${i % 2 === 0 ? 'A' : 'B'}`,
    gender,
    category: (['General', 'OBC', 'SC', 'ST'] as const)[i % 4],
    attendancePct: parseFloat(att.toFixed(1)),
    feeStatus: fee as 'paid' | 'partial' | 'overdue',
    gpa: parseFloat((6.5 + ((i * 7) % 35) / 10).toFixed(1)),
    dob: `200${8 + (i % 2)}-0${1 + (i % 9)}-${String(10 + (i % 18)).padStart(2, '0')}`,
    bloodGroup: (['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'] as const)[i % 8],
    emergencyPhone: `+91 98765 ${String(44000 + i).padStart(5, '0')}`,
    address: `${['Sriramnagar', 'Gangavathi', 'Koppal Town', 'Yelburga', 'Kushtagi'][i % 5]}, Koppal`,
    fatherName: `Shri ${ln}`,
    motherName: `Smt ${ln}`
  });
}

// 20+ Realistic Faculty Seed Data
export const initialFaculty: Faculty[] = [
  { id: 'FAC-001', empCode: 'FAC-001', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@akrdevi.edu', phone: '+91 98765 43251', department: 'Science', designation: 'Senior Professor & HOD', qualification: 'Ph.D. (Physics)', experience: 14, basicPay: 85000, bankAccount: '123456789012', ifsc: 'SBIN0001234', pan: 'ABCDE1234F', uan: '100123456789', joiningDate: '2015-07-01', status: 'active', assignedSubjects: ['Quantum Physics', 'Thermodynamics'], leaveBalance: 16 },
  { id: 'FAC-002', empCode: 'FAC-002', name: 'Dr. Sunita Patil', email: 'sunita.patil@akrdevi.edu', phone: '+91 98765 43252', department: 'Commerce', designation: 'Associate Professor', qualification: 'Ph.D. (Commerce)', experience: 11, basicPay: 72000, bankAccount: '234567890123', ifsc: 'SBIN0005678', pan: 'BCDEF2345G', uan: '100234567890', joiningDate: '2016-08-15', status: 'active', assignedSubjects: ['Financial Accounting', 'Corporate Tax'], leaveBalance: 18 },
  { id: 'FAC-003', empCode: 'FAC-003', name: 'Prof. Anil Mehta', email: 'anil.mehta@akrdevi.edu', phone: '+91 98765 43253', department: 'Arts', designation: 'Professor & HOD', qualification: 'Ph.D. (History)', experience: 16, basicPay: 82000, bankAccount: '345678901234', ifsc: 'SBIN0009012', pan: 'CDEFG3456H', uan: '100345678901', joiningDate: '2014-06-20', status: 'active', assignedSubjects: ['Ancient Indian History', 'World Civilizations'], leaveBalance: 14 },
  { id: 'FAC-004', empCode: 'FAC-004', name: 'Dr. Priya Sharma', email: 'priya.sharma@akrdevi.edu', phone: '+91 98765 43254', department: 'Science', designation: 'Assistant Professor', qualification: 'Ph.D. (Chemistry)', experience: 6, basicPay: 58000, bankAccount: '456789012345', ifsc: 'SBIN0003456', pan: 'DEFGH4567I', uan: '100456789012', joiningDate: '2020-01-10', status: 'active', assignedSubjects: ['Organic Chemistry', 'Polymers'], leaveBalance: 20 },
  { id: 'FAC-005', empCode: 'FAC-005', name: 'Mr. Suresh Rao', email: 'suresh.rao@akrdevi.edu', phone: '+91 98765 43255', department: 'Engineering', designation: 'Senior Lecturer', qualification: 'M.Tech (CS)', experience: 9, basicPay: 64000, bankAccount: '567890123456', ifsc: 'SBIN0007890', pan: 'EFGHI5678J', uan: '100567890123', joiningDate: '2018-06-01', status: 'active', assignedSubjects: ['Data Structures', 'C++ Programming'], leaveBalance: 12 },
  { id: 'FAC-006', empCode: 'FAC-006', name: 'Dr. Latha Reddy', email: 'latha.reddy@akrdevi.edu', phone: '+91 98765 43256', department: 'Commerce', designation: 'Professor', qualification: 'Ph.D. (Economics)', experience: 15, basicPay: 79000, bankAccount: '678901234567', ifsc: 'SBIN0002345', pan: 'FGHIJ6789K', uan: '100678901234', joiningDate: '2013-09-01', status: 'active', assignedSubjects: ['Microeconomics', 'Macroeconomics'], leaveBalance: 22 },
  { id: 'FAC-007', empCode: 'FAC-007', name: 'Mr. Kiran Rajendra', email: 'kiran.r@akrdevi.edu', phone: '+91 98765 43257', department: 'Engineering', designation: 'Assistant Professor', qualification: 'M.E. (Electronics)', experience: 5, basicPay: 51000, bankAccount: '789012345678', ifsc: 'SBIN0006789', pan: 'GHIJK7890L', uan: '100789012345', joiningDate: '2021-07-15', status: 'active', assignedSubjects: ['Digital Electronics', 'Microprocessors'], leaveBalance: 19 },
  { id: 'FAC-008', empCode: 'FAC-008', name: 'Dr. Meera Nambiar', email: 'meera.n@akrdevi.edu', phone: '+91 98765 43258', department: 'Arts', designation: 'Associate Professor', qualification: 'Ph.D. (English)', experience: 10, basicPay: 70000, bankAccount: '890123456789', ifsc: 'SBIN0008901', pan: 'IJKLM8901N', uan: '100890123456', joiningDate: '2017-06-01', status: 'active', assignedSubjects: ['English Literature', 'Communication Skills'], leaveBalance: 17 },
  { id: 'FAC-009', empCode: 'FAC-009', name: 'Mr. Vikramjit Singh', email: 'vikramjit.s@akrdevi.edu', phone: '+91 98765 43259', department: 'Science', designation: 'Lecturer', qualification: 'M.Sc. (Mathematics)', experience: 4, basicPay: 46000, bankAccount: '901234567890', ifsc: 'SBIN0000123', pan: 'JKLMN9012O', uan: '100901234567', joiningDate: '2022-01-10', status: 'active', assignedSubjects: ['Calculus', 'Linear Algebra'], leaveBalance: 21 },
  { id: 'FAC-010', empCode: 'FAC-010', name: 'Dr. Ananya Bhattacharya', email: 'ananya.b@akrdevi.edu', phone: '+91 98765 43260', department: 'Commerce', designation: 'Head of Business Studies', qualification: 'Ph.D. (Management)', experience: 17, basicPay: 94000, bankAccount: '012345678901', ifsc: 'SBIN0004567', pan: 'LMNOP0123Q', uan: '101012345678', joiningDate: '2012-06-15', status: 'active', assignedSubjects: ['Business Studies', 'Marketing Management'], leaveBalance: 15 },
  { id: 'FAC-011', empCode: 'FAC-011', name: 'Mr. Ravi Shastri Desai', email: 'ravi.desai@akrdevi.edu', phone: '+91 98765 43261', department: 'Administration', designation: 'Chief Administrator & Registrar', qualification: 'MBA (HR & Operations)', experience: 8, basicPay: 60000, bankAccount: '123456789012', ifsc: 'SBIN0007891', pan: 'MNOPQ1234R', uan: '101123456789', joiningDate: '2019-08-01', status: 'active', assignedSubjects: ['Institutional Governance'], leaveBalance: 25 },
  { id: 'FAC-012', empCode: 'FAC-012', name: 'Dr. Shweta Iyer', email: 'shweta.iyer@akrdevi.edu', phone: '+91 98765 43262', department: 'Science', designation: 'Associate Professor', qualification: 'Ph.D. (Botany & Genetics)', experience: 11, basicPay: 73000, bankAccount: '234567890123', ifsc: 'SBIN0002346', pan: 'NOPQR2345S', uan: '101234567890', joiningDate: '2016-07-20', status: 'active', assignedSubjects: ['Genetics', 'Plant Physiology'], leaveBalance: 18 },
  { id: 'FAC-013', empCode: 'FAC-013', name: 'Prof. Mounesh Acharya', email: 'mounesh.a@akrdevi.edu', phone: '+91 98765 43263', department: 'Engineering', designation: 'Professor & Dean', qualification: 'Ph.D. (Computer Engg)', experience: 18, basicPay: 102000, bankAccount: '345678901234', ifsc: 'SBIN0003457', pan: 'OPQRS3456T', uan: '101345678901', joiningDate: '2011-04-10', status: 'active', assignedSubjects: ['Operating Systems', 'AI & Machine Learning'], leaveBalance: 11 },
  { id: 'FAC-014', empCode: 'FAC-014', name: 'Mrs. Kavita Joshi', email: 'kavita.j@akrdevi.edu', phone: '+91 98765 43264', department: 'Science', designation: 'Senior Lecturer', qualification: 'M.Sc. (Zoology)', experience: 8, basicPay: 56000, bankAccount: '456789012345', ifsc: 'SBIN0005679', pan: 'PQRST4567U', uan: '101456789012', joiningDate: '2019-03-01', status: 'active', assignedSubjects: ['Human Anatomy', 'Animal Ecology'], leaveBalance: 16 },
  { id: 'FAC-015', empCode: 'FAC-015', name: 'Mr. Arvind Shettar', email: 'arvind.s@akrdevi.edu', phone: '+91 98765 43265', department: 'Arts', designation: 'Lecturer', qualification: 'M.A. (Political Science)', experience: 6, basicPay: 49000, bankAccount: '567890123456', ifsc: 'SBIN0006780', pan: 'QRSTU5678V', uan: '101567890123', joiningDate: '2020-09-12', status: 'active', assignedSubjects: ['Indian Constitution', 'Political Theory'], leaveBalance: 19 },
  { id: 'FAC-016', empCode: 'FAC-016', name: 'Dr. Basavaraj Hallur', email: 'basavaraj.h@akrdevi.edu', phone: '+91 98765 43266', department: 'Commerce', designation: 'Associate Professor', qualification: 'Ph.D. (Banking)', experience: 12, basicPay: 76000, bankAccount: '678901234567', ifsc: 'SBIN0007892', pan: 'RSTUV6789W', uan: '101678901234', joiningDate: '2015-11-05', status: 'active', assignedSubjects: ['Banking Law', 'Financial Markets'], leaveBalance: 14 },
  { id: 'FAC-017', empCode: 'FAC-017', name: 'Mrs. Rekha Nadiger', email: 'rekha.n@akrdevi.edu', phone: '+91 98765 43267', department: 'Arts', designation: 'Assistant Professor', qualification: 'M.A. (Kannada Lit)', experience: 7, basicPay: 52000, bankAccount: '789012345678', ifsc: 'SBIN0008902', pan: 'STUVW7890X', uan: '101789012345', joiningDate: '2019-06-25', status: 'active', assignedSubjects: ['Classical Kannada', 'Poetry'], leaveBalance: 23 },
  { id: 'FAC-018', empCode: 'FAC-018', name: 'Mr. Chetan Kulkarni', email: 'chetan.k@akrdevi.edu', phone: '+91 98765 43268', department: 'Science', designation: 'Lecturer (Physics)', qualification: 'M.Sc. (Physics)', experience: 5, basicPay: 48000, bankAccount: '890123456789', ifsc: 'SBIN0009013', pan: 'TUVWX8901Y', uan: '101890123456', joiningDate: '2021-08-10', status: 'active', assignedSubjects: ['Optics & Wave Motion'], leaveBalance: 20 },
  { id: 'FAC-019', empCode: 'FAC-019', name: 'Dr. Geeta Hosmani', email: 'geeta.h@akrdevi.edu', phone: '+91 98765 43269', department: 'Commerce', designation: 'Assistant Professor', qualification: 'Ph.D. (Statistics)', experience: 7, basicPay: 55000, bankAccount: '901234567890', ifsc: 'SBIN0000124', pan: 'UVWXY9012Z', uan: '101901234567', joiningDate: '2019-12-01', status: 'active', assignedSubjects: ['Business Statistics', 'Probability'], leaveBalance: 17 },
  { id: 'FAC-020', empCode: 'FAC-020', name: 'Mr. Pradeep Gaddi', email: 'pradeep.g@akrdevi.edu', phone: '+91 98765 43270', department: 'Administration', designation: 'Finance & Accounts Officer', qualification: 'M.Com, CA-Inter', experience: 10, basicPay: 67000, bankAccount: '012345678901', ifsc: 'SBIN0001235', pan: 'VWXYZ0123A', uan: '102012345678', joiningDate: '2016-04-18', status: 'active', assignedSubjects: ['College Financial Systems'], leaveBalance: 21 },
  { id: 'FAC-021', empCode: 'FAC-021', name: 'Dr. Padmavati Rao', email: 'padmavati.r@akrdevi.edu', phone: '+91 98765 43271', department: 'Science', designation: 'Principal & Professor', qualification: 'Ph.D. (Chemistry), D.Sc.', experience: 22, basicPay: 125000, bankAccount: '123456789012', ifsc: 'SBIN0002347', pan: 'WXYZA1234B', uan: '102123456789', joiningDate: '2008-06-01', status: 'active', assignedSubjects: ['Inorganic Chemistry', 'Research Methodology'], leaveBalance: 10 }
];

// Helper to compute salary components with LOP (Loss of Pay) link
export const computeSalarySlip = (faculty: Faculty, period: string, lopDays: number = 0): SalarySlip => {
  const [yearStr, monthStr] = period.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const workingDays = totalDaysInMonth - 4; // Minus Sundays
  const paidDays = Math.max(0, workingDays - lopDays);

  // Prorated Basic if LOP applies
  const prorateRatio = paidDays / workingDays;
  const basic = Math.round(faculty.basicPay * prorateRatio);

  const hra = Math.round(basic * 0.24);
  const da = Math.round(basic * 0.17);
  const ta = Math.round(basic * 0.08);
  const special = Math.round(basic * 0.12);
  const medical = 1250;
  const conveyance = 1600;

  const gross = basic + hra + da + ta + special + medical + conveyance;

  // Deductions
  const pf = Math.round(basic * 0.12);
  const profTax = basic > 50000 ? 200 : 150;
  const esi = gross < 21000 ? Math.round(gross * 0.0075) : 0;
  const tds = gross > 75000 ? Math.round((gross - 75000) * 0.1) : 0;

  const totalDeductions = pf + profTax + esi + tds;
  const netPay = gross - totalDeductions;

  return {
    id: `SLIP-${faculty.id}-${period}`,
    employeeId: faculty.id,
    employeeName: faculty.name,
    empCode: faculty.empCode,
    designation: faculty.designation,
    department: faculty.department,
    period,
    workingDays,
    paidDays,
    lopDays,
    earnings: [
      { label: 'Basic Salary (Prorated)', amount: basic },
      { label: 'House Rent Allowance (HRA 24%)', amount: hra },
      { label: 'Dearness Allowance (DA 17%)', amount: da },
      { label: 'Transport Allowance (TA 8%)', amount: ta },
      { label: 'Special Academic Allowance (12%)', amount: special },
      { label: 'Medical Allowance', amount: medical },
      { label: 'Conveyance Allowance', amount: conveyance }
    ],
    deductions: [
      { label: 'Provident Fund (PF 12%)', amount: pf },
      { label: 'Professional Tax (PT)', amount: profTax },
      ...(esi ? [{ label: 'Employee State Insurance (ESI)', amount: esi }] : []),
      ...(tds ? [{ label: 'Tax Deducted at Source (TDS)', amount: tds }] : [])
    ],
    gross,
    totalDeductions,
    netPay,
    inWords: `${numberToIndianWords(netPay)} Rupees Only`,
    status: 'Paid',
    generatedAt: new Date(`${period}-28`).toISOString(),
    pan: faculty.pan,
    uan: faculty.uan,
    bankAccount: faculty.bankAccount,
    ifsc: faculty.ifsc
  };
};

// 6 Months of Payroll Runs
export const initialPayrollRuns: PayrollRun[] = [
  { id: 'RUN-2026-07', period: '2026-07', totalEmployees: 21, totalGross: 1845000, totalNet: 1530200, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-07-28' },
  { id: 'RUN-2026-06', period: '2026-06', totalEmployees: 21, totalGross: 1824000, totalNet: 1515000, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-06-28' },
  { id: 'RUN-2026-05', period: '2026-05', totalEmployees: 20, totalGross: 1740000, totalNet: 1445000, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-05-28' },
  { id: 'RUN-2026-04', period: '2026-04', totalEmployees: 20, totalGross: 1735000, totalNet: 1441000, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-04-28' },
  { id: 'RUN-2026-03', period: '2026-03', totalEmployees: 20, totalGross: 1720000, totalNet: 1430000, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-03-28' },
  { id: 'RUN-2026-02', period: '2026-02', totalEmployees: 19, totalGross: 1650000, totalNet: 1370000, status: 'Paid', approvedBy: 'Dr. Padmavati Rao (Principal)', approvedAt: '2026-02-28' },
];

// Initial Salary Slips for Current Month
export const initialSalarySlips: SalarySlip[] = initialFaculty.map((f, idx) => {
  // Simulate 2 faculty members having LOP days from attendance
  const lop = idx === 4 ? 3 : (idx === 8 ? 2 : 0);
  return computeSalarySlip(f, '2026-07', lop);
});

// Attendance Records for Today
export const initialTodayAttendance: AttendanceRecord[] = initialStudents.map((s, idx) => {
  const status: 'present' | 'absent' | 'late' | 'excused' =
    s.attendancePct < 70 ? (idx % 2 === 0 ? 'absent' : 'late') : (idx % 12 === 0 ? 'late' : (idx % 15 === 0 ? 'excused' : 'present'));

  const method: 'manual' | 'qr' | 'biometric' | 'geo' =
    (['qr', 'biometric', 'manual', 'geo'] as const)[idx % 4];

  return {
    id: `ATT-TODAY-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    rollNo: s.rollNo,
    classId: s.class,
    subjectId: s.department === 'Science' ? 'PHY-101' : (s.department === 'Commerce' ? 'ACC-101' : 'HIS-101'),
    subjectName: s.department === 'Science' ? 'Physics' : (s.department === 'Commerce' ? 'Accountancy' : 'History'),
    date: '2026-10-21',
    period: 1,
    status,
    markedBy: 'Prof. Rajesh Kumar',
    method,
    markedAt: '09:05 AM',
    remarks: status === 'late' ? 'Arrived 15 mins late' : (status === 'excused' ? 'Medical slip submitted' : '')
  };
});

// Courses
export const initialCourses: Course[] = [
  { id: 'CRS-01', code: 'PCMB', name: 'PUC Science (Physics, Chemistry, Math, Biology)', department: 'Science', credits: 24, semester: 'Year 1 & 2', facultyInCharge: 'Dr. Rajesh Kumar', totalStudents: 120 },
  { id: 'CRS-02', code: 'PCMC', name: 'PUC Science (Physics, Chemistry, Math, Comp Science)', department: 'Science', credits: 24, semester: 'Year 1 & 2', facultyInCharge: 'Prof. Suresh Rao', totalStudents: 100 },
  { id: 'CRS-03', code: 'EBAC', name: 'PUC Commerce (Economics, Business, Accountancy, Computer)', department: 'Commerce', credits: 22, semester: 'Year 1 & 2', facultyInCharge: 'Dr. Sunita Patil', totalStudents: 110 },
  { id: 'CRS-04', code: 'HEPS', name: 'PUC Arts (History, Economics, Political Science, Sociology)', department: 'Arts', credits: 20, semester: 'Year 1 & 2', facultyInCharge: 'Prof. Anil Mehta', totalStudents: 65 }
];

// Fee Ledger
export const initialFees: FeeRecord[] = initialStudents.slice(0, 25).map(s => {
  const total = s.department === 'Science' ? 45000 : (s.department === 'Commerce' ? 38000 : 28000);
  const paid = s.feeStatus === 'paid' ? total : (s.feeStatus === 'partial' ? total - 15000 : 0);
  return {
    id: `FEE-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    rollNo: s.rollNo,
    department: s.department,
    totalAmount: total,
    paidAmount: paid,
    dueAmount: total - paid,
    status: s.feeStatus,
    dueDate: '2026-11-15',
    lastPaymentDate: paid > 0 ? '2026-07-10' : undefined
  };
});

// Audit Logs
export const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-01', action: 'Payroll Locked & Approved', entity: 'Payroll', user: 'Dr. Padmavati Rao', role: 'Principal', timestamp: '2026-07-28 16:45', details: 'July 2026 payroll locked for 21 faculty members (Total ₹15,30,200)' },
  { id: 'LOG-02', action: 'Defaulter Notice Generated', entity: 'Attendance', user: 'Prof. Rajesh Kumar', role: 'HOD', timestamp: '2026-10-20 11:30', details: 'Auto-notified 8 students below 75% attendance threshold' },
  { id: 'LOG-03', action: 'Biometric Batch Synced', entity: 'Attendance', user: 'System Adapter', role: 'System', timestamp: '2026-10-21 09:15', details: '142 gate RFID/Biometric scans logged successfully' },
  { id: 'LOG-04', action: 'Fee Payment Received', entity: 'Finance', user: 'Pradeep Gaddi', role: 'Accountant', timestamp: '2026-10-19 14:10', details: 'Recorded ₹45,000 payment for Ravi Kumar (Receipt #REC-8842)' }
];
