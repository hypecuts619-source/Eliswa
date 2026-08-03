import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

/**
 * A Kerala pit loom, weaving.
 *
 * The whole thing is one continuous length of cloth: taut across the loom bed,
 * curving over the breast beam, then falling into folds below. Weaving advances
 * it a pick at a time, so the cloth and its zari travel down the drape as they
 * are made. Above the fell line the warp opens and closes its shed, a shuttle
 * flies through, and the reed beats the weft home.
 *
 * Every colour is a site palette token. Nothing new enters the brand.
 */

const PALETTE = {
  cream: '#FAF6EB',
  pearl: '#F5EBE6',
  rose: '#C1838F',
  vintage: '#4A1521',
  olive: '#5E6032',
  zari: '#cf958f',
  zariDeep: '#a86058',
  zariLight: '#f2d5d1',

  // Taken from the Onam kasavu this scene reproduces. `oliveLight` and
  // `roseLight` are the existing olive and rose tokens lifted toward cream,
  // which is how they read woven as fine stripes on an off-white ground.
  // `lilac` is the one hue the site palette does not already contain.
  oliveLight: '#8b9459',
  roseLight: '#d79aa8',
  lilac: '#8e7cb5',
};

// ---- Loom geometry, in world units -----------------------------------------
const CLOTH_WIDTH = 2.35;
const Z_FELL = -1.70;      // where new cloth is formed
const Z_BEAM = 0.55;       // breast beam, where cloth turns downward
const Y_BED = 0.62;        // height of the loom bed
const BEAM_R = 0.22;       // breast beam radius
const Z_HEDDLE = -5.10;    // back of the warp

const BED_LEN = Z_BEAM - Z_FELL;              // taut section
const CURVE_LEN = (Math.PI / 2) * BEAM_R;     // over the beam
const HANG_LEN = 3.30;                        // deliberately runs past the bottom of frame
const TOTAL_LEN = BED_LEN + CURVE_LEN + HANG_LEN;

/** One weft pick per this many seconds. */
const PICK_PERIOD = 1.5;
/** How far the cloth advances per pick. */
const PICK_ADVANCE = 0.05;
/** Distance between pallu bands along the cloth. */
const PALLU_REPEAT = 6.4;
/** Distance between repeats of the body stripe group. */
const STRIPE_PERIOD = 0.46;

const ARRANGEMENT = { width: 6.2, height: 3.75 };

/* -------------------------------------------------------------------------- */
/*  The cloth                                                                  */
/* -------------------------------------------------------------------------- */

const CLOTH_VERTEX = /* glsl */ `
  uniform float uWeave;
  uniform float uFoldAmp;
  uniform float uTime;
  uniform float uBeatAge;   // seconds since the reed last beat

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vFold;
  varying float vAlongCloth;
  varying float vOnLoom;

  const float BED_LEN   = ${BED_LEN.toFixed(4)};
  const float CURVE_LEN = ${CURVE_LEN.toFixed(4)};
  const float TOTAL_LEN = ${TOTAL_LEN.toFixed(4)};
  const float Z_FELL    = ${Z_FELL.toFixed(4)};
  const float Z_BEAM    = ${Z_BEAM.toFixed(4)};
  const float Y_BED     = ${Y_BED.toFixed(4)};
  const float BEAM_R    = ${BEAM_R.toFixed(4)};

  // Folds only exist once the cloth is off the loom and hanging free.
  float folds(float x, float along, float hang) {
    float envelope = smoothstep(0.0, 1.4, hang);
    float w  = sin(x * 4.30 + along * 0.55) * 0.55;
          w += sin(x * 7.90 - along * 0.30) * 0.30;
          w += sin(x * 13.4 + along * 0.90) * 0.12;
    return w * envelope * uFoldAmp;
  }

  // Maps cloth coordinates to a point on the loom → beam → hang path.
  vec3 clothPoint(vec2 uvIn) {
    float x = (uvIn.x - 0.5) * ${CLOTH_WIDTH.toFixed(4)};
    float s = uvIn.y * TOTAL_LEN;   // distance travelled along the cloth

    vec3 pos;
    float angle;   // 0 = flat on the bed, PI/2 = hanging vertically
    float hang = 0.0;

    if (s < BED_LEN) {
      pos = vec3(x, Y_BED, Z_FELL + s);
      angle = 0.0;
    } else if (s < BED_LEN + CURVE_LEN) {
      angle = (s - BED_LEN) / BEAM_R;
      pos = vec3(
        x,
        (Y_BED - BEAM_R) + BEAM_R * cos(angle),
        Z_BEAM + BEAM_R * sin(angle)
      );
    } else {
      hang = s - BED_LEN - CURVE_LEN;
      angle = 1.5707963;
      pos = vec3(x, (Y_BED - BEAM_R) - hang, Z_BEAM + BEAM_R);
    }

    // Displace along the surface normal, which rotates with the path.
    vec3 normal = vec3(0.0, cos(angle), sin(angle));
    pos += normal * folds(x, uvIn.y * TOTAL_LEN + uWeave, hang);

    // Free cloth is never still. It swings slowly from the beam, further the
    // lower it hangs, and each beat of the reed sends a shudder down it.
    float free = smoothstep(0.0, 1.6, hang);
    pos.z += sin(uTime * 0.85 + hang * 0.30) * 0.052 * free;
    pos.x += sin(uTime * 0.61 + hang * 0.22 + 1.7) * 0.028 * free;

    float travelled = uBeatAge * 3.1;          // the impulse runs down the cloth
    float gap = hang - travelled;
    float shudder = exp(-gap * gap * 5.0) * exp(-uBeatAge * 2.4);
    pos.z += shudder * 0.085 * step(0.001, hang);

    return pos;
  }

  void main() {
    vUv = uv;

    float s = uv.y * TOTAL_LEN;
    vOnLoom = 1.0 - smoothstep(BED_LEN * 0.72, BED_LEN + CURVE_LEN, s);
    vAlongCloth = s + uWeave;

    vec3 p  = clothPoint(uv);
    float e = 0.004;
    vec3 pu = clothPoint(uv + vec2(e, 0.0));
    vec3 pv = clothPoint(uv + vec2(0.0, e));

    vFold = folds((uv.x - 0.5) * ${CLOTH_WIDTH.toFixed(4)}, vAlongCloth,
                  max(s - BED_LEN - CURVE_LEN, 0.0)) / max(uFoldAmp, 0.0001);

    vNormal = normalize(normalMatrix * normalize(cross(pu - p, pv - p)));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const CLOTH_FRAGMENT = /* glsl */ `
  uniform vec3  uCloth;
  uniform vec3  uClothAlt;
  uniform vec3  uOlive;
  uniform vec3  uRose;
  uniform vec3  uLilac;
  uniform vec3  uShade;
  uniform vec3  uRim;
  uniform float uWeave;

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vFold;
  varying float vAlongCloth;
  varying float vOnLoom;

  const float PALLU_REPEAT   = ${PALLU_REPEAT.toFixed(4)};
  const float STRIPE_PERIOD  = ${STRIPE_PERIOD.toFixed(4)};

  // A soft-edged line centred on \`c\`, half-width \`w\`.
  float band(float x, float c, float w) {
    return 1.0 - smoothstep(w, w * 1.8, abs(x - c));
  }

  // The same, but on a 0..1 coordinate that wraps.
  float bandWrapped(float x, float c, float w) {
    float d = abs(x - c);
    d = min(d, 1.0 - d);
    return 1.0 - smoothstep(w, w * 1.8, d);
  }

  // A filled band from \`lo\` to \`hi\` with soft shoulders.
  float bandRange(float x, float lo, float hi, float soft) {
    return smoothstep(lo - soft, lo + soft, x) * (1.0 - smoothstep(hi - soft, hi + soft, x));
  }

  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;

    vec3 V = normalize(-vViewPos);
    vec3 key  = normalize(vec3(0.30, 0.80, 0.72));
    vec3 fill = normalize(vec3(-0.78, -0.05, 0.45));

    vec3 col = mix(uCloth, uClothAlt, smoothstep(0.0, 1.0, vUv.x));

    // ---- The Onam kasavu ----------------------------------------------
    // Off-white ground, fine weft stripes in olive / rose / lilac, a striped
    // selvedge down each edge, and a pallu with its cross-border at intervals.

    float edge = min(vUv.x, 1.0 - vUv.x);

    // Where we are within the current saree, and within its pallu.
    float palluPos = mod(vAlongCloth, PALLU_REPEAT);
    float inPallu  = smoothstep(-0.01, 0.01, palluPos) * (1.0 - smoothstep(0.60, 0.63, palluPos));

    // Body stripes: each is a single coloured pick, so they appear as woven.
    float sp = mod(vAlongCloth, STRIPE_PERIOD) / STRIPE_PERIOD;
    float body = 1.0 - inPallu;
    col = mix(col, uLilac, bandWrapped(sp, 0.06, 0.017) * body);
    col = mix(col, uOlive, bandWrapped(sp, 0.32, 0.020) * body);
    col = mix(col, uRose,  bandWrapped(sp, 0.56, 0.018) * body);
    col = mix(col, uOlive, bandWrapped(sp, 0.80, 0.014) * body);

    // Selvedge: a lilac band with olive and rose lines just inside it.
    float selLilac = 1.0 - smoothstep(0.026, 0.032, edge);
    float selOlive = band(edge, 0.040, 0.0055);
    float selRose  = band(edge, 0.056, 0.0045);
    col = mix(col, uLilac, selLilac);
    col = mix(col, uOlive, selOlive);
    col = mix(col, uRose,  selRose);

    // Pallu cross-border: the same three colours, laid across the full width.
    float cbLilac = bandRange(palluPos, 0.000, 0.042, 0.006);
    float cbOlive = bandRange(palluPos, 0.052, 0.078, 0.005);
    float cbRose  = bandRange(palluPos, 0.086, 0.108, 0.005);
    // …and repeated at the far end of the pallu, before the fringe.
    float ceRose  = bandRange(palluPos, 0.500, 0.522, 0.005);
    float ceOlive = bandRange(palluPos, 0.530, 0.556, 0.005);
    float ceLilac = bandRange(palluPos, 0.566, 0.608, 0.006);

    col = mix(col, uLilac, max(cbLilac, ceLilac));
    col = mix(col, uOlive, max(cbOlive, ceOlive));
    col = mix(col, uRose,  max(cbRose, ceRose));

    float borderMask = clamp(
      selLilac + selOlive + selRose + cbLilac + cbOlive + cbRose
        + ceRose + ceOlive + ceLilac,
      0.0, 1.0
    );

    // ---- Weave texture ------------------------------------------------
    float warp  = 0.5 + 0.5 * sin(vUv.x * 190.0);
    float weft  = 0.5 + 0.5 * sin(vAlongCloth * 150.0);
    float weave = warp * weft;

    // ---- Lighting ------------------------------------------------------
    float diffuse  = max(dot(N, key), 0.0);
    float fillTerm = max(dot(N, fill), 0.0) * 0.20;
    vec3  h        = normalize(key + V);
    float specular = pow(max(dot(N, h), 0.0), 46.0) * (0.18 + borderMask * 0.22)
                   * (0.86 + weave * 0.28);

    float occlusion = 1.0 - clamp(-vFold * 0.62, 0.0, 0.55);
    col *= (0.17 + diffuse * 0.88 + fillTerm) * occlusion;
    col  = mix(col, uShade, clamp(-vFold * 0.50, 0.0, 0.48));
    col += specular;

    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += uRim * rim * 0.30;

    // Cloth on the loom bed catches the overhead light more directly.
    col += vOnLoom * 0.06;

    // The freshly-beaten edge glows faintly, so the eye finds the fell line.
    float freshness = 1.0 - smoothstep(0.0, 0.14, vUv.y);
    col += uRim * freshness * 0.10;

    gl_FragColor = vec4(col, 1.0);

    #include <colorspace_fragment>
  }
`;

/* -------------------------------------------------------------------------- */
/*  Warp threads                                                               */
/* -------------------------------------------------------------------------- */

const WARP_VERTEX = /* glsl */ `
  uniform float uShed;      // signed, -1 .. 1
  uniform float uShedAmp;

  attribute float aParity;  // 0 or 1 — which heddle shaft the thread rides
  attribute float aT;       // 0 at the heddles, 1 at the fell line

  varying float vT;
  varying float vParity;

  void main() {
    vT = aT;
    vParity = aParity;

    // The shed opens widest at the heddles and closes to nothing at the fell.
    float dir = aParity * 2.0 - 1.0;
    vec3 p = position;
    p.y += dir * uShed * uShedAmp * (1.0 - aT);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const WARP_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorAlt;

  varying float vT;
  varying float vParity;

  void main() {
    vec3 col = mix(uColor, uColorAlt, vParity * 0.35);
    // Threads fade into the dark toward the back of the loom.
    float depth = smoothstep(0.0, 0.85, vT);
    col *= 0.35 + depth * 0.75;
    gl_FragColor = vec4(col, 0.55 + depth * 0.45);
    #include <colorspace_fragment>
  }
`;

/* -------------------------------------------------------------------------- */

interface Choreography {
  shed: number;
  shuttleX: number;
  shuttleVisible: number;
  reedZ: number;
  weave: number;
  /** Seconds since the reed last drove a weft home. */
  beatAge: number;
}

/** Where every moving part should be at time `t`. One pick per PICK_PERIOD. */
function choreograph(t: number): Choreography {
  const pick = t / PICK_PERIOD;
  const index = Math.floor(pick);
  const phase = pick - index;
  const direction = index % 2 === 0 ? 1 : -1;

  // Shed: opens quickly, holds while the shuttle passes, closes before the beat.
  const open = smoothstep(0.0, 0.16, phase) * (1 - smoothstep(0.62, 0.80, phase));

  // Shuttle crosses while the shed is held open.
  const travel = clamp((phase - 0.16) / 0.44, 0, 1);
  const eased = travel * travel * (3 - 2 * travel);
  const halfWidth = CLOTH_WIDTH * 0.5 + 0.35;
  const shuttleX = direction * (eased * 2 - 1) * halfWidth;
  const shuttleVisible = phase > 0.14 && phase < 0.64 ? 1 : 0;

  // Reed beats the weft home once the shed has closed, then returns.
  const beat = phase < 0.80 ? 0 : Math.sin(((phase - 0.8) / 0.2) * Math.PI);
  const reedZ = Z_FELL - 0.62 + beat * 0.52;

  // Cloth steps forward on each beat rather than creeping continuously.
  const weave = (index + smoothstep(0.82, 0.96, phase)) * PICK_ADVANCE;

  // How long ago the reed struck, for the shudder that runs down the cloth.
  let sinceBeat = phase - 0.88;
  if (sinceBeat < 0) sinceBeat += 1;
  const beatAge = sinceBeat * PICK_PERIOD;

  return { shed: open * direction, shuttleX, shuttleVisible, reedZ, weave, beatAge };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export interface LoomWeaveSceneProps {
  progressRef: MutableRefObject<number>;
  active: boolean;
  animate: boolean;
}

export default function LoomWeaveScene({ progressRef, active, animate }: LoomWeaveSceneProps) {
  return (
    <Canvas
      frameloop={!animate ? 'demand' : active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [4.55, 1.45, 4.30], fov: 42 }}
      style={{ pointerEvents: 'none' }}
    >
      <Loom progressRef={progressRef} interactive={animate} />
    </Canvas>
  );
}

function Loom({
  progressRef,
  interactive,
}: {
  progressRef: MutableRefObject<number>;
  interactive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shuttleRef = useRef<THREE.Mesh>(null);
  const reedRef = useRef<THREE.Group>(null);
  const heddleRef = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();

  useLayoutEffect(() => {
    camera.lookAt(-0.10, -0.34, -2.05);
  }, [camera]);

  const cloth = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: CLOTH_VERTEX,
      fragmentShader: CLOTH_FRAGMENT,
      side: THREE.DoubleSide,
      uniforms: {
        uWeave: { value: 0 },
        uFoldAmp: { value: 0.30 },
        uTime: { value: 0 },
        uBeatAge: { value: 0 },
        uCloth: { value: new THREE.Color(PALETTE.cream) },
        uClothAlt: { value: new THREE.Color(PALETTE.pearl) },
        uOlive: { value: new THREE.Color(PALETTE.oliveLight) },
        uRose: { value: new THREE.Color(PALETTE.roseLight) },
        uLilac: { value: new THREE.Color(PALETTE.lilac) },
        uShade: { value: new THREE.Color(PALETTE.vintage) },
        uRim: { value: new THREE.Color(PALETTE.zariLight) },
      },
    });
    const geometry = new THREE.PlaneGeometry(1, 1, 130, 220);
    geometry.translate(0.5, 0.5, 0); // work in 0..1 cloth coordinates
    return { material, geometry };
  }, []);

  const warp = useMemo(() => {
    const COUNT = 52;
    const half = 0.0085;
    const positions: number[] = [];
    const parity: number[] = [];
    const alongT: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < COUNT; i++) {
      const x = ((i + 0.5) / COUNT - 0.5) * CLOTH_WIDTH;
      const base = i * 4;
      // A thin vertical ribbon running from the heddles to the fell line.
      positions.push(
        x, -half, Z_HEDDLE,
        x, half, Z_HEDDLE,
        x, half, Z_FELL,
        x, -half, Z_FELL
      );
      for (let k = 0; k < 4; k++) parity.push(i % 2);
      alongT.push(0, 0, 1, 1);
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aParity', new THREE.Float32BufferAttribute(parity, 1));
    geometry.setAttribute('aT', new THREE.Float32BufferAttribute(alongT, 1));
    geometry.setIndex(indices);

    const material = new THREE.ShaderMaterial({
      vertexShader: WARP_VERTEX,
      fragmentShader: WARP_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uShed: { value: 0 },
        uShedAmp: { value: 0.26 },
        uColor: { value: new THREE.Color(PALETTE.cream) },
        uColorAlt: { value: new THREE.Color(PALETTE.zariLight) },
      },
    });

    return { geometry, material };
  }, []);

  useEffect(
    () => () => {
      cloth.material.dispose();
      cloth.geometry.dispose();
      warp.material.dispose();
      warp.geometry.dispose();
    },
    [cloth, warp]
  );

  const fit = Math.min(
    viewport.width / ARRANGEMENT.width,
    viewport.height / ARRANGEMENT.height,
    1.1
  );

  useFrame((state, delta) => {
    const c = choreograph(state.clock.elapsedTime);

    cloth.material.uniforms.uWeave.value = c.weave;
    cloth.material.uniforms.uTime.value = state.clock.elapsedTime;
    cloth.material.uniforms.uBeatAge.value = c.beatAge;
    warp.material.uniforms.uShed.value = c.shed;

    if (shuttleRef.current) {
      shuttleRef.current.position.x = c.shuttleX;
      shuttleRef.current.position.y = c.shed * 0.10;
      shuttleRef.current.visible = c.shuttleVisible > 0.5;
    }
    if (reedRef.current) reedRef.current.position.z = c.reedZ;
    if (heddleRef.current) {
      // Shafts ride opposite each other as the shed opens.
      heddleRef.current.children[0].position.y = Y_BED + c.shed * 0.20;
      heddleRef.current.children[1].position.y = Y_BED - c.shed * 0.20;
    }

    const group = groupRef.current;
    if (!group) return;
    const damp = 1 - Math.pow(0.0015, delta);
    const scrollTurn = (progressRef.current - 0.5) * 0.22;
    const targetY = interactive ? state.pointer.x * 0.10 + scrollTurn : scrollTurn;
    const targetX = interactive ? state.pointer.y * -0.05 : 0;
    group.rotation.y += (targetY - group.rotation.y) * damp;
    group.rotation.x += (targetX - group.rotation.x) * damp;
  });

  const frameColor = PALETTE.vintage;
  const railHalf = CLOTH_WIDTH * 0.5 + 0.34;

  return (
    <group ref={groupRef} scale={fit} position={[0, 0.25, 0]}>
      {/* Cloth: loom bed → breast beam → hanging drape */}
      <mesh
        geometry={cloth.geometry}
        material={cloth.material}
        renderOrder={2}
        frustumCulled={false}
      />

      {/* Warp under tension */}
      <mesh geometry={warp.geometry} material={warp.material} renderOrder={1} />

      {/* Breast beam, where the cloth turns down */}
      <mesh position={[0, Y_BED - BEAM_R, Z_BEAM]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[BEAM_R, BEAM_R, CLOTH_WIDTH + 0.7, 24]} />
        <meshBasicMaterial color={frameColor} />
      </mesh>

      {/* Warp beam at the back */}
      <mesh position={[0, Y_BED - 0.02, Z_HEDDLE - 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.19, CLOTH_WIDTH + 0.7, 20]} />
        <meshBasicMaterial color={frameColor} />
      </mesh>

      {/* Heddle shafts — lift alternate warp ends to open the shed */}
      <group ref={heddleRef}>
        {[0, 1].map((shaft) => (
          <mesh key={shaft} position={[0, Y_BED, Z_HEDDLE + 0.55 + shaft * 0.34]}>
            <boxGeometry args={[CLOTH_WIDTH + 0.34, 0.055, 0.045]} />
            <meshBasicMaterial color={shaft === 0 ? PALETTE.zariDeep : frameColor} />
          </mesh>
        ))}
      </group>

      {/* Reed / beater — swings forward to drive each weft home */}
      <group ref={reedRef}>
        <mesh position={[0, Y_BED + 0.44, 0]}>
          <boxGeometry args={[CLOTH_WIDTH + 0.44, 0.075, 0.06]} />
          <meshBasicMaterial color={PALETTE.zariDeep} />
        </mesh>
        <mesh position={[0, Y_BED + 0.05, 0]}>
          <boxGeometry args={[CLOTH_WIDTH + 0.44, 0.30, 0.028]} />
          <meshBasicMaterial color={PALETTE.zari} transparent opacity={0.30} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * (CLOTH_WIDTH * 0.5 + 0.20), Y_BED + 0.24, 0]}>
            <boxGeometry args={[0.05, 0.48, 0.05]} />
            <meshBasicMaterial color={frameColor} />
          </mesh>
        ))}
      </group>

      {/* Shuttle, carrying the weft through the open shed */}
      <mesh ref={shuttleRef} position={[0, 0, Z_FELL - 0.20]}>
        <boxGeometry args={[0.40, 0.062, 0.095]} />
        <meshBasicMaterial color={PALETTE.zariDeep} />
      </mesh>

      {/* Side rails running the length of the loom, plus uprights */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * railHalf, Y_BED - 0.30, (Z_BEAM + Z_HEDDLE) / 2]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <boxGeometry args={[0.09, Z_BEAM - Z_HEDDLE + 0.5, 0.09]} />
            <meshBasicMaterial color={frameColor} />
          </mesh>
          <mesh position={[side * railHalf, Y_BED - 0.95, Z_BEAM - 0.1]}>
            <boxGeometry args={[0.11, 1.5, 0.11]} />
            <meshBasicMaterial color={frameColor} />
          </mesh>
          <mesh position={[side * railHalf, Y_BED - 0.95, Z_HEDDLE + 0.2]}>
            <boxGeometry args={[0.11, 1.5, 0.11]} />
            <meshBasicMaterial color={frameColor} />
          </mesh>
        </group>
      ))}

      <ZariDust />
    </group>
  );
}

/** Slow-drifting motes of gold zari dust. */
function ZariDust({ count = 70 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(PALETTE.zariLight) },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        uniform float uPixelRatio;
        varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (6.5 * uPixelRatio) / max(-mv.z, 0.5);
          vFade = smoothstep(-4.5, 1.0, mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float alpha = (1.0 - smoothstep(0.18, 0.5, d)) * 0.6 * vFade;
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
      arr[i + 1] += delta * 0.075;
      arr[i] += Math.sin(state.clock.elapsedTime * 0.3 + i) * delta * 0.025;
      if (arr[i + 1] > 2.5) arr[i + 1] = -2.5;
    }
    attr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
