import React from "react";
import {
  AbsoluteFill, Img, interpolate, staticFile,
  useCurrentFrame,
} from "remotion";

// Audio starts at AUDIO_DELAY (seconds into scene). The visual fades in
// over [0, AUDIO_DELAY] so Mai never cuts in on a dark frame.
const AUDIO_DELAY = 0.7;

// ─── Narration beats (scene2-all.mp3, silencedetect -35dB:0.2) ──
// All offsets below are in SCENE TIME (= audio-time + AUDIO_DELAY).
//   pre-roll         fade in, overview
//   0.70–2.64 audio  "And here's how it works."                 → overview
//   2.64–7.27 audio  "AOS sits on top… no migration…"           → ENTERPRISE
//   7.27–8.82 audio  "It scans your systems,"                   → DISCOVER
//   8.82–10.40 audio "figures out what the data means —"        → CONNECT
//  10.40–12.20 audio "customers, products, contracts relate —"  → RESOLVE
//  12.20–19.97 audio "gives you a context layer…"               → OPERATE
//  19.97–21.50 tail hold

// Stage horizontal centers (fractions of master image width).
// Measured from column titles in aos_ig_master.png (2752×1536).
const OVERVIEW_CX = 0.5;
const STAGE_CX = [0.095, 0.280, 0.457, 0.677, 0.905];

// Camera keyframes: [time s, centerX, scale].
// Single waypoint per narration beat — no holds — so interpolate produces
// a continuous left-to-right pan across the five columns.
const OVERVIEW_SCALE = 1.0;
const ZOOM = 1.15;
const KF: [number, number, number][] = [
  [0.00,  OVERVIEW_CX,  OVERVIEW_SCALE],
  [2.24,  OVERVIEW_CX,  OVERVIEW_SCALE],
  [3.34,  STAGE_CX[0],  ZOOM], // ENTERPRISE — "AOS sits on top…"
  [7.97,  STAGE_CX[1],  ZOOM], // DISCOVER   — "It scans your systems,"
  [9.52,  STAGE_CX[2],  ZOOM], // CONNECT    — "figures out what the data means"
  [11.10, STAGE_CX[3],  ZOOM], // RESOLVE    — "customers, products, contracts"
  [12.90, STAGE_CX[4],  ZOOM], // OPERATE    — "gives you a context layer…"
  [22.20, STAGE_CX[4],  ZOOM],
];

const clampInterp = (t: number, times: number[], values: number[]) =>
  interpolate(t, times, values, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const Scene2HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const times = KF.map((k) => k[0]);
  const cxs = KF.map((k) => k[1]);
  const scales = KF.map((k) => k[2]);

  const cxRaw = clampInterp(t, times, cxs);
  const scale = clampInterp(t, times, scales);

  const cxMin = 0.5 / scale;
  const cxMax = 1 - cxMin;
  const cx = Math.max(cxMin, Math.min(cxMax, cxRaw));

  const tx = 1920 * scale * (0.5 - cx);

  // Fade completes right as Mai starts speaking at AUDIO_DELAY.
  const fadeIn = clampInterp(t, [0, AUDIO_DELAY], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B1118",
        opacity: fadeIn,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Natural-aspect image centered in the frame (thin ≈4px dark
          strip above and below at the 1072/1080 aspect mismatch).
          transformOrigin:center keeps both column titles at the top
          and the stage-tagline + banner rows at the bottom within
          frame at the modest Z=1.15 zoom. */}
      <Img
        src={staticFile("aos_ig_master.png")}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transform: `translateX(${tx}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};
