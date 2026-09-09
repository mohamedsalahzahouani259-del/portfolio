import React from 'react';
import { Student, Formation, Group, Evaluation, Grade, Organization } from '../../types';
import { formatDateLong, formatDate } from '../../lib/formatters';
import { calculateWeightedAverage } from '../../lib/academicEngine';

interface GradeReportSheetProps {
  student: Student;
  formation?: Formation;
  group?: Group;
  evaluations: Evaluation[];
  grades: Grade[];
  organization: Organization;
}

export const GradeReportSheet: React.FC<GradeReportSheetProps> = ({
  student,
  formation,
  group,
  evaluations,
  grades,
  organization,
}) => {
  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const average = calculateWeightedAverage(studentGrades, evaluations);

  const getMention = (avg: number | null) => {
    if (avg === null) return 'Non évalué';
    if (avg >= 16) return 'Très Bien';
    if (avg >= 14) return 'Bien';
    if (avg >= 12) return 'Assez Bien';
    if (avg >= 10) return 'Passable';
    return 'Insuffisant';
  };

  return (
    <div className="bg-white p-8 sm:p-12 max-w-2xl mx-auto rounded-xl shadow-xs border border-slate-200 text-slate-800 font-sans print:p-0 print:border-0 print:shadow-none text-xs sm:text-sm">
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
        <div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-2">
            SF
          </div>
          <h2 className="text-base font-bold text-slate-900">{organization?.name || 'Institut de Formation'}</h2>
          <p className="text-slate-500 text-xs">{organization?.address}, {organization?.city}</p>
          <p className="text-slate-500 text-xs">Tél : {organization?.phone} • {organization?.email}</p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            Relevé de Notes Officiel
          </span>
          <p className="text-xs text-slate-500">
            Année Académique : <strong className="text-slate-800">{organization?.currentAcademicYear || '2026–2027'}</strong>
          </p>
          <p className="text-xs text-slate-500">
            Édité le : {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Student Meta */}
      <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Étudiant(e)
          </span>
          <p className="text-sm font-bold text-slate-900">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-xs text-brand-700 font-mono font-semibold">
            Matricule : {student.studentNumber}
          </p>
          {student.cin && <p className="text-xs text-slate-500">CIN : {student.cin}</p>}
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Cursus Pédagogique
          </span>
          <p className="text-sm font-bold text-slate-900">{formation?.name || 'Programme'}</p>
          <p className="text-xs text-slate-600">Groupe : {group?.code || 'Cohorte'}</p>
          {formation?.durationHours && (
            <p className="text-xs text-slate-500">Volume horaire : {formation.durationHours}h</p>
          )}
        </div>
      </div>

      {/* Grades Table */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-3">Module / Évaluation</th>
              <th className="py-2.5 px-3 text-center w-20">Coeff.</th>
              <th className="py-2.5 px-3 text-center w-28">Note / 20</th>
              <th className="py-2.5 px-3">Appréciation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {evaluations.map((ev) => {
              const grade = studentGrades.find((g) => g.evaluationId === ev.id);
              return (
                <tr key={ev.id}>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{ev.moduleName}</p>
                    <p className="text-[11px] text-slate-500">{ev.title}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {ev.coefficient}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                    {grade !== undefined ? (
                      <span className={grade.gradeValue >= 10 ? 'text-emerald-700' : 'text-rose-700'}>
                        {grade.gradeValue.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">En attente</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600 italic text-[11px]">
                    {grade?.appreciation || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results Summary Box */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center mb-8">
        <div>
          <span className="text-xs text-slate-500 block">Décision du jury & Mention :</span>
          <span className="text-sm font-bold text-slate-900">
            Mention {getMention(average)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Moyenne Générale :</span>
          <span className="text-xl font-bold font-mono text-brand-700">
            {average !== null ? `${average.toFixed(2)} / 20` : '—'}
          </span>
        </div>
      </div>

      {/* Signature Block */}
      <div className="flex justify-between items-end pt-8 border-t border-slate-200">
        <div className="text-xs text-slate-400">
          <p>Relevé certifié conforme par la direction pédagogique.</p>
        </div>

        <div className="text-center w-48">
          <p className="text-xs font-semibold text-slate-700 mb-8">Le Directeur Pédagogique</p>
          <div className="border-b border-dashed border-slate-300 w-full" />
        </div>
      </div>
    </div>
  );
};
