import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Clock,
  CreditCard,
  Layers,
  ArrowRight,
  Edit2,
  BookOpen,
} from 'lucide-react';
import { Formation } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { FormationModal } from './FormationModal';

interface FormationsListProps {
  onSelectFormation: (id: string) => void;
  onCreateGroupForFormation: (formationId: string) => void;
}

export const FormationsList: React.FC<FormationsListProps> = ({
  onSelectFormation,
  onCreateGroupForFormation,
}) => {
  const { formations, groups, enrollments, createFormation, updateFormation } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const categories = Array.from(new Set(formations.map((f) => f.category)));

  const filteredFormations = formations.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      (f.description && f.description.toLowerCase().includes(q));

    const matchesCategory = selectedCategory ? f.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleSaveFormation = (data: any) => {
    if (editingFormation) {
      updateFormation({ ...editingFormation, ...data });
    } else {
      createFormation(data);
    }
    setEditingFormation(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Programmes & Formations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catalogue des cursus certifiants, volumes horaires et modules de formation
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingFormation(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Nouvelle formation
        </Button>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une formation par intitulé ou compétence..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-60 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">Toutes les filières</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Formations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFormations.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Aucune formation correspondante</p>
            <p className="text-xs mt-1">Créez votre première formation ou ajustez votre recherche.</p>
          </div>
        ) : (
          filteredFormations.map((f) => {
            const activeGroups = groups.filter((g) => g.formationId === f.id);
            const enrolledCount = enrollments.filter((e) => e.formationId === f.id).length;

            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {f.category}
                    </span>
                    <button
                      onClick={() => {
                        setEditingFormation(f);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      onClick={() => onSelectFormation(f.id)}
                      className="font-bold text-base text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {f.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {f.description || 'Formation certifiante orientée pratique et insertion professionnelle.'}
                    </p>
                  </div>

                  {/* Badges Info */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{f.durationHours} heures</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                      <span>{f.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>{activeGroups.length} groupe(s)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold font-mono text-slate-800">{formatCurrency(f.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {enrolledCount} étudiant(s) inscrit(s)
                  </span>
                  <button
                    onClick={() => onSelectFormation(f.id)}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Détails & Programme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formation Modal */}
      <FormationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFormation(null);
        }}
        onSave={handleSaveFormation}
        formation={editingFormation}
      />
    </div>
  );
};
