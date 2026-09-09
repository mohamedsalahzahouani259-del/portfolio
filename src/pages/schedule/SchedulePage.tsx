import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  DoorClosed,
  AlertTriangle,
  ClipboardCheck,
  Trash2,
} from 'lucide-react';
import { ClassSession, ScheduleConflict } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConflictWarningModal } from '../../components/common/ConflictWarningModal';
import { formatDate } from '../../lib/formatters';
import { TabId } from '../../components/layout/Sidebar';

interface SchedulePageProps {
  onNavigate: (tab: TabId, itemId?: string) => void;
  preselectedGroupId?: string;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({
  onNavigate,
  preselectedGroupId,
}) => {
  const {
    sessions,
    groups,
    trainers,
    classrooms,
    formations,
    checkSessionConflicts,
    createSession,
    deleteSession,
  } = useData();

  // Filters
  const [filterClassroom, setFilterClassroom] = useState('');
  const [filterTrainer, setFilterTrainer] = useState('');
  const [filterGroup, setFilterGroup] = useState(preselectedGroupId || '');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Session Modal
  const [isModalOpen, setIsModalOpen] = useState(Boolean(preselectedGroupId));
  const [newSessionData, setNewSessionData] = useState({
    title: 'Séance de cours',
    groupId: preselectedGroupId || (groups[0]?.id || ''),
    trainerId: '',
    classroomId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    status: 'scheduled' as ClassSession['status'],
  });

  // Conflict state
  const [detectedConflicts, setDetectedConflicts] = useState<ScheduleConflict[]>([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  // Date controls
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Filter sessions
  const filteredSessions = (sessions || []).filter((s) => {
    if (!s) return false;
    const sDate = s.date || s.sessionDate;
    const matchesDate = sDate === selectedDate;
    const matchesRoom = filterClassroom ? s.classroomId === filterClassroom : true;
    const matchesTrainer = filterTrainer ? s.trainerId === filterTrainer : true;
    const matchesGroup = filterGroup ? s.groupId === filterGroup : true;
    return matchesDate && matchesRoom && matchesTrainer && matchesGroup;
  }).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  // Handle Create Session
  const handleOpenCreate = () => {
    const targetGroup = groups.find((g) => g.id === filterGroup) || groups[0];
    setNewSessionData({
      title: 'Séance de cours',
      groupId: targetGroup?.id || '',
      trainerId: targetGroup?.trainerId || trainers[0]?.id || '',
      classroomId: targetGroup?.classroomId || classrooms[0]?.id || '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '12:00',
      status: 'scheduled',
    });
    setIsModalOpen(true);
  };

  const handleSaveSession = (force: boolean = false) => {
    // Check conflicts
    const group = groups.find((g) => g.id === newSessionData.groupId);
    const trainer = trainers.find((t) => t.id === newSessionData.trainerId);
    const room = classrooms.find((c) => c.id === newSessionData.classroomId);

    const payload = {
      ...newSessionData,
      groupCode: group?.code,
      trainerName: trainer ? `${trainer.firstName} ${trainer.lastName}` : undefined,
      classroomName: room?.name,
    };

    if (!force) {
      const conflicts = checkSessionConflicts(payload);
      if (conflicts.length > 0) {
        setDetectedConflicts(conflicts);
        setIsConflictModalOpen(true);
        return;
      }
    }

    createSession(payload);
    setIsModalOpen(false);
    setIsConflictModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Emploi du Temps & Planning
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des créneaux, affectation des salles et détection automatique des conflits
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreate} icon={Plus}>
          Planifier une séance
        </Button>
      </div>

      {/* 2. Date Navigator & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition-colors"
              title="Jour précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold hover:bg-white text-slate-700 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={handleNextDay}
              className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition-colors"
              title="Jour suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden"
          />

          <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
            {formatDate(selectedDate)}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Group filter */}
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="">Tous les groupes</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                Groupe {g.code}
              </option>
            ))}
          </select>

          {/* Room filter */}
          <select
            value={filterClassroom}
            onChange={(e) => setFilterClassroom(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="">Toutes les salles</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Trainer filter */}
          <select
            value={filterTrainer}
            onChange={(e) => setFilterTrainer(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="">Tous les formateurs</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Schedule Content for Selected Day */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">
              Séances du {formatDate(selectedDate)}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredSessions.length} séance(s) programmée(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">Aucune séance planifiée pour cette date</p>
              <p className="text-xs mt-1">Utilisez le bouton ci-dessus pour planifier un cours.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenCreate}
                className="mt-4"
              >
                + Planifier une séance
              </Button>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Time badge */}
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0 shadow-2xs">
                    <span className="text-sm font-bold font-mono">{session.startTime}</span>
                    <span className="text-[11px] text-indigo-500 font-mono">{session.endTime}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">{session.title}</h3>
                      <StatusBadge status={session.status} type="session" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded">
                        Groupe {session.groupCode || 'Promo'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        {session.trainerName || 'Formateur'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
                        {session.classroomName || 'Salle'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('attendance', session.id)}
                    icon={ClipboardCheck}
                  >
                    Faire l'appel
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer cette séance ?')) {
                        deleteSession(session.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Supprimer la séance"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Planifier une séance de cours"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Intitulé de la séance / Chapitre"
            required
            value={newSessionData.title}
            onChange={(e) => setNewSessionData({ ...newSessionData, title: e.target.value })}
            placeholder="ex: React Hooks & État Local"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Groupe / Promotion"
              required
              value={newSessionData.groupId}
              onChange={(e) => {
                const gId = e.target.value;
                const grp = groups.find((g) => g.id === gId);
                setNewSessionData({
                  ...newSessionData,
                  groupId: gId,
                  trainerId: grp?.trainerId || newSessionData.trainerId,
                  classroomId: grp?.classroomId || newSessionData.classroomId,
                });
              }}
              options={groups.map((g) => {
                const f = formations.find((form) => form.id === g.formationId);
                return { value: g.id, label: `Groupe ${g.code} (${f?.name || ''})` };
              })}
            />

            <Select
              label="Formateur intervenant"
              value={newSessionData.trainerId}
              onChange={(e) => setNewSessionData({ ...newSessionData, trainerId: e.target.value })}
              options={trainers.map((t) => ({
                value: t.id,
                label: `${t.firstName} ${t.lastName} (${t.specialty})`,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Salle de cours"
              value={newSessionData.classroomId}
              onChange={(e) => setNewSessionData({ ...newSessionData, classroomId: e.target.value })}
              options={classrooms.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.capacity} places)`,
              }))}
            />

            <Input
              label="Date de la séance"
              type="date"
              required
              value={newSessionData.date}
              onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Heure de début"
              type="time"
              required
              value={newSessionData.startTime}
              onChange={(e) => setNewSessionData({ ...newSessionData, startTime: e.target.value })}
            />
            <Input
              label="Heure de fin"
              type="time"
              required
              value={newSessionData.endTime}
              onChange={(e) => setNewSessionData({ ...newSessionData, endTime: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => handleSaveSession(false)}>
              Valider la séance
            </Button>
          </div>
        </div>
      </Modal>

      {/* CONFLICT WARNING MODAL */}
      <ConflictWarningModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        onProceedAnyway={() => handleSaveSession(true)}
        conflicts={detectedConflicts}
      />
    </div>
  );
};
