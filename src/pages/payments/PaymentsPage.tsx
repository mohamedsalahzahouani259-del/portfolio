import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Payment, PaymentMethod } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../../lib/formatters';
import { PaymentReceiptSheet } from '../../components/documents/PaymentReceiptSheet';
import { toast } from '../../components/ui/Toast';

interface PaymentsPageProps {
  initialStudentId?: string;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ initialStudentId }) => {
  const { organization } = useAuth();
  const {
    payments,
    students,
    enrollments,
    formations,
    recordPayment,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add Payment Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || (students[0]?.id || ''));
  const [paymentAmount, setPaymentAmount] = useState<number>(400);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Print Receipt Modal
  const [printReceiptPayment, setPrintReceiptPayment] = useState<Payment | null>(null);

  // Financial KPIs
  const totalCollected = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalBilled = enrollments.reduce((sum, e) => sum + (e.agreedPrice || e.totalTuition || 0), 0);
  const totalReceivables = Math.max(0, totalBilled - totalCollected);
  const overdueCount = payments.filter((p) => p.status === 'late').length;

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const student = students.find((s) => s.id === p.studentId);
    const matchesSearch =
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q)) ||
      (student && `${student.firstName} ${student.lastName}`.toLowerCase().includes(q));

    const matchesMethod = methodFilter ? p.method === methodFilter : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const studentEnrs = enrollments.filter((en) => en.studentId === selectedStudentId);
    const targetEnr = studentEnrs[0];

    if (!targetEnr) {
      alert("Cet étudiant n'a aucune inscription active.");
      return;
    }

    const newPayment = recordPayment(
      targetEnr.id,
      selectedStudentId,
      Number(paymentAmount),
      paymentMethod,
      paymentNotes
    );

    setIsAddModalOpen(false);
    toast.success(`Règlement de ${formatCurrency(paymentAmount)} enregistré !`);

    // Offer to print receipt immediately
    setPrintReceiptPayment(newPayment);
  };

  const receiptStudent = students.find((s) => s.id === printReceiptPayment?.studentId);
  const receiptEnrollment = enrollments.find((e) => e.id === printReceiptPayment?.enrollmentId);
  const receiptFormation = formations.find((f) => f.id === receiptEnrollment?.formationId);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Gestion des Règlements & Reçus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Suivi des encaissements en Dinars Tunisiens (DT), gestion des échéanciers et reçus A4
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
        >
          Encaisser un versement
        </Button>
      </div>

      {/* 2. Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Encaissé</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            {formatCurrency(totalCollected)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Recettes nettes enregistrées</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Facturé / Engagé</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {formatCurrency(totalBilled)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sur toutes les inscriptions</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Reste à Recouvrer</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">
            {formatCurrency(totalReceivables)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Échéances en cours d'attente</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Échéances en Retard</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{overdueCount}</p>
          <p className="text-[11px] text-rose-500 mt-0.5">Relances requises</p>
        </div>
      </div>

      {/* 3. Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un reçu (ex: REC-2026-0001) ou un étudiant..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-hidden"
        >
          <option value="">Tous les modes</option>
          <option value="cash">Espèces</option>
          <option value="bank_transfer">Virement</option>
          <option value="check">Chèque</option>
          <option value="card">Carte bancaire</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-hidden"
        >
          <option value="">Tous les statuts</option>
          <option value="paid">Encaissé</option>
          <option value="pending">En attente</option>
          <option value="late">En retard</option>
        </select>
      </div>

      {/* 4. Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">N° Reçu</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Mode de règlement</th>
                <th className="px-4 py-3">Montant Encaissé</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Reçu Officiel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">Aucun paiement trouvé</p>
                    <p className="text-xs mt-1">Enregistrez un encaissement pour voir le journal.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const stu = students.find((s) => s.id === p.studentId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {p.receiptNumber || 'REC-PROV'}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(p.paymentDate)}
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {stu ? `${stu.firstName} ${stu.lastName}` : 'Étudiant'}
                        </p>
                        {stu && <p className="text-[10px] text-slate-400">{stu.studentNumber}</p>}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {PAYMENT_METHOD_LABELS[p.method] || p.method}
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-emerald-600 text-sm">
                        {formatCurrency(p.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'late'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.status === 'paid' ? 'Encaissé' : p.status === 'late' ? 'En retard' : 'En attente'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPrintReceiptPayment(p)}
                          icon={Printer}
                        >
                          Imprimer reçu
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PAYMENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Encaisser un versement de frais d'études"
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Select
            label="Sélectionner l'étudiant"
            required
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={students.map((s) => ({
              value: s.id,
              label: `${s.firstName} ${s.lastName} (${s.studentNumber})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Montant encaissé (DT)"
              type="number"
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="400"
            />
            <Select
              label="Mode de paiement"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              options={[
                { value: 'cash', label: 'Espèces' },
                { value: 'bank_transfer', label: 'Virement bancaire' },
                { value: 'check', label: 'Chèque bancaire' },
                { value: 'card', label: 'Carte bancaire' },
              ]}
            />
          </div>

          <Input
            label="Commentaires / Référence bancaire"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            placeholder="ex: Versement 2ème tranche - Chèque N° 458712"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Valider & Générer le reçu
            </Button>
          </div>
        </form>
      </Modal>

      {/* PRINT RECEIPT MODAL */}
      {printReceiptPayment && receiptStudent && (
        <Modal
          isOpen={Boolean(printReceiptPayment)}
          onClose={() => setPrintReceiptPayment(null)}
          title={`Reçu de paiement ${printReceiptPayment.receiptNumber || ''}`}
          size="lg"
        >
          <PaymentReceiptSheet
            payment={printReceiptPayment}
            student={receiptStudent}
            organization={organization!}
            formationName={receiptFormation?.name || 'Formation certifiante'}
            groupCode="DW-01"
            remainingBalance={totalReceivables}
          />
        </Modal>
      )}
    </div>
  );
};
