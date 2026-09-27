import React, { useRef } from 'react';
import { useSectionProgress } from '../motion';
import { SPECIALISTS } from '../data/clinicData';

/**
 * "Split doors" reveal before the clinician section.
 *
 * The pattern from meermohsin.me's awards section, measured on the live site:
 * the heading is laid across two half-width panels that slide apart as the
 * page scrolls (about 1.2 px of travel per px scrolled), uncovering the scene
 * behind them. They reveal a 3D canvas; we reveal the clinic's own
 * photograph of its clinician -- the person an owner is about to trust.
 *
 * Mechanics: a tall wrapper with a sticky, viewport-high frame inside it, so
 * the page holds still while the doors open. Progress comes from the motion
 * engine (cached geometry, style writes only -- no React state on scroll).
 *
 * Accessibility: the split heading is decorative (it appears twice, once per
 * door) and is aria-hidden; the real heading is announced once. Under
 * prefers-reduced-motion the engine reports progress 1, so the doors are
 * simply open. Without JavaScript the doors stay closed over the portrait,
 * which the founder-story section right after shows anyway.
 */
export const SplitDoorsReveal: React.FC = () => {
  const spec = SPECIALISTS.length === 1 ? SPECIALISTS[0] : null;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);

  // p: 0 when the wrapper's top reaches the top of the viewport, 1 once it
  // has scrolled 0.6 of a screen further.
  const wrapRef = useSectionProgress<HTMLElement>(
    (p) => {
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease in-out
      if (leftRef.current) leftRef.current.style.transform = `translate3d(${(-e * 101).toFixed(2)}%,0,0)`;
      if (rightRef.current) rightRef.current.style.transform = `translate3d(${(e * 101).toFixed(2)}%,0,0)`;
      if (backRef.current) {
        backRef.current.style.transform = `scale(${(0.88 + 0.12 * e).toFixed(4)})`;
        backRef.current.style.opacity = String(Math.min(1, 0.35 + e));
      }
      if (seamRef.current) seamRef.current.style.opacity = String(Math.max(0, 1 - e * 6));
    },
    // Fully open after 0.6 of a screen of scrolling. That fits inside the
    // pinned range on phones (0.65 screens) and leaves desktop (1.1 screens)
    // a beat of holding on the revealed portrait before moving on.
    0,
    -0.6,
  );

  if (!spec?.imageUrl) return null;
  const [first, ...rest] = spec.name.split(' ');

  const Heading = () => (
    <p className="font-(family-name:--f-display) text-(--c-ink) font-light leading-[0.95] text-center text-[11.5vw] sm:text-[10vw] lg:text-[9.5vw] tracking-tight whitespace-nowrap">
      Meet the vet
      <br />
      behind <em className="acc-italic">every</em> step.
    </p>
  );

  return (
    <section ref={wrapRef} aria-labelledby="doors-heading" className="split-doors relative h-[165vh] md:h-[210vh] bg-(--c-ink)">
      <h2 id="doors-heading" className="sr-only">
        Meet the vet behind every step: {spec.name}
      </h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Behind the doors: the clinician, in the same arch as the hero. */}
        <div ref={backRef} className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6" style={{ transform: 'scale(0.88)', opacity: 0.35 }}>
          <div className="relative w-[min(340px,68vw)] aspect-[4/5] rounded-t-[999px] overflow-hidden border border-(--c-bg)/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            {/* A different photograph from the founder-story portrait that
                follows, so the same picture never appears twice in a row. */}
            <img
              src="/photos/clinic-german-shepherd.webp"
              alt="Dr. Dhanvi Patel holding a German Shepherd on the padded therapy mats at the Shilaj clinic"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[50%_65%]"
            />
          </div>
          <p aria-hidden="true" className="font-(family-name:--f-display) text-(--c-bg) text-4xl sm:text-5xl font-light text-center">
            {first} <em className="acc-italic">{rest.join(' ')}</em>
          </p>
          {spec.role && (
            <p className="text-xs uppercase tracking-[0.25em] text-(--c-bg)/70 text-center">{spec.role}</p>
          )}
        </div>

        {/* The doors: each half carries the full-width heading, offset so the
            two halves line up into one. */}
        <div ref={leftRef} aria-hidden="true" className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-(--c-hero) will-change-transform">
          <div className="absolute inset-y-0 left-0 w-[100vw] flex items-center justify-center">
            <Heading />
          </div>
        </div>
        <div ref={rightRef} aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-(--c-hero) will-change-transform">
          <div className="absolute inset-y-0 right-0 w-[100vw] flex items-center justify-center">
            <Heading />
          </div>
        </div>
        {/* A hairline where the doors meet, so "closed" reads as a door. */}
        <span ref={seamRef} aria-hidden="true" className="absolute inset-y-[18%] left-1/2 w-px -translate-x-1/2 bg-(--c-ink)/15" />
        <p aria-hidden="true" className="absolute bottom-8 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-(--c-accent) mix-blend-multiply">
          Keep scrolling
        </p>
      </div>
    </section>
  );
};
