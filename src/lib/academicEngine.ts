// ====================================================================
// SCHOOLFLOW TN - ACADEMIC ENGINE & ALGORITHMS
// Conflict Detection, Attendance Rates, Weighted Averages & IDs
// ====================================================================

import {
  ClassSession,
  Trainer,
  Classroom,
  ScheduleConflict,
  AttendanceRecord,
  Grade,
  Evaluation,
} from '../types';

/**
 * Checks for scheduling conflicts (Trainer double-booking or Room double-booking)
 */
export function checkScheduleConflicts(
  candidateSession: Omit<ClassSession, 'id' | 'createdAt'> & { id?: string },
  existingSessions: ClassSession[],
  trainers: Trainer[],
  classrooms: Classroom[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  const candStart = timeToMinutes(candidateSession.startTime);
  const candEnd = timeToMinutes(candidateSession.endTime);

  existingSessions.forEach((sess) => {
    // Skip comparing with self when editing
    if (candidateSession.id && sess.id === candidateSession.id) return;
    if (sess.status === 'cancelled') return;

    // Must be on the exact same date
    const sessDate = sess.date || sess.sessionDate;
    const candDate = candidateSession.date || candidateSession.sessionDate;
    if (sessDate !== candDate) return;

    const sessStart = timeToMinutes(sess.startTime);
    const sessEnd = timeToMinutes(sess.endTime);

    // Check time overlap: (StartA < EndB) and (EndA > StartB)
    const isOverlapping = candStart < sessEnd && candEnd > sessStart;
    if (!isOverlapping) return;

    // 1. Trainer Conflict
    if (candidateSession.trainerId && sess.trainerId === candidateSession.trainerId) {
      const trainer = trainers.find((t) => t.id === candidateSession.trainerId);
      const trainerName = trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Ce formateur';
      conflicts.push({
        type: 'trainer_double_booked',
        trainerName,
        conflictingSession: sess,
        timeSlot: `${sess.startTime} - ${sess.endTime}`,
        message: `${trainerName} est déjà programmé(e) sur le créneau ${sess.startTime} – ${sess.endTime} pour un autre cours.`,
      });
    }

    // 2. Classroom Conflict
    if (candidateSession.classroomId && sess.classroomId === candidateSession.classroomId) {
      const room = classrooms.find((c) => c.id === candidateSession.classroomId);
      const roomName = room ? room.name : 'Cette salle';
      conflicts.push({
        type: 'room_double_booked',
        classroomName: roomName,
        conflictingSession: sess,
        timeSlot: `${sess.startTime} - ${sess.endTime}`,
        message: `${roomName} est déjà occupée sur le créneau ${sess.startTime} – ${sess.endTime}.`,
      });
    }
  });

  return conflicts;
}

/**
 * Helper to convert "HH:MM" string to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Calculates overall attendance rate for a student
 * Present = 1.0, Late = 0.8, Excused = 1.0, Absent = 0.0
 */
export function calculateAttendanceRate(records: AttendanceRecord[]): number {
  if (!records || records.length === 0) return 100;

  let points = 0;
  records.forEach((r) => {
    if (r.status === 'present') points += 1;
    else if (r.status === 'late') points += 0.8;
    else if (r.status === 'excused') points += 1.0;
  });

  const rate = (points / records.length) * 100;
  return Math.round(rate);
}

/**
 * Calculates student weighted grade average based on evaluations coefficients
 */
export function calculateWeightedAverage(
  studentGrades: Grade[],
  evaluations: Evaluation[]
): number | null {
  if (!studentGrades || studentGrades.length === 0) return null;

  let totalWeightedScore = 0;
  let totalCoefficients = 0;

  studentGrades.forEach((g) => {
    const evaluation = evaluations.find((e) => e.id === g.evaluationId);
    if (evaluation) {
      const coeff = evaluation.coefficient || 1;
      // Normalize grade to scale of 20
      const normalizedGrade = (g.gradeValue / (evaluation.maxGrade || 20)) * 20;
      totalWeightedScore += normalizedGrade * coeff;
      totalCoefficients += coeff;
    }
  });

  if (totalCoefficients === 0) return null;
  return Math.round((totalWeightedScore / totalCoefficients) * 100) / 100;
}

/**
 * Sequential Student ID generator (e.g. STU-2026-0001)
 */
export function formatStudentId(prefix: string, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(4, '0');
  return `${prefix}${padded}`;
}

/**
 * Sequential Receipt Number generator (e.g. REC-2026-0001)
 */
export function formatReceiptNumber(prefix: string, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(4, '0');
  return `${prefix}${padded}`;
}

/**
 * Splits tuition into equal rounded installments (e.g. 1 200 DT in 3 tranches)
 */
export function generateInstallmentSchedule(
  totalTuition: number,
  installmentsCount: number = 3
): { installmentNumber: number; amount: number; description: string }[] {
  const count = Math.max(1, installmentsCount);
  const baseAmount = Math.floor((totalTuition / count) * 100) / 100;
  const remainder = Math.round((totalTuition - baseAmount * count) * 100) / 100;

  return Array.from({ length: count }, (_, i) => {
    // Add rounding remainder to first installment
    const amt = i === 0 ? baseAmount + remainder : baseAmount;
    return {
      installmentNumber: i + 1,
      amount: Math.round(amt * 100) / 100,
      description: `Tranche ${i + 1} / ${count}`,
    };
  });
}
