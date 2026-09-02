import React from 'react';
import { Share2, ThumbsUp, Camera } from 'lucide-react';
import { SITE } from '../seo/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8f3ed] text-[#3C2117] font-['Inter'] w-full border-t border-[#d4c3bd]/30 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 px-4 sm:px-8 py-16 sm:py-24 max-w-[1280px] mx-auto">
        
        {/* Column 1: Brand */}
        <div className="col-span-1">
          <a href="/#home" className="font-['Plus_Jakarta_Sans'] text-xl font-light text-[#3C2117] mb-6 block tracking-tight">
            {SITE.brandName}
          </a>
          <p className="text-[#504440] mb-8 max-w-sm font-light leading-relaxed text-sm">
            Premium rehabilitation, hydrotherapy, and restorative care for your beloved companions.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 border border-[#d4c3bd] text-[#3C2117] hover:bg-[#3C2117] hover:text-white transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-[#d4c3bd] text-[#3C2117] hover:bg-[#3C2117] hover:text-white transition-colors" aria-label="Like">
              <ThumbsUp className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-[#d4c3bd] text-[#3C2117] hover:bg-[#3C2117] hover:text-white transition-colors" aria-label="Instagram">
              <Camera className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Hours */}
        <div>
          <h4 className="text-xs tracking-widest text-[#84523e] mb-6 uppercase font-semibold">
            Clinic Hours
          </h4>
          <ul className="space-y-3 text-[#3C2117] font-light text-sm">
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
        </div>

        {/* Column 3: Emergency */}
        <div>
          <h4 className="text-xs tracking-widest text-[#84523e] mb-6 uppercase font-semibold">
            Emergency Care
          </h4>
          <p className="text-[#504440] font-light mb-4 text-sm leading-relaxed">
            If your pet requires immediate emergency medical attention outside of clinic hours, please contact:
          </p>
          <p className="font-medium text-[#3C2117] text-sm bg-[#ffffff] p-3 border border-[#d4c3bd]/40">
            {SITE.contact.emergencyName}: <br />
            <a
              href={`tel:${SITE.contact.emergencyPhone}`}
              className="text-[#84523e] hover:underline font-semibold"
            >
              {SITE.contact.emergencyPhoneDisplay}
            </a>
          </p>
        </div>

        {/* Column 4: Legal & Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs tracking-widest text-[#84523e] mb-3 uppercase font-semibold">
            Information
          </h4>
          <a href="/#conditions" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Conditions We Treat</a>
          <a href="/#services" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Treatment Modalities</a>
          <a href="/#about" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Our Specialists</a>
          <a href="#" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Privacy Policy</a>
          <a href="#" className="text-[#3C2117] hover:text-[#84523e] transition-colors font-light text-sm">Terms of Service</a>
        </div>

      </div>

      <div className="border-t border-[#d4c3bd]/30 py-8 text-center text-[#504440] font-light text-xs tracking-wide">
        © {new Date().getFullYear()} {SITE.brandName}. All rights reserved.
      </div>
    </footer>
  );
};
