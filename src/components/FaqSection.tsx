import React, { useState } from 'react';
import { FAQS } from '../data/clinicData';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faqs" className="py-20 sm:py-28 bg-[#f8f3ed]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
            Clear Guidance
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-['Inter'] text-base text-[#504440] font-light max-w-xl mx-auto">
            Everything you need to know about veterinary rehabilitation referrals, session expectations, and pet insurance coverage.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-10 max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#82746f]" />
          <input
            type="text"
            placeholder="Search questions (e.g., insurance, referral, length)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#ffffff] border border-[#d4c3bd] text-[#3C2117] placeholder:text-[#82746f] text-sm focus:outline-none focus:border-[#3C2117] transition-colors"
          />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#ffffff] border border-[#d4c3bd]/40 transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl text-[#3C2117] font-medium group-hover:text-[#84523e] transition-colors pr-4">
                      {faq.question}
                    </span>
                    <span className={`p-1 text-[#3C2117] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 font-['Inter'] text-sm sm:text-base text-[#504440] font-light leading-relaxed border-t border-[#d4c3bd]/20">
                      <p className="pl-4 border-l-2 border-[#84523e]/50">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#ffffff] p-8 border border-[#d4c3bd]/40">
              <HelpCircle className="w-8 h-8 text-[#82746f] mx-auto mb-3" />
              <p className="text-sm text-[#504440]">No matching questions found. Feel free to contact our team directly!</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
