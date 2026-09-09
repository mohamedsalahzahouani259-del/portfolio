import React, { useState } from 'react';
import {
  Award,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  FileText,
  Calendar,
} from 'lucide-react';
import { Certificate } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { formatDate, formatDateLong } from '../../lib/formatters';
import { CertificateSheet } from '../../components/documents/CertificateSheet';
import { toast } from '../../components/ui/Toast';

export const DocumentsPage: React.FC = () => {
  const { organization } = useAuth();
  const {
    certificates,
    students,
    formations,
    issueCertificate,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedFormationId, setSelectedFormationId] = useState(formations[0]?.id || '');
  const [selectedMention, setSelectedMention] = useState<Certificate['mention']>('Très Bien');

  // Print Certificate Modal
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = issueCertificate(selectedStudentId, selectedFormationId, selectedMention);
    setIsIssueModalOpen(false);
    toast.success(`Certificat ${cert.certificateNumber} délivré avec succès !`);
    setPreviewCertificate(cert);
  };

  const filteredCerts = certificates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const stu = students.find((s) => s.id === c.studentId);
    const form = formations.find((f) => f.id === c.formationId);
    return (
      c.certificateNumber.toLowerCase().includes(q) ||
      (stu && `${stu.firstName} ${stu.lastName}`.toLowerCase().includes(q)) ||
      (form && form.name.toLowerCase().includes(q))
    );
  });

  const previewStudent = students.find((s) => s.id === previewCertificate?.studentId);
  const previewFormation = formations.find((f) => f.id === previewCertificate?.formationId);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Documents & Certificats Officiels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Génération des attestations de fin de formation, certificats de réussite et mentions de jury
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsIssueModalOpen(true)}
          icon={Plus}
        >
          Délivrer un certificat
        </Button>
      </div>

      {/* 2. Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un certificat par numéro officiel (CERT-2026-...) ou nom d'étudiant..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 3. Certificates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Aucun certificat délivré</p>
            <p className="text-xs mt-1">Délivrez votre premier certificat officiel avec le bouton ci-dessus.</p>
          </div>
        ) : (
          filteredCerts.map((cert) => {
            const stu = students.find((s) => s.id === cert.studentId);
            const form = formations.find((f) => f.id === cert.formationId);

            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Certificate Number & Mention */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Mention {cert.mention || 'Bien'}
                    </span>
                  </div>

                  {/* Student & Formation */}
                  <div>
                    <h3 className="font-bold text-base text-slate-800">
                      {stu ? `${stu.firstName} ${stu.lastName}` : 'Apprenant'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Matricule : {stu?.studentNumber || '-'}
                    </p>
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-xs font-semibold text-slate-700">{form?.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Cursus professionnel ({form?.durationHours || 60} heures)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Délivré le {formatDateLong(cert.issueDate)}</span>
                  </div>
                </div>

                {/* Print button */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setPreviewCertificate(cert)}
                    icon={Printer}
                    className="w-full justify-center"
                  >
                    Imprimer / Télécharger A4
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ISSUE CERTIFICATE MODAL */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Délivrer un Certificat Officiel de Réussite"
        size="md"
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <Select
            label="Sélectionner l'étudiant lauréat"
            required
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={students.map((s) => ({
              value: s.id,
              label: `${s.firstName} ${s.lastName} (${s.studentNumber})`,
            }))}
          />

          <Select
            label="Formation achevée"
            required
            value={selectedFormationId}
            onChange={(e) => setSelectedFormationId(e.target.value)}
            options={formations.map((f) => ({
              value: f.id,
              label: `${f.name} (${f.durationHours}h)`,
            }))}
          />

          <Select
            label="Mention décernée par le jury"
            value={selectedMention}
            onChange={(e) => setSelectedMention(e.target.value as any)}
            options={[
              { value: 'Passable', label: 'Mention : Passable' },
              { value: 'Assez Bien', label: 'Mention : Assez Bien' },
              { value: 'Bien', label: 'Mention : Bien' },
              { value: 'Très Bien', label: 'Mention : Très Bien' },
              { value: 'Excellent avec Félicitations du Jury', label: 'Mention : Excellent avec Félicitations' },
            ]}
          />

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
            <p className="font-semibold">Document officiel sécurisé :</p>
            <p className="text-[11px] text-indigo-700">
              Le certificat comportera le visa de l'agrément ministériel du centre, la signature de la direction et un identifiant unique traçable.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsIssueModalOpen(false)} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Délivrer le certificat
            </Button>
          </div>
        </form>
      </Modal>

      {/* CERTIFICATE PREVIEW & PRINT MODAL */}
      {previewCertificate && previewStudent && previewFormation && (
        <Modal
          isOpen={Boolean(previewCertificate)}
          onClose={() => setPreviewCertificate(null)}
          title={`Certificat Officiel - ${previewCertificate.certificateNumber}`}
          size="xl"
        >
          <CertificateSheet
            certificate={previewCertificate}
            student={previewStudent}
            formation={previewFormation}
            organization={organization!}
          />
        </Modal>
      )}
    </div>
  );
};
