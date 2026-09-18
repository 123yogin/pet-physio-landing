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

        {/* No portrait here.

            This modal only ever opens from the clinician card, which shows the
            portrait directly above it at full size. Repeating it as a 112px
            thumbnail a second later adds nothing and pushes the bio -- the
            thing the visitor actually clicked for -- further down. With the
            placeholder in place it was worse still: "Portrait to come" read
            twice within two seconds looks like a fault, not a pending photo.

            SpecialistPage keeps its portrait, and should: that route is
            reachable directly from a link or a search result, so there the
            photograph is the visitor's first sight of the clinician. */}
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-medium mb-1">
            {specialist.name}
          </h2>
          {specialist.role && (
            <p className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2">
              {specialist.role}
            </p>
          )}
          {(specialist.credentialsShort || specialist.credentials) && (
            <p className="text-xs text-[#504440] italic mb-3">
              {specialist.credentialsShort || specialist.credentials}
            </p>
          )}
          {/* "0+ Years Specialty Care" is worse than saying nothing -- it
              reads as a claim the clinic never made. experienceYears is 0
              because no source states it, not because she is newly qualified. */}
          {specialist.experienceYears > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8f3ed] border border-[#d4c3bd]/40 text-xs text-[#3C2117] font-medium">
              <Award className="w-3.5 h-3.5 text-[#84523e]" />
              <span>{specialist.experienceYears}+ Years Specialty Care</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {specialist.bio && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-2">
                Background & Biography
              </h3>
              <p className="text-sm text-[#504440] font-light leading-relaxed">{specialist.bio}</p>
            </div>
          )}

          {specialist.specialties.length > 0 && (
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
          )}

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
