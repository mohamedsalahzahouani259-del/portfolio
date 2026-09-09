import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  UserPlus,
  CalendarPlus,
  CreditCard,
  Layers,
  Sparkles,
  ChevronDown,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { ROLE_LABELS } from '../../lib/formatters';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
  onQuickAction: (action: 'student' | 'session' | 'payment' | 'group' | 'ai') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenGlobalSearch,
  onQuickAction,
}) => {
  const { user, organization } = useAuth();
  const { activityLogs } = useData();

  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const quickRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setIsQuickOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadLogs = activityLogs.slice(0, 5);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile menu toggle + Global Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-400 hover:text-slate-600 rounded-xl text-xs transition-all w-44 sm:w-72 md:w-80 shadow-2xs group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
          <span className="flex-1 text-left truncate">Rechercher étudiant, groupe, formation...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Academic Year pill, Quick Action, Notifications, User info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Année : {organization?.currentAcademicYear || '2026–2027'}</span>
        </div>

        {/* Quick Action Dropdown */}
        {user?.role !== 'student' && (
          <div className="relative" ref={quickRef}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuickOpen(!isQuickOpen)}
              icon={Plus}
              className="font-semibold shadow-xs"
            >
              <span className="hidden sm:inline">Action Rapide</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-80" />
            </Button>

            {isQuickOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in-50 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Création Rapide
                </div>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAction('student');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Inscrire un étudiant</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAction('session');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-sky-600" />
                  <span className="font-medium">Planifier une séance</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAction('payment');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Encaisser un paiement</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAction('group');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Créer une promo/groupe</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAction('ai');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Poser une question à l'IA</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Modal/Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in-50 duration-100">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-800">Dernières activités</span>
                <span className="text-[11px] text-indigo-600 font-medium">Actif</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {unreadLogs.length === 0 ? (
                  <p className="p-4 text-center text-slate-400 text-xs">Aucune nouvelle activité</p>
                ) : (
                  unreadLogs.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <p className="font-medium text-slate-800">{log.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {log.userName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {user?.role ? ROLE_LABELS[user.role] : 'Utilisateur'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
