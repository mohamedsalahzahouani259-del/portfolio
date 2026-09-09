import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ClipboardCheck,
  Award,
  FileCheck2,
  Printer,
  Plus,
} from 'lucide-react';
import { Student } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate, formatDateLong } from '../../lib/formatters';
import { PaymentReceiptSheet } from '../../components/documents/PaymentReceiptSheet';
import { GradeReportSheet } from '../../components/documents/GradeReportSheet';
import { CertificateSheet } from '../../components/documents/CertificateSheet';
import { Modal } from '../../components/ui/Modal';

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onRecordPayment: (studentId: string, enrollmentId: string) => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({
  studentId,
  onBack,
  onEdit,
  onDelete,
  onRecordPayment,
}) => {
  const { organization } = useAuth();
  const {
    students,
    enrollments,
    formations,
    groups,
    attendance,
    sessions,
    payments,
    grades,
    evaluations,
    certificates,
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'payments' | 'grades' | 'certificates'>('overview');

  // Printable Document Modals
  const [printReceiptId, setPrintReceiptId] = useState<string | null>(null);
  const [isPrintTranscriptOpen, setIsPrintTranscriptOpen] = useState(false);
  const [printCertificateId, setPrintCertificateId] = useState<string | null>(null);

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Étudiant introuvable ou supprimé.</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Related data
  const studentEnrollments = enrollments.filter((e) => e.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentCertificates = certificates.filter((c) => c.studentId === student.id);

  // Financial summary
  const totalTuition = studentEnrollments.reduce((acc, e) => acc + (e.agreedPrice || e.totalTuition || 0), 0);
  const totalPaid = studentPayments.filter((p) => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const remainingTuition = Math.max(0, totalTuition - totalPaid);

  // Attendance summary
  const totalAttSessions = studentAttendance.length;
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = totalAttSessions > 0 ? Math.round((presentCount / totalAttSessions) * 100) : 100;

  // Selected payment for printing
  const selectedPayment = studentPayments.find((p) => p.id === printReceiptId);
  const selectedEnrollment = studentEnrollments.find((e) => e.id === selectedPayment?.enrollmentId) || studentEnrollments[0];
  const selectedFormation = formations.find((f) => f.id === selectedEnrollment?.formationId);

  // Selected certificate for printing
  const selectedCert = studentCertificates.find((c) => c.id === printCertificateId);
  const certFormation = formations.find((f) => f.id === selectedCert?.formationId);

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} icon={ArrowLeft}>
            Retour
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                {student.firstName} {student.lastName}
              </h1>
              <StatusBadge status={student.status} type="student" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matricule : <span className="font-mono font-bold text-slate-700">{student.studentNumber}</span>
              {student.cin && ` • CIN : ${student.cin}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPrintTranscriptOpen(true)}
            icon={Printer}
          >
            Bulletin de notes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(student)}
            icon={Edit2}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
                onDelete(student.id);
                onBack();
              }
            }}
            icon={Trash2}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Taux d'assiduité</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{attendanceRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {presentCount} présences sur {totalAttSessions} séances
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Frais de formation</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{formatCurrency(totalTuition)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {studentEnrollments.length} formation{studentEnrollments.length > 1 ? 's' : ''} suivie{studentEnrollments.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Montant Encaissé</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{formatCurrency(totalPaid)}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            {studentPayments.length} règlement{studentPayments.length > 1 ? 's' : ''} validé{studentPayments.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Reste à payer</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">{formatCurrency(remainingTuition)}</p>
          <p className="text-[11px] text-amber-600 mt-0.5">
            {remainingTuition === 0 ? 'Solde réglé à 100%' : 'En attente de règlement'}
          </p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Vue Générale', icon: Calendar },
            { id: 'attendance', label: 'Présences', icon: ClipboardCheck },
            { id: 'payments', label: 'Paiements & Reçus', icon: CreditCard },
            { id: 'grades', label: 'Notes & Bulletins', icon: FileCheck2 },
            { id: 'certificates', label: 'Certificats', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-xs flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Tab Content */}
      <div className="space-y-6">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact & Personal Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Coordonnées & Informations
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-medium text-slate-800">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{student.phone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {student.address ? `${student.address}, ` : ''}
                    {student.city}, {student.governorate}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Né(e) le {formatDate(student.dateOfBirth)}</span>
                </div>
              </div>

              {student.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Notes internes
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    {student.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Inscriptions & Cohorts */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Formations & Promotions Suivies</span>
                <span className="text-xs text-indigo-600 font-semibold">
                  {studentEnrollments.length} inscription(s)
                </span>
              </h3>

              <div className="space-y-3">
                {studentEnrollments.map((enr) => {
                  const formation = formations.find((f) => f.id === enr.formationId);
                  const group = groups.find((g) => g.id === enr.groupId);
                  return (
                    <div
                      key={enr.id}
                      className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-800">
                          {formation?.name || 'Formation'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Groupe {group?.code || 'Non assigné'} • Inscrit le {formatDate(enr.enrollmentDate)}
                        </p>
                        <p className="text-xs text-indigo-600 font-medium mt-1">
                          Tarif convenu : {formatCurrency(enr.agreedPrice || enr.totalTuition)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={enr.status} type="enrollment" />
                        {remainingTuition > 0 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onRecordPayment(student.id, enr.id)}
                            icon={CreditCard}
                          >
                            Régler
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Registre des Présences</h3>
                <p className="text-xs text-slate-400 mt-0.5">Historique d'assiduité séance par séance</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Taux d'assiduité : {attendanceRate}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Séance / Module</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Remarque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        Aucun pointage de présence enregistré pour cet étudiant.
                      </td>
                    </tr>
                  ) : (
                    studentAttendance.map((att) => {
                      const session = sessions.find((s) => s.id === att.sessionId);
                      return (
                        <tr key={att.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {formatDate(session?.date)}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {session?.title || 'Séance'} ({session?.startTime} - {session?.endTime})
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={att.status} type="attendance" />
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {att.notes || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Paiements & Reçus Officiels</h3>
                <p className="text-xs text-slate-400 mt-0.5">Historique des versements et impressions de reçus A4</p>
              </div>
              {selectedEnrollment && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRecordPayment(student.id, selectedEnrollment.id)}
                  icon={Plus}
                >
                  Encaisser un versement
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">N° Reçu</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        Aucun paiement enregistré pour l'instant.
                      </td>
                    </tr>
                  ) : (
                    studentPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                          {pay.receiptNumber || 'REC-PROV'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(pay.paymentDate)}</td>
                        <td className="px-4 py-3 text-slate-700 capitalize">{pay.method}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">
                          {formatCurrency(pay.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pay.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {pay.status === 'paid' ? 'Encaissé' : 'En retard'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPrintReceiptId(pay.id)}
                            icon={Printer}
                          >
                            Imprimer reçu
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: GRADES */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Notes & Évaluations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Résultats aux examens et contrôles continus</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPrintTranscriptOpen(true)}
                icon={Printer}
              >
                Imprimer le bulletin officiel
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Évaluation</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Coeff.</th>
                    <th className="px-4 py-3">Note / 20</th>
                    <th className="px-4 py-3">Appréciation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        Aucune note attribuée pour l'instant.
                      </td>
                    </tr>
                  ) : (
                    studentGrades.map((g) => {
                      const evaluation = evaluations.find((ev) => ev.id === g.evaluationId);
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {evaluation?.title || 'Épreuve'}
                          </td>
                          <td className="px-4 py-3 text-slate-600 capitalize">
                            {evaluation?.type || 'Examen'}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatDate(evaluation?.date)}
                          </td>
                          <td className="px-4 py-3 font-mono">{evaluation?.coefficient || 1}</td>
                          <td className="px-4 py-3 font-bold font-mono text-indigo-700 text-sm">
                            {g.gradeValue.toFixed(2)} / 20
                          </td>
                          <td className="px-4 py-3 text-slate-500 italic">
                            {g.appreciation || 'Bon travail'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Certificats de Réussite & Attestations
            </h3>

            {studentCertificates.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-600">Aucun certificat délivré pour l'instant</p>
                <p className="text-xs mt-1 text-slate-400">
                  Délivrez un certificat de fin de formation depuis le module "Documents & Certificats".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studentCertificates.map((cert) => {
                  const form = formations.find((f) => f.id === cert.formationId);
                  return (
                    <div
                      key={cert.id}
                      className="p-5 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-200 rounded-2xl flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            {cert.certificateNumber}
                          </span>
                          <span className="text-xs font-bold text-amber-700">
                            Mention : {cert.mention || 'Très Bien'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{form?.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Délivré le {formatDateLong(cert.issueDate)}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setPrintCertificateId(cert.id)}
                        icon={Printer}
                      >
                        Visualiser / Imprimer le certificat
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRINT RECEIPT MODAL */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(printReceiptId)}
          onClose={() => setPrintReceiptId(null)}
          title={`Reçu de paiement ${selectedPayment.receiptNumber || ''}`}
          size="lg"
        >
          <PaymentReceiptSheet
            payment={selectedPayment}
            student={student}
            organization={organization!}
            formationName={selectedFormation?.name || 'Formation professionnelle'}
            groupCode="DW-01"
            remainingBalance={remainingTuition}
          />
        </Modal>
      )}

      {/* PRINT TRANSCRIPT MODAL */}
      {isPrintTranscriptOpen && (
        <Modal
          isOpen={isPrintTranscriptOpen}
          onClose={() => setIsPrintTranscriptOpen(false)}
          title="Bulletin de notes officiel"
          size="lg"
        >
          <GradeReportSheet
            student={student}
            formation={selectedFormation || formations[0]}
            organization={organization!}
            evaluations={evaluations}
            grades={studentGrades}
          />
        </Modal>
      )}

      {/* PRINT CERTIFICATE MODAL */}
      {selectedCert && (
        <Modal
          isOpen={Boolean(printCertificateId)}
          onClose={() => setPrintCertificateId(null)}
          title="Certificat Officiel de Fin de Formation"
          size="xl"
        >
          <CertificateSheet
            certificate={selectedCert}
            student={student}
            formation={certFormation || formations[0]}
            organization={organization!}
          />
        </Modal>
      )}
    </div>
  );
};
