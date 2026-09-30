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
import { AnimationState3D, UserAvatar3DConfig } from '../../types/avatar3d';
import { RotateCw, Sparkles, Heart, Zap } from 'lucide-react';

interface ChibiSingleModelProps {
  gender: 'FEMALE' | 'MALE';
  config: Partial<UserAvatar3DConfig>;
  animationState: AnimationState3D;
  position: [number, number, number];
  isPartnerInteractive?: boolean;
}

function ChibiModelRenderer({
  gender,
  config,
  animationState,
  position,
  isPartnerInteractive = true,
}: ChibiSingleModelProps) {
  const avatarRootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group | null>(null);
  const hairRef = useRef<THREE.Group | null>(null);
  const topRef = useRef<THREE.Group | null>(null);
  const bottomRef = useRef<THREE.Group | null>(null);
  const shoesRef = useRef<THREE.Group | null>(null);
  const accRef = useRef<THREE.Group | null>(null);

  const baseBodyId =
    config.baseBodyId || (gender === 'FEMALE' ? 'body_chibi_female_aoi' : 'body_chibi_male_ren');
  const hairId =
    config.hairId || (gender === 'FEMALE' ? 'hair_twin_tails_cherry_01' : 'hair_side_part_scholar_01');
  const topId =
    config.topId || (gender === 'FEMALE' ? 'top_chibi_female_sailor_01' : 'top_chibi_male_vest_gilet_01');
  const bottomId =
    config.bottomId || (gender === 'FEMALE' ? 'bottom_chibi_female_pleated_01' : 'bottom_chibi_male_slacks_01');
  const shoesId =
    config.shoesId || (gender === 'FEMALE' ? 'shoes_chibi_female_oxford_01' : 'shoes_chibi_male_sneaker_cyan_01');
  const accessoryId =
    config.accessoryId || (gender === 'FEMALE' ? 'acc_chibi_female_star_clip_01' : 'acc_chibi_male_smart_glasses_01');

  const maskedParts = config.maskedBodyParts || [];
  const hiddenSlots = config.hiddenSlots || [];

  // Mount BaseBody
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (bodyRef.current) disposeObject3D(bodyRef.current);
    const mesh = buildBaseBodyMesh(gender, maskedParts, baseBodyId);
    bodyRef.current = mesh;
    avatarRootRef.current.add(mesh);

    return () => {
      if (bodyRef.current) disposeObject3D(bodyRef.current);
    };
  }, [baseBodyId, gender, maskedParts]);

  // Mount Hair
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (hairRef.current) disposeObject3D(hairRef.current);
    if (!hiddenSlots.includes('Slot_Hair') && hairId) {
      const mesh = buildHairMesh(hairId);
      hairRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (hairRef.current) disposeObject3D(hairRef.current);
    };
  }, [hairId, hiddenSlots]);

  // Mount Top
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (topRef.current) disposeObject3D(topRef.current);
    if (!hiddenSlots.includes('Slot_Top') && topId) {
      const mesh = buildTopMesh(topId);
      topRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (topRef.current) disposeObject3D(topRef.current);
    };
  }, [topId, hiddenSlots]);

  // Mount Bottom
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (bottomRef.current) disposeObject3D(bottomRef.current);
    if (!hiddenSlots.includes('Slot_Bottom') && bottomId) {
      const mesh = buildBottomMesh(bottomId);
      bottomRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (bottomRef.current) disposeObject3D(bottomRef.current);
    };
  }, [bottomId, hiddenSlots]);

  // Mount Shoes
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (shoesRef.current) disposeObject3D(shoesRef.current);
    if (!hiddenSlots.includes('Slot_Shoes') && shoesId) {
      const mesh = buildShoesMesh(shoesId);
      shoesRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (shoesRef.current) disposeObject3D(shoesRef.current);
    };
  }, [shoesId, hiddenSlots]);

  // Mount Accessory
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (accRef.current) disposeObject3D(accRef.current);
    if (!hiddenSlots.includes('Slot_Accessory') && accessoryId) {
      const mesh = buildAccessoryMesh(accessoryId);
      accRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (accRef.current) disposeObject3D(accRef.current);
    };
  }, [accessoryId, hiddenSlots]);

  // Animation frame loop with partner slight turn
  useFrame((state) => {
    if (!avatarRootRef.current) return;
    const t = state.clock.getElapsedTime();
    const root = avatarRootRef.current;
    const isFemale = gender === 'FEMALE';
    const partnerOffsetAngle = isFemale ? 0.22 : -0.22; // Face slightly toward each other

    switch (animationState) {
      case 'IDLE':
        // Breathing & synchronized sweet rhythm
        root.position.y = Math.sin(t * 3.2 + (isFemale ? 0 : 0.3)) * 0.012;
        root.rotation.y = partnerOffsetAngle + Math.sin(t * 0.8) * 0.06;
        root.rotation.x = 0;
        root.rotation.z = isFemale ? 0.02 : -0.02;
        break;

      case 'CORRECT':
        // High joy jump
        const jumpY = Math.abs(Math.sin(t * 7.5)) * 0.14;
        root.position.y = jumpY;
        root.rotation.y = partnerOffsetAngle + Math.sin(t * 4.0) * 0.12;
        root.rotation.x = -0.04;
        break;

      case 'STREAK':
        // Synchronized energetic spins
        root.position.y = Math.abs(Math.sin(t * 6.0)) * 0.16;
        root.rotation.y = t * 5.0 * (isFemale ? 1 : -1);
        break;

      case 'VICTORY':
        // Duo victory celebration wave
        root.position.y = Math.abs(Math.sin(t * 6.5)) * 0.12;
        root.rotation.y = partnerOffsetAngle + Math.sin(t * 4.5) * 0.35;
        root.rotation.z = Math.sin(t * 5.0) * (isFemale ? 0.08 : -0.08);
        break;

      case 'TRYON':
        // Elegant 360 showroom turn
        root.position.y = Math.sin(t * 3.5) * 0.015;
        root.rotation.y = t * 3.0;
        break;

      case 'THINKING':
        root.position.y = Math.sin(t * 2.0) * 0.008;
        root.rotation.y = partnerOffsetAngle;
        root.rotation.z = (isFemale ? 1 : -1) * (Math.sin(t * 2.5) * 0.04 + 0.1);
        break;

      case 'CONFUSED':
        root.position.y = 0;
        root.rotation.y = partnerOffsetAngle + Math.sin(t * 4.0) * 0.12;
        root.rotation.z = Math.sin(t * 3.5) * (isFemale ? 0.08 : -0.08);
        break;

      case 'DEFEAT':
        root.position.y = -0.05;
        root.rotation.x = 0.18;
        root.rotation.y = partnerOffsetAngle;
        break;
    }
  });

  return <group ref={avatarRootRef} position={position} />;
}

/**
 * Dual Showroom Stage Platform with neon dual ring
 */
function DualShowroomStage() {
  const stageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1e272e,
        roughness: 0.35,
        metalness: 0.25,
      }),
    []
  );

  const pinkRingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xff7675,
        roughness: 0.15,
        emissive: 0xff7675,
        emissiveIntensity: 0.6,
      }),
    []
  );

  const cyanRingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00cec9,
        roughness: 0.15,
        emissive: 0x00cec9,
        emissiveIntensity: 0.6,
      }),
    []
  );

  return (
    <group position={[0, -0.02, 0]}>
      {/* Elliptical Podium Base */}
      <mesh material={stageMat} receiveShadow position={[0, -0.03, 0]}>
        <cylinderGeometry args={[1.35, 1.4, 0.06, 40]} />
      </mesh>

      {/* Aoi Stage Glow Ring (Pink) */}
      <mesh material={pinkRingMat} position={[-0.45, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.46, 32]} />
      </mesh>

      {/* Ren Stage Glow Ring (Cyan) */}
      <mesh material={cyanRingMat} position={[0.45, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.46, 32]} />
      </mesh>

      {/* Dual Soft Contact Shadows */}
      <ContactShadows position={[0, 0, 0]} opacity={0.75} scale={2.8} blur={1.8} far={1.2} />
    </group>
  );
}

/**
 * Studio Lighting for Duo Characters
 */
function DualStudioLighting() {
  return (
    <>
      <hemisphereLight intensity={0.7} color="#ffffff" groundColor="#636e72" />
      <directionalLight position={[3, 4, 3]} intensity={1.3} color="#FFF8F0" castShadow />
      <directionalLight position={[-3, 2, 2]} intensity={0.65} color="#E8F4F8" />
      <directionalLight position={[0, 3, -3]} intensity={0.9} color="#FFFFFF" />
    </>
  );
}

export interface DualAvatar3DCanvasProps {
  className?: string;
  showControlsOverlay?: boolean;
  femaleConfig?: Partial<UserAvatar3DConfig>;
  maleConfig?: Partial<UserAvatar3DConfig>;
  animationState?: AnimationState3D;
  onAnimationChange?: (anim: AnimationState3D) => void;
}

export const DualAvatar3DCanvas: React.FC<DualAvatar3DCanvasProps> = ({
  className = 'w-full h-full min-h-[380px]',
  showControlsOverlay = true,
  femaleConfig,
  maleConfig,
  animationState: externalAnim,
  onAnimationChange,
}) => {
  const {
    previewEquipped,
    activeAnimation: storeAnim,
    autoRotate,
    toggleAutoRotate,
    setAnimation,
  } = useAvatar3DStore();

  const [activeAnim, setActiveAnim] = useState<AnimationState3D>(externalAnim || storeAnim || 'IDLE');
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (externalAnim) setActiveAnim(externalAnim);
    else if (storeAnim) setActiveAnim(storeAnim);
  }, [externalAnim, storeAnim]);

  const handleAnimClick = (anim: AnimationState3D) => {
    setActiveAnim(anim);
    setAnimation(anim);
    if (onAnimationChange) onAnimationChange(anim);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.48, 0);
    }
  };

  return (
    <div className={`relative ${className} select-none overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.75, 2.3], fov: 38 }}
      >
        <Suspense fallback={null}>
          <DualStudioLighting />
          <DualShowroomStage />

          {/* Female Chibi: Aoi (Left) */}
          <ChibiModelRenderer
            gender="FEMALE"
            config={femaleConfig || previewEquipped}
            animationState={activeAnim}
            position={[-0.45, 0, 0]}
          />

          {/* Male Chibi: Ren (Right) */}
          <ChibiModelRenderer
            gender="MALE"
            config={maleConfig || previewEquipped}
            animationState={activeAnim}
            position={[0.45, 0, 0]}
          />

          <OrbitControls
            ref={controlsRef}
            target={[0, 0.48, 0]}
            minDistance={1.3}
            maxDistance={3.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.75}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
          />
        </Suspense>
      </Canvas>

      {/* Floating HUD Badges for Aoi & Ren */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[11px] font-bold shadow-lg backdrop-blur-md">
        <span>🌸</span>
        <span>Aoi (Nữ)</span>
      </div>

      <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold shadow-lg backdrop-blur-md">
        <span>⚡</span>
        <span>Ren (Nam)</span>
      </div>

      {/* Optional Interactive Controls Overlay */}
      {showControlsOverlay && (
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleResetCamera}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow-md backdrop-blur-md transition-all text-xs"
              title="Đặt lại góc nhìn"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleAutoRotate}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all backdrop-blur-md ${
                autoRotate
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title="Xoay 360° tự động"
            >
              360°
            </button>
          </div>

          {/* Sync Animation Pose Buttons */}
          <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-md">
            <button
              onClick={() => handleAnimClick('IDLE')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeAnim === 'IDLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nghỉ
            </button>
            <button
              onClick={() => handleAnimClick('CORRECT')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeAnim === 'CORRECT' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhảy
            </button>
            <button
              onClick={() => handleAnimClick('VICTORY')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeAnim === 'VICTORY' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ăn mừng
            </button>
            <button
              onClick={() => handleAnimClick('STREAK')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeAnim === 'STREAK' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Streak 🔥
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
