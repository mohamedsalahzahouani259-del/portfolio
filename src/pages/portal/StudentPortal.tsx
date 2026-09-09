import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Award,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, formatDateLong } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PaymentReceiptSheet } from '../../components/documents/PaymentReceiptSheet';
import { GradeReportSheet } from '../../components/documents/GradeReportSheet';
import { CertificateSheet } from '../../components/documents/CertificateSheet';

export const StudentPortal: React.FC = () => {
  const { user, organization } = useAuth();
  const {
    students,
    enrollments,
    formations,
    groups,
    sessions,
    attendance,
    payments,
    grades,
    evaluations,
    certificates,
  } = useData();

  // Find the student linked to current user
  // Default to first student (e.g. Amina Trabelsi) if linkedStudentId is set or demo
  const student = students.find((s) => s.id === user?.linkedStudentId) || students[0];

  // Modals for documents
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  if (!student) {
    return (
      <div className="p-12 text-center text-slate-500">
        <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p>Profil étudiant introuvable.</p>
      </div>
    );
  }

  // Student enrollments
  const studentEnrollments = enrollments.filter((e) => e.studentId === student.id);
  const primaryEnrollment = studentEnrollments[0];
  const formation = formations.find((f) => f.id === primaryEnrollment?.formationId);
  const group = groups.find((g) => g.id === primaryEnrollment?.groupId);

  // Attendance
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 100;

  // Payments
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const totalTuition = primaryEnrollment?.agreedPrice || formation?.price || 0;
  const totalPaid = studentPayments.filter((p) => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const remainingTuition = Math.max(0, totalTuition - totalPaid);

  // Grades
  const studentGrades = grades.filter((g) => g.studentId === student.id);

  // Certificates
  const studentCertificates = certificates.filter((c) => c.studentId === student.id);

  // Upcoming sessions for this student's group
  const upcomingSessions = sessions
    .filter((s) => s.groupId === group?.id && s.status === 'scheduled')
    .slice(0, 3);

  const selectedPayment = studentPayments.find((p) => p.id === selectedPaymentId);
  const selectedCert = studentCertificates.find((c) => c.id === selectedCertId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Student Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-900/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold border border-indigo-500/30">
              Matricule : {student.studentNumber}
            </span>
            <span className="text-slate-400 text-xs">• Espace Étudiant Sécurisé</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bienvenue, {student.firstName} {student.lastName} 🎓
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Cursus actif : <span className="font-semibold text-white">{formation?.name}</span> (Groupe {group?.code}) • {organization?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            onClick={() => setIsTranscriptOpen(true)}
            icon={Printer}
          >
            Mon Bulletin
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Assiduité personnelle</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{attendanceRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{presentCount} séances suivies</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Frais de scolarité</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{formatCurrency(totalTuition)}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">{formatCurrency(totalPaid)} déjà réglés</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Solde restant</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">{formatCurrency(remainingTuition)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {remainingTuition === 0 ? 'Formation soldée' : 'Paiement en cours'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Certificats obtenus</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{studentCertificates.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Prêts pour téléchargement</p>
        </div>
      </div>

      {/* 3. Upcoming Classes & Personal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mon Emploi du Temps */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Mes Prochains Cours (Groupe {group?.code})</span>
            </h3>
            <span className="text-xs text-slate-400">{upcomingSessions.length} séance(s)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingSessions.length === 0 ? (
              <p className="p-8 text-center text-slate-400 text-xs">
                Aucun cours planifié pour le moment.
              </p>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                      <span className="text-xs font-bold font-mono">{session.startTime}</span>
                      <span className="text-[10px] text-indigo-500 font-mono">{session.endTime}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{session.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(session.date)} • Salle : {session.classroomName || 'Lab'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Confirmé
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Mes Reçus de Paiement */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Mes Reçus Officiels</span>
          </h3>

          <div className="space-y-2">
            {studentPayments.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-4">Aucun reçu disponible</p>
            ) : (
              studentPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800 font-mono">{p.receiptNumber}</p>
                    <p className="text-[11px] text-slate-500">{formatDate(p.paymentDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-emerald-600">{formatCurrency(p.amount)}</p>
                    <button
                      onClick={() => setSelectedPaymentId(p.id)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline mt-0.5"
                    >
                      Imprimer A4
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Mes Certificats & Attestations */}
      {studentCertificates.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Mes Certificats Officiels Délivrés</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {cert.certificateNumber}
                  </span>
                  <p className="font-bold text-sm text-slate-800 mt-1">{formation?.name}</p>
                  <p className="text-xs text-amber-700 font-medium">Mention : {cert.mention}</p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedCertId(cert.id)}
                  icon={Printer}
                >
                  Imprimer
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINT RECEIPT MODAL */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(selectedPaymentId)}
          onClose={() => setSelectedPaymentId(null)}
          title={`Reçu de paiement ${selectedPayment.receiptNumber || ''}`}
          size="lg"
        >
          <PaymentReceiptSheet
            payment={selectedPayment}
            student={student}
            organization={organization!}
            formationName={formation?.name || 'Formation certifiante'}
            groupCode={group?.code || 'DW-01'}
            remainingBalance={remainingTuition}
          />
        </Modal>
      )}

      {/* PRINT TRANSCRIPT MODAL */}
      {isTranscriptOpen && formation && (
        <Modal
          isOpen={isTranscriptOpen}
          onClose={() => setIsTranscriptOpen(false)}
          title="Mon Bulletin de notes officiel"
          size="lg"
        >
          <GradeReportSheet
            student={student}
            formation={formation}
            organization={organization!}
            evaluations={evaluations}
            grades={studentGrades}
          />
        </Modal>
      )}

      {/* PRINT CERTIFICATE MODAL */}
      {selectedCert && formation && (
        <Modal
          isOpen={Boolean(selectedCertId)}
          onClose={() => setSelectedCertId(null)}
          title="Mon Certificat de Réussite"
          size="xl"
        >
          <CertificateSheet
            certificate={selectedCert}
            student={student}
            formation={formation}
            organization={organization!}
          />
        </Modal>
      )}
    </div>
  );
};
