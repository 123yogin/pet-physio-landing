import React from 'react';
import { ServiceItem } from '../types';
import { X, CheckCircle2, Clock, Calendar, ShieldCheck } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fef9f2] border border-[#d4c3bd] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative font-['Inter']">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block">
          Therapeutic Modality
        </span>

        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl text-[#3C2117]">
            {service.icon}
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-medium">
            {service.title}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#504440] font-light leading-relaxed mb-6">
          {service.fullDesc}
        </p>

        <div className="space-y-6">
          {/* Key Benefits */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
              Clinical Benefits
            </h3>
            <div className="space-y-2">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#504440]">
                  <CheckCircle2 className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
              Ideal Indications
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.suitableFor.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#f8f3ed] border border-[#d4c3bd]/50 text-[#3C2117] text-xs px-3 py-1 uppercase tracking-wider font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Duration & Protocol */}
          <div className="bg-[#f8f3ed] p-4 border border-[#d4c3bd]/40 flex items-center justify-between text-xs text-[#504440]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#84523e]" />
              <span>Standard Session Length: <strong className="text-[#3C2117]">{service.duration}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[#84523e] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety Calibrated</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#d4c3bd]/40 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onBookService(`Modal Request: ${service.title}`);
              }}
              className="flex-1 bg-[#3C2117] text-white py-3 px-6 text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book {service.title} Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
