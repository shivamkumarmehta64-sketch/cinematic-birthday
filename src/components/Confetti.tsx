'use client';

import React, { useMemo } from 'react';

const COLORS = ['#ff537b', '#ffb3c6', '#d8acff', '#ffd3a7', '#c9b7e8', '#ff8fab', '#54a0ff'];

export default function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 37 + 7) % 100}%`,
        w: 6 + ((i * 3) % 8),
        h: (6 + ((i * 3) % 8)) * (i % 3 === 0 ? 0.5 : 1),
        color: COLORS[i % COLORS.length],
        radius: i % 2 === 0 ? '50%' : '2px',
        duration: 2.5 + ((i * 7) % 4),
        delay: (i * 13) % 60 / 10,
        opacity: 0.5 + ((i * 11) % 50) / 100,
      })),
    [count]
  );

  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: p.radius,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}
