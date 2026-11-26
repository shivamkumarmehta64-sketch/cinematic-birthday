'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import PullableScreen from '../components/PullableScreen';
import BirthdayScreen from '../components/BirthdayScreen';
import FireScreen from '../components/FireScreen';
import MessageScreen from '../components/MessageScreen';
import MemoriesScreen from '../components/MemoriesScreen';
import Cover from '../components/Cover';
import FlowerClouds from '../components/FlowerClouds';
import { BirthdayData, DEFAULT_DATA } from '../lib/birthday';
import ClickSpark from './reactbits/ClickSpark/ClickSpark';
import Magnet from './reactbits/Magnet/Magnet';
import StarBorder from './reactbits/StarBorder/StarBorder';

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function CinematicExperience({
  data = DEFAULT_DATA,
  showCreateLink = false,
}: {
  data?: BirthdayData;
  showCreateLink?: boolean;
}) {
  const step = useRef<Step>(0);
  const [e, setE] = useState<Step>(0);
  const [coverOn, setCoverOn] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAudio = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  // WebAudio "Happy Birthday" melody (no external file)
  const playMelody = useCallback(() => {
    try {
      stopAudio();
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.22;
      master.connect(ctx.destination);
      const notes: [number, number][] = [
        [392, 0], [392, 0.4], [440, 0.8], [392, 1.2], [523.25, 1.6], [493.88, 2.4],
        [392, 2.8], [392, 3.2], [440, 3.6], [392, 4], [587.33, 4.4], [523.25, 5.2],
        [392, 5.6], [392, 6], [784, 6.4], [659.25, 6.8], [523.25, 7.2], [493.88, 7.6],
        [440, 8], [698.46, 8.4], [698.46, 8.6], [659.25, 9], [523.25, 9.4],
        [587.33, 9.8], [523.25, 10.4],
      ];
      notes.forEach(([freq, t]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(master);
        const start = ctx.currentTime + t;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.6, start + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
        o.start(start);
        o.stop(start + 0.6);
      });
    } catch {
      /* audio not supported */
    }
  }, []);

  const go = useCallback((s: Step) => {
    step.current = s;
    setE(s);
  }, []);

  // Ambient music: real music.mp4 loop, faded in after tapping open
  const startMusic = useCallback(() => {
    try {
      const audio = musicRef.current;
      if (!audio) return;
      audio.loop = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      fadeIntervalRef.current = setInterval(() => {
        if (!musicRef.current) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          return;
        }
        if (musicRef.current.volume < 0.95) {
          musicRef.current.volume = Math.min(musicRef.current.volume + 0.02, 0.95);
        } else if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }, 80);
    } catch {
      /* audio not supported */
    }
  }, []);

  const open = useCallback(() => {
    if (coverOn) return;
    startMusic();
    playMelody();
    setCoverOn(true); // flower cover animation
  }, [coverOn, startMusic, playMelody]);

  const restart = useCallback(() => {
    stopAudio();
    setCoverOn(false);
    go(0);
  }, [go, stopAudio]);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reduced) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          '.polaroid-card',
          { y: 24, opacity: 0, rotate: -1.5 },
          { y: 0, opacity: 1, rotate: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform' }
        );
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      ctx.revert();
      stopAudio();
      musicRef.current?.pause();
    };
  }, [stopAudio]);

  const p0 = data.photos[0];

  // Hearts background (locked + celebration)
  const hearts = (
    <>
      {[
        { c: 'heart-1', ch: '♡' },
        { c: 'heart-2', ch: '♥' },
        { c: 'heart-3', ch: '♥' },
        { c: 'heart-4', ch: '♡' },
        { c: 'heart-5', ch: '♡' },
        { c: 'heart-6', ch: '♥' },
        { c: 'heart-7', ch: '♥' },
      ].map((h) => (
        <span key={h.c} className={`floating-heart ${h.c}`} aria-hidden="true">
          {h.ch}
        </span>
      ))}
    </>
  );

  return (
    <ClickSpark
      sparkColor={['#ff6b9d', '#d8acff', '#ffd166', '#ffffff']}
      sparkSize={11}
      sparkRadius={22}
      sparkCount={10}
      duration={460}
      easing="spring"
      className="min-h-dvh"
    >
      <main className={`birthday-container ${e > 0 ? 'bg-black' : ''}`}>
        {e === 0 && <div className="soft-pink-bg" aria-hidden="true" />}
        {e === 0 && hearts}
        {e === 0 && <FlowerClouds />}

        <audio ref={musicRef} src="/music.mp4" loop preload="auto" style={{ display: 'none' }} />

        {coverOn && <Cover onCovered={() => go(1)} onDone={() => setCoverOn(false)} />}

        <AnimatePresence mode="wait">
          {e === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9 }}
            >
              <div className="main-stage">
                <div className="flex flex-col items-center">
                  <div className="polaroid-card">
                    <div className="photo-wrapper">
                      {p0 ? (
                        <img src={p0} alt={data.name} className="photo-img" />
                      ) : (
                        <img src="/images/emoji.png" alt="Birthday" className="photo-img" />
                      )}
                    </div>
                    <p className="birthday-title">Happy Birthday, {data.name}!</p>
                    <p className="tap-hint">🎁 A little surprise is waiting for you</p>
                  </div>

                  <Magnet padding={56} magnetStrength={4} scale={1.03} className="mt-6">
                    <StarBorder
                      as="button"
                      onClick={open}
                      theme="light"
                      color="#ff6b9d"
                      trailColor="#d8acff"
                      backgroundColor="linear-gradient(135deg, #ff7aa8, #d85c8a)"
                      textColor="#ffffff"
                      borderColor="rgba(255,255,255,0.45)"
                      radius={999}
                      thickness={2}
                      glow={0.6}
                      className="open-btn-star active:scale-[0.98] transition-transform"
                    >
                      ✨ Open Your Surprise ✨
                    </StarBorder>
                  </Magnet>

                  {showCreateLink && (
                    <Link href="/create" className="create-link">
                      🎂 Make one for someone you love
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        {e === 1 && (
          <motion.div key="intro" className="screen-wrapper">
            <PullableScreen onNext={() => go(2)} />
          </motion.div>
        )}

        {e === 2 && (
          <motion.div key="birthday" className="screen-wrapper" style={{ background: 'transparent' }}>
            <BirthdayScreen name={data.name} onNext={() => go(3)} />
          </motion.div>
        )}

        {e === 3 && (
          <motion.div key="fire" className="screen-wrapper">
            <FireScreen onNext={() => go(4)} />
          </motion.div>
        )}

        {e === 4 && (
          <motion.div key="message" className="screen-wrapper">
            <MessageScreen message={data.message} name={data.name} onNext={() => go(5)} />
          </motion.div>
        )}

        {e === 5 && (
          <motion.div key="string" className="screen-wrapper">
            <PullableScreen onNext={() => go(6)} />
          </motion.div>
        )}

        {e === 6 && (
          <motion.div
            key="memories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="screen-wrapper"
          >
            <MemoriesScreen photos={data.photos} name={data.name} />
          </motion.div>
        )}
      </AnimatePresence>

      {e === 6 && (
        <button
          onClick={restart}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-xs font-semibold tracking-wide"
          style={{ color: '#fff', background: 'rgba(214, 91, 139, 0.7)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
        >
          🔄 Experience Again
        </button>
      )}
      </main>
    </ClickSpark>
  );
}