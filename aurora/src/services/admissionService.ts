import { AdmissionApplication, Student } from '../types';

const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 1,
    fullName: 'Ravi Kumar',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@akrdevi.edu',
    phone: '+91 98765 43201',
    stream: 'Science',
    course: 'PUC Science - PCMB (Physics, Chem, Math, Bio)',
    grade: 'PUC-I',
    sslcScore: 92.5,
    status: 'approved',
    fatherName: 'Suresh Kumar',
    motherName: 'Suma Kumar',
    address: 'Sriramnagar, Koppal',
    dob: '2009-05-15',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'O+',
    income: '₹2.5 Lakh – ₹5 Lakh',
    emergencyPhone: '+91 98765 43211',
    schoolName: "St. Joseph's High School",
    board: 'Karnataka SSLC',
    passingYear: '2025',
    message: 'Aspiring to prepare for KCET/NEET with PCMB stream.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    fullName: 'Sneha Patel',
    name: 'Sneha Patel',
    email: 'sneha.patel@akrdevi.edu',
    phone: '+91 98765 43202',
    stream: 'Commerce',
    course: 'PUC Commerce - EBAC (Economics, Business, Accounts, Computer)',
    grade: 'PUC-I',
    sslcScore: 88.2,
    status: 'approved',
    fatherName: 'Kiran Patel',
    motherName: 'Kavita Patel',
    address: 'Gangavathi, Koppal',
    dob: '2008-08-20',
    gender: 'Female',
    category: 'OBC',
    bloodGroup: 'B+',
    income: '₹1 Lakh – ₹2.5 Lakh',
    emergencyPhone: '+91 98765 43212',
    schoolName: 'Gangavathi Govt High School',
    board: 'Karnataka SSLC',
    passingYear: '2025',
    message: 'Aspiring to become a Chartered Accountant.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 3,
    fullName: 'Ajay Nayak',
    name: 'Ajay Nayak',
    email: 'ajay.nayak@gmail.com',
    phone: '+91 98765 43203',
    stream: 'Science',
    course: 'PUC Science - PCMC (Physics, Chem, Math, Comp Science)',
    grade: 'PUC-I',
    sslcScore: 94.6,
    status: 'pending',
    fatherName: 'Girish Nayak',
    motherName: 'Sunita Nayak',
    address: 'Koppal Town',
    dob: '2009-02-14',
    gender: 'Male',
    category: 'General',
    bloodGroup: 'A+',
    income: '₹5 Lakh – ₹10 Lakh',
    emergencyPhone: '+91 98765 43213',
    schoolName: 'Rotary English Medium High School',
    board: 'CBSE',
    passingYear: '2025',
    message: 'Passionate about Computer Science, AI, and Software Engineering.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 4,
    fullName: 'Pooja Hegde',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@yahoo.com',
    phone: '+91 98765 43204',
    stream: 'Arts',
    course: 'PUC Arts - HEPS (History, Economics, Pol Science, Sociology)',
    grade: 'PUC-I',
    sslcScore: 81.0,
    status: 'pending',
    fatherName: 'Subramanya Hegde',
    motherName: 'Radha Hegde',
    address: 'Yelburga, Koppal',
    dob: '2008-11-09',
    gender: 'Female',
    category: 'General',
    bloodGroup: 'AB+',
    income: '₹1 Lakh – ₹2.5 Lakh',
    emergencyPhone: '+91 98765 43214',
    schoolName: 'Govt Girls High School Yelburga',
    board: 'Karnataka SSLC',
    passingYear: '2025',
    message: 'Interested in administrative civil services (UPSC) and History.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 5,
    fullName: 'Mohan Belagavi',
    name: 'Mohan Belagavi',
    email: 'mohan.b@rediffmail.com',
    phone: '+91 98765 43205',
    stream: 'Commerce',
    course: 'PUC Commerce - EBAC (Economics, Business, Accounts, Computer)',
    grade: 'PUC-I',
    sslcScore: 76.5,
    status: 'under_review',
    fatherName: 'Basappa Belagavi',
    motherName: 'Shantamma Belagavi',
    address: 'Kushtagi, Koppal',
    dob: '2009-07-22',
    gender: 'Male',
    category: 'ST',
    bloodGroup: 'B-',
    income: 'Below ₹1 Lakh',
    emergencyPhone: '+91 98765 43215',
    schoolName: 'Morarji Desai Residential School',
    board: 'Karnataka SSLC',
    passingYear: '2025',
    message: 'First graduate in family, applying for rural merit scholarship.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Helper to get stored admissions
const getStoredAdmissions = (): AdmissionApplication[] => {
  try {
    const raw = localStorage.getItem('aurora_admissions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read aurora_admissions from localStorage', e);
  }
  return [...INITIAL_ADMISSIONS];
};

let memoryAdmissions: AdmissionApplication[] = getStoredAdmissions();

const saveAdmissions = (list: AdmissionApplication[]) => {
  memoryAdmissions = list;
  try {
    localStorage.setItem('aurora_admissions', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('aurora_admissions_updated', { detail: list }));
  } catch (e) {
    console.warn('Could not persist admissions to localStorage', e);
  }
};

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return '';
    }
    if (window.location.origin.startsWith('http')) {
      return window.location.origin;
    }
  }
  return 'http://localhost:5000';
};

export const admissionService = {
  getAll: async (): Promise<AdmissionApplication[]> => {
    try {
      const res = await fetch(`${getApiBase()}/api/admissions`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const serverItems = json.data?.items || json.data || [];
        if (Array.isArray(serverItems) && serverItems.length > 0) {
          // Normalize server items
          const normalized: AdmissionApplication[] = serverItems.map((item: any) => ({
            id: item.id,
            fullName: item.fullName || item.name || 'Anonymous Applicant',
            name: item.name || item.fullName || 'Anonymous Applicant',
            email: item.email || '',
            phone: item.phone || '',
            stream: item.stream || (item.course && item.course.toLowerCase().includes('comm') ? 'Commerce' : (item.course && item.course.toLowerCase().includes('art') ? 'Arts' : 'Science')),
            course: item.course || 'PUC Course',
            grade: item.grade || 'PUC-I',
            sslcScore: item.sslc || item.sslcScore || 85.0,
            status: item.status || 'pending',
            fatherName: item.father || item.fatherName || '',
            motherName: item.mother || item.motherName || '',
            address: item.address || '',
            dob: item.dob || '',
            gender: item.gender || 'Not specified',
            category: item.category || 'General',
            bloodGroup: item.blood || item.bloodGroup || '',
            income: item.income || '',
            emergencyPhone: item.emergency || item.emergencyPhone || item.phone || '',
            schoolName: item.school || item.schoolName || '',
            board: item.board || '',
            passingYear: item.passingYear || '',
            message: item.message || '',
            created_at: item.created_at || new Date().toISOString()
          }));

          // Merge server items with any newly created local storage items
          const localOnly = memoryAdmissions.filter(local => !normalized.some(s => String(s.id) === String(local.id)));
          const merged = [...normalized, ...localOnly];
          saveAdmissions(merged);
          return merged;
        }
      }
    } catch (err) {
      // Offline fallback
    }
    return memoryAdmissions;
  },

  getAllSync: (): AdmissionApplication[] => {
    return memoryAdmissions;
  },

  updateStatus: async (id: string | number, status: 'pending' | 'under_review' | 'approved' | 'rejected') => {
    // Optimistic local update
    const updated = memoryAdmissions.map(item =>
      String(item.id) === String(id) ? { ...item, status } : item
    );
    saveAdmissions(updated);

    // Try backend sync
    try {
      await fetch(`${getApiBase()}/api/admissions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.warn('Backend admission status sync failed, kept in local memory');
    }

    return updated.find(i => String(i.id) === String(id));
  },

  addApplication: (app: Partial<AdmissionApplication>): AdmissionApplication => {
    const newApp: AdmissionApplication = {
      id: Date.now(),
      fullName: app.fullName || app.name || 'New Applicant',
      name: app.name || app.fullName || 'New Applicant',
      email: app.email || '',
      phone: app.phone || '',
      stream: app.stream || 'Science',
      course: app.course || 'PUC Science (PCMB)',
      grade: app.grade || 'PUC-I',
      sslcScore: app.sslcScore || 85.0,
      status: 'pending',
      fatherName: app.fatherName || '',
      motherName: app.motherName || '',
      address: app.address || '',
      dob: app.dob || '',
      gender: app.gender || 'Not specified',
      category: app.category || 'General',
      bloodGroup: app.bloodGroup || '',
      income: app.income || '',
      emergencyPhone: app.emergencyPhone || app.phone || '',
      schoolName: app.schoolName || '',
      board: app.board || 'Karnataka SSLC',
      passingYear: app.passingYear || '2025',
      message: app.message || '',
      created_at: new Date().toISOString()
    };

    saveAdmissions([newApp, ...memoryAdmissions]);
    return newApp;
  },

  deleteApplication: async (id: string | number) => {
    const filtered = memoryAdmissions.filter(i => String(i.id) !== String(id));
    saveAdmissions(filtered);

    try {
      await fetch(`${getApiBase()}/api/admissions/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignored
    }
  },

  getStats: () => {
    const total = memoryAdmissions.length;
    const pending = memoryAdmissions.filter(i => i.status === 'pending').length;
    const approved = memoryAdmissions.filter(i => i.status === 'approved').length;
    const underReview = memoryAdmissions.filter(i => i.status === 'under_review').length;
    const rejected = memoryAdmissions.filter(i => i.status === 'rejected').length;

    return { total, pending, approved, underReview, rejected };
  }
};
