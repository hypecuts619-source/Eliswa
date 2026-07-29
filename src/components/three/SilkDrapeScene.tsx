import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

/**
 * A WebGL drape of handloom silk.
 *
 * Everything is drawn by one custom shader: the vertex stage folds a plane with
 * layered sine waves and derives its normal analytically, the fragment stage
 * paints kasavu zari selvedges and a pallu band onto the cloth and lights it
 * with a silk-like specular. Colours are taken straight from the site palette,
 * so nothing new enters the brand.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uSpeed;
  uniform float uSeed;
  uniform float uFold;
  uniform vec2  uSize;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vFold;

  // The cloth hangs from its top edge, so the folds are shallow at the rod and
  // open out toward the hem. Everything below is in 0..1 cloth coordinates.
  float envelope(float v) {
    return 0.05 + pow(clamp(1.0 - v, 0.0, 1.0), 1.45) * 1.30;
  }

  // Vertical folds — the deep gathers, finer creases on top, and a slow sway.
  float drape(vec2 p) {
    float u = p.x / uSize.x + 0.5;
    float v = p.y / uSize.y + 0.5;
    float t = uTime * uSpeed + uSeed;

    float w  = sin(u * 40.0 * uFold + t * 0.52) * 0.30;
          w += sin(u * 21.0 * uFold - t * 0.37) * 0.42;
          w += sin(u * 74.0 * uFold - t * 0.85 + v * 1.4) * 0.09;
          w += sin(v *  2.6         + t * 0.63) * 0.18;

    return w * envelope(v) * uAmp;
  }

  void main() {
    vUv = uv;

    vec3 p = position;
    float e = 0.03;
    float h  = drape(p.xy);
    float hx = drape(p.xy + vec2(e, 0.0));
    float hy = drape(p.xy + vec2(0.0, e));

    p.z += h;
    vFold = h / max(uAmp, 0.0001);

    // Normal from the two tangents of the displaced surface.
    vec3 tangentX = vec3(e, 0.0, hx - h);
    vec3 tangentY = vec3(0.0, e, hy - h);
    vNormal = normalize(normalMatrix * normalize(cross(tangentX, tangentY)));

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uZariStrength;
  uniform vec3  uCloth;
  uniform vec3  uClothAlt;
  uniform vec3  uZari;
  uniform vec3  uZariDeep;
  uniform vec3  uShade;
  uniform vec3  uRim;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vFold;

  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;

    vec3 V = normalize(-vViewPos);
    vec3 keyLight  = normalize(vec3(0.34, 0.72, 0.86));
    vec3 fillLight = normalize(vec3(-0.80, -0.10, 0.42));

    // ---- Cloth body -------------------------------------------------
    vec3 col = mix(uCloth, uClothAlt, smoothstep(0.0, 1.0, vUv.y));

    // ---- Kasavu zari ---------------------------------------------------
    // A solid gold band down each selvedge, a hairline pinstripe just inside
    // it, and the pallu across the hem: how a kasavu is actually laid out.
    float edge = min(vUv.x, 1.0 - vUv.x);
    float selvedge  = 1.0 - smoothstep(0.055, 0.070, edge);
    float pinstripe = 1.0 - smoothstep(0.0045, 0.0080, abs(edge - 0.100));
    float pallu     = (1.0 - smoothstep(0.100, 0.112, vUv.y)) * smoothstep(0.010, 0.020, vUv.y);
    float palluLine = 1.0 - smoothstep(0.0045, 0.0080, abs(vUv.y - 0.140));

    float zariMask = clamp(
      selvedge + pinstripe * 0.85 + pallu * 0.9 + palluLine * 0.8, 0.0, 1.0
    ) * uZariStrength;

    // Fine gold threads, running lengthwise on the selvedge and across the pallu.
    float threads = 0.5 + 0.3 * sin(vUv.y * 130.0) + 0.2 * sin(vUv.x * 52.0);
    col = mix(col, mix(uZariDeep, uZari, clamp(threads, 0.0, 1.0)), zariMask);

    // ---- Woven texture: crossed warp and weft ------------------------
    // Kept subtle; anything crisper aliases into a moire at this scale.
    float warp = 0.5 + 0.5 * sin(vUv.x * 210.0);
    float weft = 0.5 + 0.5 * sin(vUv.y * 300.0);
    float weave = warp * weft;

    // ---- Lighting: single warm key against a dark stage ---------------
    float diffuse = max(dot(N, keyLight), 0.0);
    float fill    = max(dot(N, fillLight), 0.0) * 0.22;
    vec3  half_   = normalize(keyLight + V);
    float specular = pow(max(dot(N, half_), 0.0), 54.0) * (0.22 + zariMask * 1.15)
                   * (0.86 + weave * 0.28);

    // Troughs sit in their own shadow, the way folded cloth does.
    float occlusion = 1.0 - clamp(-vFold * 0.70, 0.0, 0.62);
    col *= (0.15 + diffuse * 0.90 + fill) * occlusion;
    col = mix(col, uShade, clamp(-vFold * 0.55, 0.0, 0.55));
    col += specular;

    // Rim light picks the silhouette out of the dark ground.
    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += uRim * rim * 0.34;

    // ---- A sheen travelling down the drape ----------------------------
    float sweep = smoothstep(0.22, 0.0, abs(fract(vUv.y + uTime * 0.05) - 0.5));
    col += sweep * 0.10 * (0.30 + diffuse);

    gl_FragColor = vec4(col, uOpacity);

    #include <colorspace_fragment>
  }
`;

/** Palette colours, converted once. */
const PALETTE = {
  cream: '#FAF6EB',
  pearl: '#F5EBE6',
  rose: '#C1838F',
  vintage: '#4A1521',
  zari: '#cf958f',
  zariDeep: '#a86058',
  zariLight: '#f2d5d1',
};

interface DrapeConfig {
  size: [number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  amplitude: number;
  /** Multiplies the fold frequency, so no two lengths gather identically. */
  fold: number;
  speed: number;
  seed: number;
  opacity: number;
  zariStrength: number;
  cloth: string;
  clothAlt: string;
  renderOrder: number;
}

/**
 * Three lengths of kasavu hung side by side, as they would be on a rail in the
 * weaving shed: an off-white cotton, the house's rose tissue, and a pearl silk.
 */
const DRAPES: DrapeConfig[] = [
  {
    size: [2.6, 4.5],
    position: [-2.55, 0.05, -1.3],
    rotation: [0, 0.33, 0.025],
    amplitude: 0.34,
    fold: 0.82,
    speed: 0.78,
    seed: 12.4,
    opacity: 1,
    zariStrength: 0.9,
    cloth: PALETTE.pearl,
    clothAlt: PALETTE.rose,
    renderOrder: 0,
  },
  {
    // The centre length, closest to the reader.
    size: [3.1, 5.0],
    position: [0, -0.05, 0],
    rotation: [0, -0.03, -0.008],
    amplitude: 0.42,
    fold: 1.0,
    speed: 1,
    seed: 0,
    opacity: 1,
    zariStrength: 1,
    cloth: PALETTE.cream,
    clothAlt: PALETTE.pearl,
    renderOrder: 2,
  },
  {
    size: [2.5, 4.4],
    position: [2.5, 0.02, -1.15],
    rotation: [0, -0.36, -0.03],
    amplitude: 0.32,
    fold: 1.28,
    speed: 0.88,
    seed: 31.7,
    opacity: 1,
    zariStrength: 0.9,
    cloth: PALETTE.zariLight,
    clothAlt: PALETTE.cream,
    renderOrder: 1,
  },
];

/** Width and height the arrangement needs, used to fit it to the canvas. */
const ARRANGEMENT = { width: 9.4, height: 6.1 };

function Drape({ config }: { config: DrapeConfig }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: config.opacity < 1,
      side: THREE.DoubleSide,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: config.amplitude },
        uSpeed: { value: config.speed },
        uSeed: { value: config.seed },
        uFold: { value: config.fold },
        uSize: { value: new THREE.Vector2(config.size[0], config.size[1]) },
        uOpacity: { value: config.opacity },
        uZariStrength: { value: config.zariStrength },
        uCloth: { value: new THREE.Color(config.cloth) },
        uClothAlt: { value: new THREE.Color(config.clothAlt) },
        uZari: { value: new THREE.Color(PALETTE.zari) },
        uZariDeep: { value: new THREE.Color(PALETTE.zariDeep) },
        uShade: { value: new THREE.Color(PALETTE.vintage) },
        uRim: { value: new THREE.Color(PALETTE.zariLight) },
      },
    });
  }, [config]);

  // Free the GPU program when the drape unmounts.
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  // Denser tessellation across the width, where the vertical folds gather.
  const segments: [number, number] = [
    Math.round(config.size[0] * 42),
    Math.round(config.size[1] * 18),
  ];

  return (
    <mesh
      position={config.position}
      rotation={config.rotation}
      renderOrder={config.renderOrder}
      material={material}
    >
      <planeGeometry args={[config.size[0], config.size[1], segments[0], segments[1]]} />
    </mesh>
  );
}

/** Slow-drifting motes of gold zari dust. */
function ZariDust({ count = 90 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uColor: { value: new THREE.Color(PALETTE.zariLight) },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        uniform float uPixelRatio;
        varying float vFade;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (7.0 * uPixelRatio) / max(-mvPosition.z, 0.5);
          vFade = smoothstep(-4.0, 1.0, mvPosition.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float alpha = (1.0 - smoothstep(0.18, 0.5, d)) * 0.65 * vFade;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor, alpha);
          #include <colorspace_fragment>
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  const { viewport } = useThree();

  useFrame((state, delta) => {
    material.uniforms.uPixelRatio.value = Math.min(viewport.dpr, 2);

    const pts = pointsRef.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += delta * 0.09;
      arr[i] += Math.sin(state.clock.elapsedTime * 0.35 + i) * delta * 0.03;
      if (arr[i + 1] > 2.8) arr[i + 1] = -2.8;
    }
    attr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/**
 * Eases the whole arrangement toward the pointer and the section's scroll
 * position, so the cloth feels like it responds to the reader.
 */
function Stage({
  progressRef,
  interactive,
}: {
  progressRef: MutableRefObject<number>;
  interactive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Fit the whole rail into whatever shape the canvas happens to be.
  const fit = Math.min(
    viewport.width / ARRANGEMENT.width,
    viewport.height / ARRANGEMENT.height,
    1.15
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const damp = 1 - Math.pow(0.001, delta);
    // Scroll turns the rail slowly past the reader as the section goes by.
    const scrollTurn = (progressRef.current - 0.5) * 0.30;
    const targetY = interactive ? state.pointer.x * 0.14 + scrollTurn : scrollTurn;
    const targetX = interactive ? state.pointer.y * -0.07 : 0;

    group.rotation.x += (targetX - group.rotation.x) * damp;
    group.rotation.y += (targetY - group.rotation.y) * damp;
    group.position.y += (0.15 - progressRef.current * 0.3 - group.position.y) * damp;
  });

  return (
    <group ref={groupRef} scale={fit}>
      {DRAPES.map((config, i) => (
        <Drape key={i} config={config} />
      ))}
      <ZariDust />
    </group>
  );
}

export interface SilkDrapeSceneProps {
  /** 0 → 1 as the section travels through the viewport. */
  progressRef: MutableRefObject<number>;
  /** False when the section is off-screen: the render loop stops entirely. */
  active: boolean;
  /** False under `prefers-reduced-motion`: a single still frame is drawn. */
  animate: boolean;
}

export default function SilkDrapeScene({ progressRef, active, animate }: SilkDrapeSceneProps) {
  return (
    <Canvas
      frameloop={!animate ? 'demand' : active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      style={{ pointerEvents: 'none' }}
    >
      <Stage progressRef={progressRef} interactive={animate} />
    </Canvas>
  );
}
