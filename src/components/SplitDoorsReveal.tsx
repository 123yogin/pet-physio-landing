import React, { useRef } from 'react';
import { useSectionProgress } from '../motion';
import { SPECIALISTS } from '../data/clinicData';
import { useLab } from '../lab/Lab';

/**
 * "Split doors" reveal over the clinician section.
 *
 * The pattern from meermohsin.me's awards section, measured on the live site:
 * a heading laid across two half-width panels that slide apart as the page
 * scrolls, uncovering what is behind them. Here what is behind them is the
 * real "Meet your clinician" section -- not a copy of it -- so nothing on the
 * page appears twice.
 *
 * Mechanics: the wrapped section is `position: sticky` inside a runway that is
 * taller than it by the pin distance, so the section holds still while the
 * doors (a viewport-high overlay at its top) open, then scrolls on normally.
 * Progress comes from the motion engine: cached geometry, style writes only,
 * no React state on scroll.
 *
 * Accessibility: the doors are decorative and aria-hidden; the section keeps
 * its own heading. They never take pointer events. Under
 * prefers-reduced-motion the engine reports progress 1, so they are open.
 */
export const SplitDoorsReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { doc } = useLab();
  const enabled = doc === 'story' && SPECIALISTS.length === 1;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  // p: 0 when the runway's top reaches the top of the viewport, 1 half a
  // screen later -- inside the pin on phones (0.6 screens) and desktop (0.8).
  const wrapRef = useSectionProgress<HTMLDivElement>(
    (p) => {
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease in-out
      if (leftRef.current) leftRef.current.style.transform = `translate3d(${(-e * 101).toFixed(2)}%,0,0)`;
      if (rightRef.current) rightRef.current.style.transform = `translate3d(${(e * 101).toFixed(2)}%,0,0)`;
      const fade = String(Math.max(0, 1 - e * 6));
      if (seamRef.current) seamRef.current.style.opacity = fade;
      if (hintRef.current) hintRef.current.style.opacity = fade;
    },
    0,
    -0.5,
  );

  if (!enabled) return <>{children}</>;

  const Heading = () => (
    <p className="font-(family-name:--f-display) text-(--c-ink) font-light leading-[0.95] text-center text-[11.5vw] sm:text-[10vw] lg:text-[9.5vw] tracking-tight whitespace-nowrap">
      Meet the vet
      <br />
      behind <em className="acc-italic">every</em> step.
    </p>
  );

  return (
    // The #about anchor lives here (lab.css styles `#about .grid`, so it must
    // be an ancestor of the section). The negative scroll margin makes nav
    // jumps land half a screen in, where the doors are already open.
    <div id="about" ref={wrapRef} className="split-doors relative bg-(--c-surface) scroll-mt-[-50svh]">
      <div className="sticky top-0">
        {children}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden">
          <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-(--c-hero) will-change-transform">
            <div className="absolute inset-y-0 left-0 w-[100vw] flex items-center justify-center">
              <Heading />
            </div>
          </div>
          <div ref={rightRef} className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-(--c-hero) will-change-transform">
            <div className="absolute inset-y-0 right-0 w-[100vw] flex items-center justify-center">
              <Heading />
            </div>
          </div>
          {/* A hairline where the doors meet, so "closed" reads as a door. */}
          <span ref={seamRef} className="absolute inset-y-[18%] left-1/2 w-px -translate-x-1/2 bg-(--c-ink)/15" />
          <p ref={hintRef} className="absolute bottom-8 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-(--c-accent)">
            Keep scrolling
          </p>
        </div>
      </div>
      {/* The pin distance. A spacer, not padding: a sticky element can only
          travel within its parent's content box, which excludes padding. */}
      <div aria-hidden="true" className="h-[60svh] md:h-[80svh]" />
    </div>
  );
};
