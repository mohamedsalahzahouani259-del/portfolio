import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  Layers,
  UserCheck,
  Calendar,
  X,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TabId } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabId, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { students, formations, groups, trainers } = useData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global ⌘K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Parent manages open state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items
  const matchedStudents = q
    ? students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q)
      ).slice(0, 5)
    : [];

  const matchedFormations = q
    ? formations.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedGroups = q
    ? groups.filter((g) => g.code.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedTrainers = q
    ? trainers.filter(
        (t) =>
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const hasResults =
    matchedStudents.length > 0 ||
    matchedFormations.length > 0 ||
    matchedGroups.length > 0 ||
    matchedTrainers.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher étudiant, formation, groupe, formateur..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
          {!q && (
            <div className="p-6 text-center text-slate-400">
              <p className="font-medium text-slate-600">Recherche globale dans SchoolFlow TN</p>
              <p className="text-xs mt-1 text-slate-400">
                Tapez le nom d'un étudiant, un code de groupe, une matière ou un formateur.
              </p>
            </div>
          )}

          {q && !hasResults && (
            <div className="p-8 text-center text-slate-400">
              <p className="font-medium text-slate-600">Aucun résultat trouvé pour "{query}"</p>
              <p className="text-xs mt-1">Vérifiez l'orthographe ou essayez un autre mot-clé.</p>
            </div>
          )}

          {/* Students Group */}
          {matchedStudents.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Étudiants</span>
              </p>
              {matchedStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onClose();
                    onNavigate('students', s.id);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-indigo-700">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {s.studentNumber} • {s.city}, {s.governorate}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          )}

          {/* Formations Group */}
          {matchedFormations.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                <span>Formations</span>
              </p>
              {matchedFormations.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onClose();
                    onNavigate('formations', f.id);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-sky-50 text-slate-700 hover:text-sky-900 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-sky-700">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {f.category} • {f.durationHours}h
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600" />
                </button>
              ))}
            </div>
          )}

          {/* Groups */}
          {matchedGroups.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Groupes & Promotions</span>
              </p>
              {matchedGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    onClose();
                    onNavigate('groups', g.id);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-amber-700">
                      Groupe {g.code}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Salle : {g.classroomId || 'Non assignée'}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600" />
                </button>
              ))}
            </div>
          )}

          {/* Trainers */}
          {matchedTrainers.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Formateurs</span>
              </p>
              {matchedTrainers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onClose();
                    onNavigate('trainers', t.id);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-emerald-700">
                      {t.firstName} {t.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400">{t.specialty}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
