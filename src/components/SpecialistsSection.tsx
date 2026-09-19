import React from 'react';
import { SPECIALISTS } from '../data/clinicData';
import { Award, Calendar } from 'lucide-react';
import { EntityCardLink } from './EntityCardLink';
import { specialistPath } from '../seo/routes';

interface SpecialistsSectionProps {
  onOpenBookingWithSpecialist: (specialistName: string) => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
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
            {SPECIALISTS.length === 1 ? 'Meet Your Clinician' : 'Meet Our Specialists'}
          </h2>
          {/* "board-certified clinicians", plural, described three people who
              were never here. Neither the plural nor the certification claim
              is something this site can currently substantiate. */}
          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light">
            Advanced veterinary science combined with gentle, hands-on rehabilitation.
          </p>
        </div>

        {/* Team Grid. Column count follows the real headcount — a fixed
            3-up grid left one clinician stranded beside two empty columns. */}
        <div
          className={`grid gap-12 sm:gap-16 ${
            SPECIALISTS.length === 1
              ? 'grid-cols-1 max-w-4xl mx-auto'
              : SPECIALISTS.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {SPECIALISTS.map((spec) => (
            <div
              key={spec.id}
              className={`text-left group bg-[#ffffff] p-6 border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-all ${
                SPECIALISTS.length === 1
                  ? 'sm:grid sm:grid-cols-[minmax(0,280px)_1fr] sm:gap-10 sm:items-center sm:p-8'
                  : 'flex flex-col justify-between'
              }`}
            >
              {/* Portrait cell — first grid column when there is one clinician.

                  This cell owns the portrait whether or not a photograph
                  exists, which is the point: the image must not live inside
                  the details block here, or the day a real photo arrives the
                  grid's first column becomes the text and the whole card
                  collapses to 280px.

                  Until then, the frame carries the brand mark and says plainly
                  that a portrait is coming. A stock face is not an option under
                  a named person — that invents a real individual's likeness,
                  which is worse than the generic stock used elsewhere.

                  max-w on the small breakpoint: stacked at 390px an unbounded
                  3:4 frame is ~520px tall and pushes the clinician's name off
                  the screen entirely. */}
              {SPECIALISTS.length === 1 && (
                <div className="mb-6 sm:mb-0 max-w-[240px] sm:max-w-none mx-auto sm:mx-0 w-full">
                  {spec.imageUrl ? (
                    <div className="overflow-hidden aspect-[3/4] bg-[#e6e2dc] relative">
                      <img
                        src={spec.imageUrl}
                        alt={spec.altText}
                        width={600}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {spec.experienceYears > 0 && (
                        <div className="absolute top-3 left-3 bg-[#3C2117] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                          {spec.experienceYears}+ Yrs Clinical Practice
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-[#f8f3ed] border border-[#d4c3bd]/40 flex flex-col items-center justify-center gap-4 text-center px-6">
                      <img
                        src="/logo.svg"
                        alt=""
                        aria-hidden="true"
                        width={96}
                        height={96}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-40"
                      />
                      <span className="font-['Inter'] text-[11px] uppercase tracking-widest text-[#84523e] font-semibold">
                        Portrait to come
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Details and actions are one column, not two grid rows.

                  `contents` makes this wrapper vanish from layout, so with
                  several clinicians the two children are still the direct flex
                  items of the card and `justify-between` pins the buttons to
                  the bottom exactly as before. With one clinician it becomes
                  the second grid cell, and the buttons follow the bio instead
                  of being pushed to the foot of the taller portrait column. */}
              <div className={SPECIALISTS.length === 1 ? 'flex flex-col' : 'contents'}>
                <div>
                  {/* Multi-clinician layout only — the single-clinician card
                      renders its portrait in the grid cell above. No stock
                      photograph stands in for a clinician who has not supplied
                      one, and no "0+ Yrs Clinical Practice" badge. */}
                  {SPECIALISTS.length > 1 && spec.imageUrl && (
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
                      {spec.experienceYears > 0 && (
                        <div className="absolute top-3 left-3 bg-[#3C2117] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                          {spec.experienceYears}+ Yrs Clinical Practice
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] mb-1 font-medium">
                    {spec.name}
                  </h3>

                  {spec.role && (
                    <p className="font-['Inter'] text-xs text-[#84523e] mb-2 tracking-widest uppercase font-semibold">
                      {spec.role}
                    </p>
                  )}

                  {(spec.credentialsShort || spec.credentials) && (
                    <p className="font-['Inter'] text-xs text-[#504440] mb-4 italic border-b border-[#d4c3bd]/20 pb-3">
                      {spec.credentialsShort || spec.credentials}
                    </p>
                  )}

                  {spec.bio && (
                    <p className="font-['Inter'] text-sm text-[#504440] font-light leading-relaxed mb-6">
                      {spec.bio}
                    </p>
                  )}
                </div>

                <div
                  className={`pt-4 border-t border-[#d4c3bd]/20 flex flex-col gap-2 ${
                    SPECIALISTS.length === 1 ? 'sm:flex-row sm:gap-3' : ''
                  }`}
                >
                  {/* Don't promise a bio and credentials the profile page has
                    nothing to show for. */}
                  {(spec.bio || spec.credentials) && (
                    <EntityCardLink
                      href={specialistPath(spec.id)}
                      className="w-full py-2 bg-[#f2ede7] hover:bg-[#e6e2dc] text-[#3C2117] font-['Inter'] text-xs uppercase tracking-widest font-medium border border-[#d4c3bd]/50 cursor-pointer text-center block"
                    >
                      View Full Bio &amp; Credentials
                    </EntityCardLink>
                  )}

                  <button
                    onClick={() => onOpenBookingWithSpecialist(spec.name)}
                    className="w-full py-2 bg-[#3C2117] text-white hover:bg-[#504440] font-['Inter'] text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request Consult</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
