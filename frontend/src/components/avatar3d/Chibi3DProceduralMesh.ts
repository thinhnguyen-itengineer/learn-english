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
export function buildBaseBodyMesh(gender: 'MALE' | 'FEMALE' | 'UNISEX', maskedParts: string[], bodyId?: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'BaseBody_Group';

  const isFemale = gender === 'FEMALE';
  const isGolden = bodyId === 'body_chibi_golden_divine';
  const isMecha = bodyId === 'body_chibi_mecha_01';

  let skinMat: THREE.MeshStandardMaterial;
  if (isGolden) {
    skinMat = createVinylMaterial(0xffd700, {
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0xffaa00,
      emissiveIntensity: 0.25,
    });
  } else if (isMecha) {
    skinMat = createVinylMaterial(0x353b48, {
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x00cec9,
      emissiveIntensity: 0.15,
    });
  } else {
    const skinColor = isFemale ? 0xffdfd0 : 0xf7d5bc;
    skinMat = createVinylMaterial(skinColor, { roughness: 0.35 });
  }

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
  const eyeColor = isGolden ? 0xfff200 : (isFemale ? 0x9b51e0 : (isMecha ? 0x00cec9 : 0x00b894));
  const eyeWhiteMat = createVinylMaterial(0xffffff, { roughness: 0.1 });
  const eyeIrisMat = createVinylMaterial(eyeColor, { roughness: 0.1, emissive: eyeColor, emissiveIntensity: 0.35 });
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
  const blushMat = createVinylMaterial(isGolden ? 0xffaa00 : 0xff8aa0, { roughness: 0.5, transparent: true, opacity: 0.6 });
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

    const rightFoot = leftFoot.clone();
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

    const capGeo = new THREE.SphereGeometry(0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const cap = new THREE.Mesh(capGeo, hairMat);
    cap.position.set(0, 0.77, -0.02);
    group.add(cap);

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
    // Sweet idol pink twintails with star clips
    const pinkMat = createVinylMaterial(0xff7675, { roughness: 0.3 });
    const starMat = createVinylMaterial(0xfdcb6e, { roughness: 0.15, emissive: 0xfdcb6e, emissiveIntensity: 0.3 });

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

    const ahogeCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.98, 0),
      new THREE.Vector3(0.06, 1.12, 0.05),
      new THREE.Vector3(0.12, 1.08, 0.02)
    );
    const ahogeGeo = new THREE.TubeGeometry(ahogeCurve, 12, 0.012, 8, false);
    const ahoge = new THREE.Mesh(ahogeGeo, pinkMat);
    group.add(ahoge);

    const createTwintail = (isLeft: boolean) => {
      const tailGroup = new THREE.Group();
      const x = isLeft ? 0.22 : -0.22;
      tailGroup.position.set(x, 0.82, -0.06);

      const starGeo = new THREE.OctahedronGeometry(0.04, 0);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(0, 0, 0.04);
      tailGroup.add(star);

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
  } else if (hairId === 'hair_anime_bob_blonde') {
    // Anime Blonde Bob
    const goldMat = createVinylMaterial(0xffeaa7, { roughness: 0.28 });
    const capGeo = new THREE.SphereGeometry(0.255, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.set(0, 0.77, 0);
    group.add(cap);

    // Bob sides
    for (const isLeft of [true, false]) {
      const bobGeo = new THREE.CylinderGeometry(0.05, 0.03, 0.18, 12);
      const bob = new THREE.Mesh(bobGeo, goldMat);
      bob.position.set(isLeft ? 0.2 : -0.2, 0.72, 0.06);
      bob.rotation.z = isLeft ? -0.15 : 0.15;
      group.add(bob);
    }
  } else if (hairId === 'hair_kpop_curtain_brown') {
    // K-Pop Curtain Brown
    const brownMat = createVinylMaterial(0x6d4c41, { roughness: 0.35 });
    const capGeo = new THREE.SphereGeometry(0.252, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const cap = new THREE.Mesh(capGeo, brownMat);
    cap.position.set(0, 0.77, -0.02);
    group.add(cap);

    // Curtain waves
    for (const isLeft of [true, false]) {
      const waveCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(isLeft ? 0.03 : -0.03, 0.94, 0.2),
        new THREE.Vector3(isLeft ? 0.14 : -0.14, 0.88, 0.18),
        new THREE.Vector3(isLeft ? 0.18 : -0.18, 0.78, 0.12)
      );
      const waveGeo = new THREE.TubeGeometry(waveCurve, 12, 0.025, 8, false);
      const wave = new THREE.Mesh(waveGeo, brownMat);
      group.add(wave);
    }
  } else if (hairId === 'hair_magical_ponytail_purple') {
    // Magical Ponytail Purple
    const purpleMat = createVinylMaterial(0x9b59b6, { roughness: 0.25, emissive: 0x8e44ad, emissiveIntensity: 0.2 });
    const ribbonMat = createVinylMaterial(0xff7675, { roughness: 0.2 });

    const capGeo = new THREE.SphereGeometry(0.255, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const cap = new THREE.Mesh(capGeo, purpleMat);
    cap.position.set(0, 0.77, -0.01);
    group.add(cap);

    // High ponytail base
    const ponyCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.95, -0.18),
      new THREE.Vector3(0, 1.05, -0.32),
      new THREE.Vector3(0, 0.68, -0.38)
    );
    const ponyGeo = new THREE.TubeGeometry(ponyCurve, 16, 0.045, 10, false);
    const pony = new THREE.Mesh(ponyGeo, purpleMat);

    // Ribbon bow
    const bowGeo = new THREE.TorusGeometry(0.04, 0.012, 8, 16);
    const bow = new THREE.Mesh(bowGeo, ribbonMat);
    bow.position.set(0, 0.95, -0.18);

    group.add(pony, bow);
  } else {
    // Cyber neon dreadlocks (default/neon)
    const dreadMat = createVinylMaterial(0x0984e3, { roughness: 0.2, emissive: 0x00cec9, emissiveIntensity: 0.35 });
    const capGeo = new THREE.SphereGeometry(0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const cap = new THREE.Mesh(capGeo, dreadMat);
    cap.position.set(0, 0.77, -0.02);
    group.add(cap);

    for (let k = 0; k < 6; k++) {
      const angle = (k / 6) * Math.PI * 1.2 - Math.PI * 0.6;
      const dreadCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(Math.sin(angle) * 0.18, 0.88, Math.cos(angle) * 0.12 - 0.05),
        new THREE.Vector3(Math.sin(angle) * 0.26, 0.68, Math.cos(angle) * 0.18 - 0.1),
        new THREE.Vector3(Math.sin(angle) * 0.2, 0.52, Math.cos(angle) * 0.15 - 0.12)
      );
      const dreadGeo = new THREE.TubeGeometry(dreadCurve, 12, 0.022, 8, false);
      const dread = new THREE.Mesh(dreadGeo, dreadMat);
      group.add(dread);
    }
  }

  return group;
}

/**
 * Builds 3D Top Mesh
 */
export function buildTopMesh(topId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Top_${topId}`;

  if (topId === 'top_zingspeed_black_hoodie') {
    const hoodieMat = createVinylMaterial(0x1e272e, { roughness: 0.35 });
    const yellowMat = createVinylMaterial(0xffd32a, { roughness: 0.2, emissive: 0xffa801, emissiveIntensity: 0.25 });

    const torsoGeo = new THREE.CylinderGeometry(0.125, 0.14, 0.28, 24);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, 0.44, 0);

    const pocketGeo = new THREE.BoxGeometry(0.14, 0.08, 0.05);
    const pocket = new THREE.Mesh(pocketGeo, hoodieMat);
    pocket.position.set(0, 0.38, 0.115);

    const boltGeo = new THREE.ConeGeometry(0.025, 0.12, 4);
    boltGeo.scale(1, 1, 0.3);
    const bolt = new THREE.Mesh(boltGeo, yellowMat);
    bolt.position.set(0, 0.48, 0.13);
    bolt.rotation.z = 0.4;

    const createSleeve = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.14 : -0.14;
      g.position.set(x, 0.44, 0);
      g.rotation.z = isLeft ? -0.2 : 0.2;

      const sleeveGeo = new THREE.CylinderGeometry(0.045, 0.042, 0.22, 16);
      const sleeve = new THREE.Mesh(sleeveGeo, hoodieMat);
      const cuffGeo = new THREE.CylinderGeometry(0.044, 0.044, 0.03, 16);
      const cuff = new THREE.Mesh(cuffGeo, yellowMat);
      cuff.position.set(0, -0.1, 0);

      g.add(sleeve, cuff);
      return g;
    };

    group.add(torso, pocket, bolt, createSleeve(true), createSleeve(false));
  } else if (topId === 'top_zingspeed_white_hoodie') {
    const whiteMat = createVinylMaterial(0xf5f6fa, { roughness: 0.3 });
    const pinkMat = createVinylMaterial(0xff9ff3, { roughness: 0.25 });

    const torsoGeo = new THREE.CylinderGeometry(0.13, 0.145, 0.28, 24);
    const torso = new THREE.Mesh(torsoGeo, whiteMat);
    torso.position.set(0, 0.44, 0);

    const hoodBackGeo = new THREE.SphereGeometry(0.1, 16, 16);
    hoodBackGeo.scale(1.2, 0.6, 0.8);
    const hoodBack = new THREE.Mesh(hoodBackGeo, pinkMat);
    hoodBack.position.set(0, 0.54, -0.1);

    group.add(torso, hoodBack);
  } else if (topId === 'top_oxford_scholar_blazer') {
    // Oxford Scholar Blazer (Navy with red tie and gold button accents)
    const navyMat = createVinylMaterial(0x192a56, { roughness: 0.3 });
    const shirtMat = createVinylMaterial(0xffffff, { roughness: 0.2 });
    const tieMat = createVinylMaterial(0xc0392b, { roughness: 0.2 });
    const goldMat = createVinylMaterial(0xf1c40f, { roughness: 0.1, metalness: 0.7 });

    const blazerGeo = new THREE.CylinderGeometry(0.125, 0.14, 0.28, 24);
    const blazer = new THREE.Mesh(blazerGeo, navyMat);
    blazer.position.set(0, 0.44, 0);

    // Shirt collar
    const collarGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.set(0, 0.54, 0.11);

    // Tie
    const tieGeo = new THREE.ConeGeometry(0.025, 0.12, 3);
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 0.48, 0.125);
    tie.rotation.x = Math.PI;

    // Gold crest
    const crestGeo = new THREE.CircleGeometry(0.02, 12);
    const crest = new THREE.Mesh(crestGeo, goldMat);
    crest.position.set(0.07, 0.48, 0.125);

    group.add(blazer, collar, tie, crest);
  } else if (topId === 'top_angel_silk_tunic') {
    // Celestial silk tunic with golden celestial trim
    const silkMat = createVinylMaterial(0xf5f6fa, { roughness: 0.18, metalness: 0.1 });
    const trimMat = createVinylMaterial(0xfbc531, { roughness: 0.15, metalness: 0.6, emissive: 0xfbc531, emissiveIntensity: 0.3 });

    const tunicGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 24);
    const tunic = new THREE.Mesh(tunicGeo, silkMat);
    tunic.position.set(0, 0.43, 0);

    const trimGeo = new THREE.TorusGeometry(0.122, 0.01, 8, 24);
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.52, 0);
    trim.rotation.x = Math.PI / 2;

    group.add(tunic, trim);
  } else if (topId === 'top_princess_lolita_dress') {
    // Lolita Dress with cute lace ribbons
    const dressMat = createVinylMaterial(0xff9ff3, { roughness: 0.25 });
    const laceMat = createVinylMaterial(0xffffff, { roughness: 0.3 });

    const topGeo = new THREE.CylinderGeometry(0.115, 0.13, 0.26, 24);
    const top = new THREE.Mesh(topGeo, dressMat);
    top.position.set(0, 0.45, 0);

    const bowGeo = new THREE.TorusGeometry(0.035, 0.012, 8, 16);
    const bow = new THREE.Mesh(bowGeo, laceMat);
    bow.position.set(0, 0.52, 0.12);

    group.add(top, bow);
  } else if (topId === 'top_teddy_bear_hoodie') {
    // Cute teddy bear hoodie
    const bearMat = createVinylMaterial(0x8d6e63, { roughness: 0.4 });
    const innerEarMat = createVinylMaterial(0xffccbc, { roughness: 0.3 });

    const torsoGeo = new THREE.CylinderGeometry(0.13, 0.145, 0.28, 24);
    const torso = new THREE.Mesh(torsoGeo, bearMat);
    torso.position.set(0, 0.44, 0);

    // Front paw pouch
    const pouchGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
    const pouch = new THREE.Mesh(pouchGeo, innerEarMat);
    pouch.position.set(0, 0.38, 0.12);

    group.add(torso, pouch);
  } else if (topId === 'top_archmage_lexicon_robe') {
    // Archmage Lexicon Robe
    const robeMat = createVinylMaterial(0x341f97, { roughness: 0.25 });
    const starGoldMat = createVinylMaterial(0xf1c40f, { roughness: 0.1, metalness: 0.7, emissive: 0xf1c40f, emissiveIntensity: 0.3 });

    const robeGeo = new THREE.CylinderGeometry(0.125, 0.15, 0.3, 24);
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.set(0, 0.43, 0);

    const runeGeo = new THREE.OctahedronGeometry(0.025, 0);
    const rune = new THREE.Mesh(runeGeo, starGoldMat);
    rune.position.set(0, 0.5, 0.13);

    group.add(robe, rune);
  } else {
    // Cyber racing jacket
    const darkMat = createVinylMaterial(0x2d3436, { roughness: 0.2, metalness: 0.3 });
    const cyanNeonMat = createVinylMaterial(0x00cec9, { roughness: 0.1, emissive: 0x00cec9, emissiveIntensity: 0.6 });

    const jacketGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.27, 24);
    const jacket = new THREE.Mesh(jacketGeo, darkMat);
    jacket.position.set(0, 0.44, 0);

    const stripeGeo = new THREE.BoxGeometry(0.015, 0.25, 0.02);
    const stripe = new THREE.Mesh(stripeGeo, cyanNeonMat);
    stripe.position.set(0.06, 0.44, 0.12);

    group.add(jacket, stripe);
  }

  return group;
}

/**
 * Builds 3D Bottom Mesh
 */
export function buildBottomMesh(bottomId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Bottom_${bottomId}`;

  if (bottomId === 'bot_zingspeed_cargo_shorts') {
    const shortsMat = createVinylMaterial(0x2d3436, { roughness: 0.4 });
    const orangeMat = createVinylMaterial(0xff7675, { roughness: 0.3, emissive: 0xff7675, emissiveIntensity: 0.2 });

    const waistGeo = new THREE.CylinderGeometry(0.128, 0.125, 0.08, 24);
    const waist = new THREE.Mesh(waistGeo, shortsMat);
    waist.position.set(0, 0.31, 0);

    const createLegShort = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.24, 0);

      const legGeo = new THREE.CylinderGeometry(0.06, 0.065, 0.12, 16);
      const leg = new THREE.Mesh(legGeo, shortsMat);

      const pocketGeo = new THREE.BoxGeometry(0.03, 0.06, 0.04);
      const pocket = new THREE.Mesh(pocketGeo, shortsMat);
      pocket.position.set(isLeft ? 0.055 : -0.055, 0, 0);

      const stripeGeo = new THREE.BoxGeometry(0.01, 0.1, 0.01);
      const stripe = new THREE.Mesh(stripeGeo, orangeMat);
      stripe.position.set(isLeft ? 0.06 : -0.06, 0, 0.03);

      g.add(leg, pocket, stripe);
      return g;
    };

    group.add(waist, createLegShort(true), createLegShort(false));
  } else if (bottomId === 'bot_zingspeed_pleated_skirt' || bottomId === 'bot_school_uniform_skirt') {
    // Pleated Skirt
    const skirtColor = bottomId === 'bot_school_uniform_skirt' ? 0x353b48 : 0x0984e3;
    const skirtMat = createVinylMaterial(skirtColor, { roughness: 0.35 });
    const whiteLineMat = createVinylMaterial(0xffffff, { roughness: 0.2 });

    const skirtGeo = new THREE.ConeGeometry(0.18, 0.14, 24, 1, true);
    const skirt = new THREE.Mesh(skirtGeo, skirtMat);
    skirt.position.set(0, 0.25, 0);

    const ringGeo = new THREE.TorusGeometry(0.17, 0.005, 8, 24);
    const ring = new THREE.Mesh(ringGeo, whiteLineMat);
    ring.position.set(0, 0.185, 0);
    ring.rotation.x = Math.PI / 2;

    group.add(skirt, ring);
  } else if (bottomId === 'bot_streetwear_cargo_pants') {
    // Streetwear cargo pants
    const pantsMat = createVinylMaterial(0x57606f, { roughness: 0.4 });
    const createPantsLeg = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.2, 0);

      const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.22, 16);
      const leg = new THREE.Mesh(legGeo, pantsMat);

      const pocketGeo = new THREE.BoxGeometry(0.035, 0.07, 0.05);
      const pocket = new THREE.Mesh(pocketGeo, pantsMat);
      pocket.position.set(isLeft ? 0.055 : -0.055, 0, 0);

      g.add(leg, pocket);
      return g;
    };

    group.add(createPantsLeg(true), createPantsLeg(false));
  } else if (bottomId === 'bot_lolita_frill_skirt') {
    // Ruffled Lolita Frill Skirt
    const frillMat = createVinylMaterial(0xff9ff3, { roughness: 0.3 });
    const laceMat = createVinylMaterial(0xffffff, { roughness: 0.2 });

    const tier1Geo = new THREE.ConeGeometry(0.16, 0.1, 24, 1, true);
    const tier1 = new THREE.Mesh(tier1Geo, frillMat);
    tier1.position.set(0, 0.28, 0);

    const tier2Geo = new THREE.ConeGeometry(0.2, 0.12, 24, 1, true);
    const tier2 = new THREE.Mesh(tier2Geo, laceMat);
    tier2.position.set(0, 0.22, 0);

    group.add(tier1, tier2);
  } else {
    // Cyber neon joggers
    const darkMat = createVinylMaterial(0x1e272e, { roughness: 0.3 });
    const neonCyanMat = createVinylMaterial(0x00cec9, { roughness: 0.1, emissive: 0x00cec9, emissiveIntensity: 0.6 });

    const waistGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.06, 24);
    const waist = new THREE.Mesh(waistGeo, darkMat);
    waist.position.set(0, 0.31, 0);

    const createJoggerLeg = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.2, 0);

      const legGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.22, 16);
      const leg = new THREE.Mesh(legGeo, darkMat);

      const neonGeo = new THREE.BoxGeometry(0.008, 0.2, 0.01);
      const neon = new THREE.Mesh(neonGeo, neonCyanMat);
      neon.position.set(isLeft ? 0.05 : -0.05, 0, 0);

      g.add(leg, neon);
      return g;
    };

    group.add(waist, createJoggerLeg(true), createJoggerLeg(false));
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
    const leatherMat = createVinylMaterial(0x1e272e, { roughness: 0.3 });
    const yellowMat = createVinylMaterial(0xfeca57, { roughness: 0.2 });

    const createBoot = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.06, 0.01);

      const shaftGeo = new THREE.CylinderGeometry(0.048, 0.046, 0.12, 16);
      const shaft = new THREE.Mesh(shaftGeo, leatherMat);

      const footGeo = new THREE.BoxGeometry(0.075, 0.06, 0.15);
      const foot = new THREE.Mesh(footGeo, leatherMat);
      foot.position.set(0, -0.04, 0.02);

      const soleGeo = new THREE.BoxGeometry(0.082, 0.02, 0.16);
      const sole = new THREE.Mesh(soleGeo, yellowMat);
      sole.position.set(0, -0.065, 0.02);

      g.add(shaft, foot, sole);
      return g;
    };

    group.add(createBoot(true), createBoot(false));
  } else if (shoesId === 'foot_school_loafers') {
    const brownLeatherMat = createVinylMaterial(0x4a2810, { roughness: 0.25 });
    const sockMat = createVinylMaterial(0xffffff, { roughness: 0.4 });

    const createLoafer = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.05, 0.01);

      const sockGeo = new THREE.CylinderGeometry(0.045, 0.044, 0.08, 16);
      const sock = new THREE.Mesh(sockGeo, sockMat);
      sock.position.set(0, 0.02, 0);

      const shoeGeo = new THREE.BoxGeometry(0.072, 0.05, 0.14);
      const shoe = new THREE.Mesh(shoeGeo, brownLeatherMat);
      shoe.position.set(0, -0.03, 0.02);

      g.add(sock, shoe);
      return g;
    };

    group.add(createLoafer(true), createLoafer(false));
  } else if (shoesId === 'foot_cyber_neon_sneakers' || shoesId === 'foot_zingspeed_pastel_sneakers') {
    const isNeon = shoesId === 'foot_cyber_neon_sneakers';
    const mainMat = createVinylMaterial(isNeon ? 0x1e272e : 0xff9ff3, { roughness: 0.3 });
    const soleMat = createVinylMaterial(isNeon ? 0x00cec9 : 0xffffff, {
      roughness: 0.2,
      emissive: isNeon ? 0x00cec9 : 0x000000,
      emissiveIntensity: isNeon ? 0.5 : 0,
    });

    const createSneaker = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.065 : -0.065;
      g.position.set(x, 0.05, 0.02);

      const upperGeo = new THREE.SphereGeometry(0.05, 16, 16);
      upperGeo.scale(0.85, 0.8, 1.4);
      const upper = new THREE.Mesh(upperGeo, mainMat);

      const soleGeo = new THREE.BoxGeometry(0.08, 0.035, 0.16);
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.set(0, -0.03, 0);

      g.add(upper, sole);
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
 * Builds 3D Accessory Mesh (Accessories, 3D Wings, Headwear)
 */
export function buildAccessoryMesh(accId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `Accessory_${accId}`;

  if (accId === 'acc_cat_paw_sling_bag') {
    const bagMat = createVinylMaterial(0xffffff, { roughness: 0.3 });
    const pinkPawMat = createVinylMaterial(0xff9ff3, { roughness: 0.2, emissive: 0xff9ff3, emissiveIntensity: 0.2 });
    const strapMat = createVinylMaterial(0x576574, { roughness: 0.4 });

    const pouchGeo = new THREE.SphereGeometry(0.065, 20, 20);
    pouchGeo.scale(1.1, 1.0, 0.6);
    const pouch = new THREE.Mesh(pouchGeo, bagMat);
    pouch.position.set(0.12, 0.38, 0.12);

    const centerPadGeo = new THREE.SphereGeometry(0.024, 16, 16);
    centerPadGeo.scale(1.1, 0.9, 0.3);
    const centerPad = new THREE.Mesh(centerPadGeo, pinkPawMat);
    centerPad.position.set(0.12, 0.37, 0.155);

    for (let i = -1; i <= 1; i++) {
      const toeGeo = new THREE.SphereGeometry(0.012, 12, 12);
      toeGeo.scale(1, 1, 0.3);
      const toe = new THREE.Mesh(toeGeo, pinkPawMat);
      toe.position.set(0.12 + i * 0.024, 0.41, 0.155);
      group.add(toe);
    }

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
  } else if (accId === 'acc_angel_celestial_wings') {
    // 3D Celestial Angel Wings
    const featherWhiteMat = createVinylMaterial(0xffffff, { roughness: 0.2, emissive: 0xffffff, emissiveIntensity: 0.25 });
    const featherGoldMat = createVinylMaterial(0xfeca57, { roughness: 0.15, emissive: 0xfeca57, emissiveIntensity: 0.4 });

    const createWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      g.position.set(isLeft ? 0.08 : -0.08, 0.52, -0.1);

      // Feather layers
      for (let i = 0; i < 5; i++) {
        const fGeo = new THREE.ConeGeometry(0.04, 0.24 + i * 0.06, 6);
        fGeo.scale(1, 1, 0.3);
        const fMesh = new THREE.Mesh(fGeo, i % 2 === 0 ? featherWhiteMat : featherGoldMat);
        fMesh.position.set(isLeft ? i * 0.05 + 0.04 : -i * 0.05 - 0.04, i * 0.05 + 0.02, -i * 0.04);
        fMesh.rotation.set(-0.2, isLeft ? 0.4 : -0.4, isLeft ? -0.4 - i * 0.12 : 0.4 + i * 0.12);
        g.add(fMesh);
      }
      return g;
    };

    group.add(createWing(true), createWing(false));
  } else if (accId === 'acc_devil_bat_wings') {
    // 3D Demonic Shadow Bat Wings
    const batMat = createVinylMaterial(0x2d132c, { roughness: 0.25, emissive: 0x801336, emissiveIntensity: 0.3 });
    const boneMat = createVinylMaterial(0x1a1a1a, { roughness: 0.1 });

    const createBatWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      g.position.set(isLeft ? 0.08 : -0.08, 0.54, -0.1);

      // Curved bone strut
      const boneCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.15 : -0.15, 0.18, -0.05),
        new THREE.Vector3(isLeft ? 0.32 : -0.32, 0.12, -0.12)
      );
      const boneGeo = new THREE.TubeGeometry(boneCurve, 12, 0.015, 8, false);
      const bone = new THREE.Mesh(boneGeo, boneMat);

      // Wing membrane
      for (let i = 0; i < 3; i++) {
        const memGeo = new THREE.ConeGeometry(0.06, 0.22, 4);
        memGeo.scale(1, 1, 0.15);
        const mem = new THREE.Mesh(memGeo, batMat);
        mem.position.set(isLeft ? 0.1 + i * 0.08 : -0.1 - i * 0.08, -0.02 - i * 0.04, -0.08);
        mem.rotation.set(-0.1, isLeft ? 0.3 : -0.3, isLeft ? -0.6 - i * 0.2 : 0.6 + i * 0.2);
        g.add(mem);
      }

      g.add(bone);
      return g;
    };

    group.add(createBatWing(true), createBatWing(false));
  } else if (accId === 'acc_fairy_butterfly_wings') {
    // 3D Ethereal Fairy Butterfly Wings
    const fairyMat = createVinylMaterial(0x74b9ff, {
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      emissive: 0xa29bfe,
      emissiveIntensity: 0.5,
    });

    const createFairyWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      g.position.set(isLeft ? 0.08 : -0.08, 0.52, -0.1);

      // Upper petal
      const upGeo = new THREE.SphereGeometry(0.12, 16, 16);
      upGeo.scale(1.2, 1.4, 0.1);
      const upWing = new THREE.Mesh(upGeo, fairyMat);
      upWing.position.set(isLeft ? 0.14 : -0.14, 0.1, 0);
      upWing.rotation.set(-0.1, isLeft ? 0.4 : -0.4, isLeft ? -0.3 : 0.3);

      // Lower petal
      const downGeo = new THREE.SphereGeometry(0.08, 16, 16);
      downGeo.scale(1.0, 1.3, 0.1);
      const downWing = new THREE.Mesh(downGeo, fairyMat);
      downWing.position.set(isLeft ? 0.12 : -0.12, -0.08, 0);
      downWing.rotation.set(-0.1, isLeft ? 0.3 : -0.3, isLeft ? -0.1 : 0.1);

      g.add(upWing, downWing);
      return g;
    };

    group.add(createFairyWing(true), createFairyWing(false));
  } else if (accId === 'acc_phoenix_fire_wings') {
    // 3D Blazing Phoenix Flame Wings
    const flameOrangeMat = createVinylMaterial(0xe17055, { roughness: 0.15, emissive: 0xd63031, emissiveIntensity: 0.7 });
    const flameGoldMat = createVinylMaterial(0xfdcb6e, { roughness: 0.1, emissive: 0xf39c12, emissiveIntensity: 0.8 });

    const createFlameWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      g.position.set(isLeft ? 0.08 : -0.08, 0.52, -0.1);

      for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.ConeGeometry(0.045, 0.28 + i * 0.06, 5);
        bladeGeo.scale(1, 1, 0.25);
        const blade = new THREE.Mesh(bladeGeo, i % 2 === 0 ? flameOrangeMat : flameGoldMat);
        blade.position.set(isLeft ? i * 0.06 + 0.04 : -i * 0.06 - 0.04, i * 0.06, -i * 0.05);
        blade.rotation.set(-0.25, isLeft ? 0.4 : -0.4, isLeft ? -0.5 - i * 0.15 : 0.5 + i * 0.15);
        g.add(blade);
      }
      return g;
    };

    group.add(createFlameWing(true), createFlameWing(false));
  } else if (accId === 'acc_cat_ears_headband') {
    // Neko Cat Ears Headband
    const bandMat = createVinylMaterial(0x1e272e, { roughness: 0.3 });
    const earOuterMat = createVinylMaterial(0xffffff, { roughness: 0.4 });
    const earInnerMat = createVinylMaterial(0xff7675, { roughness: 0.3 });

    const bandGeo = new THREE.TorusGeometry(0.24, 0.008, 8, 24, Math.PI);
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.set(0, 0.76, 0);
    band.rotation.x = -Math.PI / 2;

    const createEar = (isLeft: boolean) => {
      const g = new THREE.Group();
      const x = isLeft ? 0.14 : -0.14;
      g.position.set(x, 0.98, 0);
      g.rotation.z = isLeft ? -0.25 : 0.25;

      const outerGeo = new THREE.ConeGeometry(0.045, 0.1, 4);
      outerGeo.scale(1, 1, 0.6);
      const outer = new THREE.Mesh(outerGeo, earOuterMat);

      const innerGeo = new THREE.ConeGeometry(0.03, 0.07, 4);
      innerGeo.scale(1, 1, 0.4);
      const inner = new THREE.Mesh(innerGeo, earInnerMat);
      inner.position.set(0, -0.01, 0.015);

      g.add(outer, inner);
      return g;
    };

    group.add(band, createEar(true), createEar(false));
  } else if (accId === 'acc_angel_halo') {
    // Holy Golden Halo
    const haloMat = createVinylMaterial(0xfeca57, { roughness: 0.05, metalness: 0.8, emissive: 0xffd32a, emissiveIntensity: 0.75 });
    const haloGeo = new THREE.TorusGeometry(0.12, 0.012, 12, 32);
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 1.08, -0.04);
    halo.rotation.x = Math.PI / 2 - 0.2;
    group.add(halo);
  } else if (accId === 'acc_cyber_visor') {
    // Holo Cyber Visor
    const visorMat = createVinylMaterial(0x00cec9, {
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
      emissive: 0x00cec9,
      emissiveIntensity: 0.7,
    });
    const frameMat = createVinylMaterial(0x2d3436, { roughness: 0.2 });

    const visorCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.18, 0.74, 0.14),
      new THREE.Vector3(0, 0.74, 0.26),
      new THREE.Vector3(0.18, 0.74, 0.14)
    );
    const visorGeo = new THREE.TubeGeometry(visorCurve, 20, 0.018, 8, false);
    const visor = new THREE.Mesh(visorGeo, visorMat);

    const frameGeo = new THREE.BoxGeometry(0.02, 0.04, 0.04);
    const leftFrame = new THREE.Mesh(frameGeo, frameMat);
    leftFrame.position.set(0.18, 0.74, 0.14);
    const rightFrame = leftFrame.clone();
    rightFrame.position.set(-0.18, 0.74, 0.14);

    group.add(visor, leftFrame, rightFrame);
  } else if (accId === 'acc_wizard_hat') {
    // Arcane Wizard Hat
    const velvetMat = createVinylMaterial(0x341f97, { roughness: 0.4 });
    const goldMat = createVinylMaterial(0xf1c40f, { roughness: 0.1, metalness: 0.8, emissive: 0xf1c40f, emissiveIntensity: 0.4 });

    // Hat brim
    const brimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 32);
    const brim = new THREE.Mesh(brimGeo, velvetMat);
    brim.position.set(0, 0.94, -0.02);
    brim.rotation.x = -0.15;

    // Cone crown
    const coneGeo = new THREE.ConeGeometry(0.18, 0.32, 24);
    const cone = new THREE.Mesh(coneGeo, velvetMat);
    cone.position.set(0, 1.08, -0.06);
    cone.rotation.x = -0.3;

    // Star buckle
    const starGeo = new THREE.OctahedronGeometry(0.03, 0);
    const star = new THREE.Mesh(starGeo, goldMat);
    star.position.set(0, 0.98, 0.12);

    group.add(brim, cone, star);
  } else {
    // Cyber photon wings (default accessory)
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
