import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { Student } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StudentModal } from './StudentModal';

interface StudentsListProps {
  onSelectStudent: (id: string) => void;
  onNewStudent: () => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  onSelectStudent,
  onNewStudent,
}) => {
  const {
    students,
    enrollments,
    formations,
    groups,
    attendance,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormationFilter, setSelectedFormationFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      student.firstName.toLowerCase().includes(q) ||
      student.lastName.toLowerCase().includes(q) ||
      student.studentNumber.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.phone.includes(q) ||
      (student.cin && student.cin.includes(q));

    const matchesStatus = selectedStatusFilter ? student.status === selectedStatusFilter : true;

    const studentEnrs = enrollments.filter((e) => e.studentId === student.id);
    const matchesFormation = selectedFormationFilter
      ? studentEnrs.some((e) => e.formationId === selectedFormationFilter)
      : true;

    return matchesSearch && matchesStatus && matchesFormation;
  });

  const handleSaveStudent = (data: any, targetGroupId?: string) => {
    if (editingStudent) {
      updateStudent({ ...editingStudent, ...data });
    } else {
      createStudent(data, targetGroupId);
    }
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Gestion des Étudiants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {students.length} étudiant{students.length > 1 ? 's' : ''} inscrit{students.length > 1 ? 's' : ''} au centre • Base de données apprenants
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Inscrire un étudiant
        </Button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, matricule, CIN, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Formation Filter */}
        <select
          value={selectedFormationFilter}
          onChange={(e) => setSelectedFormationFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">Toutes les formations</option>
          {formations.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="graduated">Diplômé</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>

      {/* 3. Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Gouvernorat</th>
                <th className="px-4 py-3">Formation & Groupe</th>
                <th className="px-4 py-3">Assiduité</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Aucun étudiant trouvé</p>
                    <p className="text-xs mt-1">Modifiez vos critères de recherche ou ajoutez un étudiant.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  // Find student's enrollments & group
                  const studentEnrs = enrollments.filter((e) => e.studentId === s.id);
                  const firstEnr = studentEnrs[0];
                  const form = formations.find((f) => f.id === firstEnr?.formationId);
                  const grp = groups.find((g) => g.id === firstEnr?.groupId);

                  // Calculate student attendance
                  const stuAtt = attendance.filter((a) => a.studentId === s.id);
                  const pres = stuAtt.filter((a) => a.status === 'present').length;
                  const attRate = stuAtt.length > 0 ? Math.round((pres / stuAtt.length) * 100) : 100;

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => onSelectStudent(s.id)}
                    >
                      {/* Matricule */}
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {s.studentNumber}
                      </td>

                      {/* Name & CIN */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {s.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {s.firstName} {s.lastName}
                            </p>
                            {s.cin && (
                              <p className="text-[10px] text-slate-400">CIN: {s.cin}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <p className="text-slate-700 flex items-center gap-1.5 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{s.email}</span>
                        </p>
                        {s.phone && (
                          <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{s.phone}</span>
                          </p>
                        )}
                      </td>

                      {/* Governorate */}
                      <td className="px-4 py-3 text-slate-600">
                        {s.governorate}
                      </td>

                      {/* Formation / Group */}
                      <td className="px-4 py-3">
                        {form ? (
                          <div>
                            <p className="font-medium text-slate-800">{form.name}</p>
                            <p className="text-[10px] text-slate-500">
                              Groupe {grp?.code || 'N/A'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Non inscrit</span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-bold text-xs ${
                            attRate >= 80
                              ? 'text-emerald-600'
                              : attRate >= 60
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {attRate}%
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} type="student" />
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectStudent(s.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Voir la fiche"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(s);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer l'étudiant ${s.firstName} ${s.lastName} ?`)) {
                                deleteStudent(s.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};
