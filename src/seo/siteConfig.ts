/**
 * SINGLE SOURCE OF TRUTH for every business fact used by the SEO layer.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠  ALL VALUES BELOW ARE PLACEHOLDERS.
 *
 * The whole site's content is demo data and will be replaced. Nothing in the SEO
 * layer hardcodes any of it — titles, descriptions, canonicals, Open Graph tags,
 * JSON-LD, robots.txt, sitemap.xml and llms.txt are all DERIVED from this file
 * plus `src/data/clinicData.ts`.
 *
 * To go live with real data you edit ONLY two places:
 *   1. this file (business identity / NAP / hours / geo / socials / origin)
 *   2. src/data/clinicData.ts (conditions, services, specialists, FAQs, …)
 *
 * Then run `npm run build`. Every route, tag, schema block and sitemap entry
 * regenerates automatically. See SEO.md.
 *
 * Every placeholder is tagged `@placeholder` so `npm run seo:check` can find
 * anything still unswapped before you deploy.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface OpeningHours {
  /** schema.org DayOfWeek short names */
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
  /** 24h "HH:MM", or null when closed */
  opens: string | null;
  closes: string | null;
}

export interface SiteConfig {
  brandName: string;
  legalName: string;
  /** Short trailing brand used in <title> suffixes. Keep it short — titles cap at ~60 chars. */
  titleSuffix: string;
  tagline: string;
  description: string;
  /** Absolute origin, NO trailing slash. Drives every canonical, OG url and sitemap entry. */
  origin: string;
  locale: string;
  lang: string;
  /** schema.org type for the business. VeterinaryCare is a LocalBusiness subtype. */
  schemaType: string;
  /** Extra @type values merged into the business node. */
  additionalSchemaTypes: string[];
  foundingYear: number;
  priceRange: string;
  currency: string;
  contact: {
    phone: string;
    phoneDisplay: string;
    email: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyPhoneDisplay: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { latitude: number; longitude: number };
  /** Cities / regions actually served. Used for areaServed + local relevance copy. */
  areaServed: string[];
  openingHours: OpeningHours[];
  /** Profiles that establish the brand as a resolvable entity (schema `sameAs`). */
  sameAs: string[];
  images: {
    logo: string;
    /** 1200x630 recommended. Falls back to the hero image when empty. */
    ogImage: string;
    ogImageWidth: number;
    ogImageHeight: number;
  };
  /** Search-console ownership tokens. Empty string = tag omitted. */
  verification: { google: string; bing: string };
  /** Toggle indexing off for staging. `false` emits site-wide noindex + a blocking robots.txt. */
  indexable: boolean;
  /** Search crawlers get full access; training crawlers are a separate decision. See SEO.md. */
  allowAiTrainingCrawlers: boolean;
  organizationNote: string;
}

/** Marker for values that must be replaced before launch. @placeholder */
const PLACEHOLDER = <T,>(value: T): T => value;

export const SITE: SiteConfig = {
  brandName: 'The Pet Physio Vet',
  legalName: 'The Pet Physio Vet',
  titleSuffix: 'The Pet Physio Vet',
  tagline: 'Helping pets move better, recover faster, live happier',
  description:
    'Veterinary physiotherapy and rehabilitation in Ahmedabad. Qualified veterinary '
    + 'physiotherapist (M.V.Sc.) treating mobility problems, post-surgical recovery, '
    + 'arthritis and injury in dogs and cats, with avian and exotic experience. '
    + 'Clinic visits at Sola, Science City Road, and home visits across Ahmedabad.',

  // Must be the real production origin — every canonical URL is built from it.
  origin: 'https://petphysio.vercel.app',

  locale: 'en_IN',
  lang: 'en-IN',

  // VeterinaryCare is the most specific LocalBusiness subtype for this vertical.
  schemaType: 'VeterinaryCare',
  additionalSchemaTypes: ['MedicalBusiness', 'LocalBusiness'],

  foundingYear: 0,
  priceRange: '₹₹',
  currency: 'INR',

  contact: {
    phone: '+919427071031',
    phoneDisplay: '094270 71031',
    email: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyPhoneDisplay: '',
  },

  address: {
    streetAddress: 'Shop No. 6, Shyam Residency, The Trillionaire Road, Science City Road, opposite Horizon Flats, near Divine Highland Bungalows, Sola',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    postalCode: '380060',
    addressCountry: 'IN',
  },

  geo: { latitude: 23.0742381, longitude: 72.5118942 },

  areaServed: ['Ahmedabad', 'Sola', 'Science City', 'Bodakdev', 'Thaltej', 'Gota', 'Chandkheda'],

  // Deliberately empty, and this is a judgement not an omission.
  //
  // Google Business Profile is the authoritative source for opening hours — it
  // is what Maps, the local pack and the knowledge panel actually read, and the
  // owner can change it in seconds without a deploy. The only hour I could
  // verify from the live listing was "closes 7:30 pm" on one weekday; the rest
  // would have been invented.
  //
  // Publishing guessed hours is strictly worse than publishing none: schema
  // that disagrees with the GBP is a conflicting signal Google has to resolve,
  // and someone reads it and turns up to a closed clinic. With this empty the
  // generator omits openingHoursSpecification entirely and Google uses the
  // profile. Fill it in once the real seven-day hours are known.
  openingHours: [],

  sameAs: PLACEHOLDER([
    // Real, claimed profiles only. Every entry is an entity-resolution signal;
    // a dead or wrong URL is worse than an absent one.
    // 'https://www.facebook.com/…',
    'https://www.instagram.com/thepetphysiovet/',
    // 'https://www.linkedin.com/company/…',
    // 'https://www.google.com/maps/place/?q=place_id:…',
  ]),

  images: {
    logo: '/logo-512.png',
    ogImage: '/og-image.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },

  verification: { google: PLACEHOLDER(''), bing: PLACEHOLDER('') },

  indexable: true,
  allowAiTrainingCrawlers: true,

  organizationNote: PLACEHOLDER(
    'Board-certified veterinary rehabilitation practitioners. Referral-based care coordinated with your primary veterinarian.',
  ),
};

/** Join an origin-relative path onto the configured origin. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.origin.replace(/\/$/, '')}${suffix === '/' ? '/' : suffix.replace(/\/$/, '')}`;
}

/** Human-readable one-line address — used in copy and in the NAP block. */
export function formattedAddress(): string {
  const a = SITE.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
}

/** Primary service city, used to localise titles and descriptions. */
export function primaryLocality(): string {
  return SITE.address.addressLocality;
}

/**
 * One-line opening-hours summary for inline copy, e.g.
 * "Mon–Fri 08:00–18:00 | Sat 09:00–14:00".
 *
 * Derived from the same array that produces the openingHoursSpecification in the
 * JSON-LD, so the visible hours and the marked-up hours cannot disagree.
 */
export function openingHoursSummary(): string {
  const short = (day: string) => day.slice(0, 3);
  return SITE.openingHours
    .filter((slot) => slot.opens && slot.closes)
    .map((slot) => {
      const label =
        slot.days.length === 1
          ? short(slot.days[0])
          : `${short(slot.days[0])}\u2013${short(slot.days[slot.days.length - 1])}`;
      return `${label} ${slot.opens}\u2013${slot.closes}`;
    })
    .join(' | ');
}
