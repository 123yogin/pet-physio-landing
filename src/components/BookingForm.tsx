import React, { useState, useEffect } from 'react';
import { AppointmentData } from '../types';
import { SPECIALISTS } from '../data/clinicData';
import { MapPin, Phone, Mail, Clock, Calendar, Check } from 'lucide-react';
import { SITE, formattedAddress, openingHoursSummary } from '../seo/siteConfig';

// Same-origin in production: the landing page is served from the clinic
// app's own domain, so /api/v1 is the same deployment. Overridable for
// local development, where the API runs on :8000 and Vite on :3000.
const CLINIC_API =
  (import.meta as any).env?.VITE_CLINIC_API_URL ?? '/api/v1';

interface BookingFormProps {
  initialSpecialist?: string;
  initialCondition?: string;
  /** An Appointment.VISIT_TYPES code to pre-select, set when the visitor
   *  presses Book on a service card. */
  initialService?: string;
  /** "section" is the full contact block on the home page. "panel" is just the
   *  fields, for rendering inside a service card's own dialog -- there the
   *  service is already chosen by the card that opened it, so the selector is
   *  hidden and the contact column and section chrome are dropped. */
  variant?: 'section' | 'panel';
  onSubmitSuccess: (data: AppointmentData, refId: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialSpecialist,
  initialCondition,
  initialService,
  variant = 'section',
  onSubmitSuccess,
}) => {
  const isPanel = variant === 'panel';
  const [formData, setFormData] = useState<AppointmentData>({
    firstName: '',
    lastName: '',
    petName: '',
    speciesBreed: '',
    email: '',
    phone: '',
    preferredSpecialist: initialSpecialist || '',
    service: initialService || '',
    reason: initialCondition ? `Seeking rehabilitation for ${initialCondition}.` : '',
  });

  // The clinic's bookable services, read from the API that the booking forms
  // themselves use. Hardcoding this list here is what once made every booking
  // return 400: three forms each invented their own wording for the same
  // service. If the request fails the field simply does not render -- an
  // enquiry is still perfectly valid without it.
  // Honeypot. No person reaches this field, so anything in it came from a
  // bot filling every input it could find. The server decides what to do
  // with that -- this side only has to offer the bait and report it.
  const [honeypot, setHoneypot] = useState('');

  const [services, setServices] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch(`${CLINIC_API}/appointment-options`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.visit_types) return;
        // Only the ones the clinic marks public. Initial Consultation,
        // Follow-up and Re-assessment are stages of a course of care, not
        // things a first-time visitor can sensibly ask for -- the server
        // decides which is which so this list cannot drift from the bookable
        // one.
        setServices(d.visit_types.filter((v: { public?: boolean }) => v.public));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Pressing Book on another card while the form is already on screen has to
  // move the dropdown, so this follows the prop rather than only seeding state.
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (initialSpecialist) {
      setFormData((prev) => ({ ...prev, preferredSpecialist: initialSpecialist }));
    }
  }, [initialSpecialist]);

  useEffect(() => {
    if (initialCondition) {
      setFormData((prev) => ({
        ...prev,
        reason: `Seeking specialized physical rehabilitation for ${initialCondition}.`,
      }));
    }
  }, [initialCondition]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // Exactly the four fields the API requires and the labels above star.
    // These three lists — asterisk, `required`, serializer — have to agree;
    // when they drifted, a visitor who filled in everything starred was told
    // "lastName: This field may not be blank."
    if (!formData.firstName || !formData.petName || !formData.email || !formData.phone) {
      setSubmitError(
        'Please fill in your name, your pet\u2019s name, your email address and a phone number.'
      );
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      // This used to invent a reference number client-side and send nothing
      // anywhere -- the visitor saw a confirmation and the clinic never heard
      // about it. It now creates a real enquiry the vet triages, and the
      // reference shown is the one the server actually recorded.
      const res = await fetch(`${CLINIC_API}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          petName: formData.petName,
          speciesBreed: formData.speciesBreed,
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
          website: honeypot,
          service: formData.service || undefined,
          preferredDate: formData.preferredDate || undefined,
          preferredSpecialist: formData.preferredSpecialist || undefined,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // The clinic API speaks RFC-7807, so `detail` is a real sentence --
        // show it rather than a generic failure the visitor cannot act on.
        throw new Error(body?.detail || 'We could not send your enquiry. Please try again.');
      }
      onSubmitSuccess(formData, body.reference);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'We could not send your enquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // The form itself, without any surrounding page furniture, so the same markup
  // and the same submit path serve both the standalone contact block and a
  // service card's dialog.
  const formPanel = (
    <div className={isPanel
      ? ''
      : 'bg-[#f8f3ed] p-8 sm:p-12 border border-[#d4c3bd]/50 shadow-xs'}>
          {/* No heading in a panel: the dialog already names the service and
              says "Request <service>" directly above. Two headings for one
              action is the thing this layout exists to remove. The card and
              padding go too -- a bordered box inside a bordered dialog. */}
          {!isPanel && (
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] mb-8 font-medium border-b border-[#d4c3bd]/30 pb-4">
              Request An Appointment
            </h3>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 font-['Inter']">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="firstName">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Eleanor"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Vance"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="petName">
                  Pet's Name *
                </label>
                <input
                  id="petName"
                  type="text"
                  required
                  value={formData.petName}
                  onChange={handleChange}
                  placeholder="e.g. Winston"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="speciesBreed">
                  Species / Breed
                </label>
                <input
                  id="speciesBreed"
                  type="text"
                  value={formData.speciesBreed}
                  onChange={handleChange}
                  placeholder="e.g. Dog / Golden Retriever"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. eleanor@example.com"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. (555) 019-2831"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>
            </div>

            {/* Only rendered when there is an actual choice to make. With a
                single clinician the control offered "Any Available Specialist"
                against one name — a decision the visitor cannot get wrong and
                should not be asked to make. It previously listed three people
                who do not work here at all, and those names travelled into the
                clinic's enquiry inbox as a routing preference. */}
            {/* Honeypot: hidden from sight, from the tab order and from the
                accessibility tree, so only automation finds it. Not `display:
                none` -- some bots skip those -- and labelled anyway for any
                agent that ignores aria-hidden. */}
            <div
              aria-hidden="true"
              className="absolute w-px h-px -left-[9999px] overflow-hidden"
            >
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {!isPanel && services.length > 0 && (
              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="service">
                  Service Required
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none cursor-pointer"
                >
                  <option value="">Not sure / please advise</option>
                  {services.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {SPECIALISTS.length > 1 && (
              <div>
                <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="preferredSpecialist">
                  Preferred Specialist
                </label>
                <select
                  id="preferredSpecialist"
                  value={formData.preferredSpecialist}
                  onChange={handleChange}
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none cursor-pointer"
                >
                  <option value="">Any Available Specialist</option>
                  {SPECIALISTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.role ? `${s.name} (${s.role})` : s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs tracking-widest text-[#504440] uppercase mb-2 font-medium" htmlFor="reason">
                Reason For Visit & Symptoms
              </label>
              <textarea
                id="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your pet's condition, limp, surgical history, or mobility concerns..."
                className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none resize-none"
              />
            </div>

            {submitError && (
                <p role="alert" className="text-sm text-[#b91c1c] bg-[#fee2e2] border border-[#fecaca] rounded-lg px-4 py-3">
                  {submitError}
                </p>
              )}
              <button
              type="submit"
              className="w-full bg-[#3C2117] text-[#ffffff] py-4 rounded-none text-xs tracking-widest uppercase font-medium hover:bg-[#504440] transition-colors mt-6 cursor-pointer flex items-center justify-center gap-2"
             disabled={submitting}>
                {submitting ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Submit Appointment Request</span>
                  </>
                )}
              </button>
          </form>
        </div>
  );

  // Inside a service card's dialog the card has already chosen the service and
  // supplies its own heading, so the section chrome and the contact column --
  // both of which exist for the standalone block on the home page -- would just
  // be a second copy of what is already on screen.
  if (isPanel) return formPanel;

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#ffffff] border-t border-[#d4c3bd]/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">

        {/* Left Column: Contact Details.

            The "Initial Consultation / Ready to start your pet's recovery
            journey?" heading that used to open this column is gone. The section
            directly above now asks "What would you like to book?" and explains
            the choice, so this repeated the call to action one screen later --
            and contradicted it, by naming Initial Consultation when five
            services are bookable and that one is not even offered to the public.

            The address, phone and hours below stay. They are the home page's
            only crawlable name/address/phone since NapBlock was removed from
            here as a duplicate, and they are useful beside the form regardless. */}
        <div>
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-5 border-l-2 border-[#3C2117]/30 pl-5">
              <MapPin className="w-5 h-5 text-[#3C2117] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-['Inter'] text-xs tracking-widest text-[#84523e] uppercase mb-1 font-semibold">
                  Clinic Location
                </h4>
                <p className="font-['Inter'] text-sm sm:text-base text-[#3C2117] font-medium">
                  {formattedAddress()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 border-l-2 border-[#3C2117]/30 pl-5">
              <Phone className="w-5 h-5 text-[#3C2117] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-['Inter'] text-xs tracking-widest text-[#84523e] uppercase mb-1 font-semibold">
                  Telephone Intake
                </h4>
                <p className="font-['Inter'] text-sm sm:text-base text-[#3C2117] font-medium">
                  <a href={`tel:${SITE.contact.phone}`} className="hover:text-[#84523e] transition-colors">
                    {SITE.contact.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 border-l-2 border-[#3C2117]/30 pl-5">
              <Mail className="w-5 h-5 text-[#3C2117] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-['Inter'] text-xs tracking-widest text-[#84523e] uppercase mb-1 font-semibold">
                  Email Inquiries
                </h4>
                <p className="font-['Inter'] text-sm sm:text-base text-[#3C2117] font-medium">
                  <a href={`mailto:${SITE.contact.email}`} className="hover:text-[#84523e] transition-colors">
                    {SITE.contact.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 border-l-2 border-[#3C2117]/30 pl-5">
              <Clock className="w-5 h-5 text-[#3C2117] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-['Inter'] text-xs tracking-widest text-[#84523e] uppercase mb-1 font-semibold">
                  Hours Of Operation
                </h4>
                <p className="font-['Inter'] text-sm text-[#3C2117] font-medium">
                  {openingHoursSummary()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* No form here any more.

            Every service now books itself from its own card in #book, where
            the service is already decided and the panel carries the fields.
            Leaving a second, service-less form one screen below made two
            competing ways to do one thing.

            The section stays because it is not only a form: the address, phone
            and hours below are the home page's only crawlable name/address/
            phone since NapBlock was removed from here, and #contact is the
            anchor the navbar's Contact link points at. */}

      </div>
    </section>
  );
};
