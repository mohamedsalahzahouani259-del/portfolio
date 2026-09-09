import React from 'react';
import { Payment, Student, Formation, Organization, Enrollment } from '../../types';
import { formatCurrency, formatDateLong, formatDate, PAYMENT_METHOD_LABELS } from '../../lib/formatters';

interface PaymentReceiptSheetProps {
  payment: Payment;
  student?: Student;
  formation?: Formation;
  formationName?: string;
  enrollment?: Enrollment;
  groupCode?: string;
  remainingBalance?: number;
  organization: Organization;
}

export const PaymentReceiptSheet: React.FC<PaymentReceiptSheetProps> = ({
  payment,
  student,
  formation,
  formationName,
  enrollment,
  groupCode,
  remainingBalance,
  organization,
}) => {
  const remaining =
    remainingBalance !== undefined
      ? remainingBalance
      : enrollment
      ? Math.max(0, (enrollment.agreedPrice || enrollment.totalTuition) - enrollment.paidAmount)
      : 0;

  const displayFormation = formationName || formation?.name || 'Programme de Formation Professionnelle';

  return (
    <div className="bg-white p-8 sm:p-12 max-w-2xl mx-auto rounded-xl shadow-xs border border-slate-200 text-slate-800 font-sans print:p-0 print:border-0 print:shadow-none text-xs sm:text-sm">
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
        <div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-2">
            SF
          </div>
          <h2 className="text-base font-bold text-slate-900">{organization?.name || 'Institut de Formation'}</h2>
          {organization?.legalName && (
            <p className="text-slate-500 text-xs">{organization.legalName}</p>
          )}
          <p className="text-slate-500 text-xs mt-1">{organization?.address}, {organization?.city}</p>
          <p className="text-slate-500 text-xs">Tél : {organization?.phone} • {organization?.email}</p>
          {organization?.taxId && (
            <p className="text-slate-700 text-xs font-semibold mt-1">
              Agrément / MF : {organization.taxId}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded bg-indigo-50 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            Reçu de Paiement
          </span>
          <h1 className="text-xl font-mono font-bold text-slate-900">
            {payment.receiptNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Date : <span className="font-semibold text-slate-800">{formatDate(payment.paymentDate)}</span>
          </p>
        </div>
      </div>

      {/* Student & Course Box */}
      <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
            Reçu de l'apprenant(e)
          </span>
          <p className="font-bold text-slate-900 text-sm">
            {student ? `${student.firstName} ${student.lastName}` : payment.studentName || 'Étudiant'}
          </p>
          {student?.studentNumber && (
            <p className="text-xs text-slate-600 font-mono">Matricule : {student.studentNumber}</p>
          )}
          {student?.cin && (
            <p className="text-xs text-slate-600">CIN : {student.cin}</p>
          )}
          {student?.phone && (
            <p className="text-xs text-slate-600">Tél : {student.phone}</p>
          )}
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
            Formation & Cursus
          </span>
          <p className="font-semibold text-slate-900 text-xs">
            {displayFormation}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Promotion : Groupe {groupCode || 'Promotion active'}
          </p>
          <p className="text-xs text-slate-600">
            Année académique : {organization?.currentAcademicYear || '2026–2027'}
          </p>
        </div>
      </div>

      {/* Payment details table */}
      <table className="w-full my-6 border border-slate-200 rounded-lg overflow-hidden text-left">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs">
          <tr>
            <th className="p-3">Désignation</th>
            <th className="p-3">Mode de versement</th>
            <th className="p-3 text-right">Montant Encaissé</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="p-3">
              <p className="font-medium text-slate-900">
                Frais d'inscription & scolarité
              </p>
              {payment.notes && (
                <p className="text-xs text-slate-500 mt-0.5">{payment.notes}</p>
              )}
            </td>
            <td className="p-3 capitalize font-medium text-slate-700">
              {PAYMENT_METHOD_LABELS[payment.method] || payment.method}
            </td>
            <td className="p-3 text-right font-mono font-bold text-base text-slate-900">
              {formatCurrency(payment.amount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Financial Summary & Balances */}
      <div className="flex justify-between items-start my-6">
        <div className="text-xs text-slate-500 max-w-xs">
          {organization?.bankRib && (
            <p>
              <span className="font-semibold text-slate-700">RIB Établissement :</span>{' '}
              <span className="font-mono">{organization.bankRib}</span>
            </p>
          )}
          <p className="mt-1">
            Ce reçu certifie le bon encaissement de la somme indiquée ci-dessus. Document valable pour toute démarche administrative.
          </p>
        </div>

        <div className="w-64 space-y-1.5 border-t border-slate-200 pt-2 text-right">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Montant ce versement :</span>
            <span className="font-mono font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Reste à régler :</span>
            <span className="font-mono font-semibold text-amber-700">
              {formatCurrency(remaining)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-300 pt-1.5 mt-1.5">
            <span>Statut :</span>
            <span className="text-emerald-600 font-semibold uppercase text-xs">
              Encaissé
            </span>
          </div>
        </div>
      </div>

      {/* Signatures & Stamp */}
      <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
        <div>
          <p className="font-semibold text-slate-800">L'Apprenant(e) / Tuteur</p>
          <div className="h-16 mt-2 border-b border-dashed border-slate-300" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Cachet & Signature de la Direction</p>
          <div className="h-16 mt-2 border-b border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400 italic">
            [Visa & Cachet Officiel]
          </div>
        </div>
      </div>
    </div>
  );
};
