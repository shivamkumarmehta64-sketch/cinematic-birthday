'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { compressFile } from '../../lib/image';
import { packShareable, shareUrl, pack, defaultMessageFor, GENDERS, BirthdayData, Gender } from '../../lib/birthday';
import { makeStoryCards, recordStoryVideo, themeById, THEMES, downloadCanvas } from '../../lib/story';

const MAX_PHOTOS = 8;

export default function CreatePage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState<Gender>('custom');
  const [photos, setPhotos] = useState<string[]>([]);
  const [themeId, setThemeId] = useState('pink');
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const theme = themeById(themeId);

  const pickGender = useCallback((g: Gender) => {
    setGender(g);
    setMessage((prev) =>
      !prev.trim() || prev === defaultMessageFor('girl') || prev === defaultMessageFor('boy') || prev === defaultMessageFor('custom')
        ? defaultMessageFor(g)
        : prev
    );
  }, []);

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const list = Array.from(files).slice(0, Math.max(0, room));
    if (!list.length) return;
    setBusy('compressing photos…');
    const compressed = await Promise.all(list.map((f) => compressFile(f, 900, 0.72)));
    setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
    setBusy(null);
  }, [photos.length]);

  const removePhoto = useCallback((i: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const buildData = (): BirthdayData => ({
    name: name.trim() || 'Cutie',
    message: message.trim() || defaultMessageFor(gender),
    photos: photos.slice(0, MAX_PHOTOS),
    gender,
  });

  const preview = useCallback(async () => {
    if (!photos.length) {
      setBusy('add at least one photo first 💛');
      setTimeout(() => setBusy(null), 1600);
      return;
    }
    setBusy('making your surprise…');
    try {
      const shareData = await packShareable(buildData());
      setResult({ url: shareUrl(shareData) });
    } catch {
      setResult({ url: `${location.origin}/experience?d=${encodeURIComponent(pack(buildData()))}` });
    } finally {
      setBusy(null);
    }
  }, [photos, name, message]);

  const makeCards = useCallback(async () => {
    if (!photos.length) return;
    setBusy('drawing story cards…');
    const d = buildData();
    const cards = await makeStoryCards(photos, d.name, theme, 10, d.gender);
    cards.forEach((c, i) => {
      window.setTimeout(() => downloadCanvas(c.canvas, `story-card-${i + 1}-${d.name}.png`), i * 250);
    });
    setBusy(null);
  }, [photos, name, message, theme, gender]);

  const makeVideo = useCallback(async () => {
    if (!photos.length) return;
    setBusy('recording story video…');
    const d = buildData();
    try {
      const { blob, mimeType } = await recordStoryVideo(photos, d.name, theme, {
        perPhoto: 2.8,
        crossfade: 0.7,
        musicUrl: '/music.mp4',
        onProgress: (p) => setProgress(p),
        gender: d.gender,
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `story-${d.name}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setBusy('could not record a video in this browser');
      setTimeout(() => setBusy(null), 2000);
      return;
    }
    setProgress(0);
    setBusy(null);
  }, [photos, name, message, theme, gender]);

  return (
    <main className="create-page">
      <header className="create-header">
        <Link href="/" className="create-back">← The classic gift</Link>
        <h1>🎁 Make a surprise for their birthday</h1>
        <p className="create-sub">Add their name, a few photos &amp; your words — get an animated link and 9:16 story cards / video to post anywhere.</p>
      </header>

      <section className="create-card">
        <div className="field-label">
          Who is the birthday for?
          <span className="field-hint">Pick a vibe — the message &amp; story style adapt automatically</span>
        </div>
        <div className="gender-row">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              onClick={() => pickGender(g.id)}
              className={`gender-chip ${g.id === gender ? 'active' : ''}`}
            >
              <span className="gender-emoji">{g.emoji}</span>
              <span className="gender-label">{g.label}</span>
              <span className="gender-hint">{g.hint}</span>
            </button>
          ))}
        </div>

        <label className="field-label" htmlFor="name">Their name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya, Aryan, Mom, Best friend…" className="text-input" maxLength={40} />

        <label className="field-label" htmlFor="msg">A short love note / message</label>
        <textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write something heartfelt…" className="text-area" rows={4} maxLength={600} />

        <div className="field-label">
          Their photos
          <span className="field-hint">up to {MAX_PHOTOS} (they appear in the memories scene &amp; story)</span>
        </div>
        <div className="photo-grid">
          {photos.map((src, i) => (
            <div className="photo-cell" key={i}>
              <img src={src} alt={`photo ${i + 1}`} className="photo-cell-img" />
              <button onClick={() => removePhoto(i)} className="photo-remove" aria-label="remove photo">×</button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button onClick={() => fileRef.current?.click()} className="photo-add" aria-label="add photo">+</button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />

        <div className="field-label">Story style</div>
        <div className="theme-row">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeId(t.id)}
              className={`theme-chip ${t.id === themeId ? 'active' : ''}`}
              style={{ '--accent': t.accent } as React.CSSProperties}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="action-row">
          <button onClick={preview} disabled={!!busy} className="btn primary">✨ Make it</button>
          <button onClick={makeCards} disabled={!!busy || !photos.length} className="btn">🖼️ Story cards</button>
          <button onClick={makeVideo} disabled={!!busy || !photos.length} className="btn">🎥 Story video</button>
        </div>
        {busy && <div className="busy">⏳ {busy}{progress > 0 ? ` ${Math.round(progress * 100)}%` : ''}</div>}
      </section>

      {result && (
        <section className="result-card">
          <h2>Your surprise is ready ✨</h2>
          <p className="result-hint">
            Open the link to watch the full animated experience. Post the story cards/video on Instagram, WhatsApp Status or anywhere 💕
          </p>
          <div className="result-link">
            <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.url).catch(() => {});
            }}
            className="btn"
          >
            📋 Copy link
          </button>
        </section>
      )}

      <footer className="create-foot">
        Made with 💕 — everything runs in your browser, nothing is uploaded.
      </footer>
    </main>
  );
}