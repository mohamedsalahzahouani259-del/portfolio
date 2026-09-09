import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  UserCheck,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Award,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { clsx } from 'clsx';
import { UserRole } from '../../types';

export type TabId =
  | 'dashboard'
  | 'students'
  | 'formations'
  | 'groups'
  | 'trainers'
  | 'schedule'
  | 'attendance'
  | 'payments'
  | 'evaluations'
  | 'documents'
  | 'ai'
  | 'reports'
  | 'settings'
  | 'student-portal'
  | 'trainer-portal';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onCloseMobile,
}) => {
  const { user, organization, logout, switchRole } = useAuth();
  const { students, sessions, payments } = useData();

  // Badges calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessionsCount = (sessions || []).filter(
    (s) => s && ((s.date || s.sessionDate) === todayStr) && s.status === 'scheduled'
  ).length;
  const overdueCount = (payments || []).filter((p) => p && p.status === 'late').length;

  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'students' as TabId,
      label: 'Étudiants',
      icon: Users,
      badge: students.length > 0 ? students.length : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'formations' as TabId,
      label: 'Formations',
      icon: GraduationCap,
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'groups' as TabId,
      label: 'Groupes & Promos',
      icon: Layers,
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'trainers' as TabId,
      label: 'Formateurs',
      icon: UserCheck,
      roles: ['owner', 'admin'] as UserRole[],
    },
    {
      id: 'schedule' as TabId,
      label: 'Emploi du temps',
      icon: Calendar,
      badge: todaySessionsCount > 0 ? `${todaySessionsCount} auj.` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
      roles: ['owner', 'admin', 'secretary', 'trainer'] as UserRole[],
    },
    {
      id: 'attendance' as TabId,
      label: 'Présences & Émargement',
      icon: ClipboardCheck,
      roles: ['owner', 'admin', 'secretary', 'trainer'] as UserRole[],
    },
    {
      id: 'payments' as TabId,
      label: 'Paiements & Reçus',
      icon: CreditCard,
      badge: overdueCount > 0 ? overdueCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'evaluations' as TabId,
      label: 'Notes & Bulletins',
      icon: FileCheck2,
      roles: ['owner', 'admin', 'trainer'] as UserRole[],
    },
    {
      id: 'documents' as TabId,
      label: 'Certificats officiels',
      icon: Award,
      roles: ['owner', 'admin', 'secretary'] as UserRole[],
    },
    {
      id: 'ai' as TabId,
      label: 'SchoolFlow AI',
      icon: Sparkles,
      highlight: true,
      roles: ['owner', 'admin'] as UserRole[],
    },
    {
      id: 'reports' as TabId,
      label: 'Statistiques & Rapports',
      icon: BarChart3,
      roles: ['owner', 'admin'] as UserRole[],
    },
    {
      id: 'settings' as TabId,
      label: 'Paramètres du Centre',
      icon: Settings,
      roles: ['owner', 'admin'] as UserRole[],
    },
  ];

  const currentRole = user?.role || 'owner';
  const visibleNavItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 select-none">
      {/* 1. Header & Center Brand */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>SchoolFlow</span>
              <span className="text-[10px] bg-red-600/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                TN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {organization?.name || 'Tech Academy Tunisia'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Academic Year Badge */}
      <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Année Académique :</span>
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-semibold text-[11px] border border-indigo-500/30">
          {organization?.currentAcademicYear || '2026–2027'}
        </span>
      </div>

      {/* 3. Navigation items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70',
                item.highlight && !isActive && 'text-sky-300 hover:text-sky-200 bg-sky-950/30 border border-sky-800/40'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={clsx(
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 4. Quick Perspective / Role Switcher */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
          <span>Vue Simulation Rôle</span>
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px] font-medium">
          <button
            onClick={() => switchRole('owner')}
            className={clsx(
              'py-1.5 px-1 rounded text-center truncate transition-colors',
              currentRole === 'owner'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
            title="Directeur (Accès complet)"
          >
            Directeur
          </button>
          <button
            onClick={() => switchRole('trainer')}
            className={clsx(
              'py-1.5 px-1 rounded text-center truncate transition-colors',
              currentRole === 'trainer'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
            title="Formateur (Cours, Émargement, Notes)"
          >
            Formateur
          </button>
          <button
            onClick={() => switchRole('student')}
            className={clsx(
              'py-1.5 px-1 rounded text-center truncate transition-colors',
              currentRole === 'student'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
            title="Étudiant (Mon Parcours, Présences, Reçus)"
          >
            Étudiant
          </button>
        </div>
      </div>

      {/* 5. User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentRole === 'owner' ? 'Directeur' : currentRole === 'trainer' ? 'Formateur' : 'Étudiant'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
