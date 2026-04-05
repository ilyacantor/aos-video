import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { Video, Audio } from "@remotion/media";
// import { loadFont } from "@remotion/google-fonts/Quicksand";
// const { fontFamily } = loadFont();
const fontFamily = "Quicksand";

// ═══════════════════════════════════════════════════════════
// Design Tokens (autonomOS palette)
// ═══════════════════════════════════════════════════════════
const C = {
  bg: "#2F4050",
  white: "#FFFFFF",
  caption: "#97999E",
  orange: "#FC8337",
  teal: "#15E3D6",
  cardBg: "#505462",
  cardBorder: "#565151",
};
const FONT = `${fontFamily}, sans-serif`;

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════
const anim = (frame: number, fps: number, delaySec: number) => {
  const p = spring({
    frame: frame - delaySec * fps,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  return {
    opacity: p,
    y: interpolate(p, [0, 1], [20, 0]),
    x: interpolate(p, [0, 1], [-40, 0]),
    p,
  };
};

const lerp = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ═══════════════════════════════════════════════════════════
// Problem columns data
// ═══════════════════════════════════════════════════════════
const COLUMNS = [
  {
    title: "Enterprise Information is Broken",
    bullets: [
      { text: "900+ applications", highlight: " by the average enterprise (before agentic sprawl)" },
      { text: "71% are disconnected", highlight: "" },
      { text: "95% of IT leaders", highlight: " cite integration as the #1 barrier to AI adoption" },
    ],
  },
  {
    title: "Adaptation is Stalled",
    bullets: [
      { text: "Organizations constrained", highlight: " by decades-old record-keeping systems" },
      { text: "Budgets allocated to maintenance,", highlight: " not innovation" },
      { text: "Legacy architecture", highlight: " cannot support agentic AI" },
    ],
  },
  {
    title: "The Context Gap",
    bullets: [
      { text: "Enterprise data exists across hundreds of systems", highlight: " with no shared semantic layer to reconcile it" },
      { text: "Teams operate from different numbers,", highlight: " different definitions, multiple sources of truth" },
      { text: "AI agents hallucinate", highlight: " as they need structured context to act reliably" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// Scene 1: Problem Setup
// ═══════════════════════════════════════════════════════════
const Scene1Problems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const funnelIn = spring({ frame, fps, config: { damping: 200 } });
  const colDelays = [1.5, 4.5, 7.5];
  const fadeOutOpacity = lerp(frame, [11.5 * fps, 13 * fps], [1, 0]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.bg, fontFamily: FONT, opacity: fadeOutOpacity }}
    >
      {/* ── Funnel video ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 30,
          bottom: 30,
          width: "42%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: funnelIn,
        }}
      >
        <Video
          src={staticFile("funnel.mp4")}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            display: "block",
            borderRadius: 14,
          }}
          volume={0}
          loop
        />
      </div>

      {/* ── Problem columns ── */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 0,
          width: "46%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {COLUMNS.map((col, i) => {
          const a = anim(frame, fps, colDelays[i]);
          return (
            <div
              key={col.title}
              style={{
                opacity: a.opacity,
                transform: `translateX(${a.x}px)`,
                background: C.cardBg,
                border: `1px solid ${C.cardBorder}`,
                borderTop: `3px solid ${C.orange}`,
                borderRadius: 14,
                padding: "18px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: C.white,
                  marginBottom: 10,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {col.bullets.map((b, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 27,
                      lineHeight: 1.5,
                      color: C.caption,
                      paddingLeft: 14,
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ color: C.orange, fontWeight: 600 }}>
                      {b.text}
                    </span>
                    {b.highlight}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 2: AOS as Solution
// ═══════════════════════════════════════════════════════════
const AOS_TEXT = [
  "AOS is a lightweight, rapidly deployed abstraction layer that floats on top of your IT landscape.",
  "It doesn\u2019t move data. It doesn\u2019t replace systems.",
  "It just connects to what\u2019s already there.",
  "And understands what\u2019s already there.",
];

const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 200 } });
  const textDelays = [1.5, 3, 4.5, 5.5];

  // Image drifts in slowly from right and scales up as text appears
  const imgProgress = lerp(frame, [0, 7 * fps], [0, 1]);
  const imgX = interpolate(imgProgress, [0, 1], [120, 0]);
  const imgScale = interpolate(imgProgress, [0, 1], [0.88, 1]);
  const imgOpacity = lerp(frame, [0, 1.2 * fps], [0, 1]);

  // Subtle continuous drift after settling
  const drift = Math.sin(frame * 0.008) * 6;
  const driftY = Math.cos(frame * 0.006) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      {/* ── Right side: A1 pipeline — floats in with 3D perspective ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "72%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
        }}
      >
        <div
          style={{
            opacity: imgOpacity,
            transform: `
              translateX(${imgX + drift}px)
              translateY(${driftY}px)
              scale(${imgScale})
              rotateY(${interpolate(imgProgress, [0, 1], [-12, -4])}deg)
              rotateX(${interpolate(imgProgress, [0, 1], [6, 2])}deg)
            `,
            boxShadow: `
              ${interpolate(imgProgress, [0, 1], [30, 15])}px
              ${interpolate(imgProgress, [0, 1], [20, 10])}px
              ${interpolate(imgProgress, [0, 1], [60, 40])}px
              rgba(0,0,0,0.4)
            `,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("a1.jpeg")}
            style={{
              width: 1200,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ── Left side: card (20% smaller than before) ── */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: "50%",
          transform: `translateY(-50%) translateX(${interpolate(cardIn, [0, 1], [-20, 0])}px)`,
          width: "24%",
          background: C.cardBg,
          border: `1px solid ${C.cardBorder}`,
          borderTop: `3px solid ${C.orange}`,
          borderRadius: 14,
          padding: "24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: cardIn,
        }}
      >
        {/* Title */}
        <div style={{ fontSize: 37, fontWeight: 600, lineHeight: 1.2 }}>
          <span style={{ color: C.white }}>Introducing</span>
          <br />
          <span style={{ color: C.white }}>autonom</span>
          <span style={{ color: C.teal }}>OS</span>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 50,
            height: 3,
            borderRadius: 2,
            background: C.teal,
            opacity: 0.6,
          }}
        />

        {/* Text lines */}
        {AOS_TEXT.map((line, i) => {
          const a = anim(frame, fps, textDelays[i]);
          return (
            <div
              key={i}
              style={{
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.5,
                color: i >= 2 ? C.teal : C.white,
                opacity: a.opacity,
                transform: `translateY(${a.y}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 0: Title Screen
// ═══════════════════════════════════════════════════════════
const Scene0Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Favicon: zooms in from center, slow spin, settles to lower-left at ~3.5s
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

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      {/* ── Title text ── */}
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

      {/* ── Spinning favicon ── */}
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

// ═══════════════════════════════════════════════════════════
// Scene 3a: NLQ Query Demo
// ═══════════════════════════════════════════════════════════
// ── Chat exchange data ──
const CHAT = [
  { q: "what\u2019s the margin this year?", a: "Gross: 39.6%, Operating: 22.6%, Net: 17.2%" },
  { q: "what was it in Q1?", a: "Gross margin in Q1 was 40%." },
  { q: "what were the drivers?", a: "Revenue increase 5%, direct comp flat." },
];

const Scene3aNLQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const modalIn = spring({ frame, fps, config: { damping: 200 } });

  // Each exchange: type query → pause → show answer
  // Exchange timing: [typeStart, answerStart] in seconds
  const exchanges = [
    { typeAt: 0.8, answerAt: 2.8 },
    { typeAt: 3.8, answerAt: 5.3 },
    { typeAt: 6.3, answerAt: 7.8 },
  ];

  const charsPerSec = 14;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      {/* ── Chat modal ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(modalIn, [0, 1], [0.95, 1])})`,
          width: 620,
          background: "#1a1f2a",
          borderRadius: 16,
          overflow: "hidden",
          opacity: modalIn,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: C.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#1a1f2a",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            Maestra
          </span>
          <span style={{ fontSize: 14, color: "#666", marginLeft: 4 }}>
            Meridian \u2192 Cascadia
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            {["\u22EE", "\u2013", "\u00D7"].map((s) => (
              <span key={s} style={{ fontSize: 16, color: "#555", cursor: "default" }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Chat messages area ── */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 380,
          }}
        >
          {exchanges.map((ex, i) => {
            const chat = CHAT[i];

            // Typewriter for query
            const typeElapsed = Math.max(0, sec - ex.typeAt);
            const chars = Math.min(
              Math.floor(typeElapsed * charsPerSec),
              chat.q.length,
            );
            const typed = chat.q.slice(0, chars);
            const queryVisible = sec >= ex.typeAt;
            const cursorVisible = sec >= ex.typeAt && sec < ex.answerAt;
            const blink = Math.sin(frame * 0.2) > 0;

            // Answer fade in
            const ansA = anim(frame, fps, ex.answerAt);

            if (!queryVisible) return null;

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* User query — right aligned */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 20,
                      padding: "10px 18px",
                      maxWidth: 400,
                      fontSize: 16,
                      color: "#FFFFFF",
                      fontWeight: 500,
                    }}
                  >
                    {typed}
                    {cursorVisible && blink && (
                      <span style={{ color: C.teal, marginLeft: 1 }}>|</span>
                    )}
                  </div>
                </div>

                {/* Maestra response — left aligned */}
                {ansA.opacity > 0.01 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      opacity: ansA.opacity,
                      transform: `translateY(${ansA.y}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 5,
                        background: C.teal,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#1a1f2a",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      M
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#d0d4dc",
                        lineHeight: 1.5,
                        fontWeight: 400,
                      }}
                    >
                      {chat.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Input box ── */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 15,
              color: "#555",
            }}
          >
            Ask Maestra...
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: C.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#1a1f2a",
            }}
          >
            \u27A4
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 3b: Dashboard — flies in from top right with 3D
// ═══════════════════════════════════════════════════════════
const Scene3bDash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flyIn = spring({
    frame: frame - 0.2 * fps,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.5 },
  });

  const x = interpolate(flyIn, [0, 1], [600, 0]);
  const y = interpolate(flyIn, [0, 1], [-400, 0]);
  const rotX = interpolate(flyIn, [0, 1], [-20, 3]);
  const rotY = interpolate(flyIn, [0, 1], [25, -4]);
  const scale = interpolate(flyIn, [0, 1], [0.6, 1]);

  // Subtle float after settling
  const drift = Math.sin(frame * 0.007) * 5;
  const driftY = Math.cos(frame * 0.005) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
        }}
      >
        <div
          style={{
            transform: `
              translateX(${x + drift}px)
              translateY(${y + driftY}px)
              scale(${scale})
              rotateX(${rotX}deg)
              rotateY(${rotY}deg)
            `,
            boxShadow: `
              ${interpolate(flyIn, [0, 1], [40, 15])}px
              ${interpolate(flyIn, [0, 1], [-30, 10])}px
              ${interpolate(flyIn, [0, 1], [80, 40])}px
              rgba(0,0,0,0.5)
            `,
            borderRadius: 12,
            overflow: "hidden",
            opacity: flyIn,
          }}
        >
          <Img
            src={staticFile("dash.png")}
            style={{
              width: 1500,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene Durations
// ═══════════════════════════════════════════════════════════
const S0_DUR = 4;
const S1_DUR = 14;
const S2_DUR = 9;
const S3A_DUR = 10;
const S3B_DUR = 5;

export const DEMO_V2_FRAMES = (S0_DUR + S1_DUR + S2_DUR + S3A_DUR + S3B_DUR) * 30;

// ═══════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════
export const DemoV2: React.FC = () => {
  const S0 = S0_DUR * 30;
  const S1 = S1_DUR * 30;
  const S2 = S2_DUR * 30;
  const S3A = S3A_DUR * 30;
  const S3B = S3B_DUR * 30;
  const AFTER_S0 = S1 + S2 + S3A + S3B;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence from={0} durationInFrames={S0} premountFor={30}>
        <Scene0Title />
      </Sequence>

      <Sequence from={S0} durationInFrames={S1} premountFor={30}>
        <Scene1Problems />
      </Sequence>

      <Sequence from={S0 + S1} durationInFrames={S2} premountFor={30}>
        <Scene2Solution />
      </Sequence>

      <Sequence from={S0 + S1 + S2} durationInFrames={S3A} premountFor={30}>
        <Scene3aNLQ />
      </Sequence>

      <Sequence from={S0 + S1 + S2 + S3A} durationInFrames={S3B} premountFor={30}>
        <Scene3bDash />
      </Sequence>

      {/* ── Logo watermark — visible after Scene 0 ── */}
      <Sequence from={S0} durationInFrames={AFTER_S0} premountFor={0}>
        <Img
          src={staticFile("favicon.png")}
          style={{
            position: "absolute",
            bottom: 28,
            left: 32,
            width: 36,
            height: 36,
            opacity: 0.7,
          }}
        />
      </Sequence>

      {/* ── Voiceover audio per scene ── */}
      <Sequence from={0} durationInFrames={S0}>
        <Audio src={staticFile("voiceover/scene0-title.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={S0} durationInFrames={S1}>
        <Audio src={staticFile("voiceover/scene1-problems.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={S0 + S1} durationInFrames={S2}>
        <Audio src={staticFile("voiceover/scene2-solution.mp3")} volume={0.9} />
      </Sequence>
    </AbsoluteFill>
  );
};
