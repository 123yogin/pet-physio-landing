import React from 'react';
import { Activity, Waves, BedDouble, Sparkles, Footprints, X, CalendarCheck } from 'lucide-react';
import { BOOKABLE_SERVICES, BookableService } from '../data/bookableServices';
import { BookingForm } from './BookingForm';
import { AppointmentData } from '../types';

/**
 * The bookable services as a bento grid.
 *
 * Two columns and three rows, with the indoor facility taking the tall tile.
 *
 *   ┌──────────────┬──────────────┐
 *   │ Physiotherapy│              │
 *   ├──────────────┤ Indoor Fac.  │
 *   │ Swimming     │              │
 *   ├──────────────┼──────────────┤
 *   │ Grooming     │ Walking      │
 *   └──────────────┴──────────────┘
 *
 * Placement is explicit per tile rather than relying on source order, because
 * the tall tile has to sit beside two short ones -- auto-flow would leave a
 * hole under it.
 *
 * Clicking a tile opens what that service includes; it does NOT jump to the
 * booking form. Tile size is the loudest signal on this section, so the visitor
 * gets to read before being asked for their phone number, and the Book button
 * lives inside the panel once they have.
 *
 * Below `lg` the whole thing becomes one column. A two-column bento with row
 * spans cannot survive a 390px screen, and the size hierarchy simply does not
 * exist there -- order is the only signal left, so the tiles keep their order.
 */

interface BookableServicesProps {
  /** Codes the clinic currently offers publicly, from its own API. */
  availableCodes: string[];
  onSubmitSuccess: (data: AppointmentData, refId: string) => void;
}

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const ICONS: Record<string, IconComponent> = {
  activity: Activity,
  waves: Waves,
  bed: BedDouble,
  sparkles: Sparkles,
  footprints: Footprints,
};

/**
 * Grid placement per service.
 *
 * The wireframe put Physiotherapy in the tall slot, but the clinic has since
 * said the indoor facility is the thing it most wants shown -- residential care
 * for patients travelling in is what distinguishes it. Tile size is the loudest
 * signal in this section, so the tall slot follows that rather than the sketch.
 */
const PLACEMENT: Record<string, string> = {
  IndoorFacility: 'lg:col-start-2 lg:row-start-1 lg:row-span-2',
  Physiotherapy: 'lg:col-start-1 lg:row-start-1',
  Hydrotherapy: 'lg:col-start-1 lg:row-start-2',
  Grooming: 'lg:col-start-1 lg:row-start-3',
  Walking: 'lg:col-start-2 lg:row-start-3',
};

const Tile: React.FC<{
  service: BookableService;
  onOpen: (s: BookableService) => void;
}> = ({ service, onOpen }) => {
  const Icon = ICONS[service.icon] ?? Activity;
  return (
  <button
    type="button"
    onClick={() => onOpen(service)}
    aria-label={`${service.title} — what's included`}
    className={`${PLACEMENT[service.code] ?? ''} group relative overflow-hidden text-left bg-[#f8f3ed] border border-[#d4c3bd]/30 p-8 sm:p-10 min-h-[220px] flex flex-col justify-between hover:bg-white transition-colors duration-500`}
  >
    {/* The tile's own icon again, oversized and very faint, as texture.

        This is deliberately NOT a photograph. Stock imagery under a tile that
        says "our indoor pool" or "our 24x7 facility" shows a room the clinic
        may not have, which is a claim about a real business rather than
        decoration. The clinic does not have its own photographs yet, so the
        tiles carry a mark instead of a place. Swap this for a real photo when
        they do.

        aria-hidden and pointer-events-none: it is the same icon already shown
        above, so announcing it twice is noise, and it must never swallow the
        click. */}
    <Icon
      aria-hidden="true"
      strokeWidth={1}
      className="pointer-events-none absolute -right-8 -bottom-10 w-48 h-48 text-[#84523e] opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-500"
    />

    <span className="relative text-[#84523e] opacity-70 group-hover:opacity-100 transition-opacity">
      <Icon className="w-7 h-7" />
    </span>

    <span className="relative block">
      <span className="block font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-light mb-2 group-hover:text-[#84523e] transition-colors">
        {service.title}
      </span>
      <span className="block font-['Inter'] text-sm text-[#504440] font-light leading-relaxed max-w-[42ch]">
        {service.summary}
      </span>
      <span className="mt-5 inline-block text-xs uppercase tracking-widest text-[#84523e] font-semibold">
        What&rsquo;s included &rarr;
      </span>
    </span>
  </button>
  );
};

const DetailPanel: React.FC<{
  /** null = the visitor does not know which service they need. */
  service: BookableService | null;
  onClose: () => void;
  onSubmitSuccess: (data: AppointmentData, refId: string) => void;
}> = ({ service, onClose, onSubmitSuccess }) => (
  <div
    className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-[#3C2117]/40"
    role="dialog"
    aria-modal="true"
    aria-label={service ? service.title : 'Tell us about your pet'}
    onClick={onClose}
  >
    {/* Full screen on a phone. At 390px a centred box holding a seven-field
        form is a scroll inside a scroll, with the submit button stranded below
        the fold of a container whose edges the visitor cannot see. A sheet that
        owns the screen behaves like a page, which is what it is. */}
    <div
      className="bg-[#fef9f2] w-full sm:max-w-[620px] h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto p-6 pt-16 sm:p-10 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-[#84523e] hover:text-[#3C2117] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold block mb-2">
        {service ? 'Bookable service' : 'Not sure yet'}
      </span>
      <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-light mb-3">
        {service ? service.title : 'Tell us about your pet'}
      </h3>
      <p className="font-['Inter'] text-sm sm:text-base text-[#504440] font-light leading-relaxed mb-7">
        {service
          ? service.summary
          : 'Describe what is troubling your pet and we will tell you which service suits them when we call. You do not have to decide now.'}
      </p>

      {service && (
        <>
          <h4 className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-3">
            What&rsquo;s included
          </h4>
          <ul className="space-y-2.5 mb-6">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3 font-['Inter'] text-sm text-[#504440] font-light leading-relaxed"
              >
                <span aria-hidden="true" className="mt-2 w-1 h-1 bg-[#84523e] shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {service.note && (
            <p className="font-['Inter'] text-xs text-[#84523e] leading-relaxed mb-6 italic">
              {service.note}
            </p>
          )}
        </>
      )}

      {/* The form lives here rather than further down the page. Choosing a
          service and then being scrolled to a separate block reads as two
          different things; this way each service books itself, and the service
          is already decided by the card that opened this. */}
      <div className="pt-2 border-t border-[#d4c3bd]/40">
        <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-5 mt-6">
          <CalendarCheck className="w-4 h-4" />
          {service ? `Request ${service.title}` : 'Your details'}
        </p>
        <BookingForm
          variant="panel"
          initialService={service ? service.code : ''}
          onSubmitSuccess={onSubmitSuccess}
        />
      </div>
    </div>
  </div>
);

export const BookableServices: React.FC<BookableServicesProps> = ({
  availableCodes,
  onSubmitSuccess,
}) => {
  // `undefined` = closed. `null` = open with no service chosen ("not sure").
  // A service object = open on that service.
  const [open, setOpen] = React.useState<BookableService | null | undefined>(undefined);

  // Close on Escape, hold the page still behind the dialog, and hand focus to
  // it -- without that last part a keyboard or screen-reader user opens a
  // dialog and their focus is still somewhere up the page behind it, which
  // makes the form effectively unreachable.
  React.useEffect(() => {
    if (open === undefined) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(undefined);
    };
    window.addEventListener('keydown', onKey);

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const id = window.setTimeout(() => {
      document
        .querySelector<HTMLElement>('[role="dialog"] input, [role="dialog"] button')
        ?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = priorOverflow;
      window.clearTimeout(id);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const offered = BOOKABLE_SERVICES.filter((s) => availableCodes.includes(s.code));
  if (offered.length === 0) return null;

  return (
    <section id="book" className="py-20 sm:py-28 bg-[#fef9f2]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="mb-12 border-b border-[#d4c3bd]/30 pb-8">
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Book a visit
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light">
            What would you like to book?
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light leading-relaxed mt-4 max-w-[60ch]">
            Pick a service to see what it includes and request it from there.
            Not sure which one your pet needs? Choose whichever looks closest,
            or call the clinic and we will advise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 gap-px bg-[#d4c3bd]/20">
          {offered.map((s) => (
            <Tile key={s.code} service={s} onOpen={setOpen} />
          ))}
        </div>

        {/* The other route. Someone who does not know what their pet needs is
            exactly the person a clinic wants to hear from, and before this they
            had nowhere to go once the service-less form was removed -- "choose
            whichever looks closest" is a dead end at 11pm. A band rather than a
            sixth tile: the bento above is exactly filled, and this is a
            different kind of action, not another service. */}
        <button
          type="button"
          onClick={() => setOpen(null)}
          className="mt-px w-full bg-[#f8f3ed] border border-[#d4c3bd]/30 px-8 py-7 text-left hover:bg-white transition-colors duration-500 group"
        >
          <span className="block font-['Plus_Jakarta_Sans'] text-lg sm:text-xl text-[#3C2117] font-light mb-1 group-hover:text-[#84523e] transition-colors">
            Not sure which one your pet needs?
          </span>
          <span className="block font-['Inter'] text-sm text-[#504440] font-light">
            Tell us what is troubling them and we will advise when we call
            &nbsp;&rarr;
          </span>
        </button>
      </div>

      {open !== undefined && (
        <DetailPanel
          service={open}
          onClose={() => setOpen(undefined)}
          onSubmitSuccess={onSubmitSuccess}
        />
      )}
    </section>
  );
};
