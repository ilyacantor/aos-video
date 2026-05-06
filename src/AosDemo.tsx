import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  OffthreadVideo,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LogoAvalanche } from "./LogoAvalanche";
import { MaiChat } from "./MaiChat";
import { Scene2HowItWorks } from "./Scene2HowItWorks";

// ─── Brand constants ───────────────────────────────────────────
const C = {
  bg: "#2F4050",
  white: "#FFFFFF",
  caption: "#97999E",
  teal: "#15E3D6",
};

// ─── D-ID clip durations (seconds, from MP4 headers) ──────────
// SINGLE SOURCE OF TRUTH for timing. Clips are audio-driven (Matilda MP3
// uploaded to D-ID /audios). Change script → regen Matilda → regen clip →
// update duration here → everything reflows.
const D: Record<string, number> = {
  "scene0-mai-intro": 5.43, // retained for back-compat; not in TRACKS as of 2026-04-18
  "scene1-problems": 54.80, // 54.65 audio + 0.15 breath pad (regen 2026-05-06, "twenty years" → "decades")
  "scene2-all": 22.2, // 0.7 pre-roll fade-in + 19.30 audio + 2.2 tail hold (audio track starts at T_S2 + f(0.7))
  "scene3a-all": 15.73, // merged Q&A + config into one sentence (regen 2026-04-20)
  "scene4-knowledgegraph": 14.48,
  "scene5-intro": 9.43,
  "scene5-all": 11.1, // 10.89 audio + 0.21 breath (2026-04-18 regen: "cross-sell and upsell opportunities")
  "scene6-deploy": 28.87, // trimmed ordinals + redundant phrases (regen 2026-04-20)
  "scene7-closing": 8.87,
};

// ─── Narration groups → visual scenes ─────────────────────────
// Each group = one D-ID clip. Speech drives timing.

const TAIL_HOLD = 3.0; // Hold closing slide after Mai finishes
const TITLE_FLASH = 3.0; // Silent brand flash — 2026-04-18 Mai intro retired

const G = {
  titleCard: TITLE_FLASH,
  scene1: D["scene1-problems"],
  scene2: D["scene2-all"],
  scene3a: D["scene3a-all"],
  scene4: D["scene4-knowledgegraph"],
  scene5i: D["scene5-intro"],
  scene5: D["scene5-all"],
  scene6: D["scene6-deploy"],
  scene7: D["scene7-closing"] + TAIL_HOLD,
};

// Cumulative start times (frames @30fps)
const f = (s: number) => Math.round(s * 30);
const starts = Object.values(G).reduce<number[]>(
  (acc, dur) => [...acc, acc[acc.length - 1] + f(dur)],
  [0],
);
const [
  T_TITLE, T_S1, T_S2, T_S3A, T_S4, T_S5I, T_S5, T_S6, T_S7, T_END,
] = starts;

export const AOS_FRAMES = T_END;

// ─── Avatar PIP ───────────────────────────────────────────────
const AvatarBubble: React.FC = () => {
  const { height } = useVideoConfig();
  const bubbleH = Math.round(height * 0.3125); // 25% larger than original 0.25
  const bubbleW = Math.round(bubbleH * 0.75);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        right: 32,
        width: bubbleW,
        height: bubbleH,
        borderRadius: 14,
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
      }}
    >
      <OffthreadVideo
        muted
        src={staticFile("avatar/avatar-combined.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
        }}
      />
    </div>
  );
};

// ─── Title card ───────────────────────────────────────────────
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lerp = (fr: number, inR: [number, number], outR: [number, number]) =>
    interpolate(fr, inR, outR, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const progress = spring({
    frame: frame - 0.2 * fps,
    fps,
    config: { damping: 22, stiffness: 14, mass: 3 },
  });

  const iconX = interpolate(progress, [0, 1], [960, 50]);
  const iconY = interpolate(progress, [0, 1], [440, 1034]);
  const iconScale = interpolate(progress, [0, 1], [10, 1]);
  const iconRotation = interpolate(progress, [0, 1], [360, 0]);
  const iconOpacity = lerp(frame, [0, 1 * fps], [0, 1]);
  const durSec = G.titleCard;
  const fadeOut = lerp(frame, [(durSec - 0.5) * fps, durSec * fps], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: "Inter, sans-serif",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-60%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          opacity: lerp(frame, [0, 0.8 * fps], [0, 1]),
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>
          <span style={{ color: C.white }}>autonom</span>
          <span style={{ color: C.teal }}>OS</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 500, color: C.caption }}>
          The trusted context layer for your enterprise
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: C.white,
            marginTop: 20,
          }}
        >
          Connect. Contextualize. Execute.
        </div>
      </div>

      <Img
        src={staticFile("favicon.png")}
        style={{
          position: "absolute",
          left: iconX - 18,
          top: iconY - 18,
          width: 36,
          height: 36,
          opacity: iconOpacity,
          transform: `scale(${iconScale}) rotate(${iconRotation}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene video segment (freezes on last frame if narration > visual) ─
// `startFrom` skips leading frames of the source file — used to strip a
// base video's built-in fade-in when the preceding scene ends on content
// (e.g. scene3a.mp4 fades in from C.bg, which looks like a blank wall
// after scene2's knowledge-graph hands off).
const SceneVideo: React.FC<{ file: string; startFrom?: number }> = ({
  file,
  startFrom,
}) => (
  <OffthreadVideo
    src={staticFile(`scenes/${file}`)}
    startFrom={startFrom}
    muted
    style={{ width: "100%", height: "100%" }}
  />
);

// ─── Static full-frame image (matches 16:9) ────────────────────
const StaticSlide: React.FC<{ file: string; fit?: "cover" | "contain" }> = ({
  file,
  fit = "cover",
}) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Img
      src={staticFile(file)}
      style={{ width: "100%", height: "100%", objectFit: fit }}
    />
  </AbsoluteFill>
);

// ─── Scene 5 Intro — faded full-frame background ──────────────
const FadedBackground: React.FC<{ file: string; opacity?: number }> = ({
  file,
  opacity = 1,
}) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Img
      src={staticFile(file)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity,
      }}
    />
  </AbsoluteFill>
);

// ─── Scene 5 — rotisserie: "Here's what we automate." + 5 bullets ──
// Scene 5 carousel — screenshots orbit clockwise on a 3D ring.
// Speech beats (silencedetect on scene5-all.mp3, 2026-04-18 regen):
//   0.00–1.02 "Here's what we automate."              → title card
//   1.30      carousel starts — combine_fs at front
//   3.08      qofe2 rotates to front
//   4.69      ebitda2 rotates to front
//   6.74      x-sell2 rotates to front
//   9.18      backoffice2 rotates to front
const CAROUSEL_SLIDES = [
  "combine_fs.png", "qofe2.png", "ebitda2.png", "x-sell2.png", "backoffice2.png",
];
const CAROUSEL_BEATS = [1.30, 3.08, 4.69, 6.74, 9.18];
const CAROUSEL_RADIUS = 600;
const CARD_W = 720;
const CARD_H = 450;

const Scene5Slides: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const N = CAROUSEL_SLIDES.length;
  const sliceAngle = 360 / N;

  // Hold at each beat for ~50% of the interval, then rotate to the next.
  const HOLD_FRAC = 0.5;
  const kfTimes: number[] = [];
  const kfVals: number[] = [];
  for (let i = 0; i < CAROUSEL_BEATS.length; i++) {
    kfTimes.push(CAROUSEL_BEATS[i]);
    kfVals.push(i);
    if (i < CAROUSEL_BEATS.length - 1) {
      const gap = CAROUSEL_BEATS[i + 1] - CAROUSEL_BEATS[i];
      kfTimes.push(CAROUSEL_BEATS[i] + gap * HOLD_FRAC);
      kfVals.push(i);
    }
  }
  const activeIndex = interpolate(t, kfTimes, kfVals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringAngle = activeIndex * sliceAngle;

  const titleOp = interpolate(t, [0, 0.25, 1.05, 1.30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSpring = spring({
    frame: frame - 0.1 * fps,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
  });

  const carouselOp = interpolate(t, [1.0, 1.30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* 3D carousel */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          perspective: 1800,
          opacity: carouselOp,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${-ringAngle}deg)`,
          }}
        >
          {CAROUSEL_SLIDES.map((file, i) => {
            const angle = i * sliceAngle;
            const cardAngleInView = ((angle - ringAngle) % 360 + 360) % 360;
            const isFront = cardAngleInView < 30 || cardAngleInView > 330;
            const isBack = cardAngleInView > 120 && cardAngleInView < 240;
            return (
              <div
                key={file}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  left: -CARD_W / 2,
                  top: -CARD_H / 2,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${CAROUSEL_RADIUS}px)`,
                  opacity: isBack ? 0.15 : 1,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: isFront
                    ? `0 12px 48px rgba(0,0,0,0.6)`
                    : `0 4px 16px rgba(0,0,0,0.3)`,
                }}
              >
                <Img
                  src={staticFile(file)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Title card overlay — "Here's what we automate." */}
      <AbsoluteFill
        style={{
          backgroundColor: C.bg,
          fontFamily: "Inter, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOp,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2.5,
            textAlign: "center",
            transform: `scale(${0.9 + titleSpring * 0.1})`,
          }}
        >
          <span style={{ color: C.white }}>Here&apos;s </span>
          <span
            style={{
              color: C.teal,
              textShadow: `0 0 26px ${C.teal}60`,
            }}
          >
            what we automate.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6 — Why Days, Not Years ────────────────────────────
// Kinetic headline + contrast bars + 4-reason row, reveals synced to
// scene6-deploy.mp3 beats (silencedetect -35dB:0.2, regen 2026-04-20,
// trimmed to 28.87s → beats at 5.41 / 11.57 / 18.14 / 24.10).
const Scene6Deploy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lerp = (inR: [number, number], outR: [number, number]) =>
    interpolate(t, inR, outR, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Headline spring-in
  const hlSpring = spring({
    frame: frame - 0.2 * fps,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const hlOpacity = lerp([0.2, 1.2], [0, 1]);
  const hlY = (1 - hlSpring) * 36;


  // Contrast bars
  const stripOpacity = lerp([2.6, 3.6], [0, 1]);
  const oldBar = lerp([3.0, 5.2], [0, 100]);
  const newBar = lerp([3.9, 4.5], [0, 8]);

  const CARD_BEATS = [5.41, 11.57, 18.14, 24.10];
  const CARDS: {
    title: string;
    body: string;
    icon: "lock" | "plug" | "flask" | "sparkle";
  }[] = [
    {
      title: "Nothing in the stack changes",
      body: "AOS uses the systems already in place. No replatforming, no data migration.",
      icon: "lock",
    },
    {
      title: "Middleware does the work",
      body: "AOS connects through your existing integration infrastructure — not hundreds of APIs.",
      icon: "plug",
    },
    {
      title: "Synthetic data farm",
      body: "Enterprise-scale readiness before deployment. Problems caught before you go live.",
      icon: "flask",
    },
    {
      title: "Mai handles the prep",
      body: "Human-supervised discovery, requirements, and integration feasibility — all automated.",
      icon: "sparkle",
    },
  ];

  let activeIdx = -1;
  for (let i = CARD_BEATS.length - 1; i >= 0; i--) {
    if (t >= CARD_BEATS[i]) {
      activeIdx = i;
      break;
    }
  }

  const endDim = lerp([26.5, 28.0], [1, 0.22]);
  const closingOp = lerp([26.5, 28.0], [0, 1]);
  const closingY = lerp([26.5, 28.0], [26, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: "Inter, sans-serif",
        color: C.white,
      }}
    >
      {/* Headline + contrast bars */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 80,
          right: 80,
          opacity: hlOpacity,
          transform: `translateY(${hlY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.0,
          }}
        >
          <span style={{ color: C.white }}>Days.</span>{" "}
          <span style={{ color: C.caption }}>Not years.</span>
        </div>

        <div
          style={{
            marginTop: 34,
            opacity: stripOpacity,
            maxWidth: 920,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <ContrastBar
            label="Traditional"
            labelColor={C.caption}
            value="12–18 months"
            width={oldBar}
            barColor="rgba(200,120,120,0.55)"
          />
          <ContrastBar
            label="AOS"
            labelColor={C.teal}
            value="days"
            width={newBar}
            barColor={C.teal}
            glow
          />
        </div>
      </div>

      {/* 4 cards in a row — bottom clears avatar PIP */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 80,
          right: 80,
          bottom: 400,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 22,
        }}
      >
        {CARDS.map((card, i) => {
          const revealT = 4.8 + i * 0.35;
          const appear = interpolate(
            t,
            [revealT, revealT + 0.6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const isActive = i === activeIdx;
          const dim = activeIdx >= 0 && !isActive ? 0.42 : 1;
          const kick = spring({
            frame: frame - CARD_BEATS[i] * fps,
            fps,
            config: { damping: 16, stiffness: 180, mass: 0.5 },
          });
          const scale = isActive ? 1 + kick * 0.035 : 1;

          return (
            <div
              key={card.title}
              style={{
                background: isActive
                  ? "linear-gradient(160deg, #2A3E52, #1C2C3C)"
                  : "#1F2E3D",
                borderRadius: 18,
                padding: "26px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                opacity: appear * dim * endDim,
                transform: `translateY(${(1 - appear) * 26}px) scale(${scale})`,
                border: isActive
                  ? `2px solid ${C.teal}`
                  : "2px solid rgba(255,255,255,0.06)",
                boxShadow: isActive
                  ? `0 0 44px ${C.teal}40, 0 10px 28px rgba(0,0,0,0.45)`
                  : "0 6px 18px rgba(0,0,0,0.35)",
              }}
            >
              <CardIcon name={card.icon} active={isActive} />
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: 1.18,
                  color: C.white,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {card.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing tagline — floats in as Mai finishes */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -1.5,
          lineHeight: 1,
          color: C.teal,
          opacity: closingOp,
          transform: `translateY(${closingY}px)`,
          textShadow: `0 0 28px ${C.teal}60`,
        }}
      >
        Abstraction over extraction.
      </div>
    </AbsoluteFill>
  );
};

const ContrastBar: React.FC<{
  label: string;
  labelColor: string;
  value: string;
  width: number;
  barColor: string;
  glow?: boolean;
}> = ({ label, labelColor, value, width, barColor, glow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div
      style={{
        width: 160,
        textAlign: "right",
        fontSize: 20,
        color: labelColor,
        fontWeight: glow ? 600 : 400,
      }}
    >
      {label}
    </div>
    <div
      style={{
        flex: 1,
        height: 14,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 7,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: barColor,
          borderRadius: 7,
          boxShadow: glow ? `0 0 18px ${barColor}` : undefined,
        }}
      />
    </div>
    <div
      style={{
        width: 140,
        fontSize: 20,
        color: labelColor,
        fontWeight: glow ? 600 : 400,
      }}
    >
      {value}
    </div>
  </div>
);

const CardIcon: React.FC<{
  name: "lock" | "plug" | "flask" | "sparkle";
  active: boolean;
}> = ({ name, active }) => {
  const color = active ? C.teal : "rgba(255,255,255,0.82)";
  const props = {
    width: 48,
    height: 48,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "lock")
    return (
      <svg {...props}>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    );
  if (name === "plug")
    return (
      <svg {...props}>
        <path d="M9 2v6" />
        <path d="M15 2v6" />
        <path d="M7 8h10v4a5 5 0 0 1-10 0V8z" />
        <path d="M12 17v5" />
      </svg>
    );
  if (name === "flask")
    return (
      <svg {...props}>
        <path d="M10 2h4" />
        <path d="M10 2v6l-5 11a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-11V2" />
        <path d="M7 14h10" />
      </svg>
    );
  return (
    <svg {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M5.6 5.6l2.8 2.8" />
      <path d="M15.6 15.6l2.8 2.8" />
      <path d="M5.6 18.4l2.8-2.8" />
      <path d="M15.6 8.4l2.8-2.8" />
    </svg>
  );
};

// ─── Audio tracks — individual Matilda MP3s per scene ────────
// Always rendered (both avatar and non-avatar variants). The PIP
// video is muted so this is the only audio source.
const TRACKS: { id: keyof typeof D; from: number }[] = [
  // scene0-mai-intro retired 2026-04-18 — opens with silent brand flash now
  { id: "scene1-problems",       from: T_S1 },
  // scene2 audio is delayed 0.7s inside the scene so Mai never cuts in on
  // a dark frame during Scene2HowItWorks' fade-in. All KF times in that
  // component are shifted to match (they live in scene-time).
  { id: "scene2-all",            from: T_S2 + f(0.7) },
  { id: "scene3a-all",           from: T_S3A },
  { id: "scene4-knowledgegraph", from: T_S4 },
  { id: "scene5-intro",          from: T_S5I },
  { id: "scene5-all",            from: T_S5 },
  { id: "scene6-deploy",         from: T_S6 },
  { id: "scene7-closing",        from: T_S7 },
];

// ─── Main composition ─────────────────────────────────────────
export const AosDemo: React.FC<{ showAvatar?: boolean }> = ({
  showAvatar = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Visual scenes — each persists for its narration group's duration */}
      <Sequence from={T_TITLE} durationInFrames={f(G.titleCard)}>
        <TitleCard />
      </Sequence>
      <Sequence from={T_S1} durationInFrames={f(G.scene1)}>
        <LogoAvalanche />
      </Sequence>
      <Sequence from={T_S2} durationInFrames={f(G.scene2)}>
        <Scene2HowItWorks />
      </Sequence>
      <Sequence from={T_S3A} durationInFrames={f(G.scene3a)}>
        <MaiChat />
      </Sequence>
      <Sequence from={T_S4} durationInFrames={f(G.scene4)}>
        <SceneVideo file="scene4.mp4" />
      </Sequence>
      <Sequence from={T_S5I} durationInFrames={f(G.scene5i)}>
        <FadedBackground file="convergence_ig.jpeg" />
      </Sequence>
      <Sequence from={T_S5} durationInFrames={f(G.scene5)}>
        <Scene5Slides />
      </Sequence>
      <Sequence from={T_S6} durationInFrames={f(G.scene6)}>
        <Scene6Deploy />
      </Sequence>
      <Sequence from={T_S7} durationInFrames={f(G.scene7)}>
        <StaticSlide file="closing.png" />
      </Sequence>

      {/* Audio — pristine Matilda MP3s, identical for both variants */}
      {TRACKS.map((t) => (
        <Sequence key={t.id} from={t.from} durationInFrames={f(D[t.id])}>
          <Audio src={staticFile(`avatar/audio/${t.id}.mp3`)} />
        </Sequence>
      ))}

      {/* Avatar PIP — muted video overlay, only when showAvatar */}
      {showAvatar && (
        <Sequence from={0} durationInFrames={AOS_FRAMES}>
          <AvatarBubble />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
