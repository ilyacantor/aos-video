import React, { useRef, useEffect } from "react";
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
// Scene Durations (seconds) — sized to voiceover lengths
// Voiceovers: S0=2.85s, S1=10.79s, S2=12.88s, S3A=14.31s, S3B=10.66s, S4=29.73s, S5≈29.4s (title 10.4s + 5 × ≤4s)
// ═══════════════════════════════════════════════════════════
const S0_DUR = 4;
const S1_DUR = 12;
const S2_DUR = 14;
const S3A_DUR = 15;
const S3B_DUR = 12;
const S4_DUR = 31;
const S5_DUR = 31; // Convergence: 11s title + 5 × 4s visuals
const FADE = 0.3; // uniform end-of-scene fade-out

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

// Uniform end-of-scene fade-out for consistent transitions
const sceneFadeOut = (frame: number, fps: number, durSec: number) =>
  lerp(frame, [(durSec - FADE) * fps, durSec * fps], [1, 0]);

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
  const colDelays = [1.5, 6];
  const fadeOutOpacity = sceneFadeOut(frame, fps, S1_DUR);

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
          gap: 50,
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
                borderTop: `4px solid ${C.orange}`,
                borderRadius: 16,
                padding: "28px 32px",
              }}
            >
              <div
                style={{
                  fontSize: 50,
                  fontWeight: 600,
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.bullets.map((b, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 33,
                      lineHeight: 1.5,
                      color: C.caption,
                      paddingLeft: 16,
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
  // Spread text delays across the 12.88s voiceover
  const textDelays = [1.5, 4, 7, 10];

  // Image drifts in slowly from right and scales up as text appears
  const imgProgress = lerp(frame, [0, 7 * fps], [0, 1]);
  const imgX = interpolate(imgProgress, [0, 1], [120, 0]);
  const imgScale = interpolate(imgProgress, [0, 1], [0.88, 1]);
  const imgOpacity = lerp(frame, [0, 1.2 * fps], [0, 1]);

  // Subtle continuous drift after settling
  const drift = Math.sin(frame * 0.008) * 6;
  const driftY = Math.cos(frame * 0.006) * 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        opacity: sceneFadeOut(frame, fps, S2_DUR),
      }}
    >
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
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        opacity: sceneFadeOut(frame, fps, S0_DUR),
      }}
    >
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
  // Spread across the 14.31s Mai voiceover
  const exchanges = [
    { typeAt: 1.0, answerAt: 3.0 },
    { typeAt: 5.0, answerAt: 7.0 },
    { typeAt: 9.5, answerAt: 11.5 },
  ];

  const charsPerSec = 14;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        opacity: sceneFadeOut(frame, fps, S3A_DUR),
      }}
    >
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
            Mai
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
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        opacity: sceneFadeOut(frame, fps, S3B_DUR),
      }}
    >
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
// Scene 4: Knowledge Graph — 3D zoom + frame-synced clicks
// ═══════════════════════════════════════════════════════════
const KG_TEXT = [
  "Ontologies define domain knowledge \u2014 definitions, relationships, and rules.",
  "A knowledge graph acquires and integrates data into an ontology.",
  "Then makes that knowledge available to enterprise applications, reporting, and agents.",
];

// Click sequence: [startSec, endSec, nodeId, cursorX%, cursorY%]
// Spread across the 29.73s voiceover narrative; final 5s left for
// the "single, context-aware source of truth" payoff on full graph.
const KG_CLICKS: [number, number, string, number, number][] = [
  [7, 9, "meridian", 44.2, 60.5],
  [12, 14, "contract", 56.4, 36.7],
  [17, 19, "engagement", 47, 39.6],
  [22, 24, "owner", 31.8, 51.6],
];

const Scene4KnowledgeGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 3D zoom-in
  const zoomProgress = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 30, mass: 2 },
  });
  const rotX = interpolate(zoomProgress, [0, 1], [18, 0]);
  const rotY = interpolate(zoomProgress, [0, 1], [-12, 0]);
  const scale = interpolate(zoomProgress, [0, 1], [0.65, 1]);
  const translateZ = interpolate(zoomProgress, [0, 1], [-200, 0]);

  // Active node at this frame
  const activeClick = KG_CLICKS.find(([start, end]) => sec >= start && sec < end);
  const activeNodeId = activeClick ? activeClick[2] : null;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    if (activeNodeId) {
      iframe.contentWindow.postMessage({ type: "selectNode", nodeId: activeNodeId }, "*");
    } else {
      iframe.contentWindow.postMessage({ type: "clear" }, "*");
    }
  }, [activeNodeId]);

  // Cursor position
  let cursorX = 50;
  let cursorY = 90;
  let cursorVisible = false;

  if (sec >= 3.5) {
    cursorVisible = true;
    for (let i = 0; i < KG_CLICKS.length; i++) {
      const [start, end, , tx, ty] = KG_CLICKS[i];
      const approachStart = i === 0 ? 3.5 : KG_CLICKS[i - 1][1] + 0.2;
      if (sec >= approachStart && sec < end + 0.2) {
        const moveProgress = lerp(frame, [approachStart * fps, (start - 0.2) * fps], [0, 1]);
        const prevX = i === 0 ? 50 : KG_CLICKS[i - 1][3];
        const prevY = i === 0 ? 90 : KG_CLICKS[i - 1][4];
        cursorX = prevX + (tx - prevX) * moveProgress;
        cursorY = prevY + (ty - prevY) * moveProgress;
        break;
      }
    }
    if (sec >= KG_CLICKS[KG_CLICKS.length - 1][1]) {
      cursorX = KG_CLICKS[KG_CLICKS.length - 1][3];
      cursorY = KG_CLICKS[KG_CLICKS.length - 1][4];
      cursorVisible = sec < KG_CLICKS[KG_CLICKS.length - 1][1] + 0.5;
    }
  }

  const isClicking = activeClick && sec >= activeClick[0] && sec < activeClick[0] + 0.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity: sceneFadeOut(frame, fps, S4_DUR),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1400,
        }}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            transform: `
              translateZ(${translateZ}px)
              rotateX(${rotX}deg)
              rotateY(${rotY}deg)
              scale(${scale})
            `,
            transformOrigin: "center center",
            borderRadius: interpolate(zoomProgress, [0, 1], [16, 0]),
            overflow: "hidden",
            boxShadow:
              zoomProgress < 0.95
                ? `0 ${interpolate(zoomProgress, [0, 1], [30, 0])}px ${interpolate(zoomProgress, [0, 1], [60, 0])}px rgba(0,0,0,0.6)`
                : "none",
          }}
        >
          <iframe
            ref={iframeRef}
            src={staticFile("aos_kg_v3.html")}
            style={{ width: 1920, height: 1080, border: "none", display: "block" }}
          />
        </div>
      </div>

      {/* ── contextOS sub-brand label (top-left) ── */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 44,
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          opacity: lerp(frame, [0, 0.8 * fps], [0, 1]),
          zIndex: 60,
        }}
      >
        <span style={{ color: C.white }}>context</span>
        <span style={{ color: C.teal }}>OS</span>
      </div>

      {cursorVisible && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            transform: `translate(-2px, -2px) ${isClicking ? "scale(0.75)" : "scale(1)"}`,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
            pointerEvents: "none",
            zIndex: 100,
            opacity: lerp(frame, [3.5 * fps, 3.8 * fps], [0, 1]),
          }}
        >
          <path d="M5 3l14 8-6 2 4 8-3 1.5-4-8-5 5z" fill="#ffffff" stroke="#000" strokeWidth="1" />
        </svg>
      )}

      {/* ── Text card overlay ── */}
      {(() => {
        const cardIn = spring({ frame, fps, config: { damping: 200 } });
        const textDelays = [1.5, 3.5, 5.5];
        return (
          <div
            style={{
              position: "absolute",
              left: 60,
              top: "50%",
              transform: `translateY(-50%) translateX(${interpolate(cardIn, [0, 1], [-20, 0])}px)`,
              width: "24%",
              background: "rgba(10, 15, 26, 0.88)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: `3px solid ${C.teal}`,
              borderRadius: 14,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              opacity: cardIn,
              backdropFilter: "blur(12px)",
              zIndex: 50,
              fontFamily: FONT,
            }}
          >
            <div style={{ fontSize: 37, fontWeight: 600, lineHeight: 1.2 }}>
              <span style={{ color: C.white }}>Knowledge</span>
              <br />
              <span style={{ color: C.teal }}>Graph</span>
            </div>
            <div
              style={{
                width: 50,
                height: 3,
                borderRadius: 2,
                background: C.teal,
                opacity: 0.6,
              }}
            />
            {KG_TEXT.map((line, i) => {
              const a = anim(frame, fps, textDelays[i]);
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: i === KG_TEXT.length - 1 ? C.teal : C.white,
                    opacity: a.opacity,
                    transform: `translateY(${a.y}px)`,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 5: Convergence
// 7s title card + 5 visuals × 4s each, alternating fly-in L/R
// ═══════════════════════════════════════════════════════════
// All scene-5 visuals are full-bleed backgrounds with an optional
// translucent overlay text card. The `from` field picks the side of the
// frame the card sits on (left/right).
const CONV_VISUALS: {
  src: string;
  title: string;
  body: string[];
  from: "left" | "right";
}[] = [
  {
    src: "combine_fs.png",
    title: "",
    body: [],
    from: "left",
  },
  {
    src: "qofe2.png",
    title: "QoE",
    body: [
      "Quality of earnings evaluates the sustainability, accuracy, and reliability of a company\u2019s reported earnings, primarily during mergers, acquisitions, or investments.",
      "It helps stakeholders validate EBITDA, identify non-recurring items, assess cash flow, and uncover risks \u2014 ensuring a fair valuation and reducing overpayment risks.",
    ],
    from: "right",
  },
  {
    src: "ebitda2.png",
    title: "Proforma EBITDA",
    body: [
      "Reported EBITDA always needs adjustment \u2014 for one-time items, normalizations, run-rate corrections, and pro forma synergies.",
      "Convergence builds the bridge automatically, entity-tagged with confidence scores distinguishing high-certainty items from estimates.",
    ],
    from: "left",
  },
  {
    src: "x-sell2.png",
    title: "Cross-sell and upsell roadmap",
    body: [
      "The cross-sell thesis is the core thesis of most deals \u2014 and the hardest to validate.",
      "AOS.AI profiles 80% of the combined customer base automatically, then works with your sales team on the rest.",
    ],
    from: "right",
  },
  {
    src: "backoffice2.png",
    title: "Backoffice overlap assessment",
    body: [
      "Convergence produces overlap analysis automatically \u2014 across customers, vendors, IT, and personnel \u2014 with match confidence and combined financial impact.",
    ],
    from: "left",
  },
];

const ConvergenceTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = lerp(frame, [0, 0.4 * fps], [0, 1]);
  const scale = lerp(frame, [0, 11.5 * fps], [1, 1.06]);
  // Fades out over 0.5s overlapping with slide 0's fade-in (crossfade)
  const fadeOut = lerp(frame, [11 * fps, 11.5 * fps], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        opacity: fadeOut,
      }}
    >
      <AbsoluteFill style={{ opacity: fadeIn, transform: `scale(${scale})` }}>
        <Img
          src={staticFile("convergence-title2.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ConvergenceVisual: React.FC<{
  src: string;
  title: string;
  body: string[];
  from: "left" | "right";
  isLast?: boolean;
}> = ({ src, title, body, from, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade: fade in over first 0.5s; fade out over the 0.5s overlap window
  // (last 0.5s of the extended slot). Last slide skips fadeOut — the parent
  // Scene5Convergence handles the end-of-scene fade.
  const fadeIn = lerp(frame, [0, 0.5 * fps], [0, 1]);
  const fadeOut = isLast
    ? 1
    : lerp(frame, [4 * fps, 4.5 * fps], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  // Gentle Ken Burns zoom on background (1.00 → 1.04 over 4s)
  const bgScale = lerp(frame, [0, 4 * fps], [1, 1.04]);

  // Text card subtle slide-up entrance
  const cardY = lerp(frame, [0, 0.5 * fps], [12, 0]);

  const hasText = body.length > 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        opacity,
      }}
    >
      {/* Full-bleed background image with subtle zoom */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </AbsoluteFill>

      {/* Transparent overlay text card */}
      {hasText && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: from === "left" ? "flex-start" : "flex-end",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              transform: `translateY(${cardY}px)`,
              background: "rgba(47, 64, 80, 0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `1px solid rgba(255,255,255,0.12)`,
              borderTop: `4px solid ${C.orange}`,
              borderRadius: 16,
              padding: "40px 48px",
              width: 650,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: C.white,
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            <div
              style={{
                width: 50,
                height: 3,
                borderRadius: 2,
                background: C.teal,
                opacity: 0.6,
              }}
            />
            {body.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: C.white,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Scene5Convergence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0.5s crossfade overlap: each sequence (except the last) is extended by
  // OVERLAP frames past its natural end so the next slide's fade-in runs
  // concurrently with this slide's fade-out.
  const OVERLAP = 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        opacity: sceneFadeOut(frame, fps, S5_DUR),
      }}
    >
      <Sequence from={0} durationInFrames={11 * 30 + OVERLAP} premountFor={15}>
        <ConvergenceTitle />
      </Sequence>
      {CONV_VISUALS.map((v, i) => {
        const isLast = i === CONV_VISUALS.length - 1;
        return (
          <Sequence
            key={v.src}
            from={(11 + i * 4) * 30}
            durationInFrames={isLast ? 4 * 30 : 4 * 30 + OVERLAP}
            premountFor={15}
          >
            <ConvergenceVisual
              src={v.src}
              title={v.title}
              body={v.body}
              from={v.from}
              isLast={isLast}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════
// Total duration (scene durations are declared at top of file)
// ═══════════════════════════════════════════════════════════
export const DEMO_V2_FRAMES = (S0_DUR + S1_DUR + S2_DUR + S3A_DUR + S3B_DUR + S4_DUR + S5_DUR) * 30;

// ═══════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════
export const DemoV2: React.FC = () => {
  const S0 = S0_DUR * 30;
  const S1 = S1_DUR * 30;
  const S2 = S2_DUR * 30;
  const S3A = S3A_DUR * 30;
  const S3B = S3B_DUR * 30;
  const S4 = S4_DUR * 30;
  const S5 = S5_DUR * 30;
  const AFTER_S0 = S1 + S2 + S3A + S3B + S4 + S5;

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

      <Sequence from={S0 + S1 + S2 + S3A + S3B} durationInFrames={S4} premountFor={30}>
        <Scene4KnowledgeGraph />
      </Sequence>

      <Sequence from={S0 + S1 + S2 + S3A + S3B + S4} durationInFrames={S5} premountFor={30}>
        <Scene5Convergence />
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
      <Sequence from={S0 + S1 + S2} durationInFrames={S3A}>
        <Audio src={staticFile("voiceover/scene3a-mai.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={S0 + S1 + S2 + S3A} durationInFrames={S3B}>
        <Audio src={staticFile("voiceover/scene3b-dashboards.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={S0 + S1 + S2 + S3A + S3B} durationInFrames={S4}>
        <Audio src={staticFile("voiceover/scene4-knowledgegraph.mp3")} volume={0.9} />
      </Sequence>

      {/* ── Scene 5 per-slide voiceovers ── */}
      {(() => {
        const S5_BASE = S0 + S1 + S2 + S3A + S3B + S4;
        const TITLE = 11 * 30;
        const SLIDE = 4 * 30;
        return (
          <>
            <Sequence from={S5_BASE} durationInFrames={TITLE}>
              <Audio src={staticFile("voiceover/scene5-title.mp3")} volume={0.9} />
            </Sequence>
            <Sequence from={S5_BASE + TITLE} durationInFrames={SLIDE}>
              <Audio src={staticFile("voiceover/scene5-combine.mp3")} volume={0.9} />
            </Sequence>
            <Sequence from={S5_BASE + TITLE + SLIDE} durationInFrames={SLIDE}>
              <Audio src={staticFile("voiceover/scene5-qofe.mp3")} volume={0.9} />
            </Sequence>
            <Sequence from={S5_BASE + TITLE + 2 * SLIDE} durationInFrames={SLIDE}>
              <Audio src={staticFile("voiceover/scene5-ebitda.mp3")} volume={0.9} />
            </Sequence>
            <Sequence from={S5_BASE + TITLE + 3 * SLIDE} durationInFrames={SLIDE}>
              <Audio src={staticFile("voiceover/scene5-xsell.mp3")} volume={0.9} />
            </Sequence>
            <Sequence from={S5_BASE + TITLE + 4 * SLIDE} durationInFrames={SLIDE}>
              <Audio src={staticFile("voiceover/scene5-backoffice.mp3")} volume={0.9} />
            </Sequence>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
