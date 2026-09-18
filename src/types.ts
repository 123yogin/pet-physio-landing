export interface ConditionItem {
  id: string;
  title: string;
  category: 'degenerative' | 'post-op' | 'neurological' | 'lifestyle';
  shortDesc: string;
  fullDesc: string;
  symptoms: string[];
  recommendedTherapies: string[];
  expectedRecoveryTime: string;
  imageUrl: string;
  altText: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  suitableFor: string[];
  duration: string;
}

export interface JourneyStep {
  number: string;
  title: string;
  desc: string;
  details: string;
  whatToExpect: string[];
}

export interface SuccessStory {
  id: string;
  petName: string;
  breed: string;
  condition: string;
  quote: string;
  ownerName: string;
  storyDetails: string;
  duration: string;
  imageUrl: string;
  altText: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  credentials: string;
  /** Post-nominals for the card and modal. The full `credentials` list is
   *  long enough to crowd a summary card, so the short form leads and the
   *  profile page carries every qualification. Falls back to `credentials`
   *  when unset. */
  credentialsShort?: string;
  bio: string;
  specialties: string[];
  experienceYears: number;
  imageUrl: string;
  altText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AppointmentData {
  firstName: string;
  lastName: string;
  petName: string;
  speciesBreed: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredSpecialist?: string;
  /** An Appointment.VISIT_TYPES *code*, fetched from the clinic API rather
   *  than hardcoded here -- the site must not be able to offer a service the
   *  booking form would then reject. */
  service?: string;
  reason: string;
  conditionId?: string;
}
