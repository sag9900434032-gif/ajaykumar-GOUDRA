const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirnamePath = __dirname;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirnamePath)));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let supabaseConnected = false;

if (!SUPABASE_URL || SUPABASE_URL === 'your_supabase_project_url' ||
    !SUPABASE_KEY || SUPABASE_KEY === 'your_supabase_service_role_key') {
  console.error('⚠️  WARNING: Supabase credentials not configured.');
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  supabaseConnected = true;
  console.log('✅ Supabase client initialized successfully.');
}

const memoryStore = {
  admissions: [
    {
      id: 1,
      name: 'Ravi Kumar',
      email: 'ravi@email.com',
      phone: '+91 98765 43201',
      stream: 'science',
      grade: '11',
      sslc: '92.5',
      status: 'pending',
      father: 'Suresh Kumar',
      mother: 'Suma Kumar',
      address: 'Sriramnagar, Koppal',
      dob: '2009-05-15',
      category: 'General',
      income: '₹2.5 Lakh – ₹5 Lakh',
      gender: 'Male',
      nationality: 'Indian',
      religion: 'Hindu',
      aadhar: '123456789012',
      blood: 'O+',
      fatherOcc: 'Business',
      motherOcc: 'Housewife',
      emergency: '+91 98765 43211',
      school: 'St. Joseph\'s High School',
      board: 'Karnataka SSLC',
      passingYear: '2025',
      subjects: 'Physics, Chemistry, Mathematics, Biology',
      extra: 'Cricket, Chess',
      medical: 'None',
      reason: 'I want to pursue engineering and AKRDevi has the best science faculty.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Sneha Patel',
      email: 'sneha@email.com',
      phone: '+91 98765 43202',
      stream: 'commerce',
      grade: '12',
      sslc: '88.2',
      status: 'approved',
      father: 'Kiran Patel',
      mother: 'Kavita Patel',
      address: 'Gangavathi, Koppal',
      dob: '2008-08-20',
      category: 'OBC',
      income: '₹1 Lakh – ₹2.5 Lakh',
      gender: 'Female',
      nationality: 'Indian',
      religion: 'Hindu',
      aadhar: '234567890123',
      blood: 'B+',
      fatherOcc: 'Teacher',
      motherOcc: 'Nurse',
      emergency: '+91 98765 43212',
      school: 'Gangavathi High School',
      board: 'Karnataka SSLC',
      passingYear: '2025',
      subjects: 'Accountancy, Economics, Business Studies',
      extra: 'Dance, Art',
      medical: 'None',
      reason: 'I aspire to become a Chartered Accountant.',
      created_at: new Date().toISOString()
    }
  ],
  contacts: [
    {
      id: 1,
      name: 'Student Query',
      email: 'query@email.com',
      phone: '+91 98765 43299',
      subject: 'Admissions',
      message: 'Need admission information for Science stream.',
      created_at: new Date().toISOString()
    }
  ],
  students: [
    {
      id: 1,
      name: 'Sneha Patel',
      stream: 'commerce',
      grade: '12',
      email: 'sneha@email.com',
      status: 'active',
      admissionId: 2,
      created_at: new Date().toISOString()
    }
  ],
  faculty: [
    {
      id: 1,
      name: 'Dr. P. Sharma',
      department: 'Administration',
      designation: 'Administrator',
      experience: 8.5,
      email: 'principal@akrdevi.edu.in',
      phone: '+91 98765 43210',
      basicPay: 65000,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]
};

const sanitizeBody = (body) => {
  const cleanBody = { ...body };
  delete cleanBody.id;
  return cleanBody;
};

const makeId = (collection) => {
  const all = memoryStore[collection] || [];
  return (all.length ? Math.max(...all.map(item => Number(item.id) || 0)) : 0) + 1;
};

const sendSuccess = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({ success: true, message, data });
};

const sendError = (res, error, status = 500) => {
  res.status(status).json({ success: false, error: error.message || error });
};

const readTable = async (table, fallback = []) => {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || fallback;
  } catch (error) {
    console.warn(`⚠️ Falling back to in-memory ${table} data because Supabase query failed:` , error.message);
    return fallback;
  }
};

const writeTable = async (table, payload, mode = 'insert') => {
  if (!supabase) {
    if (mode === 'insert') {
      const nextId = makeId(table);
      const item = { id: nextId, ...payload, created_at: new Date().toISOString() };
      memoryStore[table].push(item);
      return item;
    }
    return payload;
  }

  try {
    let query = supabase.from(table);

    if (mode === 'insert') {
      const { data, error } = await query.insert([payload]).select();
      if (error) throw error;
      return data?.[0] || null;
    }

    if (mode === 'update') {
      const { data, error } = await query.update(payload).eq('id', payload.id).select();
      if (error) throw error;
      return data?.[0] || null;
    }

    if (mode === 'delete') {
      const { error } = await query.delete().eq('id', payload.id);
      if (error) throw error;
      return true;
    }

    return null;
  } catch (error) {
    console.warn(`⚠️ Supabase write failed on ${table}; using in-memory fallback.`, error.message);
    if (mode === 'insert') {
      const nextId = makeId(table);
      const item = { id: nextId, ...payload, created_at: new Date().toISOString() };
      memoryStore[table].push(item);
      return item;
    }

    if (mode === 'update') {
      const index = memoryStore[table].findIndex(item => item.id === payload.id);
      if (index > -1) {
        memoryStore[table][index] = { ...memoryStore[table][index], ...payload };
        return memoryStore[table][index];
      }
    }

    if (mode === 'delete') {
      memoryStore[table] = memoryStore[table].filter(item => item.id !== payload.id);
      return true;
    }

    return null;
  }
};

app.get('/', (req, res) => {
  res.json({
    message: 'AKRDevi admin backend is running',
    supabase_connected: supabaseConnected,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    supabase_connected: supabaseConnected,
    uptime: process.uptime()
  }, 'Backend healthy');
});

app.get('/api/test-connection', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Supabase credentials not configured.' });
  }

  try {
    const { data, error } = await supabase.from('admissions').select('*').limit(1);
    if (error) throw error;

    sendSuccess(res, {
      records_found: data?.length || 0,
      supabase_url: SUPABASE_URL
    }, 'Supabase connection is working');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const contacts = await readTable('contacts', memoryStore.contacts);
    const students = await readTable('students', memoryStore.students);
    const faculty = await readTable('faculty', memoryStore.faculty);

    const pending = admissions.filter(item => item.status === 'pending').length;
    const approved = admissions.filter(item => item.status === 'approved').length;
    const rejected = admissions.filter(item => item.status === 'rejected').length;

    const summary = {
      totalApplications: admissions.length,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalMessages: contacts.length,
      recentAdmissions: admissions.slice(0, 5),
      recentMessages: contacts.slice(0, 5)
    };

    sendSuccess(res, summary, 'Dashboard data loaded');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/admissions', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    sendSuccess(res, admissions, 'Admissions fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/admissions/:id', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const item = admissions.find(record => String(record.id) === String(req.params.id));
    if (!item) return sendError(res, new Error('Admission not found'), 404);
    sendSuccess(res, item, 'Admission fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    payload.created_at = new Date().toISOString();
    const created = await writeTable('admissions', payload, 'insert');
    sendSuccess(res, created, 'Admission submitted successfully', 201);
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.put('/api/admissions/:id', async (req, res) => {
  try {
    const admissions = await readTable('admissions', memoryStore.admissions);
    const target = admissions.find(record => String(record.id) === String(req.params.id));
    if (!target) return sendError(res, new Error('Admission not found'), 404);

    const payload = { ...target, ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('admissions', payload, 'update');
    sendSuccess(res, updated, 'Admission updated successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const payload = { id: Number(req.params.id) };
    const deleted = await writeTable('admissions', payload, 'delete');
    if (!deleted) return sendError(res, new Error('Admission delete failed'), 400);
    sendSuccess(res, null, 'Admission deleted successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await readTable('contacts', memoryStore.contacts);
    sendSuccess(res, contacts, 'Contacts fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readTable('contacts', memoryStore.contacts);
    const item = contacts.find(record => String(record.id) === String(req.params.id));
    if (!item) return sendError(res, new Error('Contact not found'), 404);
    sendSuccess(res, item, 'Contact fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    payload.created_at = new Date().toISOString();
    const created = await writeTable('contacts', payload, 'insert');
    sendSuccess(res, created, 'Contact message sent successfully', 201);
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readTable('contacts', memoryStore.contacts);
    const target = contacts.find(record => String(record.id) === String(req.params.id));
    if (!target) return sendError(res, new Error('Contact not found'), 404);

    const payload = { ...target, ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('contacts', payload, 'update');
    sendSuccess(res, updated, 'Contact updated successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const payload = { id: Number(req.params.id) };
    const deleted = await writeTable('contacts', payload, 'delete');
    if (!deleted) return sendError(res, new Error('Contact delete failed'), 400);
    sendSuccess(res, null, 'Contact deleted successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await readTable('students', memoryStore.students);
    sendSuccess(res, students, 'Students fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const students = await readTable('students', memoryStore.students);
    const item = students.find(record => String(record.id) === String(req.params.id));
    if (!item) return sendError(res, new Error('Student not found'), 404);
    sendSuccess(res, item, 'Student fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    payload.created_at = new Date().toISOString();
    const created = await writeTable('students', payload, 'insert');
    sendSuccess(res, created, 'Student created successfully', 201);
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const students = await readTable('students', memoryStore.students);
    const target = students.find(record => String(record.id) === String(req.params.id));
    if (!target) return sendError(res, new Error('Student not found'), 404);

    const payload = { ...target, ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('students', payload, 'update');
    sendSuccess(res, updated, 'Student updated successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const payload = { id: Number(req.params.id) };
    const deleted = await writeTable('students', payload, 'delete');
    if (!deleted) return sendError(res, new Error('Student delete failed'), 400);
    sendSuccess(res, null, 'Student deleted successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/faculty', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    sendSuccess(res, faculty, 'Faculty fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.get('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    const item = faculty.find(record => String(record.id) === String(req.params.id));
    if (!item) return sendError(res, new Error('Faculty not found'), 404);
    sendSuccess(res, item, 'Faculty fetched');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.post('/api/faculty', async (req, res) => {
  try {
    const payload = sanitizeBody(req.body);
    payload.created_at = new Date().toISOString();
    const created = await writeTable('faculty', payload, 'insert');
    sendSuccess(res, created, 'Faculty created successfully', 201);
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.put('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await readTable('faculty', memoryStore.faculty);
    const target = faculty.find(record => String(record.id) === String(req.params.id));
    if (!target) return sendError(res, new Error('Faculty not found'), 404);

    const payload = { ...target, ...sanitizeBody(req.body), id: Number(req.params.id) };
    const updated = await writeTable('faculty', payload, 'update');
    sendSuccess(res, updated, 'Faculty updated successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.delete('/api/faculty/:id', async (req, res) => {
  try {
    const payload = { id: Number(req.params.id) };
    const deleted = await writeTable('faculty', payload, 'delete');
    if (!deleted) return sendError(res, new Error('Faculty delete failed'), 400);
    sendSuccess(res, null, 'Faculty deleted successfully');
  } catch (error) {
    sendError(res, error, 500);
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AKRDevi admin backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📡 Dashboard: http://localhost:${PORT}/api/admin/dashboard\n`);
});
