import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Brand constants ──────────────────────────────────────────
const C = {
  bg: "#2F4050",
  white: "#FFFFFF",
  caption: "#97999E",
  teal: "#15E3D6",
};

// ─── Beat boundaries (seconds) ────────────────────────────────
// Keyed to silencedetect -35dB:0.4 output on scene1-problems.mp3
// (regen 2026-04-20, total 55.07s — trimmed b4 + tail):
//   b1 0.0   — "For twenty years… coherent picture."
//   b2 24.6  — "Then comes the next wave… faster than any human…"
//   b3 39.3  — "Orchestration alone… better coordination."
//   b4 45.0  — desaturate (dead-end feel, late b3)
//   b5 49.4  — "That's the gap autonomous closes."
const B = { b2: 24.6, b3: 39.3, b4: 45.0, b5: 49.4 };

const SUCK = { x: 1720, y: 540 };
const SUCK_START = 47.8;
const SUCK_END = 49.4;

// Top-right counter keepout — logos must not land on top of the "900
// APPLICATIONS" HUD. Matches AppCounter's right:64/top:48 footprint plus a
// buffer that absorbs the post-landing drift (±9px) without bleeding in.
const COUNTER_KEEPOUT = { left: 1500, top: 30, right: 1890, bottom: 230 };

// ─── Enterprise logos (in public/logos/) ──────────────────────
const LOGOS: string[] = [
  "salesforce", "sap", "oracle", "snowflake", "hubspot", "zendesk",
  "jira", "confluence", "github", "slack", "zoom", "adobe",
  "aws", "googlecloud", "stripe", "okta", "splunk", "datadog",
  "tableau", "dropbox", "asana", "notion", "microsoft", "teams",
  "azure", "powerbi", "openai", "anthropic", "netsuite",
];

// Slots = real logos + zombie/shadow greys (unnamed dead apps)
// Zombies alternate between "ghost" and "ghoul" silhouettes — dead/forgotten
// systems still haunting the stack.
type ZombieKind = "ghost" | "ghoul";
type Slot = {
  key: string; logoName?: string; zombie?: boolean; ghoul?: ZombieKind;
};
const SLOTS: Slot[] = [
  ...LOGOS.map((n) => ({ key: n, logoName: n })),
  ...Array.from({ length: 7 }, (_, i) => ({
    key: `z${i}`,
    zombie: true,
    ghoul: (i % 2 === 0 ? "ghost" : "ghoul") as ZombieKind,
  })),
];

// Deterministic PRNG so placement is stable across frames/renders.
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Placed = Slot & {
  x: number; y: number; rot: number; scale: number;
  dropOrder: number; alignX: number; alignY: number;
};

const placeSlots = (): Placed[] => {
  // Chaos grid 6×6 over 1920×1080 with jitter. 36 cells → 36 slots.
  const cols = 6;
  const cellW = 300, cellH = 150;
  const offX = (1920 - cellW * cols) / 2;
  const offY = 90;
  const rand = mulberry(7);
  // Shuffle so zombies interleave with real logos
  const shuffled = [...SLOTS].sort(() => rand() - 0.5);
  // Drop order — visually staggered reveal
  const order = [...Array(shuffled.length).keys()].sort(() => rand() - 0.5);

  // Aligned grid (beat 5) — never used now that we suck+clear, kept for API
  const alignCols = 8;
  const alignCellW = 1600 / alignCols;
  const alignCellH = 110;
  const alignOffX = (1920 - alignCellW * alignCols) / 2;
  const alignOffY = 780;

  return shuffled.map((slot, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const jx = (rand() - 0.5) * 70;
    const jy = (rand() - 0.5) * 50;
    const rot = (rand() - 0.5) * 28; // ±14°
    const scale = 0.88 + rand() * 0.24; // 0.88–1.12
    const aCol = i % alignCols, aRow = Math.floor(i / alignCols);
    let x = offX + col * cellW + cellW / 2 + jx;
    const y = offY + row * cellH + cellH / 2 + jy;

    // Counter keepout: shift any logo overlapping the HUD leftward just
    // past the counter's left edge. Chaos pile absorbs the local overlap.
    const hx = BADGE_D / 2;
    const overlapsCounter =
      x + hx > COUNTER_KEEPOUT.left &&
      x - hx < COUNTER_KEEPOUT.right &&
      y + hx > COUNTER_KEEPOUT.top &&
      y - hx < COUNTER_KEEPOUT.bottom;
    if (overlapsCounter) x = COUNTER_KEEPOUT.left - hx - 12;

    return {
      ...slot,
      x, y,
      rot, scale,
      dropOrder: order.indexOf(i),
      alignX: alignOffX + aCol * alignCellW + alignCellW / 2,
      alignY: alignOffY + aRow * alignCellH + alignCellH / 2,
    };
  });
};

// ─── Helpers ───────────────────────────────────────────────────
const clampLerp = (t: number, inR: number[], outR: number[]) =>
  interpolate(t, inR, outR, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

// ─── Ghost / ghoul silhouettes (zombie circles) ────────────────
const GhostSilhouette: React.FC = () => (
  <svg viewBox="0 0 48 56" style={{ width: "100%", height: "100%" }}>
    <path
      d="M24 3c-9 0-15 7-15 16v27l5-4 4 4 5-4 4 4 5-4 4 4 3-3V19c0-9-6-16-15-16z"
      fill="rgba(245,246,250,0.82)"
    />
    <ellipse cx="18" cy="24" rx="2.4" ry="3.4" fill="#2F4050" />
    <ellipse cx="30" cy="24" rx="2.4" ry="3.4" fill="#2F4050" />
    <ellipse cx="24" cy="34" rx="3" ry="2" fill="#2F4050" opacity="0.6" />
  </svg>
);

const GhoulSilhouette: React.FC = () => (
  <svg viewBox="0 0 48 56" style={{ width: "100%", height: "100%" }}>
    {/* jagged-bottom hooded ghoul */}
    <path
      d="M24 2c-10 0-17 8-17 18v20l3-3 3 5 3-4 3 5 3-4 3 5 3-4 3 5 3-4 3 3V20C41 10 34 2 24 2z"
      fill="rgba(210,214,222,0.78)"
    />
    {/* hood shadow */}
    <path
      d="M9 20c0-8 7-14 15-14s15 6 15 14v4c-4-6-9-9-15-9s-11 3-15 9v-4z"
      fill="rgba(60,70,82,0.55)"
    />
    {/* glowing eyes */}
    <ellipse cx="18" cy="26" rx="2.6" ry="2" fill="#2F4050" />
    <ellipse cx="30" cy="26" rx="2.6" ry="2" fill="#2F4050" />
    {/* fanged grin */}
    <path
      d="M17 34 L20 38 L22 34 L24 38 L26 34 L28 38 L31 34"
      stroke="#2F4050" strokeWidth="1.5" fill="none" strokeLinejoin="round"
    />
  </svg>
);

// ─── Logo badge: white (or grey zombie) circle with logo inside ──
const BADGE_D = 124;
const LogoBadge: React.FC<{
  logoName?: string; zombie?: boolean; ghoul?: ZombieKind;
}> = ({ logoName, zombie, ghoul }) => (
  <div
    style={{
      width: BADGE_D,
      height: BADGE_D,
      borderRadius: "50%",
      background: zombie ? "rgba(151,153,158,0.42)" : C.white,
      boxShadow: zombie
        ? "0 4px 12px rgba(0,0,0,0.25)"
        : "0 6px 18px rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: BADGE_D * (zombie ? 0.16 : 0.2),
      boxSizing: "border-box",
    }}
  >
    {logoName && !zombie && (
      <Img
        src={staticFile(`logos/${logoName}.svg`)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    )}
    {zombie && (ghoul === "ghoul" ? <GhoulSilhouette /> : <GhostSilhouette />)}
  </div>
);

// ─── Counter 0 → 900 ──────────────────────────────────────────
const AppCounter: React.FC<{ t: number; suckOpacity: number }> = ({
  t, suckOpacity,
}) => {
  const n = Math.round(clampLerp(t, [0.5, B.b2 - 2], [0, 900]));
  const baseOp = clampLerp(t, [0.3, 1.2], [0, 1]);
  return (
    <div
      style={{
        position: "absolute", top: 48, right: 64,
        textAlign: "right", opacity: baseOp * suckOpacity,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 120, fontWeight: 700, lineHeight: 1,
          color: C.white,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontSize: 22, fontWeight: 500, color: C.caption,
          marginTop: 8, letterSpacing: 1,
        }}
      >
        APPLICATIONS
      </div>
    </div>
  );
};

// ─── Agent bot glyph ──────────────────────────────────────────
const BotGlyph: React.FC<{ size: number; hue: string }> = ({ size, hue }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="14" width="32" height="26" rx="8"
      fill={hue} stroke={C.white} strokeWidth="1.5" opacity="0.95" />
    <circle cx="18" cy="26" r="2.5" fill={C.white} />
    <circle cx="30" cy="26" r="2.5" fill={C.white} />
    <path d="M18 33 Q24 36 30 33" stroke={C.white} strokeWidth="1.5"
      strokeLinecap="round" fill="none" />
    <line x1="24" y1="8" x2="24" y2="14" stroke={C.white} strokeWidth="1.8" />
    <circle cx="24" cy="7" r="2" fill={hue} stroke={C.white} strokeWidth="1.5" />
  </svg>
);

// ─── Agents (beat 2) ──────────────────────────────────────────
// Proliferate → wiggle drunkenly. Beat 3 adds a curved-line mesh between them.
type Agent = {
  homeX: number; homeY: number; appear: number; hue: string;
  brand?: string;
  wigglePhaseX: number; wigglePhaseY: number; wiggleAmp: number;
};

const AGENT_COUNT = 18;
const AGENTS_DATA: Agent[] = (() => {
  const rand = mulberry(91);
  const hues = ["#F28C6A", "#7C9EF9", "#F2C94C", "#9B6CE2",
                "#5DD3A6", "#E8779B", "#6EC7F2", "#D98757",
                "#B39DDB", "#80CBC4", "#FFB085", "#A3C0FF"];
  // 6 cols × 3 rows, spread across upper ~2/3 of frame
  return Array.from({ length: AGENT_COUNT }).map((_, i) => ({
    homeX: 200 + (i % 6) * 300 + (rand() - 0.5) * 50,
    homeY: 180 + Math.floor(i / 6) * 175 + (rand() - 0.5) * 40,
    // Accelerating entry — slow first 4, then rapid cluster (scaled to b2→b3 gap)
    appear: B.b2 + 0.6 + (i < 4 ? i * 1.0 : 4.1 + (i - 4) * 0.48),
    hue: hues[i % hues.length],
    brand:
      i === 0 ? "openai" :
      i === 7 ? "anthropic" :
      undefined,
    wigglePhaseX: rand() * Math.PI * 2,
    wigglePhaseY: rand() * Math.PI * 2,
    wiggleAmp: 14 + rand() * 20,
  }));
})();

// Edge list: each agent → 2 nearest neighbors (by home position).
// Deduplicated as undirected pairs. ~30 edges for 18 agents.
const EDGES: [number, number][] = (() => {
  const set = new Set<string>();
  for (let i = 0; i < AGENTS_DATA.length; i++) {
    const d = AGENTS_DATA
      .map((b, j) => {
        const dx = b.homeX - AGENTS_DATA[i].homeX;
        const dy = b.homeY - AGENTS_DATA[i].homeY;
        return { j, d: dx * dx + dy * dy };
      })
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d);
    for (let k = 0; k < 2; k++) {
      const j = d[k].j;
      set.add(i < j ? `${i}-${j}` : `${j}-${i}`);
    }
  }
  return [...set].map((s) => s.split("-").map(Number) as [number, number]);
})();

// Current position for one agent at time t (includes wiggle + suck).
// Shared between agent cards and the mesh edges so lines track vibration.
const agentPos = (a: Agent, t: number, suckP: number) => {
  const wiggleT = Math.max(0, t - a.appear - 0.4);
  const wx = Math.sin(wiggleT * 1.3 + a.wigglePhaseX) * a.wiggleAmp;
  const wy = Math.cos(wiggleT * 0.9 + a.wigglePhaseY) * (a.wiggleAmp * 0.7);
  const baseX = a.homeX + wx;
  const baseY = a.homeY + wy;
  return {
    x: baseX + (SUCK.x - baseX) * suckP,
    y: baseY + (SUCK.y - baseY) * suckP,
    lean: Math.sin(wiggleT * 0.8 + a.wigglePhaseX) * 8,
  };
};

const AgentSprawl: React.FC<{ t: number; suckP: number }> = ({ t, suckP }) => {
  const { fps } = useVideoConfig();
  const frame = t * fps;

  // Precompute this frame's position + appear progress for each agent
  const state = AGENTS_DATA.map((a) => {
    const appearP = spring({
      frame: frame - a.appear * fps,
      fps, config: { damping: 14, stiffness: 110, mass: 0.7 },
    });
    const pos = agentPos(a, t, suckP);
    return { a, appearP, pos };
  });

  // Mesh visible across beat 3 → fades during suck
  const meshOp = clampLerp(
    t,
    [B.b3 + 0.2, B.b3 + 1.2, SUCK_START, SUCK_END],
    [0, 0.75, 0.75, 0],
  );

  return (
    <>
      {/* Curved agent mesh — renders behind agent cards */}
      {meshOp > 0.01 && (
        <svg
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            pointerEvents: "none",
          }}
          viewBox="0 0 1920 1080"
        >
          {EDGES.map(([i, j], k) => {
            const p1 = state[i], p2 = state[j];
            if (p1.appearP < 0.2 || p2.appearP < 0.2) return null;
            const dx = p2.pos.x - p1.pos.x;
            const dy = p2.pos.y - p1.pos.y;
            const len = Math.hypot(dx, dy) || 1;
            // Perpendicular unit + per-edge curvature (deterministic)
            const nx = -dy / len, ny = dx / len;
            const offsetSign = k % 2 === 0 ? 1 : -1;
            const offsetMag = 40 + (k * 13) % 60;
            const cx = (p1.pos.x + p2.pos.x) / 2 + nx * offsetMag * offsetSign;
            const cy = (p1.pos.y + p2.pos.y) / 2 + ny * offsetMag * offsetSign;
            return (
              <path
                key={k}
                d={`M ${p1.pos.x} ${p1.pos.y} Q ${cx} ${cy} ${p2.pos.x} ${p2.pos.y}`}
                stroke={C.teal}
                strokeWidth={1.7}
                fill="none"
                opacity={meshOp * Math.min(p1.appearP, p2.appearP)}
              />
            );
          })}
        </svg>
      )}

      {state.map(({ a, appearP, pos }, i) => {
        if (appearP <= 0.01) return null;
        const suckScale = 1 - suckP * 0.85;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x - 42,
              top: pos.y - 42,
              width: 84, height: 84,
              borderRadius: 16,
              background: "rgba(255,255,255,0.14)",
              border: `2.8px solid ${a.hue}`,
              boxShadow: `0 0 26px ${a.hue}AA, inset 0 0 12px rgba(255,255,255,0.08)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              opacity: appearP * (1 - suckP),
              transform: `rotate(${pos.lean}deg) scale(${(0.6 + appearP * 0.4) * suckScale})`,
            }}
          >
            {a.brand ? (
              <Img
                src={staticFile(`logos/${a.brand}.svg`)}
                style={{
                  width: "100%", height: "100%", objectFit: "contain",
                  filter: "brightness(1.2)",
                }}
              />
            ) : (
              <BotGlyph size={52} hue={a.hue} />
            )}
          </div>
        );
      })}
    </>
  );
};

// ─── Beat 5 AOS layer ─────────────────────────────────────────
// aos-hero.png is 2739×1130 (wider than 16:9) — use `contain` so the
// baked-in wordmark + copy are never cropped. Backdrop matches the
// image's dark bg so the letterbox reads as one seamless surface.
// Fades in as Mai says "That's the gap autonomous closes."
const AosLayer: React.FC<{ t: number }> = ({ t }) => {
  const fadeIn = clampLerp(t, [B.b5 + 0.4, B.b5 + 1.8], [0, 1]);
  return (
    <AbsoluteFill
      style={{ opacity: fadeIn, backgroundColor: "#0B1118" }}
    >
      <Img
        src={staticFile("aos-hero.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────
export const LogoAvalanche: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const placed = useMemo(placeSlots, []);
  // Faster pileup: all slots down by ~13s, leaving 7s of settled chaos before b2.
  const dropWindow = 12.5;
  const stagger = dropWindow / placed.length;

  // Pile dims when agents proliferate
  const pileDim = clampLerp(t, [B.b2 - 0.5, B.b2 + 1.2], [1, 0.55]);
  // Beat-4 desaturate (dead end feel)
  const b4Gray = clampLerp(t, [B.b4, B.b4 + 0.4, SUCK_START, SUCK_END],
                          [0, 0.7, 0.7, 1]);
  // Suck progress: 0 at SUCK_START, 1 at SUCK_END
  const suckP = clampLerp(t, [SUCK_START, SUCK_END], [0, 1]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo pile */}
      <AbsoluteFill
        style={{
          opacity: pileDim * (1 - suckP),
          filter: `grayscale(${b4Gray})`,
        }}
      >
        {placed.map((p, i) => {
          const dropT = p.dropOrder * stagger;
          // Snappier + slightly bouncier landing
          const springP = spring({
            frame: frame - dropT * fps,
            fps, config: { damping: 9, stiffness: 130, mass: 0.85 },
          });
          const dropY = interpolate(springP, [0, 1], [-220, p.y]);
          const flightY = springP < 0.98 ? dropY : p.y;

          // Post-landing drift — continuous jitter so the pile reads alive.
          // Suppressed during suck so motion is clean.
          const driftT = Math.max(0, t - (dropT + 0.7));
          const driftAmp = (1 - suckP) * Math.min(1, driftT * 2);
          const dx = Math.sin(driftT * 0.7 + i * 0.41) * 9 * driftAmp;
          const dy = Math.cos(driftT * 0.55 + i * 1.07) * 7 * driftAmp;
          const rotWobble = Math.sin(driftT * 0.5 + i * 0.7) * 3 * driftAmp;

          // Suck pull
          const homeX = p.x + dx;
          const homeY = flightY + dy;
          const curX = homeX + (SUCK.x - homeX) * suckP;
          const curY = homeY + (SUCK.y - homeY) * suckP;
          const suckScale = 1 - suckP * 0.85;
          const suckRot = p.rot + rotWobble + suckP * 220;

          return (
            <div
              key={p.key}
              style={{
                position: "absolute",
                left: curX - BADGE_D / 2,
                top: curY - BADGE_D / 2,
                width: BADGE_D,
                height: BADGE_D,
                transform: `rotate(${suckRot}deg) scale(${p.scale * suckScale})`,
                opacity: Math.min(1, springP * 1.5),
              }}
            >
              <LogoBadge
                logoName={p.logoName}
                zombie={p.zombie}
                ghoul={p.ghoul}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      <AppCounter t={t} suckOpacity={1 - suckP} />
      {t >= B.b2 - 0.3 && <AgentSprawl t={t} suckP={suckP} />}
      {t >= B.b5 && <AosLayer t={t} />}
    </AbsoluteFill>
  );
};
