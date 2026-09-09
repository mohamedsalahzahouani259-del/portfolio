import React from 'react';
import {
  UserCheck,
  Calendar,
  ClipboardCheck,
  Clock,
  CreditCard,
  Layers,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { TabId } from '../../components/layout/Sidebar';

interface TrainerPortalProps {
  onNavigate: (tab: TabId, itemId?: string) => void;
}

export const TrainerPortal: React.FC<TrainerPortalProps> = ({ onNavigate }) => {
  const { user, organization } = useAuth();
  const { trainers, groups, sessions, formations } = useData();

  // Find linked trainer or default to first trainer (Youssef Ben Amor)
  const trainer = trainers.find((t) => t.id === user?.linkedTrainerId) || trainers[0];

  const todayStr = new Date().toISOString().split('T')[0];

  // Trainer groups & sessions
  const trainerGroups = groups.filter((g) => g.trainerId === trainer?.id);
  const trainerSessions = sessions.filter((s) => s.trainerId === trainer?.id);
  const todaySessions = trainerSessions.filter((s) => s.date === todayStr);
  const completedSessions = trainerSessions.filter((s) => s.status === 'completed');

  const totalHours = completedSessions.length * 3;
  const honoraires = totalHours * (trainer?.hourlyRate || 40);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-900/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              Espace Formateur Intervenant
            </span>
            <span className="text-slate-400 text-xs">• {organization?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bonjour, {trainer?.firstName} {trainer?.lastName} 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Spécialité : <span className="font-semibold text-white">{trainer?.specialty}</span> • Taux contractuel : {formatCurrency(trainer?.hourlyRate)}/h
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => onNavigate('attendance')}
            icon={ClipboardCheck}
          >
            Faire l'émargement
          </Button>
        </div>
      </div>

      {/* 2. Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Séances du jour</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{todaySessions.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">À dispenser aujourd'hui</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Heures effectuées</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalHours} h</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{completedSessions.length} cours validés</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Honoraires cumulés</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{formatCurrency(honoraires)}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Règlement mensuel</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Groupes pris en charge</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{trainerGroups.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cohortes actives</p>
        </div>
      </div>

      {/* 3. Cours & Séances du jour */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Mon Planning de Cours</span>
          </h3>
          <span className="text-xs text-slate-400">Total : {trainerSessions.length} séance(s)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {trainerSessions.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-xs">
              Aucune séance assignée pour le moment.
            </p>
          ) : (
            trainerSessions.map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                    <span className="text-xs font-bold font-mono">{session.startTime}</span>
                    <span className="text-[10px] text-indigo-500 font-mono">{session.endTime}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{session.title}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(session.date)} • Groupe {session.groupCode} • Salle : {session.classroomName || 'Lab'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate('attendance', session.id)}
                    icon={ClipboardCheck}
                  >
                    Faire l'appel
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
