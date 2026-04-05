import { spring, interpolate, Easing } from "remotion";

// ═══════════════════════════════════════════════════════════
// Design Tokens
// ═══════════════════════════════════════════════════════════
export const C = {
  dark: "#0b0c10",
  teal: "#2BBDB6",
  white: "#FFFFFF",
  caption: "#999999",
} as const;

export const FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const FPS = 30;

// ═══════════════════════════════════════════════════════════
// Beat durations (seconds) — total is derived, not fixed
// ═══════════════════════════════════════════════════════════
export const BEAT_DUR = {
  stakes: 25,
  engine: 24, // 2s intro + 8 shots × 2.5s + 2s closing overlap
  peak: 18,
  close: 15,
} as const;

const beatStart = (beat: keyof typeof BEAT_DUR) => {
  const order: (keyof typeof BEAT_DUR)[] = ["stakes", "engine", "peak", "close"];
  let t = 0;
  for (const b of order) {
    if (b === beat) return t;
    t += BEAT_DUR[b];
  }
  return t;
};

export const BEATS = {
  stakes: { start: beatStart("stakes") * FPS, dur: BEAT_DUR.stakes * FPS },
  engine: { start: beatStart("engine") * FPS, dur: BEAT_DUR.engine * FPS },
  peak: { start: beatStart("peak") * FPS, dur: BEAT_DUR.peak * FPS },
  close: { start: beatStart("close") * FPS, dur: BEAT_DUR.close * FPS },
} as const;

export const TOTAL_FRAMES =
  (BEAT_DUR.stakes + BEAT_DUR.engine + BEAT_DUR.peak + BEAT_DUR.close) * FPS;

// ═══════════════════════════════════════════════════════════
// Animation Helpers
// ═══════════════════════════════════════════════════════════

/** Beat sheet text entrance: spring damping 20, stiffness 120 */
export const textSpring = (frame: number, fps: number, delaySec: number) => {
  const p = spring({
    frame: frame - delaySec * fps,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  return {
    opacity: p,
    y: interpolate(p, [0, 1], [20, 0]),
    p,
  };
};

/** Smooth entrance: damping 200, no bounce */
export const smooth = (frame: number, fps: number, delaySec: number) => {
  const p = spring({
    frame: frame - delaySec * fps,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: p,
    y: interpolate(p, [0, 1], [20, 0]),
    scale: interpolate(p, [0, 1], [0.95, 1]),
    p,
  };
};

/** Fade out over durationSec starting at delaySec */
export const fadeOut = (
  frame: number,
  fps: number,
  delaySec: number,
  durationSec: number = 0.3,
) =>
  interpolate(
    frame,
    [delaySec * fps, (delaySec + durationSec) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** Ease-out interpolation between two values */
export const easeOut = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) =>
  interpolate(frame, inputRange, outputRange, {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Linear interpolation, clamped */
export const lerp = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
