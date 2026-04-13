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
  "scene1-problems": 26.98,
  "scene2-solution": 13.64,
  "scene2-all": 39.00,
  "scene3a-all": 23.16,
  "scene4-knowledgegraph": 14.24,
  "scene5-intro": 9.43,
  "scene5-all": 33.80,
  "scene6-deploy": 40.68,
  "scene7-closing": 7.38,
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
    { start: 0,     end: 12.10, file: "MA.png" },
    { start: 12.10, end: 15.88, file: "combine_fs.png" },
    { start: 15.88, end: 20.02, file: "qofe2.png" },
    { start: 20.02, end: 27.10, file: "ebitda2.png" },
    { start: 27.10, end: 29.85, file: "x-sell2.png" },
    { start: 29.85, end: 34.00, file: "backoffice2.png" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {slides.map((s, i) => {
        const fadeIn =
          i === 0
            ? 1
            : interpolate(
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
          Split the visual sequence at the narration silence (10.72s into
          scene3a-all.mp3, between "plain English." and "You can also ask
          me to make changes…") so the visual cut lands on the verbal
          pause instead of mid-sentence. */}
      <Sequence from={T_S3A} durationInFrames={f(10.72)}>
        <SceneVideo file="scene3a.mp4" startFrom={10} />
      </Sequence>
      <Sequence
        from={T_S3A + f(10.72)}
        durationInFrames={f(G.scene3a - 10.72)}
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
      <Sequence from={T_S6} durationInFrames={f(G.scene6)}>
        <StaticSlide file="days.png" />
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
