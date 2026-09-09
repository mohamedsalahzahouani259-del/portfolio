// ====================================================================
// SCHOOLFLOW TN - MULTI-TENANT LOCAL STORAGE & REPOSITORY
// Complete persistence for Students, Formations, Groups, Attendance, Payments
// ====================================================================

import {
  User,
  Organization,
  Classroom,
  Trainer,
  Formation,
  Group,
  Student,
  Enrollment,
  ClassSession,
  AttendanceRecord,
  Payment,
  Evaluation,
  Grade,
  Certificate,
  ActivityLog,
} from '../types';
import {
  DEMO_ORGANIZATION,
  DEMO_USERS,
  DEMO_CLASSROOMS,
  DEMO_TRAINERS,
  DEMO_FORMATIONS,
  DEMO_GROUPS,
  DEMO_STUDENTS,
  DEMO_ENROLLMENTS,
  DEMO_SESSIONS,
  DEMO_ATTENDANCE,
  DEMO_PAYMENTS,
  DEMO_EVALUATIONS,
  DEMO_GRADES,
  DEMO_CERTIFICATES,
  DEMO_ACTIVITY_LOGS,
} from './demoData';
import { formatStudentId, formatReceiptNumber } from './academicEngine';

const STORAGE_KEYS = {
  CURRENT_USER: 'schoolflow_current_user',
  ORGANIZATIONS: 'schoolflow_organizations',
  USERS: 'schoolflow_users',
  CLASSROOMS: 'schoolflow_classrooms',
  TRAINERS: 'schoolflow_trainers',
  FORMATIONS: 'schoolflow_formations',
  GROUPS: 'schoolflow_groups',
  STUDENTS: 'schoolflow_students',
  ENROLLMENTS: 'schoolflow_enrollments',
  SESSIONS: 'schoolflow_sessions',
  ATTENDANCE: 'schoolflow_attendance',
  PAYMENTS: 'schoolflow_payments',
  EVALUATIONS: 'schoolflow_evaluations',
  GRADES: 'schoolflow_grades',
  CERTIFICATES: 'schoolflow_certificates',
  ACTIVITY_LOGS: 'schoolflow_activity_logs',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return defaultValue;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return defaultValue;
    return parsed;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export function initializeStorageIfEmpty(): void {
  try {
    const existingOrg = getFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, []);
    const existingUser = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!existingOrg || !Array.isArray(existingOrg) || existingOrg.length === 0 || !existingUser) {
      resetStorageToDemo();
    }
  } catch (e) {
    console.error('Failed to initialize storage:', e);
    resetStorageToDemo();
  }
}

export function resetStorageToDemo(): void {
  setToStorage(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]); // Direction by default
  setToStorage(STORAGE_KEYS.ORGANIZATIONS, [DEMO_ORGANIZATION]);
  setToStorage(STORAGE_KEYS.USERS, DEMO_USERS);
  setToStorage(STORAGE_KEYS.CLASSROOMS, DEMO_CLASSROOMS);
  setToStorage(STORAGE_KEYS.TRAINERS, DEMO_TRAINERS);
  setToStorage(STORAGE_KEYS.FORMATIONS, DEMO_FORMATIONS);
  setToStorage(STORAGE_KEYS.GROUPS, DEMO_GROUPS);
  setToStorage(STORAGE_KEYS.STUDENTS, DEMO_STUDENTS);
  setToStorage(STORAGE_KEYS.ENROLLMENTS, DEMO_ENROLLMENTS);
  setToStorage(STORAGE_KEYS.SESSIONS, DEMO_SESSIONS);
  setToStorage(STORAGE_KEYS.ATTENDANCE, DEMO_ATTENDANCE);
  setToStorage(STORAGE_KEYS.PAYMENTS, DEMO_PAYMENTS);
  setToStorage(STORAGE_KEYS.EVALUATIONS, DEMO_EVALUATIONS);
  setToStorage(STORAGE_KEYS.GRADES, DEMO_GRADES);
  setToStorage(STORAGE_KEYS.CERTIFICATES, DEMO_CERTIFICATES);
  setToStorage(STORAGE_KEYS.ACTIVITY_LOGS, DEMO_ACTIVITY_LOGS);
}

export function clearAllTenantData(orgId: string): void {
  setToStorage(
    STORAGE_KEYS.STUDENTS,
    getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []).filter((s) => s && s.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.GROUPS,
    getFromStorage<Group[]>(STORAGE_KEYS.GROUPS, []).filter((g) => g && g.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.FORMATIONS,
    getFromStorage<Formation[]>(STORAGE_KEYS.FORMATIONS, []).filter((f) => f && f.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.ENROLLMENTS,
    getFromStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []).filter((e) => e && e.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.PAYMENTS,
    getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []).filter((p) => p && p.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.SESSIONS,
    getFromStorage<ClassSession[]>(STORAGE_KEYS.SESSIONS, []).filter((s) => s && s.organizationId !== orgId)
  );
  setToStorage(
    STORAGE_KEYS.CERTIFICATES,
    getFromStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []).filter((c) => c && c.organizationId !== orgId)
  );
}

export const StorageService = {
  getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]) || DEMO_USERS[0];
  },
  setCurrentUser(user: User | null): void {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },
  getAllUsers(): User[] {
    const list = getFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
    return Array.isArray(list) ? list : DEMO_USERS;
  },

  getOrganizations(): Organization[] {
    const list = getFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, [DEMO_ORGANIZATION]);
    return Array.isArray(list) && list.length > 0 ? list : [DEMO_ORGANIZATION];
  },
  getOrganizationById(id: string): Organization | undefined {
    return this.getOrganizations().find((o) => o.id === id);
  },
  saveOrganization(org: Organization): void {
    const list = this.getOrganizations();
    const index = list.findIndex((o) => o.id === org.id);
    if (index >= 0) {
      list[index] = { ...org, updatedAt: new Date().toISOString() };
    } else {
      list.push(org);
    }
    setToStorage(STORAGE_KEYS.ORGANIZATIONS, list);
  },

  // Students
  getStudents(orgId: string): Student[] {
    const list = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
    return Array.isArray(list) ? list.filter((s) => s && s.organizationId === orgId) : [];
  },
  saveStudent(student: Student, orgId: string): void {
    const all = this.getStudents(orgId);
    const fullList = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const index = fullList.findIndex((s) => s && s.id === student.id);
    if (index >= 0) {
      fullList[index] = { ...student, updatedAt: new Date().toISOString() };
    } else {
      fullList.unshift(student);
      const org = this.getOrganizationById(orgId);
      if (org) {
        org.nextStudentNumber = (org.nextStudentNumber || 1) + 1;
        this.saveOrganization(org);
      }
    }
    setToStorage(STORAGE_KEYS.STUDENTS, fullList);
  },
  deleteStudent(studentId: string, orgId: string): void {
    const all = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
    setToStorage(STORAGE_KEYS.STUDENTS, Array.isArray(all) ? all.filter((s) => s && !(s.id === studentId && s.organizationId === orgId)) : []);
  },

  // Formations
  getFormations(orgId: string): Formation[] {
    const list = getFromStorage<Formation[]>(STORAGE_KEYS.FORMATIONS, []);
    return Array.isArray(list) ? list.filter((f) => f && f.organizationId === orgId) : [];
  },
  saveFormation(formation: Formation): void {
    const all = getFromStorage<Formation[]>(STORAGE_KEYS.FORMATIONS, []);
    const list = Array.isArray(all) ? all : [];
    const index = list.findIndex((f) => f && f.id === formation.id);
    if (index >= 0) list[index] = { ...formation, updatedAt: new Date().toISOString() };
    else list.unshift(formation);
    setToStorage(STORAGE_KEYS.FORMATIONS, list);
  },

  // Groups
  getGroups(orgId: string): Group[] {
    const list = getFromStorage<Group[]>(STORAGE_KEYS.GROUPS, []);
    return Array.isArray(list) ? list.filter((g) => g && g.organizationId === orgId) : [];
  },
  saveGroup(group: Group): void {
    const all = getFromStorage<Group[]>(STORAGE_KEYS.GROUPS, []);
    const list = Array.isArray(all) ? all : [];
    const index = list.findIndex((g) => g && g.id === group.id);
    if (index >= 0) list[index] = { ...group, updatedAt: new Date().toISOString() };
    else list.unshift(group);
    setToStorage(STORAGE_KEYS.GROUPS, list);
  },

  // Trainers
  getTrainers(orgId: string): Trainer[] {
    const list = getFromStorage<Trainer[]>(STORAGE_KEYS.TRAINERS, []);
    return Array.isArray(list) ? list.filter((t) => t && t.organizationId === orgId) : [];
  },
  saveTrainer(trainer: Trainer): void {
    const all = getFromStorage<Trainer[]>(STORAGE_KEYS.TRAINERS, []);
    const list = Array.isArray(all) ? all : [];
    const index = list.findIndex((t) => t && t.id === trainer.id);
    if (index >= 0) list[index] = { ...trainer, updatedAt: new Date().toISOString() };
    else list.unshift(trainer);
    setToStorage(STORAGE_KEYS.TRAINERS, list);
  },

  // Classrooms
  getClassrooms(orgId: string): Classroom[] {
    const list = getFromStorage<Classroom[]>(STORAGE_KEYS.CLASSROOMS, []);
    return Array.isArray(list) ? list.filter((c) => c && c.organizationId === orgId) : [];
  },

  // Sessions
  getSessions(orgId: string): ClassSession[] {
    const list = getFromStorage<ClassSession[]>(STORAGE_KEYS.SESSIONS, []);
    return Array.isArray(list) ? list.filter((s) => s && s.organizationId === orgId) : [];
  },
  saveSession(session: ClassSession): void {
    const all = getFromStorage<ClassSession[]>(STORAGE_KEYS.SESSIONS, []);
    const list = Array.isArray(all) ? all : [];
    const index = list.findIndex((s) => s && s.id === session.id);
    if (index >= 0) list[index] = session;
    else list.push(session);
    setToStorage(STORAGE_KEYS.SESSIONS, list);
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    const list = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    return Array.isArray(list) ? list : [];
  },
  saveAttendance(records: AttendanceRecord[]): void {
    const all = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    const list = Array.isArray(all) ? all : [];
    records.forEach((rec) => {
      const idx = list.findIndex((a) => a && a.sessionId === rec.sessionId && a.studentId === rec.studentId);
      if (idx >= 0) list[idx] = rec;
      else list.push(rec);
    });
    setToStorage(STORAGE_KEYS.ATTENDANCE, list);
  },

  // Enrollments
  getEnrollments(orgId: string): Enrollment[] {
    const list = getFromStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
    return Array.isArray(list) ? list.filter((e) => e && e.organizationId === orgId) : [];
  },
  saveEnrollment(enrollment: Enrollment): void {
    const all = getFromStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
    const list = Array.isArray(all) ? all : [];
    const idx = list.findIndex((e) => e && e.id === enrollment.id);
    if (idx >= 0) list[idx] = enrollment;
    else list.unshift(enrollment);
    setToStorage(STORAGE_KEYS.ENROLLMENTS, list);
  },

  // Payments
  getPayments(orgId: string): Payment[] {
    const list = getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    return Array.isArray(list) ? list.filter((p) => p && p.organizationId === orgId) : [];
  },
  savePayment(payment: Payment, orgId: string): void {
    const all = getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const list = Array.isArray(all) ? all : [];
    list.unshift(payment);
    setToStorage(STORAGE_KEYS.PAYMENTS, list);

    const org = this.getOrganizationById(orgId);
    if (org) {
      org.nextReceiptNumber = (org.nextReceiptNumber || 1) + 1;
      this.saveOrganization(org);
    }
  },

  // Evaluations & Grades
  getEvaluations(): Evaluation[] {
    const list = getFromStorage<Evaluation[]>(STORAGE_KEYS.EVALUATIONS, []);
    return Array.isArray(list) ? list : [];
  },
  saveEvaluation(evaluation: Evaluation): void {
    const all = getFromStorage<Evaluation[]>(STORAGE_KEYS.EVALUATIONS, []);
    const list = Array.isArray(all) ? all : [];
    list.unshift(evaluation);
    setToStorage(STORAGE_KEYS.EVALUATIONS, list);
  },
  getGrades(): Grade[] {
    const list = getFromStorage<Grade[]>(STORAGE_KEYS.GRADES, []);
    return Array.isArray(list) ? list : [];
  },
  saveGrades(grades: Grade[]): void {
    const all = getFromStorage<Grade[]>(STORAGE_KEYS.GRADES, []);
    const list = Array.isArray(all) ? all : [];
    grades.forEach((g) => {
      const idx = list.findIndex((item) => item && item.evaluationId === g.evaluationId && item.studentId === g.studentId);
      if (idx >= 0) list[idx] = g;
      else list.push(g);
    });
    setToStorage(STORAGE_KEYS.GRADES, list);
  },

  // Certificates
  getCertificates(orgId: string): Certificate[] {
    const list = getFromStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    return Array.isArray(list) ? list.filter((c) => c && c.organizationId === orgId) : [];
  },
  saveCertificate(cert: Certificate): void {
    const all = getFromStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    const list = Array.isArray(all) ? all : [];
    list.unshift(cert);
    setToStorage(STORAGE_KEYS.CERTIFICATES, list);
  },

  // Activity Logs
  getActivityLogs(orgId: string): ActivityLog[] {
    const list = getFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
    return Array.isArray(list) ? list.filter((l) => l && l.organizationId === orgId) : [];
  },
  addActivityLog(orgId: string, userName: string, action: string, details?: string): void {
    const all = getFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
    const list = Array.isArray(all) ? all : [];
    list.unshift({
      id: `log_${Date.now()}`,
      organizationId: orgId,
      userName,
      action,
      details,
      createdAt: new Date().toISOString(),
    });
    setToStorage(STORAGE_KEYS.ACTIVITY_LOGS, list.slice(0, 100)); // keep last 100
  },

  getNextStudentId(org: Organization): string {
    return formatStudentId(org.studentIdPrefix || 'STU-2026-', org.nextStudentNumber || 1);
  },
  getNextReceiptNumber(org: Organization): string {
    return formatReceiptNumber(org.receiptPrefix || 'REC-2026-', org.nextReceiptNumber || 1);
  },
};
