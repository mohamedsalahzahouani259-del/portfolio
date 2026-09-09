import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, GraduationCap } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SchoolFlow TN Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
          <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>SchoolFlow</span>
                  <span className="text-[11px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    TN
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Système de récupération automatique</p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-rose-200">
                  Une erreur inattendue est survenue lors du chargement.
                </p>
                <p className="text-rose-300/80">
                  {this.state.error?.message || 'Erreur d’affichage React inconnue.'}
                </p>
              </div>
            </div>

            {/* Error Details (Collapsible) */}
            {this.state.error && (
              <details className="text-[11px] bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-400 font-mono overflow-auto max-h-36">
                <summary className="cursor-pointer text-slate-300 font-semibold mb-1 select-none">
                  Détails techniques (pile d'exécution)
                </summary>
                <p className="whitespace-pre-wrap text-rose-300">{this.state.error.stack}</p>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Réinitialiser les données locales & Ouvrir l'application</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recharger la page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
