// ====================================================================
// SCHOOLFLOW TN - FORMATTERS & TUNISIAN LOCALIZATION
// ====================================================================

import {
  AttendanceStatus,
  SessionStatus,
  UserRole,
  PaymentMethod,
} from '../types';

/**
 * Format currency according to SchoolFlow TN specification:
 * Example: 1 250,00 DT
 */
export function formatCurrency(amount: number | undefined | null, currency: string = 'DT'): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const parts = val.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const decimalPart = parts[1];
  return `${integerPart},${decimalPart} ${currency}`;
}

/**
 * Format date in standard French format: "08/09/2026"
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Format date in long readable French: "8 septembre 2026"
 */
export function formatDateLong(dateStr: string | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Attendance Status Meta
 */
export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  present: {
    label: 'Présent',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  absent: {
    label: 'Absent',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  late: {
    label: 'En retard',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  excused: {
    label: 'Excusé',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
};

/**
 * Class Session Status Meta
 */
export const SESSION_STATUS_META: Record<
  SessionStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  scheduled: {
    label: 'À venir',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  in_progress: {
    label: 'En cours',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  completed: {
    label: 'Terminé',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  cancelled: {
    label: 'Annulé',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
  },
};

/**
 * Student Status Meta
 */
export const STUDENT_STATUS_META: Record<
  'active' | 'inactive' | 'graduated' | 'suspended',
  { label: string; bg: string; text: string; border: string }
> = {
  active: {
    label: 'Actif',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  inactive: {
    label: 'Inactif',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
  graduated: {
    label: 'Diplômé',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  suspended: {
    label: 'Suspendu',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

/**
 * User Roles Meta
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Directeur / Propriétaire',
  admin: 'Responsable Pédagogique',
  secretary: 'Secrétaire / Administration',
  trainer: 'Formateur',
  student: 'Étudiant / Apprenant',
};

/**
 * Payment Methods Meta
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Espèces',
  bank_transfer: 'Virement bancaire',
  check: 'Chèque',
  card: 'Carte bancaire',
  other: 'Autre mode',
};

/**
 * Tunisian Governorates (24 gouvernorats)
 */
export const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 
  'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 
  'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 
  'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
];
