import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Users,
  Calendar,
  Save,
  CheckCheck,
} from 'lucide-react';
import { AttendanceStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/formatters';
import { toast } from '../../components/ui/Toast';

interface AttendancePageProps {
  initialSessionId?: string;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ initialSessionId }) => {
  const {
    sessions,
    groups,
    students,
    enrollments,
    attendance,
    saveSessionAttendance,
  } = useData();

  // Selected session
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId || (sessions[0]?.id || '')
  );

  useEffect(() => {
    if (initialSessionId) {
      setSelectedSessionId(initialSessionId);
    }
  }, [initialSessionId]);

  const currentSession = sessions.find((s) => s.id === selectedSessionId);
  const currentGroup = groups.find((g) => g.id === currentSession?.groupId);

  // Find students enrolled in this group
  const groupEnrollments = currentGroup
    ? enrollments.filter((e) => e.groupId === currentGroup.id)
    : [];

  const groupStudents = groupEnrollments
    .map((e) => students.find((s) => s.id === e.studentId))
    .filter(Boolean) as typeof students;

  // Local state for the roll-call
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; notes: string }>
  >({});

  // Populate map from stored attendance records
  useEffect(() => {
    if (!currentSession) return;
    const sessionRecords = attendance.filter((a) => a.sessionId === currentSession.id);

    const initialMap: Record<string, { status: AttendanceStatus; notes: string }> = {};
    groupStudents.forEach((st) => {
      const rec = sessionRecords.find((r) => r.studentId === st.id);
      initialMap[st.id] = {
        status: rec?.status || 'present',
        notes: rec?.notes || '',
      };
    });

    setAttendanceMap(initialMap);
  }, [selectedSessionId, currentSession, attendance, groupStudents.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const next = { ...prev };
      groupStudents.forEach((st) => {
        next[st.id] = {
          ...next[st.id],
          status: 'present',
        };
      });
      return next;
    });
    toast.success('Tous les étudiants sont marqués comme présents');
  };

  const handleSave = () => {
    if (!currentSession) return;
    const records = groupStudents.map((st) => ({
      sessionId: currentSession.id,
      studentId: st.id,
      status: attendanceMap[st.id]?.status || 'present',
      notes: attendanceMap[st.id]?.notes,
    }));

    saveSessionAttendance(currentSession.id, records);
    toast.success('Feuille d’émargement enregistrée avec succès !');
  };

  // Live session statistics
  const totalCount = groupStudents.length;
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v.status === 'late').length;
  const excusedCount = Object.values(attendanceMap).filter((v) => v.status === 'excused').length;
  const sessionRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Feuille d’Émargement & Présences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pointage en direct par séance, suivi des retards et justificatifs d'absence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleMarkAllPresent}
            icon={CheckCheck}
          >
            Tout marquer présent
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={Save}
          >
            Enregistrer l'appel
          </Button>
        </div>
      </div>

      {/* 2. Session Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="w-full sm:w-auto">
            <p className="text-xs font-semibold text-slate-500">Séance à émarger :</p>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="mt-1 w-full sm:w-96 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)} — {s.title} (Groupe {s.groupCode || 'Promo'}) [{s.startTime}-{s.endTime}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <span className="font-bold block">{presentCount}</span>
            <span className="text-[10px]">Présents</span>
          </div>
          <div className="text-center px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
            <span className="font-bold block">{absentCount}</span>
            <span className="text-[10px]">Absents</span>
          </div>
          <div className="text-center px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <span className="font-bold block">{lateCount}</span>
            <span className="text-[10px]">Retards</span>
          </div>
          <div className="text-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-bold">
            <span className="block">{sessionRate}%</span>
            <span className="text-[10px] font-normal">Assiduité</span>
          </div>
        </div>
      </div>

      {/* 3. Roll-Call Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Appel des étudiants ({groupStudents.length} apprenants)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Formateur : {currentSession?.trainerName || 'Non assigné'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3 text-center">Pointage Présence</th>
                <th className="px-4 py-3">Observation / Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Aucun étudiant inscrit dans le groupe de cette séance.
                  </td>
                </tr>
              ) : (
                groupStudents.map((stu) => {
                  const state = attendanceMap[stu.id] || { status: 'present', notes: '' };

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {stu.studentNumber}
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">
                          {stu.firstName} {stu.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400">{stu.phone}</p>
                      </td>

                      {/* Presence toggles */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all ${
                              state.status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Présent</span>
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'absent')}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all ${
                              state.status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all ${
                              state.status === 'late'
                                ? 'bg-amber-500 text-white shadow-xs font-semibold'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Retard</span>
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stu.id, 'excused')}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all ${
                              state.status === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-800'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Excusé</span>
                          </button>
                        </div>
                      </td>

                      {/* Notes input */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={state.notes}
                          onChange={(e) => handleNotesChange(stu.id, e.target.value)}
                          placeholder="Justificatif, motif de retard..."
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white"
                        />
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
  );
};
