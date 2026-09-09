import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TUNISIAN_GOVERNORATES } from '../../lib/formatters';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { user, organization, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [centerName, setCenterName] = useState(
    organization?.name || 'Académie de Formation'
  );
  const [directorName, setDirectorName] = useState(
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Directeur'
  );
  const [phone, setPhone] = useState(organization?.phone || '+216 71 850 900');
  const [email, setEmail] = useState(organization?.email || user?.email || '');
  const [governorate, setGovernorate] = useState(organization?.governorate || 'Tunis');
  const [city, setCity] = useState(organization?.city || 'Tunis');
  const [taxId, setTaxId] = useState(
    organization?.taxId || '1234567/A/M/000 (Agrément N° 2026-084)'
  );
  const [academicYear, setAcademicYear] = useState('2026–2027');

  // Step 2: First Formation
  const [formationName, setFormationName] = useState('Développement Web Full-Stack');
  const [formationPrice, setFormationPrice] = useState(1200);
  const [formationDuration, setFormationDuration] = useState(120);

  // Step 3: First Cohort Code
  const [groupCode, setGroupCode] = useState('DW-01');

  const handleFinish = () => {
    completeOnboarding(
      {
        name: centerName.trim() || 'Mon Centre de Formation',
        directorName: directorName.trim(),
        taxId: taxId.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: 'Rue de la Formation',
        city: city.trim(),
        governorate,
      },
      {
        academicYear,
        currency: 'DT',
      }
    );
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-100 h-1.5 w-full">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Étape {step} sur 4
              </p>
              <h2 className="text-xl font-extrabold text-slate-900">
                {step === 1 && 'Votre Établissement de Formation'}
                {step === 2 && 'Votre Premier Programme Pédagogique'}
                {step === 3 && 'Votre Première Promotion / Groupe'}
                {step === 4 && 'Félicitations, tout est prêt !'}
              </h2>
            </div>
          </div>

          {/* STEP 1: Center Info */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Nom officiel du centre ou de l'école"
                required
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder="ex: Tech Academy Tunisia"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nom du Directeur"
                  required
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)}
                />
                <Input
                  label="Année Académique"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026–2027"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Matricule Fiscal / Agrément"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="ex: Agrément N° 2026-084"
                />
                <Select
                  label="Gouvernorat"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  options={TUNISIAN_GOVERNORATES.map((g) => ({ value: g, label: g }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email de contact"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} icon={ArrowRight}>
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: First Formation */}
          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="Intitulé de la première formation"
                required
                value={formationName}
                onChange={(e) => setFormationName(e.target.value)}
                placeholder="ex: Data Science & Intelligence Artificielle"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Volume horaire global"
                  type="number"
                  value={formationDuration}
                  onChange={(e) => setFormationDuration(Number(e.target.value))}
                  placeholder="120"
                />
                <Input
                  label="Tarif d'inscription (DT)"
                  type="number"
                  value={formationPrice}
                  onChange={(e) => setFormationPrice(Number(e.target.value))}
                  placeholder="1200"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800">
                Vous pourrez enrichir le cursus avec des modules pédagogiques détaillés plus tard.
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} icon={ArrowRight}>
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: First Group */}
          {step === 3 && (
            <div className="space-y-4">
              <Input
                label="Code de la promotion initiale"
                required
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="ex: DW-01"
              />

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">Votre centre sera configuré avec :</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500">
                  <li>Programme : <strong>{formationName}</strong> ({formationDuration}h)</li>
                  <li>Promotion : <strong>Groupe {groupCode}</strong></li>
                  <li>Salle de cours par défaut : <strong>Lab Informatique</strong></li>
                  <li>Devise de facturation : <strong>Dinars Tunisiens (DT)</strong></li>
                </ul>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Retour
                </Button>
                <Button onClick={() => setStep(4)} icon={ArrowRight}>
                  Finaliser
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Ready */}
          {step === 4 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Bienvenue sur SchoolFlow TN !
                </h3>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                  Votre centre <strong>{centerName}</strong> est prêt pour l'année académique <strong>{academicYear}</strong>.
                </p>
              </div>

              <div className="pt-4">
                <Button onClick={handleFinish} variant="primary" size="lg" className="w-full">
                  Accéder à mon tableau de bord
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
