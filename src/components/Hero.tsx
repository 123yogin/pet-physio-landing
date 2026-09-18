import React from 'react';
import { HERO_IMAGE } from '../data/clinicData';

/**
 * Hero background clip. Empty = the still image below carries the hero.
 *
 * The video machinery is wired and working; it is off because there is no clip
 * that can go live yet, not because it does not run. Two reasons, both real:
 *
 *  - The clip used to preview this was Pexels stock showing a veterinary team
 *    who do not work here. Pexels' licence permits commercial use but says
 *    plainly: "Don't imply endorsement of your product by people or brands on
 *    the imagery." Identifiable strangers behind "India's first pet
 *    rehabilitation center" is exactly that implication.
 *  - That file was 18MB -- about ninety times the still it replaced, fetched
 *    before anyone has scrolled, on a site whose visitors are largely on Indian
 *    mobile data.
 *
 * To turn it on: drop the clinic's own footage in public/, put its path here,
 * and the still becomes the poster automatically. Keep it a few seconds long
 * and around 1280px wide -- it sits behind a gradient, so detail past that is
 * bytes nobody sees. Target a couple of MB, not eighteen.
 */
const HERO_VIDEO = '';
import { Calendar, ChevronRight, Activity } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[85vh] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#f8f3ed] pb-16 lg:pb-0"
      // Clears the fixed navbar at every breakpoint and in both its scrolled
      // and unscrolled states. --nav-h is published by Navbar from its own
      // measured height; the CSS fallback covers the server-rendered HTML
      // before hydration.
      style={{ paddingTop: 'calc(var(--nav-h, 113px) + 2rem)' }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 w-full lg:w-1/2 lg:left-1/2">
        {/* PREVIEW ONLY -- not shippable as it stands. See the note below. */}
        {HERO_VIDEO ? (
          <video
            // muted + playsInline are load-bearing: without both, iOS and
            // Chrome refuse to autoplay and the poster is all anyone sees.
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={HERO_IMAGE}
            aria-hidden="true"
            className="w-full h-full object-cover grayscale-[15%] opacity-90 transition-opacity duration-700 motion-reduce:hidden"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : null}

        {/* LCP element: eager + high priority, explicit dimensions to reserve space (CLS).
            Also the poster, and the whole hero for anyone who has asked their
            system for reduced motion -- autoplaying video is a genuine problem
            for some people, not a preference. */}
        <img
          src={HERO_IMAGE}
          alt="Veterinary physiotherapist gently working with golden retriever in luxury rehabilitation clinic"
          width={1200}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`w-full h-full object-cover grayscale-[15%] opacity-90 transition-opacity duration-700${
            HERO_VIDEO ? ' hidden motion-reduce:block' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#f8f3ed] via-[#f8f3ed]/60 to-transparent"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 px-4 sm:px-8 max-w-[1280px] mx-auto w-full flex items-center">
        <div className="max-w-3xl flex flex-col gap-6 sm:gap-8 pr-0 lg:pr-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f2ede7] border border-[#d4c3bd]/60 w-fit text-xs font-['Inter'] uppercase tracking-widest text-[#504440]">
            <Activity className="w-3.5 h-3.5 text-[#84523e]" />
            <span>India&rsquo;s first pet rehabilitation center</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl text-[#3C2117] font-light leading-[1.12] tracking-tight">
            Life is movement, movement is life.
          </h1>

          <p className="font-['Inter'] text-lg sm:text-xl text-[#504440] max-w-xl font-light leading-relaxed">
            Experience the absolute best in restorative care. Our specialized team blends clinical
            precision with a warm, comforting environment to ensure your companion's optimal
            wellness and mobility.
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
        </div>
      </div>
    </section>
  );
};
