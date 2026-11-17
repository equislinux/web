'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Billboard, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import type { Lang, SceneNode } from '@/lib/i18n';
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

export interface SystemOrbitProps {
  variant: 'hero' | 'pipeline';
  kicker: string;
  center: SceneNode;
  nodes: SceneNode[];
  hint: string;
  controlsLabel: string;
  ariaLabel: string;
  lang: Lang;
  readMore: string;
}

const NODE_DOCS: Record<string, string> = {
  x: 'x',
  packages: 'x',
  xpkg: 'xpkg/01-overview-and-status',
  xpm: 'xpm/overview-and-status',
  'xpm-aur': 'xpm-aur/overview',
  repo: 'x-repo/overview',
  pacman: 'x-repo/overview',
  iso: 'x/installer',
};

type Vec3 = [number, number, number];

interface BranchSlot {
  start: Vec3;
  end: Vec3;
  tag: Vec3;
  accent: string;
}

function branchLayout(count: number, dark: boolean): BranchSlot[] {
  const span = count <= 1 ? 0 : Math.min(2.5, 1.2 + count * 0.22);
  return Array.from({ length: count }, (_, index) => {
    const t = count <= 1 ? 0.5 : index / (count - 1);
    const angle = -span / 2 + t * span;
    const y = 0.95 - t * 1.7;
    const radius = 1.38 + 0.14 * Math.sin(index * 1.9);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const accent = samuraiAccent(index, dark);

    let tag: Vec3;
    if (x < 0 && y < 0.15) {
      tag = [x - 0.05, y + 0.5, z + 0.15];
    } else {
      const side = x >= 0 ? 1 : -1;
      tag = [x + side * 0.82, y + 0.26, z + 0.12];
    }

    return {
      start: [0, y - 0.12, 0],
      end: [x, y, z],
      tag,
      accent,
    };
  });
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const scale = aspect < 1.05 ? 1.4 : aspect < 1.4 ? 1.12 : 1;
    camera.position.set(5.0 * scale, 2.7 * scale, 7.6 * scale);
    camera.lookAt(0, 0, 0.1);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function NodePlate({
  node,
  slot,
  active,
  dark,
  reduced,
  compact,
  onOver,
  onOut,
  onSelect,
}: {
  node: SceneNode;
  slot: BranchSlot;
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
    const target = active ? 1.04 : 1;
    if (reduced) {
      group.current.scale.setScalar(target);
    } else {
      group.current.scale.setScalar(
        THREE.MathUtils.damp(
          group.current.scale.x,
          target,
          9,
          Math.min(delta, 0.05)
        )
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
      <group ref={group} position={slot.end}>
        <Billboard>
          <LamellarPlate
            width={0.58}
            height={0.32}
            depth={0.07}
            accent={slot.accent}
            dark={dark}
            lacingRows={2}
            lacingCols={3}
            seed={slot.end[1] > 0 ? 1 : 0}
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
            text={node.label}
            position={slot.tag}
            accent={slot.accent}
            dark={dark}
            active={active}
            scale={0.18}
          />
          <Leader
            from={slot.end}
            to={slot.tag}
            color={slot.accent}
            active={active}
          />
        </>
      ) : null}
    </>
  );
}

function BranchScene({
  nodes,
  variant,
  hovered,
  selected,
  setHovered,
  setSelected,
  reduced,
  dark,
  coarse,
}: {
  nodes: SceneNode[];
  variant: 'hero' | 'pipeline';
  hovered: number | null;
  selected: number | null;
  setHovered: (value: number | null | ((current: number | null) => number | null)) => void;
  setSelected: (value: number | null | ((current: number | null) => number | null)) => void;
  reduced: boolean;
  dark: boolean;
  coarse: boolean;
}) {
  const palette = samuraiPalette(dark);
  const activeIndex = hovered ?? selected;
  const compact = useThree((state) => state.size.width < 640);
  const layout = useMemo(
    () => branchLayout(nodes.length, dark),
    [nodes.length, dark]
  );

  return (
    <>
      <hemisphereLight
        args={[
          palette.bone,
          palette.inkDeep,
          dark ? 0.55 : 0.85,
        ]}
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
        position={[0, 0.5, 4]}
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

      <group position={[0, variant === 'hero' ? 0.4 : 0.05, 0]}>
        <Trunk dark={dark} />
        <Crown dark={dark} y={1.28} />
        <Plinth dark={dark} />
        <Enso dark={dark} />

        {layout.map((slot, index) => (
          <BranchTube
            key={`branch-${nodes[index].id}`}
            from={slot.start}
            to={slot.end}
            color={palette.brass}
          />
        ))}

        {nodes.map((node, index) => (
          <NodePlate
            key={node.id}
            node={node}
            slot={layout[index]}
            active={activeIndex === index}
            dark={dark}
            reduced={reduced}
            compact={compact}
            onOver={() => setHovered(index)}
            onOut={() =>
              setHovered((current) => (current === index ? null : current))
            }
            onSelect={() =>
              setSelected((current) => (current === index ? null : index))
            }
          />
        ))}
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          target={[0, variant === 'hero' ? 0.1 : 0.05, 0.1]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          autoRotate={!reduced && hovered === null && selected === null}
          autoRotateSpeed={0.28}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
        />
      ) : null}
    </>
  );
}

export default function SystemOrbit({
  variant,
  kicker,
  center,
  nodes,
  hint,
  controlsLabel,
  ariaLabel,
  lang,
  readMore,
}: SystemOrbitProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const dark = useDarkMode();
  const coarse = useCoarsePointer();
  const inView = useInView(containerRef);
  const activeIndex = hovered ?? selected;
  const active = activeIndex === null ? center : nodes[activeIndex];
  const staticTree = <StaticTree count={nodes.length} />;

  return (
    <figure className="x-orbit-wrap" ref={containerRef}>
      <div
        className="x-orbit"
        data-variant={variant}
        data-ready={ready}
        role="group"
        aria-label={ariaLabel}
      >
        {!ready ? staticTree : null}

        <div className="x-orbit-canvas">
          <SceneBoundary fallback={staticTree}>
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [5.0, 2.7, 7.6], fov: 31 }}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
              }}
              frameloop={inView ? 'always' : 'demand'}
              style={{ touchAction: 'pan-y' }}
              onPointerMissed={() => setSelected(null)}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                setReady(true);
              }}
            >
              <ResponsiveCamera />
              <BranchScene
                nodes={nodes}
                variant={variant}
                hovered={hovered}
                selected={selected}
                setHovered={setHovered}
                setSelected={setSelected}
                reduced={reduced}
                dark={dark}
                coarse={coarse}
              />
            </Canvas>
          </SceneBoundary>
        </div>

        <p className="x-orbit-meta x-orbit-meta-left">{kicker}</p>
        <p className="x-orbit-meta x-orbit-meta-right">
          {String(nodes.length).padStart(2, '0')} /{' '}
          {String(nodes.length).padStart(2, '0')}
        </p>

        <div className="x-orbit-info" aria-live="polite">
          <p className="x-orbit-info-meta">{active.meta}</p>
          <p className="x-orbit-info-title">{active.label}</p>
          <p className="x-orbit-info-desc">{active.desc}</p>
          <Link
            href={`/${lang}/docs/${NODE_DOCS[active.id] ?? 'x'}`}
            className="x-orbit-link"
          >
            {readMore} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="x-orbit-hint">{hint}</p>
      </div>

      <div className="x-orbit-controls" role="group" aria-label={controlsLabel}>
        {nodes.map((node, index) => (
          <button
            key={node.id}
            type="button"
            className="x-orbit-chip"
            data-active={activeIndex === index}
            aria-pressed={selected === index}
            style={{ '--accent': samuraiAccent(index, dark) } as CSSProperties}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() =>
              setHovered((current) => (current === index ? null : current))
            }
            onFocus={() => setHovered(index)}
            onBlur={() =>
              setHovered((current) => (current === index ? null : current))
            }
            onClick={() =>
              setSelected((current) => (current === index ? null : index))
            }
          >
            <span className="x-orbit-chip-dot" aria-hidden="true" />
            <span>{node.label}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}
