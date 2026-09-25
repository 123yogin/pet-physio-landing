import React from 'react';
import { X, CalendarCheck } from 'lucide-react';
import { BOOKABLE_SERVICES, BookableService } from '../data/bookableServices';
import { BookingForm } from './BookingForm';
import { FacilitySlotBooking } from './FacilitySlotBooking';
import { BookingSuccessModal } from './BookingSuccessModal';
import { useRouter } from '../seo/router';
import { AppointmentData } from '../types';

/**
 * The appointment request form, shared by every page.
 *
 * It used to live inside BookableServices, which only the home page renders.
 * So "Book appointment" on a condition or treatment page had to NAVIGATE to
 * the home page before any field could appear -- the visitor was thrown off
 * the thing they were reading, the page they wanted was replaced, and Back
 * took them to a different place than the one they left.
 *
 * Now the panel is mounted by the layout instead, and opens over whatever page
 * the visitor is already on. Nothing navigates.
 *
 * State lives in the URL as a query on the CURRENT path -- `?book=1`, or
 * `?book=<CODE>` for a named service, plus `&for=<condition>` to prefill the
 * reason. That choice buys three things a useState could not:
 *
 *   - Back closes the panel, because opening it pushed a history entry.
 *   - The link is shareable: /conditions/ivdd?book=1&for=IVDD opens that page
 *     with the form up and the reason written in.
 *   - Any control anywhere can open it by building a href, with no shared
 *     callback threaded through the component tree.
 *
 * Closing strips the parameters again, so the URL never describes a panel that
 * is not on screen.
 */

/** Build the href that opens this panel on the page you are already on. */
export function bookingHref(
  currentPath: string,
  options?: { service?: string; reasonFor?: string },
): string {
  const params = new URLSearchParams();
  params.set('book', options?.service || '1');
  if (options?.reasonFor) params.set('for', options.reasonFor);
  return `${currentPath}?${params.toString()}#book`;
}

interface BookingPanelProps {
  /** Codes the clinic currently offers publicly, from its own API. */
  availableCodes: string[];
}

export const BookingPanel: React.FC<BookingPanelProps> = ({ availableCodes }) => {
  const { path, search, navigate } = useRouter();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);
  const bookParam = params.get('book');
  const reasonFor = params.get('for') || undefined;

  const [successData, setSuccessData] = React.useState<AppointmentData | null>(null);
  const [successRefId, setSuccessRefId] = React.useState<string | null>(null);

  // `?book=<CODE>` names a service; anything else ("1") opens the general form
  // with the service selector showing. A code the clinic has retired resolves
  // to undefined and falls back to the general form rather than pre-selecting
  // a value the API would reject.
  const service: BookableService | null = React.useMemo(() => {
    if (!bookParam) return null;
    return (
      BOOKABLE_SERVICES.find(
        (s) => s.code.toLowerCase() === bookParam.toLowerCase() && availableCodes.includes(s.code),
      ) ?? null
    );
  }, [bookParam, availableCodes]);

  const isOpen = !!bookParam;

  // Choosing the Indoor Facility in the general form swaps to its slot/bed
  // picker IN PLACE -- no navigation and no `#book` hash, so the panel never
  // jumps or scrolls (the reason an earlier navigate-based version felt wrong).
  // Reset when the panel closes so the next open starts from the form again.
  const [facilityChosen, setFacilityChosen] = React.useState(false);
  React.useEffect(() => {
    if (!isOpen) setFacilityChosen(false);
  }, [isOpen]);

  const facilityService = React.useMemo(
    () =>
      BOOKABLE_SERVICES.find(
        (s) => s.code === 'IndoorFacility' && availableCodes.includes(s.code),
      ) ?? null,
    [availableCodes],
  );

  // What the panel presents: the service named in the URL, or the Indoor
  // Facility once it is picked from the general form's selector.
  const effectiveService = service ?? (facilityChosen ? facilityService : null);

  const close = React.useCallback(() => {
    const next = new URLSearchParams(search);
    next.delete('book');
    next.delete('for');
    const query = next.toString();
    navigate(`${path}${query ? `?${query}` : ''}`, { replace: true });
  }, [path, search, navigate]);

  // Escape, scroll lock, and focus into the dialog. Without that last part a
  // keyboard or screen-reader user opens the form and their focus is still
  // behind it, which makes the whole thing unreachable.
  React.useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[role="dialog"] input, [role="dialog"] button')?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = priorOverflow;
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  const handleSuccess = (data: AppointmentData, refId: string) => {
    setSuccessData(data);
    setSuccessRefId(refId);
    close();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-[#3C2117]/40"
          role="dialog"
          aria-modal="true"
          aria-label={
            effectiveService
              ? effectiveService.title
              : reasonFor
                ? `Request an appointment for ${reasonFor}`
                : 'Tell us about your pet'
          }
          onClick={close}
        >
          {/* Full screen on a phone. At 390px a centred box holding a
              seven-field form is a scroll inside a scroll, with the submit
              button stranded below the fold of a container whose edges the
              visitor cannot see. A sheet that owns the screen behaves like a
              page, which is what it is. */}
          <div
            className="bg-[#fef9f2] w-full sm:max-w-[620px] h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto p-6 pt-16 sm:p-10 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 text-[#84523e] hover:text-[#3C2117] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold block mb-2">
              {/* "Not sure yet" is only true when the visitor opened this from
                  the band that says so. Someone who pressed "Book an assessment
                  for IVDD" knows exactly what they want, and telling them
                  otherwise reads as the form not having listened. */}
              {effectiveService ? 'Bookable service' : reasonFor ? 'Appointment request' : 'Not sure yet'}
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-light mb-3">
              {effectiveService ? effectiveService.title : reasonFor ? `Book for ${reasonFor}` : 'Tell us about your pet'}
            </h3>
            <p className="font-['Inter'] text-sm sm:text-base text-[#504440] font-light leading-relaxed mb-7">
              {effectiveService
                ? effectiveService.summary
                : reasonFor
                  ? `Tell us about your pet and we will call you back about ${reasonFor}. Pick the service below if you know which one you need.`
                  : 'Describe what is troubling your pet and we will tell you which service suits them when we call. You do not have to decide now.'}
            </p>

            {effectiveService && (
              <>
                <h4 className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-3">
                  What&rsquo;s included
                </h4>
                <ul className="space-y-2.5 mb-6">
                  {effectiveService.includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-['Inter'] text-sm text-[#504440] font-light leading-relaxed"
                    >
                      <span aria-hidden="true" className="mt-2 w-1 h-1 bg-[#84523e] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {effectiveService.note && (
                  <p className="font-['Inter'] text-xs text-[#84523e] leading-relaxed mb-6 italic">
                    {effectiveService.note}
                  </p>
                )}
              </>
            )}

            <div className="pt-2 border-t border-[#d4c3bd]/40">
              {/* The Indoor Facility books real bed inventory by the hour, so it
                  gets the slot picker instead of the generic "we'll call you"
                  form. Every other service keeps the request form. */}
              {effectiveService && effectiveService.code === 'IndoorFacility' ? (
                <div className="mt-6">
                  <FacilitySlotBooking onClose={close} />
                </div>
              ) : (
                <>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-5 mt-6">
                    <CalendarCheck className="w-4 h-4" />
                    {effectiveService ? `Request ${effectiveService.title}` : 'Request an appointment'}
                  </p>
                  <BookingForm
                    variant="panel"
                    initialService={service ? service.code : ''}
                    initialCondition={reasonFor}
                    onServiceChange={(code) => {
                      // Indoor Facility is booked as real bed inventory, so
                      // choosing it swaps to its slot/bed picker IN PLACE via
                      // state -- no navigation, so the panel does not jump.
                      setFacilityChosen(code === 'IndoorFacility');
                    }}
                    onSubmitSuccess={handleSuccess}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation follows the request onto whatever page it was made from,
          instead of being stranded on the home page. */}
      <BookingSuccessModal
        data={successData}
        refId={successRefId}
        onClose={() => {
          setSuccessData(null);
          setSuccessRefId(null);
        }}
      />
    </>
  );
};
