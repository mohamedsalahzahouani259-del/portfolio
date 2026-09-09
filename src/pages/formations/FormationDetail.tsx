import React from 'react';
import {
  ArrowLeft,
  Edit2,
  Clock,
  Layers,
  Users,
  CreditCard,
  Plus,
  DoorClosed,
  UserCheck,
} from 'lucide-react';
import { Formation } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/formatters';

interface FormationDetailProps {
  formationId: string;
  onBack: () => void;
  onEdit: (formation: Formation) => void;
  onCreateGroup: (formationId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const FormationDetail: React.FC<FormationDetailProps> = ({
  formationId,
  onBack,
  onEdit,
  onCreateGroup,
  onSelectStudent,
}) => {
  const { formations, groups, enrollments, students, trainers, classrooms } = useData();

  const formation = formations.find((f) => f.id === formationId);
  if (!formation) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Formation introuvable.</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Retour aux formations
        </Button>
      </div>
    );
  }

  // Related groups & enrollments
  const formationGroups = groups.filter((g) => g.formationId === formation.id);
  const formationEnrollments = enrollments.filter((e) => e.formationId === formation.id);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} icon={ArrowLeft}>
            Retour
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                {formation.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {formation.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formation.description || 'Formation professionnelle certifiante'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onCreateGroup(formation.id)}
            icon={Plus}
          >
            Créer une promo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(formation)}
            icon={Edit2}
          >
            Modifier
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Volume Horaire</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formation.durationHours} heures</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formation.modules?.length || 0} modules pédagogiques
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Tarif Public</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {formatCurrency(formation.price)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Paiement échelonné possible</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Groupes / Cohortes</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formationGroups.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Actuellement actifs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Inscrits Totaux</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formationEnrollments.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Max {formation.maxStudents} par session
          </p>
        </div>
      </div>

      {/* 3. Split View: Modules Curriculum & Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Modules Pédagogiques</span>
            <span className="text-xs text-indigo-600 font-semibold font-mono">
              {formation.durationHours}h
            </span>
          </h3>

          <div className="space-y-2">
            {formation.modules?.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800">{m.title}</span>
                </div>
                <span className="font-mono font-bold text-indigo-600 shrink-0">
                  {m.durationHours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Groups / Cohorts & Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cohorts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Groupes & Promotions en cours</span>
              <span className="text-xs text-slate-400 font-medium">
                {formationGroups.length} groupe(s)
              </span>
            </h3>

            <div className="space-y-3">
              {formationGroups.length === 0 ? (
                <p className="p-4 text-center text-slate-400 text-xs">
                  Aucun groupe n'est encore créé pour cette formation.
                </p>
              ) : (
                formationGroups.map((group) => {
                  const trainer = trainers.find((t) => t.id === group.trainerId);
                  const room = classrooms.find((c) => c.id === group.classroomId);
                  const groupStudentsCount = formationEnrollments.filter(
                    (e) => e.groupId === group.id
                  ).length;

                  return (
                    <div
                      key={group.id}
                      className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">
                            Groupe {group.code}
                          </span>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {groupStudentsCount} / {group.maxCapacity || 15} inscrits
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            {trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Formateur à assigner'}
                          </span>
                          <span className="flex items-center gap-1">
                            <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
                            {room ? room.name : 'Salle libre'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400">
                          Du {formatDate(group.startDate)} au {formatDate(group.endDate)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                Étudiants Inscrits ({formationEnrollments.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Étudiant</th>
                    <th className="px-4 py-3">Date d'inscription</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Fiche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formationEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">
                        Aucun étudiant inscrit pour le moment.
                      </td>
                    </tr>
                  ) : (
                    formationEnrollments.map((enr) => {
                      const stu = students.find((s) => s.id === enr.studentId);
                      if (!stu) return null;
                      return (
                        <tr key={enr.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {stu.firstName} {stu.lastName} ({stu.studentNumber})
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {formatDate(enr.enrollmentDate)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              En cours
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onSelectStudent(stu.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              Voir profil
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
