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
  brandName: PLACEHOLDER('The Pet Physio Vet'),
  legalName: PLACEHOLDER('The Pet Physio Vet'),
  titleSuffix: PLACEHOLDER('The Pet Physio Vet'),
  tagline: PLACEHOLDER('Helping pets move better, recover faster, live happier'),
  description: PLACEHOLDER(
    'Veterinary rehabilitation and physiotherapy clinic offering hydrotherapy, Class IV laser therapy and post-surgical recovery programmes for dogs and cats.',
  ),

  // Must be the real production origin — every canonical URL is built from it.
  origin: PLACEHOLDER('https://www.petphysiovet.com'),

  locale: PLACEHOLDER('en_US'),
  lang: PLACEHOLDER('en'),

  // VeterinaryCare is the most specific LocalBusiness subtype for this vertical.
  schemaType: 'VeterinaryCare',
  additionalSchemaTypes: ['MedicalBusiness', 'LocalBusiness'],

  foundingYear: PLACEHOLDER(2011),
  priceRange: PLACEHOLDER('$$'),
  currency: PLACEHOLDER('USD'),

  contact: {
    phone: PLACEHOLDER('+15550000000'),
    phoneDisplay: PLACEHOLDER('(555) 000-0000'),
    email: PLACEHOLDER('hello@petphysiovet.com'),
    emergencyName: PLACEHOLDER('24/7 Regional Emergency Animal Hospital'),
    emergencyPhone: PLACEHOLDER('+15559990000'),
    emergencyPhoneDisplay: PLACEHOLDER('(555) 999-0000'),
  },

  address: {
    streetAddress: PLACEHOLDER('123 Healing Paws Way, Suite 400'),
    addressLocality: PLACEHOLDER('Wellness District'),
    addressRegion: PLACEHOLDER('CA'),
    postalCode: PLACEHOLDER('90210'),
    addressCountry: PLACEHOLDER('US'),
  },

  geo: PLACEHOLDER({ latitude: 34.0736, longitude: -118.4004 }),

  areaServed: PLACEHOLDER(['Wellness District', 'Greater Metro Area']),

  openingHours: PLACEHOLDER([
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
    { days: ['Sunday'], opens: null, closes: null },
  ]),

  sameAs: PLACEHOLDER([
    // Real, claimed profiles only. Every entry is an entity-resolution signal;
    // a dead or wrong URL is worse than an absent one.
    // 'https://www.facebook.com/…',
    // 'https://www.instagram.com/…',
    // 'https://www.linkedin.com/company/…',
    // 'https://www.google.com/maps/place/?q=place_id:…',
  ]),

  images: {
    logo: PLACEHOLDER(''),
    ogImage: PLACEHOLDER(''),
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
