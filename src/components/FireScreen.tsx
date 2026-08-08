'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Confetti from './Confetti';

export default function FireScreen({ onNext }: { onNext: () => void }) {
  const [lit, setLit] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full max-w-3xl min-h-screen flex flex-col items-center justify-center px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: '#a96f74', textShadow: '0 2px 10px rgba(255, 255, 255, 0.6)', fontFamily: 'Georgia, serif' }}>
            Ready to Light It Up? 🎇
          </h2>
          <p className="mt-3 text-base md:text-lg font-medium" style={{ color: '#b5898e' }}>
            Hit the fire button to celebrate before your letter
          </p>
        </motion.div>

        <motion.button
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.8 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setLit(true)}
          aria-label="Light the fireworks"
          style={{
            width: '150px',
            height: '150px',
            marginTop: '56px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '64px',
            lineHeight: 1,
            background: 'radial-gradient(circle at 35% 30%, #ffb86b 0%, #ff7a45 45%, #d63031 100%)',
            boxShadow: '0 10px 30px rgba(214, 48, 49, 0.45), inset 0 4px 10px rgba(255, 255, 255, 0.5), 0 0 0 6px rgba(255, 122, 69, 0.2), 0 0 40px rgba(255, 122, 69, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🔥
        </motion.button>
        <p className="mt-4 text-sm font-medium" style={{ color: '#c08a8f' }}>Press the fire button</p>

        {lit && (
          <>
            <Confetti count={140} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8"
            >
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-medium tracking-wide"
                style={{ color: '#fff', background: 'linear-gradient(to bottom, #d68b91 0%, #b96b71 100%)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0px 6px 0px #915056, 0px 12px 20px rgba(168, 94, 100, 0.4)', transition: 'all 0.15s ease-in-out', cursor: 'pointer' }}
              >
                Next Scene →
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
