import { AttendanceRecord, Student } from '../types';
import { initialTodayAttendance, initialStudents } from '../data/seedData';

let attendanceStore: AttendanceRecord[] = [...initialTodayAttendance];
let defaulterThreshold = 75; // configurable default 75%

export const attendanceService = {
  getTodayRecords: (): AttendanceRecord[] => {
    return [...attendanceStore];
  },

  getStats: () => {
    const total = attendanceStore.length;
    const present = attendanceStore.filter(a => a.status === 'present').length;
    const absent = attendanceStore.filter(a => a.status === 'absent').length;
    const late = attendanceStore.filter(a => a.status === 'late').length;
    const excused = attendanceStore.filter(a => a.status === 'excused').length;
    const rate = total > 0 ? parseFloat(((present + late * 0.5) / total * 100).toFixed(1)) : 0;

    // Dept wise
    const deptBreakdown = {
      Science: { present: 0, absent: 0, late: 0, total: 0 },
      Commerce: { present: 0, absent: 0, late: 0, total: 0 },
      Arts: { present: 0, absent: 0, late: 0, total: 0 }
    };

    attendanceStore.forEach(rec => {
      const student = initialStudents.find(s => s.id === rec.studentId);
      if (student && deptBreakdown[student.department]) {
        deptBreakdown[student.department].total++;
        if (rec.status === 'present') deptBreakdown[student.department].present++;
        if (rec.status === 'absent') deptBreakdown[student.department].absent++;
        if (rec.status === 'late') deptBreakdown[student.department].late++;
      }
    });

    return { total, present, absent, late, excused, rate, deptBreakdown };
  },

  updateRecordStatus: (id: string, status: 'present' | 'absent' | 'late' | 'excused'): AttendanceRecord | null => {
    const idx = attendanceStore.findIndex(a => a.id === id);
    if (idx > -1) {
      attendanceStore[idx] = {
        ...attendanceStore[idx],
        status,
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return attendanceStore[idx];
    }
    return null;
  },

  bulkMarkAll: (status: 'present' | 'absent'): void => {
    attendanceStore = attendanceStore.map(a => ({
      ...a,
      status,
      markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  // QR Code check-in simulation
  processQrCheckin: (studentId: string): { success: boolean; message: string; record?: AttendanceRecord } => {
    const rec = attendanceStore.find(a => a.studentId === studentId || a.rollNo === studentId);
    if (!rec) return { success: false, message: 'Student ID not found in current session' };
    rec.status = 'present';
    rec.method = 'qr';
    rec.markedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { success: true, message: `QR Verified: ${rec.studentName} marked Present`, record: rec };
  },

  // Biometric/RFID mock device feed adapter
  simulateBiometricSwipe: (rollNo: string): { success: boolean; message: string; record?: AttendanceRecord } => {
    const rec = attendanceStore.find(a => a.rollNo === rollNo);
    if (!rec) return { success: false, message: 'RFID/Biometric tag not registered' };
    rec.status = 'present';
    rec.method = 'biometric';
    rec.markedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { success: true, message: `Gate RFID Sensor: ${rec.studentName} logged in!`, record: rec };
  },

  // Geo-fenced self-check-in simulation
  processGeoCheckin: (studentId: string, lat: number, lng: number): { success: boolean; message: string } => {
    // AKRDevi College Campus Coordinates ~ Koppal
    const campusLat = 15.3444;
    const campusLng = 76.1555;
    const distKm = Math.sqrt(Math.pow(lat - campusLat, 2) + Math.pow(lng - campusLng, 2)) * 111;
    if (distKm > 0.5) {
      return { success: false, message: 'Outside Geo-fence boundary (>500m from campus)' };
    }
    const rec = attendanceStore.find(a => a.studentId === studentId);
    if (rec) {
      rec.status = 'present';
      rec.method = 'geo';
      rec.markedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { success: true, message: `Campus Geo-fence Verified: Marked Present` };
    }
    return { success: false, message: 'Record not found' };
  },

  // Defaulter Engine
  getDefaulters: (students: Student[] = initialStudents, threshold: number = defaulterThreshold): Student[] => {
    return students.filter(s => s.attendancePct < threshold);
  },

  setDefaulterThreshold: (val: number) => {
    defaulterThreshold = val;
  },

  getDefaulterThreshold: () => defaulterThreshold,

  notifyDefaulters: (defaulters: Student[]): { notifiedCount: number; message: string } => {
    return {
      notifiedCount: defaulters.length,
      message: `Automated SMS & Email dispatched to ${defaulters.length} students & guardians (<${defaulterThreshold}% attendance warning).`
    };
  },

  exportAttendanceCsv: (): string => {
    const headers = ['Roll No', 'Student Name', 'Class', 'Subject', 'Status', 'Method', 'Time', 'Remarks'];
    const rows = attendanceStore.map(r => [
      r.rollNo,
      `"${r.studentName}"`,
      r.classId,
      r.subjectName,
      r.status.toUpperCase(),
      r.method.toUpperCase(),
      r.markedAt,
      `"${r.remarks || ''}"`
    ]);
    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }
};
