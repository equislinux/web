'use client';

import dynamic from 'next/dynamic';
import type { GenerationStackProps } from './GenerationStack';

const GenerationStack = dynamic(() => import('./GenerationStack'), {
  ssr: false,
  loading: () => (
    <div
      className="x-orbit"
      data-variant="generations"
      data-ready="false"
      aria-hidden="true"
    >
      <div className="x-orbit-static">
        <span className="x-orbit-static-ring" />
        <span className="x-orbit-static-ring x-orbit-static-ring-inner" />
      </div>
    </div>
  ),
});

export default function GenerationStackStage(props: GenerationStackProps) {
  return <GenerationStack {...props} />;
}
