import React from 'react';
import { RouterProvider, useRouter } from './seo/router';
import { matchRoute } from './seo/routes';
import { HomePage } from './pages/HomePage';
import { ConditionPage } from './pages/ConditionPage';
import { ServicePage } from './pages/ServicePage';
import { SpecialistPage } from './pages/SpecialistPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LegalPage } from './pages/LegalPage';
import { PRIVACY, TERMS } from './data/legalContent';
import type { ConditionItem, ServiceItem, Specialist } from './types';
import { PageCurtain, CursorBubble, Magnetic, ImageDrift, Tilt, ImageFadeIn } from './motion/extras';
import { SmoothScroll, CursorTrail, ScrollTicks } from './motion';
import { LabProvider } from './lab/Lab';
import { MobileActionBar } from './components/MobileActionBar';

/** Resolve the active route to a page component. */
const RouteView: React.FC = () => {
  const { path } = useRouter();
  const { route, entity } = matchRoute(path);

  switch (route.kind) {
    case 'condition':
      return entity ? <ConditionPage condition={entity as ConditionItem} /> : <NotFoundPage />;
    case 'service':
      return entity ? <ServicePage service={entity as ServiceItem} /> : <NotFoundPage />;
    case 'specialist':
      return entity ? <SpecialistPage specialist={entity as Specialist} /> : <NotFoundPage />;
    case 'privacy':
      return <LegalPage doc={PRIVACY} />;
    case 'terms':
      return <LegalPage doc={TERMS} />;
    case 'home':
      return <HomePage />;
    default:
      return <NotFoundPage />;
  }
};

/**
 * @param initialPath passed by the server renderer during prerendering; in the
 * browser the router reads window.location instead.
 */
export default function App({ initialPath }: { initialPath?: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <LabProvider>
      <RouteView />
      {/* Site-wide motion: behaviour only, nothing rendered at rest except
          the scroll ticks and the pointer trail. */}
      <SmoothScroll />
      <CursorTrail />
      <ScrollTicks />
      <PageCurtain />
      <CursorBubble />
      <Magnetic />
      <ImageDrift />
      <Tilt />
      <ImageFadeIn />
      <MobileActionBar />
      </LabProvider>
    </RouterProvider>
  );
}
