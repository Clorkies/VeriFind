"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BOX = 2.2;

function Tethers({
  anchors,
}: {
  anchors: [number, number, number][];
}) {
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  return (
    <>
      {anchors.map((p, i) => (
        <Line
          key={i}
          points={[origin, new THREE.Vector3(...p)]}
          color="#800000"
          lineWidth={1.5}
          transparent
          opacity={0.55}
        />
      ))}
    </>
  );
}

function KeyIcon() {
  return (
    <group position={[0.85, 0.45, 0.35]} rotation={[0.4, -0.6, 0.2]}>
      <mesh castShadow>
        <torusGeometry args={[0.22, 0.06, 16, 32]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#1d4ed8"
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0.28, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.55, 12]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#2563eb"
          emissiveIntensity={0.45}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function UmbrellaIcon() {
  return (
    <group position={[-0.75, 0.35, -0.4]} rotation={[-0.2, 0.5, 0.1]}>
      <mesh castShadow rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.42, 0.22, 24, 1, true]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#5b21b6"
          emissiveIntensity={0.5}
          metalness={0.35}
          roughness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.75, 8]} />
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#4c1d95"
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function CalculatorIcon() {
  return (
    <group position={[0.15, -0.65, 0.55]} rotation={[0.15, -0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.72, 0.12]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#047857"
          emissiveIntensity={0.45}
          metalness={0.55}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.12, 0.07]}>
        <boxGeometry args={[0.42, 0.22, 0.02]} />
        <meshStandardMaterial
          color="#6ee7b7"
          emissive="#065f46"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function LedgerBlock() {
  const group = useRef<THREE.Group>(null);
  const anchors: [number, number, number][] = useMemo(
    () => [
      [0.85, 0.45, 0.35],
      [-0.75, 0.35, -0.4],
      [0.15, -0.65, 0.55],
    ],
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x =
      Math.sin(performance.now() / 3500) * 0.12 - 0.05;
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[BOX, BOX, BOX]} />
        <meshPhysicalMaterial
          color="#1f2937"
          transparent
          opacity={0.22}
          roughness={0.15}
          metalness={0.35}
          transmission={0.65}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(BOX, BOX, BOX)]} />
        <lineBasicMaterial color="#800000" transparent opacity={0.95} />
      </lineSegments>
      <Tethers anchors={anchors} />
      <KeyIcon />
      <UmbrellaIcon />
      <CalculatorIcon />
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-[min(72vw,520px)] w-full max-w-[520px] sm:h-[480px] lg:h-[520px]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl maroon-glow-soft opacity-70" />
      <Canvas
        className="rounded-3xl"
        camera={{ position: [0, 0.2, 5.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 5, 6]} intensity={2.2} color="#800000" />
        <pointLight position={[-5, -3, -4]} intensity={0.9} color="#eab308" />
        <directionalLight position={[2, 4, 3]} intensity={0.35} color="#f3f4f6" />
        <LedgerBlock />
      </Canvas>
    </div>
  );
}
