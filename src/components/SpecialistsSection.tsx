import React from 'react';
import { SPECIALISTS } from '../data/clinicData';
import { Specialist } from '../types';
import { Award, Calendar } from 'lucide-react';
import { EntityCardLink } from './EntityCardLink';
import { specialistPath } from '../seo/routes';

interface SpecialistsSectionProps {
  onSelectSpecialist: (specialist: Specialist) => void;
  onOpenBookingWithSpecialist: (specialistName: string) => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
  onSelectSpecialist,
  onOpenBookingWithSpecialist,
}) => {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#f8f3ed]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Veterinary Leadership
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light mb-4">
            Meet Our Specialists
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light">
            Compassionate, board-certified clinicians combining advanced veterinary science with gentle hands-on rehabilitation.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
          {SPECIALISTS.map((spec) => (
            <div
              key={spec.id}
              className="text-left group bg-[#ffffff] p-6 border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="overflow-hidden mb-6 aspect-[3/4] bg-[#e6e2dc] relative">
                  <img
                    src={spec.imageUrl}
                    alt={spec.altText}
                    width={600}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#3C2117] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                    {spec.experienceYears}+ Yrs Clinical Practice
                  </div>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] mb-1 font-medium">
                  {spec.name}
                </h3>

                <p className="font-['Inter'] text-xs text-[#84523e] mb-2 tracking-widest uppercase font-semibold">
                  {spec.role}
                </p>

                <p className="font-['Inter'] text-xs text-[#504440] mb-4 italic border-b border-[#d4c3bd]/20 pb-3">
                  {spec.credentials}
                </p>

                <p className="font-['Inter'] text-sm text-[#504440] font-light leading-relaxed mb-6">
                  {spec.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d4c3bd]/20 flex flex-col gap-2">
                <EntityCardLink
                  href={specialistPath(spec.id)}
                  onActivate={() => onSelectSpecialist(spec)}
                  className="w-full py-2 bg-[#f2ede7] hover:bg-[#e6e2dc] text-[#3C2117] font-['Inter'] text-xs uppercase tracking-widest font-medium border border-[#d4c3bd]/50 cursor-pointer text-center block"
                >
                  View Full Bio & Credentials
                </EntityCardLink>

                <button
                  onClick={() => onOpenBookingWithSpecialist(spec.name)}
                  className="w-full py-2 bg-[#3C2117] text-white hover:bg-[#504440] font-['Inter'] text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Request Consult</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
