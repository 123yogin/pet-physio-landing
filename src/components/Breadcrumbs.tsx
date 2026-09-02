import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from '../seo/router';

interface BreadcrumbsProps {
  trail: Array<{ name: string; path: string }>;
}

/**
 * Visible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD exactly — the two
 * are generated from the same `getPageMeta().breadcrumbs` array, so markup can
 * never claim a trail the user cannot see.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail }) => {
  if (trail.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-['Inter'] text-[#504440]">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.path}-${index}`} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-[#3C2117] font-medium">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link to={crumb.path} className="hover:text-[#84523e] transition-colors uppercase tracking-wider">
                    {crumb.name}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-[#d4c3bd]" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
