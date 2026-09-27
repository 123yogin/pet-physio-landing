/**
 * DogLine -- concept B mascot: a hand-drawn, single-weight line-art dog that
 * walks along the bottom of the viewport as the page scrolls, sits when the
 * visitor stops, and carries a small recovery story (a bandage that heals as
 * you read down the page).
 *
 * Rig: one flip group (facing), one body-bob group wrapping the whole dog,
 * a head group (bob + a nested cursor-tilt group), a tail group, and four
 * legs, each a hip <g> (thigh) containing a knee <g> (shin) so both joints
 * hinge correctly. Idle behaviour (tail wag, blink, breathing) is CSS
 * @keyframes gated by an `is-sitting` class, so the rAF loop can sleep once
 * the dog has sat down -- only the walk/sit *transition* asks the shared
 * motion engine (`onFrame`) for extra frames.
 *
 * Everything else (position, gait, bandage fade) is written directly to DOM
 * refs inside the engine's WRITE phase; no per-frame React state, no layout
 * reads. `prefers-reduced-motion` swaps to a static, listener-free sitting
 * pose (bottom-right).
 */
import React, { useEffect, useRef, useState } from 'react';
import { onFrame, prefersReducedMotion } from '../motion/engine';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const THIGH = 26;
const SHIN = 24;

interface LegCfg {
  name: string;
  hx: number;
  hy: number;
  walkOffset: number;
  trotOffset: number;
  hind: boolean;
  bandaged?: boolean;
  sitThigh: number;
  sitShin: number;
}

/** Phase offsets per spec: walk (lateral) LH 0, LF .25, RH .5, RF .75;
 * trot (diagonal pairs) LH+RF 0, RH+LF .5. */
const LEGS: LegCfg[] = [
  { name: 'RH', hx: 60, hy: 104, walkOffset: 0.5, trotOffset: 0.5, hind: true, sitThigh: 68, sitShin: -98 },
  { name: 'RF', hx: 156, hy: 100, walkOffset: 0.75, trotOffset: 0, hind: false, sitThigh: 10, sitShin: -6 },
  { name: 'LH', hx: 72, hy: 110, walkOffset: 0, trotOffset: 0, hind: true, bandaged: true, sitThigh: 68, sitShin: -98 },
  { name: 'LF', hx: 148, hy: 108, walkOffset: 0.25, trotOffset: 0.5, hind: false, sitThigh: 12, sitShin: -4 },
];

type LegNode = { hip: SVGGElement | null; knee: SVGGElement | null };

const CSS = `
.dl-root { position: fixed; left: 0; bottom: calc(18px + env(safe-area-inset-bottom)); width: 170px;
  pointer-events: none; z-index: 35; transform: translate3d(16px,0,0); will-change: transform; }
.dl-root.is-reduced { left: auto; right: 16px; transform: none; }
@media (max-width: 767px) {
  .dl-root { width: 110px; bottom: calc(92px + env(safe-area-inset-bottom)); }
}
.dl-svg { display: block; width: 100%; height: auto; overflow: visible; }
.dl-svg line, .dl-svg path, .dl-svg circle, .dl-svg ellipse {
  fill: none; stroke: var(--c-ink, #3c2117); stroke-width: 2.4;
  stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke;
}
.dl-body { fill: var(--c-hero, #fbe9d6); }
.dl-nose, .dl-eye circle, .dl-tag { fill: var(--c-ink, #3c2117); stroke: none; }
.dl-tag { fill: var(--c-accent, #84523e); }
.dl-collar, .dl-bandage line { stroke: var(--c-accent, #84523e); }
.dl-bandage line { stroke-width: 3; }
.dl-ground { opacity: 0; }
.dl-ticks { opacity: 0; }
.dl-ticks line { stroke: var(--c-accent, #84523e); stroke-width: 2; }
.dl-head-cursor { transform: rotate(var(--dl-tilt, 0deg)); transform-origin: 150px 75px; transition: transform 0.4s ease; }
.dl-eye { transform-origin: 182px 66px; }
.dl-root.is-reduced .dl-eye,
.dl-root.is-reduced .dl-tail,
.dl-root.is-reduced .dl-body { animation: none !important; }
.dl-root.is-sitting .dl-eye { animation: dl-blink 4.2s ease-in-out infinite; }
.dl-root.is-sitting .dl-tail { animation: dl-tailwag 2.4s ease-in-out infinite; transform-origin: 58px 100px; }
.dl-root.is-sitting .dl-body { animation: dl-breathe 2.8s ease-in-out infinite; transform-origin: 100px 92px; }
@keyframes dl-blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.12); } }
@keyframes dl-tailwag { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(14deg); } }
@keyframes dl-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
`;

export const DogLine: React.FC = () => {
  const [reducedUI, setReducedUI] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<SVGGElement>(null);
  const bobRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const groundRef = useRef<SVGLineElement>(null);
  const ticksRef = useRef<SVGGElement>(null);
  const bandageRef = useRef<SVGGElement>(null);

  const legNodes = useRef<Record<string, LegNode>>(
    Object.fromEntries(LEGS.map((l) => [l.name, { hip: null, knee: null }])),
  ).current;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedUI(mq.matches);
    const onChange = () => setReducedUI(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion: write one static sitting pose, attach nothing.
    if (reducedUI) {
      root.classList.add('is-sitting');
      LEGS.forEach((leg) => {
        const n = legNodes[leg.name];
        n.hip?.setAttribute('transform', `translate(${leg.hx},${leg.hy}) rotate(${leg.sitThigh})`);
        n.knee?.setAttribute('transform', `translate(0,${THIGH}) rotate(${leg.sitShin})`);
      });
      if (bandageRef.current) bandageRef.current.style.opacity = '0';
      return;
    }

    // ---- Full rig ---------------------------------------------------
    let docHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      docHeight = document.documentElement.scrollHeight;
    });
    ro.observe(document.documentElement);

    const narrowMQ = window.matchMedia('(max-width: 767px)');
    let dogWidth = narrowMQ.matches ? 110 : 170;
    const onNarrow = () => {
      dogWidth = narrowMQ.matches ? 110 : 170;
    };
    narrowMQ.addEventListener?.('change', onNarrow);

    let x = 16;
    let facing = 1; // 1 = right, -1 = left
    let phase = 0; // 0..1 gait cycle, advances with distance travelled
    let idleMs = 0;
    let sitTarget = 0;
    let sitMix = 0;
    let sitting = false;

    const applyLeg = (leg: LegCfg, thigh: number, shin: number) => {
      const n = legNodes[leg.name];
      n.hip?.setAttribute('transform', `translate(${leg.hx},${leg.hy}) rotate(${thigh.toFixed(1)})`);
      n.knee?.setAttribute('transform', `translate(0,${THIGH}) rotate(${shin.toFixed(1)})`);
    };

    const stop = onFrame((f) => {
      const range = Math.max(1, docHeight - f.vh);
      const p = clamp(f.scrollY / range, 0, 1);

      const targetX = p * (f.vw - dogWidth - 32) + 16;
      const prevX = x;
      x += (targetX - prevX) * Math.min(1, f.dt * 6);
      const dx = x - prevX;
      const distance = Math.abs(dx);
      root.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;

      if (f.velocity < -40) facing = -1;
      else if (f.velocity > 40) facing = 1;
      if (flipRef.current) flipRef.current.style.transform = facing < 0 ? 'scaleX(-1)' : '';

      const moving = distance > 0.05 || Math.abs(f.velocity) > 3;

      if (moving) {
        idleMs = 0;
        sitTarget = 0;
      } else {
        idleMs += f.dt * 1000;
        if (idleMs > 350) sitTarget = 1;
      }
      if (sitMix !== sitTarget) {
        const dir = sitTarget > sitMix ? 1 : -1;
        sitMix = clamp(sitMix + dir * (f.dt / 0.45), 0, 1);
      }
      const nowSitting = sitMix >= 0.999;
      if (nowSitting !== sitting) {
        sitting = nowSitting;
        root.classList.toggle('is-sitting', sitting);
      }

      // Recovery-driven gait mix.
      const limpMix = clamp(1 - p / 0.3, 0, 1);
      const trotMix = clamp((p - 0.75) / 0.25, 0, 1);
      const stride = 22 + limpMix * 10 - trotMix * 8;
      phase = (phase + distance / Math.max(6, stride)) % 1;

      LEGS.forEach((leg) => {
        const bandageFactor = leg.bandaged ? 1 - 0.5 * limpMix : 1;
        const walkSub = (phase + leg.walkOffset) % 1;
        const trotSub = (phase + leg.trotOffset) % 1;
        const thighWalk = 20 * bandageFactor * Math.sin(walkSub * Math.PI * 2);
        const thighTrot = 26 * bandageFactor * Math.sin(trotSub * Math.PI * 2);
        const swingWalk = Math.max(0, Math.sin(walkSub * Math.PI * 2));
        const swingTrot = Math.max(0, Math.sin(trotSub * Math.PI * 2));
        const shinWalk = -34 * swingWalk * bandageFactor;
        const shinTrot = -42 * swingTrot * bandageFactor;
        const walkThigh = lerp(thighWalk, thighTrot, trotMix);
        const walkShin = lerp(shinWalk, shinTrot, trotMix);
        const thigh = lerp(walkThigh, leg.sitThigh, sitMix);
        const shin = lerp(walkShin, leg.sitShin, sitMix);
        applyLeg(leg, thigh, shin);
      });

      const bobAmp = lerp(3.2, 0, sitMix) * (moving ? 1 : 0.3);
      const bob = Math.sin(phase * Math.PI * 4) * bobAmp;
      bobRef.current?.setAttribute('transform', `translate(0,${(-Math.abs(bob)).toFixed(2)})`);
      if (headRef.current) {
        const hb = -bob * 0.6;
        headRef.current.setAttribute('transform', `translate(0,${hb.toFixed(2)}) rotate(${(bob * 0.4).toFixed(2)} 150 75)`);
      }
      if (tailRef.current && !sitting) {
        const wag = Math.sin(phase * Math.PI * 4) * lerp(10, 18, trotMix) * (1 - sitMix);
        tailRef.current.setAttribute('transform', `rotate(${wag.toFixed(1)} 58 100)`);
      }

      const groundOpacity = moving ? Math.min(1, distance * 2) * (1 - sitMix) : 0;
      if (groundRef.current) groundRef.current.style.opacity = String(groundOpacity);
      if (ticksRef.current) ticksRef.current.style.opacity = String(trotMix * groundOpacity);

      if (bandageRef.current) {
        bandageRef.current.style.opacity = String(1 - clamp((p - 0.3) / 0.3, 0, 1));
      }

      return (!moving && !sitting) || (moving && sitMix > 0);
    });

    // Desktop: head tilts toward the cursor horizontally.
    let onMove: ((e: PointerEvent) => void) | null = null;
    if (window.matchMedia('(pointer: fine)').matches) {
      onMove = (e: PointerEvent) => {
        const center = x + dogWidth / 2;
        const tilt = clamp((e.clientX - center) / 12, -10, 10);
        root.style.setProperty('--dl-tilt', `${tilt.toFixed(1)}deg`);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      narrowMQ.removeEventListener?.('change', onNarrow);
      if (onMove) window.removeEventListener('pointermove', onMove);
    };
  }, [reducedUI]);

  const leg = (name: string, footTick: number) => {
    const cfg = LEGS.find((l) => l.name === name)!;
    return (
      <g
        ref={(el) => {
          legNodes[name].hip = el;
        }}
        transform={`translate(${cfg.hx},${cfg.hy})`}
      >
        <line x1={0} y1={0} x2={0} y2={THIGH} />
        <g
          ref={(el) => {
            legNodes[name].knee = el;
          }}
          transform={`translate(0,${THIGH})`}
        >
          <line x1={0} y1={0} x2={0} y2={SHIN} />
          <line x1={0} y1={SHIN} x2={footTick} y2={SHIN} />
          {cfg.bandaged && (
            <g ref={bandageRef} className="dl-bandage">
              <line x1={-5} y1={6} x2={5} y2={10} />
              <line x1={-5} y1={12} x2={5} y2={16} />
              <line x1={-5} y1={18} x2={5} y2={22} />
            </g>
          )}
        </g>
      </g>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div ref={rootRef} className={`dl-root${reducedUI ? ' is-reduced' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 220 160" className="dl-svg" focusable="false">
          <g ref={flipRef} style={{ transformOrigin: '110px 90px' }}>
            <g ref={ticksRef} className="dl-ticks">
              <line x1={14} y1={118} x2={30} y2={112} />
              <line x1={8} y1={128} x2={24} y2={122} />
            </g>
            <line ref={groundRef} className="dl-ground" x1={38} y1={136} x2={176} y2={136} />

            <g ref={bobRef}>
              {leg('RH', 7)}
              {leg('RF', 7)}

              <g ref={tailRef}>
                <path d="M58,100 C46,94 36,84 40,70" />
              </g>

              <path
                className="dl-body"
                d="M48,102 C44,82 62,60 96,56 C126,53 156,60 168,78 C176,90 170,106 152,116 C126,128 88,130 62,120 C50,115 46,110 48,102 Z"
              />

              <path className="dl-collar" d="M140,86 C146,92 156,92 162,87" />
              <circle className="dl-tag" cx={151} cy={94} r={3} />

              <g ref={headRef}>
                <g className="dl-head-cursor">
                  <path d="M148,72 C156,52 176,46 192,52 C204,57 208,72 202,84 C198,92 190,98 180,100 C170,102 162,96 158,88" />
                  <path d="M170,56 C182,58 190,70 186,84 C183,94 172,98 164,92 C158,88 158,78 162,68 C164,62 166,58 170,56 Z" />
                  <g className="dl-eye">
                    <circle cx={182} cy={66} r={3} />
                  </g>
                  <ellipse className="dl-nose" cx={200} cy={82} rx={4} ry={3} />
                  <path d="M198,90 C194,96 184,98 178,94" />
                </g>
              </g>

              {leg('LH', 7)}
              {leg('LF', 7)}
            </g>
          </g>
        </svg>
      </div>
    </>
  );
};
