import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  useSkyBlasterStore,
  START_GATE_POS,
  P1_START_POS,
  P2_START_POS,
  CRATE_LANDING_SLOTS,
} from '../../services/useSkyBlasterStore';
import { FallingCrate, ArenaHazard, FallingNuclearBomb } from '../../types/skyBlaster';
import { skyBlasterAudio } from '../../utils/skyBlasterAudio';
import {
  buildBaseBodyMesh,
  buildHairMesh,
  buildAccessoryMesh,
} from './Chibi3DProceduralMesh';
import { disposeObject3D } from './ChibiMasterSkeleton';

/**
 * Procedural Manicured Checkerboard Lawn Turf Texture
 */
function createCheckerboardTurfTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const cols = 8;
  const rows = 6;
  const cw = 512 / cols;
  const ch = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isEven = (r + c) % 2 === 0;
      ctx.fillStyle = isEven ? '#34a853' : '#2b8a44';
      ctx.fillRect(c * cw, r * ch, cw, ch);

      // Fine golden grid line border
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(c * cw, r * ch, cw, ch);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.8, 1.8);
  return texture;
}

/**
 * 5 Dedicated Landing Pedestals Aligned in a Horizontal Row at Far End (z = -3.8)
 */
function FarEndLandingPedestals() {
  const glowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.getElapsedTime();
    glowRef.current.children.forEach((child, i) => {
      const s = 1.0 + Math.sin(t * 3.0 + i) * 0.08;
      child.scale.set(s, s, 1);
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 5 Stone Landing Pedestals aligned horizontally at z = -3.8 */}
      {CRATE_LANDING_SLOTS.map((pos, idx) => (
        <group key={idx} position={[pos[0], 0, pos[2]]}>
          {/* Raised Stone Pedestal Pad */}
          <mesh position={[0, 0.03, 0]} receiveShadow>
            <cylinderGeometry args={[0.75, 0.85, 0.06, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Golden Rune Ring */}
          <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, 0.74, 32]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </mesh>

          {/* Inner Emerald Glyph Disc */}
          <mesh position={[0, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.55, 24]} />
            <meshStandardMaterial color="#059669" roughness={0.5} />
          </mesh>

          {/* Slot Number Label */}
          <Html position={[0, 0.08, 0.35]} center distanceFactor={9}>
            <div className="text-[10px] font-black text-amber-300 font-mono tracking-wider select-none pointer-events-none drop-shadow">
              #{idx + 1}
            </div>
          </Html>

          {/* Subtle Vertical Light Beam Beacon from Sky onto Pedestal */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 3.6, 16]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.06} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* Decorative Golden Base Rail Connecting All 5 Pedestals */}
      <mesh position={[0, 0.04, -3.8]}>
        <boxGeometry args={[9.5, 0.04, 0.12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Beautiful Royal Floral Archway & Marble Threshold at Starting Line (z = 4.2)
 * Both players stand side by side at [x = -0.45, 0.45, z = 4.2]
 */
function RoyalFloralArchwayGate({ gateOpen }: { gateOpen: boolean }) {
  const ribbonGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ribbonGlowRef.current || gateOpen) return;
    const t = state.clock.getElapsedTime();
    ribbonGlowRef.current.position.y = 0.08 + Math.sin(t * 3.0) * 0.02;
  });

  return (
    <group position={[START_GATE_POS[0], 0, START_GATE_POS[2]]}>
      {/* 1. Pristine Marble Stepped Starting Platform on Ground */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.1, 0.08, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.65, 1.85, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>

      {/* 2. Sleek Royal Pergola Arch - Fluted Columns on Left & Right */}
      {/* Left Column */}
      <group position={[-1.75, 0, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 1.6, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.8} />
        </mesh>
        {/* Column Base & Capital */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.2, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Golden Lantern with Warm Flame */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Right Column */}
      <group position={[1.75, 0, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 1.6, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.2, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Golden Lantern with Warm Flame */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Graceful Curved Golden Arch Spanning Above Columns */}
      <group position={[0, 1.65, 0]}>
        <mesh rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[1.75, 0.08, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Cascading Floral Wisteria & Roses Garland Wrapped on Arch */}
        {[-1.4, -0.9, -0.4, 0, 0.4, 0.9, 1.4].map((gx, i) => {
          const gy = Math.sin((gx + 1.75) / 3.5 * Math.PI) * 1.75;
          return (
            <group key={i} position={[gx, gy, 0]}>
              <mesh>
                <sphereGeometry args={[0.11, 8, 8]} />
                <meshStandardMaterial color="#10b981" roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.08, 0.05]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#f43f5e' : '#fbcfe8'} roughness={0.4} />
              </mesh>
            </group>
          );
        })}

        {/* Top Radiant Golden Star Crest */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* 3. Glowing Start Line Barrier Ribbon (Opens when gateOpen) */}
      {!gateOpen ? (
        <group position={[0, 0, -0.2]}>
          <mesh ref={ribbonGlowRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.18]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <Html position={[0, 0.35, -0.15]} center distanceFactor={8.5}>
            <div className="px-3 py-0.5 rounded-full bg-amber-950/90 border border-amber-400 text-[10px] font-black text-amber-200 shadow-lg whitespace-nowrap select-none pointer-events-none uppercase tracking-wider flex items-center gap-1">
              <span>🔒</span> VẠCH XUẤT PHÁT (ĐỢI VẬT PHẨM RƠI XUỐNG)
            </div>
          </Html>
        </group>
      ) : (
        <Html position={[0, 0.35, -0.15]} center distanceFactor={8.5}>
          <div className="px-3.5 py-1 rounded-full bg-emerald-600/95 border-2 border-white text-[11px] font-black text-white shadow-xl whitespace-nowrap select-none pointer-events-none tracking-wider flex items-center gap-1 animate-pulse">
            <span>🌸</span> BỤC NỘP HÀNG (CHẠY VỀ ĐÂY ĐỂ NỘP)
          </div>
        </Html>
      )}

      <pointLight
        color={gateOpen ? '#34d399' : '#f59e0b'}
        intensity={2.2}
        distance={4.5}
        position={[0, 1.4, 0]}
      />
    </group>
  );
}

/**
 * Scenic Garden Horizon Backdrop (Clean & Lush - No Cannons/Obstructions)
 */
function CleanScenicGardenBackdrop() {
  return (
    <group position={[0, 0, -5.5]}>
      {/* Stone Terrace Balustrade behind the 5 pedestals */}
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <boxGeometry args={[15.6, 0.7, 0.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[15.6, 0.08, 0.45]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>

      {/* Lush Green Hedge Trellis Wall with Blooming Rose Bushes */}
      <mesh position={[0, 1.25, 0.05]} receiveShadow>
        <boxGeometry args={[15.4, 1.0, 0.35]} />
        <meshStandardMaterial color="#16a34a" roughness={0.85} />
      </mesh>
      {/* Decorative Blossoms along the Trellis */}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((bx, i) => (
        <mesh key={i} position={[bx, 1.4, 0.25]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f43f5e' : '#fef08a'} roughness={0.4} />
        </mesh>
      ))}

      {/* Gentle Rolling Hills in Far Distance */}
      <mesh position={[0, 2.2, -1.5]}>
        <boxGeometry args={[18.0, 1.2, 0.5]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Ancient Carved Jade Relief Walls with Golden Neon Trim
 */
function AncientJadeReliefWalls() {
  return (
    <group>
      {/* West Wall (Left) */}
      <mesh position={[-7.6, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.45, 1.0, 11.4]} />
        <meshStandardMaterial color="#14532d" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[-7.6, 1.02, 0]}>
        <boxGeometry args={[0.5, 0.06, 11.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.0} />
      </mesh>

      {/* East Wall (Right) */}
      <mesh position={[7.6, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.45, 1.0, 11.4]} />
        <meshStandardMaterial color="#14532d" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[7.6, 1.02, 0]}>
        <boxGeometry args={[0.5, 0.06, 11.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.0} />
      </mesh>

      {/* South Wall (Bottom Front Behind Gate) */}
      <mesh position={[0, 0.5, 5.7]} receiveShadow>
        <boxGeometry args={[15.6, 1.0, 0.45]} />
        <meshStandardMaterial color="#14532d" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.02, 5.7]}>
        <boxGeometry args={[15.6, 0.06, 0.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
}

/**
 * Organic Realistic Garden Mud Puddle with Wet Specular Sheen & Floating Lily Pads
 */
function NaturalMudPuddleHazard({ hazard }: { hazard: ArenaHazard }) {
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!rippleRef.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1.0 + Math.sin(t * 2.5 + hazard.position[0]) * 0.04;
    rippleRef.current.scale.set(s, s, 1.0);
  });

  return (
    <group position={[hazard.position[0], 0.015, hazard.position[2]]}>
      {/* 1. Outer Wet Mud Splatter Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hazard.radius * 1.15, 32]} />
        <meshStandardMaterial color="#271810" roughness={0.95} />
      </mesh>

      {/* 2. Deep Wet Mud Pool with Liquid Specular Sheen */}
      <mesh ref={rippleRef} position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hazard.radius, 32]} />
        <meshStandardMaterial
          color="#3e2723"
          roughness={0.12}
          metalness={0.35}
        />
      </mesh>

      {/* 3. Subtle Liquid Water Surface Ripple Ring */}
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[hazard.radius * 0.65, hazard.radius * 0.72, 32]} />
        <meshBasicMaterial color="#a1887f" transparent opacity={0.35} />
      </mesh>

      {/* 4. Tiny Floating Water Lily Pads in the Puddle */}
      {[
        [-hazard.radius * 0.35, -hazard.radius * 0.25],
        [hazard.radius * 0.3, hazard.radius * 0.28],
      ].map(([lx, lz], i) => (
        <group key={i} position={[lx, 0.008, lz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.14, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
          {/* Little blossom on lily pad */}
          <mesh position={[0.02, 0.015, 0.02]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
        </group>
      ))}

    </group>
  );
}

/**
 * Spiky Stun Mine (No text title badge - purely visual 3D)
 */
function SpikyMineHazard({ hazard }: { hazard: ArenaHazard }) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || hazard.triggered) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = 0.15 + Math.sin(t * 4.0) * 0.03;
    meshRef.current.rotation.y = t * 1.2;

    if (ringRef.current) {
      const s = 1.0 + Math.sin(t * 5.0) * 0.12;
      ringRef.current.scale.set(s, s, s);
    }
  });

  if (hazard.triggered) return null;

  return (
    <group position={[hazard.position[0], 0, hazard.position[2]]}>
      <mesh ref={ringRef} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 24]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.65} />
      </mesh>

      <group ref={meshRef} position={[0, 0.18, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>

        {[
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
          [0.7, 0.7, 0],
          [-0.7, 0.7, 0],
        ].map((dir, i) => (
          <mesh key={i} position={[dir[0] * 0.22, dir[1] * 0.22, dir[2] * 0.22]}>
            <coneGeometry args={[0.05, 0.14, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Visual 3D Nuclear Bomb with Airstrike Ground Warning Decal & Detonation Fireball Shockwave
 * Fully controlled at 60 FPS via direct Three.js object refs so the missile is 100% visible
 */
function NuclearAirstrikeBomb3D({ bomb }: { bomb: FallingNuclearBomb }) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const warningGroupRef = useRef<THREE.Group>(null);
  const warningRingRef = useRef<THREE.Mesh>(null);
  const missileGroupRef = useRef<THREE.Group>(null);
  const explosionGroupRef = useRef<THREE.Group>(null);
  const fireballMeshRef = useRef<THREE.Mesh>(null);
  const fireballMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const shockwaveRingRef = useRef<THREE.Mesh>(null);
  const shockwaveMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Warning reticle phase
    const isWarning = bomb.state === 'WARNING' || bomb.state === 'DROPPING';
    if (warningGroupRef.current) {
      warningGroupRef.current.visible = isWarning;
      if (isWarning && warningRingRef.current) {
        const pulse = 1.0 + Math.sin(t * 18.0) * 0.14;
        warningRingRef.current.scale.set(pulse, pulse, 1.0);
      }
    }

    // 2. High-speed atomic missile descent
    const isDropping = bomb.state === 'DROPPING';
    if (missileGroupRef.current) {
      missileGroupRef.current.visible = isDropping;
      if (isDropping) {
        missileGroupRef.current.position.y = bomb.currentPos[1];
        missileGroupRef.current.rotation.y = t * 16.0;
      }
    }

    // 3. Detonation fireball and shockwave
    const isExploded = bomb.state === 'EXPLODED';
    if (explosionGroupRef.current) {
      explosionGroupRef.current.visible = isExploded;
      if (isExploded) {
        const p = bomb.explosionProgress;
        const fScale = bomb.blastRadius * Math.min(1.6, 0.25 + p * 1.35);
        if (fireballMeshRef.current) {
          fireballMeshRef.current.scale.set(fScale, fScale, fScale);
          fireballMeshRef.current.position.y = Math.max(0.1, p * 0.9);
        }
        if (fireballMatRef.current) {
          fireballMatRef.current.opacity = Math.max(0, 0.95 - p * 0.95);
          fireballMatRef.current.emissiveIntensity = 3.5 * (1 - p);
        }
        if (shockwaveRingRef.current) {
          const sScale = Math.min(2.8, 0.4 + p * 2.2);
          shockwaveRingRef.current.scale.set(sScale, sScale, 1.0);
        }
        if (shockwaveMatRef.current) {
          shockwaveMatRef.current.opacity = Math.max(0, 0.85 - p * 0.85);
        }
        if (flashLightRef.current) {
          flashLightRef.current.intensity = Math.max(0, 14.0 * (1 - p));
        }
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[bomb.targetPos[0], 0, bomb.targetPos[2]]}>
      {/* 1. Ground Airstrike Warning Reticle (Clean crisp red target circle ring only - no shadows / blurry decal) */}
      <group ref={warningGroupRef} visible={false} position={[0, 0.02, 0]}>
        {/* Crisp Pure Red Target Ring */}
        <mesh ref={warningRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[bomb.blastRadius * 0.93, bomb.blastRadius, 64]} />
          <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 2. Prominent High-Velocity Dropping Atomic Missile Model from Sky */}
      <group
        ref={missileGroupRef}
        visible={false}
        position={[0, 12, 0]}
        scale={[1.35, 1.35, 1.35]}
        rotation={[Math.PI, 0, 0]} // Pointing nose-down to ground
      >
        {/* Dynamic Warning Beacon Light on Missile itself */}
        <pointLight color="#f97316" intensity={5.0} distance={6.0} position={[0, 0, 0]} />

        {/* Heavy Iron Core Rocket Fuselage */}
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.32, 1.3, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Crimson Pointed Warhead Nose Cone */}
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.26, 0.65, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#b91c1c"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* Nuclear Hazard Yellow Warning Stripe Bands */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 16]} />
          <meshStandardMaterial
            color="#facc15"
            roughness={0.4}
            emissive="#facc15"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.16, 16]} />
          <meshStandardMaterial
            color="#facc15"
            roughness={0.4}
            emissive="#facc15"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* 4 Large Stabilizer Tail Fins */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.38, -0.55, Math.cos(angle) * 0.38]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.08, 0.45, 0.35]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
          </mesh>
        ))}

        {/* Blazing Supersonic Exhaust Jet Flames & Trail (Pointing backwards / upwards) */}
        <mesh position={[0, -1.2, 0]}>
          <coneGeometry args={[0.22, 1.4, 12]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0, -1.6, 0]}>
          <coneGeometry args={[0.36, 2.0, 12]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* 3. Detonation Fireball & Shockwave */}
      <group ref={explosionGroupRef} visible={false} position={[0, 0.05, 0]}>
        {/* Expanding Plasma Fireball Dome */}
        <mesh ref={fireballMeshRef} position={[0, 0.2, 0]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            ref={fireballMatRef}
            color="#ff4500"
            emissive="#f97316"
            emissiveIntensity={3.5}
            transparent
            opacity={0.95}
            roughness={0.2}
          />
        </mesh>

        {/* Ground Expanding Shockwave Ring */}
        <mesh ref={shockwaveRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial
            ref={shockwaveMatRef}
            color="#fbbf24"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Flash Light */}
        <pointLight
          ref={flashLightRef}
          color="#ffedd5"
          intensity={14.0}
          distance={8.0}
          position={[0, 1.2, 0]}
        />
      </group>
    </group>
  );
}

/**
 * Helper to generate a crisp 256x256 circular icon texture for the 3D billboard sprite
 */
function createCrateIconTexture(icon: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Glowing radial medallion aura
  const grad = ctx.createRadialGradient(128, 128, 50, 128, 128, 120);
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.95)'); // Emerald center
  grad.addColorStop(0.7, 'rgba(6, 78, 59, 0.92)'); // Deep emerald
  grad.addColorStop(1, 'rgba(4, 120, 87, 0.85)');

  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Thick Gilded Gold Rim
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#fbbf24';
  ctx.stroke();

  // Inner subtle neon highlight ring
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#a7f3d0';
  ctx.stroke();

  // Crisp Centered Emoji Icon (Picture only - No English text as requested!)
  ctx.font = '112px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 128, 138);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * 3D Falling Crate with Silk Parachute & High-Contrast 3D Billboard Sprite Icon
 * Descends in plain sight from y = 3.2 down onto the 5 horizontal pedestals!
 */
function ConceptArtCrateItem({
  crate,
  meshRef,
  onClick,
}: {
  crate: FallingCrate;
  meshRef: (el: THREE.Group | null) => void;
  onClick: () => void;
}) {
  const iconTexture = useMemo(() => createCrateIconTexture(crate.icon), [crate.icon]);

  return (
    <group ref={meshRef} position={crate.currentPos}>
      {/* 1. Buoyant Festival Balloons Cluster while descending (Does NOT cover the icon!) */}
      {!crate.hasLanded && !crate.heldBy && (
        <group position={[0, 1.48, 0]}>
          {/* Cluster of 4 Shiny Colorful Balloons */}
          {/* Balloon 1: Vibrant Rose Pink */}
          <group position={[-0.18, 0.15, -0.06]}>
            <mesh castShadow scale={[1, 1.25, 1]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.15} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.27, 0]}>
              <coneGeometry args={[0.04, 0.06, 8]} />
              <meshStandardMaterial color="#e11d48" roughness={0.2} />
            </mesh>
          </group>

          {/* Balloon 2: Sky Cyan Blue */}
          <group position={[0.18, 0.2, 0.04]}>
            <mesh castShadow scale={[1, 1.25, 1]}>
              <sphereGeometry args={[0.23, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.15} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <coneGeometry args={[0.04, 0.06, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.2} />
            </mesh>
          </group>

          {/* Balloon 3: Shimmering Gold Yellow */}
          <group position={[0.0, 0.38, -0.05]}>
            <mesh castShadow scale={[1, 1.25, 1]}>
              <sphereGeometry args={[0.21, 16, 16]} />
              <meshStandardMaterial color="#facc15" roughness={0.15} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.26, 0]}>
              <coneGeometry args={[0.04, 0.06, 8]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.2} />
            </mesh>
          </group>

          {/* Balloon 4: Emerald Green */}
          <group position={[-0.04, -0.02, 0.16]}>
            <mesh castShadow scale={[1, 1.25, 1]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#10b981" roughness={0.15} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <coneGeometry args={[0.04, 0.06, 8]} />
              <meshStandardMaterial color="#059669" roughness={0.2} />
            </mesh>
          </group>

          {/* Slender Golden Balloon Strings connecting balloons to crate top corners */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    // String 1 to front-left
                    -0.18, -0.12, -0.06, -0.25, -1.05, -0.25,
                    // String 2 to front-right
                    0.18, -0.08, 0.04, 0.25, -1.05, 0.25,
                    // String 3 to back-left
                    0.0, 0.12, -0.05, -0.25, -1.05, 0.25,
                    // String 4 to back-right
                    -0.04, -0.28, 0.16, 0.25, -1.05, -0.25,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#fbbf24" opacity={0.85} transparent />
          </lineSegments>
        </group>
      )}

      {/* 2. Stylized Wooden Treasure Crate with Gilded Gold Brackets */}
      <mesh
        position={[0, 0.28, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <boxGeometry args={[0.6, 0.55, 0.6]} />
        <meshStandardMaterial color="#92400e" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Golden Corner Brackets & Reinforcements */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.63, 0.58, 0.63]} />
        <meshStandardMaterial color="#fbbf24" wireframe roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Front Glowing Rune Gem */}
      <mesh position={[0, 0.28, 0.32]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color={crate.isCorrect ? '#34d399' : '#f59e0b'}
          emissive={crate.isCorrect ? '#34d399' : '#f59e0b'}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 3. High-Contrast WebGL Billboard Sprite Medallion (Guaranteed 100% visible, no text, picture only!) */}
      <sprite
        position={[0, 0.95, 0]}
        scale={[1.15, 1.15, 1.15]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <spriteMaterial map={iconTexture} transparent depthWrite={false} />
      </sprite>

      {/* Ground Landing Aura Ring beneath crate on pedestal */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.65, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/**
 * 3D Stickman Avatar on Arena
 */
const ArenaAvatar = React.forwardRef<
  THREE.Group,
  {
    skinId: string;
    accentColor: string;
    isStunned: boolean;
    name: string;
    isP1: boolean;
    hasHeldCrate: boolean;
    animStateRef: React.MutableRefObject<'IDLE' | 'RUN' | 'HOLD_ITEM'>;
  }
>(function ArenaAvatar(
  { skinId, accentColor, isStunned, name, isP1, hasHeldCrate, animStateRef },
  ref
) {
  const meshGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const parent = (ref as React.MutableRefObject<THREE.Group | null>)?.current;
    if (!parent) return;
    if (meshGroupRef.current) disposeObject3D(meshGroupRef.current);

    const bodyGroup = buildBaseBodyMesh(
      'UNISEX',
      [],
      skinId,
      hasHeldCrate ? 'prop_champion_trophy' : undefined,
      hasHeldCrate
    );
    const faceGroup = buildHairMesh('face_chad_smirk', accentColor);
    const wingsGroup = buildAccessoryMesh(
      isP1 ? 'acc_cyber_photon_wings' : 'acc_wings_demon_dark',
      accentColor
    );

    bodyGroup.add(faceGroup);
    bodyGroup.add(wingsGroup);

    meshGroupRef.current = bodyGroup;
    parent.add(bodyGroup);

    return () => {
      if (meshGroupRef.current) disposeObject3D(meshGroupRef.current);
    };
  }, [skinId, accentColor, hasHeldCrate, isP1, ref]);

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    const g = meshGroupRef.current;

    const leftLeg = g.getObjectByName('LeftLegGroup') as THREE.Group | undefined;
    const rightLeg = g.getObjectByName('RightLegGroup') as THREE.Group | undefined;
    const leftArm = g.getObjectByName('LeftArmGroup') as THREE.Group | undefined;
    const rightArm = g.getObjectByName('RightArmGroup') as THREE.Group | undefined;

    if (isStunned) {
      // Lie flat and motionless on the turf for 3 seconds ("nằm bất động 3s")
      g.position.y = 0.08;
      g.rotation.x = -Math.PI / 2; // Flat on back/floor
      g.rotation.z = 0;
      g.rotation.y = 0;

      if (leftLeg) {
        leftLeg.rotation.x = 0;
        leftLeg.rotation.z = 0.25;
      }
      if (rightLeg) {
        rightLeg.rotation.x = 0;
        rightLeg.rotation.z = -0.25;
      }
      if (leftArm) {
        leftArm.rotation.x = 0;
        leftArm.rotation.z = 1.35;
      }
      if (rightArm) {
        rightArm.rotation.x = 0;
        rightArm.rotation.z = -1.35;
      }
    } else if (animStateRef.current === 'RUN') {
      const runFreq = hasHeldCrate ? 7.5 : 9.5;
      const legSwing = Math.sin(t * runFreq) * (hasHeldCrate ? 0.55 : 0.65);
      const armSwing = Math.sin(t * runFreq) * 0.5;

      g.position.y = Math.abs(Math.sin(t * runFreq)) * 0.025;
      g.rotation.x = hasHeldCrate ? 0.1 : 0.16;
      g.rotation.z = 0;

      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;

      if (!hasHeldCrate) {
        if (leftArm) leftArm.rotation.x = -armSwing;
        if (rightArm) rightArm.rotation.x = armSwing;
      }
    } else if (animStateRef.current === 'HOLD_ITEM' || hasHeldCrate) {
      g.position.y = Math.sin(t * 2.5) * 0.015;
      g.rotation.x = 0;
      g.rotation.z = 0;
      if (leftLeg) leftLeg.rotation.x = 0;
      if (rightLeg) rightLeg.rotation.x = 0;
      if (leftArm) {
        leftArm.rotation.x = -1.2;
        leftArm.rotation.z = 0.3;
      }
      if (rightArm) {
        rightArm.rotation.x = -1.2;
        rightArm.rotation.z = -0.3;
      }
    } else {
      g.position.y = Math.sin(t * 2.2) * 0.015;
      g.rotation.x = 0;
      g.rotation.z = 0;
      if (leftLeg) leftLeg.rotation.x = 0;
      if (rightLeg) rightLeg.rotation.x = 0;
      if (leftArm) {
        leftArm.rotation.x = 0;
        leftArm.rotation.z = Math.sin(t * 2.2) * 0.05 + 0.1;
      }
      if (rightArm) {
        rightArm.rotation.x = 0;
        rightArm.rotation.z = -Math.sin(t * 2.2) * 0.05 - 0.1;
      }
    }
  });

  return (
    <group ref={ref} scale={[0.55, 0.55, 0.55]}>
      <Html position={[0, isStunned ? 0.75 : 1.45, 0]} center distanceFactor={8.5}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          {isStunned && (
            <div className="text-yellow-300 text-[11px] font-black tracking-wider flex items-center gap-1 bg-black/90 px-3 py-1 rounded-full border border-yellow-400 mb-1 animate-pulse shadow-xl">
              <span>💫</span> BẤT ĐỘNG (3S)!
            </div>
          )}
          <div
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border backdrop-blur-md shadow-md ${
              isP1
                ? 'bg-slate-950/95 border-emerald-400 text-emerald-300'
                : 'bg-white/95 border-rose-400 text-rose-700'
            }`}
          >
            {name}
          </div>
        </div>
      </Html>
    </group>
  );
});

/**
 * Main 3D Scene Controller
 */
function SkyBlasterArenaScene() {
  const {
    activeCrates,
    activeHazards,
    activeNuclearBombs,
    gateOpen,
    player1,
    player2,
    stage,
    mode,
    botDifficulty,
    currentRoundIndex,
    pickupCrate,
    deliverCrate,
    triggerHazard,
    triggerNuclearBlastHit,
    setStage,
    setGateOpen,
    stepSimulation,
  } = useSkyBlasterStore();

  const p1GroupRef = useRef<THREE.Group>(null);
  const p2GroupRef = useRef<THREE.Group>(null);
  const crateMeshMap = useRef<Record<string, THREE.Group | null>>({});

  const p1PosRef = useRef<[number, number, number]>([...P1_START_POS]);
  const p2PosRef = useRef<[number, number, number]>([...P2_START_POS]);
  const p1RotYRef = useRef(0);
  const p2RotYRef = useRef(0);
  const p1TargetRef = useRef<[number, number, number] | null>(null);

  const p1AnimStateRef = useRef<'IDLE' | 'RUN' | 'HOLD_ITEM'>('IDLE');
  const p2AnimStateRef = useRef<'IDLE' | 'RUN' | 'HOLD_ITEM'>('IDLE');

  const hasLeftGateP1Ref = useRef(false);
  const hasLeftGateP2Ref = useRef(false);

  // Local nuclear airstrikes tracking for continuous scheduled bombardments across round
  const localNuclearBombsRef = useRef<FallingNuclearBomb[]>([]);
  const roundElapsedSecondsRef = useRef(0);

  // Local crates tracking for smooth descending animation in full view
  const localCratesRef = useRef<
    {
      id: string;
      isCorrect: boolean;
      initialPos: [number, number, number];
      targetPos: [number, number, number];
      currentPos: [number, number, number];
      fallProgress: number;
      hasLanded: boolean;
      heldBy: 'P1' | 'P2' | null;
    }[]
  >([]);

  // 1. Reset player positions & nuclear airstrikes ONLY when round index changes (New round started)
  useEffect(() => {
    p1PosRef.current = [...P1_START_POS];
    p2PosRef.current = [...P2_START_POS];
    p1RotYRef.current = 0;
    p2RotYRef.current = 0;
    p1TargetRef.current = null;
    p1AnimStateRef.current = 'IDLE';
    p2AnimStateRef.current = 'IDLE';
    hasLeftGateP1Ref.current = false;
    hasLeftGateP2Ref.current = false;
    roundElapsedSecondsRef.current = 0;
    localNuclearBombsRef.current = activeNuclearBombs.map((b) => ({
      ...b,
      currentPos: [b.targetPos[0], 7.5, b.targetPos[2]],
      state: 'PENDING',
      fallProgress: 0,
      explosionProgress: 0,
    }));
  }, [currentRoundIndex, activeNuclearBombs]);

  // 2. Synchronize crates without touching player coordinates!
  useEffect(() => {
    const currentIds = localCratesRef.current.map((c) => c.id).join(',');
    const newIds = activeCrates.map((c) => c.id).join(',');

    if (currentIds !== newIds || localCratesRef.current.length === 0) {
      localCratesRef.current = activeCrates.map((c) => ({
        id: c.id,
        isCorrect: c.isCorrect,
        initialPos: [c.targetPos[0], 3.2, c.targetPos[2]],
        targetPos: [...c.targetPos],
        currentPos: [c.targetPos[0], c.hasLanded ? 0.05 : 3.2, c.targetPos[2]],
        fallProgress: c.hasLanded ? 1.0 : 0,
        hasLanded: c.hasLanded,
        heldBy: c.heldBy,
      }));
    } else {
      activeCrates.forEach((ac) => {
        const lc = localCratesRef.current.find((c) => c.id === ac.id);
        if (lc) {
          lc.heldBy = ac.heldBy;
          if (ac.hasLanded) lc.hasLanded = true;
        }
      });
    }
  }, [activeCrates, currentRoundIndex]);

  const keysRef = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleFloorClick = (point: [number, number, number]) => {
    const p1 = useSkyBlasterStore.getState().player1;
    if (p1.isStunned) return;
    p1TargetRef.current = [point[0], 0, point[2]];
  };

  const handleCrateClick = (crateId: string) => {
    const targetC = localCratesRef.current.find((c) => c.id === crateId);
    if (targetC) {
      handleFloorClick(targetC.currentPos);
    }
  };

  const checkerboardTexture = useMemo(() => createCheckerboardTurfTexture(), []);

  useFrame((_, delta) => {
    stepSimulation(delta);

    const safeDelta = Math.min(delta, 0.05);
    const storeState = useSkyBlasterStore.getState();
    const isP1Stunned = storeState.player1.isStunned;
    const isP2Stunned = storeState.player2.isStunned;
    const p1Held = storeState.player1.heldCrate;
    const p2Held = storeState.player2.heldCrate;
    const isGateOpen = storeState.gateOpen;

    // 1. CLEAR, VISIBLE PARACHUTE DESCENT FROM y = 3.2 DOWN TO y = 0.05 ONTO PEDESTALS
    if (stage === 'CRATES_FALLING') {
      let anyLanded = false;
      localCratesRef.current.forEach((c) => {
        if (!c.hasLanded) {
          // Smooth visible descent over ~2.8 seconds
          c.fallProgress = Math.min(1.0, c.fallProgress + safeDelta * (1.0 / 2.8));
          c.currentPos[1] = (1 - c.fallProgress) * 3.2 + c.fallProgress * 0.05;
          // Gentle parachute swaying
          c.currentPos[0] = c.targetPos[0] + Math.sin(c.fallProgress * Math.PI * 4.0) * 0.12;
          c.currentPos[2] = c.targetPos[2];

          if (c.fallProgress >= 1.0) {
            c.hasLanded = true;
            anyLanded = true;
          }
        }
      });

      if (anyLanded && !isGateOpen) {
        setStage('CHASE_AND_COLLECT');
        setGateOpen(true);
      }
    }

    const isP1InPuddle = activeHazards.some(
      (h) =>
        h.type === 'SLOW_PUDDLE' &&
        Math.hypot(p1PosRef.current[0] - h.position[0], p1PosRef.current[2] - h.position[2]) <
          h.radius
    );

    const isP2InPuddle = activeHazards.some(
      (h) =>
        h.type === 'SLOW_PUDDLE' &&
        Math.hypot(p2PosRef.current[0] - h.position[0], p2PosRef.current[2] - h.position[2]) <
          h.radius
    );

    const distP1FromGate = Math.hypot(
      p1PosRef.current[0] - START_GATE_POS[0],
      p1PosRef.current[2] - START_GATE_POS[2]
    );
    if (distP1FromGate > 1.8) {
      hasLeftGateP1Ref.current = true;
    }

    const distP2FromGate = Math.hypot(
      p2PosRef.current[0] - START_GATE_POS[0],
      p2PosRef.current[2] - START_GATE_POS[2]
    );
    if (distP2FromGate > 1.8) {
      hasLeftGateP2Ref.current = true;
    }

    if (!isP1Stunned && stage === 'CHASE_AND_COLLECT') {
      const k = keysRef.current;
      const isSprint = Boolean(k['shift'] || k['shiftleft'] || k['shiftright']);

      // Balanced movement speed: slightly faster pacing while keeping good round length
      let moveSpeed = p1Held ? (isSprint ? 1.4 : 1.15) : isSprint ? 1.85 : 1.45;

      if (isP1InPuddle) {
        moveSpeed *= 0.5;
      }

      let dx = 0;
      let dz = 0;
      if (k['w'] || k['arrowup'] || k['keyw']) dz -= 1;
      if (k['s'] || k['arrowdown'] || k['keys']) dz += 1;
      if (k['a'] || k['arrowleft'] || k['keya']) dx -= 1;
      if (k['d'] || k['arrowright'] || k['keyd']) dx += 1;

      if (dx !== 0 || dz !== 0) {
        p1TargetRef.current = null;
        const len = Math.hypot(dx, dz);
        const vx = (dx / len) * moveSpeed * safeDelta;
        const vz = (dz / len) * moveSpeed * safeDelta;

        p1PosRef.current[0] = Math.max(-7.1, Math.min(7.1, p1PosRef.current[0] + vx));
        const minZ = isGateOpen ? -4.5 : 3.8;
        p1PosRef.current[2] = Math.max(minZ, Math.min(5.1, p1PosRef.current[2] + vz));
        p1RotYRef.current = Math.atan2(dx, dz);
        p1AnimStateRef.current = p1Held ? 'HOLD_ITEM' : 'RUN';
      } else if (p1TargetRef.current) {
        const tx = p1TargetRef.current[0] - p1PosRef.current[0];
        const tz = p1TargetRef.current[2] - p1PosRef.current[2];
        const dist = Math.hypot(tx, tz);

        if (dist > 0.1) {
          const moveStep = Math.min(dist, moveSpeed * safeDelta);
          p1PosRef.current[0] += (tx / dist) * moveStep;
          p1PosRef.current[2] += (tz / dist) * moveStep;
          if (!isGateOpen && p1PosRef.current[2] < 3.8) {
            p1PosRef.current[2] = 3.8;
          }
          p1RotYRef.current = Math.atan2(tx, tz);
          p1AnimStateRef.current = p1Held ? 'HOLD_ITEM' : 'RUN';
        } else {
          p1TargetRef.current = null;
          p1AnimStateRef.current = p1Held ? 'HOLD_ITEM' : 'IDLE';
        }
      } else {
        p1AnimStateRef.current = p1Held ? 'HOLD_ITEM' : 'IDLE';
      }
    } else {
      p1AnimStateRef.current = 'IDLE';
    }

    if (mode === 'BOT' && !isP2Stunned && isGateOpen && stage === 'CHASE_AND_COLLECT') {
      let botSpeed =
        botDifficulty === 'HARD'
          ? p2Held
            ? 1.1
            : 1.35
          : botDifficulty === 'MEDIUM'
          ? p2Held
            ? 0.95
            : 1.15
          : p2Held
          ? 0.75
          : 0.95;

      if (isP2InPuddle) {
        botSpeed *= 0.5;
      }

      if (p2Held) {
        const tx = START_GATE_POS[0] - p2PosRef.current[0];
        const tz = START_GATE_POS[2] - p2PosRef.current[2];
        const dist = Math.hypot(tx, tz);

        if (dist > 0.1) {
          const step = Math.min(dist, botSpeed * safeDelta);
          p2PosRef.current[0] += (tx / dist) * step;
          p2PosRef.current[2] += (tz / dist) * step;
          p2RotYRef.current = Math.atan2(tx, tz);
          p2AnimStateRef.current = 'HOLD_ITEM';
        }
      } else {
        const targetCrate =
          localCratesRef.current.find(
            (c) =>
              !c.heldBy &&
              c.hasLanded &&
              (botDifficulty === 'HARD' ? c.isCorrect : true)
          ) || localCratesRef.current.find((c) => !c.heldBy && c.hasLanded);

        if (targetCrate) {
          const tx = targetCrate.currentPos[0] - p2PosRef.current[0];
          const tz = targetCrate.currentPos[2] - p2PosRef.current[2];
          const dist = Math.hypot(tx, tz);

          if (dist > 0.1) {
            const step = Math.min(dist, botSpeed * safeDelta);
            p2PosRef.current[0] += (tx / dist) * step;
            p2PosRef.current[2] += (tz / dist) * step;
            p2RotYRef.current = Math.atan2(tx, tz);
            p2AnimStateRef.current = 'RUN';
          }
        } else {
          p2AnimStateRef.current = 'IDLE';
        }
      }
    } else {
      p2AnimStateRef.current = 'IDLE';
    }

    activeHazards.forEach((h) => {
      if (h.type !== 'STUN_BOMB' || h.triggered) return;

      const d1 = Math.hypot(p1PosRef.current[0] - h.position[0], p1PosRef.current[2] - h.position[2]);
      if (d1 < h.radius && !isP1Stunned) {
        triggerHazard(h.id, 'P1', p1PosRef.current);
      }

      const d2 = Math.hypot(p2PosRef.current[0] - h.position[0], p2PosRef.current[2] - h.position[2]);
      if (d2 < h.radius && !isP2Stunned) {
        triggerHazard(h.id, 'P2', p2PosRef.current);
      }
    });

    // 2. CONTINUOUS NUCLEAR AIRSTRIKES SCHEDULED THROUGHOUT THE 45s ROUND (>= 10 BOMBS)
    if (stage === 'CHASE_AND_COLLECT') {
      roundElapsedSecondsRef.current += safeDelta;
      const elapsed = roundElapsedSecondsRef.current;

      localNuclearBombsRef.current.forEach((bomb) => {
        // Warning phase (0.85s before impact)
        if (bomb.state === 'PENDING') {
          if (elapsed >= bomb.dropTimeSeconds - 0.85) {
            bomb.state = 'WARNING';
            skyBlasterAudio.playNuclearWhistle();
          }
        } else if (bomb.state === 'WARNING') {
          // Drop phase starts 0.38s before impact (supersonic lightning dive!)
          if (elapsed >= bomb.dropTimeSeconds - 0.38) {
            bomb.state = 'DROPPING';
            bomb.fallProgress = 0;
            bomb.currentPos[1] = 12.0;
          }
        } else if (bomb.state === 'DROPPING') {
          // Lightning-fast atomic missile dive from sky (y: 12.0 -> 0.05 in 0.38s)
          bomb.fallProgress = Math.min(1.0, bomb.fallProgress + safeDelta * (1.0 / 0.38));
          // Ease-in gravitational acceleration curve
          const easeIn = Math.pow(bomb.fallProgress, 2.0);
          bomb.currentPos[1] = (1 - easeIn) * 12.0 + easeIn * 0.05;

          if (bomb.fallProgress >= 1.0) {
            bomb.state = 'EXPLODED';
            bomb.explosionProgress = 0;
            skyBlasterAudio.playNuclearDetonation();

            // Knockback check for Player 1: "văng về lại mấy mét"
            const d1 = Math.hypot(
              p1PosRef.current[0] - bomb.targetPos[0],
              p1PosRef.current[2] - bomb.targetPos[2]
            );
            if (d1 < bomb.blastRadius) {
              let dx1 = p1PosRef.current[0] - bomb.targetPos[0];
              let dz1 = p1PosRef.current[2] - bomb.targetPos[2];
              if (d1 < 0.1) {
                dx1 = 0;
                dz1 = 1;
              } else {
                dx1 /= d1;
                dz1 /= d1;
              }
              // Knock back 2.8m towards the start line (+Z direction)
              const backwardZ = Math.max(0.75, dz1);
              p1PosRef.current[0] = Math.max(-7.0, Math.min(7.0, p1PosRef.current[0] + dx1 * 1.6));
              p1PosRef.current[2] = Math.min(4.8, p1PosRef.current[2] + backwardZ * 2.8);
              p1TargetRef.current = null;
              triggerNuclearBlastHit('P1', p1PosRef.current);
            }

            // Knockback check for Player 2 (Bot)
            const d2 = Math.hypot(
              p2PosRef.current[0] - bomb.targetPos[0],
              p2PosRef.current[2] - bomb.targetPos[2]
            );
            if (d2 < bomb.blastRadius) {
              let dx2 = p2PosRef.current[0] - bomb.targetPos[0];
              let dz2 = p2PosRef.current[2] - bomb.targetPos[2];
              if (d2 < 0.1) {
                dx2 = 0;
                dz2 = 1;
              } else {
                dx2 /= d2;
                dz2 /= d2;
              }
              const backwardZ2 = Math.max(0.75, dz2);
              p2PosRef.current[0] = Math.max(-7.0, Math.min(7.0, p2PosRef.current[0] + dx2 * 1.6));
              p2PosRef.current[2] = Math.min(4.8, p2PosRef.current[2] + backwardZ2 * 2.8);
              triggerNuclearBlastHit('P2', p2PosRef.current);
            }
          }
        } else if (bomb.state === 'EXPLODED') {
          // Fireball expands and fades over ~0.85s
          bomb.explosionProgress = Math.min(1.0, bomb.explosionProgress + safeDelta * (1.0 / 0.85));
          if (bomb.explosionProgress >= 1.0) {
            bomb.state = 'FINISHED';
          }
        }
      });
    }

    const pickupRadius = 0.85;
    localCratesRef.current.forEach((crate) => {
      if (crate.heldBy) return;

      if (!p1Held && !isP1Stunned) {
        const d1 = Math.hypot(
          p1PosRef.current[0] - crate.currentPos[0],
          p1PosRef.current[2] - crate.currentPos[2]
        );
        if (d1 < pickupRadius) {
          crate.heldBy = 'P1';
          pickupCrate('P1', crate.id);
        }
      }

      if (!p2Held && !isP2Stunned && !crate.heldBy) {
        const d2 = Math.hypot(
          p2PosRef.current[0] - crate.currentPos[0],
          p2PosRef.current[2] - crate.currentPos[2]
        );
        if (d2 < pickupRadius) {
          crate.heldBy = 'P2';
          pickupCrate('P2', crate.id);
        }
      }
    });

    const depositRadius = 1.3;

    if (stage === 'CHASE_AND_COLLECT') {
      if (p1Held && hasLeftGateP1Ref.current) {
        if (distP1FromGate < depositRadius) {
          hasLeftGateP1Ref.current = false;
          deliverCrate('P1', p1PosRef.current);
        }
      }

      if (p2Held && hasLeftGateP2Ref.current) {
        if (distP2FromGate < depositRadius) {
          hasLeftGateP2Ref.current = false;
          deliverCrate('P2', p2PosRef.current);
        }
      }
    }

    if (p1GroupRef.current) {
      p1GroupRef.current.position.set(p1PosRef.current[0], 0, p1PosRef.current[2]);
      p1GroupRef.current.rotation.y = p1RotYRef.current;
    }
    if (p2GroupRef.current) {
      p2GroupRef.current.position.set(p2PosRef.current[0], 0, p2PosRef.current[2]);
      p2GroupRef.current.rotation.y = p2RotYRef.current;
    }

    localCratesRef.current.forEach((c) => {
      const m = crateMeshMap.current[c.id];
      if (!m) return;

      if (c.heldBy === 'P1') {
        m.position.set(p1PosRef.current[0], 0.45, p1PosRef.current[2] + 0.2);
      } else if (c.heldBy === 'P2') {
        m.position.set(p2PosRef.current[0], 0.45, p2PosRef.current[2] + 0.2);
      } else {
        m.position.set(c.currentPos[0], c.currentPos[1], c.currentPos[2]);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={1.25} color="#f0fdf4" />
      <directionalLight
        position={[6, 14, 6]}
        intensity={2.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.8} color="#bae6fd" />

      {/* Main Checkerboard Turf Floor */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          handleFloorClick([e.point.x, 0, e.point.z]);
        }}
      >
        <planeGeometry args={[15.0, 11.2]} />
        <meshStandardMaterial
          map={checkerboardTexture}
          roughness={0.7}
          metalness={0.05}
          color="#ffffff"
        />
      </mesh>

      {/* 5 Landing Pedestals Aligned Horizontally at Far End (z = -3.8) */}
      <FarEndLandingPedestals />

      {/* Royal Floral Archway & Start Line where both players start together */}
      <RoyalFloralArchwayGate gateOpen={gateOpen} />

      {/* Ancient Carved Jade Relief Walls with Golden Neon Trim */}
      <AncientJadeReliefWalls />

      {/* Clean Scenic Backdrop without cannons or clutter */}
      <CleanScenicGardenBackdrop />

      {/* Active Midfield Hazards (Pure 3D - No Floating Title Badges) */}
      {activeHazards.map((hazard) =>
        hazard.type === 'STUN_BOMB' ? (
          <SpikyMineHazard key={hazard.id} hazard={hazard} />
        ) : (
          <NaturalMudPuddleHazard key={hazard.id} hazard={hazard} />
        )
      )}

      {/* Falling Nuclear Airstrike Bombs (>= 10 falling continuously across round) */}
      {localNuclearBombsRef.current.map((bomb) => (
        <NuclearAirstrikeBomb3D key={bomb.id} bomb={bomb} />
      ))}

      {/* 5 Falling Crates with Camouflage Parachutes descending onto the 5 pedestals in plain view! */}
      {activeCrates.map((crate) => (
        <ConceptArtCrateItem
          key={crate.id}
          crate={crate}
          meshRef={(el) => {
            crateMeshMap.current[crate.id] = el;
          }}
          onClick={() => handleCrateClick(crate.id)}
        />
      ))}

      {/* Player 1 (You - Black Stickman) */}
      <ArenaAvatar
        ref={p1GroupRef}
        skinId={player1.skinId}
        accentColor={player1.accentColor}
        isStunned={player1.isStunned}
        name={player1.name}
        isP1={true}
        hasHeldCrate={Boolean(player1.heldCrate)}
        animStateRef={p1AnimStateRef}
      />

      {/* Player 2 (Bot - White Stickman) */}
      <ArenaAvatar
        ref={p2GroupRef}
        skinId={player2.skinId}
        accentColor={player2.accentColor}
        isStunned={player2.isStunned}
        name={player2.name}
        isP1={false}
        hasHeldCrate={Boolean(player2.heldCrate)}
        animStateRef={p2AnimStateRef}
      />

      {/* Camera angle framing the start line at bottom, field in middle, and 5 pedestals & sky at top */}
      <OrbitControls
        target={[0, 0, 0]}
        minDistance={5.0}
        maxDistance={18.0}
        minPolarAngle={Math.PI / 4.8}
        maxPolarAngle={Math.PI / 2.3}
        enablePan={false}
      />
    </>
  );
}

/**
 * Main 3D Sky Blaster Arena Component
 */
export const SkyBlaster3DArena: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div className={`relative overflow-hidden select-none bg-sky-200 ${className}`}>
      <Canvas
        camera={{ position: [0, 8.5, 7.5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#7dd3fc']} />
        <fog attach="fog" args={['#bae6fd', 16, 32]} />
        <SkyBlasterArenaScene />
      </Canvas>
    </div>
  );
};

export default SkyBlaster3DArena;
