'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';

const SRC = Array.from({ length: 10 }, (_, i) => `/flowers/flower${i + 1}.png`);
const TWO_PI = 2 * Math.PI;

type Dims = { w: number; h: number };
type Cell = {
  key: string;
  x: number;
  y: number;
  size: number;
  spin: number;
  spinDelay: number;
  side: number;
  src: string;
  r: number;
  theta: number;
  startR: number;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
};

export default function Cover({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const [dims, setDims] = useState<Dims | null>(null);
  const [stage, setStage] = useState('idle');
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const coveredRef = useRef(false);
  const onCoveredRef = useRef(onCovered);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onCoveredRef.current = onCovered;
    onDoneRef.current = onDone;
  }, [onCovered, onDone]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const cells = useMemo<Cell[]>(() => {
    if (!dims) return [];
    const { w, h } = dims;
    const n = Math.max(84, Math.min(w, h) / 7);
    const cols = Math.ceil(w / n) + 2;
    const rows = Math.ceil(h / n) + 2;
    const offX = (w - (cols - 1) * n) / 2;
    const offY = (h - (rows - 1) * n) / 2;
    const ox = w / 2;
    const oy = h / 2;
    const u = Math.hypot(w, h) / 2 + 2 * n;
    const raw: Array<{ x: number; y: number; size: number; spin: number; spinDelay: number; side: number; src: string }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wob = ((31 * r + 17 * c) % 7) - 3;
        const x = offX + c * n + (r % 2 ? n / 2 : 0) + wob;
        const y = offY + r * n + wob;
        raw.push({
          x,
          y,
          size: 1.9 * n,
          spin: 12 + ((5 * r + 3 * c) % 9),
          spinDelay: -((7 * r + 11 * c) % 9),
          src: SRC[(r * cols + c) % SRC.length],
          side: x < ox ? -1 : 1,
        });
      }
    }
    const arr = raw.map((cell) => {
      const rx = cell.x - ox;
      const ry = cell.y - oy;
      const r = Math.hypot(rx, ry);
      let theta = Math.atan2(ry, rx);
      if (theta < 0) theta += TWO_PI;
      return { cell, r, theta };
    });
    arr.sort((a, b) => (b.r / n) * TWO_PI + b.theta - ((a.r / n) * TWO_PI + a.theta));
    const total = arr.length;
    return arr.map(({ cell, r, theta }, i) => {
      const startR = 1.3 * u + 0.15 * r;
      const a = theta + 2.6;
      return {
        ...cell,
        key: `${Math.round(cell.x)}-${Math.round(cell.y)}-${i}`,
        r,
        theta,
        startR,
        dx: ox + Math.cos(a) * startR - cell.x,
        dy: oy + Math.sin(a) * startR - cell.y,
        delay: (i / Math.max(1, total - 1)) * 2000,
        duration: 2500,
      };
    });
  }, [dims]);

  useEffect(() => {
    if (!cells.length) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setStage('in')));
    const t1 = setTimeout(() => {
      if (!coveredRef.current) {
        coveredRef.current = true;
        onCoveredRef.current();
      }
    }, 4500);
    const t2 = setTimeout(() => setStage('split'), 6500);
    const t3 = setTimeout(() => onDoneRef.current(), 18500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [cells]);

  useEffect(() => {
    if (stage !== 'in' || !dims) return;
    const ox = dims.w / 2;
    const oy = dims.h / 2;
    const t0 = performance.now();
    let raf: number;
    const loop = (now: number) => {
      const t = now - t0;
      for (let i = 0; i < cells.length; i++) {
        const el = slots.current[i];
        if (!el) continue;
        const c = cells[i];
        const o = Math.max(0, Math.min(1, (t - c.delay) / c.duration));
        const l = 0.5 - Math.cos(Math.PI * o) / 2;
        const r = c.startR + (c.r - c.startR) * l;
        const h = c.theta + 2.6 * (1 - l);
        const xx = ox + Math.cos(h) * r - c.x;
        const yy = oy + Math.sin(h) * r - c.y;
        const f = 0.7 + 0.3 * l;
        el.style.transform = `translate3d(${xx}px, ${yy}px, 0) scale(${f})`;
      }
      if (t < 6500) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stage, cells, dims]);

  if (!cells.length) return null;

  return (
    <div className="flower-stage" aria-hidden="true">
      {cells.map((c, i) => {
        const extra = stage === 'split' ? (c.side < 0 ? 'split-left' : 'split-right') : '';
        return (
          <div
            key={c.key}
            ref={(el) => {
              slots.current[i] = el;
            }}
            className={`flower-slot ${extra}`}
            style={{ left: c.x - c.size / 2, top: c.y - c.size / 2, width: c.size, height: c.size }}
          >
            <img
              src={c.src}
              alt=""
              className="flower-img"
              style={{ animationDuration: `${c.spin}s`, animationDelay: `${c.spinDelay}s` }}
            />
          </div>
        );
      })}
    </div>
  );
}