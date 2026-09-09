import React from 'react';
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Clock,
  CreditCard,
  Layers,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { Trainer } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/formatters';

interface TrainerDetailProps {
  trainerId: string;
  onBack: () => void;
  onEdit: (trainer: Trainer) => void;
}

export const TrainerDetail: React.FC<TrainerDetailProps> = ({
  trainerId,
  onBack,
  onEdit,
}) => {
  const { trainers, groups, formations, sessions } = useData();

  const trainer = trainers.find((t) => t.id === trainerId);
  if (!trainer) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Formateur introuvable.</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Assigned groups
  const trainerGroups = groups.filter((g) => g.trainerId === trainer.id);

  // Sessions taught or scheduled
  const trainerSessions = sessions.filter((s) => s.trainerId === trainer.id);
  const completedSessions = trainerSessions.filter((s) => s.status === 'completed');

  // Compute total hours taught (assuming 3h per session or based on start/end)
  const totalHoursTaught = completedSessions.length * 3;
  const estimatedHonoraires = totalHoursTaught * trainer.hourlyRate;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} icon={ArrowLeft}>
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg">
              {trainer.firstName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {trainer.firstName} {trainer.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {trainer.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{trainer.specialty}</p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(trainer)}
          icon={Edit2}
        >
          Modifier le profil
        </Button>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Taux Horaire</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {formatCurrency(trainer.hourlyRate)} / h
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Base contractuelle</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Heures Effectuées</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalHoursTaught} h</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {completedSessions.length} séances dispensées
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Groupes Assignés</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{trainerGroups.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Promotions en cours</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <CreditCard className="w-4 h-4 text-sky-600" />
            <span>Honoraires Estimés</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            {formatCurrency(estimatedHonoraires)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cumul séances complétées</p>
        </div>
      </div>

      {/* 3. Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bio & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Coordonnées & Informations
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-800">{trainer.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{trainer.phone}</span>
            </div>
          </div>

          {trainer.bio && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Bio & Expérience
              </p>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {trainer.bio}
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Sessions & Groups */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Séances au Planning</span>
              <span className="text-xs text-indigo-600 font-semibold">
                {trainerSessions.length} séance(s)
              </span>
            </h3>

            <div className="divide-y divide-slate-100">
              {trainerSessions.length === 0 ? (
                <p className="p-4 text-center text-slate-400 text-xs">
                  Aucune séance programmée pour ce formateur.
                </p>
              ) : (
                trainerSessions.map((session) => (
                  <div
                    key={session.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{session.title}</p>
                      <p className="text-slate-500">
                        {formatDate(session.date)} • {session.startTime} - {session.endTime}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Salle : {session.classroomName || 'Non assignée'}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        session.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {session.status === 'completed' ? 'Effectué' : 'À venir'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
