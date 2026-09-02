import React from 'react';
import { AppointmentData } from '../types';
import { Check, Calendar, PhoneCall, Copy, X } from 'lucide-react';

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
      <div className="bg-[#fef9f2] border border-[#d4c3bd] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative font-['Inter'] text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-[#3C2117] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <Check className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold block mb-2">
          Request Received
        </span>

        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-medium mb-3">
          Appointment Request Confirmed
        </h2>

        <p className="text-sm text-[#504440] font-light leading-relaxed mb-6">
          Thank you, <strong className="text-[#3C2117]">{data.firstName}</strong>. Our clinical intake coordinator will review <strong className="text-[#3C2117]">{data.petName}</strong>'s medical details and call you back within 4 business hours to confirm your time slot.
        </p>

        <div className="bg-[#f8f3ed] p-5 border border-[#d4c3bd]/50 text-left space-y-3 mb-6 text-xs text-[#504440]">
          <div className="flex justify-between items-center border-b border-[#d4c3bd]/30 pb-2">
            <span className="font-semibold text-[#3C2117]">Reference ID:</span>
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1 text-[#84523e] font-mono font-bold hover:underline cursor-pointer"
            >
              <span>{refId}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-between border-b border-[#d4c3bd]/30 pb-2">
            <span>Patient:</span>
            <span className="font-medium text-[#3C2117]">{data.petName} ({data.speciesBreed || 'Pet'})</span>
          </div>

          <div className="flex justify-between border-b border-[#d4c3bd]/30 pb-2">
            <span>Specialist:</span>
            <span className="font-medium text-[#3C2117]">{data.preferredSpecialist || 'First Available Specialist'}</span>
          </div>

          <div className="flex justify-between">
            <span>Contact Email:</span>
            <span className="font-medium text-[#3C2117]">{data.email}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full bg-[#3C2117] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-colors cursor-pointer"
          >
            Done & Return To Main Site
          </button>
        </div>
      </div>
    </div>
  );
};
