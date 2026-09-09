import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la connexion</span>
        </button>

        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Instructions envoyées</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Si un compte est associé à <span className="font-semibold text-slate-800">{email}</span>,
              vous recevrez un lien de réinitialisation sous quelques instants.
            </p>
            <Button onClick={onBackToLogin} className="w-full">
              Retourner à la page de connexion
            </Button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Saisissez l'adresse email liée à votre compte pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.tn"
                required
              />

              <Button type="submit" isLoading={isLoading} className="w-full">
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
