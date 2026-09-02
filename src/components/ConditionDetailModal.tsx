import React from 'react';
import { ConditionItem } from '../types';
import { X, CheckCircle2, Clock, Activity, Calendar } from 'lucide-react';

interface ConditionDetailModalProps {
  condition: ConditionItem | null;
  onClose: () => void;
  onBookForCondition: (title: string) => void;
}

export const ConditionDetailModal: React.FC<ConditionDetailModalProps> = ({
  condition,
  onClose,
  onBookForCondition,
}) => {
  if (!condition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fef9f2] border border-[#d4c3bd] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
          Rehabilitation Protocol • {condition.category}
        </span>

        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-medium mb-4">
          {condition.title}
        </h2>

        {/* Hero image preview inside modal */}
        <div className="aspect-[16/9] w-full overflow-hidden bg-[#e6e2dc] mb-6 border border-[#d4c3bd]/30">
          <img
            src={condition.imageUrl}
            alt={condition.altText}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Full Overview */}
        <div className="space-y-6 font-['Inter']">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-2">
              Condition Overview
            </h3>
            <p className="text-sm sm:text-base text-[#504440] font-light leading-relaxed">
              {condition.fullDesc}
            </p>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
              Common Clinical Symptoms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#504440]">
              {condition.symptoms.map((symptom, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#f8f3ed] p-2.5 border border-[#d4c3bd]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Therapies */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
              Recommended Multimodal Therapies
            </h3>
            <div className="flex flex-wrap gap-2">
              {condition.recommendedTherapies.map((therapy, idx) => (
                <span
                  key={idx}
                  className="bg-[#3C2117] text-white text-xs px-3 py-1.5 uppercase tracking-wider font-medium inline-flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-[#ffbda5]" />
                  {therapy}
                </span>
              ))}
            </div>
          </div>

          {/* Recovery Timeline */}
          <div className="bg-[#f8f3ed] p-4 border-l-2 border-[#3C2117] text-xs text-[#504440]">
            <div className="flex items-center gap-2 font-semibold text-[#3C2117] mb-1">
              <Clock className="w-4 h-4 text-[#84523e]" />
              <span>Expected Rehabilitation Timeline</span>
            </div>
            <p className="font-light">{condition.expectedRecoveryTime}</p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#d4c3bd]/40 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onBookForCondition(condition.title);
              }}
              className="flex-1 bg-[#3C2117] text-white py-3 px-6 text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Assessment For {condition.title}</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-6 border border-[#d4c3bd] text-[#3C2117] text-xs uppercase tracking-widest font-medium hover:bg-[#f2ede7] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
