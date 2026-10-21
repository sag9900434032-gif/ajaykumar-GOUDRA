const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve admin panel files
app.use(express.static(path.join(__dirname)));
// Serve main website files from project root
app.use(express.static(path.join(__dirname, '..')));

// ─── Supabase Client ─────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fijgonfzdrloytiqnxvs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'sb_publishable_RL_fhDSK-EQEyCNhbsd8tA_L9ILA4Ak';

let supabase = null;
let supabaseConnected = false;
let supabaseStatusMessage = 'Supabase credentials not configured.';

if (SUPABASE_URL && SUPABASE_URL !== 'your_supabase_project_url' &&
    SUPABASE_KEY && SUPABASE_KEY !== 'your_supabase_service_role_key') {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  supabaseStatusMessage = 'Supabase client initialized.';
  console.log('✅ Supabase client initialized successfully.');
} else {
  console.warn('⚠️  Supabase credentials not configured — using in-memory store.');
}

const verifySupabaseConnection = async () => {
  if (!supabase) {
    supabaseConnected = false;
    supabaseStatusMessage = 'Supabase credentials not configured.';
    return false;
  }
  try {
    const { error } = await supabase.from('admissions').select('id').limit(1);
    if (error) throw error;
    supabaseConnected = true;
    supabaseStatusMessage = 'Supabase connection verified.';
    return true;
  } catch (err) {
    supabaseConnected = false;
    supabaseStatusMessage = err.message || 'Supabase connection failed.';
    console.warn('⚠️ Supabase probe failed:', supabaseStatusMessage);
    return false;
  }
};

void verifySupabaseConnection();

// ─── In-Memory Store (fallback / demo data) ──────────────────
const memoryStore = {
  admissions: [
    {
      id: 1, fullName: 'Ravi Kumar', name: 'Ravi Kumar', email: 'ravi@email.com',
      phone: '+91 98765 43201', stream: 'science', course: 'PUC Science - PHY,CHEM,MATH,BIO',
      grade: '11', sslc: '92.5', status: 'pending',
      father: 'Suresh Kumar', mother: 'Suma Kumar', address: 'Sriramnagar, Koppal',
      dob: '2009-05-15', category: 'General', income: '₹2.5 Lakh – ₹5 Lakh',
      gender: 'Male', nationality: 'Indian', religion: 'Hindu',
      aadhar: '123456789012', blood: 'O+',
      fatherOcc: 'Business', motherOcc: 'Housewife',
      emergency: '+91 98765 43211', school: "St. Joseph's High School",
      board: 'Karnataka SSLC', passingYear: '2025',
      subjects: 'Physics, Chemistry, Mathematics, Biology',
      extra: 'Cricket, Chess', medical: 'None',
      message: 'I want to pursue engineering and AKRDevi has the best science faculty.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 2, fullName: 'Sneha Patel', name: 'Sneha Patel', email: 'sneha@email.com',
      phone: '+91 98765 43202', stream: 'commerce', course: 'PUC Commerce - ECO,BUS,STU,ACCO',
      grade: '12', sslc: '88.2', status: 'approved',
      father: 'Kiran Patel', mother: 'Kavita Patel', address: 'Gangavathi, Koppal',
      dob: '2008-08-20', category: 'OBC', income: '₹1 Lakh – ₹2.5 Lakh',
      gender: 'Female', nationality: 'Indian', religion: 'Hindu',
      aadhar: '234567890123', blood: 'B+',
      fatherOcc: 'Teacher', motherOcc: 'Nurse',
      emergency: '+91 98765 43212', school: 'Gangavathi High School',
      board: 'Karnataka SSLC', passingYear: '2025',
      subjects: 'Accountancy, Economics, Business Studies',
      extra: 'Dance, Art', medical: 'None',
      message: 'I aspire to become a Chartered Accountant.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 3, fullName: 'Ajay Nayak', name: 'Ajay Nayak', email: 'ajay@email.com',
      phone: '+91 98765 43203', stream: 'science', course: 'PUC Science - PHY,CHEM,MATH,COMP',
      grade: '11', sslc: '95.0', status: 'pending',
      father: 'Ramesh Nayak', mother: 'Lakshmi Nayak', address: 'Koppal Town',
      dob: '2009-03-10', category: 'General', income: '₹5 Lakh – ₹10 Lakh',
      gender: 'Male', nationality: 'Indian', religion: 'Hindu',
      aadhar: '345678901234', blood: 'A+',
      fatherOcc: 'Doctor', motherOcc: 'Teacher',
      emergency: '+91 98765 43213', school: 'Koppal Public School',
      board: 'Karnataka SSLC', passingYear: '2025',
      subjects: 'Physics, Chemistry, Mathematics, Computer Science',
      extra: 'Programming, Robotics', medical: 'None',
      message: 'Interested in Computer Science stream.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 4, fullName: 'Priya Sharma', name: 'Priya Sharma', email: 'priya@email.com',
      phone: '+91 98765 43204', stream: 'science', course: 'PUC Science - PHY,CHEM,MATH,BIO',
      grade: '11', sslc: '78.5', status: 'rejected',
      father: 'Mohan Sharma', mother: 'Geeta Sharma', address: 'Kushtagi, Koppal',
      dob: '2009-11-25', category: 'SC', income: 'Below ₹1 Lakh',
      gender: 'Female', nationality: 'Indian', religion: 'Hindu',
      aadhar: '456789012345', blood: 'AB+',
      fatherOcc: 'Farmer', motherOcc: 'Housewife',
      emergency: '+91 98765 43214', school: 'Kushtagi Government School',
      board: 'Karnataka SSLC', passingYear: '2025',
      subjects: 'Physics, Chemistry, Mathematics, Biology',
      extra: 'Painting', medical: 'None',
      message: 'Want to become a doctor.',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 5, fullName: 'Mahesh Gowda', name: 'Mahesh Gowda', email: 'mahesh@email.com',
      phone: '+91 98765 43205', stream: 'commerce', course: 'PUC Commerce - ECO,BUS,STU,ACCO',
      grade: '11', sslc: '82.0', status: 'pending',
      father: 'Basavaraj Gowda', mother: 'Shanti Gowda', address: 'Yelburga, Koppal',
      dob: '2009-07-03', category: 'General', income: '₹2.5 Lakh – ₹5 Lakh',
      gender: 'Male', nationality: 'Indian', religion: 'Hindu',
      aadhar: '567890123456', blood: 'O-',
      fatherOcc: 'Shopkeeper', motherOcc: 'Housewife',
      emergency: '+91 98765 43215', school: 'Yelburga High School',
      board: 'Karnataka SSLC', passingYear: '2025',
      subjects: 'Economics, Business Studies, Accountancy',
      extra: 'Football', medical: 'None',
      message: 'Want to study Commerce for MBA preparation.',
      created_at: new Date().toISOString()
    }
  ],
  contacts: [
    {
      id: 1, name: 'Parent Inquiry', email: 'parent1@email.com', phone: '+91 98765 43290',
      subject: 'Admission Fee Structure', message: 'Please share the fee structure for PUC Science stream.',
      status: 'new', created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 2, name: 'Arun Kumar', email: 'arun@email.com', phone: '+91 98765 43291',
      subject: 'Hostel Availability', message: 'Is hostel facility available for outstation students?',
      status: 'new', created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 3, name: 'Savita Devi', email: 'savita@email.com', phone: '+91 98765 43292',
      subject: 'Transport Facility', message: 'Do you provide bus transport from Gangavathi to college?',
      status: 'read', created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 4, name: 'Alumni Connect', email: 'alumni@email.com', phone: '+91 98765 43293',
      subject: 'Alumni Meet 2026', message: 'Planning to organize alumni meet. Please share available dates.',
      status: 'replied', created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  students: [
    {
      id: 1, name: 'Sneha Patel', stream: 'commerce', grade: '12',
      email: 'sneha@email.com', phone: '+91 98765 43202',
      status: 'active', admissionId: 2, rollNumber: 'AKR-2025-001',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 2, name: 'Vikram Singh', stream: 'science', grade: '12',
      email: 'vikram@email.com', phone: '+91 98765 43250',
      status: 'active', rollNumber: 'AKR-2025-002',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 3, name: 'Anita Reddy', stream: 'science', grade: '11',
      email: 'anita@email.com', phone: '+91 98765 43251',
      status: 'active', rollNumber: 'AKR-2026-001',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    }
  ],
  faculty: [
    {
      id: 1, name: 'Dr. Amaresh Patil', department: 'Chemistry', designation: 'Principal & HOD',
      experience: 15, email: 'amaresh@akrdevi.edu.in', phone: '+91 98765 43210',
      qualification: 'Ph.D, M.Sc, B.Ed', basicPay: 75000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 365).toISOString()
    },
    {
      id: 2, name: 'Vishwanatayya', department: 'Commerce', designation: 'HOD & Assistant Lecturer',
      experience: 10, email: 'vishwa@akrdevi.edu.in', phone: '+91 98765 43220',
      qualification: 'M.Com, B.Ed', basicPay: 55000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 300).toISOString()
    },
    {
      id: 3, name: 'Vinuta', department: 'Zoology', designation: 'Assistant Lecturer',
      experience: 7, email: 'vinuta@akrdevi.edu.in', phone: '+91 98765 43221',
      qualification: 'M.Sc, B.Ed', basicPay: 45000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 200).toISOString()
    },
    {
      id: 4, name: 'Ramanna', department: 'Kannada', designation: 'Senior Lecturer & HOD',
      experience: 20, email: 'ramanna@akrdevi.edu.in', phone: '+91 98765 43222',
      qualification: 'M.A, B.Ed', basicPay: 60000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 500).toISOString()
    },
    {
      id: 5, name: 'Mounesh', department: 'Chemistry', designation: 'Assistant Lecturer',
      experience: 3, email: 'mounesh@akrdevi.edu.in', phone: '+91 98765 43223',
      qualification: 'M.Sc, B.Ed', basicPay: 35000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 100).toISOString()
    },
    {
      id: 6, name: 'Prathap', department: 'Mathematics', designation: 'Assistant Lecturer & HOD',
      experience: 8, email: 'prathap@akrdevi.edu.in', phone: '+91 98765 43224',
      qualification: 'M.Sc, B.Ed', basicPay: 50000, status: 'active',
      created_at: new Date(Date.now() - 86400000 * 250).toISOString()
    }
  ],
  courses: [
    {
      id: 1, name: 'PUC Science (PCMB)', code: 'SCI-PCMB', stream: 'Science',
      subjects: 'Physics, Chemistry, Mathematics, Biology',
      duration: '2 Years', intake: 480, fees: 25000, status: 'active',
      description: 'Pre-University Science stream with Physics, Chemistry, Math and Biology.',
      created_at: new Date(Date.now() - 86400000 * 365).toISOString()
    },
    {
      id: 2, name: 'PUC Science (PCMC)', code: 'SCI-PCMC', stream: 'Science',
      subjects: 'Physics, Chemistry, Mathematics, Computer Science',
      duration: '2 Years', intake: 80, fees: 28000, status: 'active',
      description: 'Pre-University Science stream with Physics, Chemistry, Math and Computer Science.',
      created_at: new Date(Date.now() - 86400000 * 365).toISOString()
    },
    {
      id: 3, name: 'PUC Commerce (EBAC)', code: 'COM-EBAC', stream: 'Commerce',
      subjects: 'Economics, Business Studies, Accountancy, Computer Science',
      duration: '2 Years', intake: 80, fees: 22000, status: 'active',
      description: 'Pre-University Commerce stream with core business subjects.',
      created_at: new Date(Date.now() - 86400000 * 365).toISOString()
    }
  ],
  settings: {
    collegeName: 'AKR Devi Memorial PU College',
    udiseCode: '29070213620',
    establishedYear: '2005',
    principal: 'Dr. Amaresh Patil',
    email: 'info@akrdevi.edu.in',
    phone: '+91 9900434032',
    website: 'www.akrdevi.edu.in',
    address: 'AKR Devi Memorial PU College, Sriramnagar, Koppal, Karnataka',
    description: 'Empowering education in Sriramnagar since 2005. Committed to excellence, innovation, and integrity.',
    type: 'Co-Education',
    management: 'Unaided',
    category: 'Higher Secondary Only',
    area: 'Rural',
    classes: '11 to 12'
  }
};

// ─── Helper Functions ────────────────────────────────────────

const sanitizeBody = (body) => {
  const clean = { ...body };
  delete clean.id;
  delete clean.created_at;
  return clean;
};

const makeId = (collection) => {
  const items = memoryStore[collection] || [];
  return (items.length ? Math.max(...items.map(i => Number(i.id) || 0)) : 0) + 1;
};

const sendSuccess = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({ success: true, message, data });
};

const sendError = (res, error, status = 500) => {
  const msg = typeof error === 'string' ? error : (error.message || 'Internal server error');
  res.status(status).json({ success: false, error: msg });
};

const validate = (body, requiredFields) => {
  const missing = requiredFields.filter(f => !body[f] || String(body[f]).trim() === '');
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
};

// ─── Database Abstraction ────────────────────────────────────

const readTable = async (table, fallback) => {
  if (!supabase) return fallback || memoryStore[table] || [];
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || fallback || [];
  } catch (err) {
    console.warn(`⚠️ Supabase read ${table} failed, using in-memory:`, err.message);
    return fallback || memoryStore[table] || [];
  }
};

const writeTable = async (table, payload, mode = 'insert') => {
  // In-memory handler
  const memoryHandler = () => {
    if (mode === 'insert') {
      const id = makeId(table);
      const item = { id, ...payload, created_at: new Date().toISOString() };
      if (!memoryStore[table]) memoryStore[table] = [];
      memoryStore[table].push(item);
      return item;
    }
    if (mode === 'update') {
      const idx = (memoryStore[table] || []).findIndex(i => Number(i.id) === Number(payload.id));
      if (idx > -1) {
        memoryStore[table][idx] = { ...memoryStore[table][idx], ...payload };
        return memoryStore[table][idx];
      }
      return null;
    }
    if (mode === 'delete') {
      const before = (memoryStore[table] || []).length;
      memoryStore[table] = (memoryStore[table] || []).filter(i => Number(i.id) !== Number(payload.id));
      return (memoryStore[table] || []).length < before;
    }
    return null;
  };

  if (!supabase) return memoryHandler();

  try {
    if (mode === 'insert') {
      const { data, error } = await supabase.from(table).insert([payload]).select();
      if (error) throw error;
      return data?.[0] || null;
    }
    if (mode === 'update') {
      const { id, ...rest } = payload;
      const { data, error } = await supabase.from(table).update(rest).eq('id', id).select();
      if (error) throw error;
      return data?.[0] || null;
    }
    if (mode === 'delete') {
      const { error } = await supabase.from(table).delete().eq('id', payload.id);
      if (error) throw error;
      return true;
    }
    return null;
  } catch (err) {
    console.warn(`⚠️ Supabase ${mode} on ${table} failed, using in-memory:`, err.message);
    return memoryHandler();
  }
};

// ─── CSV Helper ──────────────────────────────────────────────

const escapeCsv = (val) => {
  const s = val == null ? '' : String(val);
  return `"${s.replace(/"/g, '""')}"`;
};

const sendCsv = (res, filename, headers, rows) => {
  const lines = [headers.map(escapeCsv).join(',')];
  rows.forEach(row => lines.push(row.map(escapeCsv).join(',')));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(lines.join('\n'));
};

// ─── Salary Slip Calculator ─────────────────────────────────

const calculateSalarySlip = (faculty) => {
  const basic = Number(faculty.basicPay || 0);
  const hra = Math.round(basic * 0.24);
  const da = Math.round(basic * 0.17);
  const ta = Math.round(basic * 0.08);
  const special = Math.round(basic * 0.12);
  const gross = basic + hra + da + ta + special;
  const pf = Math.round(gross * 0.12);
  const tax = Math.round(gross * 0.005);
  const insurance = Math.round(gross * 0.015);
  const totalDeductions = pf + tax + insurance;
  const net = gross - totalDeductions;

  return {
    employee: {
      name: faculty.name,
      id: `FAC-${String(faculty.id).padStart(3, '0')}`,
      department: faculty.department || '—',
      designation: faculty.designation || '—',
      email: faculty.email || '—'
    },
    month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    earnings: { basicPay: basic, hra, da, ta, specialAllowance: special },
    grossPay: gross,
    deductions: { providentFund: pf, professionalTax: tax, insurance },
    totalDeductions,
    netPay: net,
    salary: {
      basic,
      gross,
      totalDeductions,
      net
    }
  };
};

// ═══════════════════════════════════════════════════════════════
// ─── API ROUTES ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

// ─── Health Check ────────────────────────────────────────────

app.get('/api/health', async (req, res) => {
  await verifySupabaseConnection();
  sendSuccess(res, {
    supabase_connected: supabaseConnected,
    supabase_status: supabaseStatusMessage,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }, 'Backend healthy');
});

app.get('/api/test-connection', async (req, res) => {
  if (!supabase) return sendError(res, 'Supabase credentials not configured.', 503);
  try {
    const { data, error } = await supabase.from('admissions').select('*').limit(1);
    if (error) throw error;
    sendSuccess(res, { records_found: data?.length || 0, supabase_url: SUPABASE_URL }, 'Supabase connected');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── Dashboard ───────────────────────────────────────────────

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const contacts = await readTable('contacts', memoryStore.contacts);
    const students = await readTable('students', memoryStore.students);
    const faculty = await readTable('faculty', memoryStore.faculty);
    const courses = await readTable('courses', memoryStore.courses);

    const pending = admissions.filter(i => i.status === 'pending').length;
    const approved = admissions.filter(i => i.status === 'approved').length;
    const rejected = admissions.filter(i => i.status === 'rejected').length;
    const newMessages = contacts.filter(i => i.status === 'new' || !i.status).length;

    sendSuccess(res, {
      totalApplications: admissions.length,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalMessages: contacts.length,
      newMessages,
      totalCourses: courses.length,
      recentAdmissions: admissions.slice(0, 5),
      recentMessages: contacts.slice(0, 5),
      supabaseConnected
    }, 'Dashboard data loaded');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── ADMISSIONS CRUD ─────────────────────────────────────────

app.get('/api/admissions', async (req, res) => {
  try {
    let admissions = await readTable('admissions', memoryStore.admissions);
    const { status, search, page, limit, paginated } = req.query;

    // Filter by status
    if (status && status !== 'all') {
      admissions = admissions.filter(i => i.status === status);
    }

    // Search by name or email
    if (search) {
      const q = search.toLowerCase();
      admissions = admissions.filter(i =>
        (i.name || i.fullName || '').toLowerCase().includes(q) ||
        (i.email || '').toLowerCase().includes(q)
      );
    }

    const total = admissions.length;

    // Return paginated object only if page, limit, or paginated is explicitly requested
    if (page !== undefined || limit !== undefined || paginated === 'true') {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
      const offset = (pageNum - 1) * limitNum;
      const items = admissions.slice(offset, offset + limitNum);

      return sendSuccess(res, {
        items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }, 'Admissions fetched');
    }

    sendSuccess(res, admissions, 'Admissions fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/admissions/:id', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const item = admissions.find(i => String(i.id) === String(req.params.id));
    if (!item) return sendError(res, 'Admission not found', 404);
    sendSuccess(res, item, 'Admission fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    // Normalize name field
    if (payload.fullName && !payload.name) payload.name = payload.fullName;
    if (payload.name && !payload.fullName) payload.fullName = payload.name;
    if (!payload.status) payload.status = 'pending';
    payload.created_at = new Date().toISOString();

    const created = await writeTable('admissions', payload, 'insert');
    sendSuccess(res, created, 'Admission submitted successfully', 201);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.put('/api/admissions/:id', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const target = admissions.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Admission not found', 404);

    const payload = { ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('admissions', payload, 'update');
    sendSuccess(res, updated, 'Admission updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// Status change endpoint (approve / reject)
app.put('/api/admissions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return sendError(res, 'Invalid status. Must be: pending, approved, or rejected', 400);
    }

    const admissions = await readTable('admissions', memoryStore.admissions);
    const target = admissions.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Admission not found', 404);

    const updated = await writeTable('admissions', { id: Number(req.params.id), status }, 'update');

    // Auto-create student on approval
    if (status === 'approved') {
      const students = await readTable('students', memoryStore.students);
      const alreadyExists = students.find(s => Number(s.admissionId) === Number(req.params.id));
      if (!alreadyExists) {
        const rollNumber = `AKR-${new Date().getFullYear()}-${String(makeId('students')).padStart(3, '0')}`;
        await writeTable('students', {
          name: target.name || target.fullName,
          stream: target.stream || target.course || '',
          grade: target.grade || '11',
          email: target.email,
          phone: target.phone,
          status: 'active',
          admissionId: Number(req.params.id),
          rollNumber
        }, 'insert');
      }
    }

    sendSuccess(res, updated, `Admission ${status} successfully`);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const result = await writeTable('admissions', { id: Number(req.params.id) }, 'delete');
    if (!result) return sendError(res, 'Admission delete failed', 400);
    sendSuccess(res, null, 'Admission deleted successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── CONTACTS CRUD ───────────────────────────────────────────

app.get('/api/contacts', async (req, res) => {
  try {
    let contacts = await readTable('contacts', memoryStore.contacts);
    const { status, search } = req.query;
    if (status && status !== 'all') contacts = contacts.filter(i => i.status === status);
    if (search) {
      const q = search.toLowerCase();
      contacts = contacts.filter(i => (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q));
    }
    sendSuccess(res, contacts, 'Contacts fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readTable('contacts', memoryStore.contacts);
    const item = contacts.find(i => String(i.id) === String(req.params.id));
    if (!item) return sendError(res, 'Contact not found', 404);
    sendSuccess(res, item, 'Contact fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    if (!payload.status) payload.status = 'new';
    payload.created_at = new Date().toISOString();
    const created = await writeTable('contacts', payload, 'insert');
    sendSuccess(res, created, 'Contact message sent successfully', 201);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readTable('contacts', memoryStore.contacts);
    const target = contacts.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Contact not found', 404);

    const payload = { ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('contacts', payload, 'update');
    sendSuccess(res, updated, 'Contact updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const result = await writeTable('contacts', { id: Number(req.params.id) }, 'delete');
    if (!result) return sendError(res, 'Contact delete failed', 400);
    sendSuccess(res, null, 'Contact deleted successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── STUDENTS CRUD ───────────────────────────────────────────

app.get('/api/students', async (req, res) => {
  try {
    let students = await readTable('students', memoryStore.students);
    const { status, search, stream } = req.query;
    if (status && status !== 'all') students = students.filter(i => i.status === status);
    if (stream && stream !== 'all') students = students.filter(i => (i.stream || '').toLowerCase() === stream.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      students = students.filter(i => (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q) || (i.rollNumber || '').toLowerCase().includes(q));
    }
    sendSuccess(res, students, 'Students fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const students = await readTable('students', memoryStore.students);
    const item = students.find(i => String(i.id) === String(req.params.id));
    if (!item) return sendError(res, 'Student not found', 404);
    sendSuccess(res, item, 'Student fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    const error = validate(payload, ['name', 'stream', 'email']);
    if (error) return sendError(res, error, 400);
    if (!payload.status) payload.status = 'active';
    if (!payload.rollNumber) {
      payload.rollNumber = `AKR-${new Date().getFullYear()}-${String(makeId('students')).padStart(3, '0')}`;
    }
    payload.created_at = new Date().toISOString();
    const created = await writeTable('students', payload, 'insert');
    sendSuccess(res, created, 'Student created successfully', 201);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const students = await readTable('students', memoryStore.students);
    const target = students.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Student not found', 404);

    const payload = { ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('students', payload, 'update');
    sendSuccess(res, updated, 'Student updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await writeTable('students', { id: Number(req.params.id) }, 'delete');
    if (!result) return sendError(res, 'Student delete failed', 400);
    sendSuccess(res, null, 'Student deleted successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── FACULTY CRUD ────────────────────────────────────────────

app.get('/api/faculty', async (req, res) => {
  try {
    let faculty = await readTable('faculty', memoryStore.faculty);
    const { department, search } = req.query;
    if (department && department !== 'all') faculty = faculty.filter(i => (i.department || '').toLowerCase() === department.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      faculty = faculty.filter(i => (i.name || '').toLowerCase().includes(q) || (i.department || '').toLowerCase().includes(q));
    }
    sendSuccess(res, faculty, 'Faculty fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    const item = faculty.find(i => String(i.id) === String(req.params.id));
    if (!item) return sendError(res, 'Faculty not found', 404);
    sendSuccess(res, item, 'Faculty fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.post('/api/faculty', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    const error = validate(payload, ['name', 'department', 'designation']);
    if (error) return sendError(res, error, 400);
    if (!payload.status) payload.status = 'active';
    payload.created_at = new Date().toISOString();
    const created = await writeTable('faculty', payload, 'insert');
    sendSuccess(res, created, 'Faculty created successfully', 201);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.put('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    const target = faculty.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Faculty not found', 404);

    const payload = { ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('faculty', payload, 'update');
    sendSuccess(res, updated, 'Faculty updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.delete('/api/faculty/:id', async (req, res) => {
  try {
    const result = await writeTable('faculty', { id: Number(req.params.id) }, 'delete');
    if (!result) return sendError(res, 'Faculty delete failed', 400);
    sendSuccess(res, null, 'Faculty deleted successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// Salary Slip
app.get('/api/faculty/:id/salary-slip', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    const member = faculty.find(i => String(i.id) === String(req.params.id));
    if (!member) return sendError(res, 'Faculty not found', 404);

    const slip = calculateSalarySlip(member);
    sendSuccess(res, slip, 'Salary slip generated');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── COURSES CRUD ────────────────────────────────────────────

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await readTable('courses', memoryStore.courses);
    sendSuccess(res, courses, 'Courses fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const courses = await readTable('courses', memoryStore.courses);
    const item = courses.find(i => String(i.id) === String(req.params.id));
    if (!item) return sendError(res, 'Course not found', 404);
    sendSuccess(res, item, 'Course fetched');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    const error = validate(payload, ['name', 'stream']);
    if (error) return sendError(res, error, 400);
    if (!payload.status) payload.status = 'active';
    payload.created_at = new Date().toISOString();
    const created = await writeTable('courses', payload, 'insert');
    sendSuccess(res, created, 'Course created successfully', 201);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const courses = await readTable('courses', memoryStore.courses);
    const target = courses.find(i => String(i.id) === String(req.params.id));
    if (!target) return sendError(res, 'Course not found', 404);

    const payload = { ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('courses', payload, 'update');
    sendSuccess(res, updated, 'Course updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const result = await writeTable('courses', { id: Number(req.params.id) }, 'delete');
    if (!result) return sendError(res, 'Course delete failed', 400);
    sendSuccess(res, null, 'Course deleted successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── SETTINGS ────────────────────────────────────────────────

app.get('/api/settings', (req, res) => {
  sendSuccess(res, memoryStore.settings, 'Settings fetched');
});

app.put('/api/settings', (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    memoryStore.settings = { ...memoryStore.settings, ...payload };
    sendSuccess(res, memoryStore.settings, 'Settings updated successfully');
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── CSV EXPORT ──────────────────────────────────────────────

app.get('/api/export/admissions', async (req, res) => {
  try {
    const data = await readTable('admissions', memoryStore.admissions);
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Course', 'Stream', 'Grade', 'SSLC', 'Status', 'Father', 'Mother', 'Address', 'DOB', 'Category', 'Gender', 'Created At'];
    const rows = data.map(i => [i.id, i.name || i.fullName, i.email, i.phone, i.course, i.stream, i.grade, i.sslc, i.status, i.father, i.mother, i.address, i.dob, i.category, i.gender, i.created_at]);
    sendCsv(res, `admissions_${Date.now()}.csv`, headers, rows);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/export/contacts', async (req, res) => {
  try {
    const data = await readTable('contacts', memoryStore.contacts);
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Created At'];
    const rows = data.map(i => [i.id, i.name, i.email, i.phone, i.subject, i.message, i.status, i.created_at]);
    sendCsv(res, `contacts_${Date.now()}.csv`, headers, rows);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/export/students', async (req, res) => {
  try {
    const data = await readTable('students', memoryStore.students);
    const headers = ['ID', 'Roll Number', 'Name', 'Stream', 'Grade', 'Email', 'Phone', 'Status', 'Created At'];
    const rows = data.map(i => [i.id, i.rollNumber, i.name, i.stream, i.grade, i.email, i.phone, i.status, i.created_at]);
    sendCsv(res, `students_${Date.now()}.csv`, headers, rows);
  } catch (err) {
    sendError(res, err, 500);
  }
});

app.get('/api/export/faculty', async (req, res) => {
  try {
    const data = await readTable('faculty', memoryStore.faculty);
    const headers = ['ID', 'Name', 'Department', 'Designation', 'Experience', 'Email', 'Phone', 'Basic Pay', 'Qualification', 'Status', 'Created At'];
    const rows = data.map(i => [i.id, i.name, i.department, i.designation, i.experience, i.email, i.phone, i.basicPay, i.qualification, i.status, i.created_at]);
    sendCsv(res, `faculty_${Date.now()}.csv`, headers, rows);
  } catch (err) {
    sendError(res, err, 500);
  }
});

// ─── Root / SPA fallback ─────────────────────────────────────

app.get(['/', '/admin', '/admin/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// ─── Start Server ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 AKRDevi Admin Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📡 Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`🎛️  Admin Panel: http://localhost:${PORT}/admin-panel.html\n`);
});
