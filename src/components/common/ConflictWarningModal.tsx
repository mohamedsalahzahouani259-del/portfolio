import React from 'react';
import { AlertTriangle, Clock, DoorClosed, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ScheduleConflict } from '../../types';

interface ConflictWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway: () => void;
  conflicts: ScheduleConflict[];
}

export const ConflictWarningModal: React.FC<ConflictWarningModalProps> = ({
  isOpen,
  onClose,
  onProceedAnyway,
  conflicts,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conflit de planning détecté"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Attention : chevauchement de créneau</p>
            <p className="text-xs text-amber-700 mt-1">
              Cette séance entre en conflit avec une ou plusieurs réservations existantes.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {conflicts.map((conflict, idx) => (
            <div
              key={idx}
              className="p-3 border border-rose-200 bg-rose-50/50 rounded-lg text-sm text-slate-800"
            >
              <div className="flex items-center gap-2 text-rose-700 font-medium mb-1">
                {conflict.type === 'trainer_double_booked' ? (
                  <>
                    <User className="w-4 h-4" />
                    <span>Formateur déjà occupé</span>
                  </>
                ) : (
                  <>
                    <DoorClosed className="w-4 h-4" />
                    <span>Salle déjà occupée</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600">{conflict.message}</p>
              {conflict.conflictingSession && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 bg-white/70 px-2 py-1 rounded border border-rose-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Séance en cours : {conflict.conflictingSession.title} ({conflict.conflictingSession.startTime} - {conflict.conflictingSession.endTime})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Modifier le créneau
          </Button>
          <Button variant="danger" onClick={onProceedAnyway}>
            Forcer l'enregistrement
          </Button>
        </div>
      </div>
    </Modal>
  );
};
