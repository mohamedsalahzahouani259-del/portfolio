// ====================================================================
// FACTURATN - SUPABASE INTEGRATION CLIENT
// Operates seamlessly in Local Multi-Tenant Mode or Cloud Supabase Mode
// ====================================================================

export const SUPABASE_CONFIG = {
  url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
  anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  isConfigured: Boolean(
    (import.meta as any).env?.VITE_SUPABASE_URL && 
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
  ),
};

export function getDatabaseStatus(): {
  mode: 'local' | 'supabase';
  label: string;
  description: string;
} {
  if (SUPABASE_CONFIG.isConfigured) {
    return {
      mode: 'supabase',
      label: 'Supabase Cloud Connecté',
      description: 'Vos données sont synchronisées en temps réel sur votre base PostgreSQL Supabase.',
    };
  }
  return {
    mode: 'local',
    label: 'Stockage Local Sécurisé',
    description: 'Mode autonome actif avec persistance dans le navigateur et isolation multi-entreprises.',
  };
}
