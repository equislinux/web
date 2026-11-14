'use client';

import dynamic from 'next/dynamic';
import type { SystemOrbitProps } from './SystemOrbit';

const SystemOrbit = dynamic(() => import('./SystemOrbit'), {
  ssr: false,
  loading: () => (
    <div className="x-orbit-wrap" aria-hidden="true">
      <div className="x-orbit x-orbit-loading" data-ready="false">
        <div className="x-orbit-static">
          <span className="x-orbit-static-ring" />
          <span className="x-orbit-static-ring x-orbit-static-ring-inner" />
        </div>
      </div>
    </div>
  ),
});

export default function SystemOrbitStage(props: SystemOrbitProps) {
  return <SystemOrbit {...props} />;
}
