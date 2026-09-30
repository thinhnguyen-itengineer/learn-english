import * as THREE from 'three';

/**
 * Stylized Stickman Material Builder
 */
export function createStickmanMaterial(
  color: string | number,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.22,
    metalness: 0.18,
    ...options,
  });
}

export const createVinylMaterial = createStickmanMaterial;

/**
 * Parses unique skin colors (Black & White monochrome)
 */
export function getSkinMaterial(bodyId?: string): { mat: THREE.MeshStandardMaterial; isWhite: boolean } {
  const b = (bodyId || '').toLowerCase();
  const isWhite = b.includes('white') || b.includes('pearl') || b.includes('light');

  if (isWhite) {
    return {
      mat: createStickmanMaterial(0xf6f7fa, { roughness: 0.24, metalness: 0.08 }),
      isWhite: true,
    };
  }

  // Deep matte black / obsidian
  return {
    mat: createStickmanMaterial(0x161619, { roughness: 0.32, metalness: 0.15 }),
    isWhite: false,
  };
}

/**
 * Builds Modern Minimalist 3D Stickman (100% Uniform Monochrome Color from Top to Bottom)
 * Features a fixed balanced idle stance, with right-hand grip pose when holding a prop.
 */
export function buildBaseBodyMesh(
  _gender: 'MALE' | 'FEMALE' | 'UNISEX' = 'UNISEX',
  _maskedParts: string[] = [],
  bodyId?: string,
  topId?: string,
  isHoldingItem: boolean = false
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'BaseBody_Group';

  const { mat: bodyMat } = getSkinMaterial(bodyId);

  // 1. Sleek Spherical Head (Uniform Body Material)
  const headGroup = new THREE.Group();
  headGroup.name = 'Mat_Head';
  headGroup.position.set(0, 0.78, 0);

  const headGeo = new THREE.SphereGeometry(0.185, 32, 32);
  const headMesh = new THREE.Mesh(headGeo, bodyMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);
  group.add(headGroup);

  // 2. Neck (Uniform Body Material)
  const neckGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.08, 16);
  const neck = new THREE.Mesh(neckGeo, bodyMat);
  neck.position.set(0, 0.65, 0);
  group.add(neck);

  // 3. Torso (Uniform Body Material)
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'Mat_Torso';

  const chestBarGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.22, 16);
  chestBarGeo.rotateZ(Math.PI / 2);
  const chestBar = new THREE.Mesh(chestBarGeo, bodyMat);
  chestBar.position.set(0, 0.55, 0);

  const spineGeo = new THREE.CylinderGeometry(0.022, 0.026, 0.18, 16);
  const spine = new THREE.Mesh(spineGeo, bodyMat);
  spine.position.set(0, 0.46, 0);

  // Sleek minimalist chest core (Monochrome seamless)
  const coreOuterGeo = new THREE.TorusGeometry(0.034, 0.006, 8, 24);
  const coreOuter = new THREE.Mesh(coreOuterGeo, bodyMat);
  coreOuter.position.set(0, 0.54, 0.028);

  const coreCrystalGeo = new THREE.OctahedronGeometry(0.02, 0);
  const coreCrystal = new THREE.Mesh(coreCrystalGeo, bodyMat);
  coreCrystal.position.set(0, 0.54, 0.028);

  // Pelvis Hips
  const hipsGeo = new THREE.SphereGeometry(0.046, 20, 20);
  hipsGeo.scale(1.2, 0.8, 0.9);
  const hips = new THREE.Mesh(hipsGeo, bodyMat);
  hips.position.set(0, 0.36, 0);

  torsoGroup.add(chestBar, spine, coreOuter, coreCrystal, hips);
  group.add(torsoGroup);

  // Determine if character is holding an item (by mode or equipped handheld prop)
  const holdsItem = isHoldingItem || Boolean(topId && (topId.startsWith('prop_') || topId.includes('hold')));

  // 4. Arms & Hands (Standardized Pivot Groups for Walking / Running / Holding)
  for (const isLeft of [true, false]) {
    const armGroup = new THREE.Group();
    armGroup.name = isLeft ? 'LeftArmGroup' : 'RightArmGroup';
    // Pivot at shoulder joint for natural swing
    const sx = isLeft ? 0.12 : -0.12;
    armGroup.position.set(sx, 0.55, 0);

    const shoulderGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const shoulder = new THREE.Mesh(shoulderGeo, bodyMat);

    const upperArmGeo = new THREE.CylinderGeometry(0.015, 0.014, 0.16, 14);
    const upperArm = new THREE.Mesh(upperArmGeo, bodyMat);

    const elbowGeo = new THREE.SphereGeometry(0.022, 14, 14);
    const elbow = new THREE.Mesh(elbowGeo, bodyMat);

    const foreArmGeo = new THREE.CylinderGeometry(0.014, 0.013, 0.15, 14);
    const foreArm = new THREE.Mesh(foreArmGeo, bodyMat);

    const handGeo = new THREE.SphereGeometry(0.026, 16, 16);
    handGeo.scale(0.85, 1.15, 0.7);
    const hand = new THREE.Mesh(handGeo, bodyMat);

    if (!isLeft && holdsItem) {
      // Right Arm: Raised forward in grip pose to hold item for mini games!
      upperArm.position.set(0, -0.06, 0.05);
      upperArm.rotation.set(0.65, 0, -0.1);

      elbow.position.set(0, -0.12, 0.12);

      foreArm.position.set(0, -0.1, 0.19);
      foreArm.rotation.set(-0.45, 0, -0.08);

      hand.position.set(0, -0.09, 0.26);
      hand.rotation.set(0.3, -0.2, 0);
    } else {
      // Natural relaxed arm posture
      upperArm.position.set(isLeft ? 0.01 : -0.01, -0.08, 0);
      upperArm.rotation.z = isLeft ? -0.1 : 0.1;

      elbow.position.set(isLeft ? 0.02 : -0.02, -0.17, 0);

      foreArm.position.set(isLeft ? 0.025 : -0.025, -0.25, 0.01);
      foreArm.rotation.x = 0.05;

      hand.position.set(isLeft ? 0.03 : -0.03, -0.34, 0.02);
    }

    armGroup.add(shoulder, upperArm, elbow, foreArm, hand);
    group.add(armGroup);
  }

  // 5. Legs & Feet (Standardized Pivot Groups for Running / Idle)
  for (const isLeft of [true, false]) {
    const legGroup = new THREE.Group();
    legGroup.name = isLeft ? 'LeftLegGroup' : 'RightLegGroup';
    // Pivot at hip joint for natural leg swing
    const lx = isLeft ? 0.065 : -0.065;
    legGroup.position.set(lx, 0.35, 0);

    const hipJointGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const hipJoint = new THREE.Mesh(hipJointGeo, bodyMat);

    const thighGeo = new THREE.CylinderGeometry(0.017, 0.015, 0.19, 14);
    const thigh = new THREE.Mesh(thighGeo, bodyMat);
    thigh.position.set(0, -0.1, 0);

    const kneeGeo = new THREE.SphereGeometry(0.024, 14, 14);
    const knee = new THREE.Mesh(kneeGeo, bodyMat);
    knee.position.set(0, -0.21, 0);

    const calfGeo = new THREE.CylinderGeometry(0.015, 0.013, 0.18, 14);
    const calf = new THREE.Mesh(calfGeo, bodyMat);
    calf.position.set(0, -0.31, 0);

    const footGeo = new THREE.BoxGeometry(0.032, 0.022, 0.076);
    const foot = new THREE.Mesh(footGeo, bodyMat);
    foot.position.set(0, -0.41, 0.02);

    legGroup.add(hipJoint, thigh, knee, calf, foot);
    group.add(legGroup);
  }

  return group;
}

/**
 * Builds Full Facial Expressions: Eyebrows, Eyes, Nose, Mouth, & Accents
 */
export function buildHairMesh(faceId: string, accentColor: string | number = 0x00f2fe): THREE.Group {
  const group = new THREE.Group();
  group.name = `Face_${faceId}`;
  group.position.set(0, 0.78, 0); // Head origin

  const accentHex = new THREE.Color(accentColor);

  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: accentHex,
    emissiveIntensity: 1.0,
    roughness: 0.1,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfeca57,
    emissiveIntensity: 1.0,
    roughness: 0.1,
  });

  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff6b81,
    emissiveIntensity: 1.0,
    roughness: 0.1,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xff4757,
    emissive: 0xff4757,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.2,
    metalness: 0.8,
  });

  const f = faceId.toLowerCase();

  if (f.includes('chad') || f.includes('smirk') || f.includes('cool')) {
    // ==========================================
    // 1. GigaChad / The Rock Smirk & Pixel Shades
    // ==========================================
    // Eyebrows: Left raised high (The Rock), Right lowered
    const leftBrowGeo = new THREE.BoxGeometry(0.045, 0.009, 0.01);
    const leftBrow = new THREE.Mesh(leftBrowGeo, darkMat);
    leftBrow.position.set(0.065, 0.075, 0.178);
    leftBrow.rotation.z = 0.28; // Tilted high

    const rightBrowGeo = new THREE.BoxGeometry(0.045, 0.009, 0.01);
    const rightBrow = new THREE.Mesh(rightBrowGeo, darkMat);
    rightBrow.position.set(-0.065, 0.038, 0.178);
    rightBrow.rotation.z = 0.05; // Lowered skeptical

    // Eyes: Cool squinting eyes
    const eyeGeo = new THREE.BoxGeometry(0.045, 0.016, 0.01);
    const leftEye = new THREE.Mesh(eyeGeo, cyanMat);
    leftEye.position.set(0.065, 0.035, 0.18);
    const rightEye = new THREE.Mesh(eyeGeo, cyanMat);
    rightEye.position.set(-0.065, 0.018, 0.18);

    // Cheeky Nose
    const noseGeo = new THREE.ConeGeometry(0.015, 0.04, 4);
    const nose = new THREE.Mesh(noseGeo, darkMat);
    nose.position.set(0, 0, 0.195);
    nose.rotation.x = Math.PI / 2;

    // Cocky Smirk Mouth (crooked grin on the left)
    const smirkGeo = new THREE.TorusGeometry(0.03, 0.007, 6, 16, Math.PI * 0.6);
    const smirk = new THREE.Mesh(smirkGeo, darkMat);
    smirk.position.set(0.02, -0.048, 0.18);
    smirk.rotation.set(0, 0, -0.35);

    // White tooth glint
    const glintGeo = new THREE.OctahedronGeometry(0.008, 0);
    const glint = new THREE.Mesh(glintGeo, goldMat);
    glint.position.set(0.038, -0.042, 0.188);

    group.add(leftBrow, rightBrow, leftEye, rightEye, nose, smirk, glint);
  } else if (f.includes('derp') || f.includes('troll') || f.includes('funny')) {
    // ==========================================
    // 2. Derp Troll / Ngáo Ngơ Thè Lưỡi Hài Hước
    // ==========================================
    // Eyebrows: Wavy squiggly ziczac brows
    for (const isLeft of [true, false]) {
      const browGeo = new THREE.BoxGeometry(0.045, 0.008, 0.01);
      const brow = new THREE.Mesh(browGeo, darkMat);
      brow.position.set(isLeft ? 0.065 : -0.065, isLeft ? 0.065 : 0.04, 0.178);
      brow.rotation.z = isLeft ? -0.35 : 0.35;
      group.add(brow);
    }

    // Derp Eyes: One huge looking up, one tiny looking down
    const bigEyeGeo = new THREE.SphereGeometry(0.036, 16, 16);
    const bigEye = new THREE.Mesh(bigEyeGeo, cyanMat);
    bigEye.position.set(0.065, 0.02, 0.176);

    const bigPupilGeo = new THREE.SphereGeometry(0.014, 12, 12);
    const bigPupil = new THREE.Mesh(bigPupilGeo, darkMat);
    bigPupil.position.set(0.055, 0.032, 0.206); // looking up-left

    const smallEyeGeo = new THREE.SphereGeometry(0.022, 16, 16);
    const smallEye = new THREE.Mesh(smallEyeGeo, cyanMat);
    smallEye.position.set(-0.065, 0.01, 0.176);

    const smallPupilGeo = new THREE.SphereGeometry(0.01, 12, 12);
    const smallPupil = new THREE.Mesh(smallPupilGeo, darkMat);
    smallPupil.position.set(-0.055, 0.002, 0.194); // looking down-right

    // Pointy Pinocchio funny nose
    const noseGeo = new THREE.ConeGeometry(0.018, 0.07, 6);
    const nose = new THREE.Mesh(noseGeo, redMat);
    nose.position.set(0, -0.01, 0.21);
    nose.rotation.x = Math.PI / 2;

    // Floppy pink tongue out
    const mouthGeo = new THREE.BoxGeometry(0.04, 0.015, 0.01);
    const mouth = new THREE.Mesh(mouthGeo, darkMat);
    mouth.position.set(0.01, -0.055, 0.18);

    const tongueGeo = new THREE.SphereGeometry(0.022, 14, 14);
    tongueGeo.scale(0.8, 1.4, 0.4);
    const tongue = new THREE.Mesh(tongueGeo, pinkMat);
    tongue.position.set(0.025, -0.075, 0.186);

    group.add(bigEye, bigPupil, smallEye, smallPupil, nose, mouth, tongue);
  } else if (f.includes('rage') || f.includes('flame') || f.includes('angry')) {
    // ==========================================
    // 3. Rage Flame / Chiến Binh Nộ Khí Bốc Lửa
    // ==========================================
    // Angry V-shaped sharp eyebrows
    for (const isLeft of [true, false]) {
      const browGeo = new THREE.BoxGeometry(0.05, 0.01, 0.01);
      const brow = new THREE.Mesh(browGeo, redMat);
      brow.position.set(isLeft ? 0.062 : -0.062, 0.05, 0.18);
      brow.rotation.z = isLeft ? 0.35 : -0.35;
      group.add(brow);
    }

    // Glowing Flame Eyes
    for (const isLeft of [true, false]) {
      const flameGeo = new THREE.ConeGeometry(0.028, 0.085, 4);
      const flame = new THREE.Mesh(flameGeo, goldMat);
      flame.position.set(isLeft ? 0.065 : -0.065, 0.025, 0.18);
      flame.rotation.set(-0.25, 0, isLeft ? -0.35 : 0.35);
      group.add(flame);
    }

    // Gritted Teeth Bar
    const teethGeo = new THREE.BoxGeometry(0.065, 0.02, 0.012);
    const teeth = new THREE.Mesh(teethGeo, cyanMat);
    teeth.position.set(0, -0.05, 0.18);

    // Glowing Rage Cross Mark (💢) on forehead
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.005), redMat);
    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.03, 0.005), redMat);
    const rageMark = new THREE.Group();
    rageMark.add(cross1, cross2);
    rageMark.position.set(0.09, 0.1, 0.15);
    rageMark.rotation.set(0.2, 0.3, 0.2);

    group.add(teeth, rageMark);
  } else if (f.includes('cry') || f.includes('tear') || f.includes('sad')) {
    // ==========================================
    // 4. Crying River / Khóc Dòng Sông Hài Hước
    // ==========================================
    // Droopy sad brows
    for (const isLeft of [true, false]) {
      const browGeo = new THREE.BoxGeometry(0.045, 0.008, 0.01);
      const brow = new THREE.Mesh(browGeo, darkMat);
      brow.position.set(isLeft ? 0.065 : -0.065, 0.05, 0.178);
      brow.rotation.z = isLeft ? 0.35 : -0.35;
      group.add(brow);
    }

    // Squeezed shut crying eyes (> <)
    for (const isLeft of [true, false]) {
      const eyeGeo = new THREE.TorusGeometry(0.025, 0.006, 6, 12, Math.PI);
      const eye = new THREE.Mesh(eyeGeo, darkMat);
      eye.position.set(isLeft ? 0.065 : -0.065, 0.02, 0.18);
      eye.rotation.z = isLeft ? -Math.PI / 2 : Math.PI / 2;
      group.add(eye);
    }

    // Two Waterfall Tear Streams (2 dòng thác nước mắt neon)
    for (const isLeft of [true, false]) {
      const tearGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.12, 12);
      const tear = new THREE.Mesh(tearGeo, cyanMat);
      tear.position.set(isLeft ? 0.065 : -0.065, -0.04, 0.182);
      group.add(tear);
    }

    // Gaping open bawling mouth (D)
    const mouthGeo = new THREE.TorusGeometry(0.028, 0.008, 8, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, darkMat);
    mouth.position.set(0, -0.06, 0.18);
    mouth.rotation.z = Math.PI;

    group.add(mouth);
  } else if (f.includes('waku') || f.includes('sparkle') || f.includes('anime')) {
    // ==========================================
    // 5. Waku Waku Moe / Anime Cute Siêu Cấp
    // ==========================================
    // Happy high brows
    for (const isLeft of [true, false]) {
      const browGeo = new THREE.TorusGeometry(0.038, 0.005, 6, 14, Math.PI * 0.6);
      const brow = new THREE.Mesh(browGeo, darkMat);
      brow.position.set(isLeft ? 0.065 : -0.065, 0.065, 0.178);
      brow.rotation.set(0.1, 0, isLeft ? -0.1 : Math.PI + 0.1);
      group.add(brow);
    }

    // Big Sparkling Anime Eyes
    for (const isLeft of [true, false]) {
      const eyeGeo = new THREE.SphereGeometry(0.038, 18, 18);
      eyeGeo.scale(1.0, 1.25, 0.3);
      const eye = new THREE.Mesh(eyeGeo, cyanMat);
      eye.position.set(isLeft ? 0.065 : -0.065, 0.015, 0.178);

      const starGeo = new THREE.OctahedronGeometry(0.014, 0);
      const star = new THREE.Mesh(starGeo, goldMat);
      star.position.set(isLeft ? 0.078 : -0.052, 0.028, 0.192);

      const twinkleGeo = new THREE.SphereGeometry(0.006, 10, 10);
      const twinkle = new THREE.Mesh(twinkleGeo, goldMat);
      twinkle.position.set(isLeft ? 0.052 : -0.078, 0.002, 0.19);

      group.add(eye, star, twinkle);
    }

    // Cat mouth (:3)
    const mouthLeft = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 6, 12, Math.PI), pinkMat);
    mouthLeft.position.set(0.015, -0.045, 0.182);
    mouthLeft.rotation.z = Math.PI;

    const mouthRight = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 6, 12, Math.PI), pinkMat);
    mouthRight.position.set(-0.015, -0.045, 0.182);
    mouthRight.rotation.z = Math.PI;

    // Big Cute Blushing Cheeks
    for (const isLeft of [true, false]) {
      const blushGeo = new THREE.CircleGeometry(0.028, 16);
      const blush = new THREE.Mesh(blushGeo, pinkMat);
      blush.position.set(isLeft ? 0.11 : -0.11, -0.02, 0.168);
      blush.rotation.y = isLeft ? 0.4 : -0.4;
      group.add(blush);
    }

    group.add(mouthLeft, mouthRight);
  } else {
    // ==========================================
    // 6. Cyber Matrix Visor
    // ==========================================
    const visorGeo = new THREE.CylinderGeometry(0.189, 0.189, 0.045, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
    const visor = new THREE.Mesh(visorGeo, cyanMat);
    visor.position.set(0, 0.015, 0);

    const frameGeo = new THREE.CylinderGeometry(0.191, 0.191, 0.052, 32, 1, true, -Math.PI / 3 - 0.05, 0.1);
    const frameLeft = new THREE.Mesh(frameGeo, darkMat);
    frameLeft.position.set(0, 0.015, 0);
    const frameRight = frameLeft.clone();
    frameRight.rotation.y = (Math.PI * 2) / 3;

    group.add(visor, frameLeft, frameRight);
  }

  return group;
}

/**
 * Builds Grand Glowing Wings (Accessories)
 */
export function buildAccessoryMesh(accId?: string | null, accentColor: string | number = 0x00f2fe): THREE.Group {
  const group = new THREE.Group();
  if (!accId) return group;

  group.name = `Wings_${accId}`;

  const id = accId.toLowerCase();
  const accentHex = new THREE.Color(accentColor);

  const accentWingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: accentHex,
    emissiveIntensity: 1.1,
    roughness: 0.1,
  });

  const secondaryWingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.6,
    roughness: 0.1,
  });

  if (id.includes('angel') || id.includes('star_choker')) {
    // Celestial Angel Wings
    for (const isLeft of [true, false]) {
      const wingG = new THREE.Group();
      wingG.name = isLeft ? 'LeftPhotonWing' : 'RightPhotonWing';
      wingG.position.set(isLeft ? 0.08 : -0.08, 0.56, -0.06);

      for (let i = 0; i < 6; i++) {
        const fGeo = new THREE.ConeGeometry(0.038, 0.28 + i * 0.06, 5);
        fGeo.scale(1, 1, 0.25);
        const fMesh = new THREE.Mesh(fGeo, i % 2 === 0 ? secondaryWingMat : accentWingMat);
        fMesh.position.set(isLeft ? i * 0.055 + 0.04 : -i * 0.055 - 0.04, i * 0.05, -i * 0.03);
        fMesh.rotation.set(-0.2, isLeft ? 0.4 : -0.4, isLeft ? -0.45 - i * 0.12 : 0.45 + i * 0.12);
        wingG.add(fMesh);
      }
      group.add(wingG);
    }
  } else if (id.includes('devil') || id.includes('demon') || id.includes('bat') || id.includes('void')) {
    // Shadow Demon Wings
    const boneMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.2, metalness: 0.8 });

    for (const isLeft of [true, false]) {
      const wingG = new THREE.Group();
      wingG.name = isLeft ? 'LeftPhotonWing' : 'RightPhotonWing';
      wingG.position.set(isLeft ? 0.08 : -0.08, 0.56, -0.06);

      const strutCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.18 : -0.18, 0.22, -0.05),
        new THREE.Vector3(isLeft ? 0.38 : -0.38, 0.14, -0.12)
      );
      const strutGeo = new THREE.TubeGeometry(strutCurve, 12, 0.016, 8, false);
      const strut = new THREE.Mesh(strutGeo, boneMat);
      wingG.add(strut);

      for (let i = 0; i < 4; i++) {
        const memGeo = new THREE.ConeGeometry(0.065, 0.26, 4);
        memGeo.scale(1, 1, 0.15);
        const mem = new THREE.Mesh(memGeo, accentWingMat);
        mem.position.set(isLeft ? 0.12 + i * 0.09 : -0.12 - i * 0.09, -0.02 - i * 0.04, -0.08);
        mem.rotation.set(-0.15, isLeft ? 0.3 : -0.3, isLeft ? -0.6 - i * 0.2 : 0.6 + i * 0.2);
        wingG.add(mem);
      }
      group.add(wingG);
    }
  } else if (id.includes('fairy') || id.includes('butterfly') || id.includes('cat_paw') || id.includes('neon')) {
    // Ethereal Fairy Butterfly Wings
    const fairyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentHex,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.82,
      roughness: 0.1,
    });

    for (const isLeft of [true, false]) {
      const wingG = new THREE.Group();
      wingG.name = isLeft ? 'LeftPhotonWing' : 'RightPhotonWing';
      wingG.position.set(isLeft ? 0.08 : -0.08, 0.54, -0.06);

      const upGeo = new THREE.SphereGeometry(0.14, 16, 16);
      upGeo.scale(1.2, 1.45, 0.08);
      const upWing = new THREE.Mesh(upGeo, fairyMat);
      upWing.position.set(isLeft ? 0.16 : -0.16, 0.12, 0);
      upWing.rotation.set(-0.15, isLeft ? 0.4 : -0.4, isLeft ? -0.3 : 0.3);

      const downGeo = new THREE.SphereGeometry(0.09, 16, 16);
      downGeo.scale(1.0, 1.35, 0.08);
      const downWing = new THREE.Mesh(downGeo, fairyMat);
      downWing.position.set(isLeft ? 0.13 : -0.13, -0.08, 0);
      downWing.rotation.set(-0.15, isLeft ? 0.3 : -0.3, isLeft ? -0.1 : 0.1);

      wingG.add(upWing, downWing);
      group.add(wingG);
    }
  } else {
    // Mecha Plasma / Phoenix Energy Wings
    for (const isLeft of [true, false]) {
      const wingG = new THREE.Group();
      wingG.name = isLeft ? 'LeftPhotonWing' : 'RightPhotonWing';
      wingG.position.set(isLeft ? 0.08 : -0.08, 0.55, -0.06);

      for (let i = 0; i < 5; i++) {
        const bladeGeo = new THREE.ConeGeometry(0.042, 0.3 + i * 0.07, 4);
        bladeGeo.scale(1, 1, 0.2);
        const blade = new THREE.Mesh(bladeGeo, i % 2 === 0 ? accentWingMat : secondaryWingMat);
        blade.position.set(isLeft ? i * 0.07 + 0.04 : -i * 0.07 - 0.04, i * 0.06, -i * 0.04);
        blade.rotation.set(-0.25, isLeft ? 0.4 : -0.4, isLeft ? -0.5 - i * 0.14 : 0.5 + i * 0.14);
        wingG.add(blade);
      }
      group.add(wingG);
    }
  }

  return group;
}

/**
 * Builds Handheld Props for Mini Games (Vật Phẩm Cầm Tay Mini Game)
 * Firmly placed in the stickman's right hand grip position.
 */
export function buildTopMesh(topId?: string, accentColor: string | number = 0x00f2fe): THREE.Group {
  const group = new THREE.Group();
  if (!topId || topId === '' || topId === 'none') return group;

  group.name = `HandheldProp_${topId}`;
  // Attached to right hand position
  group.position.set(-0.12, 0.44, 0.24);

  const t = topId.toLowerCase();
  const accentHex = new THREE.Color(accentColor);

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: accentHex,
    emissiveIntensity: 1.0,
    roughness: 0.15,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0x885500,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    metalness: 0.85,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e2025,
    roughness: 0.25,
    metalness: 0.8,
  });

  if (t.includes('trophy') || t.includes('cup')) {
    // ==========================================
    // 1. Golden Champion Trophy (Cúp Vàng Vô Địch 🏆)
    // ==========================================
    const prop = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(0.024, 0.034, 0.025, 16);
    const base = new THREE.Mesh(baseGeo, darkMetalMat);
    base.position.set(0, -0.04, 0);

    const stemGeo = new THREE.CylinderGeometry(0.01, 0.014, 0.03, 14);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    stem.position.set(0, -0.015, 0);

    const bowlGeo = new THREE.CylinderGeometry(0.045, 0.02, 0.07, 18);
    const bowl = new THREE.Mesh(bowlGeo, goldMat);
    bowl.position.set(0, 0.035, 0);

    for (const isLeft of [true, false]) {
      const handleGeo = new THREE.TorusGeometry(0.024, 0.005, 6, 14, Math.PI * 0.9);
      const handle = new THREE.Mesh(handleGeo, goldMat);
      handle.position.set(isLeft ? 0.045 : -0.045, 0.04, 0);
      handle.rotation.z = isLeft ? -Math.PI / 2 : Math.PI / 2;
      prop.add(handle);
    }

    const starGeo = new THREE.OctahedronGeometry(0.014, 0);
    const star = new THREE.Mesh(starGeo, accentMat);
    star.position.set(0, 0.04, 0.035);

    prop.add(base, stem, bowl, star);
    prop.scale.set(1.1, 1.1, 1.1);
    group.add(prop);
  } else if (t.includes('sword') || t.includes('saber') || t.includes('blade')) {
    // ==========================================
    // 2. Cyber Laser Saber (Kiếm Laser Năng Lượng 🗡️)
    // ==========================================
    const prop = new THREE.Group();
    const hiltGeo = new THREE.CylinderGeometry(0.012, 0.013, 0.12, 14);
    const hilt = new THREE.Mesh(hiltGeo, darkMetalMat);
    hilt.position.set(0, -0.02, 0);

    const guardGeo = new THREE.CylinderGeometry(0.022, 0.016, 0.02, 16);
    const guard = new THREE.Mesh(guardGeo, goldMat);
    guard.position.set(0, 0.04, 0);

    const bladeGeo = new THREE.CylinderGeometry(0.011, 0.013, 0.42, 16);
    const blade = new THREE.Mesh(bladeGeo, accentMat);
    blade.position.set(0, 0.25, 0);

    const tipGeo = new THREE.ConeGeometry(0.011, 0.04, 16);
    const tip = new THREE.Mesh(tipGeo, accentMat);
    tip.position.set(0, 0.48, 0);

    prop.add(hilt, guard, blade, tip);
    prop.rotation.set(0.35, 0, -0.2);
    group.add(prop);
  } else if (t.includes('wand') || t.includes('staff')) {
    // ==========================================
    // 3. Celestial Star Wand (Gậy Phép Tinh Tú 🪄)
    // ==========================================
    const prop = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.008, 0.011, 0.36, 12);
    const shaft = new THREE.Mesh(shaftGeo, darkMetalMat);
    shaft.position.set(0, 0.08, 0);

    const mountGeo = new THREE.SphereGeometry(0.018, 12, 12);
    const mount = new THREE.Mesh(mountGeo, goldMat);
    mount.position.set(0, 0.26, 0);

    const ringGeo = new THREE.TorusGeometry(0.032, 0.004, 6, 16);
    const ring = new THREE.Mesh(ringGeo, accentMat);
    ring.position.set(0, 0.26, 0);
    ring.rotation.x = Math.PI / 4;

    const gemGeo = new THREE.IcosahedronGeometry(0.024, 0);
    const gem = new THREE.Mesh(gemGeo, accentMat);
    gem.position.set(0, 0.26, 0);

    prop.add(shaft, mount, ring, gem);
    prop.rotation.set(0.28, 0, -0.15);
    group.add(prop);
  } else if (t.includes('torch') || t.includes('flashlight')) {
    // ==========================================
    // 4. Explorer Flashlight (Đèn Pin Khám Phá 🔦)
    // ==========================================
    const prop = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.015, 0.016, 0.14, 16);
    const torchBody = new THREE.Mesh(bodyGeo, darkMetalMat);
    torchBody.rotation.x = Math.PI / 2;

    const bezelGeo = new THREE.ConeGeometry(0.026, 0.035, 16);
    const bezel = new THREE.Mesh(bezelGeo, goldMat);
    bezel.position.set(0, 0, 0.08);
    bezel.rotation.x = -Math.PI / 2;

    const lensGeo = new THREE.CircleGeometry(0.024, 16);
    const lens = new THREE.Mesh(lensGeo, accentMat);
    lens.position.set(0, 0, 0.098);

    const beamGeo = new THREE.ConeGeometry(0.16, 0.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 0, 0.35);
    beam.rotation.x = -Math.PI / 2;

    prop.add(torchBody, bezel, lens, beam);
    prop.rotation.set(0.1, 0, 0);
    group.add(prop);
  } else if (t.includes('mic') || t.includes('idol')) {
    // ==========================================
    // 5. Golden Idol Microphone (Micro Idol Siêu Sao 🎤)
    // ==========================================
    const prop = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.011, 0.014, 0.13, 14);
    const handle = new THREE.Mesh(handleGeo, darkMetalMat);
    handle.position.set(0, -0.02, 0);

    const ringGeo = new THREE.TorusGeometry(0.016, 0.004, 6, 16);
    const ring = new THREE.Mesh(ringGeo, accentMat);
    ring.position.set(0, 0.045, 0);
    ring.rotation.x = Math.PI / 2;

    const micHeadGeo = new THREE.SphereGeometry(0.028, 16, 16);
    const micHead = new THREE.Mesh(micHeadGeo, goldMat);
    micHead.position.set(0, 0.075, 0);

    prop.add(handle, ring, micHead);
    prop.rotation.set(0.45, 0, -0.2);
    group.add(prop);
  } else if (t.includes('blaster') || t.includes('gun') || t.includes('laser')) {
    // ==========================================
    // 6. Laser Energy Blaster (Súng Bắn Tia Laser 🔫)
    // ==========================================
    const prop = new THREE.Group();
    const gripGeo = new THREE.BoxGeometry(0.02, 0.07, 0.025);
    const grip = new THREE.Mesh(gripGeo, darkMetalMat);
    grip.position.set(0, -0.02, -0.02);
    grip.rotation.x = -0.3;

    const barrelGeo = new THREE.BoxGeometry(0.03, 0.036, 0.16);
    const barrel = new THREE.Mesh(barrelGeo, darkMetalMat);
    barrel.position.set(0, 0.02, 0.04);

    const cellGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.06, 12);
    cellGeo.rotateZ(Math.PI / 2);
    const cell = new THREE.Mesh(cellGeo, accentMat);
    cell.position.set(0, 0.04, 0.02);

    const nozzleGeo = new THREE.CylinderGeometry(0.012, 0.01, 0.03, 12);
    nozzleGeo.rotateX(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeo, accentMat);
    nozzle.position.set(0, 0.02, 0.13);

    prop.add(grip, barrel, cell, nozzle);
    prop.rotation.set(0.1, 0, 0);
    group.add(prop);
  }

  return group;
}

export function buildBottomMesh(_bottomId: string): THREE.Group {
  return new THREE.Group();
}

export function buildShoesMesh(_shoesId: string): THREE.Group {
  return new THREE.Group();
}
