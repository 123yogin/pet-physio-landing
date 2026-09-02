import React, { useState } from 'react';
import { JOURNEY_STEPS } from '../data/clinicData';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export const TreatmentJourney: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <section id="journey" className="py-20 sm:py-28 bg-[#ffffff] border-y border-[#d4c3bd]/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Step-by-Step Care
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light mb-4">
            The Healing Journey
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light">
            A clear, evidence-based roadmap guiding your companion from initial intake to full functional recovery.
          </p>
        </div>

        {/* Steps Grid Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative px-2 mb-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-px bg-[#d4c3bd]/40 z-0" />

          {JOURNEY_STEPS.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className="relative z-10 flex flex-col items-center md:items-start w-full md:w-1/5 cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 rounded-none flex items-center justify-center font-['Plus_Jakarta_Sans'] text-xl mb-4 transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#3C2117] text-[#ffffff] shadow-md border-2 border-[#3C2117] scale-105'
                      : 'bg-[#f8f3ed] border border-[#3C2117] text-[#3C2117] group-hover:bg-[#3C2117] group-hover:text-white'
                  }`}
                >
                  <span className="font-light">{step.number}</span>
                </div>

                <h3 className={`font-['Plus_Jakarta_Sans'] text-lg mb-1 text-center md:text-left transition-colors ${
                  isSelected ? 'text-[#3C2117] font-semibold' : 'text-[#504440] font-medium group-hover:text-[#3C2117]'
                }`}>
                  {step.title}
                </h3>

                <p className="font-['Inter'] text-xs text-[#504440] font-light leading-relaxed text-center md:text-left hidden lg:block">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase Panel */}
        <div className="bg-[#f8f3ed] p-6 sm:p-10 border border-[#d4c3bd]/50 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#3C2117] text-white px-3 py-1 text-xs uppercase tracking-widest font-semibold">
                Stage {activeStep.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold">
                Clinical Workflow
              </span>
            </div>

            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-medium mb-3">
              {activeStep.title} Phase
            </h3>

            <p className="font-['Inter'] text-base text-[#504440] font-light leading-relaxed mb-6">
              {activeStep.details}
            </p>

            <div className="flex items-center gap-2">
              {JOURNEY_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStepIndex(i)}
                  className={`h-2 transition-all ${
                    activeStepIndex === i ? 'w-8 bg-[#3C2117]' : 'w-2 bg-[#d4c3bd] hover:bg-[#84523e]'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#ffffff] p-6 border border-[#d4c3bd]/30">
            <h4 className="font-['Plus_Jakarta_Sans'] text-base text-[#3C2117] font-semibold uppercase tracking-wider mb-4 border-b border-[#d4c3bd]/30 pb-2">
              What To Expect
            </h4>
            <ul className="space-y-3 font-['Inter'] text-sm text-[#504440] font-light">
              {activeStep.whatToExpect.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#84523e] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setActiveStepIndex((prev) => (prev + 1) % JOURNEY_STEPS.length)}
              className="mt-6 w-full py-2.5 bg-[#f2ede7] hover:bg-[#e6e2dc] text-[#3C2117] font-['Inter'] text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 border border-[#d4c3bd]/50 cursor-pointer"
            >
              <span>Next Stage ({JOURNEY_STEPS[(activeStepIndex + 1) % JOURNEY_STEPS.length].title})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
