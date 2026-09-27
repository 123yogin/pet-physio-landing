/**
 * DogSilhouette -- concept C: "bold silhouette + paw-print trail".
 *
 * Walks along the bottom of the viewport as the visitor scrolls: a bandaged
 * hind leg early on the page, blending to a normal gait, then a happy trot
 * near the end -- a recovery story told through gait alone.
 *
 * Follows ../motion/engine.ts's contract: one onFrame subscriber that only
 * WRITES (SVG `transform` attributes, style props, a `data-state` flag);
 * document height and the responsive breakpoint are measured once on mount
 * and again only from a ResizeObserver on <html>, never inside the frame
 * callback. Idle loops (tail wag, blink, breathing) are CSS @keyframes gated
 * by `[data-state="idle"]`, so the rAF loop can sleep once the dog settles.
 * Head-tilt-toward-cursor is a pointermove listener writing one CSS
 * variable -- moving the mouse alone never wakes the shared loop. No React
 * state drives the animation; a single mutable `Sim` ref feeds direct DOM
 * writes through element refs. prefers-reduced-motion renders a static
 * sitting silhouette and skips every listener/timer/write above.
 */
import React, { useEffect, useRef, useState } from 'react';
import { onFrame, prefersReducedMotion } from '../motion/engine';

/* ------------------------------------------------------------- Geometry -- */

const VIEW_W = 220;
const VIEW_H = 160;
const DESKTOP_W = 170;
const PHONE_W = 110;
const DESKTOP_BOTTOM = 18; // + env(safe-area-inset-bottom), added in CSS only
const PHONE_BOTTOM = 92; // clears the sticky mobile action bar
const PHONE_QUERY = '(max-width: 767px)';
const PAW_POOL = 12;

type LegName = 'LH' | 'LF' | 'RH' | 'RF';

interface LegDef {
  name: LegName;
  hipX: number;
  hipY: number;
  thigh: number;
  shin: number;
  offset: number; // walk-cycle offset 0..1 for the ordinary 4-beat walk
  bandaged: boolean;
}

// Far side (drawn behind the body) then near side (drawn in front); the
// bandage sits on the near hind leg, RH, so it reads clearly.
const LEGS: LegDef[] = [
  { name: 'LH', hipX: 58, hipY: 104, thigh: 24, shin: 22, offset: 0, bandaged: false },
  { name: 'LF', hipX: 148, hipY: 100, thigh: 22, shin: 20, offset: 0.25, bandaged: false },
  { name: 'RH', hipX: 66, hipY: 108, thigh: 25, shin: 23, offset: 0.5, bandaged: true },
  { name: 'RF', hipX: 156, hipY: 104, thigh: 23, shin: 21, offset: 0.75, bandaged: false },
];

const SIT_THIGH = { hind: -74, front: -12 } as const;
const SIT_SHIN = { hind: 102, front: 16 } as const;

/** Two-bone FK matching the rotate() math used to draw the leg, so a paw
 * print lands exactly where the foot is drawn. */
function footPosition(leg: LegDef, thighDeg: number, shinDeg: number) {
  const r1 = (thighDeg * Math.PI) / 180;
  const kneeX = leg.hipX - leg.thigh * Math.sin(r1);
  const kneeY = leg.hipY + leg.thigh * Math.cos(r1);
  const r2 = ((thighDeg + shinDeg) * Math.PI) / 180;
  return { x: kneeX - leg.shin * Math.sin(r2), y: kneeY + leg.shin * Math.cos(r2) + 3 };
}

/* ------------------------------------------------------------------ Gait -- */

interface GaitParams {
  ampThigh: number;
  ampShin: number;
  bandageAmpScale: number;
  stridePx: number;
  tailAmp: number;
  bobAmp: number;
}

const LIMP: GaitParams = { ampThigh: 15, ampShin: 24, bandageAmpScale: 0.45, stridePx: 130, tailAmp: 9, bobAmp: 2 };
const NORMAL: GaitParams = { ampThigh: 22, ampShin: 30, bandageAmpScale: 1, stridePx: 92, tailAmp: 15, bobAmp: 3 };
const TROT: GaitParams = { ampThigh: 28, ampShin: 34, bandageAmpScale: 1, stridePx: 62, tailAmp: 26, bobAmp: 4.2 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpGait = (a: GaitParams, b: GaitParams, t: number): GaitParams => ({
  ampThigh: lerp(a.ampThigh, b.ampThigh, t),
  ampShin: lerp(a.ampShin, b.ampShin, t),
  bandageAmpScale: lerp(a.bandageAmpScale, b.bandageAmpScale, t),
  stridePx: lerp(a.stridePx, b.stridePx, t),
  tailAmp: lerp(a.tailAmp, b.tailAmp, t),
  bobAmp: lerp(a.bobAmp, b.bobAmp, t),
});

/** p is scroll progress 0..1 -- the recovery story. */
function computeGait(p: number): GaitParams {
  if (p < 0.3) return LIMP;
  if (p < 0.75) return lerpGait(LIMP, NORMAL, (p - 0.3) / 0.45);
  return lerpGait(NORMAL, TROT, Math.min(1, (p - 0.75) / 0.25));
}

/** Ordinary 4-beat walk offsets vs. the happy trot's diagonal pairs. */
function legOffset(leg: LegDef, diag: boolean): number {
  if (!diag) return leg.offset;
  return leg.name === 'LH' || leg.name === 'RF' ? 0 : 0.5;
}

function bandageOpacityFor(p: number): number {
  if (p <= 0.3) return 1;
  if (p >= 0.6) return 0;
  return 1 - (p - 0.3) / 0.3;
}

/* -------------------------------------------------------------- Mutable state -- */

interface Sim {
  xPx: number;
  facing: 1 | -1;
  walkCycle: number;
  legRaw: Record<LegName, number>;
  lastMoveAt: number;
  sitAmount: number;
  animState: 'walk' | 'idle';
  containerWidthPx: number;
  bottomOffsetPx: number;
  docHeight: number;
  nextPaw: number;
}

function makeSim(): Sim {
  return {
    xPx: 16,
    facing: 1,
    walkCycle: 0,
    legRaw: { LH: 0, LF: 0, RH: 0, RF: 0 },
    lastMoveAt: 0,
    sitAmount: 0,
    animState: 'idle',
    containerWidthPx: DESKTOP_W,
    bottomOffsetPx: DESKTOP_BOTTOM,
    docHeight: 0,
    nextPaw: 0,
  };
}

/* -------------------------------------------------------------------- Rig -- */

interface AnimatedLegProps {
  leg: LegDef;
  registerThigh: (el: SVGGElement | null) => void;
  registerShin: (el: SVGGElement | null) => void;
  registerBandage?: (el: SVGRectElement | null) => void;
}

const AnimatedLeg: React.FC<AnimatedLegProps> = ({ leg, registerThigh, registerShin, registerBandage }) => {
  const kneeY = leg.hipY + leg.thigh;
  const footY = kneeY + leg.shin;
  const ink = 'var(--c-ink, #3c2117)';
  return (
    <g ref={registerThigh}>
      <path
        d={`M${leg.hipX - 5},${leg.hipY} Q${leg.hipX - 7},${leg.hipY + leg.thigh / 2} ${leg.hipX - 4},${kneeY} L${leg.hipX + 4},${kneeY} Q${leg.hipX + 7},${leg.hipY + leg.thigh / 2} ${leg.hipX + 5},${leg.hipY} Z`}
        fill={ink}
      />
      <g ref={registerShin}>
        <path d={`M${leg.hipX - 4},${kneeY} L${leg.hipX - 3.5},${footY} L${leg.hipX + 3.5},${footY} L${leg.hipX + 4},${kneeY} Z`} fill={ink} />
        <ellipse cx={leg.hipX} cy={footY + 3} rx={6.5} ry={4.5} fill={ink} />
        {leg.bandaged && (
          <rect
            ref={registerBandage}
            x={leg.hipX - 5.5}
            y={kneeY + 3}
            width={11}
            height={Math.max(4, leg.shin - 4)}
            rx={3}
            fill="var(--c-bg, #fef9f2)"
          />
        )}
      </g>
    </g>
  );
};

const TAIL_PATH = 'M42,82 C28,74 14,80 10,92 C8,98 14,104 22,100 C30,96 38,90 42,82 Z';

function RigBody() {
  return (
    <>
      <path
        className="pv-body"
        d="M50,60 C38,60 32,80 40,94 C48,110 82,118 110,116 C142,114 162,100 159,80 C156,63 130,52 100,52 C80,52 60,54 50,60 Z"
        fill="var(--c-ink, #3c2117)"
      />
      <path d="M52,58 Q108,44 176,64" stroke="var(--c-accent-soft, #ffbda5)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
    </>
  );
}

function RigHead() {
  return (
    <>
      <path d="M168,50 C150,56 144,76 158,92 C171,89 179,68 175,52 Z" fill="var(--c-ink, #3c2117)" />
      <path
        d="M150,55 C176,44 206,55 209,73 C211,86 199,96 186,93 L178,101 L172,91 C158,93 148,80 150,68 Z"
        fill="var(--c-ink, #3c2117)"
      />
      <ellipse className="pv-eye" cx={188} cy={71} rx={3.2} ry={3.6} fill="var(--c-bg, #fef9f2)" style={{ transformOrigin: '188px 71px' }} />
    </>
  );
}

function RigCollar() {
  return (
    <>
      <rect x="149" y="86" width="17" height="7.5" rx="3.7" fill="var(--c-accent, #84523e)" transform="rotate(-8 157.5 89.7)" />
      <path
        d="M154,96 C153,94 155,92.5 156.4,93.8 C157.8,92.5 159.8,94 158.8,96 C158,97.6 156.4,99 156.4,99 C156.4,99 154.8,97.6 154,96 Z"
        fill="var(--c-accent, #84523e)"
      />
    </>
  );
}

const STYLE = `
  .pv-dog-root, .pv-dog-static { position: fixed; left: 0; bottom: calc(${DESKTOP_BOTTOM}px + env(safe-area-inset-bottom)); width: ${DESKTOP_W}px; aspect-ratio: ${VIEW_W} / ${VIEW_H}; pointer-events: none; }
  .pv-dog-root { z-index: 35; will-change: transform; }
  .pv-dog-static { z-index: 35; right: 12px; left: auto; bottom: calc(12px + env(safe-area-inset-bottom)); }
  @media (max-width: 767px) { .pv-dog-root { width: ${PHONE_W}px; bottom: ${PHONE_BOTTOM}px; } }
  .pv-dog-facing { display: block; width: 100%; height: 100%; }
  .pv-head-tilt { transform: rotate(var(--head-tilt, 0deg)); transform-origin: 150px 60px; transition: transform 0.25s ease-out; }
  .pv-paw-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 34; }
  .pv-paw { position: absolute; width: 10px; height: 10px; opacity: 0; will-change: transform, opacity; }
  [data-state='idle'] .pv-tail { animation: pv-wag 2.6s ease-in-out infinite; transform-origin: 42px 82px; }
  [data-state='idle'] .pv-eye { animation: pv-blink 4.2s ease-in-out infinite; }
  [data-state='idle'] .pv-body { animation: pv-breathe 3.4s ease-in-out infinite; transform-origin: 100px 88px; }
  @keyframes pv-wag { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(10deg); } }
  @keyframes pv-blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
  @keyframes pv-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.012); } }
  @media (prefers-reduced-motion: reduce) {
    [data-state='idle'] .pv-tail, [data-state='idle'] .pv-eye, [data-state='idle'] .pv-body { animation: none; }
  }
`;

/* ------------------------------------------------------------ Component -- */

export const DogSilhouette: React.FC = () => {
  const [reduced, setReduced] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const facingRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const tailRef = useRef<SVGGElement | null>(null);
  const pawEls = useRef<Array<HTMLDivElement | null>>([]);
  const legEls = useRef<Record<LegName, { thigh: SVGGElement | null; shin: SVGGElement | null; bandage: SVGRectElement | null }>>({
    LH: { thigh: null, shin: null, bandage: null },
    LF: { thigh: null, shin: null, bandage: null },
    RH: { thigh: null, shin: null, bandage: null },
    RF: { thigh: null, shin: null, bandage: null },
  });
  const simRef = useRef<Sim>(makeSim());

  useEffect(() => {
    if (reduced) return;
    const sim = simRef.current;

    const remeasure = () => {
      const phone = window.matchMedia(PHONE_QUERY).matches;
      sim.containerWidthPx = phone ? PHONE_W : DESKTOP_W;
      sim.bottomOffsetPx = phone ? PHONE_BOTTOM : DESKTOP_BOTTOM;
      sim.docHeight = document.documentElement.scrollHeight;
    };
    remeasure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(remeasure);
      ro.observe(document.documentElement);
    } else {
      window.addEventListener('resize', remeasure);
    }

    const spawnPaw = (screenX: number, screenY: number, opacity: number) => {
      const el = pawEls.current[sim.nextPaw];
      sim.nextPaw = (sim.nextPaw + 1) % PAW_POOL;
      if (!el) return;
      el.style.left = `${screenX - 5}px`;
      el.style.top = `${screenY - 5}px`;
      el.getAnimations?.().forEach((a) => a.cancel());
      el.animate([{ opacity, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.82)' }], {
        duration: 1200,
        easing: 'ease-out',
        fill: 'forwards',
      });
    };

    const unsub = onFrame((f) => {
      const denom = sim.docHeight - f.vh;
      const p = denom > 0 ? Math.min(1, Math.max(0, f.scrollY / denom)) : 0;

      const targetX = p * (f.vw - sim.containerWidthPx - 32) + 16;
      const prevX = sim.xPx;
      sim.xPx += (targetX - sim.xPx) * Math.min(1, f.dt * 6);
      const dx = sim.xPx - prevX;

      if (f.velocity < -40) sim.facing = -1;
      else if (f.velocity > 40) sim.facing = 1;

      const moving = Math.abs(f.velocity) > 5 || Math.abs(dx) > 0.05;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (moving) sim.lastMoveAt = now;
      const settled = now - sim.lastMoveAt > 350;
      sim.animState = settled ? 'idle' : 'walk';
      const sitTarget = settled ? 1 : 0;
      sim.sitAmount += (sitTarget - sim.sitAmount) * Math.min(1, f.dt * 8);
      const walkAmount = 1 - sim.sitAmount;

      const gait = computeGait(p);
      const diag = p > 0.75;
      sim.walkCycle += (Math.abs(dx) / gait.stridePx) * walkAmount;
      const bandageOpacity = bandageOpacityFor(p);
      const bandagedPrintLight = p < 0.3 ? 0.4 : 1;

      for (const leg of LEGS) {
        const raw = sim.walkCycle + legOffset(leg, diag);
        const phase = raw - Math.floor(raw);
        const legScale = leg.bandaged ? gait.bandageAmpScale : 1;
        const walkThigh = gait.ampThigh * legScale * Math.sin(2 * Math.PI * phase);
        const swingT = Math.max(0, Math.sin(2 * Math.PI * (phase - 0.5)));
        const walkShin = gait.ampShin * legScale * swingT;

        const isHind = leg.name === 'LH' || leg.name === 'RH';
        const thighDeg = walkThigh * walkAmount + (isHind ? SIT_THIGH.hind : SIT_THIGH.front) * sim.sitAmount;
        const shinDeg = walkShin * walkAmount + (isHind ? SIT_SHIN.hind : SIT_SHIN.front) * sim.sitAmount;

        const els = legEls.current[leg.name];
        els.thigh?.setAttribute('transform', `rotate(${thighDeg.toFixed(2)} ${leg.hipX} ${leg.hipY})`);
        els.shin?.setAttribute('transform', `rotate(${shinDeg.toFixed(2)} ${leg.hipX} ${leg.hipY + leg.thigh})`);
        if (leg.bandaged && els.bandage) els.bandage.style.opacity = String(bandageOpacity);

        const prevRaw = sim.legRaw[leg.name];
        if (walkAmount > 0.05 && Math.floor(raw) !== Math.floor(prevRaw)) {
          const foot = footPosition(leg, thighDeg, shinDeg);
          const displayedX = sim.facing === -1 ? VIEW_W - foot.x : foot.x;
          const scale = sim.containerWidthPx / VIEW_W;
          const topPx = f.vh - sim.bottomOffsetPx - sim.containerWidthPx * (VIEW_H / VIEW_W);
          spawnPaw(sim.xPx + displayedX * scale, topPx + foot.y * scale, leg.bandaged ? bandagedPrintLight : 1);
        }
        sim.legRaw[leg.name] = raw;
      }

      // A small extra dip on the bandaged leg's stride while limping.
      const rhPhase = sim.legRaw.RH - Math.floor(sim.legRaw.RH);
      const hitch = p < 0.3 ? Math.max(0, Math.sin(2 * Math.PI * rhPhase)) * 1.4 : 0;
      const bob = (gait.bobAmp * Math.abs(Math.sin(2 * Math.PI * sim.walkCycle * 2)) + hitch) * walkAmount;
      bodyRef.current?.setAttribute('transform', `translate(0 ${(-bob).toFixed(2)})`);
      headRef.current?.setAttribute('transform', `translate(0 ${(bob * 0.6 - sim.sitAmount * 4).toFixed(2)})`);

      if (sim.animState === 'walk' && tailRef.current) {
        const tailDeg = gait.tailAmp * Math.sin(2 * Math.PI * sim.walkCycle * 2 + Math.PI / 2);
        tailRef.current.setAttribute('transform', `rotate(${tailDeg.toFixed(2)} 42 82)`);
      }

      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${sim.xPx.toFixed(2)}px,0,0)`;
        rootRef.current.dataset.state = sim.animState;
      }
      if (facingRef.current) facingRef.current.style.transform = sim.facing === -1 ? 'scaleX(-1)' : 'scaleX(1)';

      return Math.abs(sim.sitAmount - sitTarget) > 0.002 || moving;
    });

    let removePointer: (() => void) | null = null;
    if (window.matchMedia('(pointer: fine)').matches) {
      const onMove = (e: PointerEvent) => {
        const centerX = sim.xPx + sim.containerWidthPx / 2;
        const tilt = Math.max(-16, Math.min(16, (e.clientX - centerX) / 40));
        rootRef.current?.style.setProperty('--head-tilt', `${tilt.toFixed(1)}deg`);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      removePointer = () => window.removeEventListener('pointermove', onMove);
    }

    return () => {
      unsub();
      ro?.disconnect();
      window.removeEventListener('resize', remeasure);
      removePointer?.();
    };
  }, [reduced]);

  const style = <style>{STYLE}</style>;
  const noop = () => {};
  const renderLeg = (leg: LegDef) => (
    <AnimatedLeg
      key={leg.name}
      leg={leg}
      registerThigh={(el) => (legEls.current[leg.name].thigh = el)}
      registerShin={(el) => (legEls.current[leg.name].shin = el)}
      registerBandage={leg.bandaged ? (el) => (legEls.current[leg.name].bandage = el) : undefined}
    />
  );
  const [farLegs, nearLegs] = [LEGS.slice(0, 2), LEGS.slice(2)];

  if (reduced) {
    const sitLeg = (leg: LegDef) => {
      const hind = leg.name === 'LH' || leg.name === 'RH';
      return (
        <g key={leg.name} transform={`rotate(${hind ? SIT_THIGH.hind : SIT_THIGH.front} ${leg.hipX} ${leg.hipY})`}>
          <AnimatedLeg leg={leg} registerThigh={noop} registerShin={noop} />
        </g>
      );
    };
    return (
      <div className="pv-dog-static" aria-hidden="true">
        {style}
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="pv-dog-facing" focusable="false">
          <RigBody />
          {farLegs.map(sitLeg)}
          <g transform="rotate(-6 42 82)">
            <path d={TAIL_PATH} fill="var(--c-ink, #3c2117)" />
          </g>
          {nearLegs.map(sitLeg)}
          <RigHead />
          <RigCollar />
        </svg>
      </div>
    );
  }

  return (
    <>
      {style}
      <div className="pv-paw-overlay" aria-hidden="true">
        {Array.from({ length: PAW_POOL }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              pawEls.current[i] = el;
            }}
            className="pv-paw"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" focusable="false">
              <g fill="var(--c-ink, #3c2117)">
                <path d="M12 12.6c-2.9 0-5.6 2.7-5.6 5.3 0 1.8 1.4 2.6 2.9 2.6 1.2 0 1.8-.6 2.7-.6s1.5.6 2.7.6c1.5 0 2.9-.8 2.9-2.6 0-2.6-2.7-5.3-5.6-5.3z" />
                <ellipse cx="5.6" cy="10.4" rx="1.9" ry="2.4" transform="rotate(-18 5.6 10.4)" />
                <ellipse cx="9.4" cy="6.6" rx="2" ry="2.6" transform="rotate(-6 9.4 6.6)" />
                <ellipse cx="14.6" cy="6.6" rx="2" ry="2.6" transform="rotate(6 14.6 6.6)" />
                <ellipse cx="18.4" cy="10.4" rx="1.9" ry="2.4" transform="rotate(18 18.4 10.4)" />
              </g>
            </svg>
          </div>
        ))}
      </div>
      <div ref={rootRef} className="pv-dog-root" data-state="idle" aria-hidden="true">
        <div ref={facingRef} className="pv-dog-facing">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="pv-dog-facing" focusable="false">
            {farLegs.map(renderLeg)}
            <g ref={bodyRef}>
              <RigBody />
            </g>
            <g ref={tailRef} className="pv-tail">
              <path d={TAIL_PATH} fill="var(--c-ink, #3c2117)" />
            </g>
            {nearLegs.map(renderLeg)}
            <g ref={headRef}>
              <g className="pv-head-tilt">
                <RigHead />
              </g>
              <RigCollar />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};
