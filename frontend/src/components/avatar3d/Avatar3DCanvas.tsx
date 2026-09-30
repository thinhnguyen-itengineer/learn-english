import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useAvatar3DStore } from '../../services/useAvatar3DStore';
import {
  buildBaseBodyMesh,
  buildHairMesh,
  buildTopMesh,
  buildBottomMesh,
  buildShoesMesh,
  buildAccessoryMesh,
} from './Chibi3DProceduralMesh';
import { disposeObject3D } from './ChibiMasterSkeleton';
import { AnimationState3D } from '../../types/avatar3d';

/**
 * Animated Modular 3D Chibi Avatar Component within R3F
 */
function ChibiAvatarRenderer({
  animationState,
  viewMode3D = 'IDLE',
  accentColor = '#00f2fe',
  hiddenSlots,
  maskedParts,
  baseBodyId,
  hairId,
  topId,
  bottomId,
  shoesId,
  accessoryId,
}: {
  animationState: AnimationState3D;
  viewMode3D?: 'IDLE' | 'RUN' | 'HOLD_ITEM';
  accentColor?: string;
  hiddenSlots: string[];
  maskedParts: string[];
  baseBodyId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryId?: string | null;
}) {
  const avatarRootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group | null>(null);
  const hairRef = useRef<THREE.Group | null>(null);
  const topRef = useRef<THREE.Group | null>(null);
  const bottomRef = useRef<THREE.Group | null>(null);
  const shoesRef = useRef<THREE.Group | null>(null);
  const accRef = useRef<THREE.Group | null>(null);

  // Determine gender from bodyId
  const gender = useMemo(() => {
    if (baseBodyId.includes('female')) return 'FEMALE';
    if (baseBodyId.includes('male')) return 'MALE';
    return 'UNISEX';
  }, [baseBodyId]);

  // Mount & Hot-swap BaseBody with Pose Stance
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (bodyRef.current) {
      disposeObject3D(bodyRef.current);
    }
    const isHolding =
      animationState === 'HOLD_ITEM' ||
      viewMode3D === 'HOLD_ITEM' ||
      Boolean(
        topId &&
          (topId.startsWith('prop_') ||
            topId.includes('hold') ||
            topId.includes('trophy') ||
            topId.includes('sword') ||
            topId.includes('wand') ||
            topId.includes('torch') ||
            topId.includes('mic') ||
            topId.includes('blaster'))
      );

    const mesh = buildBaseBodyMesh(gender, maskedParts, baseBodyId, topId, isHolding);
    bodyRef.current = mesh;
    avatarRootRef.current.add(mesh);

    return () => {
      if (bodyRef.current) disposeObject3D(bodyRef.current);
    };
  }, [baseBodyId, gender, maskedParts, topId, animationState, viewMode3D]);

  // Mount & Hot-swap Hair / Face Expression with Accent Tint
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (hairRef.current) {
      disposeObject3D(hairRef.current);
    }
    if (!hiddenSlots.includes('Slot_Hair') && hairId) {
      const mesh = buildHairMesh(hairId, accentColor);
      hairRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (hairRef.current) disposeObject3D(hairRef.current);
    };
  }, [hairId, hiddenSlots, accentColor]);

  // Mount & Hot-swap Top / Mini Game Handheld Prop with Accent Tint
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (topRef.current) {
      disposeObject3D(topRef.current);
    }
    if (!hiddenSlots.includes('Slot_Top') && topId) {
      const mesh = buildTopMesh(topId, accentColor);
      topRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (topRef.current) disposeObject3D(topRef.current);
    };
  }, [topId, hiddenSlots, accentColor]);

  // Mount & Hot-swap Bottom
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (bottomRef.current) {
      disposeObject3D(bottomRef.current);
    }
    if (!hiddenSlots.includes('Slot_Bottom') && bottomId) {
      const mesh = buildBottomMesh(bottomId);
      bottomRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (bottomRef.current) disposeObject3D(bottomRef.current);
    };
  }, [bottomId, hiddenSlots]);

  // Mount & Hot-swap Shoes
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (shoesRef.current) {
      disposeObject3D(shoesRef.current);
    }
    if (!hiddenSlots.includes('Slot_Shoes') && shoesId) {
      const mesh = buildShoesMesh(shoesId);
      shoesRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (shoesRef.current) disposeObject3D(shoesRef.current);
    };
  }, [shoesId, hiddenSlots]);

  // Mount & Hot-swap Accessory / Wings with Accent Tint
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (accRef.current) {
      disposeObject3D(accRef.current);
    }
    if (!hiddenSlots.includes('Slot_Accessory') && accessoryId) {
      const mesh = buildAccessoryMesh(accessoryId, accentColor);
      accRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (accRef.current) disposeObject3D(accRef.current);
    };
  }, [accessoryId, hiddenSlots, accentColor]);

  // Animation State Machine loop
  useFrame((state) => {
    if (!avatarRootRef.current) return;
    const t = state.clock.getElapsedTime();
    const root = avatarRootRef.current;

    const isRun = animationState === 'RUN' || viewMode3D === 'RUN';
    const isHold = animationState === 'HOLD_ITEM' || viewMode3D === 'HOLD_ITEM';

    // Limb groups for procedural running & holding
    const leftLeg = bodyRef.current?.getObjectByName('LeftLegGroup') as THREE.Group | undefined;
    const rightLeg = bodyRef.current?.getObjectByName('RightLegGroup') as THREE.Group | undefined;
    const leftArm = bodyRef.current?.getObjectByName('LeftArmGroup') as THREE.Group | undefined;
    const rightArm = bodyRef.current?.getObjectByName('RightArmGroup') as THREE.Group | undefined;

    if (isRun) {
      // 🏃 SPRINT / RUNNING MODE (Sải chân, đánh tay, thân người lao về phía trước)
      root.position.x = 0;
      root.position.y = Math.abs(Math.sin(t * 12.0)) * 0.038;
      root.rotation.x = 0.18; // Lean forward
      root.rotation.y = Math.sin(t * 6.0) * 0.12;
      root.rotation.z = Math.sin(t * 6.0) * 0.04;

      const runFreq = 12.0;
      const legSwing = Math.sin(t * runFreq) * 0.72;
      const armSwing = Math.sin(t * runFreq) * 0.65;

      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;
      if (leftArm) leftArm.rotation.x = -armSwing;

      if (rightArm) {
        const holds = Boolean(
          topId && (topId.startsWith('prop_') || topId.includes('hold') || isHold)
        );
        if (holds) {
          // Keep right arm raised with item held during sprint
          rightArm.rotation.x = 0.25 + Math.sin(t * runFreq) * 0.18;
        } else {
          rightArm.rotation.x = armSwing;
        }
      }
    } else if (isHold) {
      // ✊ HOLD ITEM MODE (Dáng đứng cầm chắc vật phẩm chuẩn bị mini-game)
      root.position.x = 0;
      root.position.y = Math.sin(t * 2.8) * 0.01;
      root.rotation.x = 0;
      root.rotation.y = 0.2 + Math.sin(t * 1.5) * 0.04; // Angle to showcase held prop
      root.rotation.z = 0;

      if (leftLeg) {
        leftLeg.rotation.x = 0;
        leftLeg.rotation.z = 0.04;
      }
      if (rightLeg) {
        rightLeg.rotation.x = 0;
        rightLeg.rotation.z = -0.04;
      }
      if (leftArm) {
        leftArm.rotation.x = 0;
        leftArm.rotation.z = 0.06;
      }
      if (rightArm) {
        rightArm.rotation.x = Math.sin(t * 2.0) * 0.03;
      }
    } else if (animationState === 'IDLE') {
      // 🧍 1 DÁNG ĐỨNG CỐ ĐỊNH CHUẨN (Fixed Balanced Idle Stance, nhịp thở nhẹ)
      root.position.x = 0;
      root.position.y = Math.sin(t * 3.0) * 0.012;
      root.rotation.x = 0;
      root.rotation.y = Math.sin(t * 0.8) * 0.06;
      root.rotation.z = 0;

      // Neutral resting limbs
      if (leftLeg) {
        leftLeg.rotation.x = 0;
        leftLeg.rotation.z = 0;
      }
      if (rightLeg) {
        rightLeg.rotation.x = 0;
        rightLeg.rotation.z = 0;
      }
      if (leftArm) {
        leftArm.rotation.x = 0;
        leftArm.rotation.z = 0;
      }
      if (rightArm) {
        rightArm.rotation.x = 0;
        rightArm.rotation.z = 0;
      }
    } else {
      // Reset limbs for other feedback states
      if (leftLeg) leftLeg.rotation.x = 0;
      if (rightLeg) rightLeg.rotation.x = 0;
      if (leftArm) leftArm.rotation.x = 0;
      if (rightArm) rightArm.rotation.x = 0;

      switch (animationState) {
        case 'THINKING':
          root.position.y = Math.sin(t * 2.0) * 0.008;
          root.rotation.y = 0.2;
          root.rotation.z = Math.sin(t * 2.5) * 0.05 + 0.12;
          root.rotation.x = 0.08;
          break;

        case 'CORRECT':
          root.position.y = Math.abs(Math.sin(t * 8.0)) * 0.12;
          root.rotation.y = Math.sin(t * 4.0) * 0.15;
          root.rotation.x = -0.05;
          break;

        case 'STREAK':
          root.position.y = Math.abs(Math.sin(t * 6.0)) * 0.18;
          root.rotation.y = t * 6.0;
          break;

        case 'CONFUSED':
          root.position.y = 0;
          root.rotation.y = Math.sin(t * 5.0) * 0.15;
          root.rotation.z = Math.sin(t * 4.0) * 0.1;
          break;

        case 'TRYON':
          root.position.y = Math.sin(t * 4.0) * 0.02;
          root.rotation.y = t * 3.5;
          break;

        case 'VICTORY':
          root.position.y = Math.abs(Math.sin(t * 7.0)) * 0.15;
          root.rotation.y = Math.sin(t * 5.0) * 0.4;
          root.rotation.z = Math.sin(t * 6.0) * 0.12;
          break;

        case 'DEFEAT':
          root.position.y = -0.06;
          root.rotation.x = 0.2;
          root.rotation.y = 0;
          root.rotation.z = Math.sin(t * 1.5) * 0.03;
          break;
      }
    }

    // Wings gentle flapping with accelerated speed while running
    if (accRef.current) {
      const leftWing = accRef.current.getObjectByName('LeftPhotonWing');
      const rightWing = accRef.current.getObjectByName('RightPhotonWing');
      if (leftWing && rightWing) {
        const flapSpeed = isRun ? 14.0 : 6.0;
        const flapAmp = isRun ? 0.42 : 0.25;
        const flap = Math.sin(t * flapSpeed) * flapAmp;
        leftWing.rotation.y = 0.3 + flap;
        rightWing.rotation.y = -0.3 - flap;
      }
    }
  });

  return <group ref={avatarRootRef} position={[0, 0, 0]} />;
}

/**
 * Zing Speed Glowing Foot Aura (Vòng tròn ma pháp phát sáng xoay dưới chân)
 */
function ZingSpeedMagicalAura() {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRuneRef = useRef<THREE.Group>(null);

  // Materials for the magical aura
  const neonCyanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        roughness: 0.1,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const neonGoldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xfeca57,
        roughness: 0.1,
        emissive: 0xfeca57,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const innerDiscMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.4;
    }
    if (innerRuneRef.current) {
      innerRuneRef.current.rotation.z -= delta * 0.6;
      const pulse = Math.sin(t * 3.0) * 0.08 + 1.0;
      innerRuneRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Soft glowing energy core disc */}
      <mesh material={innerDiscMat}>
        <circleGeometry args={[0.55, 32]} />
      </mesh>

      {/* Rotating outer rune ring with 8 diamond jewels */}
      <group ref={outerRingRef}>
        <mesh material={neonCyanMat}>
          <ringGeometry args={[0.54, 0.56, 48]} />
        </mesh>
        <mesh material={neonCyanMat}>
          <ringGeometry args={[0.46, 0.475, 48]} />
        </mesh>

        {/* 8 Diamond rune markers */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 0.51;
          return (
            <mesh
              key={i}
              material={neonGoldMat}
              position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.001]}
              rotation={[0, 0, angle + Math.PI / 4]}
            >
              <planeGeometry args={[0.032, 0.032]} />
            </mesh>
          );
        })}
      </group>

      {/* Counter-rotating inner magical hexagram / star rune */}
      <group ref={innerRuneRef}>
        <mesh material={neonGoldMat}>
          <ringGeometry args={[0.34, 0.355, 36]} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 0.28;
          return (
            <mesh
              key={i}
              material={neonCyanMat}
              position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.001]}
              rotation={[0, 0, angle]}
            >
              <coneGeometry args={[0.018, 0.07, 3]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Zing Speed Floating Sparkling Particles (Hạt sao lấp lánh bay lơ lửng quanh người)
 */
function ZingSpeedSparkles({ count = 35 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Initialize deterministic particle positions
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed1 = ((i * 137.58) % 100) / 100;
      const seed2 = ((i * 269.83) % 100) / 100;
      const seed3 = ((i * 391.27) % 100) / 100;
      return {
        radius: 0.22 + seed1 * 0.45,
        angle: seed2 * Math.PI * 2,
        speedY: 0.12 + seed3 * 0.22,
        baseY: seed1 * 1.1,
        size: 0.012 + seed2 * 0.016,
        rotSpeed: (seed3 - 0.5) * 3,
        color: i % 3 === 0 ? 0xfeca57 : 0x00f2fe,
        phase: seed1 * Math.PI * 2,
      };
    });
  }, [count]);

  const starGeo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0);
    geo.scale(1, 1.3, 0.3);
    return geo;
  }, []);

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfeca57,
        emissiveIntensity: 0.95,
        roughness: 0.1,
      }),
    []
  );

  const cyanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.95,
        roughness: 0.1,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;

      // Drift upward and loop back
      let y = p.baseY + t * p.speedY;
      y = (y % 1.25) + 0.05;

      // Slight wobble
      const currentAngle = p.angle + Math.sin(t * 0.8 + p.phase) * 0.2;
      const x = Math.cos(currentAngle) * p.radius;
      const z = Math.sin(currentAngle) * p.radius;

      child.position.set(x, y, z);
      child.rotation.y += delta * p.rotSpeed;
      child.rotation.z += delta * p.rotSpeed * 0.8;

      // Twinkling scale
      const twinkle = Math.sin(t * 4.5 + p.phase) * 0.35 + 0.85;
      const s = p.size * twinkle;
      child.scale.set(s, s, s);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} geometry={starGeo} material={p.color === 0xfeca57 ? goldMat : cyanMat} />
      ))}
    </group>
  );
}

/**
 * 3D Showroom Platform Pedestal (Sân khấu VIP phong cách Zing Speed)
 */
function ShowroomStage() {
  const stageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1e272e,
        roughness: 0.25,
        metalness: 0.4,
      }),
    []
  );

  const marbleTopMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x2d3436,
        roughness: 0.15,
        metalness: 0.3,
      }),
    []
  );

  const neonRimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        roughness: 0.1,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.8,
      }),
    []
  );

  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xfeca57,
        roughness: 0.15,
        metalness: 0.7,
        emissive: 0xfeca57,
        emissiveIntensity: 0.3,
      }),
    []
  );

  return (
    <group position={[0, -0.02, 0]}>
      {/* Luxury pedestal base */}
      <mesh material={stageMat} receiveShadow position={[0, -0.035, 0]}>
        <cylinderGeometry args={[0.78, 0.85, 0.07, 48]} />
      </mesh>

      {/* Glossy top plate */}
      <mesh material={marbleTopMat} receiveShadow position={[0, -0.001, 0]}>
        <cylinderGeometry args={[0.74, 0.75, 0.015, 48]} />
      </mesh>

      {/* Gold outer accent rim */}
      <mesh material={goldTrimMat} position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.73, 0.75, 48]} />
      </mesh>

      {/* Neon glowing inner rim */}
      <mesh material={neonRimMat} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.67, 0.69, 48]} />
      </mesh>

      {/* Zing Speed Magical Foot Aura */}
      <ZingSpeedMagicalAura />

      {/* Floating Sparkles Field */}
      <ZingSpeedSparkles count={40} />

      {/* Soft Contact Shadows on ground */}
      <ContactShadows position={[0, 0, 0]} opacity={0.65} scale={1.8} blur={1.4} far={0.8} />
    </group>
  );
}

/**
 * Studio Anime 3-Point + Rim Lighting Rig (Ánh sáng anime tôn dáng nhân vật)
 */
function StudioLightingRig() {
  return (
    <>
      {/* Soft Hemisphere Ambient Light */}
      <hemisphereLight intensity={0.75} color="#ffffff" groundColor="#636e72" />

      {/* Warm Soft Key Light */}
      <directionalLight
        position={[2.2, 3.2, 2.5]}
        intensity={1.4}
        color="#fff5eb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool Soft Fill Light */}
      <directionalLight position={[-2.2, 1.8, 1.5]} intensity={0.65} color="#e0f7fa" />

      {/* Sharp Anime Backlight / Rim Light (tạo viền sáng lấp lánh cho tóc và vai) */}
      <directionalLight position={[0, 2.8, -2.8]} intensity={1.3} color="#ffffff" />

      {/* Subtle bottom upward bounce for glowing eyes and chin */}
      <pointLight position={[0, 0.1, 0.6]} intensity={0.35} color="#4facfe" distance={1.8} />
    </>
  );
}

/**
 * Camera & Orbit Controls with strict clamping rules
 */
function CameraRigController({
  cameraView,
  autoRotate,
  mode = 'full',
}: {
  cameraView: 'front' | 'left' | 'right' | 'back';
  autoRotate: boolean;
  mode?: 'full' | 'head' | 'preview';
}) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    switch (cameraView) {
      case 'front':
        controls.setAzimuthalAngle(0);
        break;
      case 'left':
        controls.setAzimuthalAngle(-Math.PI / 2);
        break;
      case 'right':
        controls.setAzimuthalAngle(Math.PI / 2);
        break;
      case 'back':
        controls.setAzimuthalAngle(Math.PI);
        break;
    }
  }, [cameraView]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={mode === 'head' ? [0, 0.74, 0] : [0, 0.5, 0]}
      minDistance={mode === 'head' ? 0.4 : 1.2}
      maxDistance={mode === 'head' ? 1.4 : 3.0}
      minPolarAngle={mode === 'head' ? Math.PI / 2.3 : Math.PI / 2.4}
      maxPolarAngle={mode === 'head' ? Math.PI / 1.7 : Math.PI / 1.8}
      enablePan={false}
      enableZoom={mode !== 'head'}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
    />
  );
}

interface Avatar3DCanvasProps {
  className?: string;
  showControlsOverlay?: boolean;
  mode?: 'full' | 'head' | 'preview';
  overrideEquipped?: Partial<typeof import('../../services/useAvatar3DStore').useAvatar3DStore extends { getState: () => { previewEquipped: infer T } } ? T : any>;
}

export const Avatar3DCanvas: React.FC<Avatar3DCanvasProps> = ({
  className = 'w-full h-full min-h-[380px]',
  showControlsOverlay,
  mode = 'full',
  overrideEquipped,
}) => {
  const {
    previewEquipped: storeEquipped,
    activeAnimation,
    accentColor,
    viewMode3D,
    cameraView,
    autoRotate,
    setCameraView,
    toggleAutoRotate,
  } = useAvatar3DStore();

  const previewEquipped = overrideEquipped ? { ...storeEquipped, ...overrideEquipped } : storeEquipped;
  const shouldShowControls = showControlsOverlay !== undefined ? showControlsOverlay : (mode === 'full');

  const [webGlSupported, setWebGlSupported] = useState(true);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  if (!webGlSupported) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-slate-900 text-white rounded-2xl p-6 ${className}`}>
        <div className="w-28 h-28 mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
          <span className="text-4xl">🌟</span>
        </div>
        <h4 className="text-lg font-bold text-amber-300">Chế độ tiết kiệm hiệu năng 2D</h4>
        <p className="text-xs text-slate-400 text-center max-w-xs mt-2">
          Thiết bị hiện tại không hỗ trợ WebGL tăng tốc phần cứng. Hệ thống chuyển sang ảnh đại diện tĩnh 2D sắc nét.
        </p>
      </div>
    );
  }

  const cameraPos: [number, number, number] = mode === 'head' ? [0, 0.74, 0.72] : [0, 0.6, 2.3];
  const cameraFov = mode === 'head' ? 24 : 35;

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${mode === 'head' ? 'bg-transparent' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl'} ${className}`}>
      <Canvas
        camera={{ position: cameraPos, fov: cameraFov }}
        shadows={mode !== 'head'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <StudioLightingRig />
          {mode !== 'head' && <ShowroomStage />}
          <ChibiAvatarRenderer
            animationState={activeAnimation}
            viewMode3D={viewMode3D}
            accentColor={accentColor}
            hiddenSlots={previewEquipped.hiddenSlots || []}
            maskedParts={previewEquipped.maskedBodyParts || []}
            baseBodyId={previewEquipped.baseBodyId}
            hairId={previewEquipped.hairId}
            topId={previewEquipped.topId}
            bottomId={previewEquipped.bottomId}
            shoesId={previewEquipped.shoesId}
            accessoryId={previewEquipped.accessoryId}
          />
          <CameraRigController cameraView={cameraView} autoRotate={mode === 'head' ? false : autoRotate} mode={mode} />
        </Suspense>
      </Canvas>

      {/* Orbit Controls & Angle Presets Overlay */}
      {shouldShowControls && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg flex flex-col gap-1 text-[11px] font-semibold text-slate-300">
            <button
              onClick={() => setCameraView('front')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraView === 'front' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-white/10'
              }`}
            >
              0° Trước
            </button>
            <button
              onClick={() => setCameraView('left')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraView === 'left' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-white/10'
              }`}
            >
              -90° Trái
            </button>
            <button
              onClick={() => setCameraView('right')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraView === 'right' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-white/10'
              }`}
            >
              +90° Phải
            </button>
            <button
              onClick={() => setCameraView('back')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraView === 'back' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-white/10'
              }`}
            >
              180° Sau
            </button>
          </div>

          <button
            onClick={toggleAutoRotate}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all shadow-md flex items-center justify-center ${
              autoRotate
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Tự động xoay 360°"
          >
            🔄 {autoRotate ? 'Dừng xoay' : 'Tự xoay'}
          </button>
        </div>
      )}

      {/* Animation Status pill badge */}
      {mode !== 'head' && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-[10px] text-cyan-300 font-mono shadow-md z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>R3F 60 FPS • {activeAnimation}</span>
        </div>
      )}
    </div>
  );
};
