'use client';

import dynamic from 'next/dynamic';
import type { LayerStackProps } from './LayerStack';

const LayerStack = dynamic(() => import('./LayerStack'), {
  ssr: false,
  loading: () => (
    <div className="x-orbit" data-variant="layers" data-ready="false" aria-hidden="true">
      <div className="x-orbit-static">
        <span className="x-orbit-static-ring" />
        <span className="x-orbit-static-ring x-orbit-static-ring-inner" />
      </div>
    </div>
  ),
});

export default function LayerStackStage(props: LayerStackProps) {
  return <LayerStack {...props} />;
}
