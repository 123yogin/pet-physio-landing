import React from 'react';
import type { ConditionItem } from '../types';
import { CONDITIONS, SERVICES } from '../data/clinicData';
import { PageShell, DetailCta, FactList } from './PageShell';
import { Link, servicePathLink } from './links';
import { conditionPath } from '../seo/routes';

/**
 * Condition detail page.
 *
 * Content order is deliberate for extraction: H1, then a direct one-sentence
 * answer, then the structured facts (symptoms, therapies, recovery outlook) as
 * self-contained blocks. Each section stands alone without needing the previous
 * one — that is what lets an answer engine lift a passage and attribute it.
 */
export const ConditionPage: React.FC<{ condition: ConditionItem }> = ({ condition }) => {
  const relatedServices = SERVICES.filter((service) =>
    condition.recommendedTherapies.some(
      (therapy) =>
        therapy.toLowerCase().includes(service.title.toLowerCase()) ||
        service.title.toLowerCase().includes(therapy.split(' ')[0].toLowerCase()),
    ),
  );

  const otherConditions = CONDITIONS.filter(
    (item) => item.id !== condition.id && item.category === condition.category,
  ).slice(0, 3);

  return (
    <PageShell>
      <article className="max-w-[1280px] mx-auto px-4 sm:px-8 pb-16">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start border-b border-[#d4c3bd]/30 pb-12 mb-12">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-3 block">
              {condition.category} condition
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light leading-tight tracking-tight mb-6">
              {condition.title} Rehabilitation
            </h1>
            {/* Direct answer, first 100 words. */}
            <p className="font-['Inter'] text-lg text-[#504440] font-light leading-relaxed mb-4">
              {condition.shortDesc}
            </p>
            <p className="font-['Inter'] text-base text-[#504440] font-light leading-relaxed">
              {condition.fullDesc}
            </p>
            <dl className="mt-8 inline-flex flex-col gap-1 border-l-2 border-[#84523e] pl-4">
              <dt className="text-xs uppercase tracking-widest text-[#84523e] font-semibold">
                Expected recovery
              </dt>
              <dd className="font-['Inter'] text-sm text-[#3C2117]">{condition.expectedRecoveryTime}</dd>
            </dl>
          </div>

          <div className="lg:col-span-5">
            {condition.imageUrl && (
              <img
              src={condition.imageUrl}
              alt={condition.altText}
              width={800}
              height={600}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full aspect-[4/3] object-cover bg-[#e6e2dc]"
            />
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <FactList title={`Signs of ${condition.title}`} items={condition.symptoms} />
          <FactList title="Therapies we use" items={condition.recommendedTherapies} />
        </div>

        {relatedServices.length > 0 && (
          <section aria-labelledby="related-treatments" className="border-t border-[#d4c3bd]/30 pt-12">
            <h2
              id="related-treatments"
              className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#3C2117] font-light mb-8"
            >
              Treatments used for {condition.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((service) => (
                <Link
                  key={service.id}
                  to={servicePathLink(service.id)}
                  className="group block bg-white p-5 border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-colors"
                >
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg text-[#3C2117] mb-2 font-medium group-hover:text-[#84523e] transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-['Inter'] text-sm text-[#504440] font-light leading-relaxed">
                    {service.shortDesc}
                  </p>
                  <span className="mt-4 block text-xs uppercase tracking-wider text-[#84523e] font-medium">
                    Typical session {service.duration}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {otherConditions.length > 0 && (
          <section aria-labelledby="related-conditions" className="border-t border-[#d4c3bd]/30 mt-16 pt-12">
            <h2
              id="related-conditions"
              className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3C2117] font-light mb-6"
            >
              Related conditions
            </h2>
            <ul className="flex flex-wrap gap-3">
              {otherConditions.map((item) => (
                <li key={item.id}>
                  <Link
                    to={conditionPath(item.id)}
                    className="inline-block px-4 py-2 border border-[#d4c3bd] text-xs uppercase tracking-widest text-[#3C2117] hover:bg-[#3C2117] hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <DetailCta label={`Book an assessment for ${condition.title}`} prefill={condition.title} />
      </article>
    </PageShell>
  );
};
