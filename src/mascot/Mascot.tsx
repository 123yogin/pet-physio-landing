/**
 * Picks the dog mascot concept from the design lab and lazy-loads it, so the
 * mascot never adds to the main bundle and nothing loads when it is off.
 * Hidden while the booking panel is open: it must never sit over the form.
 */
import React, { lazy, Suspense } from 'react';
import { useLab } from '../lab/Lab';
import { useRouter } from '../seo/router';

const concepts: Record<string, React.LazyExoticComponent<React.FC>> = {
  line: lazy(() => import('./DogLine').then((m) => ({ default: m.DogLine }))),
  flat: lazy(() => import('./DogFlat').then((m) => ({ default: m.DogFlat }))),
  silhouette: lazy(() => import('./DogSilhouette').then((m) => ({ default: m.DogSilhouette }))),
};

export const Mascot: React.FC = () => {
  const { dog } = useLab();
  const { search } = useRouter();
  const Concept = concepts[dog];
  if (!Concept || new URLSearchParams(search).has('book')) return null;
  return (
    <Suspense fallback={null}>
      <Concept />
    </Suspense>
  );
};
