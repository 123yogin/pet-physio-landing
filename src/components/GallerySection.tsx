import React from 'react';
import { GALLERY_ITEMS } from '../data/clinicData';
import { GalleryItem } from '../types';
import { Maximize2, Play } from 'lucide-react';

interface GallerySectionProps {
  onSelectImage: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectImage }) => {
  // Read once rather than per tile. matchMedia is unavailable during the
  // server render, so this starts false and corrects on hydration.
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#ffffff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-[#d4c3bd]/30 pb-8">
          <div className="md:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#84523e] font-semibold mb-2 block font-['Inter']">
              Luxury Rehabilitation Facility
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-[#3C2117] font-light">
              Our Clinic
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="font-['Inter'] text-base sm:text-lg text-[#504440] font-light leading-relaxed">
              A serene, state-of-the-art sanctuary equipped with warm water aquatic suites, non-slip
              therapeutic flooring, and calm private therapy bays.
            </p>
          </div>
        </div>

        {/* Two marquee rows drifting in opposite directions.

            Each row renders its items TWICE and translates by exactly -50%, so
            the second copy is under the cursor at the instant the first has
            finished -- that is what makes it seamless rather than snapping back.
            `aria-hidden` on the duplicate keeps a screen reader from reading the
            whole gallery twice.

            The animation is paused on hover, and the whole thing falls back to
            a plain wrapped row under prefers-reduced-motion. Neither is polish:
            the tiles open a lightbox on click, and clicking a moving target is
            genuinely hard -- and permanent motion on a page is a real problem
            for some people rather than a taste. */}
        <div className="-mx-4 sm:-mx-8 space-y-6 overflow-hidden motion-reduce:overflow-visible">
          {[0, 1].map((rowIndex) => {
            const row = GALLERY_ITEMS.filter((_, i) => i % 2 === rowIndex);
            return (
              <div
                key={rowIndex}
                className="group/row flex w-max gap-6 motion-safe:animate-marquee motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center hover:[animation-play-state:paused]"
                style={{
                  animationDirection: rowIndex === 1 ? 'reverse' : 'normal',
                  animationDuration: rowIndex === 1 ? '46s' : '38s',
                }}
              >
                {[...row, ...row].map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    aria-hidden={i >= row.length}
                    onClick={() => onSelectImage(item)}
                    className="relative group shrink-0 w-[240px] sm:w-[300px] overflow-hidden bg-[#e6e2dc] cursor-pointer border border-[#d4c3bd]/30 hover:border-[#3C2117] transition-all"
                  >
                    {/* Portrait tiles, because every asset is portrait.

                        The tile used to be 380x260 landscape while the
                        photographs are 3:4 and the reels 9:16 -- so everything
                        in this gallery was being centre-cropped by a landscape
                        box, slicing heads off and cutting the reels' burned-in
                        captions mid-word. The tile is now 3:4, the photographs
                        fit it exactly, and the reel loops are re-encoded to the
                        same 3:4 rather than squeezed into it.

                        A reel plays its own small loop, continuously.

                        The loop is a separate, smaller rendition: 12 seconds,
                        360px wide, no audio, about 1.9MB for all four. Playing
                        the full reels here instead would have downloaded ~15MB
                        and decoded four audio tracks before anyone asked to
                        watch anything. The full reel, with sound, is fetched
                        only when the tile is opened.

                        autoPlay needs muted AND playsInline together or iOS and
                        Chrome both refuse it and the tile sits on a frozen
                        frame. Under prefers-reduced-motion it does not play at
                        all -- permanent motion is a genuine problem for some
                        people, and there is already a marquee moving. */}
                    {item.videoUrl ? (
                      <video
                        src={item.previewUrl || item.videoUrl}
                        autoPlay={!prefersReducedMotion}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={item.altText}
                        className="w-full aspect-[3/4] object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.altText}
                        width={600}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-[3/4] object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    )}

                    {/* Without this a reel reads as a photograph, and the click
                        that starts a video is a surprise. */}
                    {item.videoUrl && (
                      <span
                        aria-hidden="true"
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#fef9f2]/90 backdrop-blur-xs flex items-center justify-center text-[#3C2117]"
                      >
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </span>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#3C2117]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                      <span className="text-[10px] uppercase tracking-widest text-[#ffbda5] font-semibold mb-1">
                        {item.category}
                      </span>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-lg font-medium flex items-center justify-between">
                        <span>{item.title}</span>
                        <Maximize2 className="w-4 h-4 text-[#ffffff]" />
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
