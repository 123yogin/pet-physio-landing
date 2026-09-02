import React from 'react';
import { Specialist } from '../types';
import { X, Award, CheckCircle2, Calendar } from 'lucide-react';

interface SpecialistDetailModalProps {
  specialist: Specialist | null;
  onClose: () => void;
  onBookWithSpecialist: (name: string) => void;
}

export const SpecialistDetailModal: React.FC<SpecialistDetailModalProps> = ({
  specialist,
  onClose,
  onBookWithSpecialist,
}) => {
  if (!specialist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fef9f2] border border-[#d4c3bd] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative font-['Inter']">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block">
          Clinician Profile
        </span>

        <div className="flex flex-col sm:flex-row gap-6 mb-6 items-start">
          <img
            src={specialist.imageUrl}
            alt={specialist.altText}
            className="w-28 h-36 object-cover border border-[#d4c3bd]/50 shrink-0"
          />
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-medium mb-1">
              {specialist.name}
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2">
              {specialist.role}
            </p>
            <p className="text-xs text-[#504440] italic mb-3">
              {specialist.credentials}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8f3ed] border border-[#d4c3bd]/40 text-xs text-[#3C2117] font-medium">
              <Award className="w-3.5 h-3.5 text-[#84523e]" />
              <span>{specialist.experienceYears}+ Years Specialty Care</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-2">
              Background & Biography
            </h3>
            <p className="text-sm text-[#504440] font-light leading-relaxed">
              {specialist.bio}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
              Specialized Clinical Focus
            </h3>
            <div className="space-y-2">
              {specialist.specialties.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#504440]">
                  <CheckCircle2 className="w-4 h-4 text-[#84523e]" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#d4c3bd]/40 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onBookWithSpecialist(specialist.name);
              }}
              className="w-full bg-[#3C2117] text-white py-3 px-6 text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Request Consultation With {specialist.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
