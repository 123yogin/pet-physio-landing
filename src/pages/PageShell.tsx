import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NapBlock } from '../components/NapBlock';
import { useRouter } from '../seo/router';
import { getPageMeta } from '../seo/metadata';

/**
 * Layout for the standalone detail routes.
 *
 * Detail pages deliberately do NOT reuse the home layout. Rendering the whole
 * homepage behind a modal for every condition would create a set of near-duplicate
 * pages differing only by one block — the classic thin/duplicate template problem.
 * Each detail route gets its own unique main content instead.
 */
export const PageShell: React.FC<{ children: React.ReactNode; napHeading?: string }> = ({
  children,
  napHeading,
}) => {
  const { path, navigate } = useRouter();
  const meta = getPageMeta(path);

  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#3C2117] font-['Inter'] selection:bg-[#3C2117] selection:text-white flex flex-col">
      <Navbar onOpenBooking={() => navigate('/#book')} />
      <Breadcrumbs trail={meta.breadcrumbs} />
      <main className="flex-grow">{children}</main>
      <NapBlock heading={napHeading} />
      <Footer />
    </div>
  );
};

/** Shared CTA used at the foot of every detail page. */
export const DetailCta: React.FC<{ label: string; prefill?: string }> = ({ label, prefill }) => {
  const { navigate } = useRouter();
  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-4">
      <a
        href={`/#book${prefill ? `?reason=${encodeURIComponent(prefill)}` : ''}`}
        onClick={(event) => {
          event.preventDefault();
          navigate('/#book');
        }}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#3C2117] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#84523e] transition-colors"
      >
        {label}
      </a>
      <a
        href="/#conditions"
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#3C2117] text-[#3C2117] text-xs uppercase tracking-widest font-medium hover:bg-[#3C2117] hover:text-white transition-colors"
      >
        Browse all conditions
      </a>
    </div>
  );
};

/** Consistent bulleted list block used across detail templates. */
/** A titled list. Renders nothing at all when there is nothing to list --
 *  an empty array previously still drew the heading, leaving a section label
 *  floating above blank space. Handled here rather than at each call site so
 *  the condition and specialist pages get it too. */
export const FactList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  items.length === 0 ? null :
  <div>
    <h2 className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-4">{title}</h2>
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 font-['Inter'] text-sm text-[#504440] font-light leading-relaxed">
          <span aria-hidden="true" className="mt-2 w-1 h-1 bg-[#84523e] shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);
