'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const STEPS = [
  { emoji: '📸', title: 'Add their photos', text: 'Pick up to 8 of your favorite pictures — they drive the whole experience and the memories scene.' },
  { emoji: '💌', title: 'Their name & your words', text: 'Type their name and a heartfelt message. Choose a vibe: for her, for him, or anyone.' },
  { emoji: '🎬', title: 'Share the magic link', text: 'Get an animated cinematic link in one tap. Send it on WhatsApp, Instagram, or anywhere.' },
];

const FEATURES = [
  { emoji: '🍿', title: 'Cinematic experience', text: 'A full animated journey — pull-to-open screens, candles, confetti, memories and a message reveal.' },
  { emoji: '🎵', title: 'Music & melodies', text: 'An ambient soundtrack plus a WebAudio Happy Birthday melody. No files needed.' },
  { emoji: '🖼️', title: '9:16 story cards', text: 'Download ready-to-post Instagram / WhatsApp Status cards in your chosen theme.' },
  { emoji: '🎥', title: 'Story video', text: 'Record a shareable video slideshow with crossfades and confetti, right in the browser.' },
  { emoji: '🎨', title: '4 gorgeous themes', text: 'Rose Pink, Golden Hour, Violet Dream, Ocean Breeze — swap the whole mood in one click.' },
  { emoji: '🔒', title: '100% private', text: 'Nothing is uploaded. Everything runs in your browser and travels in the link itself.' },
];

export default function Home() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <span className="landing-logo">🎂 CinematicBirthday</span>
        <div className="landing-nav-links">
          <a href="#how" className="landing-nav-link">How it works</a>
          <a href="#features" className="landing-nav-link">Features</a>
          <Link href="/create" className="landing-nav-cta">✨ Create one free</Link>
        </div>
      </header>

      <section className="landing-hero">
        <motion.div initial="hidden" animate="show" className="landing-hero-inner">
          <motion.div variants={fadeUp} custom={0}>
            <div className="landing-badge">🎈 A birthday surprise, made in 2 minutes</div>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="landing-title">
            Make a <span className="grad">cinematic birthday</span>
            <br />
            surprise for <em>anyone</em>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="landing-sub">
            For her. For him. For your best friend, your mom, your little one.
            Drop in a few photos and a message — get a stunning animated gift that
            opens like a film, plus story cards and a video to share.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="landing-cta-row">
            <Link href="/create" className="landing-btn primary">✨ Make a surprise — it&apos;s free</Link>
            <Link href="/experience" className="landing-btn ghost">🍿 Watch the classic demo</Link>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="landing-chips">
            <span className="landing-chip girl">🌸 For her</span>
            <span className="landing-chip boy">🎂 For him</span>
            <span className="landing-chip anyone">✨ For anyone</span>
          </motion.div>
        </motion.div>

        <div className="landing-hero-card" aria-hidden="true">
          <div className="hero-photo" />
          <div className="hero-card-title">Happy Birthday, Aryan! 🎉</div>
          <div className="hero-card-hint">🎁 A little surprise is waiting…</div>
        </div>
      </section>

      <section id="how" className="landing-section">
        <motion.h2
          className="landing-h2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          How it works
        </motion.h2>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              className="step-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className="step-emoji">{s.emoji}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="landing-section">
        <motion.h2
          className="landing-h2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Everything included
        </motion.h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
            >
              <div className="feature-emoji">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="landing-final">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="landing-final-card"
        >
          <h2>Someone&apos;s birthday is coming up.</h2>
          <p>Give them a surprise they&apos;ll replay forever. It takes two minutes and it&apos;s completely free.</p>
          <Link href="/create" className="landing-btn primary big">🎁 Create their surprise</Link>
        </motion.div>
      </section>

      <footer className="landing-footer">
        Made with 💕 · Everything runs in your browser, nothing is uploaded.
      </footer>
    </main>
  );
}
