'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Billboard, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  BranchTube,
  Crown,
  Enso,
  LamellarPlate,
  Leader,
  Plinth,
  StaticTree,
  Tag,
  Trunk,
} from './treeKit';
import { samuraiAccent, samuraiPalette } from './samuraiTheme';
import {
  SceneBoundary,
  useCoarsePointer,
  useDarkMode,
  useInView,
  usePrefersReducedMotion,
} from './sceneShell';

export interface LayerData {
  name: string;
  desc: string;
  accent: string;
}

export interface LayerStackProps {
  layers: LayerData[];
  active: number | null;
  onActive: (index: number | null) => void;
  kicker: string;
  hint: string;
  ariaLabel: string;
  idleTitle: string;
  idleMeta: string;
  idleDesc: string;
}

type Vec3 = [number, number, number];

interface LayerSlot {
  position: Vec3;
  branchStart: Vec3;
  branchEnd: Vec3;
  tag: Vec3;
  accent: string;
  width: number;
}

function layerLayout(count: number, dark: boolean): LayerSlot[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count <= 1 ? 0.5 : index / (count - 1);
    const y = -0.75 + t * 1.8;
    const side = index % 2 === 0 ? 1 : -1;
    const x = side * (1.02 + 0.08 * Math.sin(index * 1.7));
    const z = 0.34;
    const width = index === 1 || index === 2 ? 1.28 : 1.12;
    const accent = samuraiAccent(index, dark);

    let tag: Vec3;
    if (side < 0 && y < 0.2) {
      tag = [x - 0.05, y + 0.48, z + 0.12];
    } else {
      tag = [x + side * 1.16, y + 0.06, z + 0.12];
    }

    return {
      position: [x, y, z],
      branchStart: [0, y + 0.08, 0],
      branchEnd: [x * 0.86, y, z * 0.95],
      tag,
      accent,
      width,
    };
  });
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const scale = aspect < 1.05 ? 1.35 : aspect < 1.4 ? 1.12 : 1;
    camera.position.set(5.0 * scale, 2.9 * scale, 7.6 * scale);
    camera.lookAt(0, -0.02, 0.05);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function LayerPlate({
  layer,
  slot,
  index,
  active,
  dark,
  reduced,
  compact,
  onOver,
  onOut,
  onSelect,
}: {
  layer: LayerData;
  slot: LayerSlot;
  index: number;
  active: boolean;
  dark: boolean;
  reduced: boolean;
  compact: boolean;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = active ? 1.03 : 1;
    const targetY = slot.position[1] + (active ? 0.03 : 0);
    if (reduced) {
      group.current.scale.setScalar(targetScale);
      group.current.position.y = targetY;
    } else {
      const dt = Math.min(delta, 0.05);
      group.current.scale.setScalar(
        THREE.MathUtils.damp(group.current.scale.x, targetScale, 9, dt)
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        targetY,
        9,
        dt
      );
    }
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onOver();
  };
  const handleOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onOut();
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <>
      <group ref={group} position={slot.position}>
        <Billboard>
          <LamellarPlate
            width={slot.width}
            height={0.15}
            depth={0.72}
            accent={slot.accent}
            dark={dark}
            variant={index % 2 === 0 ? 'a' : 'b'}
            lacingRows={2}
            lacingCols={6}
            seed={index}
            active={active}
            onPointerOver={handleOver}
            onPointerOut={handleOut}
            onClick={handleClick}
          />
        </Billboard>
      </group>
      {!compact ? (
        <>
          <Tag
            text={`${String(index + 1).padStart(2, '0')} · ${layer.name}`}
            position={slot.tag}
            accent={slot.accent}
            dark={dark}
            active={active}
            scale={0.18}
          />
          <Leader
            from={slot.branchEnd}
            to={slot.tag}
            color={slot.accent}
            active={active}
          />
        </>
      ) : null}
    </>
  );
}

function CanopyScene({
  layers,
  active,
  onActive,
  reduced,
  dark,
  coarse,
}: {
  layers: LayerData[];
  active: number | null;
  onActive: (index: number | null) => void;
  reduced: boolean;
  dark: boolean;
  coarse: boolean;
}) {
  const palette = samuraiPalette(dark);
  const compact = useThree((state) => state.size.width < 640);
  const layout = useMemo(
    () => layerLayout(layers.length, dark),
    [dark, layers.length]
  );

  return (
    <>
      <hemisphereLight
        args={[palette.bone, palette.inkDeep, dark ? 0.55 : 0.85]}
      />
      <directionalLight
        position={[5, 7, 6]}
        intensity={dark ? 2.4 : 2.7}
        color={dark ? '#ffe8c8' : '#fff2dd'}
      />
      <directionalLight
        position={[-6, 2, -4]}
        intensity={dark ? 1.0 : 0.8}
        color={palette.ai}
      />
      <pointLight
        position={[0, 0.4, 4]}
        intensity={dark ? 14 : 7}
        distance={12}
        decay={2}
        color={palette.shu}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={dark ? 1.2 : 0.6}
        color={palette.brass}
      />

      <group>
        <Trunk dark={dark} />
        <Crown dark={dark} y={1.36} />
        <Plinth dark={dark} />
        <Enso dark={dark} />

        {layout.map((slot, index) => (
          <BranchTube
            key={`branch-${layers[index].name}`}
            from={slot.branchStart}
            to={slot.branchEnd}
            color={palette.brass}
            lift={0.06}
          />
        ))}

        {layers.map((layer, index) => (
          <LayerPlate
            key={layer.name}
            layer={layer}
            slot={layout[index]}
            index={index}
            active={active === index}
            dark={dark}
            reduced={reduced}
            compact={compact}
            onOver={() => onActive(index)}
            onOut={() => onActive(null)}
            onSelect={() => onActive(index)}
          />
        ))}
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          target={[0, -0.02, 0.05]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          autoRotate={!reduced && active === null}
          autoRotateSpeed={0.28}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.1}
        />
      ) : null}
    </>
  );
}

export default function LayerStack({
  layers,
  active,
  onActive,
  kicker,
  hint,
  ariaLabel,
  idleTitle,
  idleMeta,
  idleDesc,
}: LayerStackProps) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const dark = useDarkMode();
  const coarse = useCoarsePointer();
  const inView = useInView(containerRef);
  const current = active === null ? null : layers[active];
  const staticTree = <StaticTree count={layers.length} />;

  return (
    <div
      ref={containerRef}
      className="x-orbit"
      data-variant="layers"
      data-ready={ready}
      role="group"
      aria-label={ariaLabel}
    >
      {!ready ? staticTree : null}

      <div className="x-orbit-canvas">
        <SceneBoundary fallback={staticTree}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [5.0, 2.9, 7.6], fov: 31 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            frameloop={inView ? 'always' : 'demand'}
            style={{ touchAction: 'pan-y' }}
            onPointerMissed={() => onActive(null)}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              setReady(true);
            }}
          >
            <ResponsiveCamera />
            <CanopyScene
              layers={layers}
              active={active}
              onActive={onActive}
              reduced={reduced}
              dark={dark}
              coarse={coarse}
            />
          </Canvas>
        </SceneBoundary>
      </div>

      <p className="x-orbit-meta x-orbit-meta-left">{kicker}</p>
      <p className="x-orbit-meta x-orbit-meta-right">
        {String(active === null ? layers.length : active + 1).padStart(2, '0')} /{' '}
        {String(layers.length).padStart(2, '0')}
      </p>

      <div className="x-orbit-info" aria-live="polite">
        <p className="x-orbit-info-meta">
          {current === null ? idleMeta : current.name}
        </p>
        <p className="x-orbit-info-title">
          {current === null ? idleTitle : current.name}
        </p>
        <p className="x-orbit-info-desc">
          {current === null ? idleDesc : current.desc}
        </p>
      </div>

      <p className="x-orbit-hint">{hint}</p>
    </div>
  );
}
