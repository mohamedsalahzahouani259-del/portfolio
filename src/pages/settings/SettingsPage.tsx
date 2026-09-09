import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Save,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TUNISIAN_GOVERNORATES } from '../../lib/formatters';
import { toast } from '../../components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const { organization, updateOrganization } = useAuth();
  const { resetToDemo, clearWorkspace } = useData();

  const [formData, setFormData] = useState({
    name: organization?.name || 'Tech Academy Tunisia',
    legalName: organization?.legalName || 'Tech Academy SARL',
    directorName: organization?.directorName || 'Mehdi Gharbi',
    taxId: organization?.taxId || '1234567/A/M/000 (Agrément N° 2026-084)',
    email: organization?.email || 'contact@techacademy.tn',
    phone: organization?.phone || '+216 71 850 900',
    address: organization?.address || '14 Rue des Entrepreneurs, Z.I. Charguia II',
    city: organization?.city || 'Tunis',
    governorate: organization?.governorate || 'Tunis',
    currentAcademicYear: organization?.currentAcademicYear || '2026–2027',
    bankRib: organization?.bankRib || '08 012 0123456789012 45',
    studentIdPrefix: organization?.studentIdPrefix || 'STU-2026-',
    receiptPrefix: organization?.receiptPrefix || 'REC-2026-',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization(formData);
    toast.success('Paramètres du centre sauvegardés avec succès !');
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données aux valeurs de démonstration officielles ?')) {
      resetToDemo();
      toast.success('Données de démo rechargées avec succès !');
      setTimeout(() => window.location.reload(), 300);
    }
  };

  const handleClear = () => {
    if (confirm('ATTENTION : Voulez-vous vraiment effacer toutes les données du centre ? Cette action est irréversible.')) {
      clearWorkspace();
      toast.success('Espace vidé.');
      setTimeout(() => window.location.reload(), 300);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Paramètres du Centre & Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Identifiants fiscaux tunisiens, agrément ministériel, année académique et numérotation
        </p>
      </div>

      {/* 2. Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Informations Générales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Fiche Légale de l'Établissement</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom commercial de l'académie"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Raison sociale"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom du Directeur / Responsable"
              required
              value={formData.directorName}
              onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
            />
            <Input
              label="Matricule Fiscal & Agrément Ministériel"
              required
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email officiel du centre"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <Select
                label="Gouvernorat"
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                options={TUNISIAN_GOVERNORATES.map((g) => ({ value: g, label: g }))}
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                label="Ville"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                label="Adresse"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Année Académique & Numérotation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Année Académique & Numérotation Séquentielle</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Année Académique Active"
              required
              value={formData.currentAcademicYear}
              onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value })}
              placeholder="2026–2027"
            />
            <Input
              label="Préfixe Matricules Étudiants"
              required
              value={formData.studentIdPrefix}
              onChange={(e) => setFormData({ ...formData, studentIdPrefix: e.target.value })}
              placeholder="STU-2026-"
            />
            <Input
              label="Préfixe Reçus de Paiement"
              required
              value={formData.receiptPrefix}
              onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
              placeholder="REC-2026-"
            />
          </div>

          <Input
            label="RIB Bancaire (pour virements des étudiants)"
            value={formData.bankRib}
            onChange={(e) => setFormData({ ...formData, bankRib: e.target.value })}
            placeholder="08 012 0123456789012 45 (BIAT / Attijari / UIB)"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" type="submit" icon={Save}>
            Enregistrer les modifications
          </Button>
        </div>
      </form>

      {/* Section 3: Zone Danger / Gestion des Données */}
      <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 space-y-4">
        <h2 className="font-bold text-rose-800 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>Données de Démonstration & Réinitialisation</span>
        </h2>
        <p className="text-xs text-rose-700">
          Vous pouvez recharger à tout moment le jeu de données officiel de démonstration tunisien (Tech Academy Tunisia) avec des étudiants, promotions, formateurs, plannings et paiements réalistes.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={handleReset}
            icon={RotateCcw}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Recharger les données de démo
          </Button>
          <Button
            variant="danger"
            onClick={handleClear}
            icon={Trash2}
          >
            Vider l'espace de données
          </Button>
        </div>
      </div>
    </div>
  );
};
