import React, { useState, useEffect } from 'react';
import { Trainer } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  trainer?: Trainer | null;
}

export const TrainerModal: React.FC<TrainerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  trainer,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    email: '',
    phone: '',
    hourlyRate: 40,
    bio: '',
    status: 'active' as Trainer['status'],
  });

  useEffect(() => {
    if (trainer) {
      setFormData({
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        specialty: trainer.specialty,
        email: trainer.email,
        phone: trainer.phone,
        hourlyRate: trainer.hourlyRate,
        bio: trainer.bio || '',
        status: trainer.status,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        specialty: 'Développement Web & Cloud',
        email: '',
        phone: '+216 ',
        hourlyRate: 40,
        bio: '',
        status: 'active',
      });
    }
  }, [trainer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Veuillez renseigner le prénom, le nom et l’email.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={trainer ? 'Modifier le formateur' : 'Ajouter un formateur'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="ex: Youssef"
          />
          <Input
            label="Nom"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="ex: Ben Amor"
          />
        </div>

        {/* Specialty & Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Spécialité / Expertise"
            required
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            placeholder="ex: React, Node.js, DevOps"
          />
          <Input
            label="Taux horaire (DT / heure)"
            type="number"
            required
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
            placeholder="45"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email professionnel"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="youssef.benamor@gmail.com"
          />
          <Input
            label="Numéro de téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+216 98 765 432"
          />
        </div>

        {/* Bio */}
        <Input
          label="Bio / Expérience résumée"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Ingénieur logiciel senior, 8 ans d'expérience..."
        />

        {/* Status */}
        <Select
          label="Statut d'activité"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          options={[
            { value: 'active', label: 'Actif (En mission)' },
            { value: 'inactive', label: 'Inactif / En pause' },
          ]}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {trainer ? 'Enregistrer les modifications' : 'Ajouter le formateur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
