/**
 * The things a visitor can actually book, and what each one includes.
 *
 * This is a different list from SERVICES in clinicData.ts, and the difference
 * matters. SERVICES describes the clinic's *therapy menu* -- manual work,
 * electro-physical equipment, and so on -- which is what a clinician does.
 * This is what a pet owner asks for. "Grooming" and "Walking" are not
 * therapies at all, and "Physiotherapy" as a booking covers several of the
 * therapies listed over there.
 *
 * Every `code` is an Appointment.VISIT_TYPES value, so pressing Book on a card
 * selects that exact service in the form and the clinic receives a code its own
 * booking screen already understands. Codes are checked against the live
 * /appointment-options response at render time rather than trusted: a card for
 * a service the clinic has retired should disappear, not post a value the API
 * would reject.
 *
 * The inclusions are the clinic's own words from its service notes. Nothing
 * clinical is invented here -- where the notes say only "Physiotherapy", this
 * lists the therapies from the same notes rather than describing what they
 * achieve.
 */

export interface BookableService {
  /** Appointment.VISIT_TYPES code. */
  code: string;
  title: string;
  /** One line under the title. */
  summary: string;
  /** What the visitor gets. The clinic's wording. */
  includes: string[];
  /** Shown as a quiet note under the list; omit when there is nothing to add. */
  note?: string;
  /** lucide-react icon name, mapped in the section component. */
  icon: string;
}

export const BOOKABLE_SERVICES: BookableService[] = [
  {
    code: 'IndoorFacility',
    title: 'Indoor Facility',
    summary: 'Supervised time for your pet in our indoor facility, booked by the hour between 9:30 AM and 1:30 PM.',
    includes: [
      'Supervised care, 9:30 AM \u2013 1:30 PM',
      'Under experienced vet observation',
      'Indoor facility for physiotherapy patients',
    ],
    note: 'Offered alongside a course of physiotherapy. Ask us and we will confirm what suits your pet.',
    icon: 'bed',
  },
  {
    code: 'Physiotherapy',
    title: 'Physiotherapy',
    summary: 'Hands-on and equipment-assisted rehabilitation, planned for one animal.',
    includes: [
      'Massage and therapeutic exercise',
      'Strength training and acupressure',
      'Pulsed electro-magnetic field (PEMF)',
      'Class IV laser and ultrasound therapy',
      'TENS, NMES and electro-acupuncture',
    ],
    icon: 'activity',
  },
  {
    code: 'Hydrotherapy',
    title: 'Swimming',
    summary: 'Supported swimming in the clinic’s indoor pool.',
    includes: [
      'Indoor swimming pool',
      'Lukewarm water',
      'Clean, filtered water',
      'Under the observation of the vet',
    ],
    icon: 'waves',
  },
  {
    code: 'Grooming',
    title: 'Grooming',
    summary: 'Drying, coat care and a massage before the bath.',
    includes: [
      'After swimming — drying',
      'Geriatric dogs’ special grooming care',
      'Herbal care',
      'Oiling massage before bath',
    ],
    icon: 'sparkles',
  },
  {
    code: 'Walking',
    title: 'Walking',
    summary: 'Walks with professional walkers who watch how your pet is doing.',
    includes: [
      'Professional walkers',
      'Urine and faeces observed',
      'No cellphone while walking',
    ],
    icon: 'footprints',
  },
];
