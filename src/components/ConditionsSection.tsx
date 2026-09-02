import React, { useState } from 'react';
import { CONDITIONS } from '../data/clinicData';
import { ConditionItem } from '../types';
import { ArrowRight, Info } from 'lucide-react';
import { EntityCardLink } from './EntityCardLink';
import { conditionPath } from '../seo/routes';

interface ConditionsSectionProps {
  onSelectCondition: (condition: ConditionItem) => void;
}

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({ onSelectCondition }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Conditions' },
    { id: 'degenerative', label: 'Degenerative & Joint' },
    { id: 'post-op', label: 'Post-Surgical' },
    { id: 'neurological', label: 'Neurological & Spinal' },
    { id: 'lifestyle', label: 'Senior & Lifestyle' },
  ];

  const filteredConditions = selectedCategory === 'all'
    ? CONDITIONS
    : CONDITIONS.filter(c => c.category === selectedCategory);

  return (
    <section id="conditions" className="py-20 sm:py-28 bg-[#f8f3ed]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-12 sm:mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-[#d4c3bd]/30 pb-8">
          <div className="md:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
              Targeted Rehabilitation
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light">
              Conditions We Treat
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light leading-relaxed">
              Expert physical therapy and custom rehabilitation protocols tailored to your pet's precise medical profile.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs uppercase tracking-widest transition-all font-['Inter'] cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#3C2117] text-[#ffffff] font-medium shadow-xs'
                  : 'bg-[#ffffff] text-[#504440] hover:bg-[#ece7e2] border border-[#d4c3bd]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-16">
          {filteredConditions.map((condition) => (
            <EntityCardLink
              key={condition.id}
              href={conditionPath(condition.id)}
              onActivate={() => onSelectCondition(condition)}
              aria-label={`${condition.title} rehabilitation`}
              className="group cursor-pointer flex flex-col justify-between h-full bg-[#ffffff] p-4 sm:p-5 border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-all hover:shadow-md"
            >
              <div>
                <div className="aspect-[4/3] relative overflow-hidden mb-5 bg-[#e6e2dc]">
                  <img
                    src={condition.imageUrl}
                    alt={condition.altText}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[10%]"
                  />
                  <div className="absolute top-3 right-3 bg-[#fef9f2]/90 backdrop-blur-xs p-1.5 rounded-full text-[#3C2117] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-4 h-4" />
                  </div>
                </div>

                <span className="text-[10px] uppercase tracking-widest text-[#84523e] font-semibold mb-1 block">
                  {condition.category}
                </span>

                <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl text-[#3C2117] mb-2 font-medium group-hover:text-[#84523e] transition-colors">
                  {condition.title}
                </h3>

                <p className="font-['Inter'] text-sm text-[#504440] font-light leading-relaxed mb-4">
                  {condition.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#d4c3bd]/20 flex items-center justify-between text-xs font-medium text-[#3C2117] group-hover:translate-x-1 transition-transform">
                <span className="uppercase tracking-wider">Learn Protocol</span>
                <ArrowRight className="w-4 h-4 text-[#84523e]" />
              </div>
            </EntityCardLink>
          ))}
        </div>

      </div>
    </section>
  );
};
