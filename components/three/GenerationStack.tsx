'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Enso,
  Leader,
  Tag,
} from './treeKit';
import { samuraiAccent, samuraiPalette } from './samuraiTheme';
import {
  SceneBoundary,
  useCoarsePointer,
  useDarkMode,
  useInView,
  usePrefersReducedMotion,
} from './sceneShell';

export interface GenerationItem {
  id: string;
  label: string;
}

export interface GenerationStackProps {
  items: GenerationItem[];
  active: number | null;
  onActive: (index: number | null) => void;
  kicker: string;
  hint: string;
  ariaLabel: string;
  idleTitle: string;
  idleMeta: string;
  idleDesc: string;
  currentLabel: string;
  rollbackLabel: string;
  note: string;
  docsHref: string;
  docsLabel: string;
}

type Vec3 = [number, number, number];

interface RingSlot {
  radius: number;
  tube: number;
  y: number;
  tag: Vec3;
  anchor: Vec3;
  accent: string;
}

function ringLayout(count: number, dark: boolean): RingSlot[] {
  const inner = 0.55;
  const outer = 2.0;
  const leftCount = Math.floor(count / 2);
  return Array.from({ length: count }, (_, index) => {
    const t = count <= 1 ? 0 : index / (count - 1);
    const radius = THREE.MathUtils.lerp(inner, outer, t);
    const tube = THREE.MathUtils.lerp(0.021, 0.011, t);
    const y = index * 0.045;
    const accent = samuraiAccent(index, dark);
    const left = index < leftCount;
    const side = left ? -1 : 1;
    const row = left ? index : index - leftCount;
    const tagY = left ? 0.72 - row * 0.5 : 0.56 - row * 0.46;
    const tag: Vec3 = [side * 2.32, tagY, 1.08];
    const anchorAngle = left ? 2.5 : 0.4;
    const anchor: Vec3 = [
      Math.cos(anchorAngle) * radius,
      y + 0.02,
      Math.sin(anchorAngle) * radius,
    ];
    return { radius, tube, y, tag, anchor, accent };
  });
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const scale = aspect < 1.05 ? 1.35 : aspect < 1.4 ? 1.12 : 1;
    camera.position.set(4.6 * scale, 4.0 * scale, 7.2 * scale);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function RollbackCord({
  curve,
  color,
  dark,
  reduced,
}: {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  dark: boolean;
  reduced: boolean;
}) {
  const palette = samuraiPalette(dark);
  const bead = useRef<THREE.Mesh>(null);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!bead.current) return;
    const t = reduced ? 0.55 : (performance.now() / 3000) % 1;
    curve.getPoint(t, point);
    bead.current.position.copy(point);
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.011, 6, false]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.75} />
      </mesh>
      <mesh
        position={[curve.v2.x, curve.v2.y, curve.v2.z]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.045, 0.014, 8, 32]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.75} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color={palette.brass}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function Ring({
  slot,
  index,
  current,
  active,
  dark,
  reduced,
  onOver,
  onOut,
  onSelect,
}: {
  slot: RingSlot;
  index: number;
  current: boolean;
  active: boolean;
  dark: boolean;
  reduced: boolean;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
}) {
  const palette = samuraiPalette(dark);
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = active ? 1.018 : 1;
    if (reduced) {
      group.current.scale.setScalar(target);
    } else {
      group.current.scale.setScalar(
        THREE.MathUtils.damp(
          group.current.scale.x,
          target,
          8,
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

  const joints = useMemo(() => {
    if (index === 0) return [];
    return [index * 1.7, index * 1.7 + 2.2].map((angle) => ({
      angle,
      position: [
        Math.cos(angle) * slot.radius,
        0.012,
        Math.sin(angle) * slot.radius,
      ] as Vec3,
    }));
  }, [index, slot.radius]);

  return (
    <group ref={group} position={[0, slot.y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[slot.radius, slot.tube, 8, 160]} />
        <meshPhysicalMaterial
          color={active ? slot.accent : palette.ring}
          metalness={0.3}
          roughness={0.32}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
          emissive={active ? slot.accent : palette.ring}
          emissiveIntensity={active ? 0.25 : 0.06}
        />
      </mesh>

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <torusGeometry args={[slot.radius, 0.09, 6, 128]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {joints.map((joint) => (
        <mesh key={joint.angle} position={joint.position}>
          <sphereGeometry args={[slot.tube * 1.9, 12, 12]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.88}
            roughness={0.3}
          />
        </mesh>
      ))}

      {current ? (
        <mesh
          position={[
            Math.cos(-0.9) * slot.radius,
            0.035,
            Math.sin(-0.9) * slot.radius,
          ]}
        >
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color={palette.shu}
            metalness={0.15}
            roughness={0.55}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function RingsScene({
  items,
  active,
  onActive,
  reduced,
  dark,
  coarse,
}: {
  items: GenerationItem[];
  active: number | null;
  onActive: (index: number | null) => void;
  reduced: boolean;
  dark: boolean;
  coarse: boolean;
}) {
  const palette = samuraiPalette(dark);
  const compact = useThree((state) => state.size.width < 640);
  const layout = useMemo(() => ringLayout(items.length, dark), [dark, items.length]);
  const current = items.length - 1;

  const cord = useMemo(() => {
    const startRing = layout[current];
    const targetIndex = active !== null && active !== current ? active : 0;
    const targetRing = layout[targetIndex];
    const start = new THREE.Vector3(
      Math.cos(-0.9) * startRing.radius,
      startRing.y + 0.36,
      Math.sin(-0.9) * startRing.radius
    );
    const end = new THREE.Vector3(
      Math.cos(2.4) * targetRing.radius,
      targetRing.y + 0.3,
      Math.sin(2.4) * targetRing.radius
    );
    const mid = new THREE.Vector3(1.15, 1.15, -0.35);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [active, current, layout]);

  const cordColor =
    active !== null && active !== current
      ? layout[active].accent
      : palette.shu;

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

      <group>
        <Enso dark={dark} radius={2.35} z={-1.15} />

        {layout.map((slot, index) => (
          <Ring
            key={items[index].id}
            slot={slot}
            index={index}
            current={index === current}
            active={active === index}
            dark={dark}
            reduced={reduced}
            onOver={() => onActive(index)}
            onOut={() => onActive(null)}
            onSelect={() => onActive(index)}
          />
        ))}

        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.07, 48]} />
          <meshPhysicalMaterial
            color={palette.inkDeep}
            metalness={0.2}
            roughness={0.4}
            clearcoat={0.4}
          />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.012, 8, 64]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.9}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0.078, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.014, 32]} />
          <meshStandardMaterial color={palette.shu} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.03, 0.016, 0.32]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.9}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.03, 0.016, 0.32]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.9}
            roughness={0.28}
          />
        </mesh>

        <RollbackCord
          curve={cord}
          color={cordColor}
          dark={dark}
          reduced={reduced}
        />

        {!compact
          ? layout.map((slot, index) => (
              <Tag
                key={`tag-${items[index].id}`}
                text={`${items[index].id} · ${items[index].label}`}
                position={slot.tag}
                accent={slot.accent}
                dark={dark}
                active={active === index}
                scale={0.19}
              />
            ))
          : null}

        {!compact
          ? layout.map((slot, index) => (
              <Leader
                key={`leader-${items[index].id}`}
                from={slot.anchor}
                to={slot.tag}
                color={slot.accent}
                active={active === index}
              />
            ))
          : null}
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          autoRotate={!reduced && active === null}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.1}
        />
      ) : null}
    </>
  );
}

function StaticRings({ count }: { count: number }) {
  return (
    <div className="x-rings-static" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="x-rings-static-ring"
          style={{ '--i': index } as CSSProperties}
        />
      ))}
      <span className="x-rings-static-core" />
    </div>
  );
}

export default function GenerationStack({
  items,
  active,
  onActive,
  kicker,
  hint,
  ariaLabel,
  idleTitle,
  idleMeta,
  idleDesc,
  currentLabel,
  rollbackLabel,
  note,
  docsHref,
  docsLabel,
}: GenerationStackProps) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const dark = useDarkMode();
  const coarse = useCoarsePointer();
  const inView = useInView(containerRef);
  const currentIndex = items.length - 1;
  const current = active === null ? null : items[active];
  const isCurrent = active === currentIndex;
  const staticRings = <StaticRings count={items.length} />;

  const meta =
    current === null ? idleMeta : isCurrent ? currentLabel : rollbackLabel;
  const title = current === null ? idleTitle : `${current.id} · ${current.label}`;
  const description = current === null ? idleDesc : isCurrent ? idleDesc : note;

  return (
    <div
      ref={containerRef}
      className="x-orbit"
      data-variant="generations"
      data-ready={ready}
      role="group"
      aria-label={ariaLabel}
    >
      {!ready ? staticRings : null}

      <div className="x-orbit-canvas">
        <SceneBoundary fallback={staticRings}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [4.6, 4.0, 7.2], fov: 32 }}
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
            <RingsScene
              items={items}
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
        {String(active === null ? items.length : active + 1).padStart(2, '0')} /{' '}
        {String(items.length).padStart(2, '0')}
      </p>

      <div className="x-orbit-info" aria-live="polite">
        <p className="x-orbit-info-meta">{meta}</p>
        <p className="x-orbit-info-title">{title}</p>
        <p className="x-orbit-info-desc">{description}</p>
        <Link href={docsHref} className="x-orbit-link">
          {docsLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <p className="x-orbit-hint">{hint}</p>
    </div>
  );
}
