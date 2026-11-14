'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createLabelTexture } from './labelTexture';
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

const ACCENTS = ['#5ad4e6', '#7bd88f', '#fce566', '#fd9353', '#fc618d'];

function cardPosition(index: number, count: number): [number, number, number] {
  const center = (count - 1) / 2;
  return [
    (index - center) * 0.17 + Math.sin(index * 1.25) * 0.12,
    index * 0.36 - 0.88,
    Math.cos(index * 1.1) * 0.12,
  ];
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const scale = aspect < 1.05 ? 1.7 : aspect < 1.35 ? 1.28 : 1;
    camera.position.set(4.9 * scale, 4.2 * scale, 6.5 * scale);
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function Card({
  item,
  index,
  count,
  active,
  future,
  dark,
  reduced,
  onOver,
  onOut,
  onSelect,
}: {
  item: GenerationItem;
  index: number;
  count: number;
  active: boolean;
  future: boolean;
  dark: boolean;
  reduced: boolean;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const spriteMaterial = useRef<THREE.SpriteMaterial>(null);
  const accent = ACCENTS[index % ACCENTS.length];
  const base = cardPosition(index, count);
  const current = index === count - 1;
  const targetY = base[1] + (active ? 0.17 : 0);
  const targetScale = active ? 1.04 : future ? 0.97 : 1;
  const targetOpacity = future ? 0.3 : 1;
  const targetEmissive = active ? 0.78 : future ? 0.02 : 0.08;
  const targetLabelOpacity = future ? 0.38 : active ? 1 : 0.88;

  const labelTexture = useMemo(
    () =>
      createLabelTexture(`${item.id} · ${item.label}`, dark, accent),
    [dark, item.id, item.label, accent]
  );
  const labelSize = useMemo<[number, number, number]>(() => {
    const image = labelTexture?.image as HTMLCanvasElement | undefined;
    const ratio = image ? image.width / image.height : 4;
    return [0.2 * ratio, 0.2, 1];
  }, [labelTexture]);

  useEffect(() => () => labelTexture?.dispose(), [labelTexture]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (group.current) {
      group.current.position.y = reduced
        ? targetY
        : THREE.MathUtils.damp(group.current.position.y, targetY, 8, dt);
      const scale = reduced
        ? targetScale
        : THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, dt);
      group.current.scale.setScalar(scale);
    }
    if (material.current) {
      material.current.opacity = reduced
        ? targetOpacity
        : THREE.MathUtils.damp(material.current.opacity, targetOpacity, 6, dt);
      material.current.emissiveIntensity = reduced
        ? targetEmissive
        : THREE.MathUtils.damp(
            material.current.emissiveIntensity,
            targetEmissive,
            6,
            dt
          );
    }
    if (spriteMaterial.current) {
      spriteMaterial.current.opacity = reduced
        ? targetLabelOpacity
        : THREE.MathUtils.damp(
            spriteMaterial.current.opacity,
            targetLabelOpacity,
            6,
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
    <group ref={group} position={base}>
      <RoundedBox
        args={[2.9, 0.12, 1.8]}
        radius={0.07}
        smoothness={4}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
        castShadow
      >
        <meshStandardMaterial
          ref={material}
          color={dark ? '#24242b' : '#b4b4bc'}
          metalness={0.3}
          roughness={0.48}
          emissive={accent}
          emissiveIntensity={0.08}
          transparent
        />
      </RoundedBox>

      {[-0.34, 0, 0.34].map((z) => (
        <mesh key={z} position={[0, 0.068, z]}>
          <boxGeometry args={[2.2, 0.004, 0.014]} />
          <meshBasicMaterial
            color={dark ? '#a1a1aa' : '#52525b'}
            transparent
            opacity={future ? 0.1 : 0.2}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.068, 0.92]}>
        <boxGeometry args={[2.6, 0.01, 0.018]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={active ? 1 : current ? 0.75 : 0.4}
        />
      </mesh>

      {current ? (
        <mesh position={[1.1, 0.078, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.006, 8, 28]} />
          <meshBasicMaterial color={accent} transparent opacity={0.75} />
        </mesh>
      ) : null}

      {labelTexture ? (
        <sprite position={[-1.78, 0.02, 0.98]} scale={labelSize} renderOrder={10}>
          <spriteMaterial
            ref={spriteMaterial}
            map={labelTexture}
            transparent
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
            opacity={0.88}
          />
        </sprite>
      ) : null}
    </group>
  );
}

function RollbackCurve({
  from,
  to,
  color,
  reduced,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  reduced: boolean;
}) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const control = new THREE.Vector3(
      (from[0] + to[0]) / 2 + 1.7,
      (from[1] + to[1]) / 2 + 1.1,
      (from[2] + to[2]) / 2 + 1.5
    );
    return new THREE.QuadraticBezierCurve3(start, control, end);
  }, [from, to]);
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 40, 0.02, 6, false),
    [curve]
  );
  const pulse = useRef<THREE.Mesh>(null);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    if (!pulse.current) return;
    const t = reduced ? 0.55 : (performance.now() / 2600) % 1;
    pulse.current.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </mesh>
      <mesh position={to}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GenerationScene({
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
  const spin = useRef<THREE.Group>(null);
  const current = items.length - 1;
  const positions = useMemo(
    () => items.map((_, index) => cardPosition(index, items.length)),
    [items]
  );

  useFrame((_, delta) => {
    if (reduced || !coarse || !spin.current) return;
    spin.current.rotation.y += Math.min(delta, 0.05) * 0.1;
  });

  const rollback =
    active !== null && active < current
      ? ([
          positions[current][0],
          positions[current][1] + 0.1,
          positions[current][2],
        ] as [number, number, number])
      : null;
  const target =
    active !== null
      ? ([
          positions[active][0],
          positions[active][1] + 0.1,
          positions[active][2],
        ] as [number, number, number])
      : null;

  return (
    <>
      <ambientLight intensity={dark ? 0.55 : 0.75} />
      <directionalLight position={[5, 7, 5]} intensity={dark ? 1.6 : 1.5} />
      <pointLight position={[-4, 3, 4]} intensity={dark ? 14 : 7} color="#5ad4e6" />
      <pointLight position={[4, 1, -3]} intensity={dark ? 10 : 5} color="#948ae3" />

      <group ref={spin} rotation={[0, -0.28, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 2.2, 8]} />
          <meshBasicMaterial
            color={dark ? '#71717a' : '#a1a1aa'}
            transparent
            opacity={0.22}
          />
        </mesh>
        <mesh position={[0, -1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.006, 8, 96]} />
          <meshBasicMaterial
            color={dark ? '#3f3f46' : '#d4d4d8'}
            transparent
            opacity={0.4}
          />
        </mesh>

        {items.map((item, index) => (
          <Card
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            active={active === index}
            future={active !== null && index > active}
            dark={dark}
            reduced={reduced}
            onOver={() => onActive(index)}
            onOut={() => onActive(null)}
            onSelect={() => onActive(index)}
          />
        ))}

        {rollback && target ? (
          <RollbackCurve
            from={rollback}
            to={target}
            color={ACCENTS[active! % ACCENTS.length]}
            reduced={reduced}
          />
        ) : null}

        <Sparkles
          count={24}
          scale={[7, 3.8, 7]}
          size={1.2}
          speed={reduced ? 0 : 0.22}
          opacity={0.4}
          color={dark ? '#a1a1aa' : '#71717a'}
        />
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          target={[0, -0.05, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          autoRotate={!reduced && active === null}
          autoRotateSpeed={0.42}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 2.15}
        />
      ) : null}
    </>
  );
}

function StaticStack({ items }: { items: GenerationItem[] }) {
  return (
    <div className="x-gen-scene x-gen-static-fallback" aria-hidden="true">
      <div className="x-gen-stack">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="x-gen-card"
            data-current={index === items.length - 1}
            style={{ '--i': index } as CSSProperties}
          >
            <span className="x-gen-index">{item.id}</span>
            <span className="x-gen-line" />
          </div>
        ))}
      </div>
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
  const staticStack = <StaticStack items={items} />;

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
      {!ready ? staticStack : null}

      <div className="x-orbit-canvas">
        <SceneBoundary fallback={staticStack}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [4.9, 4.2, 6.5], fov: 38 }}
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
            <GenerationScene
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
