import React from 'react';
import { GALLERY_ITEMS } from '../data/clinicData';
import { GalleryItem } from '../types';
import { Maximize2 } from 'lucide-react';

interface GallerySectionProps {
  onSelectImage: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectImage }) => {
  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#ffffff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-[#d4c3bd]/30 pb-8">
          <div className="md:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
              Luxury Rehabilitation Facility
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light">
              Our Clinic
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light leading-relaxed">
              A serene, state-of-the-art sanctuary equipped with warm water aquatic suites, non-slip therapeutic flooring, and calm private therapy bays.
            </p>
          </div>
        </div>

        {/* Gallery Masonry */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectImage(item)}
              className="relative group overflow-hidden bg-[#e6e2dc] cursor-pointer border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.altText}
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
                className="w-full rounded-none object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C2117]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#ffbda5] font-semibold mb-1">
                  {item.category}
                </span>
                <h4 className="font-['Plus_Jakarta_Sans'] text-lg font-medium flex items-center justify-between">
                  <span>{item.title}</span>
                  <Maximize2 className="w-4 h-4 text-[#ffffff]" />
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
