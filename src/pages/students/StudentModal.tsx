import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { TUNISIAN_GOVERNORATES } from '../../lib/formatters';
import { useData } from '../../context/DataContext';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any, targetGroupId?: string) => void;
  student?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
}) => {
  const { groups, formations } = useData();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cin: '',
    email: '',
    phone: '',
    dateOfBirth: '2000-01-01',
    address: '',
    city: 'Tunis',
    governorate: 'Tunis',
    status: 'active' as Student['status'],
    notes: '',
  });

  const [targetGroupId, setTargetGroupId] = useState<string>('');

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        cin: student.cin || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '2000-01-01',
        address: student.address || '',
        city: student.city || 'Tunis',
        governorate: student.governorate || 'Tunis',
        status: student.status || 'active',
        notes: student.notes || '',
      });
      setTargetGroupId('');
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        cin: '',
        email: '',
        phone: '',
        dateOfBirth: '2000-01-01',
        address: '',
        city: 'Tunis',
        governorate: 'Tunis',
        status: 'active',
        notes: '',
      });
      if (groups.length > 0) {
        setTargetGroupId(groups[0].id);
      }
    }
  }, [student, isOpen, groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Veuillez renseigner le prénom, le nom et l’email.');
      return;
    }

    onSave(formData, !student ? targetGroupId : undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? 'Modifier l’étudiant' : 'Inscrire un nouvel étudiant'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="ex: Amina"
          />
          <Input
            label="Nom"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="ex: Ben Salem"
          />
        </div>

        {/* Row 2: CIN & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="N° CIN (Carte d'Identité)"
            value={formData.cin}
            onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
            placeholder="ex: 09876543 (8 chiffres)"
          />
          <Input
            label="Date de naissance"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        {/* Row 3: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="amina.bensalem@gmail.com"
          />
          <Input
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+216 98 123 456"
          />
        </div>

        {/* Row 4: Governorate & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Gouvernorat"
            value={formData.governorate}
            onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
            options={TUNISIAN_GOVERNORATES.map((g) => ({ value: g, label: g }))}
          />
          <Input
            label="Ville / Commune"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="ex: Ariana Ville"
          />
        </div>

        {/* Row 5: Group assignment (only on new student registration) */}
        {!student && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-indigo-900">
              Affectation directe à un groupe / promotion :
            </p>
            <Select
              label="Sélectionner le groupe"
              value={targetGroupId}
              onChange={(e) => setTargetGroupId(e.target.value)}
              options={[
                { value: '', label: '-- Aucun groupe pour l’instant --' },
                ...groups.map((g) => {
                  const formation = formations.find((f) => f.id === g.formationId);
                  return {
                    value: g.id,
                    label: `Groupe ${g.code} (${formation?.name || 'Formation'})`,
                  };
                }),
              ]}
            />
            <p className="text-[11px] text-indigo-700">
              L'étudiant sera automatiquement inscrit et son échéancier de paiement sera initialisé.
            </p>
          </div>
        )}

        {/* Row 6: Status & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Statut"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
              { value: 'graduated', label: 'Diplômé / Terminé' },
              { value: 'suspended', label: 'Suspendu' },
            ]}
          />
          <Input
            label="Notes internes (optionnel)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Commentaires administratifs..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {student ? 'Enregistrer les modifications' : 'Confirmer l’inscription'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
