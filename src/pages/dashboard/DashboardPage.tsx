import React from 'react';
import {
  Users,
  CreditCard,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Plus,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TabId } from '../../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: TabId, itemId?: string) => void;
  onQuickAction: (action: 'student' | 'session' | 'payment' | 'group' | 'ai') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onQuickAction,
}) => {
  const { user, organization } = useAuth();
  const {
    students,
    metrics,
    sessions,
    payments,
    formations,
    groups,
  } = useData();

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's sessions (support both date and sessionDate, guard startTime)
  const todaySessions = (sessions || [])
    .filter((s) => s && ((s.date || s.sessionDate) === todayStr))
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  // Overdue payments alerts
  const overduePayments = (payments || []).filter((p) => p && p.status === 'late').slice(0, 4);

  // High absence students alert (e.g. students with more than 1 absence in demo)
  const studentsWithAbsences = (students || []).filter((s) => s && s.status === 'active').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-900/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-xs border border-indigo-500/30">
              Année Académique {organization?.currentAcademicYear || '2026–2027'}
            </span>
            <span className="text-slate-400 text-xs">• Centre agréé</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Bienvenue sur le tableau de bord de{' '}
            <span className="font-semibold text-white">{organization?.name || 'Tech Academy Tunisia'}</span>.
            Gérez vos formations, étudiants, présences et paiements en toute sérénité.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => onNavigate('ai')}
            icon={Sparkles}
          >
            Assistant IA
          </Button>
          <Button
            variant="primary"
            onClick={() => onQuickAction('student')}
            icon={Plus}
          >
            Nouvel Étudiant
          </Button>
        </div>
      </div>

      {/* 2. Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Étudiants Actifs"
          value={metrics.totalStudents.toString()}
          subtitle={`${metrics.totalGroups} groupes en cours`}
          icon={Users}
          color="indigo"
          onClick={() => onNavigate('students')}
        />

        <StatCard
          title="Chiffre d'Affaires Encaissé"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle={`Reste dû : ${formatCurrency(metrics.pendingReceivables)}`}
          icon={CreditCard}
          color="emerald"
          onClick={() => onNavigate('payments')}
        />

        <StatCard
          title="Taux d'Assiduité Moyen"
          value={`${metrics.averageAttendanceRate}%`}
          subtitle="Calculé sur toutes les séances"
          icon={ClipboardCheck}
          color="sky"
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          title="Séances Aujourd'hui"
          value={todaySessions.length.toString()}
          subtitle={`${metrics.activeSessions} séances prévues`}
          icon={Calendar}
          color="amber"
          onClick={() => onNavigate('schedule')}
        />
      </div>

      {/* 3. Main Split View: Today's Schedule & Attention Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cours du Jour */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-base">Planning & Cours du Jour</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {todaySessions.length} séance{todaySessions.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Voir tout l'emploi du temps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todaySessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-600 text-sm">Aucune séance planifiée aujourd'hui</p>
                <p className="text-xs mt-1">Consultez l'agenda pour planifier un cours.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => onQuickAction('session')}
                >
                  Planifier un cours
                </Button>
              </div>
            ) : (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                      <span className="text-xs font-bold">{session.startTime}</span>
                      <span className="text-[10px] text-indigo-500 font-mono">{session.endTime}</span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">{session.title}</h3>
                      <p className="text-xs text-slate-500">
                        Groupe {session.groupCode || 'Promo'} • Formateur : {session.trainerName || 'Assigné'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Salle : {session.classroomName || 'Salle principale'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={session.status} type="session" />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onNavigate('attendance', session.id)}
                      icon={ClipboardCheck}
                    >
                      Émargement
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: À Surveiller (Alertes & Impayés) */}
        <div className="space-y-6">
          {/* Box 1: Alertes Impayés */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-800 text-sm">Échéances en Retard</h3>
              </div>
              <button
                onClick={() => onNavigate('payments')}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
              >
                Voir paiements
              </button>
            </div>

            <div className="p-4 space-y-3">
              {overduePayments.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aucun impayé à signaler</span>
                </div>
              ) : (
                overduePayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{p.studentName}</p>
                      <p className="text-[11px] text-slate-500">Échéance : {formatDate(p.paymentDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-700 font-mono">{formatCurrency(p.amount)}</p>
                      <span className="text-[10px] text-rose-500 font-medium">Relance conseillée</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box 2: Actions Rapides & Raccourcis */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 rounded-2xl p-5 shadow-2xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Raccourcis Fréquents</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Gagnez du temps dans la gestion quotidienne de votre centre.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onQuickAction('student')}
                className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Inscrire un nouvel étudiant</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('documents')}
                className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <span>Délivrer un certificat de fin de formation</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onQuickAction('payment')}
                className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Encaisser un règlement & reçu A4</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
