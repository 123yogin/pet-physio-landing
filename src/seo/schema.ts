/**
 * JSON-LD generators. Every value comes from siteConfig.ts or clinicData.ts —
 * nothing here is hardcoded content, so swapping the data swaps the markup.
 *
 * Design notes grounded in current guidance:
 *  • One connected @graph per page with stable @id values, rather than several
 *    disconnected blobs — this is what lets the business, its pages, its services
 *    and its people resolve as one entity cluster.
 *  • Markup mirrors content that is actually visible on the page. Marking up
 *    invisible content is a spam-policy violation.
 *  • FAQPage is still emitted for machine comprehension even though Google removed
 *    FAQ *rich results* in May 2026 — it costs nothing and no longer promises a SERP
 *    accordion. Do not treat it as a visibility feature.
 *  • AggregateRating / Review are deliberately NOT emitted: there are no real
 *    reviews in the data. Never mark up ratings you don't have.
 */

import { SITE, absoluteUrl, formattedAddress } from './siteConfig';
import { matchRoute, conditionPath, servicePath, specialistPath, type RouteEntity } from './routes';
import { getPageMeta } from './metadata';
import { CONDITIONS, FAQS, SERVICES, SPECIALISTS, HERO_IMAGE } from '../data/clinicData';
import type { ConditionItem, ServiceItem, Specialist } from '../types';

/** Loosely-typed JSON-LD node. */
type Node = Record<string, unknown>;

// Stable @id anchors. Fragment ids make the graph addressable across pages.
const ID = {
  business: () => `${SITE.origin}/#business`,
  organization: () => `${SITE.origin}/#organization`,
  website: () => `${SITE.origin}/#website`,
  webpage: (path: string) => `${absoluteUrl(path)}#webpage`,
  breadcrumb: (path: string) => `${absoluteUrl(path)}#breadcrumb`,
  service: (id: string) => `${absoluteUrl(servicePath(id))}#service`,
  condition: (id: string) => `${absoluteUrl(conditionPath(id))}#condition`,
  person: (id: string) => `${absoluteUrl(specialistPath(id))}#person`,
  faq: (path: string) => `${absoluteUrl(path)}#faq`,
};

const isCondition = (e: RouteEntity): e is ConditionItem => !!e && 'symptoms' in e;
const isService = (e: RouteEntity): e is ServiceItem => !!e && 'benefits' in e;
const isSpecialist = (e: RouteEntity): e is Specialist => !!e && 'credentials' in e;

function openingHoursSpecification(): Node[] {
  return SITE.openingHours
    .filter((slot) => slot.opens && slot.closes)
    .map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
      opens: slot.opens,
      closes: slot.closes,
    }));
}

/** The business node — the anchor of the whole entity graph. */
export function businessNode(): Node {
  const logo = SITE.images.logo ? absoluteUrl(SITE.images.logo) : undefined;
  return {
    '@type': [SITE.schemaType, ...SITE.additionalSchemaTypes],
    '@id': ID.business(),
    name: SITE.brandName,
    legalName: SITE.legalName,
    description: SITE.description,
    slogan: SITE.tagline,
    url: `${SITE.origin}/`,
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    priceRange: SITE.priceRange,
    currenciesAccepted: SITE.currency,
    foundingDate: String(SITE.foundingYear),
    image: absoluteUrl(SITE.images.ogImage || HERO_IMAGE),
    ...(logo ? { logo: { '@type': 'ImageObject', url: logo } } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    openingHoursSpecification: openingHoursSpecification(),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
    employee: SPECIALISTS.map((p) => ({ '@id': ID.person(p.id) })),
    // Mirrors the visible treatment list, so the graph matches the page.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${SITE.brandName} treatment modalities`,
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@id': ID.service(s.id) },
      })),
    },
    availableService: SERVICES.map((s) => ({ '@id': ID.service(s.id) })),
    knowsAbout: CONDITIONS.map((c) => c.title),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.origin}/#contact`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'Reservation', name: 'Initial rehabilitation assessment' },
    },
  };
}

export function organizationNode(): Node {
  return {
    '@type': 'Organization',
    '@id': ID.organization(),
    name: SITE.brandName,
    url: `${SITE.origin}/`,
    description: SITE.organizationNote,
    ...(SITE.images.logo ? { logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.images.logo) } } : {}),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: SITE.contact.phone,
        email: SITE.contact.email,
        areaServed: SITE.address.addressCountry,
        availableLanguage: SITE.lang,
      },
      {
        '@type': 'ContactPoint',
        contactType: 'emergency',
        name: SITE.contact.emergencyName,
        telephone: SITE.contact.emergencyPhone,
      },
    ],
  };
}

export function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': ID.website(),
    url: `${SITE.origin}/`,
    name: SITE.brandName,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': ID.organization() },
  };
}

function webPageNode(path: string): Node {
  const meta = getPageMeta(path);
  return {
    '@type': 'WebPage',
    '@id': ID.webpage(path),
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    inLanguage: SITE.lang,
    isPartOf: { '@id': ID.website() },
    about: { '@id': ID.business() },
    primaryImageOfPage: { '@type': 'ImageObject', url: meta.image, caption: meta.imageAlt },
    breadcrumb: { '@id': ID.breadcrumb(path) },
  };
}

function breadcrumbNode(path: string): Node {
  const meta = getPageMeta(path);
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: meta.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path.split('#')[0] || '/'),
    })),
  };
}

/** A treatment modality as a schema.org Service. */
export function serviceNode(service: ServiceItem): Node {
  return {
    '@type': 'Service',
    '@id': ID.service(service.id),
    name: service.title,
    description: service.fullDesc,
    url: absoluteUrl(servicePath(service.id)),
    serviceType: service.title,
    category: 'Veterinary rehabilitation',
    provider: { '@id': ID.business() },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    audience: { '@type': 'Audience', audienceType: service.suitableFor.join(', ') },
    hoursAvailable: openingHoursSpecification(),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Typical session length', value: service.duration },
      ...service.benefits.map((b) => ({ '@type': 'PropertyValue', name: 'Benefit', value: b })),
    ],
  };
}

/**
 * A treated condition. MedicalCondition carries the clinical semantics, and the
 * page is typed as MedicalWebPage so the health context is explicit.
 */
export function conditionNode(condition: ConditionItem): Node {
  return {
    '@type': 'MedicalCondition',
    '@id': ID.condition(condition.id),
    name: condition.title,
    description: condition.fullDesc,
    url: absoluteUrl(conditionPath(condition.id)),
    signOrSymptom: condition.symptoms.map((s) => ({ '@type': 'MedicalSignOrSymptom', name: s })),
    possibleTreatment: condition.recommendedTherapies.map((t) => ({
      '@type': 'MedicalTherapy',
      name: t,
    })),
    expectedPrognosis: condition.expectedRecoveryTime,
  };
}

/** A clinician. Credentials are split out so E-E-A-T signals are machine-readable. */
export function personNode(person: Specialist): Node {
  return {
    '@type': 'Person',
    '@id': ID.person(person.id),
    name: person.name,
    url: absoluteUrl(specialistPath(person.id)),
    jobTitle: person.role,
    description: person.bio,
    image: absoluteUrl(person.imageUrl),
    worksFor: { '@id': ID.business() },
    knowsAbout: person.specialties,
    hasCredential: person.credentials
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((credential) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'professional certification',
        name: credential,
      })),
  };
}

export function faqNode(path: string): Node {
  return {
    '@type': 'FAQPage',
    '@id': ID.faq(path),
    isPartOf: { '@id': ID.webpage(path) },
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Assemble the full @graph for a pathname. One script tag per page.
 */
export function buildGraph(pathname: string): Node {
  const { route, entity } = matchRoute(pathname);
  const path = route.path;
  const graph: Node[] = [organizationNode(), websiteNode(), businessNode(), webPageNode(path), breadcrumbNode(path)];

  if (route.kind === 'home') {
    // The home route renders every service, specialist and FAQ, so all are marked up.
    graph.push(...SERVICES.map(serviceNode), ...SPECIALISTS.map(personNode), faqNode(path));
  }

  if (isCondition(entity)) {
    graph.push(conditionNode(entity));
    // Therapies named on the page, linked to the real service entities where they match.
    const related = SERVICES.filter((s) =>
      entity.recommendedTherapies.some((t) => t.toLowerCase().includes(s.title.toLowerCase())),
    );
    graph.push(...related.map(serviceNode));
  }

  if (isService(entity)) {
    graph.push(serviceNode(entity));
  }

  if (isSpecialist(entity)) {
    graph.push(personNode(entity));
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Serialise for a <script type="application/ld+json"> tag, XSS-safe. */
export function serializeGraph(pathname: string): string {
  return JSON.stringify(buildGraph(pathname)).replace(/</g, '\\u003c');
}

/** Convenience for the NAP block so visible text and markup can't drift apart. */
export const napText = { address: formattedAddress };
