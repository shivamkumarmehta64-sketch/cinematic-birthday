'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_LETTER = `Happiest birthday my gurl 😍✨

I pray you achieve all your dreams, stay happy, and keep smiling the way you do... because that smile is my favorite thing ❤️

Everyday is your day because you are the main character... and YOU KNOW IT 😎

Let's share unlimited laughs, love, fights, and happiness 🌈

I love you forever and ever and ever 💕

Thankyou for being my partner in every sense, happy 19th darlzzz 🎂❤️😍

I love you darlzzzz please be with mee chelloo 🥹💘`;

function Corner({ pos }: { pos: { top?: number; bottom?: number; left?: number; right?: number; borderTop?: string; borderLeft?: string; borderRight?: string; borderBottom?: string } }) {
  return (
    <div className="absolute" style={{ width: '12px', height: '12px', ...pos }} />
  );
}

export default function MessageScreen({ message, name = 'you', onNext }: { message?: string; name?: string; onNext: () => void }) {
  const LETTER_TEXT = message ?? DEFAULT_LETTER;
  const [opened, setOpened] = useState(false);
  const [shown, setShown] = useState(false);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  // typewriter effect
  useEffect(() => {
    if (!shown) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(LETTER_TEXT.slice(0, i));
      if (i >= LETTER_TEXT.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, 32);
    return () => clearInterval(iv);
  }, [shown, LETTER_TEXT]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative px-4">
      <div style={{ width: '100%', maxWidth: 'min(560px, 100vw)', textAlign: 'center', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Playpen Sans Deva', cursive, 'Playfair Display', serif", fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: '#d65b8b', textShadow: '0 1px 2px rgba(0,0,0,0.05)', letterSpacing: '0.04em', margin: 0 }}>
            A Letter, Just For You
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'rgba(124, 60, 100, 0.7)', fontSize: '14px', marginTop: '6px' }}>Tap the envelope to unseal</p>
        </motion.div>

        <motion.div style={{ perspective: 1000, display: 'flex', justifyContent: 'center', marginBottom: '28px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <motion.div
            whileHover={shown ? {} : { scale: 1.04, rotateZ: -1 }}
            whileTap={shown ? {} : { scale: 0.97 }}
            onClick={opened || shown ? undefined : () => {
              setOpened(true);
              setTyped('');
              setDone(false);
              openTimerRef.current = setTimeout(() => setShown(true), 700);
            }}
            style={{ position: 'relative', width: '280px', height: '190px', cursor: shown ? 'default' : 'pointer' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #fff0f6 0%, #ffe0ef 100%)', border: '1px solid rgba(214, 91, 139, 0.2)', boxShadow: '0 10px 24px rgba(214, 91, 139, 0.12), 0 4px 8px rgba(0,0,0,0.02), inset 0 1px 3px rgba(255,255,255,0.8)', borderRadius: '4px' }} />
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 280 190">
              <line x1="0" y1="190" x2="140" y2="100" stroke="rgba(214,91,139,0.15)" strokeWidth="1" />
              <line x1="280" y1="190" x2="140" y2="100" stroke="rgba(214,91,139,0.15)" strokeWidth="1" />
              <line x1="0" y1="0" x2="140" y2="100" stroke="rgba(214,91,139,0.1)" strokeWidth="0.5" />
              <line x1="280" y1="0" x2="140" y2="100" stroke="rgba(214,91,139,0.1)" strokeWidth="0.5" />
            </svg>
            {/* flap */}
            <motion.div initial={{ rotateX: 0 }} animate={{ rotateX: opened ? -160 : 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', transformOrigin: 'top center', transformStyle: 'preserve-3d', zIndex: 10 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg, #ffe0ef 0%, #ffd1e4 100%)', border: '1px solid rgba(214, 91, 139, 0.15)' }} />
            </motion.div>
            {/* wax seal */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: opened ? 1 : 15 }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ff6b9d 0%, #d63384 50%, #b3206a 100%)', boxShadow: '0 3px 8px rgba(179,32,106,0.3), inset 0 1px 3px rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', color: '#fff0f6', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>❤</span>
              </div>
            </div>
            {!opened && (
              <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: '#d65b8b' }}>For You, {name}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(124, 60, 100, 0.6)', marginTop: '3px', textTransform: 'uppercase' }}>Tap to unseal 💌</div>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(214, 91, 139, 0.3))' }} />
          <span style={{ color: 'rgba(214, 91, 139, 0.4)', fontSize: '12px' }}>💌</span>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, rgba(214, 91, 139, 0.3), transparent)' }} />
        </motion.div>

        {/* letter modal */}
        <AnimatePresence>
          {shown && (
            <motion.div
              style={{ position: 'fixed', inset: 0, background: 'rgba(255, 230, 245, 0.5)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', gap: '20px', overflowY: 'auto' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                onClick={(e) => (e as React.MouseEvent).stopPropagation()}
                style={{
                  width: '100%', maxWidth: 'min(700px, 94vw)', backgroundColor: '#fffafc',
                  backgroundImage: 'radial-gradient(ellipse 600px 400px at 20% 20%, rgba(214,91,139,0.04) 0%, transparent 50%), radial-gradient(ellipse 500px 350px at 85% 75%, rgba(216,172,255,0.04) 0%, transparent 50%), repeating-linear-gradient(0deg, rgba(124,60,100,0.015) 0px, rgba(124,60,100,0.015) 1px, transparent 1px, transparent 24px)',
                  backgroundSize: '100% 100%, 100% 100%, 100% 24px',
                  borderRadius: '12px', padding: '48px 40px 40px',
                  boxShadow: '0 30px 70px rgba(214, 91, 139, 0.15), 0 10px 30px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(255,255,255,0.9)',
                  border: '1px solid rgba(214, 91, 139, 0.15)', position: 'relative', maxHeight: '82vh', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: "'Playpen Sans Deva', cursive, 'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: '#7c3c64', marginBottom: '6px' }}>Happy Birthday {name} 🎂</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#d65b8b', fontSize: '17px', margin: 0 }}>Just for you 💌</p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                  <p style={{ fontFamily: "'Playpen Sans Deva', cursive", fontSize: '19px', lineHeight: '31px', color: '#5c2b48', whiteSpace: 'pre-line', textAlign: 'left', padding: '0 8px', margin: 0 }}>
                    {typed}
                    {!done && <span className="ink-cursor" style={{ color: '#d65b8b', fontWeight: 300 }}>|</span>}
                  </p>
                </div>
              </motion.div>

              <AnimatePresence>
                {done && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                    <motion.button
                      onClick={onNext}
                      whileHover={{ backgroundColor: 'rgba(214, 91, 139, 0.15)', borderColor: 'rgba(214, 91, 139, 0.6)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{ width: 'fit-content', minWidth: '120px', padding: '10px 20px', fontFamily: "'Playpen Sans Deva', cursive", fontSize: '15px', fontWeight: 600, color: '#7c3c64', background: 'rgba(255, 250, 252, 0.4)', border: '1px solid rgba(214, 91, 139, 0.4)', borderRadius: '0px', cursor: 'pointer', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(214, 91, 139, 0.08)', transition: 'background-color 0.2s, border-color 0.2s', margin: '0 auto' }}
                    >
                      Next 🤍
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}