import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { ArrowLeft, GraduationCap, ShieldCheck, UserCheck, User } from 'lucide-react';

interface LoginPageProps {
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoToRegister,
  onGoToForgotPassword,
  onBackToLanding,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('direction@techacademy.tn');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      toast.success('Connexion réussie. Bienvenue sur SchoolFlow TN !');
    } else {
      setError(res.error || 'Identifiants incorrects.');
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setIsLoading(true);
    const res = await login(quickEmail);
    setIsLoading(false);
    if (res.success) {
      toast.success('Connexion établie avec succès !');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Column: Branding SchoolFlow TN */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au site public</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white">SchoolFlow</span>
              <span className="font-extrabold text-2xl text-indigo-400 ml-1">TN</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight max-w-md">
            Pilotez votre centre de formation comme les meilleures académies.
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-md">
            Gestion pédagogique intégrée, contrôle des présences par séance, facturation des scolarités en Dinars Tunisiens (DT) et certificats officiels conformes.
          </p>
        </div>

        <div className="relative z-10 border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 font-mono">
            SchoolFlow TN • Année Académique 2026–2027 • République Tunisienne
          </p>
        </div>
      </div>

      {/* Right Column: Login Form & 1-Click Roles */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Accéder à SchoolFlow TN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connectez-vous à l'espace de votre établissement.
          </p>
        </div>

        {/* 1-Click Fast Accounts */}
        <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
            <span>Comptes Démo Préconfigurés</span>
            <span className="text-indigo-600 font-normal">1 clic</span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('direction@techacademy.tn')}
              className="w-full p-2 bg-white hover:bg-indigo-50/80 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between text-slate-800 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Directeur du Centre (Dr. Karim Ben Youssef)</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-medium">Tout voir</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('mohamed.benali@techacademy.tn')}
              className="w-full p-2 bg-white hover:bg-indigo-50/80 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between text-slate-800 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-600" />
                <span className="font-semibold">Formateur (Mohamed Ben Ali)</span>
              </div>
              <span className="text-[10px] text-sky-600 font-medium">Émargement</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ahmed.bensalah@gmail.com')}
              className="w-full p-2 bg-white hover:bg-indigo-50/80 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between text-slate-800 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Étudiant (Ahmed Ben Salah)</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Mon Parcours</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="directeur@centre.tn"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
              <button
                type="button"
                onClick={onGoToForgotPassword}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          Votre centre n'a pas encore de compte ?{' '}
          <button
            onClick={onGoToRegister}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Créer un compte centre
          </button>
        </div>
      </div>
    </div>
  );
};
