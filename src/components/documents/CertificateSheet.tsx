import React from 'react';
import { Certificate, Student, Formation, Organization } from '../../types';
import { formatDateLong } from '../../lib/formatters';
import { Award } from 'lucide-react';

interface CertificateSheetProps {
  certificate: Certificate;
  student?: Student;
  formation?: Formation;
  organization: Organization;
}

export const CertificateSheet: React.FC<CertificateSheetProps> = ({
  certificate,
  student,
  formation,
  organization,
}) => {
  return (
    <div className="bg-white p-12 max-w-3xl mx-auto rounded-2xl shadow-lg border-8 border-double border-amber-800/30 text-slate-800 font-serif print:p-0 print:border-8 print:shadow-none text-center relative overflow-hidden">
      {/* Ornamental Background Accents */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-50 rounded-full blur-2xl pointer-events-none" />

      {/* Center Header */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 font-sans">
          {organization?.name || 'Institut de Formation'}
        </h2>
        {organization?.taxId && (
          <p className="text-[11px] text-slate-500 font-sans uppercase tracking-wider mt-0.5">
            Établissement Agréé • Réf: {organization.taxId}
          </p>
        )}
      </div>

      {/* Certificate Title */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-900 tracking-wide mb-2 italic">
          Certificat de Fin de Formation
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-sans">
          N° {certificate.certificateNumber}
        </p>
      </div>

      {/* Body Text */}
      <div className="space-y-4 my-8 font-sans max-w-xl mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider">
          Il est certifié par la présente que
        </p>

        <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight font-serif">
          {student ? `${student.firstName} ${student.lastName}` : 'L’étudiant(e)'}
        </h3>

        {student?.cin && (
          <p className="text-xs text-slate-500">Titulaire de la CIN n° {student.cin}</p>
        )}

        <p className="text-sm text-slate-700 leading-relaxed pt-2">
          a suivi avec assiduité et validé l'ensemble des modules du programme de formation professionnelle en :
        </p>

        <h4 className="text-xl font-extrabold text-brand-900 tracking-tight py-2 border-y border-amber-200">
          {formation?.name || 'Programme Spécialisé'}
        </h4>

        <p className="text-xs text-slate-600">
          D'un volume horaire de <strong>{formation?.durationHours || 120} heures</strong> de travaux dirigés et pratiques.
        </p>

        <div className="inline-block bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 text-xs font-semibold text-amber-900 font-sans mt-2">
          Mention accordée par le jury : <strong>{certificate.mention}</strong>
        </div>
      </div>

      {/* Footer & Date */}
      <div className="flex justify-between items-end pt-12 mt-8 border-t border-slate-100 font-sans text-xs">
        <div className="text-left text-slate-500">
          <p>Délivré à {organization?.city || 'Tunis'},</p>
          <p>Le {formatDateLong(certificate.issueDate)}</p>
        </div>

        <div className="text-center w-52">
          <p className="font-bold text-slate-800 mb-8">
            Le Directeur de l'Établissement
          </p>
          <p className="text-xs italic text-slate-600 font-serif">
            {organization?.directorName || 'La Direction'}
          </p>
          <div className="w-24 border-b border-slate-300 mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
};
