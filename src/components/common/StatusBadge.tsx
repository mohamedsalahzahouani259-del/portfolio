import React from 'react';
import { clsx } from 'clsx';
import {
  ATTENDANCE_STATUS_META,
  SESSION_STATUS_META,
  STUDENT_STATUS_META,
} from '../../lib/formatters';
import { AttendanceStatus, SessionStatus } from '../../types';

export type BadgeType = 'attendance' | 'session' | 'student' | 'enrollment' | 'custom';

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'student',
  label,
  size = 'md',
}) => {
  let meta = {
    label: label || status,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  };

  if (type === 'attendance') {
    const attMeta = ATTENDANCE_STATUS_META[status as AttendanceStatus];
    if (attMeta) {
      meta = {
        ...attMeta,
        dot:
          status === 'present'
            ? 'bg-emerald-500'
            : status === 'absent'
            ? 'bg-rose-500'
            : status === 'late'
            ? 'bg-amber-500'
            : 'bg-blue-500',
      };
    }
  } else if (type === 'session') {
    const sessMeta = SESSION_STATUS_META[status as SessionStatus];
    if (sessMeta) {
      meta = {
        ...sessMeta,
        dot:
          status === 'completed'
            ? 'bg-emerald-500'
            : status === 'in_progress'
            ? 'bg-amber-500'
            : status === 'scheduled'
            ? 'bg-blue-500'
            : 'bg-slate-400',
      };
    }
  } else if (type === 'student') {
    const stuMeta = STUDENT_STATUS_META[status as keyof typeof STUDENT_STATUS_META];
    if (stuMeta) {
      meta = {
        ...stuMeta,
        dot:
          status === 'active'
            ? 'bg-emerald-500'
            : status === 'graduated'
            ? 'bg-purple-500'
            : status === 'suspended'
            ? 'bg-rose-500'
            : 'bg-slate-400',
      };
    }
  } else if (type === 'enrollment') {
    if (status === 'completed') {
      meta = { label: 'Terminé', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    } else if (status === 'dropped') {
      meta = { label: 'Abandonné', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' };
    } else {
      meta = { label: 'En cours', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        meta.bg,
        meta.text,
        meta.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', meta.dot)} />
      <span>{label || meta.label}</span>
    </span>
  );
};
