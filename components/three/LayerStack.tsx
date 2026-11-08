'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
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

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const scale = aspect < 1.05 ? 1.65 : aspect < 1.35 ? 1.25 : 1;
    camera.position.set(5.2 * scale, 4.4 * scale, 6.2 * scale);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function Plate({
  layer,
  index,
  active,
  dark,
  reduced,
  onOver,
  onOut,
  onSelect,
}: {
  layer: LayerData;
  index: number;
  active: boolean;
  dark: boolean;
  reduced: boolean;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const baseY = index * 0.32 - 0.8;
  const labelTexture = useMemo(
    () =>
      createLabelTexture(
        `${String(index + 1).padStart(2, '0')} · ${layer.name}`,
        dark,
        layer.accent
      ),
    [dark, index, layer.accent, layer.name]
  );
  const labelSize = useMemo<[number, number, number]>(() => {
    const image = labelTexture?.image as HTMLCanvasElement | undefined;
    const ratio = image ? image.width / image.height : 3.2;
    return [0.22 * ratio, 0.22, 1];
  }, [labelTexture]);

  useEffect(() => () => labelTexture?.dispose(), [labelTexture]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;
    const targetY = baseY + (active ? 0.2 : 0);
    const targetScale = active ? 1.04 : 1;
    if (reduced) {
      group.current.position.y = targetY;
      group.current.scale.setScalar(targetScale);
    } else {
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        targetY,
        8,
        dt
      );
      group.current.scale.setScalar(
        THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, dt)
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
    <group
      ref={group}
      position={[Math.sin(index * 1.4) * 0.06, baseY, Math.cos(index * 1.1) * 0.06]}
    >
      <RoundedBox
        args={[3.4, 0.14, 2.1]}
        radius={0.07}
        smoothness={4}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
        castShadow
      >
        <meshStandardMaterial
          color={dark ? '#24242b' : '#b4b4bc'}
          metalness={0.3}
          roughness={0.48}
          emissive={layer.accent}
          emissiveIntensity={active ? 0.8 : 0.16}
        />
      </RoundedBox>
      <mesh position={[0, 0.078, 1.06]}>
        <boxGeometry args={[3.2, 0.008, 0.018]} />
        <meshBasicMaterial
          color={layer.accent}
          transparent
          opacity={active ? 1 : 0.45}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 2.2, 10]} />
        <meshBasicMaterial
          color={dark ? '#71717a' : '#a1a1aa'}
          transparent
          opacity={0.22}
        />
      </mesh>
      {labelTexture ? (
        <sprite position={[-2.02, 0.02, 1.18]} scale={labelSize} renderOrder={10}>
          <spriteMaterial
            map={labelTexture}
            transparent
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
            opacity={active ? 1 : 0.86}
          />
        </sprite>
      ) : null}
    </group>
  );
}

function LayerScene({
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
  const spin = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced || !coarse || !spin.current) return;
    spin.current.rotation.y += Math.min(delta, 0.05) * 0.12;
  });

  return (
    <>
      <ambientLight intensity={dark ? 0.55 : 0.72} />
      <directionalLight position={[5, 7, 5]} intensity={dark ? 1.6 : 1.45} />
      <pointLight position={[-4, 3, 4]} intensity={dark ? 14 : 5} color="#5ad4e6" />
      <pointLight position={[4, 1, -3]} intensity={dark ? 10 : 4} color="#948ae3" />

      <group ref={spin} rotation={[0, -0.35, 0]}>
        <mesh position={[0, -1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.7, 0.006, 8, 96]} />
          <meshBasicMaterial
            color={dark ? '#3f3f46' : '#d4d4d8'}
            transparent
            opacity={0.42}
          />
        </mesh>
        <mesh position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.1, 0.005, 8, 80]} />
          <meshBasicMaterial
            color={dark ? '#52525b' : '#a1a1aa'}
            transparent
            opacity={0.28}
          />
        </mesh>

        {layers.map((layer, index) => (
          <Plate
            key={layer.name}
            layer={layer}
            index={index}
            active={active === index}
            dark={dark}
            reduced={reduced}
            onOver={() => onActive(index)}
            onOut={() => onActive(null)}
            onSelect={() => onActive(index)}
          />
        ))}

        <Sparkles
          count={24}
          scale={[7, 3.5, 7]}
          size={1.2}
          speed={reduced ? 0 : 0.22}
          opacity={0.4}
          color={dark ? '#a1a1aa' : '#71717a'}
        />
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          autoRotate={!reduced && active === null}
          autoRotateSpeed={0.45}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 2.15}
        />
      ) : null}
    </>
  );
}

function StaticStack({ layers }: { layers: LayerData[] }) {
  return (
    <div className="x-anatomy x-layer-static-fallback" aria-hidden="true">
      <div className="x-anatomy-stage">
        <div className="x-anatomy-orbit">
          <div className="x-anatomy-stack">
            {layers.map((layer, index) => (
              <div
                key={layer.name}
                className="x-anatomy-layer"
                style={
                  { '--i': index, '--accent': layer.accent } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const staticStack = <StaticStack layers={layers} />;

  return (
    <div
      ref={containerRef}
      className="x-orbit"
      data-variant="layers"
      data-ready={ready}
      role="group"
      aria-label={ariaLabel}
    >
      {!ready ? staticStack : null}

      <div className="x-orbit-canvas">
        <SceneBoundary fallback={staticStack}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [5.2, 4.4, 6.2], fov: 38 }}
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
            <LayerScene
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
