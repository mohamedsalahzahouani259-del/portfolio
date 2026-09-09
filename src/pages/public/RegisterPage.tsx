import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { ArrowLeft, CheckCircle2, GraduationCap } from 'lucide-react';

interface RegisterPageProps {
  onGoToLogin: () => void;
  onBackToLanding: () => void;
  onRegistered: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onGoToLogin,
  onBackToLanding,
  onRegistered,
}) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const res = await register(firstName, lastName, email, password);
    setIsLoading(false);

    if (res.success) {
      toast.success('Compte créé avec succès ! Configurons votre centre de formation.');
      onRegistered();
    } else {
      setError(res.error || 'Erreur lors de la création du compte.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Column: Value Prop */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white p-12 lg:p-16 flex-col justify-between">
        <div>
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-2xl text-white">SchoolFlow</span>
              <span className="font-extrabold text-2xl text-indigo-400">TN</span>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Rejoignez les meilleurs centres de formation en Tunisie.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed max-w-md mb-8">
            En moins de 2 minutes, configurez l'ensemble de votre établissement : promotions, formations modulaires, salles de cours et gestion financière.
          </p>

          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Conçu spécialement pour la réglementation et les centres tunisiens</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Emploi du temps intelligent sans double réservation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Échéanciers multi-tranches et reçus A4 en Dinars (DT)</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400">
          <p>© 2026–2027 SchoolFlow TN • Plateforme de Gestion Académique</p>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <button
            onClick={onBackToLanding}
            className="md:hidden inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Créer un compte Centre
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configurez votre espace SchoolFlow TN en quelques secondes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Mehdi"
                required
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Gharbi"
                required
              />
            </div>

            <Input
              label="Email professionnel"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="direction@votre-centre.tn"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Création en cours...' : 'Créer mon centre de formation'}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Vous avez déjà un compte ?{' '}
            <button
              onClick={onGoToLogin}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
