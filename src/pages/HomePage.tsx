/**
 * Home route.
 *
 * Unchanged from the original single-page layout: every section, modal and
 * form-prefill interaction behaves exactly as before. The SEO work here is
 * additive — the section cards now also expose real crawlable hrefs to the
 * standalone detail routes (see ConditionsSection / ServicesSection /
 * SpecialistsSection), while the click still opens the fast in-page modal.
 */
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustMetrics } from '../components/TrustMetrics';
import { ConditionsSection } from '../components/ConditionsSection';
import { TreatmentJourney } from '../components/TreatmentJourney';
import { ServicesSection } from '../components/ServicesSection';
import { SuccessStories } from '../components/SuccessStories';
import { SpecialistsSection } from '../components/SpecialistsSection';
import { GallerySection } from '../components/GallerySection';
import { FaqSection } from '../components/FaqSection';
import { BookingForm } from '../components/BookingForm';
import { Footer } from '../components/Footer';
import { NapBlock } from '../components/NapBlock';

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


  // Form prefill props
  const [formSpecialist, setFormSpecialist] = useState<string>('');
  const [formCondition, setFormCondition] = useState<string>('');

  // Success Modal
  const [successModalData, setSuccessModalData] = useState<AppointmentData | null>(null);
  const [successRefId, setSuccessRefId] = useState<string | null>(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookForCondition = (conditionTitle: string) => {
    setFormCondition(conditionTitle);
    scrollToContact();
  };

  const handleBookForService = (serviceTitle: string) => {
    setFormCondition(serviceTitle);
    scrollToContact();
  };

  const handleBookWithSpecialist = (specialistName: string) => {
    setFormSpecialist(specialistName);
    scrollToContact();
  };


  const handleFormSubmitSuccess = (data: AppointmentData, refId: string) => {
    setSuccessModalData(data);
    setSuccessRefId(refId);
  };

  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#3C2117] font-['Inter'] selection:bg-[#3C2117] selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenBooking={scrollToContact}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero
          onOpenBooking={scrollToContact}
        />

        <TrustMetrics />

        <ConditionsSection
          onSelectCondition={(condition) => setSelectedCondition(condition)}
        />

        <TreatmentJourney />

        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
        />

        <SuccessStories />

        <SpecialistsSection
          onSelectSpecialist={(spec) => setSelectedSpecialist(spec)}
          onOpenBookingWithSpecialist={handleBookWithSpecialist}
        />

        <GallerySection
          onSelectImage={(item) => setSelectedGalleryImage(item)}
        />

        <FaqSection />

        <BookingForm
          initialSpecialist={formSpecialist}
          initialCondition={formCondition}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </main>

      {/* Crawlable name / address / phone — see NapBlock for why this is in the HTML */}
      <NapBlock />

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
