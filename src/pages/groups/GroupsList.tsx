import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  UserCheck,
  DoorClosed,
  Calendar,
  Users,
  Edit2,
  CalendarPlus,
  ClipboardCheck,
} from 'lucide-react';
import { Group } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/formatters';
import { GroupModal } from './GroupModal';
import { TabId } from '../../components/layout/Sidebar';

interface GroupsListProps {
  onNavigate: (tab: TabId, itemId?: string) => void;
  onPlanSessionForGroup: (groupId: string) => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  onNavigate,
  onPlanSessionForGroup,
}) => {
  const { groups, formations, trainers, classrooms, enrollments, createGroup, updateGroup } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const filteredGroups = groups.filter((g) => {
    const q = searchQuery.toLowerCase();
    const formation = formations.find((f) => f.id === g.formationId);
    return (
      g.code.toLowerCase().includes(q) ||
      (formation && formation.name.toLowerCase().includes(q))
    );
  });

  const handleSaveGroup = (data: any) => {
    if (editingGroup) {
      updateGroup({ ...editingGroup, ...data });
    } else {
      createGroup(data);
    }
    setEditingGroup(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Groupes & Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des cohortes d'apprenants, des salles assignées et des formateurs référents
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingGroup(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Créer une promotion
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
            placeholder="Rechercher un groupe par code (ex: DW-01) ou intitulé de formation..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 3. Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Aucun groupe trouvé</p>
            <p className="text-xs mt-1">Créez une nouvelle promotion pour démarrer.</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const formation = formations.find((f) => f.id === group.formationId);
            const trainer = trainers.find((t) => t.id === group.trainerId);
            const room = classrooms.find((c) => c.id === group.classroomId);

            const groupEnrollments = enrollments.filter((e) => e.groupId === group.id);
            const enrolledCount = groupEnrollments.length;
            const maxCap = group.maxCapacity || 15;
            const fillRate = Math.min(100, Math.round((enrolledCount / maxCap) * 100));

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Header: Code & Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                      Groupe {group.code}
                    </span>
                    <button
                      onClick={() => {
                        setEditingGroup(group);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Formation Title */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">
                      {formation?.name || 'Formation'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {group.scheduleDescription || 'Créneaux réguliers'}
                    </p>
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Remplissage</span>
                      </span>
                      <span className="font-semibold text-slate-800">
                        {enrolledCount} / {maxCap} places ({fillRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillRate >= 90
                            ? 'bg-amber-500'
                            : fillRate >= 50
                            ? 'bg-indigo-600'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${fillRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Trainer & Room */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Formateur non assigné'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DoorClosed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {room ? `${room.name} (${room.capacity} places)` : 'Salle non assignée'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Du {formatDate(group.startDate)} au {formatDate(group.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPlanSessionForGroup(group.id)}
                    icon={CalendarPlus}
                    className="w-full justify-center text-[11px]"
                  >
                    + Séance
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate('attendance')}
                    icon={ClipboardCheck}
                    className="w-full justify-center text-[11px]"
                  >
                    Émarger
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Group Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        group={editingGroup}
      />
    </div>
  );
};
