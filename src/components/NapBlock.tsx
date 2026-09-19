import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { SITE, formattedAddress } from '../seo/siteConfig';

const dayLabel = (days: readonly string[]): string =>
  days.length === 1 ? days[0] : `${days[0]} – ${days[days.length - 1]}`;

/**
 * Name / Address / Phone in crawlable text.
 *
 * This exists because NAP rendered only inside a client-side component is
 * invisible to the HTML-only crawlers that feed AI answers, and local pack
 * relevance depends on the address being machine-readable on the page — not just
 * in the JSON-LD. Values come from siteConfig, the same source the schema uses,
 * so the visible text and the markup cannot disagree.
 */
export const NapBlock: React.FC<{ heading?: string }> = ({ heading = 'Visit the clinic' }) => (
  <section aria-labelledby="nap-heading" className="border-t border-[#d4c3bd]/30 bg-[#f8f3ed]">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-14 sm:py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h2 id="nap-heading" className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-light mb-4">
          {heading}
        </h2>
        <p className="font-['Inter'] text-sm text-[#504440] font-light leading-relaxed">
          {SITE.organizationNote}
        </p>
      </div>

      <address className="not-italic font-['Inter'] text-sm text-[#3C2117] space-y-4">
        <div className="flex gap-3">
          <MapPin className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong className="font-medium">{SITE.brandName}</strong>
            <br />
            {formattedAddress()}
            {SITE.mapUrl && (
              <>
                <br />
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[#84523e] hover:underline font-medium"
                >
                  Get directions
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </>
            )}
          </span>
        </div>
        <div className="flex gap-3">
          <Phone className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
          <a href={`tel:${SITE.contact.phone}`} className="hover:text-[#84523e] transition-colors">
            {SITE.contact.phoneDisplay}
          </a>
        </div>
        <div className="flex gap-3">
          <Mail className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
          <a href={`mailto:${SITE.contact.email}`} className="hover:text-[#84523e] transition-colors">
            {SITE.contact.email}
          </a>
        </div>
      </address>

      <div className="font-['Inter'] text-sm text-[#3C2117]">
        <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-4">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Opening hours
        </h3>
        {/* Days are not established yet, so there is no table to draw. Show
            the window the clinic actually stated rather than an empty list. */}
        {SITE.openingHours.length > 0 ? (
          <ul className="space-y-2 font-light">
            {SITE.openingHours.map((slot) => (
              <li key={slot.days.join('-')} className="flex justify-between gap-4 border-b border-[#3C2117]/10 pb-1.5">
                <span>{dayLabel(slot.days)}</span>
                <span>{slot.opens && slot.closes ? `${slot.opens} – ${slot.closes}` : 'Closed'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="font-light space-y-2">
            {SITE.serviceHours.window && (
              <p className="flex justify-between gap-4 border-b border-[#3C2117]/10 pb-1.5">
                <span>{SITE.serviceHours.label}</span>
                <span className="font-medium">{SITE.serviceHours.window}</span>
              </p>
            )}
            {SITE.serviceHours.appointmentOnly && (
              <p className="text-[#84523e] font-medium pt-1">By appointment only</p>
            )}
            <p className="text-[#504440] leading-relaxed pt-1">
              Please call to book before you travel.
            </p>
          </div>
        )}
        <p className="mt-5 text-xs text-[#504440] font-light leading-relaxed">
          Serving {SITE.areaServed.join(', ')}.
        </p>
      </div>
    </div>
  </section>
);
