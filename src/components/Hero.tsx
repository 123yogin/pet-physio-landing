import React from 'react';

/**
 * Hero background: the clinic's own footage.
 *
 * Both files are the practice's own -- shot at the Shilaj premises, showing its
 * real staff, patients and mats. That replaces a Pexels stock clip whose
 * subjects wore legible "VOLUNTEER" shirts and did not work here, which read as
 * this clinic's team on a page headlined "India's first pet rehabilitation
 * center".
 *
 * ENCODING MATTERS HERE. The camera original was 2160x3840, 29.5s, HEVC at
 * 55Mbps -- 203MB, with an audio track, fetched before anyone has scrolled, on
 * a site whose visitors are mostly on Indian mobile data. It was also HEVC,
 * which Chrome frequently cannot decode at all, so the raw file would simply
 * not have played for a large share of visitors.
 *
 * What ships is H.264 900x1600, 12s, 30fps, CRF 31, audio stripped: 1.7MB,
 * about a hundred and twentieth of the original. 900px wide is not arbitrary --
 * it matches the panel's own width on a desktop half-viewport and covers a
 * 390px phone at 2x, so every byte beyond it would be resampled away.
 *
 * Re-encode any replacement the same way rather than dropping a camera file in:
 *   ffmpeg -ss 10 -t 12 -i source.MP4 -vf "scale=900:-2,fps=30" \
 *     -c:v libx264 -profile:v high -preset slow -crf 31 -pix_fmt yuv420p \
 *     -an -movflags +faststart public/hero-loop.mp4
 *
 * `-an` is not an oversight: the element is muted, so an audio track is bytes
 * nobody can ever hear. `+faststart` moves the index to the front so playback
 * begins before the whole file has arrived. libx264 rather than HEVC for the
 * decoder support above.
 *
 * The poster is frame one of that same clip, so the still and the video are the
 * same moment -- no stock photograph flashing before the real footage loads.
 *   ffmpeg -ss 10 -i source.MP4 -frames:v 1 -vf "scale=1080:-2" -q:v 6 \
 *     public/hero-poster.jpg
 *
 * Set HERO_VIDEO to '' to fall back to the poster alone.
 */
const HERO_VIDEO = '/hero-loop.mp4';
const HERO_POSTER = '/hero-poster.jpg';

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
        {HERO_VIDEO ? (
          <video
            // muted + playsInline are load-bearing: without both, iOS and
            // Chrome refuse to autoplay and the poster is all anyone sees.
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={HERO_POSTER}
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
          src={HERO_POSTER}
          alt="A clinician steadying a white Indian Spitz on the padded mats at The Pet Physio Vet in Shilaj, Ahmedabad"
          width={1080}
          height={1920}
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
