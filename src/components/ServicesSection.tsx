import React from 'react';
import { SERVICES } from '../data/clinicData';
import { ServiceItem } from '../types';
import { ArrowUpRight, Activity, Waves, Zap, Hand, Dumbbell, Home } from 'lucide-react';
import { EntityCardLink } from './EntityCardLink';
import { servicePath } from '../seo/routes';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

const renderServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'healing':
      return <Activity className="w-9 h-9 text-[#3C2117]" />;
    case 'pool':
      return <Waves className="w-9 h-9 text-[#3C2117]" />;
    case 'flashlight_on':
      return <Zap className="w-9 h-9 text-[#3C2117]" />;
    case 'front_hand':
      return <Hand className="w-9 h-9 text-[#3C2117]" />;
    case 'fitness_center':
      return <Dumbbell className="w-9 h-9 text-[#3C2117]" />;
    case 'home':
      return <Home className="w-9 h-9 text-[#3C2117]" />;
    default:
      return <Activity className="w-9 h-9 text-[#3C2117]" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-20 sm:py-28 bg-[#f8f3ed]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-[#d4c3bd]/30 pb-8">
          <div className="md:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
              Treatment Modalities
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light">
              Our Services
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light leading-relaxed">
              Cutting-edge, non-invasive therapeutic modalities performed by certified veterinary specialists.
            </p>
          </div>
        </div>

        {/* Modalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#d4c3bd]/30 border border-[#d4c3bd]/30">
          {SERVICES.map((service) => (
            <EntityCardLink
              key={service.id}
              href={servicePath(service.id)}
              onActivate={() => onSelectService(service)}
              aria-label={`${service.title} treatment details`}
              className="bg-[#f8f3ed] p-8 sm:p-12 hover:bg-[#ffffff] transition-all duration-500 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-[#f2ede7] rounded-full group-hover:bg-[#3C2117]/10 transition-colors">
                    {renderServiceIcon(service.icon)}
                  </div>
                  <span className="p-2 text-[#84523e] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl text-[#3C2117] mb-4 font-medium group-hover:text-[#84523e] transition-colors">
                  {service.title}
                </h3>

                <p className="font-['Inter'] text-sm sm:text-base text-[#504440] font-light leading-relaxed mb-6">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d4c3bd]/20 flex items-center justify-between text-xs font-['Inter'] uppercase tracking-widest text-[#504440]">
                <span>Typical Session: {service.duration}</span>
                <span className="text-[#84523e] font-semibold group-hover:underline">View Modality →</span>
              </div>
            </EntityCardLink>
          ))}
        </div>

      </div>
    </section>
  );
};
