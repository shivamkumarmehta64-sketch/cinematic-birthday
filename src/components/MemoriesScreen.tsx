'use client';

import React, { useState, useMemo, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type PhotoCard = { id: string; imageUrl: string; alt: string; title: string };

const PHI = (1 + Math.sqrt(5)) / 2;

function CardSprite({ card, position, onSelect }: { card: PhotoCard; position: [number, number, number]; onSelect: (c: PhotoCard) => void }) {
  const mesh = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const [mx, my] = position;
  const ry = Math.atan2(position[0], position[2]);
  const rx = Math.atan2(position[1], Math.sqrt(position[0] * position[0] + position[2] * position[2]));

  // billboard toward camera
  const camera = useThree((s) => s.camera);
  useFrame(() => {
    if (mesh.current) mesh.current.lookAt(camera.position);
  });

  return (
    <group ref={mesh} position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(card); }} onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}>
        <boxGeometry args={[4.5, 5.4, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Html position={[0, 0, 0]} transform distanceFactor={10} zIndexRange={[10, 0]} style={{ transition: 'all 0.3s ease', transform: hover ? 'scale(1.15)' : 'scale(1)' }}>
        <div className="w-36 h-44 rounded-lg overflow-hidden shadow-2xl bg-[#1F2121] p-2 select-none" style={{ boxShadow: hover ? '0 25px 50px rgba(49,184,198,0.5), 0 0 30px rgba(49,184,198,0.3)' : '0 15px 30px rgba(0,0,0,0.6)', border: hover ? '2px solid rgba(49,184,198,0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
          <img src={card.imageUrl} alt={card.alt} className="w-full h-36 object-cover rounded-md" loading="lazy" draggable={false} />
          <div className="mt-1 text-center">
            <p className="text-white text-xs font-medium truncate">{card.title}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(
    Array.from({ length: 1800 }, () => {
      const r = 8 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ];
    })
  ).current;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions.flat()), 3));
    return g;
  }, [positions]);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0004;
      ref.current.rotation.x += 0.0001;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.25} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Spirals() {
  return (
    <>
      {[2, 12, 16, 20].map((r) => (
        <mesh key={r} position={[0, 0, 0]}>
          <sphereGeometry args={[r, 32, 32]} />
          <meshStandardMaterial color={r === 2 ? '#1a1a2e' : '#31b8c6'} transparent opacity={r === 2 ? 0.15 : 0.05} wireframe />
        </mesh>
      ))}
    </>
  );
}

export default function MemoriesScreen({ photos, name }: { photos: string[]; name: string }) {
  const [selected, setSelected] = useState<PhotoCard | null>(null);
  const CARD_TITLES = ['Sweetheart', 'Baddie', 'Angel', 'Dreamgirl', 'Icon', 'Stunner', 'Babe', 'Darling', 'Sunshine', 'Queen', 'Heartbreaker', 'Forever', 'Cutie'];
  const cards: PhotoCard[] = photos.map((imageUrl, i) => ({
    id: `${i}`,
    imageUrl,
    alt: `${name} memory ${i + 1}`,
    title: CARD_TITLES[i % CARD_TITLES.length],
  }));
  const n = cards.length;
  const positions = useMemo(() => {
    return photos.map((_, i) => {
      const t = (i - 0.5) / n;
      const r = 8 + (i % 3) * 4;
      const a = 2 * Math.PI * i / PHI;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = i * 0.5;
      return [x, y, z] as [number, number, number];
    });
  }, [photos]);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: 'default' }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Spirals />
          <Stars />
          {cards.map((card, i) => (
            <CardSprite key={card.id} card={card} position={positions[i]} onSelect={setSelected} />
          ))}
          <OrbitControls enablePan enableZoom={false} enableRotate minDistance={5} maxDistance={40} rotateSpeed={0.5} zoomSpeed={1.2} panSpeed={0.8} target={[0, 0, 0]} />
        </Suspense>
      </Canvas>

      {/* selected card modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="relative max-w-md w-full mx-4">
            <button onClick={() => setSelected(null)} className="absolute -top-12 right-0 text-white hover:text-pink-300 text-3xl" aria-label="close">×</button>
            <div className="bg-[#1F2121] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img src={selected.imageUrl} alt={selected.alt} className="w-full h-80 object-cover" />
              <div className="p-4 text-center">
                <p className="text-white text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{selected.title}</p>
                <p className="text-white/40 text-sm mt-1">A little memory, just for you 💕</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}