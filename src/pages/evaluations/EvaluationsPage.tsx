import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Printer,
  Save,
  Users,
  Calendar,
  Award,
} from 'lucide-react';
import { Evaluation, Grade } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatDate } from '../../lib/formatters';
import { GradeReportSheet } from '../../components/documents/GradeReportSheet';
import { toast } from '../../components/ui/Toast';

export const EvaluationsPage: React.FC = () => {
  const { organization } = useAuth();
  const {
    evaluations,
    groups,
    formations,
    students,
    enrollments,
    grades,
    createEvaluation,
    saveEvaluationGrades,
  } = useData();

  // Selected evaluation
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>(
    evaluations[0]?.id || ''
  );

  // New evaluation modal
  const [isNewEvalModalOpen, setIsNewEvalModalOpen] = useState(false);
  const [newEvalData, setNewEvalData] = useState({
    title: 'Examen de synthèse',
    groupId: groups[0]?.id || '',
    type: 'exam' as Evaluation['type'],
    date: new Date().toISOString().split('T')[0],
    coefficient: 2,
    maxScore: 20,
  });

  // Transcript preview state
  const [transcriptStudentId, setTranscriptStudentId] = useState<string | null>(null);

  const currentEval = evaluations.find((e) => e.id === selectedEvaluationId);
  const currentGroup = groups.find((g) => g.id === currentEval?.groupId);
  const currentFormation = formations.find((f) => f.id === currentGroup?.formationId);

  // Enrolled students in this group
  const groupEnrollments = currentGroup
    ? enrollments.filter((e) => e.groupId === currentGroup.id)
    : [];

  const groupStudents = groupEnrollments
    .map((e) => students.find((s) => s.id === e.studentId))
    .filter(Boolean) as typeof students;

  // Local state for grade matrix
  const [gradesMap, setGradesMap] = useState<
    Record<string, { value: number; appreciation: string }>
  >({});

  // Sync grades map with stored grades
  React.useEffect(() => {
    if (!currentEval) return;
    const existingGrades = grades.filter((g) => g.evaluationId === currentEval.id);

    const initialMap: Record<string, { value: number; appreciation: string }> = {};
    groupStudents.forEach((st) => {
      const g = existingGrades.find((item) => item.studentId === st.id);
      initialMap[st.id] = {
        value: g?.gradeValue !== undefined ? g.gradeValue : 14,
        appreciation: g?.appreciation || 'Très bon travail',
      };
    });

    setGradesMap(initialMap);
  }, [selectedEvaluationId, currentEval, grades, groupStudents.length]);

  const handleGradeChange = (studentId: string, val: number) => {
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        value: Math.min(20, Math.max(0, val)),
      },
    }));
  };

  const handleAppreciationChange = (studentId: string, app: string) => {
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        appreciation: app,
      },
    }));
  };

  const handleSaveGrades = () => {
    if (!currentEval) return;

    const items = groupStudents.map((st) => ({
      studentId: st.id,
      gradeValue: gradesMap[st.id]?.value ?? 10,
      appreciation: gradesMap[st.id]?.appreciation,
    }));

    saveEvaluationGrades(currentEval.id, items);
    toast.success('Notes et appréciations enregistrées avec succès !');
  };

  const handleCreateEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createEvaluation(newEvalData);
    setIsNewEvalModalOpen(false);
    setSelectedEvaluationId(created.id);
    toast.success('Épreuve créée avec succès !');
  };

  const transcriptStudent = students.find((s) => s.id === transcriptStudentId);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Évaluations, Notes & Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des épreuves, barème sur 20, calcul des moyennes pondérées et bulletins A4
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setIsNewEvalModalOpen(true)}
            icon={Plus}
          >
            Nouvelle épreuve
          </Button>
        </div>
      </div>

      {/* 2. Evaluation Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FileCheck2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="w-full sm:w-auto">
            <p className="text-xs font-semibold text-slate-500">Épreuve sélectionnée :</p>
            <select
              value={selectedEvaluationId}
              onChange={(e) => setSelectedEvaluationId(e.target.value)}
              className="mt-1 w-full sm:w-96 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {evaluations.map((ev) => {
                const grp = groups.find((g) => g.id === ev.groupId);
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} (Groupe {grp?.code || 'N/A'}) • Coeff. {ev.coefficient}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {currentEval && (
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
            <span className="px-3 py-1 bg-slate-100 rounded-xl font-medium text-slate-700">
              Coeff. <strong className="text-indigo-600">{currentEval.coefficient}</strong>
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-xl font-medium text-slate-700">
              Barème : <strong className="text-indigo-600">sur 20</strong>
            </span>
            <Button variant="primary" size="sm" onClick={handleSaveGrades} icon={Save}>
              Enregistrer les notes
            </Button>
          </div>
        )}
      </div>

      {/* 3. Grades Entry Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Saisie des notes ({groupStudents.length} apprenants)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Formation : {currentFormation?.name || 'Cursus'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3 w-32">Note / 20</th>
                <th className="px-4 py-3">Appréciation Pédagogique</th>
                <th className="px-4 py-3 text-right">Bulletin Officiel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Aucun étudiant inscrit dans ce groupe.
                  </td>
                </tr>
              ) : (
                groupStudents.map((st) => {
                  const item = gradesMap[st.id] || { value: 14, appreciation: '' };
                  const isSuccess = item.value >= 10;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {st.studentNumber}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {st.firstName} {st.lastName}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            step={0.25}
                            value={item.value}
                            onChange={(e) => handleGradeChange(st.id, Number(e.target.value))}
                            className={`w-20 px-2.5 py-1 text-center font-mono font-bold rounded-lg border focus:outline-hidden ${
                              isSuccess
                                ? 'border-emerald-200 bg-emerald-50/60 text-emerald-800 focus:border-emerald-500'
                                : 'border-rose-200 bg-rose-50/60 text-rose-800 focus:border-rose-500'
                            }`}
                          />
                          <span className="text-slate-400 font-mono text-xs">/ 20</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.appreciation}
                          onChange={(e) => handleAppreciationChange(st.id, e.target.value)}
                          placeholder="Appréciation du jury..."
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white"
                        />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setTranscriptStudentId(st.id)}
                          icon={Printer}
                        >
                          Bulletin
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVALUATION MODAL */}
      <Modal
        isOpen={isNewEvalModalOpen}
        onClose={() => setIsNewEvalModalOpen(false)}
        title="Créer une nouvelle épreuve d'évaluation"
        size="md"
      >
        <form onSubmit={handleCreateEvalSubmit} className="space-y-4">
          <Input
            label="Intitulé de l'épreuve"
            required
            value={newEvalData.title}
            onChange={(e) => setNewEvalData({ ...newEvalData, title: e.target.value })}
            placeholder="ex: Examen Final - Projet Synthèse"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Groupe / Promotion"
              required
              value={newEvalData.groupId}
              onChange={(e) => setNewEvalData({ ...newEvalData, groupId: e.target.value })}
              options={groups.map((g) => ({
                value: g.id,
                label: `Groupe ${g.code}`,
              }))}
            />

            <Select
              label="Type d'épreuve"
              value={newEvalData.type}
              onChange={(e) => setNewEvalData({ ...newEvalData, type: e.target.value as any })}
              options={[
                { value: 'exam', label: 'Examen de synthèse' },
                { value: 'project', label: 'Projet pratique' },
                { value: 'quiz', label: 'Contrôle continu / QCM' },
                { value: 'oral', label: 'Soutenance orale' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date de passage"
              type="date"
              required
              value={newEvalData.date}
              onChange={(e) => setNewEvalData({ ...newEvalData, date: e.target.value })}
            />
            <Input
              label="Coefficient"
              type="number"
              min={1}
              max={10}
              required
              value={newEvalData.coefficient}
              onChange={(e) => setNewEvalData({ ...newEvalData, coefficient: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsNewEvalModalOpen(false)} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer l'épreuve
            </Button>
          </div>
        </form>
      </Modal>

      {/* PRINT TRANSCRIPT MODAL */}
      {transcriptStudent && currentFormation && (
        <Modal
          isOpen={Boolean(transcriptStudentId)}
          onClose={() => setTranscriptStudentId(null)}
          title={`Bulletin de notes - ${transcriptStudent.firstName} ${transcriptStudent.lastName}`}
          size="lg"
        >
          <GradeReportSheet
            student={transcriptStudent}
            formation={currentFormation}
            organization={organization!}
            evaluations={evaluations}
            grades={grades.filter((g) => g.studentId === transcriptStudent.id)}
          />
        </Modal>
      )}
    </div>
  );
};
