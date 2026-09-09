import React, { useState, useEffect } from 'react';
import { Group } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  group?: Group | null;
  initialFormationId?: string;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group,
  initialFormationId,
}) => {
  const { formations, trainers, classrooms } = useData();

  const [formData, setFormData] = useState({
    code: '',
    formationId: initialFormationId || (formations[0]?.id || ''),
    trainerId: '',
    classroomId: '',
    startDate: '2026-09-15',
    endDate: '2026-12-30',
    scheduleDescription: 'Mardi & Jeudi (18h00 - 21h00)',
    maxCapacity: 15,
    status: 'active' as Group['status'],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        code: group.code,
        formationId: group.formationId,
        trainerId: group.trainerId || '',
        classroomId: group.classroomId || '',
        startDate: group.startDate,
        endDate: group.endDate,
        scheduleDescription: group.scheduleDescription || '',
        maxCapacity: group.maxCapacity || 15,
        status: group.status,
      });
    } else {
      setFormData({
        code: `GRP-${Math.floor(10 + Math.random() * 90)}`,
        formationId: initialFormationId || (formations[0]?.id || ''),
        trainerId: trainers[0]?.id || '',
        classroomId: classrooms[0]?.id || '',
        startDate: '2026-09-15',
        endDate: '2026-12-30',
        scheduleDescription: 'Samedi (09h00 - 13h00)',
        maxCapacity: 15,
        status: 'active',
      });
    }
  }, [group, initialFormationId, isOpen, formations, trainers, classrooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.formationId) {
      alert('Veuillez renseigner le code du groupe et la formation associée.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={group ? 'Modifier la promotion / groupe' : 'Créer une nouvelle promotion'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code & Formation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Code du groupe"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="ex: DW-02"
          />
          <Select
            label="Formation rattachée"
            required
            value={formData.formationId}
            onChange={(e) => setFormData({ ...formData, formationId: e.target.value })}
            options={formations.map((f) => ({ value: f.id, label: f.name }))}
          />
        </div>

        {/* Trainer & Classroom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Formateur référent"
            value={formData.trainerId}
            onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
            options={[
              { value: '', label: '-- Aucun formateur --' },
              ...trainers.map((t) => ({
                value: t.id,
                label: `${t.firstName} ${t.lastName} (${t.specialty})`,
              })),
            ]}
          />
          <Select
            label="Salle de cours"
            value={formData.classroomId}
            onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
            options={[
              { value: '', label: '-- Aucune salle --' },
              ...classrooms.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.capacity} places)`,
              })),
            ]}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date de début"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="Date de fin estimée"
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>

        {/* Schedule note & Max capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Rythme / Créneaux habituels"
            value={formData.scheduleDescription}
            onChange={(e) => setFormData({ ...formData, scheduleDescription: e.target.value })}
            placeholder="ex: Samedi (09h00 - 13h00)"
          />
          <Input
            label="Capacité maximale (apprenants)"
            type="number"
            value={formData.maxCapacity}
            onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {group ? 'Enregistrer' : 'Créer la promotion'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
