import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight, Activity, ArrowLeft } from 'lucide-react';

interface MobilityQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (summary: string) => void;
}

export const MobilityQuizModal: React.FC<MobilityQuizModalProps> = ({
  isOpen,
  onClose,
  onCompleteQuiz,
}) => {
  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState('Dog');
  const [ageGroup, setAgeGroup] = useState('Senior (7+ yrs)');
  const [primaryIssue, setPrimaryIssue] = useState('Stiffness after rest / Arthritis');
  const [severity, setSeverity] = useState('Noticeable daily stiffness');

  if (!isOpen) return null;

  const handleFinish = () => {
    const summary = `Mobility Checker Result: ${petType} (${ageGroup}), Issue: ${primaryIssue}, Severity: ${severity}. Recommended: Combined Hydrotherapy & Class IV Laser protocol.`;
    onCompleteQuiz(summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fef9f2] border border-[#d4c3bd] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative font-['Inter']">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#84523e]" />
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold">
            30-Second Pet Mobility Self-Checker
          </span>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-[#e6e2dc] h-1.5 mb-6">
          <div
            className="bg-[#3C2117] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-medium">
              Tell us about your companion
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
                Pet Species
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Dog', 'Cat'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPetType(type)}
                    className={`py-3 px-4 text-sm font-medium border cursor-pointer transition-all ${
                      petType === type
                        ? 'bg-[#3C2117] text-white border-[#3C2117]'
                        : 'bg-[#ffffff] text-[#504440] border-[#d4c3bd]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#84523e] mb-3">
                Age Stage
              </label>
              <div className="space-y-2">
                {['Puppy / Young (< 2 yrs)', 'Adult (2 - 7 yrs)', 'Senior (7+ yrs)'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(age)}
                    className={`w-full text-left p-3 text-sm font-medium border cursor-pointer transition-all ${
                      ageGroup === age
                        ? 'bg-[#3C2117] text-white border-[#3C2117]'
                        : 'bg-[#ffffff] text-[#504440] border-[#d4c3bd]'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#3C2117] text-white text-xs uppercase tracking-widest font-medium cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-medium">
              What primary mobility change have you observed?
            </h3>

            <div className="space-y-2.5">
              {[
                'Stiffness after rest / Arthritis signs',
                'Recent orthopedic surgery (TPLO/FHO)',
                'Hind leg weakness / IVDD spinal concern',
                'Limping or shortened stride length',
                'Difficulty climbing stairs or jumping',
                'Overweight & reduced stamina',
              ].map((issue) => (
                <button
                  key={issue}
                  onClick={() => setPrimaryIssue(issue)}
                  className={`w-full text-left p-3 text-sm font-medium border cursor-pointer transition-all ${
                    primaryIssue === issue
                      ? 'bg-[#3C2117] text-white border-[#3C2117]'
                      : 'bg-[#ffffff] text-[#504440] border-[#d4c3bd]'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-[#d4c3bd] text-[#3C2117] text-xs uppercase tracking-widest font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#3C2117] text-white text-xs uppercase tracking-widest font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-medium">
              How severe or frequent is the discomfort?
            </h3>

            <div className="space-y-2.5">
              {[
                'Mild / Intermittent after vigorous exercise',
                'Noticeable daily stiffness in morning or evening',
                'Severe / Non-weight bearing on one limb',
                'Post-surgical cage rest recovery phase',
              ].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`w-full text-left p-3 text-sm font-medium border cursor-pointer transition-all ${
                    severity === sev
                      ? 'bg-[#3C2117] text-white border-[#3C2117]'
                      : 'bg-[#ffffff] text-[#504440] border-[#d4c3bd]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 border border-[#d4c3bd] text-[#3C2117] text-xs uppercase tracking-widest font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-[#3C2117] text-white text-xs uppercase tracking-widest font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Generate Recommendations</span>
                <Sparkles className="w-4 h-4 text-[#ffbda5]" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-[#3C2117] text-white p-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#ffbda5] font-semibold block mb-1">
                Custom Care Recommendation Result
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-medium mb-1">
                Targeted Multimodal Rehab Indicated
              </h3>
              <p className="text-xs text-[#d4c3bd] font-light">
                For {petType} ({ageGroup}) presenting with {primaryIssue}
              </p>
            </div>

            <div className="bg-[#f8f3ed] p-4 border border-[#d4c3bd]/50 space-y-3 text-xs text-[#504440]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" />
                <span>
                  <strong>Primary Modalities:</strong> Hydrotherapy Underwater Treadmill + Class IV Laser Photobiomodulation.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" />
                <span>
                  <strong>Expected Frequency:</strong> 1-2 sessions per week for initial 6 weeks.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#84523e] shrink-0 mt-0.5" />
                <span>
                  <strong>Recommended Intake:</strong> 60-Minute Comprehensive Biomechanical Assessment.
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-[#3C2117] text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#504440] transition-colors cursor-pointer"
            >
              Transfer Results to Appointment Form →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
