import * as THREE from 'three';

// Stylized Vinyl Toy material builder
export function createVinylMaterial(color: string | number, options: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.08,
    ...options,
  });
}

/**
 * Builds 3D Chibi BaseBody Mesh
 */
export function buildBaseBodyMesh(gender: 'MALE' | 'FEMALE' | 'UNISEX', maskedParts: string[]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'BaseBody_Group';

  const isFemale = gender === 'FEMALE';
  const skinColor = isFemale ? 0xffdfd0 : 0xf7d5bc;
  const skinMat = createVinylMaterial(skinColor, { roughness: 0.35 });

  // 1. Head (Chibi Head: big, rounded cute head)
  const headGeo = new THREE.SphereGeometry(0.24, 32, 28);
  headGeo.scale(1.05, 0.95, 1.0);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.name = 'Mat_Head';
  headMesh.position.set(0, 0.76, 0);
  headMesh.castShadow = true;
  group.add(headMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.045, 16, 16);
  earGeo.scale(0.5, 1, 0.8);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(0.23, 0.74, 0);
  const rightEar = leftEar.clone();
  rightEar.position.set(-0.23, 0.74, 0);
  group.add(leftEar, rightEar);

  // Eyes (Big expressive anime eyes)
  const eyeColor = isFemale ? 0x9b51e0 : 0x00b894; // Amethyst purple or Emerald green
  const eyeWhiteMat = createVinylMaterial(0xffffff, { roughness: 0.1 });
  const eyeIrisMat = createVinylMaterial(eyeColor, { roughness: 0.1, emissive: eyeColor, emissiveIntensity: 0.2 });
  const pupilMat = createVinylMaterial(0x1a1a1a, { roughness: 0.05 });
  const highlightMat = createVinylMaterial(0xffffff, { roughness: 0.0, emissive: 0xffffff, emissiveIntensity: 0.5 });

  const createEye = (isLeft: boolean) => {
    const eyeGroup = new THREE.Group();
    const xPos = isLeft ? 0.085 : -0.085;

    // Eyeball base
    const eyeWhiteGeo = new THREE.SphereGeometry(0.06, 20, 20);
    eyeWhiteGeo.scale(1.0, 1.2, 0.4);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhite.position.set(xPos, 0.74, 0.2);

    // Iris
    const irisGeo = new THREE.SphereGeometry(0.042, 16, 16);
    irisGeo.scale(1.0, 1.15, 0.2);
    const iris = new THREE.Mesh(irisGeo, eyeIrisMat);
    iris.position.set(xPos, 0.74, 0.222);

    // Pupil
    const pupilGeo = new THREE.SphereGeometry(0.022, 16, 16);
    pupilGeo.scale(1.0, 1.1, 0.2);
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(xPos, 0.74, 0.228);

    // Specular highlight star
    const specGeo = new THREE.SphereGeometry(0.012, 12, 12);
    const spec = new THREE.Mesh(specGeo, highlightMat);
    spec.position.set(xPos + (isLeft ? 0.018 : -0.01), 0.76, 0.233);

    eyeGroup.add(eyeWhite, iris, pupil, spec);
    return eyeGroup;
  };

  group.add(createEye(true));
  group.add(createEye(false));

  // Cheeks (Cute blushing cheeks)
  const blushMat = createVinylMaterial(0xff8aa0, { roughness: 0.5, transparent: true, opacity: 0.6 });
  const blushGeo = new THREE.CircleGeometry(0.035, 16);
  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(0.12, 0.68, 0.218);
  leftBlush.rotation.y = 0.2;
  const rightBlush = new THREE.Mesh(blushGeo, blushMat);
  rightBlush.position.set(-0.12, 0.68, 0.218);
  rightBlush.rotation.y = -0.2;
  group.add(leftBlush, rightBlush);

  // Sweet smile mouth
  const mouthMat = createVinylMaterial(0xd63031, { roughness: 0.2 });
  const mouthGeo = new THREE.TorusGeometry(0.03, 0.008, 12, 16, Math.PI * 0.9);
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.rotation.set(0, 0, Math.PI);
  mouth.position.set(0, 0.66, 0.23);
  group.add(mouth);

  // 2. Torso (Body)
  if (!maskedParts.includes('Mat_Torso')) {
    const torsoGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.26, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, skinMat);
    torsoMesh.name = 'Mat_Torso';
    torsoMesh.position.set(0, 0.45, 0);
    torsoMesh.castShadow = true;
    group.add(torsoMesh);
  }

  // 3. Arms & Hands
  if (!maskedParts.includes('Mat_Arms')) {
    const armGeo = new THREE.CylinderGeometry(0.032, 0.035, 0.22, 16);
    const handGeo = new THREE.SphereGeometry(0.042, 16, 16);

    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(0.14, 0.44, 0);
    leftArm.rotation.z = -0.2;

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0.17, 0.32, 0.02);

    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(-0.14, 0.44, 0);
    rightArm.rotation.z = 0.2;

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(-0.17, 0.32, 0.02);

    group.add(leftArm, leftHand, rightArm, rightHand);
  }

  // 4. Legs & Feet
  if (!maskedParts.includes('Mat_Legs')) {
    const legGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.24, 16);
    const leftLeg = new THREE.Mesh(legGeo, skinMat);
    leftLeg.position.set(0.065, 0.22, 0);

    const rightLeg = new THREE.Mesh(legGeo, skinMat);
    rightLeg.position.set(-0.065, 0.22, 0);

    group.add(leftLeg, rightLeg);
  }

  if (!maskedParts.includes('Mat_Feet')) {
    const footGeo = new THREE.SphereGeometry(0.042, 16, 16);
    footGeo.scale(0.8, 0.6, 1.4);
    const leftFoot = new THREE.Mesh(footGeo, skinMat);
    leftFoot.position.set(0.065, 0.04, 0.02);

    const rightFoot = new THREE.Mesh(footGeo, skinMat);
    rightFoot.position.set(-0.065, 0.04, 0.02);

    group.add(leftFoot, rightFoot);
  }

  return group;
}

/**
 * Builds 3D Hair Mesh
 */
export function buildHairMesh(hairId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Hair_${hairId}`;

  if (hairId === 'hair_zingspeed_spiky_grey') {
    // Spiky grey racer hair with yellow streak
    const hairMat = createVinylMaterial(0x576574, { roughness: 0.25 });
    const streakMat = createVinylMaterial(0xfeca57, { roughness: 0.2, emissive: 0xfeca57, emissiveIntensity: 0.15 });

    // Main hair cap
    const capGeo = new THREE.SphereGeometry(0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const cap = new THREE.Mesh(capGeo, hairMat);
    cap.position.set(0, 0.77, -0.02);
    group.add(cap);

    // Spikes
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI - Math.PI / 2;
      const spikeGeo = new THREE.ConeGeometry(0.05, 0.16, 6);
      const isStreak = i === 2 || i === 3;
      const spike = new THREE.Mesh(spikeGeo, isStreak ? streakMat : hairMat);
      spike.position.set(Math.sin(angle) * 0.18, 0.95 + (i % 2) * 0.04, Math.cos(angle) * 0.12);
      spike.rotation.set(-0.2, 0, -angle * 0.8);
      group.add(spike);
    }
  } else if (hairId === 'hair_zingspeed_pink_twintails') {
    // Sweet idol pink twintails with star hair clips
    const pinkMat = createVinylMaterial(0xff7675, { roughness: 0.3 });
    const starMat = createVinylMaterial(0xfdcb6e, { roughness: 0.15, emissive: 0xfdcb6e, emissiveIntensity: 0.3 });

    // Hair cap
    const capGeo = new THREE.SphereGeometry(0.255, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const cap = new THREE.Mesh(capGeo, pinkMat);
    cap.position.set(0, 0.77, -0.01);
    group.add(cap);

    // Front bangs
    const bangGeo = new THREE.ConeGeometry(0.04, 0.12, 6);
    for (let j = -2; j <= 2; j++) {
      const bang = new THREE.Mesh(bangGeo, pinkMat);
      bang.position.set(j * 0.05, 0.88, 0.19);
      bang.rotation.set(Math.PI - 0.2, 0, j * 0.15);
      group.add(bang);
    }

    // Playful Ahoge strand on top
    const ahogeCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.98, 0),
      new THREE.Vector3(0.06, 1.12, 0.05),
      new THREE.Vector3(0.12, 1.08, 0.02)
    );
    const ahogeGeo = new THREE.TubeGeometry(ahogeCurve, 12, 0.012, 8, false);
    const ahoge = new THREE.Mesh(ahogeGeo, pinkMat);
    group.add(ahoge);

    // Bouncy long twintails (Left & Right)
    const createTwintail = (isLeft: boolean) => {
      const tailGroup = new THREE.Group();
      const x = isLeft ? 0.22 : -0.22;
      tailGroup.position.set(x, 0.82, -0.06);

      // Star clip
      const starGeo = new THREE.OctahedronGeometry(0.04, 0);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(0, 0, 0.04);
      tailGroup.add(star);

      // Tail segments
      const tailCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.08 : -0.08, -0.22, 0.04),
        new THREE.Vector3(isLeft ? 0.03 : -0.03, -0.42, 0.01)
      );
      const tailGeo = new THREE.TubeGeometry(tailCurve, 16, 0.038, 10, false);
      const tail = new THREE.Mesh(tailGeo, pinkMat);
      tailGroup.add(tail);

      return tailGroup;
    };

    group.add(createTwintail(true), createTwintail(false));
  } else {
    // Cyber neon dreadlocks
    const dreadMat = createVinylMaterial(0x0984e3, { roughness: 0.2, emissive: 0x00cec9, emissiveIntensity: 0.35 });
    const capGeo = new THREE.SphereGeometry(0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const cap = new THREE.Mesh(capGeo, dreadMat);
    cap.position.set(0, 0.77, -0.02);
    group.add(cap);

    for (let k = 0; k < 12; k++) {
      const angle = (k / 12) * Math.PI * 2;
      const dreadCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(Math.cos(angle) * 0.16, 0.85, Math.sin(angle) * 0.16),
        new THREE.Vector3(Math.cos(angle) * 0.26, 0.72, Math.sin(angle) * 0.26),
        new THREE.Vector3(Math.cos(angle) * 0.22, 0.55, Math.sin(angle) * 0.22)
      );
      const tubeGeo = new THREE.TubeGeometry(dreadCurve, 10, 0.022, 8, false);
      const tube = new THREE.Mesh(tubeGeo, dreadMat);
      group.add(tube);
    }
  }

  return group;
}

/**
 * Builds 3D Top (Hoodie / Jacket) Mesh
 */
export function buildTopMesh(topId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Top_${topId}`;

  if (topId === 'top_zingspeed_black_hoodie') {
    const hoodieMat = createVinylMaterial(0x1e272e, { roughness: 0.35 });
    const neonCyanMat = createVinylMaterial(0x00d2d3, { roughness: 0.1, emissive: 0x00d2d3, emissiveIntensity: 0.4 });
    const goldYellowMat = createVinylMaterial(0xff9f43, { roughness: 0.2, emissive: 0xff9f43, emissiveIntensity: 0.3 });

    // Main hoodie body
    const bodyGeo = new THREE.CylinderGeometry(0.125, 0.14, 0.28, 24);
    const body = new THREE.Mesh(bodyGeo, hoodieMat);
    body.position.set(0, 0.45, 0);
    body.castShadow = true;
    group.add(body);

    // Kangaroo front pocket
    const pocketGeo = new THREE.BoxGeometry(0.16, 0.08, 0.06);
    const pocket = new THREE.Mesh(pocketGeo, hoodieMat);
    pocket.position.set(0, 0.37, 0.11);
    group.add(pocket);

    // ZingSpeed speed wings emblem on chest
    const wingGeo = new THREE.OctahedronGeometry(0.045, 0);
    wingGeo.scale(1.8, 0.8, 0.2);
    const emblem = new THREE.Mesh(wingGeo, goldYellowMat);
    emblem.position.set(0, 0.48, 0.13);
    group.add(emblem);

    // Racing sleeve stripes
    const sleeveGeo = new THREE.CylinderGeometry(0.046, 0.048, 0.24, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeo, hoodieMat);
    leftSleeve.position.set(0.145, 0.43, 0);
    leftSleeve.rotation.z = -0.2;

    const leftStripeGeo = new THREE.TorusGeometry(0.05, 0.008, 8, 16);
    const leftStripe = new THREE.Mesh(leftStripeGeo, neonCyanMat);
    leftStripe.position.set(0.145, 0.42, 0);
    leftStripe.rotation.x = Math.PI / 2;

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.set(-0.145, 0.43, 0);
    rightSleeve.rotation.z = 0.2;

    const rightStripe = leftStripe.clone();
    rightStripe.position.set(-0.145, 0.42, 0);

    group.add(leftSleeve, leftStripe, rightSleeve, rightStripe);

    // Collar hood fold
    const hoodCollarGeo = new THREE.TorusGeometry(0.11, 0.038, 12, 24);
    const hoodCollar = new THREE.Mesh(hoodCollarGeo, hoodieMat);
    hoodCollar.position.set(0, 0.58, -0.03);
    hoodCollar.rotation.x = Math.PI / 3;
    group.add(hoodCollar);
  } else if (topId === 'top_zingspeed_white_hoodie') {
    const whiteMat = createVinylMaterial(0xf8f9fa, { roughness: 0.3 });
    const pastelPinkMat = createVinylMaterial(0xff9ff3, { roughness: 0.2, emissive: 0xff9ff3, emissiveIntensity: 0.2 });

    const bodyGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.3, 24);
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.set(0, 0.44, 0);
    group.add(body);

    const pocketGeo = new THREE.BoxGeometry(0.17, 0.09, 0.06);
    const pocket = new THREE.Mesh(pocketGeo, pastelPinkMat);
    pocket.position.set(0, 0.35, 0.12);
    group.add(pocket);

    // Sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.048, 0.05, 0.24, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeo, whiteMat);
    leftSleeve.position.set(0.15, 0.43, 0);
    leftSleeve.rotation.z = -0.2;
    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.set(-0.15, 0.43, 0);
    rightSleeve.rotation.z = 0.2;
    group.add(leftSleeve, rightSleeve);
  } else {
    // Cyber racing jacket
    const darkMat = createVinylMaterial(0x2d3436, { roughness: 0.25 });
    const neonLEDMat = createVinylMaterial(0x00cec9, { roughness: 0.1, emissive: 0x00cec9, emissiveIntensity: 0.6 });

    const bodyGeo = new THREE.CylinderGeometry(0.13, 0.145, 0.28, 24);
    const body = new THREE.Mesh(bodyGeo, darkMat);
    body.position.set(0, 0.45, 0);
    group.add(body);

    // LED Trim lines
    const lineGeo = new THREE.BoxGeometry(0.015, 0.22, 0.04);
    const leftLED = new THREE.Mesh(lineGeo, neonLEDMat);
    leftLED.position.set(0.07, 0.45, 0.12);
    const rightLED = leftLED.clone();
    rightLED.position.set(-0.07, 0.45, 0.12);
    group.add(leftLED, rightLED);
  }

  return group;
}

/**
 * Builds 3D Bottom Mesh (Shorts / Skirt / Joggers)
 */
export function buildBottomMesh(bottomId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Bottom_${bottomId}`;

  if (bottomId === 'bot_zingspeed_cargo_shorts') {
    const shortsMat = createVinylMaterial(0x2f3640, { roughness: 0.35 });
    const strapMat = createVinylMaterial(0xfeca57, { roughness: 0.2, emissive: 0xfeca57, emissiveIntensity: 0.2 });

    const hipsGeo = new THREE.CylinderGeometry(0.135, 0.14, 0.12, 20);
    const hips = new THREE.Mesh(hipsGeo, shortsMat);
    hips.position.set(0, 0.32, 0);
    group.add(hips);

    const legShortGeo = new THREE.CylinderGeometry(0.065, 0.062, 0.14, 16);
    const leftLeg = new THREE.Mesh(legShortGeo, shortsMat);
    leftLeg.position.set(0.068, 0.21, 0);

    const pocketGeo = new THREE.BoxGeometry(0.035, 0.065, 0.065);
    const leftPocket = new THREE.Mesh(pocketGeo, strapMat);
    leftPocket.position.set(0.12, 0.21, 0);

    const rightLeg = leftLeg.clone();
    rightLeg.position.set(-0.068, 0.21, 0);

    const rightPocket = leftPocket.clone();
    rightPocket.position.set(-0.12, 0.21, 0);

    group.add(leftLeg, leftPocket, rightLeg, rightPocket);
  } else if (bottomId === 'bot_zingspeed_pleated_skirt') {
    const navyMat = createVinylMaterial(0x192a56, { roughness: 0.3 });
    const whiteLineMat = createVinylMaterial(0xffffff, { roughness: 0.2 });

    const skirtGeo = new THREE.ConeGeometry(0.19, 0.16, 24, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, navyMat);
    skirt.position.set(0, 0.24, 0);
    group.add(skirt);

    const rimGeo = new THREE.TorusGeometry(0.19, 0.008, 8, 24);
    const rim = new THREE.Mesh(rimGeo, whiteLineMat);
    rim.position.set(0, 0.16, 0);
    rim.rotation.x = Math.PI / 2;
    group.add(rim);
  } else {
    // Cyber neon joggers
    const joggerMat = createVinylMaterial(0x353b48, { roughness: 0.3 });
    const holoMat = createVinylMaterial(0xa29bfe, { roughness: 0.15, emissive: 0x6c5ce7, emissiveIntensity: 0.4 });

    const legGeo = new THREE.CylinderGeometry(0.062, 0.05, 0.24, 16);
    const leftLeg = new THREE.Mesh(legGeo, joggerMat);
    leftLeg.position.set(0.065, 0.2, 0);

    const stripeGeo = new THREE.BoxGeometry(0.015, 0.24, 0.02);
    const leftStripe = new THREE.Mesh(stripeGeo, holoMat);
    leftStripe.position.set(0.11, 0.2, 0);

    const rightLeg = leftLeg.clone();
    rightLeg.position.set(-0.065, 0.2, 0);

    const rightStripe = leftStripe.clone();
    rightStripe.position.set(-0.11, 0.2, 0);

    group.add(leftLeg, leftStripe, rightLeg, rightStripe);
  }

  return group;
}

/**
 * Builds 3D Shoes Mesh
 */
export function buildShoesMesh(shoesId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Shoes_${shoesId}`;

  if (shoesId === 'foot_zingspeed_combat_boots') {
    const bootMat = createVinylMaterial(0x1e272e, { roughness: 0.25 });
    const laceMat = createVinylMaterial(0xfeca57, { roughness: 0.15, emissive: 0xfeca57, emissiveIntensity: 0.25 });

    const createBoot = (isLeft: boolean) => {
      const bootGroup = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      bootGroup.position.set(x, 0.06, 0);

      // Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.052, 0.055, 0.14, 16);
      const shaft = new THREE.Mesh(shaftGeo, bootMat);
      shaft.position.set(0, 0.05, 0);

      // Foot base & chunky sole
      const soleGeo = new THREE.BoxGeometry(0.08, 0.04, 0.16);
      const sole = new THREE.Mesh(soleGeo, bootMat);
      sole.position.set(0, -0.03, 0.03);

      // Gold laces
      for (let i = 0; i < 3; i++) {
        const laceGeo = new THREE.BoxGeometry(0.05, 0.008, 0.02);
        const lace = new THREE.Mesh(laceGeo, laceMat);
        lace.position.set(0, 0.03 + i * 0.03, 0.055);
        bootGroup.add(lace);
      }

      bootGroup.add(shaft, sole);
      return bootGroup;
    };

    group.add(createBoot(true), createBoot(false));
  } else if (shoesId === 'foot_zingspeed_pastel_sneakers') {
    const platformMat = createVinylMaterial(0xffffff, { roughness: 0.2 });
    const pastelMat = createVinylMaterial(0xd980fa, { roughness: 0.3 });

    const createSneaker = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.04, 0);

      const soleGeo = new THREE.BoxGeometry(0.085, 0.05, 0.17);
      const sole = new THREE.Mesh(soleGeo, platformMat);
      sole.position.set(0, -0.01, 0.03);

      const upperGeo = new THREE.SphereGeometry(0.052, 16, 16);
      upperGeo.scale(0.8, 0.7, 1.3);
      const upper = new THREE.Mesh(upperGeo, pastelMat);
      upper.position.set(0, 0.04, 0.02);

      g.add(sole, upper);
      return g;
    };

    group.add(createSneaker(true), createSneaker(false));
  } else {
    // Maglev hover skates
    const cyanThrusterMat = createVinylMaterial(0x00cec9, { roughness: 0.1, emissive: 0x00cec9, emissiveIntensity: 0.7 });
    const frameMat = createVinylMaterial(0x2d3436, { roughness: 0.2 });

    const createSkate = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.05, 0);

      const frameGeo = new THREE.BoxGeometry(0.08, 0.04, 0.18);
      const frame = new THREE.Mesh(frameGeo, frameMat);

      const ringGeo = new THREE.TorusGeometry(0.03, 0.008, 8, 16);
      const frontRing = new THREE.Mesh(ringGeo, cyanThrusterMat);
      frontRing.position.set(0, -0.03, 0.05);
      frontRing.rotation.x = Math.PI / 2;

      const backRing = frontRing.clone();
      backRing.position.set(0, -0.03, -0.05);

      g.add(frame, frontRing, backRing);
      return g;
    };

    group.add(createSkate(true), createSkate(false));
  }

  return group;
}

/**
 * Builds 3D Accessory Mesh (Neko Bag / Star Choker / Photon Wings)
 */
export function buildAccessoryMesh(accId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Accessory_${accId}`;

  if (accId === 'acc_cat_paw_sling_bag') {
    const bagMat = createVinylMaterial(0xffffff, { roughness: 0.3 });
    const pinkPawMat = createVinylMaterial(0xff9ff3, { roughness: 0.2, emissive: 0xff9ff3, emissiveIntensity: 0.2 });
    const strapMat = createVinylMaterial(0x576574, { roughness: 0.4 });

    // Main paw pouch
    const pouchGeo = new THREE.SphereGeometry(0.065, 20, 20);
    pouchGeo.scale(1.1, 1.0, 0.6);
    const pouch = new THREE.Mesh(pouchGeo, bagMat);
    pouch.position.set(0.12, 0.38, 0.12);

    // Center big pad
    const centerPadGeo = new THREE.SphereGeometry(0.024, 16, 16);
    centerPadGeo.scale(1.1, 0.9, 0.3);
    const centerPad = new THREE.Mesh(centerPadGeo, pinkPawMat);
    centerPad.position.set(0.12, 0.37, 0.155);

    // 3 small toe pads
    for (let i = -1; i <= 1; i++) {
      const toeGeo = new THREE.SphereGeometry(0.012, 12, 12);
      toeGeo.scale(1, 1, 0.3);
      const toe = new THREE.Mesh(toeGeo, pinkPawMat);
      toe.position.set(0.12 + i * 0.024, 0.41, 0.155);
      group.add(toe);
    }

    // Strap across torso
    const strapCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.12, 0.52, -0.06),
      new THREE.Vector3(0.02, 0.45, 0.12),
      new THREE.Vector3(0.12, 0.38, 0.12)
    );
    const strapGeo = new THREE.TubeGeometry(strapCurve, 16, 0.008, 8, false);
    const strap = new THREE.Mesh(strapGeo, strapMat);

    group.add(pouch, centerPad, strap);
  } else if (accId === 'acc_star_choker') {
    const chokerMat = createVinylMaterial(0x1e272e, { roughness: 0.3 });
    const goldStarMat = createVinylMaterial(0xfeca57, { roughness: 0.1, emissive: 0xfeca57, emissiveIntensity: 0.4 });

    const bandGeo = new THREE.TorusGeometry(0.075, 0.007, 8, 24);
    const band = new THREE.Mesh(bandGeo, chokerMat);
    band.position.set(0, 0.58, 0);
    band.rotation.x = Math.PI / 2;

    const starGeo = new THREE.OctahedronGeometry(0.022, 0);
    const star = new THREE.Mesh(starGeo, goldStarMat);
    star.position.set(0, 0.58, 0.082);

    group.add(band, star);
  } else if (accId === 'acc_cyber_photon_wings') {
    const wingMat = createVinylMaterial(0x00cec9, {
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
      emissive: 0x00cec9,
      emissiveIntensity: 0.6,
    });

    const createWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      g.name = isLeft ? 'LeftPhotonWing' : 'RightPhotonWing';
      const x = isLeft ? 0.08 : -0.08;
      g.position.set(x, 0.52, -0.08);

      for (let i = 0; i < 4; i++) {
        const featherGeo = new THREE.BoxGeometry(0.015, 0.06 + i * 0.04, 0.2 + i * 0.08);
        const feather = new THREE.Mesh(featherGeo, wingMat);
        feather.position.set(isLeft ? i * 0.04 : -i * 0.04, i * 0.04, -i * 0.06);
        feather.rotation.set(-0.2, isLeft ? 0.3 : -0.3, isLeft ? -0.2 : 0.2);
        g.add(feather);
      }

      return g;
    };

    group.add(createWing(true), createWing(false));
  }

  return group;
}
