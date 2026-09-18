/**
 * Home route.
 *
 * Unchanged from the original single-page layout: every section, modal and
 * form-prefill interaction behaves exactly as before. The SEO work here is
 * additive — the section cards now also expose real crawlable hrefs to the
 * standalone detail routes (see ConditionsSection / ServicesSection /
 * SpecialistsSection), while the click still opens the fast in-page modal.
 */
import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustMetrics } from '../components/TrustMetrics';
import { ConditionsSection } from '../components/ConditionsSection';
import { TreatmentJourney } from '../components/TreatmentJourney';
import { ServicesSection } from '../components/ServicesSection';
import { BookableServices } from '../components/BookableServices';

// Same origin in production; overridable in local dev, matching BookingForm.
const CLINIC_API = (import.meta as any).env?.VITE_CLINIC_API_URL ?? '/api/v1';
import { SuccessStories } from '../components/SuccessStories';
import { SpecialistsSection } from '../components/SpecialistsSection';
import { GallerySection } from '../components/GallerySection';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';

// Modals
import { ConditionDetailModal } from '../components/ConditionDetailModal';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { SpecialistDetailModal } from '../components/SpecialistDetailModal';
import { LightboxModal } from '../components/LightboxModal';
import { BookingSuccessModal } from '../components/BookingSuccessModal';

import { ConditionItem, ServiceItem, Specialist, GalleryItem, AppointmentData } from '../types';

export const HomePage: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);


  // Success Modal
  const [successModalData, setSuccessModalData] = useState<AppointmentData | null>(null);
  const [successRefId, setSuccessRefId] = useState<string | null>(null);

  // Booking lives at #book now -- the service tiles, each of which carries its
  // own form. #contact is where the clinic's address and phone are, which is a
  // different question.
  const scrollToBook = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Every "book this" control sends the visitor to the service tiles, because
  // that is the only place a booking can now be made -- each tile opens its own
  // form. These used to stash a prefill string and scroll to a standalone form
  // that no longer exists, which would have left them setting state nobody read
  // and scrolling to the footer.
  const handleBookForCondition = () => scrollToBook();

  // Codes the clinic currently offers the public, from its own API. A card
  // whose code is missing is not rendered, rather than offering a service the
  // booking form would reject.
  const [publicServiceCodes, setPublicServiceCodes] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch(`${CLINIC_API}/appointment-options`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.visit_types) return;
        setPublicServiceCodes(
          d.visit_types.filter((v: { public?: boolean }) => v.public).map((v: { value: string }) => v.value),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBookForService = () => scrollToBook();
  const handleBookWithSpecialist = () => scrollToBook();


  const handleFormSubmitSuccess = (data: AppointmentData, refId: string) => {
    setSuccessModalData(data);
    setSuccessRefId(refId);
  };

  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#3C2117] font-['Inter'] selection:bg-[#3C2117] selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenBooking={scrollToBook}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero
          onOpenBooking={scrollToBook}
        />

        <TrustMetrics />

        {/* Services before Conditions: lead with what the clinic offers, then
            what it treats, and let the journey explain how a course of it runs.
            TreatmentJourney moved down with them rather than staying put --
            it describes the process that follows both, so sitting between them
            would have split "what we do" from "what we treat". */}
        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
        />

        <ConditionsSection
          onSelectCondition={(condition) => setSelectedCondition(condition)}
        />

        <TreatmentJourney />

        <SuccessStories />

        <SpecialistsSection
          onSelectSpecialist={(spec) => setSelectedSpecialist(spec)}
          onOpenBookingWithSpecialist={handleBookWithSpecialist}
        />

        <GallerySection
          onSelectImage={(item) => setSelectedGalleryImage(item)}
        />

        <BookableServices
          availableCodes={publicServiceCodes}
          onSubmitSuccess={handleFormSubmitSuccess}
        />

        {/* No standalone contact block here any more.

            Once the booking form moved into the service cards, all this held
            was a single narrow column of address lines under a full section's
            top and bottom padding -- a screen of empty page for four lines of
            text. The address, phone and hours moved to the footer, which now
            carries the id="contact" the nav links to. */}

        {/* FAQs sit after booking, not before it.

            They answered "do I need a referral?" and "does insurance cover
            this?" -- worth reading, but they were standing between a visitor
            who had decided and the thing they decided to do. Questions belong
            after the ask, for the people who still have one. */}
        <FaqSection />
      </main>

      {/* No <NapBlock /> here, deliberately.

          It exists to put name/address/phone in crawlable text, and on the
          detail pages (via PageShell) it is the only thing that does. The home
          page carries the same three facts in the footer, which renders
          formattedAddress() and the phone from the same siteConfig source. */
      }

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ConditionDetailModal
        condition={selectedCondition}
        onClose={() => setSelectedCondition(null)}
        onBookForCondition={handleBookForCondition}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={handleBookForService}
      />

      <SpecialistDetailModal
        specialist={selectedSpecialist}
        onClose={() => setSelectedSpecialist(null)}
        onBookWithSpecialist={handleBookWithSpecialist}
      />

      <LightboxModal
        item={selectedGalleryImage}
        onClose={() => setSelectedGalleryImage(null)}
      />


      <BookingSuccessModal
        data={successModalData}
        refId={successRefId}
        onClose={() => {
          setSuccessModalData(null);
          setSuccessRefId(null);
        }}
      />
    </div>
  );
};
