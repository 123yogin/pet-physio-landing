import React from 'react';

export const TrustMetrics: React.FC = () => {
  const metrics = [
    { number: '500+', label: 'Happy Pets Restored' },
    { number: '10k', label: 'Therapy Sessions Completed' },
    { number: '2+', label: 'Years Clinical Experience' },
    { number: '98%', label: 'Patient Success Rate' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#ffffff] border-b border-[#d4c3bd]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
        {metrics.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <span className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl text-[#3C2117] mb-2 sm:mb-4 font-light tracking-tight group-hover:scale-105 transition-transform">
              {item.number}
            </span>
            <span className="font-['Inter'] text-xs sm:text-sm uppercase tracking-widest text-[#504440] font-medium max-w-[160px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
