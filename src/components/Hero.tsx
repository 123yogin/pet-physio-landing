import React from 'react';
import { HERO_IMAGE } from '../data/clinicData';
import { Calendar, ChevronRight, Sparkles, Activity } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenQuiz }) => {
  return (
    <section id="home" className="relative w-full min-h-[85vh] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#f8f3ed] pt-24 pb-16 lg:py-0">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 w-full lg:w-1/2 lg:left-1/2">
        {/* LCP element: eager + high priority, explicit dimensions to reserve space (CLS). */}
        <img
          src={HERO_IMAGE}
          alt="Veterinary physiotherapist gently working with golden retriever in luxury rehabilitation clinic"
          width={1200}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover grayscale-[15%] opacity-90 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#f8f3ed] via-[#f8f3ed]/60 to-transparent"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 px-4 sm:px-8 max-w-[1280px] mx-auto w-full flex items-center">
        <div className="max-w-3xl flex flex-col gap-6 sm:gap-8 pr-0 lg:pr-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f2ede7] border border-[#d4c3bd]/60 w-fit text-xs font-['Inter'] uppercase tracking-widest text-[#504440]">
            <Activity className="w-3.5 h-3.5 text-[#84523e]" />
            <span>Certified Veterinary Rehabilitation Center</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl text-[#3C2117] font-light leading-[1.12] tracking-tight">
            Helping Pets Move Better, Recover Faster, Live Happier.
          </h1>

          <p className="font-['Inter'] text-lg sm:text-xl text-[#504440] max-w-xl font-light leading-relaxed">
            Experience the absolute best in restorative care. Our specialized team blends clinical precision with a warm, comforting environment to ensure your companion's optimal wellness and mobility.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="inline-flex justify-center items-center gap-2.5 h-14 px-8 sm:px-10 rounded-none bg-[#3C2117] text-[#ffffff] font-['Inter'] text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-all cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Assessment</span>
            </button>

            <a
              href="#services"
              className="inline-flex justify-center items-center gap-2 h-14 px-8 sm:px-10 rounded-none bg-transparent border border-[#3C2117] text-[#3C2117] font-['Inter'] text-xs uppercase tracking-widest font-medium hover:bg-[#ece7e2] transition-colors"
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Quiz Banner Callout */}
          <div className="mt-4 pt-4 border-t border-[#d4c3bd]/30 flex items-center gap-3">
            <button 
              onClick={onOpenQuiz}
              className="group flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
            >
              <span className="p-2 bg-[#ffbda5]/40 text-[#3C2117] rounded-full group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-[#84523e]" />
              </span>
              <div>
                <span className="block text-xs uppercase tracking-wider font-semibold text-[#3C2117] underline decoration-[#84523e]">
                  Is your pet limping, stiff, or recovering from surgery?
                </span>
                <span className="text-xs text-[#504440] font-light">
                  Take our 30-second Mobility Self-Checker →
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
