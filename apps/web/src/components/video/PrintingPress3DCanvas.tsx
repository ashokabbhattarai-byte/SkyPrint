"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface PrintingPress3DCanvasProps {
  progressRef: React.MutableRefObject<number>;
  onWebGLUnsupported?: () => void;
  className?: string;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Progressive CMYK ink separations painted onto the 3D paper sheet CanvasTexture.
 */
function paintPaperTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  artworkImg: HTMLImageElement | null
) {
  ctx.fillStyle = "#fdfeff";
  ctx.fillRect(0, 0, w, h);

  // Subtle paper weave & crop marks
  ctx.strokeStyle = "rgba(15, 23, 42, 0.18)";
  ctx.lineWidth = 2;
  const m = 22;
  ctx.beginPath();
  ctx.moveTo(m, m + 16);
  ctx.lineTo(m, m);
  ctx.lineTo(m + 16, m);
  ctx.moveTo(w - m - 16, m);
  ctx.lineTo(w - m, m);
  ctx.lineTo(w - m, m + 16);
  ctx.moveTo(m, h - m - 16);
  ctx.lineTo(m, h - m);
  ctx.lineTo(m + 16, h - m);
  ctx.moveTo(w - m - 16, h - m);
  ctx.lineTo(w - m, h - m);
  ctx.lineTo(w - m, h - m - 16);
  ctx.stroke();

  const cyanProg = clamp01((p - 0.15) / 0.24);
  const magentaProg = clamp01((p - 0.3) / 0.22);
  const yellowProg = clamp01((p - 0.43) / 0.2);
  const keyProg = clamp01((p - 0.54) / 0.18);

  const px = 38;
  const py = 50;
  const pw = w - 76;
  const ph = h - 100;

  if (cyanProg > 0.005) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph * cyanProg);
    ctx.clip();

    const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    grad.addColorStop(0, "#079BD3");
    grad.addColorStop(0.55, "#39C9E9");
    grad.addColorStop(1, "#246EEB");
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, pw, ph);

    if (artworkImg && artworkImg.complete && artworkImg.naturalWidth > 0) {
      ctx.globalAlpha = 0.28;
      ctx.drawImage(artworkImg, px, py, pw, ph * 0.62);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#079BD3";
    for (let i = 0; i < 6; i++) {
      ctx.globalAlpha = 0.22 + i * 0.15;
      ctx.fillRect(px + 14 + i * 24, py + ph - 22, 18, 12);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  if (magentaProg > 0.005) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph * magentaProg);
    ctx.clip();

    ctx.globalCompositeOperation = "multiply";
    const mGrad = ctx.createRadialGradient(
      px + pw * 0.76,
      py + ph * 0.28,
      10,
      px + pw * 0.76,
      py + ph * 0.28,
      pw * 0.55
    );
    mGrad.addColorStop(0, "rgba(236, 72, 153, 0.85)");
    mGrad.addColorStop(0.6, "rgba(219, 39, 119, 0.4)");
    mGrad.addColorStop(1, "rgba(236, 72, 153, 0)");
    ctx.fillStyle = mGrad;
    ctx.fillRect(px, py, pw, ph);

    if (artworkImg && artworkImg.complete && artworkImg.naturalWidth > 0) {
      ctx.globalAlpha = 0.42;
      ctx.drawImage(artworkImg, px, py, pw, ph * 0.62);
      ctx.globalAlpha = 1;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#EC4899";
    ctx.fillRect(px + 168, py + ph - 22, 18, 12);
    ctx.restore();
  }

  if (yellowProg > 0.005) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph * yellowProg);
    ctx.clip();

    if (artworkImg && artworkImg.complete && artworkImg.naturalWidth > 0) {
      ctx.globalAlpha = 0.75;
      ctx.drawImage(artworkImg, px, py, pw, ph * 0.62);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgba(247, 148, 29, 0.92)";
    ctx.beginPath();
    ctx.moveTo(px, py + ph * 0.58);
    ctx.lineTo(px + pw, py + ph * 0.52);
    ctx.lineTo(px + pw, py + ph * 0.68);
    ctx.lineTo(px, py + ph * 0.68);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#F7941D";
    ctx.fillRect(px + 194, py + ph - 22, 18, 12);
    ctx.restore();
  }

  if (keyProg > 0.005) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph * keyProg);
    ctx.clip();

    if (artworkImg && artworkImg.complete && artworkImg.naturalWidth > 0) {
      ctx.drawImage(artworkImg, px, py, pw, ph * 0.6);
    }

    ctx.fillStyle = "#0F172A";
    ctx.fillRect(px, py + ph * 0.6, pw, ph * 0.28);

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(px + 14, py + 14, pw - 28, ph - 48);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 34px system-ui, -apple-system, sans-serif";
    ctx.fillText("SKY PRINT", px + 34, py + ph * 0.72);

    ctx.fillStyle = "#39C9E9";
    ctx.font = "600 13px monospace";
    ctx.fillText("CMYK · WIDE FORMAT · ADVERTISING", px + 36, py + ph * 0.785);

    ctx.fillStyle = "#0F172A";
    ctx.fillRect(px + 220, py + ph - 22, 18, 12);
    ctx.restore();
  }
}

/** Creates a chamfered industrial side cheek geometry matching real commercial presses */
function createSideHousingGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.35, 0);
  shape.lineTo(1.35, 0);
  shape.lineTo(1.35, 0.52);
  shape.lineTo(1.08, 1.06);
  shape.lineTo(0.42, 1.24);
  shape.lineTo(-0.88, 1.24);
  shape.lineTo(-1.35, 0.92);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  // Rotate so profile sits in Y-Z plane and extrudes along X
  geom.rotateY(Math.PI / 2);
  geom.center();
  return geom;
}

/** Creates a soft studio floor contact-shadow texture */
function createContactShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.68)");
  grad.addColorStop(0.55, "rgba(0, 0, 0, 0.28)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export function PrintingPress3DCanvas({
  progressRef,
  onWebGLUnsupported,
  className = "",
}: PrintingPress3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      onWebGLUnsupported?.();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1018");
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;
    scene.fog = new THREE.Fog("#0b1018", 16, 36);

    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      65
    );
    camera.position.set(5.4, 3.25, 6.4);

    // Three-point dark studio lighting
    const hemi = new THREE.HemisphereLight(0x94a3b8, 0x0b1018, 0.65);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.1);
    keyLight.position.set(6.5, 10, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 26;
    const s = 6.5;
    keyLight.shadow.camera.left = -s;
    keyLight.shadow.camera.right = s;
    keyLight.shadow.camera.top = s;
    keyLight.shadow.camera.bottom = -s;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x39c9e9, 1.55);
    cyanRim.position.set(-6, 4.5, -5);
    scene.add(cyanRim);

    const warmRim = new THREE.DirectionalLight(0xf7941d, 0.65);
    warmRim.position.set(5, 2.5, -6);
    scene.add(warmRim);

    // Matte obsidian floor + subtle slate precision grid
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 52),
      new THREE.MeshStandardMaterial({
        color: 0x0e1520,
        roughness: 0.72,
        metalness: 0.18,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(30, 30, 0x1e2c40, 0x152030);
    grid.position.y = -0.015;
    scene.add(grid);

    const shadowTex = createContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6.8, 4.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.005;
    scene.add(contactShadow);

    // === INDUSTRIAL WIDE-FORMAT PRINTER ASSEMBLY ===
    const pressGroup = new THREE.Group();
    scene.add(pressGroup);

    const slatePowderMat = new THREE.MeshStandardMaterial({
      color: 0x1b2638,
      roughness: 0.36,
      metalness: 0.52,
    });
    const whiteEnamelMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.28,
      metalness: 0.28,
    });
    const brushedAluMat = new THREE.MeshStandardMaterial({
      color: 0xd4dee9,
      roughness: 0.22,
      metalness: 0.82,
    });
    const chromeSteelMat = new THREE.MeshStandardMaterial({
      color: 0xaab7c7,
      roughness: 0.14,
      metalness: 0.94,
    });
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.75,
      metalness: 0.05,
    });
    const cyanLedMat = new THREE.MeshStandardMaterial({
      color: 0x39c9e9,
      emissive: 0x079bd3,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });

    // 1. Open Industrial Steel Stand + Crossbars + Caster Wheels
    const standY = 0.78;
    for (const side of [-1, 1]) {
      const legFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, standY, 0.18),
        brushedAluMat
      );
      legFront.position.set(side * 2.02, standY / 2, 0.85);
      legFront.castShadow = true;
      pressGroup.add(legFront);

      const legRear = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, standY, 0.18),
        brushedAluMat
      );
      legRear.position.set(side * 2.02, standY / 2, -0.85);
      legRear.castShadow = true;
      pressGroup.add(legRear);

      const footSkid = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.08, 2.25),
        slatePowderMat
      );
      footSkid.position.set(side * 2.02, 0.08, 0);
      footSkid.castShadow = true;
      pressGroup.add(footSkid);

      // Caster wheels
      for (const zW of [-0.95, 0.95]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16),
          rubberMat
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(side * 2.02, 0.06, zW);
        pressGroup.add(wheel);
      }
    }

    // Horizontal lower tie-bar + media take-up bar
    const crossBeam = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.1, 0.12),
      slatePowderMat
    );
    crossBeam.position.set(0, 0.36, -0.2);
    crossBeam.castShadow = true;
    pressGroup.add(crossBeam);

    const lowerMediaTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.9, 20),
      chromeSteelMat
    );
    lowerMediaTube.rotation.z = Math.PI / 2;
    lowerMediaTube.position.set(0, 0.45, 0.82);
    pressGroup.add(lowerMediaTube);

    // 2. Main Platen Chassis & Vacuum Print Bed (elevated on stand!)
    const bedBaseY = 0.86;
    const chassisBeam = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.24, 1.9),
      slatePowderMat
    );
    chassisBeam.position.set(0, bedBaseY, 0);
    chassisBeam.castShadow = true;
    chassisBeam.receiveShadow = true;
    pressGroup.add(chassisBeam);

    const platenDeck = new THREE.Mesh(
      new THREE.BoxGeometry(3.84, 0.08, 1.75),
      brushedAluMat
    );
    platenDeck.position.set(0, bedBaseY + 0.15, 0.05);
    platenDeck.castShadow = true;
    platenDeck.receiveShadow = true;
    pressGroup.add(platenDeck);

    const vacuumZone = new THREE.Mesh(
      new THREE.BoxGeometry(3.38, 0.02, 1.38),
      new THREE.MeshStandardMaterial({
        color: 0x162030,
        roughness: 0.6,
        metalness: 0.35,
      })
    );
    vacuumZone.position.set(0, bedBaseY + 0.195, 0.05);
    vacuumZone.receiveShadow = true;
    pressGroup.add(vacuumZone);

    // Front heated drying apron (sloped steel lip)
    const frontApron = new THREE.Mesh(
      new THREE.BoxGeometry(3.84, 0.05, 0.62),
      brushedAluMat
    );
    frontApron.position.set(0, bedBaseY + 0.06, 1.12);
    frontApron.rotation.x = 0.28;
    frontApron.castShadow = true;
    pressGroup.add(frontApron);

    // 3. Chamfered Industrial Side Housings (no Z-fighting!)
    const sideGeom = createSideHousingGeometry();
    for (const side of [-1, 1]) {
      const housing = new THREE.Mesh(sideGeom, whiteEnamelMat);
      housing.position.set(side * 2.12, bedBaseY + 0.48, -0.05);
      housing.castShadow = true;
      housing.receiveShadow = true;
      pressGroup.add(housing);

      // Recessed slate side accent plate cleanly offset outward (+0.03)
      const sideTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.68, 1.65),
        slatePowderMat
      );
      sideTrim.position.set(side * 2.34, bedBaseY + 0.42, -0.05);
      pressGroup.add(sideTrim);

      // Subtle cyan status bar above accent plate (zero overlap!)
      const statusBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.035, 1.5),
        cyanLedMat
      );
      statusBar.position.set(side * 2.345, bedBaseY + 0.82, -0.05);
      pressGroup.add(statusBar);
    }

    // 4. Right-Tower Bulk CMYK Ink Supply Bay + Operator Touchscreen
    const inkBay = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.56, 0.82),
      slatePowderMat
    );
    inkBay.position.set(2.42, bedBaseY + 0.36, -0.35);
    inkBay.castShadow = true;
    pressGroup.add(inkBay);

    const inkTankColors = [0x079bd3, 0xec4899, 0xfacc15, 0x111827];
    inkTankColors.forEach((hex, idx) => {
      const bottle = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.34, 0.14),
        new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: idx < 3 ? 0.35 : 0.06,
          roughness: 0.2,
          transparent: true,
          opacity: 0.9,
        })
      );
      bottle.position.set(2.48, bedBaseY + 0.38, -0.62 + idx * 0.18);
      pressGroup.add(bottle);
    });

    const consoleArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.25, 0.05),
      slatePowderMat
    );
    consoleArm.position.set(2.14, bedBaseY + 0.86, 1.24);
    consoleArm.rotation.x = -0.42;
    pressGroup.add(consoleArm);

    const consoleDisplay = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.19, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0x079bd3,
        emissive: 0x39c9e9,
        emissiveIntensity: 0.72,
        roughness: 0.12,
      })
    );
    consoleDisplay.position.set(2.14, bedBaseY + 0.87, 1.265);
    consoleDisplay.rotation.x = -0.42;
    pressGroup.add(consoleDisplay);

    // 5. Overhead Gantry Bridge, Dual Linear Rails & Smoked Polycarbonate Hood
    const gantryBeam = new THREE.Mesh(
      new THREE.BoxGeometry(4.42, 0.26, 0.44),
      whiteEnamelMat
    );
    gantryBeam.position.set(0, bedBaseY + 1.02, -0.22);
    gantryBeam.castShadow = true;
    pressGroup.add(gantryBeam);

    const gantrySpine = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.12, 0.08),
      slatePowderMat
    );
    gantrySpine.position.set(0, bedBaseY + 1.0, 0.04);
    pressGroup.add(gantrySpine);

    // Dual chrome linear guide rails
    for (const yR of [bedBaseY + 0.74, bedBaseY + 0.88]) {
      const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 3.92, 16),
        chromeSteelMat
      );
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, yR, 0.05);
      pressGroup.add(rail);
    }

    // Smoked acrylic protective inspection hood
    const glassHood = new THREE.Mesh(
      new THREE.BoxGeometry(3.88, 0.44, 0.03),
      new THREE.MeshPhysicalMaterial({
        color: 0xd9f2ff,
        transparent: true,
        opacity: 0.24,
        roughness: 0.06,
        metalness: 0.05,
      })
    );
    glassHood.position.set(0, bedBaseY + 0.84, 0.42);
    glassHood.rotation.x = -0.42;
    pressGroup.add(glassHood);

    // 6. Media Unwind Roll & Chrome Pinch Rollers
    const buildRollerWithCollars = (
      radius: number,
      length: number,
      zPos: number,
      yPos: number
    ) => {
      const group = new THREE.Group();
      group.position.set(0, yPos, zPos);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 24),
        chromeSteelMat
      );
      shaft.rotation.z = Math.PI / 2;
      shaft.castShadow = true;
      group.add(shaft);

      for (const xOff of [-1.35, -0.45, 0.45, 1.35]) {
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(radius + 0.015, radius + 0.015, 0.13, 16),
          rubberMat
        );
        collar.rotation.z = Math.PI / 2;
        collar.position.x = xOff;
        group.add(collar);
      }

      const keyway = new THREE.Mesh(
        new THREE.BoxGeometry(length * 0.94, 0.02, 0.02),
        cyanLedMat
      );
      keyway.position.y = radius;
      group.add(keyway);

      pressGroup.add(group);
      return group;
    };

    const supplyRollGroup = new THREE.Group();
    supplyRollGroup.position.set(0, bedBaseY + 0.34, -1.32);
    const supplyRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 3.2, 32),
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.55,
        metalness: 0.02,
      })
    );
    supplyRoll.rotation.z = Math.PI / 2;
    supplyRoll.castShadow = true;
    supplyRollGroup.add(supplyRoll);

    // Cardboard core & steel end flanges
    for (const side of [-1, 1]) {
      const flange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24),
        slatePowderMat
      );
      flange.rotation.z = Math.PI / 2;
      flange.position.x = side * 1.62;
      supplyRollGroup.add(flange);
    }
    pressGroup.add(supplyRollGroup);

    const feedRoller = buildRollerWithCollars(0.09, 3.5, -0.58, bedBaseY + 0.3);
    const exitRoller = buildRollerWithCollars(0.09, 3.5, 0.92, bedBaseY + 0.28);

    // 7. Multi-Part CMYK Printhead Carriage + Flexible Ink Supply Tubes
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(0, bedBaseY + 0.66, 0.06);
    pressGroup.add(carriageGroup);

    const carriageChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.36, 0.54),
      slatePowderMat
    );
    carriageChassis.castShadow = true;
    carriageGroup.add(carriageChassis);

    const carriageTopCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.09, 0.5),
      brushedAluMat
    );
    carriageTopCap.position.y = 0.21;
    carriageGroup.add(carriageTopCap);

    // Machined metallic heatsink/printhead blocks + nozzles
    inkTankColors.forEach((hex, idx) => {
      const headBlock = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.28, 0.19),
        chromeSteelMat
      );
      headBlock.position.set(-0.27 + idx * 0.18, -0.04, 0.22);
      carriageGroup.add(headBlock);

      const inkWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.16, 0.03),
        new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: idx < 3 ? 0.4 : 0.08,
          roughness: 0.2,
        })
      );
      inkWindow.position.set(-0.27 + idx * 0.18, 0.0, 0.32);
      carriageGroup.add(inkWindow);
    });

    const nozzleLight = new THREE.PointLight(0x39c9e9, 0, 2.4);
    nozzleLight.position.set(0, -0.26, 0.1);
    carriageGroup.add(nozzleLight);

    // 3D CMYK ink mist spray particles
    const particleCount = 130;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const palette = [
      new THREE.Color(0x079bd3),
      new THREE.Color(0xec4899),
      new THREE.Color(0xfacc15),
      new THREE.Color(0x111827),
    ];
    for (let i = 0; i < particleCount; i++) {
      const col = palette[i % 4];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeom.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const inkSpray = new THREE.Points(particleGeom, particleMat);
    carriageGroup.add(inkSpray);

    // Curved CMYK Ink Tubes running from right ink bay up to moving carriage
    const inkTubes: THREE.Mesh[] = [];
    const tubeMaterials = inkTankColors.map(
      (hex) =>
        new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.25,
          roughness: 0.3,
          transparent: true,
          opacity: 0.82,
        })
    );
    const updateInkTubes = (carriageX: number) => {
      inkTubes.forEach((m) => {
        pressGroup.remove(m);
        m.geometry.dispose();
      });
      inkTubes.length = 0;

      for (let i = 0; i < 4; i++) {
        const zOff = -0.06 + i * 0.05;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(2.38, bedBaseY + 0.62, -0.58 + i * 0.16),
          new THREE.Vector3(2.05, bedBaseY + 1.24, -0.25 + zOff),
          new THREE.Vector3(lerp(1.4, carriageX + 0.15, 0.55), bedBaseY + 1.28, -0.05 + zOff),
          new THREE.Vector3(carriageX - 0.27 + i * 0.18, bedBaseY + 0.9, 0.14),
        ]);
        const geom = new THREE.TubeGeometry(curve, 16, 0.016, 8, false);
        const tube = new THREE.Mesh(geom, tubeMaterials[i]);
        pressGroup.add(tube);
        inkTubes.push(tube);
      }
    };
    updateInkTubes(0);

    // === DYNAMIC 3D PAPER SHEET ===
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 640;
    texCanvas.height = 900;
    const texCtx = texCanvas.getContext("2d")!;

    let loadedArtwork: HTMLImageElement | null = null;
    const artworkEl = new window.Image();
    artworkEl.crossOrigin = "anonymous";
    let forceRepaint = false;
    artworkEl.onload = () => {
      loadedArtwork = artworkEl;
      forceRepaint = true;
    };
    artworkEl.src = "/images/packaging-and-cards.webp";

    paintPaperTexture(texCtx, texCanvas.width, texCanvas.height, 0, loadedArtwork);

    const paperTexture = new THREE.CanvasTexture(texCanvas);
    paperTexture.colorSpace = THREE.SRGBColorSpace;
    paperTexture.anisotropy = 4;

    const paperGeom = new THREE.PlaneGeometry(2.85, 3.6, 20, 40);
    const posAttr = paperGeom.attributes.position as THREE.BufferAttribute;
    const basePaperCoords = new Float32Array(posAttr.array.length);
    basePaperCoords.set(posAttr.array as Float32Array);

    const paperMat = new THREE.MeshStandardMaterial({
      map: paperTexture,
      roughness: 0.34,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const paperMesh = new THREE.Mesh(paperGeom, paperMat);
    paperMesh.castShadow = true;
    paperMesh.receiveShadow = true;
    pressGroup.add(paperMesh);

    const updatePaperGeometry = (p: number) => {
      const advance = lerp(-1.55, 0.72, clamp01(p / 0.84));
      const lift = smoothstep(0.82, 1.0, p) * 0.42;

      for (let i = 0; i < posAttr.count; i++) {
        const bx = basePaperCoords[i * 3];
        const by = basePaperCoords[i * 3 + 1];
        const worldZ = -by * 0.88 + advance;

        let worldY = bedBaseY + 0.215 + lift;
        if (worldZ < -0.6) {
          const t = clamp01((-0.6 - worldZ) / 0.9);
          worldY += t * t * 0.32;
        } else if (worldZ > 0.95) {
          const t = clamp01((worldZ - 0.95) / 1.1);
          worldY -= t * t * 0.28 * (1 - lift * 2);
        }

        posAttr.setXYZ(i, bx, worldY, worldZ);
      }
      posAttr.needsUpdate = true;
      paperGeom.computeVertexNormals();
    };
    updatePaperGeometry(0);

    // === STAGE 05: 3D PRINTED PRODUCT ECOSYSTEM FAN-OUT ===
    const textureLoader = new THREE.TextureLoader();
    const signageTex = textureLoader.load("/images/large-format-signage.webp");
    signageTex.colorSpace = THREE.SRGBColorSpace;
    const packagingTex = textureLoader.load("/images/packaging-and-cards.webp");
    packagingTex.colorSpace = THREE.SRGBColorSpace;

    const showcaseGroup = new THREE.Group();
    scene.add(showcaseGroup);

    const makeCard = (
      w: number,
      h: number,
      d: number,
      color: number,
      accent: number,
      photoMap?: THREE.Texture
    ) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
          color: photoMap ? 0xffffff : color,
          map: photoMap ?? null,
          roughness: 0.32,
          metalness: 0.08,
        })
      );
      body.castShadow = true;
      g.add(body);
      if (!photoMap) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.86, h * 0.22, d + 0.01),
          new THREE.MeshStandardMaterial({
            color: accent,
            roughness: 0.25,
            emissive: accent,
            emissiveIntensity: 0.12,
          })
        );
        stripe.position.y = h * 0.22;
        g.add(stripe);
      }
      return g;
    };

    const cardStack = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const c = makeCard(
        0.75,
        0.46,
        0.025,
        0xffffff,
        i % 2 === 0 ? 0x079bd3 : 0xf7941d
      );
      c.position.set(i * 0.03, i * 0.035, -i * 0.03);
      c.rotation.z = i * 0.05;
      cardStack.add(c);
    }

    const brochure = new THREE.Group();
    for (let pIdx = -1; pIdx <= 1; pIdx++) {
      const panel = makeCard(
        0.42,
        0.78,
        0.02,
        0xf8fafc,
        pIdx === 0 ? 0x246eeb : 0x39c9e9
      );
      panel.position.x = pIdx * 0.4;
      panel.rotation.y = pIdx * -0.36;
      panel.position.z = Math.abs(pIdx) * -0.07;
      brochure.add(panel);
    }

    const pkgBox = new THREE.Group();
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.92, 0.76),
      new THREE.MeshStandardMaterial({ map: packagingTex, roughness: 0.32 })
    );
    boxMesh.castShadow = true;
    pkgBox.add(boxMesh);

    const signboard = new THREE.Group();
    const acpBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.38, 0.66, 0.08),
      slatePowderMat
    );
    acpBack.castShadow = true;
    signboard.add(acpBack);
    const acrylicFace = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.48, 0.09),
      new THREE.MeshStandardMaterial({
        map: signageTex,
        emissive: 0x079bd3,
        emissiveIntensity: 0.25,
        roughness: 0.2,
      })
    );
    acrylicFace.position.z = 0.04;
    signboard.add(acrylicFace);

    const flexBanner = makeCard(1.5, 0.88, 0.05, 0xf8fafc, 0xf7941d, packagingTex);

    const promoMug = new THREE.Group();
    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.56, 28),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    mugBody.castShadow = true;
    promoMug.add(mugBody);
    const mugBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.245, 0.238, 0.24, 28),
      new THREE.MeshStandardMaterial({ color: 0x079bd3, roughness: 0.22 })
    );
    promoMug.add(mugBand);

    const productItems: {
      obj: THREE.Object3D;
      target: THREE.Vector3;
      rot: THREE.Euler;
    }[] = [
      { obj: cardStack, target: new THREE.Vector3(-2.6, 2.0, 1.25), rot: new THREE.Euler(0.2, 0.4, -0.1) },
      { obj: brochure, target: new THREE.Vector3(-2.45, 2.4, -0.45), rot: new THREE.Euler(0.1, 0.35, 0.05) },
      { obj: pkgBox, target: new THREE.Vector3(2.45, 2.1, 1.1), rot: new THREE.Euler(0.15, -0.45, 0.05) },
      { obj: signboard, target: new THREE.Vector3(2.55, 2.65, -0.55), rot: new THREE.Euler(0.05, -0.38, -0.04) },
      { obj: flexBanner, target: new THREE.Vector3(0, 3.0, -1.35), rot: new THREE.Euler(0.08, 0, 0) },
      { obj: promoMug, target: new THREE.Vector3(1.55, 1.9, 1.95), rot: new THREE.Euler(0.1, -0.25, 0) },
    ];

    productItems.forEach(({ obj }) => {
      obj.scale.setScalar(0.001);
      obj.visible = false;
      showcaseGroup.add(obj);
    });

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.targetY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    let lastPaintedP = -1;
    let lastTubeX = 0;
    let smoothedP = progressRef.current;
    let clockTime = 0;

    const camPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      clockTime += 0.04;

      const targetP = clamp01(progressRef.current);
      smoothedP += (targetP - smoothedP) * 0.16;
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      const rollAngle = smoothedP * Math.PI * 10;
      supplyRollGroup.rotation.x = rollAngle * 0.6;
      feedRoller.rotation.x = rollAngle * 1.4;
      exitRoller.rotation.x = rollAngle * 1.4;

      const headActive =
        smoothstep(0.14, 0.22, smoothedP) * (1 - smoothstep(0.75, 0.84, smoothedP));
      const sweep = Math.sin(smoothedP * Math.PI * 16) * 1.42 * headActive;
      carriageGroup.position.x = sweep;
      nozzleLight.intensity = headActive * 1.5;

      if (Math.abs(sweep - lastTubeX) > 0.02) {
        updateInkTubes(sweep);
        lastTubeX = sweep;
      }

      inkSpray.visible = headActive > 0.05;
      if (inkSpray.visible) {
        particleMat.opacity = headActive * 0.88;
        const posArr = particleGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const lane = i % 4;
          const phase = (clockTime * 1.8 + i * 0.13) % 1;
          const nozzleX = -0.27 + lane * 0.18 + Math.sin(i * 7.1) * 0.04;
          const nozzleY = -0.2 - phase * 0.28;
          const nozzleZ = Math.cos(i * 5.3) * 0.06 + 0.18;
          posArr.setXYZ(i, nozzleX, nozzleY, nozzleZ);
        }
        posArr.needsUpdate = true;
      }

      updatePaperGeometry(smoothedP);
      if (
        forceRepaint ||
        Math.abs(smoothedP - lastPaintedP) > 0.004 ||
        lastPaintedP < 0
      ) {
        paintPaperTexture(
          texCtx,
          texCanvas.width,
          texCanvas.height,
          smoothedP,
          loadedArtwork
        );
        paperTexture.needsUpdate = true;
        lastPaintedP = smoothedP;
        forceRepaint = false;
      }

      const fanOut = smoothstep(0.8, 0.96, smoothedP);
      productItems.forEach((item, idx) => {
        if (fanOut <= 0.01) {
          item.obj.visible = false;
          return;
        }
        item.obj.visible = true;
        const stagger = clamp01((fanOut - idx * 0.05) / 0.72);
        const eased = stagger * stagger * (3 - 2 * stagger);
        item.obj.scale.setScalar(Math.max(0.001, eased));
        item.obj.position.lerpVectors(
          new THREE.Vector3(0, bedBaseY + 0.55, 0.55),
          item.target,
          eased
        );
        item.obj.rotation.set(
          item.rot.x,
          item.rot.y + pointer.x * 0.12,
          item.rot.z
        );
      });

      // Viewer-Side framing: offset target slightly left on desktop so printer owns the right 65%
      const isNarrow = container.clientWidth < 1024;
      const xOffset = isNarrow ? 0 : -1.25;

      if (smoothedP < 0.25) {
        const t = smoothstep(0, 0.25, smoothedP);
        camPos.set(lerp(5.2, 3.8, t), lerp(3.45, 2.7, t), lerp(6.6, 4.4, t));
        lookTarget.set(lerp(xOffset, xOffset * 0.85, t), lerp(1.25, 1.35, t), lerp(-0.1, 0.05, t));
      } else if (smoothedP < 0.58) {
        const t = smoothstep(0.25, 0.58, smoothedP);
        camPos.set(lerp(3.8, -2.9, t), lerp(2.7, 2.55, t), lerp(4.4, 4.2, t));
        lookTarget.set(lerp(xOffset * 0.85, xOffset * 0.55, t), 1.35, lerp(0.05, 0.3, t));
      } else if (smoothedP < 0.82) {
        const t = smoothstep(0.58, 0.82, smoothedP);
        camPos.set(lerp(-2.9, 1.9, t), lerp(2.55, 3.1, t), lerp(4.2, 5.4, t));
        lookTarget.set(lerp(xOffset * 0.55, xOffset * 0.7, t), lerp(1.35, 1.25, t), lerp(0.3, 0.75, t));
      } else {
        const t = smoothstep(0.82, 1.0, smoothedP);
        camPos.set(lerp(1.9, 0.3, t), lerp(3.1, 4.1, t), lerp(5.4, 9.4, t));
        lookTarget.set(lerp(xOffset * 0.7, xOffset * 0.45, t), lerp(1.25, 1.85, t), lerp(0.75, 0.05, t));
      }

      camera.position.set(
        camPos.x + pointer.x * 0.24,
        camPos.y - pointer.y * 0.14,
        camPos.z
      );
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      sideGeom.dispose();
      shadowTex.dispose();
      inkTubes.forEach((m) => m.geometry.dispose());
      tubeMaterials.forEach((m) => m.dispose());
      paperGeom.dispose();
      paperMat.dispose();
      paperTexture.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      signageTex.dispose();
      packagingTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef, onWebGLUnsupported]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      aria-label="Interactive 3D commercial printing press scroll experience"
    />
  );
}
