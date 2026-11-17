'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { Billboard, RoundedBox } from '@react-three/drei';
import { createLabelTexture } from './labelTexture';
import { samuraiPalette } from './samuraiTheme';

type Vec3 = [number, number, number];

export function Trunk({
  dark,
  height = 2.5,
  roots = true,
}: {
  dark: boolean;
  height?: number;
  roots?: boolean;
}) {
  const palette = samuraiPalette(dark);

  const bands = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const t = index / 5;
      const y = -height / 2 + 0.18 + t * (height - 0.36);
      const radius = THREE.MathUtils.lerp(0.2, 0.055, (y + height / 2) / height);
      return { y, radius };
    });
  }, [height]);

  const cordGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i += 1) {
      const t = i / 72;
      const angle = t * Math.PI * 4.2;
      const y = -height / 2 + 0.12 + t * (height - 0.24);
      const radius =
        THREE.MathUtils.lerp(0.2, 0.055, (y + height / 2) / height) + 0.012;
      points.push(
        new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      );
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      96,
      0.005,
      5,
      false
    );
  }, [height]);

  useEffect(() => () => cordGeometry.dispose(), [cordGeometry]);

  const rootCurves = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const angle = -1.2 + (index / 4) * 2.4;
      const start = new THREE.Vector3(0, -height / 2 + 0.02, 0);
      const mid = new THREE.Vector3(
        Math.cos(angle) * 0.5,
        -height / 2 - 0.04,
        Math.sin(angle) * 0.5
      );
      const end = new THREE.Vector3(
        Math.cos(angle) * 1.05,
        -height / 2 - 0.08,
        Math.sin(angle) * 1.05
      );
      return {
        curve: new THREE.QuadraticBezierCurve3(start, mid, end),
        end,
        accent: index % 2 === 0,
      };
    });
  }, [height]);

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.055, 0.2, height, 6, 1]} />
        <meshPhysicalMaterial
          color={palette.ink}
          metalness={0.22}
          roughness={0.42}
          clearcoat={0.35}
          clearcoatRoughness={0.35}
          flatShading
        />
      </mesh>

      {bands.map((band) => (
        <mesh
          key={band.y}
          position={[0, band.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[band.radius + 0.005, 0.004, 5, 48]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.88}
            roughness={0.3}
          />
        </mesh>
      ))}

      <mesh geometry={cordGeometry}>
        <meshStandardMaterial
          color={palette.shu}
          metalness={0.1}
          roughness={0.75}
        />
      </mesh>

      {roots
        ? rootCurves.map((root, index) => (
            <group key={index}>
              <mesh>
                <tubeGeometry args={[root.curve, 20, 0.018, 5, false]} />
                <meshStandardMaterial
                  color={root.accent ? palette.brass : palette.inkAlt}
                  metalness={root.accent ? 0.85 : 0.2}
                  roughness={root.accent ? 0.3 : 0.5}
                />
              </mesh>
              <mesh position={root.end}>
                <sphereGeometry args={[0.028, 12, 12]} />
                <meshStandardMaterial
                  color={palette.brass}
                  metalness={0.88}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))
        : null}
    </group>
  );
}

export function Crown({ dark, y }: { dark: boolean; y: number }) {
  const palette = samuraiPalette(dark);
  const curves = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const angle = (index / 5) * Math.PI * 2;
      const start = new THREE.Vector3(0, y, 0);
      const mid = new THREE.Vector3(
        Math.cos(angle) * 0.15,
        y + 0.32,
        Math.sin(angle) * 0.15
      );
      const end = new THREE.Vector3(
        Math.cos(angle) * 0.46,
        y + 0.42,
        Math.sin(angle) * 0.46
      );
      return { curve: new THREE.QuadraticBezierCurve3(start, mid, end), end };
    });
  }, [y]);

  return (
    <group>
      {curves.map((branch, index) => (
        <group key={index}>
          <mesh>
            <tubeGeometry args={[branch.curve, 20, 0.011, 5, false]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? palette.brass : palette.inkAlt}
              metalness={index % 2 === 0 ? 0.88 : 0.24}
              roughness={index % 2 === 0 ? 0.3 : 0.48}
            />
          </mesh>
          <mesh position={branch.end}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial
              color={palette.brass}
              metalness={0.88}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, y + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.01, 8, 40]} />
        <meshStandardMaterial
          color={palette.brass}
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, y + 0.08, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={palette.shu} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function Plinth({
  dark,
  radius = 0.55,
  y = -1.36,
}: {
  dark: boolean;
  radius?: number;
  y?: number;
}) {
  const palette = samuraiPalette(dark);

  return (
    <group>
      <mesh position={[0, y, 0]}>
        <cylinderGeometry args={[radius, radius * 1.04, 0.06, 48]} />
        <meshPhysicalMaterial
          color={palette.inkAlt}
          metalness={0.24}
          roughness={0.38}
          clearcoat={0.4}
        />
      </mesh>
      <mesh position={[0, y + 0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.005, 6, 72]} />
        <meshStandardMaterial
          color={palette.brass}
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>
    </group>
  );
}

export function Enso({
  dark,
  radius = 2.2,
  z = -1.3,
}: {
  dark: boolean;
  radius?: number;
  z?: number;
}) {
  const palette = samuraiPalette(dark);

  return (
    <Billboard position={[0, 0, z]}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 6, 128]} />
        <meshBasicMaterial
          color={palette.brass}
          transparent
          opacity={0.2}
        />
      </mesh>
    </Billboard>
  );
}

export function BranchTube({
  from,
  to,
  color,
  radius = 0.016,
  lift = 0.14,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  radius?: number;
  lift?: number;
}) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3(
      (from[0] + to[0]) / 2,
      Math.max(from[1], to[1]) + lift,
      (from[2] + to[2]) / 2
    );
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to, lift]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 28, radius, 6, false]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.32} />
    </mesh>
  );
}

function Lacing({
  width,
  depth,
  dark,
  rows,
  cols,
  seed,
}: {
  width: number;
  depth: number;
  dark: boolean;
  rows: number;
  cols: number;
  seed: number;
}) {
  const total = rows * cols;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const palette = samuraiPalette(dark);

  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced || total === 0) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3(0.012, 0.075, 0.008);
    const step = (width - 0.24) / Math.max(1, cols - 1);
    let cursor = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        position.set(
          -width / 2 + 0.12 + col * step,
          row === 0 ? 0.034 : -0.034,
          depth / 2 + 0.007
        );
        matrix.compose(position, quaternion, scale);
        instanced.setMatrixAt(cursor, matrix);
        color.set((col + row + seed) % 2 === 0 ? palette.ai : palette.bone);
        instanced.setColorAt(cursor, color);
        cursor += 1;
      }
    }
    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
  }, [cols, dark, depth, palette.ai, palette.bone, rows, seed, total, width]);

  if (total === 0) return null;

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, total]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" metalness={0.05} roughness={0.9} />
    </instancedMesh>
  );
}

export function LamellarPlate({
  width,
  height,
  depth,
  accent,
  dark,
  variant = 'a',
  lacingRows = 2,
  lacingCols = 6,
  seed = 0,
  active = false,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  width: number;
  height: number;
  depth: number;
  accent: string;
  dark: boolean;
  variant?: 'a' | 'b';
  lacingRows?: number;
  lacingCols?: number;
  seed?: number;
  active?: boolean;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}) {
  const palette = samuraiPalette(dark);

  return (
    <group>
      <RoundedBox
        args={[width, height, depth]}
        radius={0.022}
        smoothness={3}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <meshPhysicalMaterial
          color={variant === 'a' ? palette.ink : palette.inkAlt}
          metalness={0.28}
          roughness={0.34}
          clearcoat={0.55}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>

      <mesh position={[0, height / 2 + 0.003, 0]}>
        <boxGeometry args={[width - 0.05, 0.004, depth - 0.04]} />
        <meshStandardMaterial
          color={palette.inkDeep}
          metalness={0.16}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, 0, depth / 2 + 0.003]}>
        <boxGeometry args={[width * 0.9, 0.006, 0.004]} />
        <meshStandardMaterial
          color={active ? accent : palette.brass}
          metalness={0.9}
          roughness={0.28}
          emissive={active ? accent : '#000000'}
          emissiveIntensity={active ? 0.32 : 0}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.005, depth / 2 - 0.06]}>
        <boxGeometry args={[width * 0.42, 0.005, 0.004]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Lacing
        width={width}
        depth={depth}
        dark={dark}
        rows={lacingRows}
        cols={lacingCols}
        seed={seed}
      />
    </group>
  );
}

export function Tag({
  text,
  position,
  accent,
  dark,
  active,
  scale = 0.17,
}: {
  text: string;
  position: Vec3;
  accent: string;
  dark: boolean;
  active: boolean;
  scale?: number;
}) {
  const texture = useMemo(
    () => createLabelTexture(text, dark, accent),
    [text, dark, accent]
  );
  const size = useMemo<Vec3>(() => {
    const image = texture?.image as HTMLCanvasElement | undefined;
    const ratio = image ? image.width / image.height : 3.2;
    return [scale * ratio, scale, 1];
  }, [texture, scale]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <sprite position={position} scale={size} renderOrder={12}>
      <spriteMaterial
        map={texture}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        opacity={active ? 1 : 0.82}
      />
    </sprite>
  );
}

export function Leader({
  from,
  to,
  color,
  active,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  active: boolean;
}) {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 0.06;
    return new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(start, mid, end),
      20,
      0.0035,
      4,
      false
    );
  }, [from, to]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.38} />
    </mesh>
  );
}

export function StaticTree({ count }: { count: number }) {
  return (
    <div className="x-tree-static" aria-hidden="true">
      <span className="x-tree-static-trunk" />
      {Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1;
        return (
          <span
            key={index}
            className="x-tree-static-branch"
            data-side={side}
            style={
              {
                '--i': index,
                '--top': `${30 + (index / Math.max(1, count - 1)) * 44}%`,
                left: side > 0 ? '50%' : '20%',
                width: '30%',
                transform: `rotate(${side * -14}deg)`,
                transformOrigin: 'left center',
              } as CSSProperties
            }
          />
        );
      })}
      <span className="x-tree-static-plinth" />
    </div>
  );
}
