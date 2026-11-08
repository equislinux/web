'use client';

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import type { Lang, SceneNode } from '@/lib/i18n';

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

const ACCENTS = ['#5ad4e6', '#948ae3', '#fc618d', '#fd9353', '#7bd88f', '#fce566'];

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

const STATIC_POSITIONS = [
  { left: '77%', top: '22%' },
  { left: '84%', top: '57%' },
  { left: '64%', top: '81%' },
  { left: '31%', top: '83%' },
  { left: '15%', top: '53%' },
  { left: '25%', top: '20%' },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return coarse;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance = aspect < 1.05 ? 12.2 : aspect < 1.35 ? 8.2 : 6.4;
    camera.position.set(0, 1.6, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function Core({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const shell = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reduced || !shell.current) return;
    shell.current.rotation.y += Math.min(delta, 0.05) * 0.1;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.15}
      rotationIntensity={reduced ? 0 : 0.22}
      floatIntensity={reduced ? 0 : 0.35}
    >
      <group>
        <mesh castShadow>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshStandardMaterial
            color={dark ? '#1f1f24' : '#d4d4d8'}
            metalness={0.38}
            roughness={0.55}
            emissive={dark ? '#5ad4e6' : '#948ae3'}
            emissiveIntensity={dark ? 0.2 : 0.08}
          />
        </mesh>
        <mesh ref={shell} scale={1.32}>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshBasicMaterial
            color={dark ? '#5ad4e6' : '#52525b'}
            wireframe
            transparent
            opacity={dark ? 0.34 : 0.22}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.34, 0.006, 8, 96]} />
          <meshBasicMaterial
            color={dark ? '#f4f4f5' : '#18181b'}
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitRings({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.z += Math.min(delta, 0.05) * 0.035;
  });

  return (
    <group ref={group} rotation={[0.92, 0.18, 0.08]}>
      {[2.05, 2.9, 3.6].map((radius, index) => (
        <mesh key={radius} rotation={[0, 0, index * 0.42]}>
          <torusGeometry args={[radius, 0.006, 6, 128]} />
          <meshBasicMaterial
            color={dark ? '#3f3f46' : '#d4d4d8'}
            transparent
            opacity={index === 0 ? 0.6 : 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function createLabelTexture(text: string, dark: boolean) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const font = `600 ${13 * dpr}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const label = text.toUpperCase();
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) return null;
  measure.font = font;
  const padding = 9 * dpr;
  const width = Math.ceil(measure.measureText(label).width + padding * 2);
  const height = Math.ceil(24 * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  roundedRect(context, 0.5 * dpr, 0.5 * dpr, width - dpr, height - dpr, height / 2);
  context.fillStyle = dark ? 'rgba(9, 9, 11, 0.84)' : 'rgba(250, 250, 250, 0.9)';
  context.fill();
  context.strokeStyle = dark ? 'rgba(244, 244, 245, 0.24)' : 'rgba(24, 24, 27, 0.16)';
  context.lineWidth = dpr;
  context.stroke();
  context.fillStyle = dark ? '#f4f4f5' : '#18181b';
  context.fillText(label, width / 2, height / 2 + 0.5 * dpr);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function Connection({
  from,
  to,
  color,
  active,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
}) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: active ? 0.75 : 0.18,
    });
    return new THREE.Line(geometry, material);
  }, [from, to, color, active]);

  useEffect(
    () => () => {
      line.geometry.dispose();
      line.material.dispose();
    },
    [line]
  );

  return <primitive object={line} />;
}

function Node({
  node,
  position,
  accent,
  active,
  reduced,
  dark,
  onOver,
  onOut,
  onSelect,
}: {
  node: SceneNode;
  position: THREE.Vector3;
  accent: string;
  active: boolean;
  reduced: boolean;
  dark: boolean;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const labelTexture = useMemo(
    () => createLabelTexture(node.label, dark),
    [node.label, dark]
  );
  const labelSize = useMemo<[number, number, number]>(() => {
    const image = labelTexture?.image as HTMLCanvasElement | undefined;
    const ratio = image ? image.width / image.height : 2.4;
    return [0.29 * ratio, 0.29, 1];
  }, [labelTexture]);

  useEffect(() => () => labelTexture?.dispose(), [labelTexture]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (mesh.current) {
      const target = active ? 1.28 : 1;
      if (reduced) {
        mesh.current.scale.setScalar(target);
      } else {
        mesh.current.scale.setScalar(
          THREE.MathUtils.damp(mesh.current.scale.x, target, 9, dt)
        );
      }
    }
    if (halo.current && !reduced) {
      halo.current.rotation.z += dt * (active ? 1.1 : 0.35);
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
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <octahedronGeometry args={[0.23, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={active ? 1.35 : 0.35}
          metalness={0.55}
          roughness={0.18}
        />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.4, 0.25, 0]}>
        <torusGeometry args={[0.38, 0.008, 8, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={active ? 0.95 : 0.34}
        />
      </mesh>
      {labelTexture ? (
        <sprite position={[0, -0.56, 0]} scale={labelSize} renderOrder={10}>
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

function OrbitContent({
  nodes,
  hovered,
  selected,
  setHovered,
  setSelected,
  reduced,
  dark,
  coarse,
}: {
  nodes: SceneNode[];
  hovered: number | null;
  selected: number | null;
  setHovered: (value: number | null | ((current: number | null) => number | null)) => void;
  setSelected: (value: number | null | ((current: number | null) => number | null)) => void;
  reduced: boolean;
  dark: boolean;
  coarse: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  const activeIndex = hovered ?? selected;

  const positions = useMemo(() => {
    const count = nodes.length;
    return nodes.map((_, index) => {
      const ring = index % 2;
      const angle =
        (index / count) * Math.PI * 2 + (ring ? Math.PI / count : 0);
      const radius = ring ? 2.95 : 2.05;
      const height = ring ? 0.55 : -0.42;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
    });
  }, [nodes]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!reduced && coarse && spin.current) {
      spin.current.rotation.y += dt * (selected === null ? 0.13 : 0.035);
    }
  });

  return (
    <>
      <ambientLight intensity={dark ? 0.55 : 0.95} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={dark ? 1.8 : 2.4}
        color="#ffffff"
      />
      <pointLight
        position={[-4, -2, 3]}
        intensity={dark ? 11 : 7}
        color="#5ad4e6"
      />
      <pointLight
        position={[4, 2, -3]}
        intensity={dark ? 9 : 6}
        color="#948ae3"
      />

      <group ref={spin} rotation={[0.12, 0, 0]}>
        <Core dark={dark} reduced={reduced} />
        <OrbitRings dark={dark} reduced={reduced} />

        {positions.map((position, index) => (
          <Connection
            key={`edge-${nodes[index].id}`}
            from={[0, 0, 0]}
            to={[position.x, position.y, position.z]}
            color={ACCENTS[index % ACCENTS.length]}
            active={activeIndex === index}
          />
        ))}

        {nodes.map((node, index) => (
          <Node
            key={node.id}
            node={node}
            position={positions[index]}
            accent={ACCENTS[index % ACCENTS.length]}
            active={activeIndex === index}
            reduced={reduced}
            dark={dark}
            onOver={() => setHovered(index)}
            onOut={() =>
              setHovered((current) => (current === index ? null : current))
            }
            onSelect={() =>
              setSelected((current) => (current === index ? null : index))
            }
          />
        ))}

        <Sparkles
          count={28}
          scale={[8, 5, 8]}
          size={1.5}
          speed={reduced ? 0 : 0.25}
          opacity={0.45}
          color={dark ? '#a1a1aa' : '#71717a'}
        />
      </group>

      {!coarse ? (
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.65}
          autoRotate={!reduced && hovered === null && selected === null}
          autoRotateSpeed={0.55}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.75}
        />
      ) : null}
    </>
  );
}

function StaticDiagram({
  nodes,
  activeIndex,
}: {
  nodes: SceneNode[];
  activeIndex: number | null;
}) {
  return (
    <div className="x-orbit-static" aria-hidden="true">
      <span className="x-orbit-static-ring" />
      <span className="x-orbit-static-ring x-orbit-static-ring-inner" />
      {nodes.map((node, index) => {
        const position =
          STATIC_POSITIONS[index % STATIC_POSITIONS.length] ??
          STATIC_POSITIONS[0];
        return (
          <span
            key={node.id}
            className="x-orbit-static-node"
            data-active={activeIndex === index}
            style={
              {
                left: position.left,
                top: position.top,
                '--accent': ACCENTS[index % ACCENTS.length],
              } as CSSProperties
            }
          />
        );
      })}
    </div>
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

  const staticDiagram = (
    <StaticDiagram nodes={nodes} activeIndex={activeIndex} />
  );

  return (
    <figure className="x-orbit-wrap" ref={containerRef}>
      <div
        className="x-orbit"
        data-variant={variant}
        data-ready={ready}
        role="group"
        aria-label={ariaLabel}
      >
        {!ready ? staticDiagram : null}

        <div className="x-orbit-canvas">
          <SceneBoundary fallback={staticDiagram}>
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 1.6, 6.4], fov: 38 }}
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
              <OrbitContent
                nodes={nodes}
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
            style={{ '--accent': ACCENTS[index % ACCENTS.length] } as CSSProperties}
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
