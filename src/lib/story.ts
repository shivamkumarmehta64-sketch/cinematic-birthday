'use client';

import { loadImage } from './image';
import type { Gender } from './birthday';

export const STORY_W = 1080;
export const STORY_H = 1920;

export type StoryTheme = {
  id: string;
  label: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  accent2: string;
  text: string;
  cardBg: string;
  glow: string;
};

export const THEMES: StoryTheme[] = [
  { id: 'pink', label: 'Rose Pink', bgTop: '#ffdff0', bgBottom: '#ffe9f4', accent: '#d65b8b', accent2: '#b18ccf', text: '#7c3c64', cardBg: '#fffafc', glow: 'rgba(214,91,139,0.35)' },
  { id: 'gold', label: 'Golden Hour', bgTop: '#fff1d6', bgBottom: '#ffe8c2', accent: '#c8862d', accent2: '#e0a95c', text: '#7a4e12', cardBg: '#fffdf6', glow: 'rgba(216,166,92,0.4)' },
  { id: 'violet', label: 'Violet Dream', bgTop: '#ece4ff', bgBottom: '#f3eaff', accent: '#7c5cd6', accent2: '#b18ccf', text: '#4a3288', cardBg: '#fdfbff', glow: 'rgba(124,92,214,0.35)' },
  { id: 'aqua', label: 'Ocean Breeze', bgTop: '#dcf4ff', bgBottom: '#e6f9ff', accent: '#1f9ec7', accent2: '#62b8d6', text: '#15566b', cardBg: '#fbfeff', glow: 'rgba(31,158,199,0.4)' },
];

export function themeById(id: string): StoryTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

const TITLES: Record<Gender, string[]> = {
  girl: ['Sweetheart', 'Baddie', 'Angel', 'Dreamgirl', 'Icon', 'Stunner', 'Babe', 'Darling', 'Sunshine', 'Queen'],
  boy: ['Legend', 'G.O.A.T', 'King', 'Champ', 'Icon', 'Beast', 'Star', 'Hero', 'Boss', 'Leader'],
  custom: ['Legend', 'Star', 'Icon', 'Champion', 'Sunshine', 'Hero', 'Amazing', 'Ace', 'MVP', 'Legend'],
};

export function titlesFor(gender?: Gender): string[] {
  return TITLES[gender ?? 'custom'];
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D, t: StoryTheme) {
  ctx.clearRect(0, 0, STORY_W, STORY_H);
  const g = ctx.createLinearGradient(0, 0, 0, STORY_H);
  g.addColorStop(0, t.bgTop);
  g.addColorStop(1, t.bgBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, STORY_W, STORY_H);

  const blobs: Array<[number, number, number, string]> = [
    [180, 260, 340, t.glow],
    [860, 1720, 420, t.glow],
    [760, 120, 260, 'rgba(255,255,255,0.5)'],
    [140, 1560, 300, 'rgba(255,255,255,0.45)'],
  ];
  for (const [x, y, r, c] of blobs) {
    const bg = ctx.createRadialGradient(x, y, 0, x, y, r);
    bg.addColorStop(0, c);
    bg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  ctx.save();
  for (let i = 0; i < 26; i++) {
    const x = (i * 173 + 61) % STORY_W;
    const y = (i * 97 + 23) % STORY_H;
    const s = 14 + ((i * 7) % 28);
    ctx.globalAlpha = 0.14 + ((i * 13) % 30) / 100;
    ctx.fillStyle = i % 2 ? t.accent : t.accent2;
    ctx.font = `${s}px "Segoe UI Symbol", sans-serif`;
    ctx.fillText(i % 3 === 0 ? '✦' : '♥', x, y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawPhotoCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  t: StoryTheme,
  opacity = 1
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  const cardW = STORY_W * 0.84;
  const cardH = STORY_H * 0.52;
  const cx = (STORY_W - cardW) / 2;
  const cy = STORY_H * 0.14;

  ctx.shadowColor = t.text + '33';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = t.cardBg;
  rr(ctx, cx, cy, cardW, cardH, 46);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  rr(ctx, cx, cy, cardW, cardH, 46);
  ctx.strokeStyle = t.accent + '55';
  ctx.lineWidth = 4;
  ctx.stroke();

  if (img) {
    const inner = cardW * 0.92;
    const ih = cardH * 0.78;
    const ix = cx + (cardW - inner) / 2;
    const iy = cy + (cardH - ih) / 2 - 8;
    ctx.save();
    rr(ctx, ix, iy, inner, ih, 26);
    ctx.clip();
    const scale = Math.max(inner / img.width, ih / img.height) * 1.02;
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, ix + (inner - dw) / 2, iy + (ih - dh) / 2, dw, dh);
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(124,60,100,0.06)';
  ctx.fillRect(cx, cy + cardH - 96, cardW, 96);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = t.text;
  ctx.font = `${Math.round(STORY_W * 0.033)}px "Playpen Sans Deva", "Cormorant Garamond", serif`;
  ctx.fillText('· a little memory ·', STORY_W / 2, cy + cardH - 48);
  ctx.restore();
}

function confettiBurst(ctx: CanvasRenderingContext2D, t: StoryTheme, io: number) {
  io = Math.max(0, Math.min(1, io));
  ctx.save();
  for (let i = 0; i < 70; i++) {
    const x = (i * 61 + 17) % STORY_W;
    const y = (i * 89 + 31) % STORY_H;
    const s = 8 + ((i * 3) % 20);
    ctx.globalAlpha = io * (0.5 + ((i * 13) % 50) / 100);
    ctx.fillStyle = [t.accent, t.accent2, '#ffd700', '#ff8fab', '#54a0ff'][i % 5];
    ctx.fillRect(x - s / 2, y - s / 4, s * 0.6, s * 0.6);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawTitle(ctx: CanvasRenderingContext2D, t: StoryTheme, text: string) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const baseSize = STORY_W * 0.058;
  ctx.font = `700 ${baseSize}px "Playpen Sans Deva", "Pacifico", cursive`;
  const tw = ctx.measureText(text).width;
  const cap = (STORY_W - 80) / Math.max(tw, 1);
  const size = baseSize * Math.min(1, cap);
  ctx.font = `700 ${size}px "Playpen Sans Deva", "Pacifico", cursive`;
  ctx.shadowColor = t.glow;
  ctx.shadowBlur = 18;
  ctx.fillStyle = t.text;
  ctx.fillText(text, STORY_W / 2, STORY_H * 0.09);
  ctx.shadowBlur = 0;
  ctx.restore();
}

export async function ensureFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('700 48px "Playpen Sans Deva"'),
      document.fonts.load('48px "Pacifico"'),
      document.fonts.load('600 48px "Cormorant Garamond"'),
      document.fonts.load('600 48px "Playfair Display"'),
    ]);
    await document.fonts.ready;
  } catch {
    /* fallback fonts are fine */
  }
}

export type CardResult = { index: number; title: string; canvas: HTMLCanvasElement };

export async function makeStoryCards(
  photos: string[],
  name: string,
  theme: StoryTheme,
  upTo = 10,
  gender?: Gender
): Promise<CardResult[]> {
  await ensureFonts();
  const list = photos.slice(0, upTo);
  const results: CardResult[] = [];
  const titles = titlesFor(gender);
  for (let i = 0; i < list.length; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = STORY_W;
    canvas.height = STORY_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    drawBackground(ctx, theme);
    const img = await loadImage(list[i]).catch(() => null);
    drawPhotoCard(ctx, img, theme, 1);
    const title = `${titles[i % titles.length]} • ${name}`;
    drawTitle(ctx, theme, title);
    if (i === 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.accent;
      ctx.font = `600 ${Math.round(STORY_W * 0.042)}px "Playpen Sans Deva", cursive`;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 16;
      ctx.fillText(`Happy Birthday, ${name}! 🎂`, STORY_W / 2, STORY_H * 0.14);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    confettiBurst(ctx, theme, 0.7);
    results.push({ index: i, title, canvas });
  }
  return results;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}

export function downloadAllCards(cards: CardResult[], name: string) {
  cards.forEach((c) => downloadCanvas(c.canvas, `birthday-${c.index + 1}-${name}.png`));
}

// --- Video slideshow (with optional music) ---------------------------------

export type VideoResult = { blob: Blob; mimeType: string };

export async function recordStoryVideo(
  photos: string[],
  name: string,
  theme: StoryTheme,
  opts: { perPhoto?: number; crossfade?: number; musicUrl?: string; onProgress?: (p: number) => void; gender?: Gender } = {}
): Promise<VideoResult> {
  const per = opts.perPhoto ?? 2.8;
  const xf = opts.crossfade ?? 0.7;
  await ensureFonts();
  const titles = titlesFor(opts.gender);
  const list = photos.slice(0, 10);
  const canvas = document.createElement('canvas');
  canvas.width = STORY_W;
  canvas.height = STORY_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unsupported');

  const stream = canvas.captureStream(30);
  let audio: HTMLAudioElement | null = null;
  if (opts.musicUrl) {
    try {
      audio = new Audio(opts.musicUrl);
      audio.loop = true;
      audio.volume = 0.65;
      await audio.play().catch(() => {});
      const audioWithCapture = audio as HTMLAudioElement & { captureStream?: () => MediaStream };
      if (audioWithCapture.captureStream) {
        const aStream = audioWithCapture.captureStream();
        aStream.getAudioTracks().forEach((tr: MediaStreamTrack) => stream.addTrack(tr));
      }
    } catch {
      audio = null;
    }
  }

  const mime = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise<Blob>((res) => { rec.onstop = () => res(new Blob(chunks, { type: mime })); });
  rec.start(250);

  const imgs = await Promise.all(list.map((s) => loadImage(s).catch(() => null)));
  const total = list.length * per + 0.6;

  await new Promise<void>((resolve) => {
    const t0 = performance.now();
    const tick = () => {
      const tt = (performance.now() - t0) / 1000;
      drawBackground(ctx, theme);
      const pos = Math.min(tt, total);
      const idx = Math.min(list.length - 1, Math.floor(pos / per));
      const local = pos - idx * per;

      // crossfade: previous card fades out while current fades in
      let nextIdx: number | null = null;
      let nextAlpha = 0;
      if (local > per - xf) {
        drawPhotoCard(ctx, imgs[idx], theme, 1);
        if (idx + 1 < list.length) {
          nextIdx = idx + 1;
          nextAlpha = (local - (per - xf)) / xf;
        }
        drawPhotoCard(ctx, nextIdx !== null ? imgs[nextIdx] : null, theme, nextAlpha);
      } else {
        drawPhotoCard(ctx, imgs[idx], theme, 1);
      }

      drawTitle(ctx, theme, idx === 0 ? `Happy Birthday, ${name}! 🎂` : `${titles[idx % titles.length]} • ${name}`);
      confettiBurst(ctx, theme, idx === 0 ? 1 : 0.35);
      if (opts.onProgress) opts.onProgress(Math.min(1, pos / total));
      if (pos >= total) {
        requestAnimationFrame(() => {
          ctx.clearRect(0, 0, STORY_W, STORY_H);
          drawBackground(ctx, theme);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = theme.text;
          ctx.font = `700 ${Math.round(STORY_W * 0.055)}px "Playpen Sans Deva", "Pacifico", cursive`;
          ctx.fillText(`Made with 💕 for ${name}`, STORY_W / 2, STORY_H / 2);
          requestAnimationFrame(() => {
            rec.stop();
            if (audio) audio.pause();
            resolve();
          });
        });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const blob = await done;
  return { blob, mimeType: mime };
}