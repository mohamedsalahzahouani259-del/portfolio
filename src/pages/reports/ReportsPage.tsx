import React from 'react';
import {
  BarChart3,
  Download,
  CreditCard,
  ClipboardCheck,
  GraduationCap,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';

export const ReportsPage: React.FC = () => {
  const {
    students,
    formations,
    groups,
    payments,
    enrollments,
    metrics,
    attendance,
  } = useData();

  // Export dataset to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Matricule,Nom,Prenom,Email,Telephone,Gouvernorat,Statut\n';

    students.forEach((s) => {
      csvContent += `${s.studentNumber},"${s.lastName}","${s.firstName}","${s.email}","${s.phone}","${s.governorate}","${s.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SchoolFlow_Etudiants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Rapport exporté au format CSV avec succès !');
  };

  // Group attendance distribution
  const groupStats = groups.map((g) => {
    const form = formations.find((f) => f.id === g.formationId);
    const enrCount = enrollments.filter((e) => e.groupId === g.id).length;
    return {
      code: g.code,
      formation: form?.name || 'Formation',
      enrolled: enrCount,
      capacity: g.maxCapacity || 15,
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Rapports & Statistiques Pédagogiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs de performance, rentabilité des cursus et export de données pour comptabilité
          </p>
        </div>

        <Button variant="primary" onClick={handleExportCSV} icon={Download}>
          Exporter les données (CSV)
        </Button>
      </div>

      {/* 2. Key Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recettes Encaissées</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2 font-mono">
            {formatCurrency(metrics.totalRevenue)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Dinars Tunisiens (DT)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Reste à Recouvrer</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 font-mono">
            {formatCurrency(metrics.pendingReceivables)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Créances en cours</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Taux d'Assiduité Global</span>
            <ClipboardCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-2">
            {metrics.averageAttendanceRate}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Sur l'ensemble des promotions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Apprenants</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {metrics.totalStudents}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{groups.length} groupes actifs</p>
        </div>
      </div>

      {/* 3. Detailed Distribution Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Remplissage des Groupes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Taux de Remplissage par Promotion
          </h3>

          <div className="space-y-4">
            {groupStats.map((item) => {
              const pct = Math.round((item.enrolled / item.capacity) * 100);
              return (
                <div key={item.code} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      Groupe {item.code} — {item.formation}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.enrolled} / {item.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 85 ? 'bg-indigo-600' : 'bg-sky-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Répartition Financière par Formation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Génération de Valeur par Programme
          </h3>

          <div className="space-y-3">
            {formations.map((f) => {
              const formEnrs = enrollments.filter((e) => e.formationId === f.id);
              const totalVal = formEnrs.reduce((acc, e) => acc + (e.agreedPrice || e.totalTuition || 0), 0);

              return (
                <div
                  key={f.id}
                  className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800">{f.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {formEnrs.length} inscription(s) • Tarif: {formatCurrency(f.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-indigo-700">{formatCurrency(totalVal)}</p>
                    <span className="text-[10px] text-slate-400">Total engagé</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
