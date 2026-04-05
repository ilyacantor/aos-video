import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
// Uncomment when you add public/music.mp3:
// import { Audio } from "@remotion/media";

// ═══════════════════════════════════════════════════════════
// Design Tokens
// ═══════════════════════════════════════════════════════════
const C = {
  bg: "#080b14",
  text: "#ffffff",
  textSec: "#a78bfa",
  textMuted: "#64748b",
  accent: "#8b5cf6",
  pink: "#d946ef",
  blue: "#6366f1",
};

const FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ═══════════════════════════════════════════════════════════
// Animation Helper
// ═══════════════════════════════════════════════════════════
const anim = (frame: number, fps: number, delaySec: number) => {
  const p = spring({
    frame: frame - delaySec * fps,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: p,
    y: interpolate(p, [0, 1], [25, 0]),
    scale: interpolate(p, [0, 1], [0.95, 1]),
    x: interpolate(p, [0, 1], [-30, 0]),
    p,
  };
};

// ═══════════════════════════════════════════════════════════
// Shared Components
// ═══════════════════════════════════════════════════════════
const Bg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ backgroundColor: C.bg, fontFamily: FONT, overflow: "hidden" }}
  >
    {children}
  </AbsoluteFill>
);

const GradientLine: React.FC<{ width: number; opacity: number }> = ({
  width,
  opacity,
}) => (
  <div
    style={{
      width,
      height: 3,
      borderRadius: 2,
      background: `linear-gradient(90deg, ${C.blue}, ${C.pink})`,
      opacity,
    }}
  />
);

// ═══════════════════════════════════════════════════════════
// Scene 1: Intro — Maestra Reveal
// ═══════════════════════════════════════════════════════════
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const img = anim(frame, fps, 0);
  const glow = Math.sin(frame * 0.08) * 0.3 + 0.7;
  const title = anim(frame, fps, 1);
  const name = anim(frame, fps, 1.8);
  const tag = anim(frame, fps, 2.4);

  return (
    <Bg>
      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "15%",
          left: "25%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 70%)",
          bottom: "5%",
          right: "15%",
          transform: "translate(50%, 50%)",
        }}
      />

      {/* Pulsing rings */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 320 + i * 100,
            height: 320 + i * 100,
            borderRadius: "50%",
            border: `1px solid rgba(139,92,246,${0.07 - i * 0.01})`,
            left: "50%",
            top: "40%",
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.015 + i * 0.8) * 0.02})`,
          }}
        />
      ))}

      {/* Maestra image */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          transform: `translate(-50%, -50%) scale(${img.scale})`,
          opacity: img.opacity,
          filter: `drop-shadow(0 0 ${50 * glow}px rgba(139,92,246,${0.5 * glow}))`,
        }}
      >
        <Img
          src={staticFile("m.ai_transparent.png")}
          style={{ height: 340, objectFit: "contain" }}
        />
      </div>

      {/* Title block */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: C.text,
            opacity: title.opacity,
            transform: `translateY(${title.y}px)`,
            letterSpacing: "-0.02em",
            textShadow: "0 0 40px rgba(139,92,246,0.4)",
          }}
        >
          M.ai
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.textSec,
            opacity: name.opacity,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
          }}
        >
          Maestra
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(167,139,250,0.8)",
            opacity: tag.opacity,
            transform: `translateY(${tag.y}px)`,
          }}
        >
          Your Embedded AI Agent
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 2: Description — What Maestra Is
// ═══════════════════════════════════════════════════════════
const DescriptionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const img = anim(frame, fps, 0.3);
  const l1 = anim(frame, fps, 0.5);
  const l2 = anim(frame, fps, 1.2);
  const divP = spring({
    frame: frame - 1.8 * fps,
    fps,
    config: { damping: 200 },
  });
  const divW = interpolate(divP, [0, 1], [0, 200]);
  const l3 = anim(frame, fps, 2.5);
  const l4 = anim(frame, fps, 3);

  return (
    <Bg>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "0 80px",
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: C.textSec,
              opacity: l1.opacity,
              transform: `translateY(${l1.y}px)`,
            }}
          >
            Embedded with every
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              opacity: l2.opacity,
              transform: `translateY(${l2.y}px)`,
              letterSpacing: "-0.01em",
            }}
          >
            autonomOS installation
          </div>
          <GradientLine width={divW} opacity={divP} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: C.text,
              opacity: l3.opacity,
              transform: `translateY(${l3.y}px)`,
              marginTop: 8,
            }}
          >
            The Semantic Operating System
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: C.textSec,
              opacity: l4.opacity,
              transform: `translateY(${l4.y}px)`,
            }}
          >
            for Enterprise
          </div>
        </div>

        {/* Right: image */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: img.opacity,
            transform: `scale(${img.scale})`,
          }}
        >
          <Img
            src={staticFile("m.ai1.png")}
            style={{
              height: 420,
              objectFit: "contain",
              borderRadius: 12,
              filter: "drop-shadow(0 0 30px rgba(139,92,246,0.3))",
            }}
          />
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 3: Capabilities — What She Does
// ═══════════════════════════════════════════════════════════
const CAPS = [
  "Project Onboarding",
  "Platform Education",
  "Configuration",
  "Debugging & Testing",
  "Human-Supervised Modifications",
];

const CapabilitiesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleE = anim(frame, fps, 0.3);

  return (
    <Bg>
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.textSec,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            opacity: titleE.opacity,
            transform: `translateY(${titleE.y}px)`,
            marginBottom: 48,
          }}
        >
          What Maestra Does
        </div>

        {/* Capability items */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          {CAPS.map((cap, i) => {
            const e = anim(frame, fps, 1 + i * 1.2);
            return (
              <div
                key={cap}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: e.opacity,
                  transform: `translateX(${e.x}px)`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 28,
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${C.blue}, ${C.pink})`,
                  }}
                />
                <div
                  style={{ fontSize: 28, fontWeight: 500, color: C.text }}
                >
                  {cap}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 4/5: Platform Screenshot (reusable)
// ═══════════════════════════════════════════════════════════
const PlatformScene: React.FC<{
  title: string;
  subtitle: string;
  image: string;
  imageHeight?: number;
}> = ({ title, subtitle, image, imageHeight = 440 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleE = anim(frame, fps, 0.3);
  const subE = anim(frame, fps, 0.8);
  const imgE = anim(frame, fps, 0.5);
  const lineP = spring({
    frame: frame - 0.6 * fps,
    fps,
    config: { damping: 200 },
  });
  const lineW = interpolate(lineP, [0, 1], [0, 60]);

  return (
    <Bg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: 20,
        }}
      >
        {/* Title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: C.text,
              opacity: titleE.opacity,
              transform: `translateY(${titleE.y}px)`,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <GradientLine width={lineW} opacity={lineP} />
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: C.textMuted,
              opacity: subE.opacity,
              transform: `translateY(${subE.y}px)`,
              marginTop: 4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Screenshot */}
        <div
          style={{
            opacity: imgE.opacity,
            transform: `scale(${imgE.scale})`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)",
          }}
        >
          <Img
            src={staticFile(image)}
            style={{ height: imageHeight, objectFit: "contain" }}
          />
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 6: Operator Console — Two Pipelines
// ═══════════════════════════════════════════════════════════
const ConsoleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleE = anim(frame, fps, 0.3);
  const lineP = spring({
    frame: frame - 0.6 * fps,
    fps,
    config: { damping: 200 },
  });
  const lineW = interpolate(lineP, [0, 1], [0, 60]);
  const img1 = anim(frame, fps, 0.8);
  const img2 = anim(frame, fps, 1.8);

  return (
    <Bg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: 16,
          padding: "0 60px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: C.text,
            opacity: titleE.opacity,
            transform: `translateY(${titleE.y}px)`,
          }}
        >
          Operator Console
        </div>
        <GradientLine width={lineW} opacity={lineP} />

        {/* SE Pipeline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: img1.opacity,
            transform: `translateY(${img1.y}px)`,
            marginTop: 12,
          }}
        >
          <div
            style={{
              borderRadius: 10,
              overflow: "hidden",
              boxShadow:
                "0 6px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)",
            }}
          >
            <Img
              src={staticFile("se_e2e.png")}
              style={{ width: 1000, objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.textSec,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            SE Pipeline
          </div>
        </div>

        {/* ME Pipeline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: img2.opacity,
            transform: `translateY(${img2.y}px)`,
          }}
        >
          <div
            style={{
              borderRadius: 10,
              overflow: "hidden",
              boxShadow:
                "0 6px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)",
            }}
          >
            <Img
              src={staticFile("me_e2e.png")}
              style={{ width: 1000, objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.textSec,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            ME Pipeline
          </div>
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene 7: Closing — autonomOS Brand
// ═══════════════════════════════════════════════════════════
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const imgBg = anim(frame, fps, 0);
  const title = anim(frame, fps, 0.8);
  const lineP = spring({
    frame: frame - 1.3 * fps,
    fps,
    config: { damping: 200 },
  });
  const lineW = interpolate(lineP, [0, 1], [0, 120]);
  const sub = anim(frame, fps, 1.8);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 2 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Bg>
      {/* Agents image as subtle background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: imgBg.opacity * 0.12,
          transform: `scale(${interpolate(imgBg.p, [0, 1], [1.05, 1])})`,
        }}
      >
        <Img
          src={staticFile("m.ai_and_agents.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Brand content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: C.text,
            opacity: title.opacity,
            transform: `translateY(${title.y}px)`,
            letterSpacing: "-0.02em",
            textShadow: "0 0 50px rgba(139,92,246,0.3)",
          }}
        >
          autonomOS
        </div>
        <GradientLine width={lineW} opacity={lineP} />
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: C.textSec,
            opacity: sub.opacity,
            transform: `translateY(${sub.y}px)`,
            marginTop: 4,
          }}
        >
          The Semantic Operating System for Enterprise
        </div>
      </div>
    </Bg>
  );
};

// ═══════════════════════════════════════════════════════════
// Scene Durations & Total
// ═══════════════════════════════════════════════════════════
const SCENES = {
  intro: 210, // 7s
  description: 240, // 8s
  capabilities: 300, // 10s
  aod: 210, // 7s
  dcl: 210, // 7s
  console: 210, // 7s
  closing: 210, // 7s
};
const TRANSITION = 15; // 0.5s crossfade
const TRANSITION_COUNT = Object.keys(SCENES).length - 1;

export const AOS_DEMO_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION_COUNT * TRANSITION;
// = 1590 - 90 = 1500 frames = 50s

// ═══════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════
export const AosDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.description}>
          <DescriptionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.capabilities}>
          <CapabilitiesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.aod}>
          <PlatformScene
            title="AOS Discover"
            subtitle="Asset discovery & topology mapping"
            image="demo_1.png"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.dcl}>
          <PlatformScene
            title="Data Context Layer"
            subtitle="Semantic graph from sources to personas"
            image="sankey.png"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.console}>
          <ConsoleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES.closing}>
          <ClosingScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Background music — drop a music.mp3 in public/ and uncomment: */}
      {/* <Audio src={staticFile("music.mp3")} volume={0.3} loop /> */}
    </AbsoluteFill>
  );
};
