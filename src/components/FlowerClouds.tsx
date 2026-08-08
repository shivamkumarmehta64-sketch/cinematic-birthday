'use client';

import React, { useMemo } from 'react';

const PETAL_COLORS = ['#ffb3c6', '#ffd3e0', '#f8bbd0', '#e8c0ce', '#ffc1d4', '#ffd6e7', '#f0a8c0'];

export default function FlowerClouds() {
  const petals = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        size: 10 + ((i * 7) % 14),
        duration: 11 + ((i * 5) % 12),
        delay: -((i * 3.1) % 20),
        drift: `${-60 + ((i * 13) % 120)}px`,
        spin: `${300 + ((i * 47) % 480)}deg`,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    []
  );

  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        top: `${6 + i * 13}%`,
        width: 130 + ((i * 61) % 130),
        height: 40 + ((i * 23) % 34),
        duration: 45 + i * 14,
        delay: -((i * 9) % 50),
        opacity: 0.55 + ((i * 11) % 30) / 100,
      })),
    []
  );

  return (
    <>
      <div className="cloud-layer" aria-hidden="true">
        {clouds.map((c, i) => (
          <div
            key={`c${i}`}
            className="cloud"
            style={{
              top: c.top,
              width: c.width,
              height: c.height,
              opacity: c.opacity,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="petal-layer" aria-hidden="true">
        {petals.map((p, i) => (
          <span
            key={`p${i}`}
            className="petal"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size * 1.15,
                background: p.color,
                borderRadius: '70% 30% 65% 35% / 60% 45% 55% 40%',
                boxShadow: '0 2px 6px rgba(214, 91, 139, 0.18)',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                '--drift': p.drift,
                '--spin': p.spin,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
