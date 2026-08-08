'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CinematicExperience from '../../components/CinematicExperience';
import { unpack, DEFAULT_DATA } from '../../lib/birthday';

function ExperienceInner() {
  const params = useSearchParams();
  const d = params.get('d');
  const data = d ? unpack(d) : DEFAULT_DATA;
  return <CinematicExperience data={data} />;
}

export default function ExperiencePage() {
  return (
    <Suspense fallback={<div className="experience-loading">💐 loading your surprise…</div>}>
      <ExperienceInner />
    </Suspense>
  );
}