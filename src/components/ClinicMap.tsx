import React from 'react';
// Leaflet's stylesheet, bundled at build. It is entirely .leaflet-* scoped, so
// it cannot bleed into the rest of the page; importing it here (rather than as
// a dynamic import) keeps tsc happy and Vite still splits it into its own chunk.
import 'leaflet/dist/leaflet.css';
import { SITE, formattedAddress } from '../seo/siteConfig';

/**
 * The clinic's location on an OpenStreetMap map.
 *
 * Free and open source, and no API key: Leaflet (BSD-2) is bundled from npm, so
 * no third-party SCRIPT ever loads -- only the map TILES come from OSM. That
 * matters here because this site otherwise contacts almost nobody, and the
 * privacy page enumerates the hosts it does; tile.openstreetmap.org is listed
 * there for this reason.
 *
 * The map is lazy: nothing is fetched until it scrolls into view. It sits in
 * the footer, so a visitor who never reaches the bottom -- or who lands on a
 * deep condition page and leaves -- never touches OSM at all. Same discipline
 * as the gallery reels.
 *
 * Leaflet's default marker is a PNG whose path breaks under a bundler; rather
 * than shim the asset URL, the marker is a divIcon (pure HTML/CSS), which also
 * lets it carry the brand colour. OSM's tile usage policy requires the "©
 * OpenStreetMap contributors" attribution, which Leaflet renders by default --
 * it is deliberately left in place.
 */
export const ClinicMap: React.FC = () => {
  const holder = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  // Only start loading Leaflet + tiles once the map is near the viewport.
  React.useEffect(() => {
    const el = holder.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  React.useEffect(() => {
    if (!visible || !holder.current) return;
    let map: import('leaflet').Map | null = null;
    let cancelled = false;

    // Dynamic import so Leaflet's ~40KB is not in the initial bundle and is
    // fetched only when the map is actually shown.
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !holder.current) return;

      const { latitude, longitude } = SITE.geo;
      map = L.map(holder.current, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false, // don't hijack the page scroll
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html:
          '<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;'
          + 'background:#84523e;border:2px solid #fef9f2;transform:rotate(-45deg);'
          + 'box-shadow:0 2px 6px rgba(60,33,23,.4)"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 22],
        popupAnchor: [0, -22],
      });

      L.marker([latitude, longitude], { icon, title: SITE.brandName })
        .addTo(map)
        .bindPopup(`<strong>${SITE.brandName}</strong><br>${formattedAddress()}`);
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [visible]);

  return (
    <div className="mt-2">
      <div
        ref={holder}
        role="img"
        aria-label={`Map showing ${SITE.brandName} at ${formattedAddress()}`}
        className="w-full h-56 bg-[#e6e2dc] border border-[#d4c3bd]/40 overflow-hidden"
      />
      {SITE.mapUrl && (
        <a
          href={SITE.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[#84523e] hover:underline font-medium text-sm"
        >
          Open in Google Maps for directions &rarr;
        </a>
      )}
    </div>
  );
};
