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
  onSubmitSuccess: (data: AppointmentData, refId: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialSpecialist,
  initialCondition,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<AppointmentData>({
    firstName: '',
    lastName: '',
    petName: '',
    speciesBreed: '',
    email: '',
    phone: '',
    preferredSpecialist: initialSpecialist || '',
    reason: initialCondition ? `Seeking rehabilitation for ${initialCondition}.` : '',
  });

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
    if (!formData.firstName || !formData.email || !formData.petName) {
      setSubmitError('Please fill in your name, your pet\u2019s name, and your email address.');
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

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#ffffff] border-t border-[#d4c3bd]/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Info & Contact Details */}
        <div>
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Initial Consultation
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] mb-6 font-light leading-tight">
            Ready to start your pet's recovery journey?
          </h2>

          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] mb-10 font-light leading-relaxed">
            Book an initial assessment today. Our board-certified specialists will conduct a thorough 60-minute intake evaluation and craft a personalized therapy plan.
          </p>

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

        {/* Right Column: Interactive Appointment Form */}
        <div className="bg-[#f8f3ed] p-8 sm:p-12 border border-[#d4c3bd]/50 shadow-xs">
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] mb-8 font-medium border-b border-[#d4c3bd]/30 pb-4">
            Request An Appointment
          </h3>

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
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. (555) 019-2831"
                  className="w-full border-b border-[#3C2117]/40 focus:border-[#3C2117] bg-transparent px-0 py-2.5 text-sm text-[#3C2117] focus:outline-none"
                />
              </div>
            </div>

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
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>

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

      </div>
    </section>
  );
};
