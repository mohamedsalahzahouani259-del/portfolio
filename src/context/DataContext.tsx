// ====================================================================
// SCHOOLFLOW TN - DATA CONTEXT & CENTER MANAGEMENT OPERATIONS
// Students, Formations, Groups, Attendance, Payments, Evaluations
// ====================================================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Student,
  Formation,
  Group,
  Trainer,
  Classroom,
  ClassSession,
  AttendanceRecord,
  Enrollment,
  Payment,
  Evaluation,
  Grade,
  Certificate,
  ActivityLog,
  CenterMetrics,
  PaymentMethod,
  ScheduleConflict,
} from '../types';
import { useAuth } from './AuthContext';
import { StorageService, resetStorageToDemo, clearAllTenantData } from '../lib/storage';
import { checkScheduleConflicts, calculateAttendanceRate } from '../lib/academicEngine';

interface DataContextType {
  students: Student[];
  formations: Formation[];
  groups: Group[];
  trainers: Trainer[];
  classrooms: Classroom[];
  sessions: ClassSession[];
  attendance: AttendanceRecord[];
  enrollments: Enrollment[];
  payments: Payment[];
  evaluations: Evaluation[];
  grades: Grade[];
  certificates: Certificate[];
  activityLogs: ActivityLog[];
  metrics: CenterMetrics;
  isLoading: boolean;

  // Students
  createStudent: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' | 'studentNumber'>, targetGroupId?: string) => Student;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  // Formations
  createFormation: (data: Omit<Formation, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) => Formation;
  updateFormation: (formation: Formation) => void;

  // Groups
  createGroup: (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) => Group;
  updateGroup: (group: Group) => void;

  // Trainers
  createTrainer: (data: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) => Trainer;
  updateTrainer: (trainer: Trainer) => void;

  // Sessions & Conflicts
  checkSessionConflicts: (candidate: Omit<ClassSession, 'id' | 'createdAt' | 'organizationId'> & { id?: string; organizationId?: string }) => ScheduleConflict[];
  createSession: (data: Omit<ClassSession, 'id' | 'createdAt' | 'organizationId'>) => { session?: ClassSession; conflicts?: ScheduleConflict[] };
  updateSession: (session: ClassSession) => { success: boolean; conflicts?: ScheduleConflict[] };
  deleteSession: (id: string) => void;

  // Attendance
  saveSessionAttendance: (sessionId: string, records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => void;

  // Payments & Receipts
  recordPayment: (enrollmentId: string, studentId: string, amount: number, method: PaymentMethod, notes?: string) => Payment;

  // Evaluations & Grades
  createEvaluation: (data: Omit<Evaluation, 'id' | 'createdAt'>) => Evaluation;
  saveEvaluationGrades: (evaluationId: string, gradeItems: { studentId: string; gradeValue: number; appreciation?: string }[]) => void;

  // Certificates
  issueCertificate: (studentId: string, formationId: string, mention: Certificate['mention']) => Certificate;

  // Utilities
  resetToDemo: () => void;
  clearWorkspace: () => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, organization } = useAuth();
  const orgId = organization?.id || 'org_schoolflow_01';

  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents(orgId));
  const [formations, setFormations] = useState<Formation[]>(() => StorageService.getFormations(orgId));
  const [groups, setGroups] = useState<Group[]>(() => StorageService.getGroups(orgId));
  const [trainers, setTrainers] = useState<Trainer[]>(() => StorageService.getTrainers(orgId));
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => StorageService.getClassrooms(orgId));
  const [sessions, setSessions] = useState<ClassSession[]>(() => StorageService.getSessions(orgId));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => StorageService.getEnrollments(orgId));
  const [payments, setPayments] = useState<Payment[]>(() => StorageService.getPayments(orgId));
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => StorageService.getEvaluations());
  const [grades, setGrades] = useState<Grade[]>(() => StorageService.getGrades());
  const [certificates, setCertificates] = useState<Certificate[]>(() => StorageService.getCertificates(orgId));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => StorageService.getActivityLogs(orgId));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadAllData = useCallback(() => {
    const currentId = orgId || 'org_schoolflow_01';
    setStudents(StorageService.getStudents(currentId));
    setFormations(StorageService.getFormations(currentId));
    setGroups(StorageService.getGroups(currentId));
    setTrainers(StorageService.getTrainers(currentId));
    setClassrooms(StorageService.getClassrooms(currentId));
    setSessions(StorageService.getSessions(currentId));
    setAttendance(StorageService.getAttendance());
    setEnrollments(StorageService.getEnrollments(currentId));
    setPayments(StorageService.getPayments(currentId));
    setEvaluations(StorageService.getEvaluations());
    setGrades(StorageService.getGrades());
    setCertificates(StorageService.getCertificates(currentId));
    setActivityLogs(StorageService.getActivityLogs(currentId));
  }, [orgId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Log action helper
  const logAction = (action: string, details?: string) => {
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Directeur';
    StorageService.addActivityLog(orgId, userName, action, details);
    setActivityLogs(StorageService.getActivityLogs(orgId));
  };

  // --- Students ---
  const createStudent = (
    data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'organizationId' | 'studentNumber'>,
    targetGroupId?: string
  ): Student => {
    if (!organization) throw new Error('Aucun centre actif');

    const nextId = StorageService.getNextStudentId(organization);
    const newStudent: Student = {
      ...data,
      id: `stu_${Date.now()}`,
      organizationId: orgId,
      studentNumber: nextId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveStudent(newStudent, orgId);
    setStudents((prev) => [newStudent, ...prev]);

    // Optional immediate group enrollment
    if (targetGroupId) {
      const group = groups.find((g) => g.id === targetGroupId);
      const formation = group ? formations.find((f) => f.id === group.formationId) : null;
      const tuition = formation?.price || 1200;

      const newEnrollment: Enrollment = {
        id: `enr_${Date.now()}`,
        organizationId: orgId,
        studentId: newStudent.id,
        groupId: targetGroupId,
        formationId: group?.formationId,
        agreedPrice: tuition,
        enrollmentDate: new Date().toISOString().split('T')[0],
        totalTuition: tuition,
        paidAmount: 0,
        status: 'enrolled',
        installmentsCount: 3,
        createdAt: new Date().toISOString(),
      };
      StorageService.saveEnrollment(newEnrollment);
      setEnrollments((prev) => [newEnrollment, ...prev]);
    }

    logAction('Inscription étudiant', `${newStudent.firstName} ${newStudent.lastName} (${nextId})`);
    return newStudent;
  };

  const updateStudent = (student: Student) => {
    StorageService.saveStudent(student, orgId);
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    logAction('Modification étudiant', `${student.firstName} ${student.lastName}`);
  };

  const deleteStudent = (id: string) => {
    const s = students.find((item) => item.id === id);
    StorageService.deleteStudent(id, orgId);
    setStudents((prev) => prev.filter((item) => item.id !== id));
    logAction('Suppression étudiant', s ? `${s.firstName} ${s.lastName}` : id);
  };

  // --- Formations ---
  const createFormation = (data: Omit<Formation, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Formation => {
    const newF: Formation = {
      ...data,
      id: `form_${Date.now()}`,
      organizationId: orgId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveFormation(newF);
    setFormations((prev) => [newF, ...prev]);
    logAction('Nouvelle formation', newF.name);
    return newF;
  };

  const updateFormation = (formation: Formation) => {
    StorageService.saveFormation(formation);
    setFormations((prev) => prev.map((f) => (f.id === formation.id ? formation : f)));
  };

  // --- Groups ---
  const createGroup = (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Group => {
    const newG: Group = {
      ...data,
      id: `grp_${Date.now()}`,
      organizationId: orgId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveGroup(newG);
    setGroups((prev) => [newG, ...prev]);
    logAction('Nouveau groupe créé', `Groupe ${newG.code}`);
    return newG;
  };

  const updateGroup = (group: Group) => {
    StorageService.saveGroup(group);
    setGroups((prev) => prev.map((g) => (g.id === group.id ? group : g)));
  };

  // --- Trainers ---
  const createTrainer = (data: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>): Trainer => {
    const newT: Trainer = {
      ...data,
      id: `trn_${Date.now()}`,
      organizationId: orgId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveTrainer(newT);
    setTrainers((prev) => [newT, ...prev]);
    logAction('Nouveau formateur', `${newT.firstName} ${newT.lastName}`);
    return newT;
  };

  const updateTrainer = (trainer: Trainer) => {
    StorageService.saveTrainer(trainer);
    setTrainers((prev) => prev.map((t) => (t.id === trainer.id ? trainer : t)));
  };

  // --- Sessions & Schedule Conflicts (Rule #28) ---
  const checkSessionConflicts = (
    candidate: Omit<ClassSession, 'id' | 'createdAt' | 'organizationId'> & { id?: string; organizationId?: string }
  ): ScheduleConflict[] => {
    const fullCandidate = { organizationId: orgId, ...candidate };
    return checkScheduleConflicts(fullCandidate, sessions, trainers, classrooms);
  };

  const createSession = (data: Omit<ClassSession, 'id' | 'createdAt' | 'organizationId'>) => {
    const candidate = { ...data, organizationId: orgId };
    const conflicts = checkScheduleConflicts(candidate, sessions, trainers, classrooms);

    if (conflicts.length > 0) {
      return { conflicts };
    }

    const newS: ClassSession = {
      ...data,
      id: `sess_${Date.now()}`,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveSession(newS);
    setSessions((prev) => [...prev, newS]);
    logAction('Séance programmée', `${newS.sessionDate} (${newS.startTime} - ${newS.endTime})`);
    return { session: newS };
  };

  const updateSession = (session: ClassSession) => {
    const conflicts = checkScheduleConflicts(session, sessions, trainers, classrooms);
    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }
    StorageService.saveSession(session);
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
    return { success: true };
  };

  const deleteSession = (id: string) => {
    const all = sessions.filter((s) => s.id !== id);
    setSessions(all);
    const stored = StorageService.getSessions(orgId).filter((s) => s.id !== id);
    // save updated
    localStorage.setItem('schoolflow_sessions', JSON.stringify(stored));
  };

  // --- Attendance (Rule #31) ---
  const saveSessionAttendance = (sessionId: string, records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => {
    const fullRecords: AttendanceRecord[] = records.map((r) => ({
      ...r,
      id: `att_${sessionId}_${r.studentId}`,
      recordedAt: new Date().toISOString(),
    }));

    StorageService.saveAttendance(fullRecords);
    setAttendance(StorageService.getAttendance());

    // Mark session completed
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      updateSession({ ...session, status: 'completed' });
    }

    logAction('Émargement enregistré', `Séance du ${session?.sessionDate || 'cours'}`);
  };

  // --- Payments (Rule #34, #35, #36) ---
  const recordPayment = (
    enrollmentId: string,
    studentId: string,
    amount: number,
    method: PaymentMethod,
    notes?: string
  ): Payment => {
    if (!organization) throw new Error('Organisation introuvable');

    const student = students.find((s) => s.id === studentId);
    const receiptNum = StorageService.getNextReceiptNumber(organization);
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      organizationId: orgId,
      enrollmentId,
      studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : undefined,
      receiptNumber: receiptNum,
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      method,
      status: 'paid',
      notes,
      createdAt: new Date().toISOString(),
    };

    // Update enrollment paidAmount
    const enrollment = enrollments.find((e) => e.id === enrollmentId);
    if (enrollment) {
      const updatedEnrollment: Enrollment = {
        ...enrollment,
        paidAmount: Math.round((enrollment.paidAmount + amount) * 100) / 100,
      };
      StorageService.saveEnrollment(updatedEnrollment);
      setEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? updatedEnrollment : e)));
    }

    StorageService.savePayment(newPayment, orgId);
    setPayments((prev) => [newPayment, ...prev]);

    logAction('Paiement encaissé', `${amount.toFixed(2)} DT (${receiptNum}) - ${student?.firstName} ${student?.lastName}`);

    return newPayment;
  };

  // --- Evaluations & Grades (Rule #39, #40) ---
  const createEvaluation = (data: Omit<Evaluation, 'id' | 'createdAt'>): Evaluation => {
    const newEval: Evaluation = {
      ...data,
      id: `eval_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveEvaluation(newEval);
    setEvaluations((prev) => [newEval, ...prev]);
    logAction('Évaluation créée', newEval.title);
    return newEval;
  };

  const saveEvaluationGrades = (
    evaluationId: string,
    gradeItems: { studentId: string; gradeValue: number; appreciation?: string }[]
  ) => {
    const fullGrades: Grade[] = gradeItems.map((g) => ({
      id: `grd_${evaluationId}_${g.studentId}`,
      evaluationId,
      studentId: g.studentId,
      gradeValue: g.gradeValue,
      appreciation: g.appreciation,
      createdAt: new Date().toISOString(),
    }));

    StorageService.saveGrades(fullGrades);
    setGrades(StorageService.getGrades());
    logAction('Notes attribuées', `Évaluation mise à jour pour ${gradeItems.length} étudiants`);
  };

  // --- Certificates (Rule #43) ---
  const issueCertificate = (
    studentId: string,
    formationId: string,
    mention: Certificate['mention']
  ): Certificate => {
    const certNumber = `CERT-2026-${String(certificates.length + 1).padStart(4, '0')}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      organizationId: orgId,
      studentId,
      formationId,
      certificateNumber: certNumber,
      issueDate: new Date().toISOString().split('T')[0],
      mention,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveCertificate(newCert);
    setCertificates((prev) => [newCert, ...prev]);

    const student = students.find((s) => s.id === studentId);
    logAction('Certificat délivré', `${certNumber} à ${student?.firstName} ${student?.lastName}`);
    return newCert;
  };

  // --- Real-time Metrics (Rule #13) ---
  const metrics: CenterMetrics = useMemo(() => {
    const safeStudents = Array.isArray(students) ? students : [];
    const safeGroups = Array.isArray(groups) ? groups : [];
    const safeFormations = Array.isArray(formations) ? formations : [];
    const safeTrainers = Array.isArray(trainers) ? trainers : [];
    const safePayments = Array.isArray(payments) ? payments : [];
    const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const safeAttendance = Array.isArray(attendance) ? attendance : [];

    const activeStudentsCount = safeStudents.filter((s) => s && s.status === 'active').length;
    const activeGroupsCount = safeGroups.filter((g) => g && g.status === 'active').length;
    const activeFormationsCount = safeFormations.filter((f) => f && f.status === 'active').length;
    const totalTrainersCount = safeTrainers.filter((t) => t && t.status === 'active').length;

    // Monthly revenue
    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
    const monthlyRevenue = safePayments
      .filter((p) => p && typeof p.paymentDate === 'string' && p.paymentDate.startsWith(currentMonthPrefix))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalRevenue = safePayments
      .filter((p) => p && p.status === 'paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalTuitionBilled = safeEnrollments.reduce(
      (sum, e) => sum + (Number(e?.agreedPrice) || Number(e?.totalTuition) || 0),
      0
    );
    const pendingPaymentsAmount = Math.max(0, totalTuitionBilled - totalRevenue);

    // Today attendance rate
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = safeSessions.filter(
      (s) => s && ((s.date || s.sessionDate) === today)
    );
    const todayRecords = safeAttendance.filter((a) =>
      todaySessions.some((s) => s && s.id === a?.sessionId)
    );
    const todayAttendanceRate = calculateAttendanceRate(
      todayRecords.length > 0 ? todayRecords : safeAttendance
    );

    return {
      totalStudents: safeStudents.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingReceivables: Math.round(pendingPaymentsAmount * 100) / 100,
      averageAttendanceRate: todayAttendanceRate || 92,
      activeSessions: todaySessions.length,
      totalGroups: safeGroups.length,
      activeStudentsCount,
      activeGroupsCount,
      activeFormationsCount,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      pendingPaymentsAmount: Math.round(pendingPaymentsAmount * 100) / 100,
      todayAttendanceRate,
      totalTrainersCount,
    };
  }, [students, groups, formations, trainers, payments, enrollments, sessions, attendance]);

  const resetToDemo = () => {
    resetStorageToDemo();
    loadAllData();
  };

  const clearWorkspace = () => {
    clearAllTenantData(orgId);
    loadAllData();
  };

  return (
    <DataContext.Provider
      value={{
        students,
        formations,
        groups,
        trainers,
        classrooms,
        sessions,
        attendance,
        enrollments,
        payments,
        evaluations,
        grades,
        certificates,
        activityLogs,
        metrics,
        isLoading,
        createStudent,
        updateStudent,
        deleteStudent,
        createFormation,
        updateFormation,
        createGroup,
        updateGroup,
        createTrainer,
        updateTrainer,
        checkSessionConflicts,
        createSession,
        updateSession,
        deleteSession,
        saveSessionAttendance,
        recordPayment,
        createEvaluation,
        saveEvaluationGrades,
        issueCertificate,
        resetToDemo,
        clearWorkspace,
        refreshData: loadAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
