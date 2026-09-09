import React from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SchoolFlow</span>
              <span className="font-extrabold text-xl text-indigo-600 ml-1">TN</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#portals" className="hover:text-indigo-600 transition-colors">
              Portails Dédiés
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">
              Tarifs (DT)
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Connexion
            </button>
            <Button onClick={onExploreDemo} size="sm">
              Explorer la Démo
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-radial from-indigo-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-8 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>La plateforme n°1 de gestion des centres de formation en Tunisie 🇹🇳</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Gérez votre centre de formation.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
              Simplifiez votre quotidien.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Inscriptions, emplois du temps sans conflits, émargement digital, suivi des paiements en Dinars Tunisiens (DT) et certificats officiels. Tout en un seul logiciel.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onExploreDemo} size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-600/20 text-sm">
              <span>Tester la Démo Immédiatement</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={onGoToRegister} variant="secondary" size="lg" className="w-full sm:w-auto text-sm">
              Créer un Compte Centre
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Agrément & Matricule fiscal tunisien
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Reçus A4 avec cachet & solde restant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Multi-rôles : Direction, Formateur, Étudiant
            </span>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Fonctionnalités Clés
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tout ce dont votre établissement a besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">CRM & Dossier Étudiant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Suivi complet : CIN tunisienne, coordonnées, historique des formations, fiches d'assiduité et situation financière en temps réel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Emploi du Temps Intelligent</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Détection automatique des conflits de réservation (double booking formateur ou salle) pour éviter les chevauchements de plannings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Feuille d'Émargement Digitale</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Faites l'appel en 1 clic : "Tout marquer présent", signalement des retards, justificatifs d'absence et calcul automatique du taux d'assiduité.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Paiements & Reçus A4 (DT)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Échéanciers multi-tranches, encaissement (espèces, virement, chèque), alertes retards et impression de reçus officiels avec RIB.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Certificats & Bulletins Officiels</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Édition de certificats de fin de formation personnalisés et bulletins de notes sur 20 avec moyennes pondérées et mentions du jury.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">SchoolFlow AI Connecté</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interrogez votre centre en langage naturel pour savoir qui a trop d'absences, combien reste à encaisser ou quel cours est le plus rentable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing in DT */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Tarification Transparente
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Des forfaits adaptés aux centres tunisiens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Formule Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Pour formateurs indépendants & petits ateliers</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono">
                  89 DT <span className="text-xs font-normal text-slate-500">/ mois</span>
                </p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Jusqu'à 50 étudiants actifs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> 3 promotions en simultané
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Émargement & Reçus A4
                  </li>
                </ul>
              </div>
              <Button onClick={onGoToRegister} variant="secondary" className="w-full">
                Choisir Starter
              </Button>
            </div>

            {/* Plan 2: Recommended */}
            <div className="p-8 bg-indigo-900 text-white rounded-2xl border-2 border-indigo-600 shadow-xl flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-sky-400 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                Recommandé
              </span>
              <div>
                <h3 className="font-bold text-lg text-white">Formule Pro Centre</h3>
                <p className="text-xs text-indigo-200 mt-1">Pour académies et centres de formation agréés</p>
                <p className="text-3xl font-extrabold text-white mt-4 font-mono">
                  169 DT <span className="text-xs font-normal text-indigo-300">/ mois</span>
                </p>
                <ul className="mt-6 space-y-3 text-xs text-indigo-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> Étudiants illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> Planning anti-conflits & Salles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> Certificats officiels & Bulletins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> Assistant SchoolFlow AI inclus
                  </li>
                </ul>
              </div>
              <Button onClick={onExploreDemo} variant="primary" className="w-full bg-indigo-500 hover:bg-indigo-400">
                Explorer avec ce forfait
              </Button>
            </div>

            {/* Plan 3 */}
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Formule Institut</h3>
                <p className="text-xs text-slate-500 mt-1">Pour réseaux d'écoles et multi-centres</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono">
                  299 DT <span className="text-xs font-normal text-slate-500">/ mois</span>
                </p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Multi-établissements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Portails Étudiant & Formateur
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Support dédié 7j/7 & formation
                  </li>
                </ul>
              </div>
              <Button onClick={onGoToRegister} variant="secondary" className="w-full">
                Contacter l'équipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-sm">SchoolFlow TN</span>
            <span>— La référence des logiciels de formation en Tunisie</span>
          </div>

          <p>© 2026–2027 SchoolFlow TN. Fait avec passion pour l'éducation et la formation professionnelle.</p>
        </div>
      </footer>
    </div>
  );
};
