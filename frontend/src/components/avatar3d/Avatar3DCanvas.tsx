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

  // Mount & Hot-swap BaseBody
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (bodyRef.current) {
      disposeObject3D(bodyRef.current);
    }
    const mesh = buildBaseBodyMesh(gender, maskedParts, baseBodyId);
    bodyRef.current = mesh;
    avatarRootRef.current.add(mesh);

    return () => {
      if (bodyRef.current) disposeObject3D(bodyRef.current);
    };
  }, [baseBodyId, gender, maskedParts]);

  // Mount & Hot-swap Hair
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (hairRef.current) {
      disposeObject3D(hairRef.current);
    }
    if (!hiddenSlots.includes('Slot_Hair') && hairId) {
      const mesh = buildHairMesh(hairId);
      hairRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (hairRef.current) disposeObject3D(hairRef.current);
    };
  }, [hairId, hiddenSlots]);

  // Mount & Hot-swap Top
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (topRef.current) {
      disposeObject3D(topRef.current);
    }
    if (!hiddenSlots.includes('Slot_Top') && topId) {
      const mesh = buildTopMesh(topId);
      topRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (topRef.current) disposeObject3D(topRef.current);
    };
  }, [topId, hiddenSlots]);

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

  // Mount & Hot-swap Accessory
  useEffect(() => {
    if (!avatarRootRef.current) return;
    if (accRef.current) {
      disposeObject3D(accRef.current);
    }
    if (!hiddenSlots.includes('Slot_Accessory') && accessoryId) {
      const mesh = buildAccessoryMesh(accessoryId);
      accRef.current = mesh;
      avatarRootRef.current.add(mesh);
    }

    return () => {
      if (accRef.current) disposeObject3D(accRef.current);
    };
  }, [accessoryId, hiddenSlots]);

  // Animation State Machine loop
  useFrame((state) => {
    if (!avatarRootRef.current) return;
    const t = state.clock.getElapsedTime();
    const root = avatarRootRef.current;

    switch (animationState) {
      case 'IDLE':
        // Breathing & gentle rhythmical bobbing (60 BPM)
        root.position.y = Math.sin(t * 3.5) * 0.015;
        root.rotation.y = Math.sin(t * 0.8) * 0.08;
        root.rotation.x = 0;
        root.rotation.z = 0;
        break;

      case 'THINKING':
        // Head tilted 15°, slight leaning forward
        root.position.y = Math.sin(t * 2.0) * 0.008;
        root.rotation.y = 0.2;
        root.rotation.z = Math.sin(t * 2.5) * 0.05 + 0.12;
        root.rotation.x = 0.08;
        break;

      case 'CORRECT':
        // Dual V-sign jump
        const jumpY = Math.abs(Math.sin(t * 8.0)) * 0.12;
        root.position.y = jumpY;
        root.rotation.y = Math.sin(t * 4.0) * 0.15;
        root.rotation.x = -0.05;
        break;

      case 'STREAK':
        // 360° spin jump with fiery aura
        root.position.y = Math.abs(Math.sin(t * 6.0)) * 0.18;
        root.rotation.y = t * 6.0;
        break;

      case 'CONFUSED':
        // Head scratching, body swaying nervously
        root.position.y = 0;
        root.rotation.y = Math.sin(t * 5.0) * 0.15;
        root.rotation.z = Math.sin(t * 4.0) * 0.1;
        break;

      case 'TRYON':
        // 360° graceful fashion showroom turn
        root.position.y = Math.sin(t * 4.0) * 0.02;
        root.rotation.y = t * 3.5;
        break;

      case 'VICTORY':
        // Dynamic chibi celebration dance
        root.position.y = Math.abs(Math.sin(t * 7.0)) * 0.15;
        root.rotation.y = Math.sin(t * 5.0) * 0.4;
        root.rotation.z = Math.sin(t * 6.0) * 0.12;
        break;

      case 'DEFEAT':
        // Knee-hug slump down
        root.position.y = -0.06;
        root.rotation.x = 0.2;
        root.rotation.y = 0;
        root.rotation.z = Math.sin(t * 1.5) * 0.03;
        break;
    }

    // Wings gentle flapping if active
    if (accRef.current) {
      const leftWing = accRef.current.getObjectByName('LeftPhotonWing');
      const rightWing = accRef.current.getObjectByName('RightPhotonWing');
      if (leftWing && rightWing) {
        const flap = Math.sin(t * 6.0) * 0.25;
        leftWing.rotation.y = 0.3 + flap;
        rightWing.rotation.y = -0.3 - flap;
      }
    }
  });

  return <group ref={avatarRootRef} position={[0, 0, 0]} />;
}

/**
 * 3D Showroom Platform Pedestal
 */
function ShowroomStage() {
  const stageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00d2d3,
        roughness: 0.1,
        emissive: 0x00d2d3,
        emissiveIntensity: 0.5,
      }),
    []
  );

  return (
    <group position={[0, -0.02, 0]}>
      {/* Wooden / Carbon circular pedestal */}
      <mesh material={stageMat} receiveShadow position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.75, 0.8, 0.06, 36]} />
      </mesh>

      {/* Neon glowing rim */}
      <mesh material={ringMat} position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.74, 36]} />
      </mesh>

      {/* Soft Contact Shadows on ground */}
      <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={1.8} blur={1.5} far={0.8} />
    </group>
  );
}

/**
 * Studio 3-Point Lighting Rig
 */
function StudioLightingRig() {
  return (
    <>
      {/* Hemisphere Ambient Light */}
      <hemisphereLight intensity={0.65} color="#ffffff" groundColor="#747d8c" />

      {/* Key Light (Warm, high intensity) */}
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.25}
        color="#FFF5EA"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light (Soft cool blue) */}
      <directionalLight position={[-2, 1.5, 1]} intensity={0.55} color="#E8F0FE" />

      {/* Rim Light (Sharp white back light for hair/shoulders) */}
      <directionalLight position={[0, 2.5, -2.5]} intensity={0.85} color="#FFFFFF" />
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
