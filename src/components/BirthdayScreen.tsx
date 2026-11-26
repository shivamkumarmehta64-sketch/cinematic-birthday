'use client';

import { motion } from 'framer-motion';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Confetti from './Confetti';

function CakeSVG() {
  return (
    <svg viewBox="0 0 300 260" className="w-56 md:w-72 xl:w-[26rem] object-contain pointer-events-none" style={{ filter: 'drop-shadow(0 15px 20px rgba(219, 144, 150, 0.35))' }}>
      {/* plate */}
      <ellipse cx="150" cy="235" rx="130" ry="22" fill="#ffffff" stroke="#f0dce8" strokeWidth="2" />
      {/* bottom tier */}
      <rect x="55" y="150" width="190" height="70" rx="10" fill="#ffd9e2" stroke="#ffb8ca" strokeWidth="3" />
      <rect x="55" y="150" width="190" height="12" fill="#ffc1d4" />
      {/* middle tier */}
      <rect x="85" y="95" width="130" height="60" rx="10" fill="#ffe6ed" stroke="#ffc1d4" strokeWidth="3" />
      {/* top tier */}
      <rect x="110" y="45" width="80" height="55" rx="10" fill="#fff1f4" stroke="#ffd3e0" strokeWidth="3" />
      {/* icing drips */}
      <path d="M110 108 q10 14 20 0 q10 14 20 0 q10 14 20 0" fill="#fff1f4" stroke="none" />
      {/* candle */}
      <rect x="145" y="18" width="10" height="30" rx="2" fill="#ff6b9d" />
      <rect x="147" y="22" width="6" height="4" fill="#ffffff" opacity="0.8" />
      {/* flame */}
      <ellipse cx="150" cy="10" rx="7" ry="11" fill="#ffcc55" />
      <ellipse cx="150" cy="13" rx="4" ry="6" fill="#ff9f43" />
      {/* cherries */}
      <circle cx="90" cy="150" r="8" fill="#ff4d6d" />
      <circle cx="210" cy="150" r="8" fill="#ff4d6d" />
      <circle cx="120" cy="95" r="7" fill="#ff4d6d" />
    </svg>
  );
}

export default function BirthdayScreen({ name = 'My Girl', onNext }: { name?: string; onNext: () => void }) {
  const [ready, setReady] = useState(true); // cake revealed
  const [cutting, setCutting] = useState(false);
  const [sliced, setSliced] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cutlineRef = useRef<HTMLElement | null>(null);

  const getPos = useCallback((e: React.PointerEvent) => {
    const cv = canvasRef.current;
    if (!cv) return { x: e.clientX, y: e.clientY };
    const rect = cv.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const syncSize = () => {
      const rect = cv.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cv.width = Math.round(rect.width);
        cv.height = Math.round(rect.height);
      }
    };
    syncSize();
    window.addEventListener('resize', syncSize);
    return () => window.removeEventListener('resize', syncSize);
  }, []);

  // cumulative total travel tracked independently of re-renders
  const traveled = useRef(0);
  const last = useRef({ x: 0, y: 0 });

  const runCut = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    traveled.current = Math.min(traveled.current + Math.abs(dx), 240);
    const pct = Math.min(Math.max((traveled.current / 240) * 100, progress), 100);
    setProgress(pct);
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(219, 144, 150, 0.8)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    if (pct >= 100) {
      setCutting(false);
      setSliced(true);
    }
  }, [progress]);

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready || sliced) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setCutting(true);
    last.current = getPos(e);
  }, [ready, sliced, getPos]);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cutting || sliced) return;
    const pos = getPos(e);
    runCut(last.current, pos);
    last.current = pos;
  }, [cutting, sliced, runCut, getPos]);

  const onUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (cutting) setCutting(false);
  }, [cutting]);

  // when sliced, fire confetti/fireworks
  useEffect(() => {
    if (!sliced) return;
    const ctx = gsap.context(() => {
      const targets = document.querySelectorAll('.celebrate-cell') as NodeListOf<HTMLElement>;
      const tl = gsap.timeline();
      targets.forEach((el) => {
        const x = (Math.random() - 0.5) * 200;
        const y = -((40 + Math.random() * 80));
        const dur = 0.8 + Math.random() * 0.6;
        tl.to(el, { x: x, y: y, opacity: 0, rotation: (Math.random() - 0.5) * 720, duration: dur, ease: 'power2.out' }, 0);
      });
    });
    return () => ctx.revert();
  }, [sliced]);

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="w-full min-h-dvh flex items-center justify-center overflow-hidden relative">
      <div className="relative w-full max-w-4xl min-h-dvh flex flex-col items-center justify-center px-6 text-center z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          style={{ pointerEvents: 'none' }}
        />

        {/* instruction / celebration header */}
        {sliced ? (
          <>
            <Confetti />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2 }}>
            <motion.h2
              className="text-5xl md:text-7xl font-bold tracking-tighter"
              style={{ backgroundImage: 'linear-gradient(to right, #d68b91, #b18ccf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Pacifico, cursive', paddingBottom: '10px' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Happy Birthday, {name}! 🎂
            </motion.h2>
          </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: '#a96f74', textShadow: '0 2px 10px rgba(255, 255, 255, 0.6)', fontFamily: 'Georgia, serif' }}>
              Swipe to Cut the Cake! 🍰
            </h2>
            <p className="mt-3 text-base md:text-lg font-medium" style={{ color: '#b5898e' }}>Drag your finger/cursor to slice</p>
          </motion.div>
        )}

        {/* cake */}
        <div className="relative mt-8" onPointerMove={onMove} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} style={{ touchAction: 'none' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: ready || sliced ? 1 : 0.6 }} transition={{ duration: 1.1, delay: 0.6 }}>
            <CakeSVG />
          </motion.div>
          {/* celebrate cells burst outward when sliced */}
          {sliced &&
            Array.from({ length: 12 }).map((_, i) => (
              <span key={i} data-celebrate className="celebrate-cell absolute rounded-full" style={{ left: '50%', top: '50%', width: '10px', height: '10px', background: ['#ff6b9d', '#ffd700', '#b18ccf', '#54a0ff', '#ff9ff3'][i % 5], boxShadow: '0 0 12px currentColor' }} />
            ))}
        </div>

        {/* progress ring */}
        {ready && !sliced && progress > 0 && (
          <div className="mt-12">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(219, 144, 150, 0.15)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#db9096" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * (1 - progress / 100)}`} style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ color: '#db9096' }}>{Math.round(progress)}%</div>
            </div>
          </div>
        )}

        {/* next button */}
        {sliced && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 mt-10 rounded-full font-medium tracking-wide"
            style={{ color: '#fff', background: 'linear-gradient(to bottom, #d68b91 0%, #b96b71 100%)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0px 6px 0px #915056, 0px 12px 20px rgba(168, 94, 100, 0.4)', transition: 'all 0.15s ease-in-out', cursor: 'pointer' }}
          >
            Next Scene →
          </motion.button>
        )}
      </div>
    </div>
  );
}