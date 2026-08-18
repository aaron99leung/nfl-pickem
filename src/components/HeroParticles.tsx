"use client";

import { useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import { Canvas, useFrame, extend, type ThreeElement } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

declare module "@react-three/fiber" {
  interface ThreeElements {
    unrealBloomPass: ThreeElement<typeof UnrealBloomPass>;
  }
}

// Football-swarm shaping constants, carried over unchanged from the reference
// per-particle update logic.
const PARAMS = {
  length: 38,
  width: 20.5,
  pointiness: 0.6,
  spin: 0.35,
  wobble: 1.45,
};
const SPEED_MULT = 0.7;
const TILT_ANGLE = Math.PI / 6; // tilts the football's long axis diagonally instead of purely horizontal

const DESKTOP_COUNT = 15000;
const MOBILE_COUNT = 5000;
const MOBILE_BREAKPOINT = 768;

function ParticleSwarm({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for reference-code compatibility

  // Math.random() is impure, so the initial scatter of positions is seeded
  // in an effect rather than during render. Scaled down from the reference's
  // *100 cube: with additive blending + high bloom strength, particles
  // lerping in from a much wider cube than the target shape sweep through a
  // dense, over-bright cluster mid-convergence before the spiral resolves.
  const positionsRef = useRef<THREE.Vector3[]>([]);
  useEffect(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        )
      );
    }
    positionsRef.current = pos;

    // InstancedMesh only exposes `instanceColor` (and the shader's
    // USE_INSTANCING_COLOR define) once setColorAt() has been called at
    // least once — seed it here so it exists before the first compile.
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        meshRef.current.setColorAt(i, pColor);
      }
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [count, pColor]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          #ifndef USE_INSTANCING_COLOR
          attribute vec3 instanceColor;
          #endif
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec3 vColor;
          void main() {
              vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
              vNormal = normalize(normalMatrix * normal);
              vViewPosition = -mvPosition.xyz;
              vColor = instanceColor;
              gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec3 vColor;
          void main() {
              float fresnel = dot(vNormal, normalize(vViewPosition));
              fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
              fresnel = pow(fresnel, 2.0);
              vec3 col = vColor * fresnel + vec3(0.1);
              gl_FragColor = vec4(col, 0.3 + fresnel * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending, // was numeric `2` in the reference
        depthWrite: false,
      }),
    []
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []);

  // geometry/material are passed to <instancedMesh> via constructor `args`
  // rather than as JSX children, so R3F's automatic dispose-on-unmount never
  // sees them — InstancedMesh.dispose() itself only cleans up its own morph
  // texture, it doesn't cascade into .geometry/.material. Dispose explicitly.
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positions = positionsRef.current;
    if (positions.length !== count) return; // seeded positions not ready yet
    const time = state.clock.getElapsedTime() * SPEED_MULT;

    for (let i = 0; i < count; i++) {
      // USER CODE START (per-particle football-swarm math, unchanged)
      const length = PARAMS.length;
      const width = PARAMS.width;
      const pointiness = PARAMS.pointiness;
      const spinSpeed = PARAMS.spin;
      const wobble = PARAMS.wobble;

      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const safeCount = count > 1 ? count - 1 : 1;
      const u = i / safeCount;
      const axial = (u - 0.5) * length;

      const t = u * Math.PI;
      let profile = Math.sin(t);
      profile = Math.pow(Math.max(profile, 0.0001), pointiness);
      const radius = profile * width * 0.5;

      const spiralAngle = i * goldenAngle + time * spinSpeed;
      const wobbleAmt = Math.sin(time * 2 + i * 0.05) * wobble * profile;
      const r = radius + wobbleAmt;

      const y = Math.cos(spiralAngle) * r;
      const z = Math.sin(spiralAngle) * r;

      // Rigidly rotate the finished (axial, y) point by TILT_ANGLE instead of
      // blending axial into y — that would distort the cross-section instead
      // of just spinning the same shape.
      const tiltCos = Math.cos(TILT_ANGLE);
      const tiltSin = Math.sin(TILT_ANGLE);
      const tiltedX = axial * tiltCos - y * tiltSin;
      const tiltedY = axial * tiltSin + y * tiltCos;

      target.set(tiltedX, tiltedY, z);

      const twoPi = Math.PI * 2;
      const angleNorm = ((spiralAngle % twoPi) + twoPi) % twoPi;
      const isSeam = angleNorm < 0.18 && u > 0.28 && u < 0.72;

      if (isSeam) {
        color.setRGB(1.0, 1.0, 1.0);
      } else {
        const hue = 0.08 + profile * 0.02;
        const light = 0.28 + profile * 0.18;
        color.setHSL(hue, 0.65, light);
      }
      // USER CODE END

      positions[i].lerp(target, 0.02);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}
function getIsMobileSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}
function getIsMobileServerSnapshot() {
  return false; // assume desktop for the server-rendered pass
}

export function HeroParticles() {
  const isMobile = useSyncExternalStore(
    subscribeToResize,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot
  );
  const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 0.01]} />
        <ParticleSwarm count={count} />
        <OrbitControls autoRotate enableZoom={false} />
        <Effects disableGamma>
          <unrealBloomPass
            args={[new THREE.Vector2(256, 256), 1, 0, 0]}
            threshold={0}
            strength={3}
            radius={0.4}
          />
        </Effects>
      </Canvas>
    </div>
  );
}
