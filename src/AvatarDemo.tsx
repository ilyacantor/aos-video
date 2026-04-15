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
  "scene0-mai-intro": 5.43,
  "scene1-problems": 20.71, // 20.56 audio + 0.15 breath gap before scene2-solution
  "scene2-solution": 12.08,
  "scene2-all": 47.96,
  "scene3a-all": 26.20,
  "scene4-knowledgegraph": 14.48,
  "scene5-intro": 9.43,
  "scene5-all": 34.96,
  "scene6-deploy": 43.08,
  "scene7-closing": 8.87,
};

// ─── Narration groups → visual scenes ─────────────────────────
// Each group = one D-ID clip. Speech drives timing.

const TAIL_HOLD = 3.0; // Hold closing slide after Mai finishes

const G = {
  titleCard: D["scene0-mai-intro"],
  scene1: D["scene1-problems"],
  scene2i: D["scene2-solution"],
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
  T_TITLE, T_S1, T_S2I, T_S2, T_S3A, T_S4, T_S5I, T_S5, T_S6, T_S7, T_END,
] = starts;

export const AVATAR_FRAMES = T_END;

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
          The Semantic Operating System for Enterprise
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
  opacity = 0.35,
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

// ─── Scene 5 — slides timed to scene5-all speech breakpoints ──
// Breakpoints from `silencedetect -30dB:0.35` on the Matilda MP3 —
// mid-silence transitions so Mai's next sentence lands on the new visual.
const Scene5Slides: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const XFADE = 0.25;

  const slides = [
    { start: 12.44, end: 17.66, file: "combine_fs.png" },
    { start: 17.66, end: 21.82, file: "qofe2.png" },
    { start: 21.82, end: 27.27, file: "ebitda2.png" },
    { start: 27.27, end: 31.60, file: "x-sell2.png" },
    { start: 31.60, end: 34.96, file: "backoffice2.png" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {slides.map((s, i) => {
        const fadeIn = interpolate(
          frame,
          [(s.start - XFADE) * fps, s.start * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const fadeOut =
          i === slides.length - 1
            ? 1
            : interpolate(
                frame,
                [s.end * fps, (s.end + XFADE) * fps],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
        const opacity = Math.min(fadeIn, fadeOut);
        return (
          <Img
            key={s.file}
            src={staticFile(s.file)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 5 Intro — M&A setup (kinetic typography) ─────────
// Replaces MA.png for the first ~12.4s of scene5-all. Four stages
// that dissolve into each other, synced to VO:
//   "Seventy percent of M&A deals fail. The real deal-breakers
//    got lost in execution trivia. Convergence automates
//    comprehension. Surface what should break the deal — before
//    it does."
// NOTE: stage timings are tuned for a ~12.4s slot. After regen
// of scene5-all.mp3, re-run silencedetect and adjust both the
// stage windows below AND the Scene5Slides breakpoints.
const Scene5Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };
  const lerp = (inR: [number, number], outR: [number, number]) =>
    interpolate(t, inR, outR, clamp);

  // Stage helper: fade in over 0.5s starting at inS, fade out
  // over 0.4s ending at outS.
  const stage = (inS: number, outS: number) => {
    const inOp = interpolate(t, [inS, inS + 0.5], [0, 1], clamp);
    const outOp = interpolate(t, [outS - 0.4, outS], [1, 0], clamp);
    return Math.min(inOp, outOp);
  };

  // Root fade — crossfades with combine_fs.png in Scene5Slides at 12.44
  const rootFade = lerp([12.04, 12.44], [1, 0]);

  // Beats from silencedetect on scene5-all.mp3 (post-trim, no "M&A, de-risked"):
  //  0.00–2.21  "Seventy percent of M&A deals fail."
  //  2.66–5.47  "The real deal-breakers got lost in execution trivia."
  //  6.06–9.60  "Convergence automates comprehension."   (internal gap 7.92–8.17)
  //  9.85–10.68 "Surface what should break the deal"
  // 11.51–12.09 "before it does"
  // 12.44+      "Here's what we automate..." (Scene5Slides)
  const s1 = stage(0.2, 2.6);
  const s2 = stage(2.8, 5.8);
  const s3 = stage(6.1, 9.7);
  const s4 = stage(9.9, 13.0); // stays full through rootFade close

  const s1Scale = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.6 },
  });
  const s2bIn = lerp([4.1, 4.7], [0, 1]);
  const s3Underline = lerp([8.2, 9.0], [0, 1]);
  const s3Scale = spring({
    frame: frame - 6.1 * fps,
    fps,
    config: { damping: 17, stiffness: 130, mass: 0.5 },
  });
  const s4bIn = lerp([11.5, 12.0], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Inter, sans-serif",
        color: C.white,
        opacity: rootFade,
      }}
    >
      {/* Stage 1: 70% stat */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s1,
          transform: `scale(${0.65 + s1Scale * 0.35})`,
        }}
      >
        <div
          style={{
            fontSize: 224,
            fontWeight: 800,
            color: C.teal,
            letterSpacing: -6,
            lineHeight: 1,
            textShadow: `0 0 50px ${C.teal}55`,
          }}
        >
          70%
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 48,
            fontWeight: 600,
            color: C.white,
            letterSpacing: -1,
          }}
        >
          of M&amp;A deals fail.
        </div>
      </div>

      {/* Stage 2: diagnosis */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s2,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: C.white,
            letterSpacing: -1.5,
            lineHeight: 1.15,
          }}
        >
          The real deal-breakers
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 50,
            fontWeight: 500,
            color: C.caption,
            letterSpacing: -1,
            opacity: s2bIn,
          }}
        >
          got lost in the trivia.
        </div>
      </div>

      {/* Stage 3: Convergence automates comprehension */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s3,
          transform: `scale(${0.9 + s3Scale * 0.1})`,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: C.white }}>Convergence automates </span>
          <span
            style={{
              color: C.teal,
              position: "relative",
              display: "inline-block",
            }}
          >
            comprehension.
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 4,
                height: 5,
                width: "100%",
                background: C.teal,
                transformOrigin: "left center",
                transform: `scaleX(${s3Underline})`,
                borderRadius: 3,
                boxShadow: `0 0 18px ${C.teal}`,
              }}
            />
          </span>
        </div>
      </div>

      {/* Stage 4: surface deal-breakers */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s4,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: C.white,
            letterSpacing: -1.4,
            lineHeight: 1.15,
          }}
        >
          Surface what should break the deal.
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 50,
            fontWeight: 600,
            color: C.teal,
            letterSpacing: -1,
            opacity: s4bIn,
          }}
        >
          Before it does.
        </div>
      </div>

    </AbsoluteFill>
  );
};

// ─── Scene 6 — Why Days, Not Years ────────────────────────────
// Kinetic headline + contrast bars + 4-reason row, reveals synced to
// scene6-deploy.mp3 beats (silencedetect -35dB:0.2 → Mai names each
// reason at 6.20 / 14.35 / 22.45 / 31.15 s). Post-quip regen 2026-04-15.
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

  const CARD_BEATS = [6.20, 14.35, 22.45, 31.15];
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

  // Closing tagline — "Abstraction, not extraction." floats in at scene end
  // Bumped +2.4s post scene6-deploy regen (2026-04-15) to preserve feel
  const endDim = lerp([39.9, 41.4], [1, 0.22]);
  const closingOp = lerp([39.9, 41.4], [0, 1]);
  const closingY = lerp([39.9, 41.4], [26, 0]);

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
  { id: "scene0-mai-intro",      from: T_TITLE },
  { id: "scene1-problems",       from: T_S1 },
  { id: "scene2-solution",       from: T_S2I },
  { id: "scene2-all",            from: T_S2 },
  { id: "scene3a-all",           from: T_S3A },
  { id: "scene4-knowledgegraph", from: T_S4 },
  { id: "scene5-intro",          from: T_S5I },
  { id: "scene5-all",            from: T_S5 },
  { id: "scene6-deploy",         from: T_S6 },
  { id: "scene7-closing",        from: T_S7 },
];

// ─── Main composition ─────────────────────────────────────────
export const AvatarDemo: React.FC<{ showAvatar?: boolean }> = ({
  showAvatar = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Visual scenes — each persists for its narration group's duration */}
      <Sequence from={T_TITLE} durationInFrames={f(G.titleCard)}>
        <TitleCard />
      </Sequence>
      <Sequence from={T_S1} durationInFrames={f(G.scene1)}>
        <StaticSlide file="new-problem.png" />
      </Sequence>
      <Sequence from={T_S2I} durationInFrames={f(G.scene2i)}>
        <SceneVideo file="scene2i.mp4" />
      </Sequence>
      <Sequence from={T_S2} durationInFrames={f(G.scene2)}>
        <SceneVideo file="scene2.mp4" />
      </Sequence>
      {/* scene3a.mp4 has two sub-scenes with a hard cut at local ~14s.
          Split the visual sequence at the narration silence (13.31s into
          scene3a-all.mp3, between "I speak fluent spreadsheet, too." and
          "You can also ask me to make changes…") so the visual cut lands
          on the verbal pause instead of mid-sentence. */}
      <Sequence from={T_S3A} durationInFrames={f(13.31)}>
        <SceneVideo file="scene3a.mp4" startFrom={10} />
      </Sequence>
      <Sequence
        from={T_S3A + f(13.31)}
        durationInFrames={f(G.scene3a - 13.31)}
      >
        <SceneVideo file="scene3a.mp4" startFrom={420} />
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
      <Sequence from={T_S5} durationInFrames={f(12.44)}>
        <Scene5Intro />
      </Sequence>
      <Sequence from={T_S6} durationInFrames={f(G.scene6)}>
        <Scene6Deploy />
      </Sequence>
      <Sequence from={T_S7} durationInFrames={f(G.scene7)}>
        <StaticSlide file="closing-new.png" />
      </Sequence>

      {/* Audio — pristine Matilda MP3s, identical for both variants */}
      {TRACKS.map((t) => (
        <Sequence key={t.id} from={t.from} durationInFrames={f(D[t.id])}>
          <Audio src={staticFile(`avatar/audio/${t.id}.mp3`)} />
        </Sequence>
      ))}

      {/* Avatar PIP — muted video overlay, only when showAvatar */}
      {showAvatar && (
        <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
          <AvatarBubble />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
