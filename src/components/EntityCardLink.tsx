import React from 'react';

interface EntityCardLinkProps {
  /** Real destination. Crawlers follow this; it must resolve to a real page. */
  href: string;
  /** Fast in-page behaviour for a plain left click (usually "open the modal"). */
  onActivate: () => void;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

/**
 * Progressive-enhancement card link.
 *
 * The cards previously used `<div onClick>`, which is invisible to crawlers —
 * link discovery follows hrefs, not click handlers, so every condition, treatment
 * and clinician page was unreachable. This renders a real <a href> to the
 * standalone detail route while keeping the instant modal for a plain click.
 *
 * Modified clicks (cmd/ctrl/middle/shift) fall through to the browser so
 * "open in new tab" reaches the real page, as a user would expect.
 */
export const EntityCardLink: React.FC<EntityCardLinkProps> = ({
  href,
  onActivate,
  className,
  children,
  ...rest
}) => (
  <a
    href={href}
    className={className}
    onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onActivate();
    }}
    {...rest}
  >
    {children}
  </a>
);
