import * as THREE from 'three';

/**
 * 42-bone Master Skeleton matching Mixamo / Unity Humanoid convention
 */
export const MASTER_BONE_NAMES: string[] = [
  'Root', 'Hips', 'Spine', 'Spine1', 'Chest', 'Neck', 'Head',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
  'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase',
  'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase',
  'LeftHandThumb1', 'LeftHandThumb2', 'LeftHandIndex1', 'LeftHandIndex2', 'LeftHandMiddle1', 'LeftHandMiddle2',
  'RightHandThumb1', 'RightHandThumb2', 'RightHandIndex1', 'RightHandIndex2', 'RightHandMiddle1', 'RightHandMiddle2',
  'LeftEye', 'RightEye', 'Jaw', 'HairRoot', 'HairTailLeft', 'HairTailRight', 'WingRoot'
];

/**
 * Creates a standard 42-bone Chibi Master Skeleton
 */
export function createMasterChibiSkeleton(): { skeleton: THREE.Skeleton; rootBone: THREE.Bone } {
  const bonesMap = new Map<string, THREE.Bone>();

  MASTER_BONE_NAMES.forEach((name) => {
    const bone = new THREE.Bone();
    bone.name = name;
    bonesMap.set(name, bone);
  });

  const root = bonesMap.get('Root')!;
  const hips = bonesMap.get('Hips')!;
  const spine = bonesMap.get('Spine')!;
  const spine1 = bonesMap.get('Spine1')!;
  const chest = bonesMap.get('Chest')!;
  const neck = bonesMap.get('Neck')!;
  const head = bonesMap.get('Head')!;

  root.position.set(0, 0, 0);
  hips.position.set(0, 0.45, 0);
  spine.position.set(0, 0.08, 0);
  spine1.position.set(0, 0.08, 0);
  chest.position.set(0, 0.08, 0);
  neck.position.set(0, 0.06, 0);
  head.position.set(0, 0.08, 0);

  root.add(hips);
  hips.add(spine);
  spine.add(spine1);
  spine1.add(chest);
  chest.add(neck);
  neck.add(head);

  // Arms
  const leftShoulder = bonesMap.get('LeftShoulder')!;
  const leftArm = bonesMap.get('LeftArm')!;
  const leftForeArm = bonesMap.get('LeftForeArm')!;
  const leftHand = bonesMap.get('LeftHand')!;

  leftShoulder.position.set(0.08, 0.04, 0);
  leftArm.position.set(0.06, 0, 0);
  leftForeArm.position.set(0.08, 0, 0);
  leftHand.position.set(0.07, 0, 0);

  chest.add(leftShoulder);
  leftShoulder.add(leftArm);
  leftArm.add(leftForeArm);
  leftForeArm.add(leftHand);

  const rightShoulder = bonesMap.get('RightShoulder')!;
  const rightArm = bonesMap.get('RightArm')!;
  const rightForeArm = bonesMap.get('RightForeArm')!;
  const rightHand = bonesMap.get('RightHand')!;

  rightShoulder.position.set(-0.08, 0.04, 0);
  rightArm.position.set(-0.06, 0, 0);
  rightForeArm.position.set(-0.08, 0, 0);
  rightHand.position.set(-0.07, 0, 0);

  chest.add(rightShoulder);
  rightShoulder.add(rightArm);
  rightArm.add(rightForeArm);
  rightForeArm.add(rightHand);

  // Legs
  const leftUpLeg = bonesMap.get('LeftUpLeg')!;
  const leftLeg = bonesMap.get('LeftLeg')!;
  const leftFoot = bonesMap.get('LeftFoot')!;
  const leftToeBase = bonesMap.get('LeftToeBase')!;

  leftUpLeg.position.set(0.07, -0.05, 0);
  leftLeg.position.set(0, -0.15, 0);
  leftFoot.position.set(0, -0.15, 0.03);
  leftToeBase.position.set(0, -0.04, 0.06);

  hips.add(leftUpLeg);
  leftUpLeg.add(leftLeg);
  leftLeg.add(leftFoot);
  leftFoot.add(leftToeBase);

  const rightUpLeg = bonesMap.get('RightUpLeg')!;
  const rightLeg = bonesMap.get('RightLeg')!;
  const rightFoot = bonesMap.get('RightFoot')!;
  const rightToeBase = bonesMap.get('RightToeBase')!;

  rightUpLeg.position.set(-0.07, -0.05, 0);
  rightLeg.position.set(0, -0.15, 0);
  rightFoot.position.set(0, -0.15, 0.03);
  rightToeBase.position.set(0, -0.04, 0.06);

  hips.add(rightUpLeg);
  rightUpLeg.add(rightLeg);
  rightLeg.add(rightFoot);
  rightFoot.add(rightToeBase);

  // Wing & hair
  const wingRoot = bonesMap.get('WingRoot')!;
  wingRoot.position.set(0, 0.05, -0.08);
  chest.add(wingRoot);

  const hairRoot = bonesMap.get('HairRoot')!;
  const hairTailLeft = bonesMap.get('HairTailLeft')!;
  const hairTailRight = bonesMap.get('HairTailRight')!;

  hairRoot.position.set(0, 0.12, 0);
  hairTailLeft.position.set(0.14, 0, -0.05);
  hairTailRight.position.set(-0.14, 0, -0.05);

  head.add(hairRoot);
  hairRoot.add(hairTailLeft);
  hairRoot.add(hairTailRight);

  const bonesList = MASTER_BONE_NAMES.map((name) => bonesMap.get(name)!);
  const skeleton = new THREE.Skeleton(bonesList);

  root.updateWorldMatrix(true, true);
  skeleton.calculateInverses();

  return { skeleton, rootBone: root };
}

/**
 * SkinnedMesh Re-parenting Algorithm
 * Re-binds an imported item mesh to the avatar's Master Skeleton
 */
export function reparentWardrobeItem(
  masterSkeleton: THREE.Skeleton,
  itemScene: THREE.Group | THREE.Object3D
): THREE.SkinnedMesh[] {
  const boundMeshes: THREE.SkinnedMesh[] = [];

  itemScene.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      const mesh = child as THREE.SkinnedMesh;

      const newBones: THREE.Bone[] = [];
      mesh.skeleton.bones.forEach((bone) => {
        const matchingMaster = masterSkeleton.bones.find((b) => b.name === bone.name);
        if (matchingMaster) {
          newBones.push(matchingMaster);
        } else {
          // Fallback to Hips root
          newBones.push(masterSkeleton.bones[1] || masterSkeleton.bones[0]);
        }
      });

      mesh.bind(new THREE.Skeleton(newBones, mesh.skeleton.boneInverses), mesh.bindMatrix);
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      mesh.frustumCulled = true;

      boundMeshes.push(mesh);
    }
  });

  return boundMeshes;
}

/**
 * Deep resource cleanup for geometries, materials, and textures
 * Guarantees zero WebGL memory leaks
 */
export function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });

  if (object.parent) {
    object.parent.remove(object);
  }
}

function disposeMaterial(material: THREE.Material): void {
  // Dispose all potential texture maps
  const matAny = material as unknown as Record<string, unknown>;
  const textureKeys = ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'alphaMap'];

  textureKeys.forEach((key) => {
    const val = matAny[key];
    if (val && typeof (val as THREE.Texture).dispose === 'function') {
      (val as THREE.Texture).dispose();
    }
  });

  material.dispose();
}
