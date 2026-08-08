'use client';

import { motion } from 'framer-motion';
import React, { useState, useCallback, useEffect } from 'react';

// Ambient pulsing pink glow (matches original aW/a5 background layers)
export function AmbientGlow({ active }: { active: boolean }) {
  return (
    <>
      <motion.div
        animate={{ opacity: active ? [0.85, 1, 0.85] : 0 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 650px 850px at 50% 6%, rgba(255, 215, 225, 0.58) 0%, rgba(255, 200, 215, 0.40) 25%, rgba(245, 180, 200, 0.22) 50%, rgba(235, 165, 185, 0.08) 75%, transparent 90%)',
        }}
      />
      <motion.div
        animate={{ opacity: active ? [0.35, 0.48, 0.35] : 0 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 950px 1150px at 50% 8%, rgba(255, 200, 215, 0.18) 0%, rgba(245, 185, 200, 0.06) 45%, transparent 80%)',
        }}
      />
    </>
  );
}

// Floating pink dots (original a3/aG)
export function PinkDots({ active }: { active: boolean }) {
  const dots = React.useRef(
    Array.from({ length: 30 }).map(() => ({
      s: 1.2 + 2.5 * Math.random(),
      x: 20 + 60 * Math.random(),
      y: 10 + 65 * Math.random(),
      d: 4 + 5 * Math.random(),
      dl: 6 * Math.random(),
      dx: -15 + 30 * Math.random(),
      dy: -(15 + 25 * Math.random()),
      o: 0.15 + 0.4 * Math.random(),
    }))
  ).current;
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {dots.map((e, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: e.s,
            height: e.s,
            background: `rgba(255, 200, 215, ${e.o})`,
            left: `${e.x}%`,
            top: `${e.y}%`,
          }}
          animate={{ y: [0, e.dy, 0], x: [0, e.dx, 0], opacity: [0, e.o, 0] }}
          transition={{ duration: e.d, repeat: Infinity, delay: e.dl, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// The pull-down balloon with string that the user drags down
function Balloon({
  lit,
  dragging,
  dragX,
  dragY,
}: {
  lit: boolean;
  dragging: boolean;
  dragX: number;
  dragY: number;
}) {
  return (
    <div className="flex flex-col items-center" style={{ transform: `translate(${dragX}px, ${1.2 * dragY}px)`, transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1.1, 0.5, 1.35)' }}>
      {/* rod + hook */}
      <div className="rounded-b-sm" style={{ width: '30px', height: '9px', background: 'linear-gradient(180deg, #b8839a, #9c6b80)', boxShadow: '0 3px 8px rgba(150, 80, 100, 0.4)' }} />
      <div style={{ width: '1.5px', height: '52px', background: 'linear-gradient(to bottom, #b8839a, #9c6b80)' }} />
      <div className="relative" style={{ width: '40px', height: '12px', background: 'linear-gradient(180deg, #e8c0ce 0%, #d4a3b2 45%, #b8839a 100%)', borderRadius: '0 0 6px 6px', boxShadow: '0 2px 8px rgba(150, 80, 100, 0.3)' }}>
        <div className="absolute" style={{ width: '16px', height: '2px', top: '2px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', borderRadius: '1px' }} />
      </div>

      {/* balloon */}
      <div className="relative" style={{ marginTop: '-1px' }}>
        <motion.div
          animate={{ opacity: lit ? [0.1, 0.22, 0.1] : 0, scale: lit ? [1, 1.1, 1] : 0.8 }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{ width: '340px', height: '340px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(255,200,215,0.28) 0%, transparent 60%)', filter: 'blur(30px)' }}
        />
        <motion.div
          animate={{ opacity: lit ? [0.15, 0.32, 0.15] : 0, scale: lit ? [1, 1.05, 1] : 0.85 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
          className="absolute rounded-full pointer-events-none"
          style={{ width: '180px', height: '180px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(255,235,240,0.45) 0%, transparent 50%)', filter: 'blur(10px)' }}
        />
        <motion.div
          animate={{ boxShadow: lit ? '0 0 30px rgba(255,200,215,0.5), 0 0 85px rgba(245,180,200,0.2), inset 0 -5px 16px rgba(255,210,220,0.15)' : 'inset 0 -5px 16px rgba(0,0,0,0.2)' }}
          transition={{ duration: 3.8, repeat: lit ? Infinity : 0, ease: 'easeInOut' }}
          className="relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: '128px',
            height: '128px',
            background: lit
              ? 'radial-gradient(circle at 33% 27%, #ffffff 0%, #fff0f5 20%, #ffe0ea 46%, #ffc8d6 70%, #ffafbe 100%)'
              : 'radial-gradient(circle at 33% 27%, #c2c2c2 0%, #b2b2b2 20%, #a4a4a4 46%, #989898 70%, #8c8c8c 100%)',
            border: lit ? '1px solid rgba(255,190,210,0.35)' : '1px solid rgba(110,110,110,0.18)',
            transition: 'background 1.2s ease, border 1.2s ease',
          }}
        >
          <motion.div animate={{ opacity: lit ? 0.55 : 0.04 }} className="absolute pointer-events-none" style={{ width: '38px', height: '24px', top: '12%', left: '16%', background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.88), transparent 68%)', transform: 'rotate(-20deg)', borderRadius: '50%' }} />
          <motion.div animate={{ opacity: lit ? 1 : 0.22, scaleY: lit ? 1 : 0.5 }} transition={{ duration: 1 }} className="absolute rounded-full" style={{ width: '9px', height: '11px', top: '36%', left: '30%', background: '#6b4655' }} />
          <motion.div animate={{ opacity: lit ? 1 : 0.22, scaleY: lit ? 1 : 0.5 }} transition={{ duration: 1 }} className="absolute rounded-full" style={{ width: '9px', height: '11px', top: '36%', right: '30%', background: '#6b4655' }} />
          <svg className="absolute pointer-events-none" style={{ bottom: '21%', left: '50%', transform: 'translateX(-50%)' }} width="26" height="13" viewBox="0 0 26 13">
            <motion.path d={lit ? 'M3 2 Q13 14 23 2' : 'M3 2 Q13 7 23 2'} fill="none" stroke={lit ? '#8a5a6b' : '#666'} strokeWidth="1.7" strokeLinecap="round" animate={{ opacity: lit ? 1 : 0.18 }} transition={{ duration: 1 }} />
          </svg>
        </motion.div>
      </div>
      <div style={{ width: '35px', height: '9px', background: 'linear-gradient(180deg, #b8839a 0%, #d4a3b2 50%, #e8c0ce 100%)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }} />

      {/* pull string coils */}
      <div className="flex flex-col items-center" style={{ marginTop: '1px', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}>
        <div className="flex flex-col items-center" style={{ gap: `${1.2 + 0.03 * dragY}px`, transition: dragging ? 'none' : 'gap 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          {Array.from({ length: 10 }).map((_, n) => {
            const i = (n + 1) / 10;
            const r = dragging ? dragX * Math.pow(i, 1.5) : 0;
            const s = dragging ? (n / 10) * dragY * 0.15 : 0;
            return (
              <div key={n} style={{ transform: `translate(${r}px, ${s}px)`, transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1.1, 0.5, 1.35)' }}>
                <svg width="6" height="10" viewBox="0 0 6 10">
                  <ellipse cx="3" cy="5" rx="2.2" ry="4" fill="none" stroke={lit ? '#b8839a' : '#6b4655'} strokeWidth="1.3" style={{ transition: 'stroke 1s' }} />
                </svg>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center" style={{ width: '18px', height: '18px', borderRadius: '50%', background: lit ? 'linear-gradient(145deg, #e8c0ce, #b8839a)' : 'linear-gradient(145deg, #8a8a8a, #5a5a5a)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 3px 10px rgba(150, 80, 100, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)', transform: `translate(${dragX}px, ${0.18 * dragY}px)`, transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1.1, 0.5, 1.35)' }}>
          <div className="rounded-full" style={{ width: '5px', height: '5px', background: lit ? '#8a5a6b' : '#3a3a3a' }} />
        </div>
      </div>
    </div>
  );
}

// Pullable screen (used for Intro and String)
export default function PullableScreen({ onNext }: { onNext: () => void }) {
  const [lit, setLit] = useState(true);
  const [fled, setFled] = useState(false);
  const [drag, setDrag] = useState({ on: false, sy: 0, cy: 0, sx: 0, cx: 0 });

  const start = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    if (!lit || fled) return;
    const p = 'touches' in e ? e.touches[0] : (e as React.PointerEvent);
    setDrag({ on: true, sy: p.clientY, cy: p.clientY, sx: p.clientX, cx: p.clientX });
  }, [lit, fled]);

  const move = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    const p = 'touches' in e ? e.touches[0] : (e as React.PointerEvent);
    setDrag(d => ({ ...d, cy: p.clientY, cx: p.clientX }));
  }, []);

  const end = useCallback(() => {
    setDrag(d => {
      if (d.on && d.cy - d.sy > 45) {
        setFled(true);
        setTimeout(() => onNext(), 1600);
        return { on: false, sy: 0, cy: 0, sx: 0, cx: 0 };
      }
      return d.on ? { on: false, sy: 0, cy: 0, sx: 0, cx: 0 } : d;
    });
  }, [onNext]);

  useEffect(() => {
    if (!drag.on) return;
    const mm = (e: MouseEvent) => move({ clientX: e.clientX, clientY: e.clientY } as React.PointerEvent);
    const mu = () => end();
    const tm = (e: TouchEvent) => move(e as unknown as React.TouchEvent);
    const te = () => end();
    window.addEventListener('mousemove', mm, { passive: false });
    window.addEventListener('mouseup', mu);
    window.addEventListener('touchmove', tm, { passive: false });
    window.addEventListener('touchend', te);
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', te);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag.on, end]);

  const c = drag.on ? Math.min(Math.max(0, drag.cy - drag.sy), 90) : 0;
  const h = drag.on ? Math.min(Math.max(-60, drag.cx - drag.sx), 60) : 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'transparent', userSelect: 'none', WebkitUserSelect: 'none' }}
      onPointerDown={start}
      onTouchStart={start}
    >
      <AmbientGlow active={lit && !fled} />
      <PinkDots active={lit && !fled} />

      <motion.div
        animate={fled ? { x: ['0vw', '-150vw'], opacity: [1, 0], scale: [1, 0.8] } : { x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.7, 0, 0.84, 0] }}
        className="relative flex flex-col items-center"
        style={{ zIndex: 10, transformOrigin: 'top center' }}
      >
        <div className="scale-90 sm:scale-100 lg:scale-110 xl:scale-125 origin-top">
          <Balloon lit={lit && !fled} dragging={drag.on} dragX={h} dragY={c} />
        </div>
        {!drag.on && lit && !fled && (
          <motion.div className="mt-3 pointer-events-none" animate={{ y: [0, 5, 0], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M5 1 L5 9 M2 7 L5 10 L8 7" stroke="rgba(219, 144, 150, 0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: lit && !fled ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute left-0 right-0 text-center"
        style={{ bottom: '18%', zIndex: 10, fontFamily: 'Georgia, serif', color: 'rgba(219, 144, 150, 0.6)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase' }}
      >
        drag the string down
      </motion.p>
    </div>
  );
}