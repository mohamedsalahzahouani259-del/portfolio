// ====================================================================
// SCHOOLFLOW TN - SCHOOLFLOW AI ASSISTANT ENGINE (Rule #82)
// Natural language queries strictly analyzed against live center database
// ====================================================================

import {
  Student,
  Formation,
  Group,
  Payment,
  Enrollment,
  AttendanceRecord,
  ClassSession,
  Trainer,
} from '../types';
import { calculateAttendanceRate } from './academicEngine';
import { formatCurrency } from './formatters';

export interface CenterDataSnapshot {
  students: Student[];
  formations: Formation[];
  groups: Group[];
  trainers: Trainer[];
  enrollments: Enrollment[];
  payments: Payment[];
  sessions: ClassSession[];
  attendance: AttendanceRecord[];
}

export interface AIResponse {
  answer: string;
  category?: 'attendance' | 'payments' | 'formations' | 'schedule' | 'general';
  insights?: string[];
  suggestedAction?: {
    label: string;
    targetTab: string;
  };
}

export function querySchoolFlowAI(
  prompt: string,
  data: CenterDataSnapshot
): AIResponse {
  const query = prompt.toLowerCase().trim();

  // 1. Absences & Attendance queries
  if (
    query.includes('absent') ||
    query.includes('absence') ||
    query.includes('présence') ||
    query.includes('taux de présence')
  ) {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = data.sessions.filter((s) => s.sessionDate === today);
    const todayAttendance = data.attendance.filter((a) =>
      todaySessions.some((s) => s.id === a.sessionId)
    );

    const absentToday = todayAttendance.filter((a) => a.status === 'absent');

    // Low attendance students across entire history (< 75%)
    const lowAttendanceStudents: { student: Student; rate: number }[] = [];
    data.students.forEach((s) => {
      const records = data.attendance.filter((a) => a.studentId === s.id);
      if (records.length >= 2) {
        const rate = calculateAttendanceRate(records);
        if (rate < 75) {
          lowAttendanceStudents.push({ student: s, rate });
        }
      }
    });

    let answer = '';
    if (query.includes("aujourd'hui") || query.includes('aujourd')) {
      answer = `Aujourd'hui (${today}), **${absentToday.length} absence(s)** ont été enregistrées sur les cours programmés.`;
      if (absentToday.length > 0) {
        const names = absentToday
          .map((a) => {
            const stu = data.students.find((s) => s.id === a.studentId);
            return `${stu?.firstName} ${stu?.lastName}`;
          })
          .join(', ');
        answer += `\nÉtudiants absents aujourd'hui : **${names}**.`;
      }
    } else {
      answer = `Analyse globale de l'assiduité du centre :`;
      if (lowAttendanceStudents.length > 0) {
        answer += `\n**${lowAttendanceStudents.length} étudiant(s)** ont un taux de présence inférieur à 75% :`;
        lowAttendanceStudents.forEach(({ student, rate }) => {
          answer += `\n• ${student.firstName} ${student.lastName} (${student.studentNumber}) : **${rate}%** de présence.`;
        });
      } else {
        answer += `\nExcellente nouvelle : aucun étudiant n'a un taux de présence critique inférieur à 75%.`;
      }
    }

    return {
      answer,
      category: 'attendance',
      insights: [
        `Taux de présence global moyen : ${Math.round(
          calculateAttendanceRate(data.attendance)
        )}%`,
        `Nombre total d'enregistrements d'émargement : ${data.attendance.length}`,
      ],
      suggestedAction: {
        label: 'Consulter la feuille des présences',
        targetTab: 'attendance',
      },
    };
  }

  // 2. Unpaid & Late payments queries
  if (
    query.includes('paiement') ||
    query.includes('retard') ||
    query.includes('impayé') ||
    query.includes('argent') ||
    query.includes('chiffre') ||
    query.includes('revenu')
  ) {
    const lateEnrollments = data.enrollments.filter(
      (e) => e.status === 'enrolled' && e.paidAmount < e.totalTuition
    );

    const totalUnpaid = lateEnrollments.reduce(
      (sum, e) => sum + (e.totalTuition - e.paidAmount),
      0
    );

    let answer = `Actuellement, **${lateEnrollments.length} inscription(s)** présentent un reliquat de paiement, pour un montant total restant de **${formatCurrency(
      totalUnpaid
    )}**.`;

    if (lateEnrollments.length > 0) {
      answer += `\n\nDétail des étudiants concernés :`;
      lateEnrollments.slice(0, 5).forEach((e) => {
        const stu = data.students.find((s) => s.id === e.studentId);
        const grp = data.groups.find((g) => g.id === e.groupId);
        const form = grp ? data.formations.find((f) => f.id === grp.formationId) : null;
        const rest = e.totalTuition - e.paidAmount;
        answer += `\n• **${stu?.firstName} ${stu?.lastName}** (${form?.name || 'Formation'}) : Reste **${formatCurrency(
          rest
        )}** sur ${formatCurrency(e.totalTuition)}.`;
      });
    }

    return {
      answer,
      category: 'payments',
      insights: [
        `Total encaissé dans le centre : ${formatCurrency(
          data.payments.reduce((sum, p) => sum + p.amount, 0)
        )}`,
      ],
      suggestedAction: {
        label: 'Gérer les paiements & relances',
        targetTab: 'payments',
      },
    };
  }

  // 3. Formations & Enrollment count queries
  if (
    query.includes('formation') ||
    query.includes('plus d’inscrits') ||
    query.includes('plus d\'inscrits') ||
    query.includes('populaire') ||
    query.includes('cours')
  ) {
    const formationCounts = data.formations.map((f) => {
      const formGroups = data.groups.filter((g) => g.formationId === f.id);
      const enrolledCount = data.enrollments.filter((e) =>
        formGroups.some((g) => g.id === e.groupId)
      ).length;
      return { formation: f, count: enrolledCount };
    });

    formationCounts.sort((a, b) => b.count - a.count);
    const top = formationCounts[0];

    let answer = `La formation comptant le plus grand nombre d'inscrits est **« ${top?.formation.name} »** avec **${top?.count} étudiant(s)** inscrits.`;

    answer += `\n\nClassement complet des formations :`;
    formationCounts.forEach(({ formation, count }) => {
      answer += `\n• ${formation.name} (${formation.category}) : **${count} inscrits** — Tarif : ${formatCurrency(
        formation.price
      )}.`;
    });

    return {
      answer,
      category: 'formations',
      suggestedAction: {
        label: 'Voir le catalogue des formations',
        targetTab: 'formations',
      },
    };
  }

  // 4. Trainers queries
  if (query.includes('formateur') || query.includes('prof') || query.includes('enseignant')) {
    let answer = `Votre centre compte **${data.trainers.length} formateur(s)** actifs.`;
    data.trainers.forEach((t) => {
      const assignedGroups = data.groups.filter((g) => g.trainerId === t.id);
      answer += `\n• **${t.firstName} ${t.lastName}** (${t.specialty}) : ${assignedGroups.length} groupe(s) assigné(s).`;
    });
    return {
      answer,
      category: 'general',
      suggestedAction: {
        label: 'Consulter l’équipe pédagogique',
        targetTab: 'trainers',
      },
    };
  }

  // Fallback intelligent
  return {
    answer: `Je dispose des données réelles de votre centre (**${data.students.length} étudiants**, **${data.groups.length} groupes**, **${data.formations.length} formations**).\n\nVous pouvez me demander par exemple :\n• *"Quels étudiants ont des paiements en retard ?"*\n• *"Combien d'étudiants sont absents ?"*\n• *"Quelle formation a le plus d'inscrits ?"*\n• *"Quels étudiants ont un taux de présence inférieur à 75% ?"*`,
    category: 'general',
  };
}

export function askSchoolFlowAI(prompt: string, data: CenterDataSnapshot): string {
  return querySchoolFlowAI(prompt, data).answer;
}
