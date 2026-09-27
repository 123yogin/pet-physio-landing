import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SERVICES } from '../../data/clinicData';
import { EntityCardLink } from '../EntityCardLink';
import { servicePath } from '../../seo/routes';

/**
 * One photo per service, picked from the clinic's own photo set (there are no
 * per-service shoots). Alt text describes only what each frame actually shows.
 */
const PHOTOS: Record<string, { src: string; alt: string }> = {
  'indoor-physiotherapy': {
    src: '/photos/clinic-german-shepherd.webp',
    alt: 'A German Shepherd held on the padded therapy mats at the Shilaj clinic',
  },
  'manual-therapy': {
    src: '/photos/therapy-ramp.webp',
    alt: "A Labrador supported in a harness on the clinic's padded mat during a hands-on session",
  },
  electrophysical: {
    src: '/photos/therapy-platform.webp',
    alt: 'A Labrador supported in an overhead harness during an assisted therapy session at the clinic',
  },
  specialised: {
    src: '/photos/pool-swim-blue.webp',
    alt: "A Golden Retriever swimming with a support harness in the clinic's indoor hydrotherapy pool",
  },
  'home-care': {
    src: '/photos/home-visit-indie.webp',
    alt: 'An Indian pariah dog resting against Dr. Dhanvi Patel during a home visit',
  },
};

const num = (i: number) => String(i + 1).padStart(2, '0');

const ServicesPanels: React.FC = () => {
  const [active, setActive] = React.useState(0);
  const [openMobile, setOpenMobile] = React.useState(0);
  // Hover intent: a pointer sweeping across the row would otherwise open
  // every panel it crosses, and each opening shifts the others under it.
  const intent = React.useRef<number | undefined>(undefined);
  const hover = (i: number) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setActive(i), 90);
  };
  React.useEffect(() => () => window.clearTimeout(intent.current), []);

  return (
    <>
      {/* Desktop / large screens: 5 tall panels, one grows on hover/focus. */}
      <div className="hidden lg:flex gap-2 h-[560px]" role="list">
        {SERVICES.map((service, i) => {
          const isActive = active === i;
          const photo = PHOTOS[service.id];
          return (
            <div
              key={service.id}
              role="listitem"
              onMouseEnter={() => hover(i)}
              onMouseLeave={() => window.clearTimeout(intent.current)}
              onFocus={() => setActive(i)}
              style={{ flexBasis: 0 }}
              className={`relative shrink-0 overflow-hidden rounded-[var(--lab-card)] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${isActive ? 'grow-[5]' : 'grow-[1]'}`}
            >
              <EntityCardLink
                href={servicePath(service.id)}
                aria-label={`${service.title} treatment details`}
                data-cursor="View"
                className="absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-(--c-ink) via-(--c-ink)/35 to-(--c-ink)/5" />

                {/* Collapsed: vertical rotated title + number */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-between p-4 transition-opacity duration-500 motion-reduce:transition-none ${isActive ? 'opacity-0' : 'opacity-100'}`}
                  aria-hidden={isActive}
                >
                  <span className="font-(family-name:--f-display) italic text-lg text-white/70">{num(i)}</span>
                  <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap font-(family-name:--f-display) text-lg text-white tracking-wide">
                    {service.title}
                  </span>
                </div>

                {/* Expanded content, staggered fade-up */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-8 transition-opacity duration-500 motion-reduce:transition-none ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-hidden={!isActive}
                >
                  <div className="w-[260px] max-w-[80vw]">
                    <span
                      className={`font-(family-name:--f-display) italic text-3xl text-white/60 transition-all duration-500 motion-reduce:transition-none motion-reduce:translate-y-0 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    >
                      {num(i)}
                    </span>
                    <h3
                      className={`mt-3 font-(family-name:--f-display) text-2xl text-white font-medium leading-tight transition-all delay-75 duration-500 motion-reduce:transition-none motion-reduce:translate-y-0 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-3 font-(family-name:--f-body) text-sm text-white/85 font-light leading-relaxed transition-all delay-150 duration-500 motion-reduce:transition-none motion-reduce:translate-y-0 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    >
                      {service.shortDesc}
                    </p>
                    <ul
                      className={`mt-4 flex flex-wrap gap-1.5 transition-all delay-200 duration-500 motion-reduce:transition-none motion-reduce:translate-y-0 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    >
                      {service.benefits.slice(0, 4).map((b) => (
                        <li key={b} className="whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] text-white/90">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`mt-5 flex items-center justify-between gap-4 border-t border-white/25 pt-4 text-xs uppercase tracking-widest transition-all delay-300 duration-500 motion-reduce:transition-none motion-reduce:translate-y-0 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    >
                      <span className="whitespace-nowrap text-white/70">{service.duration}</span>
                      <span className="whitespace-nowrap font-semibold text-white">View treatment →</span>
                    </div>
                  </div>
                </div>
              </EntityCardLink>
            </div>
          );
        })}
      </div>

      {/* Phones / tablets: vertical accordion, one panel open at a time. */}
      <div className="flex flex-col gap-3 lg:hidden">
        {SERVICES.map((service, i) => {
          const isOpen = openMobile === i;
          const photo = PHOTOS[service.id];
          const panelId = `svc-panel-${service.id}`;
          return (
            <div key={service.id} className="overflow-hidden rounded-[var(--lab-card)] border border-(--c-line)/30 bg-(--c-card)">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenMobile(isOpen ? -1 : i)}
                className="relative block h-[88px] w-full cursor-pointer text-left"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={200}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-(--c-ink)/90 via-(--c-ink)/45 to-(--c-ink)/10" />
                <div className="relative flex h-full items-center gap-4 px-5">
                  <span className="font-(family-name:--f-display) italic text-xl text-white/70">{num(i)}</span>
                  <span className="flex-1 font-(family-name:--f-display) text-lg text-white font-medium">{service.title}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-white/80 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <p className="font-(family-name:--f-body) text-sm text-(--c-body) font-light leading-relaxed">
                      {service.shortDesc}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {service.benefits.slice(0, 4).map((b) => (
                        <li key={b} className="whitespace-nowrap rounded-full border border-(--c-line)/50 bg-(--c-surface) px-2.5 py-1 text-[11px] text-(--c-body)">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-(--c-line)/30 pt-4 text-xs uppercase tracking-widest">
                      <span className="text-(--c-body)">{service.duration}</span>
                      <EntityCardLink
                        href={servicePath(service.id)}
                        aria-label={`${service.title} treatment details`}
                        data-cursor="View"
                        className="whitespace-nowrap font-semibold text-(--c-accent)"
                      >
                        View treatment →
                      </EntityCardLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ServicesPanels;
