import React, { useState } from 'react';
import { SUCCESS_STORIES } from '../data/clinicData';
import { SuccessStory } from '../types';
import { Quote, Sparkles } from 'lucide-react';

export const SuccessStories: React.FC = () => {
  const [activeStory, setActiveStory] = useState<SuccessStory | null>(null);

  // "Real outcomes, restored joy" over an empty grid is worse than no section
  // at all. Hooks run first so this stays a legal early return.
  if (SUCCESS_STORIES.length === 0) return null;

  return (
    <section id="success" className="py-20 sm:py-28 bg-[#ffffff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Patient Transformation
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light mb-4">
            Success Stories
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light">
            Real outcomes, restored joy, and active mobility recovered by our dedicated veterinary rehabilitation patients.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {SUCCESS_STORIES.map((story) => (
            <div
              key={story.id}
              className="border-l-2 border-[#3C2117]/30 pl-6 sm:pl-10 py-4 flex flex-col justify-between hover:border-[#3C2117] transition-all bg-[#f8f3ed]/30 p-6"
            >
              <div>
                <Quote className="w-8 h-8 text-[#84523e]/40 mb-4" />
                <p className="font-['Inter'] text-base sm:text-lg text-[#504440] italic font-light leading-relaxed mb-8">
                  {story.quote}
                </p>

                <div className="bg-[#ffffff] p-4 border border-[#d4c3bd]/30 mb-6 text-xs text-[#504440]">
                  <span className="font-semibold text-[#3C2117] block mb-1">Clinical Outcome:</span>
                  {story.storyDetails}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#d4c3bd]/20">
                <div className="flex items-center gap-4">
                  <img
                    src={story.imageUrl}
                    alt={story.altText}
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 object-cover grayscale rounded-none border border-[#d4c3bd]/40"
                  />
                  <div>
                    <h4 className="font-['Plus_Jakarta_Sans'] text-lg text-[#3C2117] font-medium">
                      {story.petName} <span className="text-xs text-[#84523e] font-normal">({story.breed})</span>
                    </h4>
                    <p className="font-['Inter'] text-xs text-[#504440] uppercase tracking-widest mt-0.5">
                      {story.condition} • {story.ownerName}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#f2ede7] text-[#3C2117] px-3 py-1 uppercase tracking-wider border border-[#d4c3bd]/40 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#84523e]" />
                  {story.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
