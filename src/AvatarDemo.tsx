import React from "react";
import {
  AbsoluteFill,
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
// This is the SINGLE SOURCE OF TRUTH for timing.
// Change a script → regen clip → update duration here → everything reflows.
const D: Record<string, number> = {
  "scene0-mai-intro": 7.00,
  "scene1-problems": 15.50,
  "scene2-solution": 13.40,
  "scene2-all": 39.43,
  "scene3a-all": 24.20,
  "scene4-knowledgegraph": 17.06,
  "scene5-intro": 9.76,
  "scene5-all": 34.40,
  "scene6-deploy": 11.47,
  "scene7-closing": 9.92,
};

// ─── Narration groups → visual scenes ─────────────────────────
// Each group = one D-ID clip. Speech drives timing.

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
  scene7: D["scene7-closing"],
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
const SceneVideo: React.FC<{ file: string }> = ({ file }) => (
  <OffthreadVideo
    src={staticFile(`scenes/${file}`)}
    muted
    style={{ width: "100%", height: "100%" }}
  />
);

// ─── Main composition ─────────────────────────────────────────
export const AvatarDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Visual scenes — each persists for its narration group's duration */}
      <Sequence from={T_TITLE} durationInFrames={f(G.titleCard)}>
        <TitleCard />
      </Sequence>
      <Sequence from={T_S1} durationInFrames={f(G.scene1)}>
        <SceneVideo file="scene1.mp4" />
      </Sequence>
      <Sequence from={T_S2I} durationInFrames={f(G.scene2i)}>
        <SceneVideo file="scene2i.mp4" />
      </Sequence>
      <Sequence from={T_S2} durationInFrames={f(G.scene2)}>
        <SceneVideo file="scene2.mp4" />
      </Sequence>
      <Sequence from={T_S3A} durationInFrames={f(G.scene3a)}>
        <SceneVideo file="scene3a.mp4" />
      </Sequence>
      <Sequence from={T_S4} durationInFrames={f(G.scene4)}>
        <SceneVideo file="scene4.mp4" />
      </Sequence>
      <Sequence from={T_S5I} durationInFrames={f(G.scene5i)}>
        <SceneVideo file="scene5i.mp4" />
      </Sequence>
      <Sequence from={T_S5} durationInFrames={f(G.scene5)}>
        <SceneVideo file="scene5.mp4" />
      </Sequence>
      <Sequence from={T_S6} durationInFrames={f(G.scene6)}>
        <SceneVideo file="scene6.mp4" />
      </Sequence>
      <Sequence from={T_S7} durationInFrames={f(G.scene7)}>
        <SceneVideo file="scene7.mp4" />
      </Sequence>

      {/* Avatar PIP — single combined video */}
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <AvatarBubble />
      </Sequence>
    </AbsoluteFill>
  );
};
