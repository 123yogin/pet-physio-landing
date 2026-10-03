import React from 'react';
import { AppointmentData } from '../types';
import { Check, Copy, X } from 'lucide-react';

interface BookingSuccessModalProps {
  data: AppointmentData | null;
  refId: string | null;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  data,
  refId,
  onClose,
}) => {
  if (!data || !refId) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(refId);
    alert('Reference ID copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-(--c-bg) border border-(--c-line) max-w-lg w-full p-6 sm:p-8 shadow-2xl relative font-(family-name:--f-body) text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-(--c-ink) hover:bg-(--c-surface-2) transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-(--c-ink) text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <Check className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest text-(--c-accent) font-semibold block mb-2">
          Request Received
        </span>

        <h2 className="font-(family-name:--f-display) text-2xl sm:text-3xl text-(--c-ink) font-medium mb-3">
          Appointment Request Confirmed
        </h2>

        <p className="text-sm text-(--c-body) font-light leading-relaxed mb-6">
          Thank you, <strong className="text-(--c-ink)">{data.firstName}</strong>. Our clinical intake coordinator will review <strong className="text-(--c-ink)">{data.petName}</strong>'s medical details and call you back within 4 business hours to confirm your time slot.
        </p>

        <div className="bg-(--c-surface) p-5 border border-(--c-line)/50 text-left space-y-3 mb-6 text-xs text-(--c-body)">
          <div className="flex justify-between items-center border-b border-(--c-line)/30 pb-2">
            <span className="font-semibold text-(--c-ink)">Reference ID:</span>
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1 text-(--c-accent) font-mono font-bold hover:underline cursor-pointer"
            >
              <span>{refId}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-between border-b border-(--c-line)/30 pb-2">
            <span>Patient:</span>
            <span className="font-medium text-(--c-ink)">{data.petName} ({data.speciesBreed || 'Pet'})</span>
          </div>

          <div className="flex justify-between border-b border-(--c-line)/30 pb-2">
            <span>Specialist:</span>
            <span className="font-medium text-(--c-ink)">{data.preferredSpecialist || 'First Available Specialist'}</span>
          </div>

          <div className="flex justify-between">
            <span>Contact Email:</span>
            <span className="font-medium text-(--c-ink)">{data.email}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full bg-(--c-ink) text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-(--c-body) transition-colors cursor-pointer"
          >
            Done & Return To Main Site
          </button>
        </div>
      </div>
    </div>
  );
};
