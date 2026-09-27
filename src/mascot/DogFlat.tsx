import React, { useEffect, useRef } from 'react';
import { onFrame, prefersReducedMotion } from '../motion/engine';

/**
 * DogFlat -- a scroll-driven flat-illustration dog mascot.
 *
 * Rig: one flip group (facing) > torso group (JS: bob + tilt, walk/sit pose)
 * containing the body, tail, four legs (each a thigh <g> holding a nested
 * shin <g>, so a knee bend is just the shin's own rotation composing with
 * its parent's) and a head group (JS: bob + tilt + cursor lean) holding the
 * ear, eye/eyelid, muzzle and collar.
 *
 * Everything that must track scroll (leg angles, body/head bob, x position,
 * facing, bandage fade) is written every frame via `setAttribute('transform',
 * ...)` / `style.opacity` from refs -- never React state, never a layout
 * read. Everything purely decorative and looping (tail wag, ear sway, blink,
 * breathing) is a CSS @keyframes animation on its own dedicated <g>, so it
 * never fights a per-frame JS transform on the same element and the motion
 * engine can go back to sleep while the dog is sitting still.
 *
 * Angles/lengths below are a first illustration pass tuned by eye against
 * the SVG source, not in a running browser -- expect the lead to nudge a
 * few constants (LEGS, sit targets, bob amplitude) once it's on screen.
 */

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface LegDef {
  key: string;
  hipX: number;
  hipY: number;
  thighLen: number;
  shinLen: number;
  bandage: boolean;
  walkOffset: number; // fraction of gait cycle
  trotOffset: number;
  sitThigh: number; // degrees, target for sit pose
  sitShin: number;
}

const LEGS: LegDef[] = [
  { key: 'farHind', hipX: 82, hipY: 106, thighLen: 27, shinLen: 25, bandage: false, walkOffset: 0.5, trotOffset: 0.5, sitThigh: -82, sitShin: 84 },
  { key: 'farFore', hipX: 150, hipY: 108, thighLen: 25, shinLen: 25, bandage: false, walkOffset: 0.75, trotOffset: 0, sitThigh: 17, sitShin: 17 },
  { key: 'nearHind', hipX: 92, hipY: 110, thighLen: 27, shinLen: 25, bandage: true, walkOffset: 0, trotOffset: 0, sitThigh: -86, sitShin: 82 },
  { key: 'nearFore', hipX: 160, hipY: 112, thighLen: 25, shinLen: 25, bandage: false, walkOffset: 0.25, trotOffset: 0.5, sitThigh: 17, sitShin: 17 },
];

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

const STYLE = `
.dog-mascot { position: fixed; left: 0; right: 0; bottom: calc(18px + env(safe-area-inset-bottom)); height: 0; pointer-events: none; z-index: 35; --dog-w: 170px; --energy: 0; }
@media (max-width: 767px) { .dog-mascot { bottom: 92px; --dog-w: 110px; } }
.dog-walker { position: absolute; left: 0; bottom: 0; width: var(--dog-w); transform: translate3d(0,0,0); will-change: transform; }
.dog-walker svg { display: block; width: 100%; height: auto; overflow: visible; }
.dog-tail-wag { transform-box: fill-box; transform-origin: 88% 92%; animation: dog-tail-wag calc(0.55s - var(--energy) * 0.25s) ease-in-out infinite; }
.dog-ear-sway { transform-box: fill-box; transform-origin: 25% 8%; animation: dog-ear-sway calc(2.6s - var(--energy) * 1s) ease-in-out infinite; }
.dog-eyelid { transform-box: fill-box; transform-origin: 50% 50%; animation: dog-blink 4.2s ease-in-out infinite; }
.dog-breathe { transform-box: fill-box; transform-origin: 50% 60%; animation: dog-breathe 2.4s ease-in-out infinite; }
/* Resting (sitting): renamed animations restart and run a fixed number of
   times, then stop -- about 4-5 s of wagging, two blinks, two breaths. */
.dog-mascot[data-resting='1'] .dog-tail-wag { animation: dog-tail-wag-rest 0.5s ease-in-out 9; }
.dog-mascot[data-resting='1'] .dog-ear-sway { animation: dog-ear-sway-rest 2.4s ease-in-out 2; }
.dog-mascot[data-resting='1'] .dog-eyelid { animation: dog-blink-rest 3s ease-in-out 2; }
.dog-mascot[data-resting='1'] .dog-breathe { animation: dog-breathe-rest 2.4s ease-in-out 2; }
@keyframes dog-tail-wag-rest { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(16deg); } }
@keyframes dog-ear-sway-rest { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(4deg); } }
@keyframes dog-blink-rest { 0%, 92%, 100% { transform: scaleY(0); } 96% { transform: scaleY(1); } }
@keyframes dog-breathe-rest { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
@keyframes dog-tail-wag { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(16deg); } }
@keyframes dog-ear-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(4deg); } }
@keyframes dog-blink { 0%, 92%, 100% { transform: scaleY(0); } 96% { transform: scaleY(1); } }
@keyframes dog-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
/* Reduced motion: freeze every loop and pin the (already-sitting) dog bottom-right,
   in place of the JS-driven left-to-right walk position. No listeners run at all --
   see the early return in the effect below -- so this is the complete reduced state. */
@media (prefers-reduced-motion: reduce) {
  .dog-mascot * { animation: none !important; }
  .dog-walker { left: auto !important; right: 16px !important; transform: none !important; }
}
`;

/** Pure-render SVG rig. All animated values arrive as pre-computed attribute strings so this stays a plain function the effect can also call imperatively-adjacent (refs live on the actual nodes, not here) -- this component itself only renders once. */
const DogSvg: React.FC<{
  torsoAttr: string;
  headAttr: string;
  legAttrs: { thigh: string; shin: string }[];
  bandageOpacity: number;
  refs?: {
    torso?: (el: SVGGElement | null) => void;
    head?: (el: SVGGElement | null) => void;
    legs?: ((el: SVGGElement | null) => void)[];
    shins?: ((el: SVGGElement | null) => void)[];
    bandage?: (el: SVGGElement | null) => void;
  };
}> = ({ torsoAttr, headAttr, legAttrs, bandageOpacity, refs }) => {
  const body = 'var(--c-dog-body, #dcad8b)';
  const ink = 'var(--c-ink, #3c2117)';
  const cream = 'var(--c-bg, #fef9f2)';
  // Light fur (muzzle, bib) sits between the cream page and the tan coat, with a
  // soft tan edge -- pure page-cream read as holes cut in the dog.
  const light = '#fbf0e3';
  const edge = '#d9a882';
  // Far legs a shade darker: depth without outlines.
  const bodyShade = '#c99a78';
  const accent = 'var(--c-accent, #84523e)';
  return (
    <svg viewBox="-6 22 250 142" role="presentation" focusable="false">
      <g ref={refs?.torso} transform={torsoAttr}>
        {/* tail */}
        <g className="dog-tail-wag">
          <path d="M74,86 C58,82 44,70 42,56 C41,48 49,45 53,52 C57,63 64,74 78,80 Z" fill={body} />
          <path d="M42,56 C41,48 49,45 53,52 C50,54 46,56 42,56 Z" fill={ink} />
        </g>
        {/* far legs sit behind the body */}
        {legAttrs.slice(0, 2).map((a, i) => (
          <Leg key={LEGS[i].key} def={LEGS[i]} thighAttr={a.thigh} shinAttr={a.shin} ink={ink} body={bodyShade} cream={cream} accent={accent}
            thighRef={refs?.legs?.[i]} shinRef={refs?.shins?.[i]} bandageOpacity={bandageOpacity} bandageRef={undefined} />
        ))}
        {/* neck, then torso: deep chest, belly tuck-up, rounded rump */}
        <path d="M146,76 C152,62 164,50 178,46 L198,58 C190,72 180,86 166,96 Z" fill={body} />
        <path d="M70,92 C70,74 90,66 116,66 C140,66 160,68 170,82 C178,94 175,113 160,119 C147,124 134,114 118,112 C102,110 91,120 79,116 C67,112 66,103 70,92 Z" fill={body} />
        <g className="dog-breathe">
          <path d="M92,70 C102,64 118,64 124,72 C118,80 100,82 92,70 Z" fill={ink} opacity={0.82} />
        </g>
        {/* chest bib: light fur with a soft outline so it never reads as a hole */}
        <path d="M160,82 C171,87 176,103 167,115 C161,120 152,119 150,111 C151,99 153,89 160,82 Z" fill={light} stroke={edge} strokeWidth="1.2" />
        {/* near legs in front */}
        {legAttrs.slice(2, 4).map((a, i) => {
          const idx = i + 2;
          return (
            <Leg key={LEGS[idx].key} def={LEGS[idx]} thighAttr={a.thigh} shinAttr={a.shin} ink={ink} body={body} cream={cream} accent={accent}
              thighRef={refs?.legs?.[idx]} shinRef={refs?.shins?.[idx]} bandageOpacity={bandageOpacity}
              bandageRef={LEGS[idx].bandage ? refs?.bandage : undefined} />
          );
        })}
      </g>
      {/* head, on its own bob/tilt group so it can move opposite the body */}
      <g ref={refs?.head} transform={headAttr}>
        {/* collar + tag */}
        <path d="M166,68 Q179,80 193,69" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="180" cy="78" r="3.6" fill="#e9b949" />
        {/* skull and snout */}
        <ellipse cx="190" cy="52" rx="22" ry="19" fill={body} />
        <path d="M197,50 C212,47 229,53 230,62 C231,71 215,74 200,70 C194,66 193,56 197,50 Z" fill={light} stroke={edge} strokeWidth="1.2" />
        <ellipse cx="228" cy="58.5" rx="5" ry="4.2" fill={ink} />
        <path d="M216,69 C219,72 223,72 226,69" stroke={ink} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* eye with a catch-light, eyelid blinks */}
        <circle cx="198" cy="47" r="3.4" fill={ink} />
        <circle cx="199.3" cy="45.8" r="1.1" fill="#fff" />
        <ellipse cx="198" cy="47" rx="5" ry="5" fill={body} className="dog-eyelid" />
        {/* floppy ear */}
        <path d="M181,34 C170,35 164,48 167,62 C169,72 178,74 182,66 C186,56 189,43 181,34 Z" className="dog-ear-sway" fill={ink} />
      </g>
    </svg>
  );
};

const Leg: React.FC<{
  def: LegDef;
  thighAttr: string;
  shinAttr: string;
  ink: string;
  body: string;
  cream: string;
  accent: string;
  bandageOpacity: number;
  thighRef?: (el: SVGGElement | null) => void;
  shinRef?: (el: SVGGElement | null) => void;
  bandageRef?: (el: SVGGElement | null) => void;
}> = ({ def, thighAttr, shinAttr, ink, body, cream, accent, bandageOpacity, thighRef, shinRef, bandageRef }) => (
  <g ref={thighRef} transform={thighAttr}>
    <path d={`M-8,0 C-8,-6 8,-6 8,0 L5.5,${def.thighLen} C5.5,${def.thighLen + 5} -5.5,${def.thighLen + 5} -5.5,${def.thighLen} Z`} fill={body} />
    <g ref={shinRef} transform={shinAttr}>
      <path d={`M-5,-2 L5,-2 L4,${def.shinLen} L-4,${def.shinLen} Z`} fill={body} />
      <ellipse cx={1.5} cy={def.shinLen + 1} rx={6.5} ry={3.8} fill={body} />
      <path d={`M-4,${def.shinLen + 2.5} L7,${def.shinLen + 2.5}`} stroke={ink} strokeWidth="1.2" opacity={0.35} />
      {def.bandage && (
        <g ref={bandageRef} opacity={bandageOpacity}>
          <rect x={-7} y={def.shinLen * 0.32} width={14} height={11} rx={3} fill={cream} />
          <rect x={-7} y={def.shinLen * 0.32 + 3} width={14} height={3} fill={accent} transform={`rotate(18 0 ${def.shinLen * 0.32 + 4.5})`} />
        </g>
      )}
    </g>
  </g>
);

export const DogFlat: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<HTMLDivElement | null>(null);
  const torsoRef = useRef<SVGGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const bandageRef = useRef<SVGGElement | null>(null);
  const thighRefs = useRef<(SVGGElement | null)[]>([null, null, null, null]);
  const shinRefs = useRef<(SVGGElement | null)[]>([null, null, null, null]);

  // Mutable animation state -- never React state, so no re-render per frame.
  const xRef = useRef(16);
  const prevXRef = useRef(16);
  const facingRef = useRef(1); // 1 = right, -1 = left
  const phaseRef = useRef(0);
  const sitBlendRef = useRef(1); // starts sitting until the visitor scrolls
  const idleMsRef = useRef(1000);
  const docHeightRef = useRef(0);
  const vwRef = useRef(0);
  const cursorTiltRef = useRef(0);

  useEffect(() => {
    // Reduced motion: attach nothing. The initial JSX pose already renders a
    // static, sitting dog, and the CSS block above pins it bottom-right and
    // kills every @keyframes loop -- this is the complete reduced-motion state.
    if (prefersReducedMotion()) return;

    const measureDoc = () => {
      docHeightRef.current = document.documentElement.scrollHeight;
    };
    measureDoc();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureDoc);
      ro.observe(document.documentElement);
    }
    window.addEventListener('resize', measureDoc);

    let onMove: ((e: PointerEvent) => void) | undefined;
    if (finePointer()) {
      onMove = (e: PointerEvent) => {
        const dogW = vwRef.current < 768 ? 110 : 170;
        const centerX = xRef.current + dogW / 2;
        cursorTiltRef.current = clamp((e.clientX - centerX) / 40, -8, 8);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    const unsub = onFrame((f) => {
      vwRef.current = f.vw;
      const walker = walkerRef.current;
      if (!walker) return false;

      const dogW = f.vw < 768 ? 110 : 170;
      const usableH = docHeightRef.current - f.vh;
      const p = clamp(usableH > 0 ? f.scrollY / usableH : 0, 0, 1);

      // Ease x toward its scroll-progress target.
      const targetX = p * (f.vw - dogW - 32) + 16;
      prevXRef.current = xRef.current;
      xRef.current += (targetX - xRef.current) * Math.min(1, f.dt * 6);
      const dx = xRef.current - prevXRef.current;

      // Facing: flip on a clear scroll direction, keep last facing otherwise.
      if (f.velocity < -40) facingRef.current = -1;
      else if (f.velocity > 40) facingRef.current = 1;

      // Idle detection drives the stand <-> sit blend.
      const isMoving = Math.abs(f.velocity) > 5 || Math.abs(dx) > 0.05;
      idleMsRef.current = isMoving ? 0 : idleMsRef.current + f.dt * 1000;
      const isIdle = idleMsRef.current > 350;
      const desiredSit = isIdle ? 1 : 0;
      sitBlendRef.current += (desiredSit - sitBlendRef.current) * Math.min(1, f.dt * (isIdle ? 3 : 5));
      const sitBlend = sitBlendRef.current;
      // Resting state for the CSS idle loops: while sitting they switch to a
      // finite version (a few wags and blinks, then still), so nothing loops
      // on screen indefinitely (WCAG 2.2.2). Walking restores the live loops.
      const resting = isIdle ? '1' : '0';
      if (containerRef.current && containerRef.current.dataset.resting !== resting) {
        containerRef.current.dataset.resting = resting;
      }

      // Gait energy: limp (p<0.3) -> walk (0.3-0.75) -> trot (>0.75).
      const energy = p < 0.3 ? 0 : p < 0.75 ? (p - 0.3) / 0.45 : 1;
      const isTrot = p >= 0.75;
      const trotT = isTrot ? clamp((p - 0.75) / 0.25, 0, 1) : 0;
      const limpT = p < 0.3 ? 1 - p / 0.3 : 0;
      const thighSwing = lerp(10, 22, energy) + trotT * 4;
      const strideLen = lerp(34, 22, energy) - trotT * 4;
      const bandageOpacity = p < 0.3 ? 1 : p < 0.6 ? 1 - (p - 0.3) / 0.3 : 0;

      // Phase only advances while not (nearly) fully sat, driven by distance
      // travelled, not time, so legs track ground speed.
      if (sitBlend < 0.9) {
        phaseRef.current = (phaseRef.current + Math.abs(dx) / strideLen) % 1;
      }
      const phase = phaseRef.current;

      // Body bob (twice per cycle) + limp/sit tilt.
      const bobAmp = 2 + energy * 1.5;
      const bobY = sitBlend > 0.05 ? 0 : -Math.abs(Math.sin(phase * Math.PI * 4)) * bobAmp;
      const limpTilt = -4 * limpT;
      // Sitting lowers the rump: tilt back (negative = rump down, chest up) and
      // settle the whole body a few px toward the ground.
      const tilt = lerp(limpTilt, -19, sitBlend);
      if (torsoRef.current) {
        // Pivot at the front shoulders: sitting drops the rump to the floor while
        // the front paws stay planted.
        torsoRef.current.setAttribute('transform', `translate(0 ${bobY.toFixed(2)}) rotate(${tilt.toFixed(2)} 158 110)`);
      }

      // Head bobs opposite the body, plus a small cursor lean on desktop.
      const headBobY = -bobY * 0.6;
      const headTilt = cursorTiltRef.current + tilt * 0.3;
      if (headRef.current) {
        headRef.current.setAttribute('transform', `translate(0 ${headBobY.toFixed(2)}) rotate(${headTilt.toFixed(2)} 172 68)`);
      }

      // Legs.
      LEGS.forEach((def, i) => {
        const off = isTrot ? def.trotOffset : def.walkOffset;
        const legPhase = (phase + off) % 1;
        const hindLimp = def.key.includes('Hind') ? limpT : 0;
        const swing = thighSwing * (1 - hindLimp * 0.55);
        const walkThigh = Math.sin(legPhase * Math.PI * 2) * swing;
        const walkShin = Math.max(0, Math.sin(legPhase * Math.PI * 2)) * swing * 0.9;
        const thighAngle = lerp(walkThigh, def.sitThigh, sitBlend);
        const shinAngle = lerp(walkShin, def.sitShin - def.sitThigh, sitBlend);
        const thighEl = thighRefs.current[i];
        const shinEl = shinRefs.current[i];
        if (thighEl) thighEl.setAttribute('transform', `translate(${def.hipX} ${def.hipY}) rotate(${thighAngle.toFixed(2)})`);
        if (shinEl) shinEl.setAttribute('transform', `translate(0 ${def.thighLen}) rotate(${shinAngle.toFixed(2)})`);
      });
      if (bandageRef.current) bandageRef.current.setAttribute('opacity', String(bandageOpacity));

      containerRef.current?.style.setProperty('--energy', String(energy));
      walker.style.transform = `translate3d(${xRef.current.toFixed(2)}px,0,0) scaleX(${facingRef.current})`;

      const settled = Math.abs(targetX - xRef.current) < 0.4 && Math.abs(sitBlend - desiredSit) < 0.02;
      return !settled;
    });

    return () => {
      unsub();
      ro?.disconnect();
      window.removeEventListener('resize', measureDoc);
      if (onMove) window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const legRefCallbacks = LEGS.map((_, i) => (el: SVGGElement | null) => {
    thighRefs.current[i] = el;
  });
  const shinRefCallbacks = LEGS.map((_, i) => (el: SVGGElement | null) => {
    shinRefs.current[i] = el;
  });

  return (
    <div className="dog-mascot" ref={containerRef} aria-hidden="true" data-resting="1">
      <style>{STYLE}</style>
      <div className="dog-walker" ref={walkerRef}>
        <DogSvg
          torsoAttr="translate(0 0) rotate(-19 158 110)"
          headAttr="translate(0 0) rotate(4 172 68)"
          legAttrs={LEGS.map((l) => ({ thigh: `translate(${l.hipX} ${l.hipY}) rotate(${l.sitThigh})`, shin: `translate(0 ${l.thighLen}) rotate(${l.sitShin - l.sitThigh})` }))}
          bandageOpacity={1}
          refs={{
            torso: (el) => (torsoRef.current = el),
            head: (el) => (headRef.current = el),
            legs: legRefCallbacks,
            shins: shinRefCallbacks,
            bandage: (el) => (bandageRef.current = el),
          }}
        />
      </div>
    </div>
  );
};
