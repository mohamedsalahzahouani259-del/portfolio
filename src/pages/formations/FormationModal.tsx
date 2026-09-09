import React, { useState, useEffect } from 'react';
import { Formation, FormationModule } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, Layers } from 'lucide-react';

interface FormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  formation?: Formation | null;
}

export const FormationModal: React.FC<FormationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formation,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Informatique',
    description: '',
    durationHours: 60,
    price: 800,
    maxStudents: 15,
    status: 'active' as Formation['status'],
  });

  const [modules, setModules] = useState<FormationModule[]>([
    { id: 'm-1', title: 'Module 1 : Fondamentaux', durationHours: 20, sortOrder: 1 },
  ]);

  useEffect(() => {
    if (formation) {
      setFormData({
        name: formation.name,
        category: formation.category,
        description: formation.description || '',
        durationHours: formation.durationHours,
        price: formation.price,
        maxStudents: formation.maxStudents,
        status: formation.status,
      });
      setModules(formation.modules || []);
    } else {
      setFormData({
        name: '',
        category: 'Informatique',
        description: '',
        durationHours: 60,
        price: 800,
        maxStudents: 15,
        status: 'active',
      });
      setModules([
        { id: 'm-1', title: 'Module 1 : Introduction & Fondamentaux', durationHours: 20, sortOrder: 1 },
        { id: 'm-2', title: 'Module 2 : Pratique & Ateliers', durationHours: 25, sortOrder: 2 },
        { id: 'm-3', title: 'Module 3 : Projet Final & Soutenance', durationHours: 15, sortOrder: 3 },
      ]);
    }
  }, [formation, isOpen]);

  const handleAddModule = () => {
    const nextOrder = modules.length + 1;
    setModules([
      ...modules,
      {
        id: `m-${Date.now()}`,
        title: `Module ${nextOrder} : Nouveau Module`,
        durationHours: 15,
        sortOrder: nextOrder,
      },
    ]);
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleUpdateModule = (id: string, field: 'title' | 'durationHours', val: any) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  // Automatically compute total duration from modules
  const totalModuleHours = modules.reduce((sum, m) => sum + (Number(m.durationHours) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Veuillez renseigner le nom de la formation.');
      return;
    }

    onSave({
      ...formData,
      durationHours: totalModuleHours > 0 ? totalModuleHours : formData.durationHours,
      modules,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formation ? 'Modifier le programme' : 'Créer une nouvelle formation'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Intitulé de la formation"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ex: Développement Web Full-Stack"
          />
          <Select
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Informatique & Web', label: 'Informatique & Web' },
              { value: 'Data & IA', label: 'Data & IA' },
              { value: 'Marketing & Digital', label: 'Marketing & Digital' },
              { value: 'Design & UX', label: 'Design & UX' },
              { value: 'Management & RH', label: 'Management & RH' },
              { value: 'Langues & Communication', label: 'Langues & Communication' },
            ]}
          />
        </div>

        {/* Description */}
        <Input
          label="Description pédagogique"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Objectifs, compétences visées et prérequis..."
        />

        {/* Price DT & Max Students */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tarif d'inscription (en DT)"
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="1200"
          />
          <Input
            label="Effectif maximal par groupe"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
            placeholder="15"
          />
        </div>

        {/* Modular Curriculum Builder */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Programme Modulaire ({totalModuleHours} heures au total)</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Découpez votre formation en modules pour les fiches d'évaluation et attestations.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleAddModule}
              icon={Plus}
            >
              Ajouter un module
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <span className="font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => handleUpdateModule(m.id, 'title', e.target.value)}
                  placeholder="Intitulé du module"
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-800 focus:outline-hidden"
                />
                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    value={m.durationHours}
                    onChange={(e) =>
                      handleUpdateModule(m.id, 'durationHours', Number(e.target.value))
                    }
                    className="w-14 px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-center focus:outline-hidden"
                  />
                  <span className="text-slate-500 font-medium">h</span>
                </div>
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(m.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {formation ? 'Enregistrer les modifications' : 'Créer la formation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
