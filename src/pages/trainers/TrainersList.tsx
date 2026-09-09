import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  CreditCard,
  Layers,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { Trainer } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { TrainerModal } from './TrainerModal';

interface TrainersListProps {
  onSelectTrainer: (id: string) => void;
}

export const TrainersList: React.FC<TrainersListProps> = ({ onSelectTrainer }) => {
  const { trainers, groups, createTrainer, updateTrainer } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const filteredTrainers = trainers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.specialty.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    );
  });

  const handleSaveTrainer = (data: any) => {
    if (editingTrainer) {
      updateTrainer({ ...editingTrainer, ...data });
    } else {
      createTrainer(data);
    }
    setEditingTrainer(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Corps Enseignant & Formateurs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des intervenants experts, spécialités, taux horaires et plannings
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingTrainer(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Ajouter un formateur
        </Button>
      </div>

      {/* 2. Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, expertise ou email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 3. Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Aucun formateur trouvé</p>
            <p className="text-xs mt-1">Ajoutez un nouvel intervenant au corps professoral.</p>
          </div>
        ) : (
          filteredTrainers.map((t) => {
            const activeGroups = groups.filter((g) => g.trainerId === t.id);

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Avatar & Edit */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-base">
                        {t.firstName.charAt(0)}
                      </div>
                      <div>
                        <h3
                          onClick={() => onSelectTrainer(t.id)}
                          className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {t.firstName} {t.lastName}
                        </h3>
                        <p className="text-xs text-indigo-600 font-medium">{t.specialty}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingTrainer(t);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold font-mono">{formatCurrency(t.hourlyRate)}/h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{activeGroups.length} groupe(s)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.status === 'active' ? 'Disponible' : 'Inactif'}
                  </span>
                  <button
                    onClick={() => onSelectTrainer(t.id)}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Fiche & Planning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trainer Modal */}
      <TrainerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrainer(null);
        }}
        onSave={handleSaveTrainer}
        trainer={editingTrainer}
      />
    </div>
  );
};
