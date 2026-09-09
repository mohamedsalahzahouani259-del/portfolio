// ====================================================================
// SCHOOLFLOW TN - COMPLETE TYPESCRIPT TYPE DEFINITIONS
// Professional Training Center Management Platform (Tunisia)
// ====================================================================

export type UserRole = 'owner' | 'admin' | 'secretary' | 'trainer' | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  currentOrganizationId: string;
  linkedTrainerId?: string; // If role is trainer
  linkedStudentId?: string; // If role is student
  isOnboarded: boolean;
}

export interface Organization {
  id: string;
  name: string;
  legalName?: string;
  directorName?: string;
  taxId?: string; // Matricule fiscal / Agrément ministériel
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  country: string;
  currency: 'DT' | 'EUR' | 'USD';
  currentAcademicYear: string; // e.g. "2026–2027"
  logoUrl?: string;
  website?: string;
  bankRib?: string;
  studentIdPrefix: string; // e.g. "STU-2026-"
  receiptPrefix: string; // e.g. "REC-2026-"
  nextStudentNumber: number;
  nextReceiptNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface Classroom {
  id: string;
  organizationId: string;
  name: string; // e.g. "Salle B204 (Lab Informatique)"
  capacity: number;
  hasProjector: boolean;
  hasComputers: boolean;
}

export interface Trainer {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  specialty: string;
  email: string;
  phone: string;
  bio?: string;
  hourlyRate: number;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormationModule {
  id: string;
  title: string;
  description?: string;
  durationHours: number;
  sortOrder: number;
}

export interface Formation {
  id: string;
  organizationId: string;
  name: string;
  category: string; // 'Informatique & Web', 'Data & IA', 'Marketing & Digital', 'Langues'
  description?: string;
  durationHours: number;
  price: number; // in DT
  maxStudents: number;
  status: 'active' | 'inactive' | 'archived';
  modules: FormationModule[];
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  organizationId: string;
  code: string; // e.g. "DW-01"
  formationId: string;
  trainerId?: string;
  classroomId?: string;
  capacity?: number;
  maxCapacity?: number;
  startDate: string;
  endDate: string;
  scheduleDescription?: string; // e.g. "Lundi, Mercredi 09:00 - 12:00"
  daysOfWeek?: number[]; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
  startTime?: string; // "09:00"
  endTime?: string; // "12:00"
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  organizationId: string;
  studentNumber: string; // Unique sequential e.g. STU-2026-0001
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cin?: string; // Carte d'identité nationale tunisienne (8 chiffres)
  dateOfBirth?: string;
  birthDate?: string;
  address?: string;
  city: string;
  governorate?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  organizationId: string;
  studentId: string;
  formationId?: string;
  groupId: string;
  enrollmentDate: string;
  agreedPrice?: number; // in DT
  totalTuition: number; // in DT
  paidAmount: number; // in DT
  status: 'enrolled' | 'completed' | 'cancelled' | 'dropped';
  installmentsCount: number; // e.g. 1, 2, 3, 4
  createdAt: string;
}

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ClassSession {
  id: string;
  organizationId: string;
  groupId: string;
  groupCode?: string;
  trainerId: string;
  trainerName?: string;
  classroomId: string;
  classroomName?: string;
  title?: string;
  moduleTitle?: string;
  date?: string; // YYYY-MM-DD
  sessionDate?: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: SessionStatus;
  notes?: string;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
  justification?: string;
  lateMinutes?: number;
  recordedAt: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'card' | 'other';

export interface Payment {
  id: string;
  organizationId: string;
  enrollmentId: string;
  studentId: string;
  studentName?: string;
  receiptNumber: string; // e.g. REC-2026-0001
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  status?: 'paid' | 'pending' | 'late';
  notes?: string;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  groupId: string;
  title: string;
  moduleName?: string;
  date?: string;
  evaluationDate?: string;
  type?: 'exam' | 'project' | 'quiz' | 'oral';
  coefficient: number;
  maxScore?: number; // standard 20 in Tunisia
  maxGrade?: number; // standard 20 in Tunisia
  createdAt: string;
}

export interface Grade {
  id: string;
  evaluationId: string;
  studentId: string;
  gradeValue: number; // e.g. 16.50
  appreciation?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  organizationId: string;
  studentId: string;
  formationId: string;
  certificateNumber: string; // e.g. CERT-2026-0001
  issueDate: string;
  mention: 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien' | 'Excellent' | 'Excellent avec Félicitations du Jury';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  organizationId: string;
  userName: string;
  action: string;
  details?: string;
  description?: string;
  createdAt: string;
}

export interface ScheduleConflict {
  type: 'trainer_double_booked' | 'room_double_booked' | 'trainer' | 'classroom';
  trainerName?: string;
  classroomName?: string;
  conflictingSession: ClassSession;
  timeSlot: string;
  message: string;
}

export interface CenterMetrics {
  totalStudents: number;
  totalRevenue: number;
  pendingReceivables: number;
  averageAttendanceRate: number;
  activeSessions: number;
  totalGroups: number;
  activeStudentsCount: number;
  activeGroupsCount: number;
  activeFormationsCount: number;
  monthlyRevenue: number;
  pendingPaymentsAmount: number;
  todayAttendanceRate: number;
  totalTrainersCount: number;
}

export interface AppNotification {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
