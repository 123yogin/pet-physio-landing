import React from 'react';
import { Camera, MapPin, Phone, Mail } from 'lucide-react';
import { SITE, formattedAddress } from '../seo/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#f8f3ed] text-[#3C2117] font-['Inter'] w-full border-t border-[#d4c3bd]/30 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 px-4 sm:px-8 py-16 sm:py-24 max-w-[1280px] mx-auto">
        
        {/* Column 1: Brand */}
        <div className="col-span-1">
          <a href="/#home" className="font-['Plus_Jakarta_Sans'] text-xl font-light text-[#3C2117] mb-6 block tracking-tight">
            {SITE.brandName}
          </a>
          <p className="text-[#504440] mb-8 max-w-sm font-light leading-relaxed text-sm">
            Premium rehabilitation, hydrotherapy, and restorative care for your beloved companions.
          </p>

          {/* Address and phone live here now.

              They used to sit in a standalone contact block on the home page.
              Once the booking form moved into the service cards, that block was
              a lone narrow column under a full section's padding -- a lot of
              empty page holding four lines of text.

              This is not only tidying: it is the page's only crawlable
              name/address/phone, since NapBlock was removed from the home page
              as a duplicate. Moving it had to mean moving it somewhere, not
              deleting it, and a footer is where a visitor looks for an address
              anyway. */}
          <address className="not-italic space-y-4 mb-8 text-sm">
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-[#504440] font-light leading-relaxed">
                {formattedAddress()}
                {SITE.mapUrl && (
                  <>
                    <br />
                    <a
                      href={SITE.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[#84523e] hover:underline font-medium"
                    >
                      Get directions
                    </a>
                  </>
                )}
              </span>
            </div>
            <div className="flex gap-3">
              <Phone className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
              <a
                href={`tel:${SITE.contact.phone}`}
                className="text-[#3C2117] hover:text-[#84523e] transition-colors"
              >
                {SITE.contact.phoneDisplay}
              </a>
            </div>
            {SITE.contact.email && (
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="text-[#3C2117] hover:text-[#84523e] transition-colors break-all"
                >
                  {SITE.contact.email}
                </a>
              </div>
            )}
          </address>

          {/* One real profile, not three href="#" stubs. A Share and a Like
              button that go nowhere are decoration that costs trust: a visitor
              who clicks one learns the site does not work. The clinic has an
              Instagram and no other profile, so that is what is here. */}
          <div className="flex gap-4">
            {SITE.sameAs
              .filter((url) => /instagram\.com/i.test(url))
              .map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="p-2 border border-[#d4c3bd] text-[#3C2117] hover:bg-[#3C2117] hover:text-white transition-colors"
                  aria-label={`${SITE.brandName} on Instagram`}
                >
                  <Camera className="w-4 h-4" />
                </a>
              ))}
          </div>
        </div>

        {/* Column 2: Hours */}
        <div>
          <h4 className="text-xs tracking-widest text-[#84523e] mb-6 uppercase font-semibold">
            Clinic Hours
          </h4>
          {/* openingHours is empty until the clinic confirms which days its
              window covers, and an empty <ul> under a "Clinic Hours" heading is
              what shipped before -- a heading with nothing under it. Fall back
              to the window the clinic did state. */}
          <div className="text-[#3C2117] font-light text-sm space-y-3">
            {SITE.openingHours.length > 0 ? (
              <ul className="space-y-3">
                {SITE.openingHours.map((slot) => (
                  <li key={slot.days.join('-')} className="flex justify-between border-b border-[#3C2117]/10 pb-2">
                    <span>
                      {slot.days.length === 1 ? slot.days[0] : `${slot.days[0]} - ${slot.days[slot.days.length - 1]}`}
                    </span>{' '}
                    {slot.opens && slot.closes ? (
                      <span>{`${slot.opens} - ${slot.closes}`}</span>
                    ) : (
                      <span className="text-[#84523e] font-medium">Closed</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              SITE.serviceHours.window && (
                <p className="border-b border-[#3C2117]/10 pb-2">
                  <span className="block text-[#504440]">{SITE.serviceHours.label}</span>
                  <span className="font-medium">{SITE.serviceHours.window}</span>
                </p>
              )
            )}
            {SITE.serviceHours.appointmentOnly && (
              <p className="text-[#84523e] font-medium">By appointment only</p>
            )}
            <p className="text-[#504440] leading-relaxed">
              Call to confirm a time before you travel.
            </p>
            {/* Carried over from the NapBlock that used to sit above this
                footer on detail pages. It is the only visible statement of the
                areas the clinic covers; schema areaServed is not something a
                person reads. */}
            {SITE.areaServed.length > 0 && (
              <p className="text-[#504440] leading-relaxed pt-2 text-xs">
                Serving {SITE.areaServed.join(', ')}.
              </p>
            )}
          </div>
        </div>

        {/* Column 3: Emergency */}
        <div>
          <h4 className="text-xs tracking-widest text-[#84523e] mb-6 uppercase font-semibold">
            Emergency Care
          </h4>
          <p className="text-[#504440] font-light mb-4 text-sm leading-relaxed">
            {SITE.contact.emergencyPhone
              ? 'For urgent questions about a patient of ours, outside clinic hours:'
              : 'If your pet needs urgent attention:'}
          </p>
          {/* No emergency number has been supplied, and this block used to
              render the bare string ": " above an empty tel: link -- a dead
              phone link on the one line where a dead phone link does real harm.
              Until the clinic names an out-of-hours contact, say the true and
              useful thing instead. */}
          {SITE.contact.emergencyPhone && (
            <p className="font-medium text-[#3C2117] text-sm bg-[#ffffff] p-3 border border-[#d4c3bd]/40 mb-4">
              {SITE.contact.emergencyName}
              {SITE.contact.emergencyName && ': '}
              <br />
              <a
                href={`tel:${SITE.contact.emergencyPhone}`}
                className="text-[#84523e] hover:underline font-semibold"
              >
                {SITE.contact.emergencyPhoneDisplay}
              </a>
            </p>
          )}
          {/* Shown whether or not a number is published. The clinic's number
              IS the out-of-hours contact, but this is a weekday 09:30-13:30
              physiotherapy practice, not a 24-hour hospital -- and a number
              under an "Emergency Care" heading reads as a promise to answer.
              Saying what the practice is not costs nothing and could matter. */}
          <p className="text-[#504440] text-sm font-light leading-relaxed">
            This is a physiotherapy and rehabilitation practice, not a 24-hour
            emergency hospital. If your pet is in distress, contact your regular
            veterinary surgeon or a nearby emergency hospital straight away
            rather than waiting for an appointment here.
          </p>
        </div>

        {/* Column 4: Legal & Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs tracking-widest text-[#84523e] mb-3 uppercase font-semibold">
            Information
          </h4>
          <a href="/#services" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Treatment Modalities</a>
          <a href="/#conditions" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Conditions We Treat</a>
          <a href="/#about" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Our Specialists</a>
          <a href="/privacy" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Privacy Policy</a>
          <a href="/terms" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Terms of Service</a>
        </div>

      </div>

      <div className="border-t border-[#d4c3bd]/30 py-8 text-center text-[#504440] font-light text-xs tracking-wide">
        © {new Date().getFullYear()} {SITE.brandName}. All rights reserved.
        {/* Deliberately discreet. Pet owners and clinic staff share one login —
            the account's role decides which portal they land in. Hiding this
            link would add no security (the route is public regardless), it
            would just make staff hunt for the URL. */}
        <span className="mx-2 text-[#d4c3bd]">·</span>
        <a
          href="/app/login"
          className="underline underline-offset-4 hover:text-[#84523e] transition-colors"
        >
          Staff &amp; client login
        </a>
      </div>
    </footer>
  );
};
