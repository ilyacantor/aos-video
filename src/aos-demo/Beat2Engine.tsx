import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
} from "remotion";
import { C, FONT, textSpring, fadeOut, lerp } from "./shared";

/**
 * Beat 2: THE ENGINE (0:30–1:15, local frames 0–1350)
 *
 * Rapid, evenly-timed showcase of all 9 assets with 3D perspective.
 * Each screenshot gets ~4s with crossfade transitions.
 */

// ── All assets in display order ──
const SHOTS = [
  { file: "a1.jpeg", label: "How autonomOS Works", zoom: 1.4, origin: "50% 55%" },
  { file: "a9.jpg", label: "AOS Discover", zoom: 1.3, origin: "45% 50%" },
  { file: "a7.jpg", label: "AAM Topology", zoom: 1.4, origin: "60% 50%" },
  { file: "a8.jpg", label: "DCL Semantic Graph", zoom: 1.3, origin: "50% 55%" },
  { file: "a2.png", label: "EBITDA Bridge", zoom: 1.3, origin: "50% 40%" },
  { file: "a3.png", label: "Cross-sell Pipeline", zoom: 1.3, origin: "50% 35%" },
  { file: "a5.png", label: "Quality of Earnings", zoom: 1.3, origin: "50% 45%" },
  { file: "a6.jpg", label: "CFO Dashboard", zoom: 1.2, origin: "50% 45%" },
];

// ── Timing: each shot gets INTERVAL seconds, with FADE overlap ──
const INTRO_DUR = 2; // intro text duration
const INTERVAL = 2.5; // seconds per screenshot
const FADE = 0.3; // crossfade duration

// ── 3D angles alternate for visual variety ──
const angles = (i: number) => ({
  rotateY: i % 2 === 0 ? -5 : 5,
  rotateX: 6 + (i % 3) * 2,
  enterFrom: i % 2 === 0 ? 120 : -120, // alternating slide direction
});

export const Beat2Engine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  // ── Intro text ──
  const introText = textSpring(frame, fps, 0.3);
  const introFade = fadeOut(frame, fps, INTRO_DUR, 0.4);

  // ── Closing text ──
  const closingStart = INTRO_DUR + SHOTS.length * INTERVAL - 2;
  const closingText = textSpring(frame, fps, closingStart);

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.dark, fontFamily: FONT, overflow: "hidden" }}
    >
      {/* ── Intro text overlay ── */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          maxWidth: 800,
          opacity: introText.opacity * introFade,
          transform: `translateY(${introText.y}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.3,
          }}
        >
          A lightweight semantic layer that floats on top of the enterprise.
        </div>
      </div>

      {/* ── Screenshot showcase ── */}
      {SHOTS.map((shot, i) => {
        const startSec = INTRO_DUR + i * INTERVAL;
        const endSec = startSec + INTERVAL + FADE; // extend for crossfade

        // Entrance spring
        const enterProgress = spring({
          frame: frame - startSec * fps,
          fps,
          config: { damping: 200 },
        });

        // Exit fade
        const exitOpacity = lerp(
          frame,
          [endSec * fps, (endSec + FADE) * fps],
          [1, 0],
        );

        // Skip if not visible yet or fully gone
        if (sec < startSec - 0.5 || sec > endSec + FADE + 0.5) return null;

        const a = angles(i);
        const slideX = interpolate(enterProgress, [0, 1], [a.enterFrom, 0]);

        return (
          <div
            key={shot.file}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: 1200,
              opacity: enterProgress * exitOpacity,
            }}
          >
            <div
              style={{
                transform: `
                  translateX(${slideX}px)
                  rotateX(${a.rotateX}deg)
                  rotateY(${a.rotateY}deg)
                `,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                borderRadius: 10,
                overflow: "hidden",
                width: 1400,
              }}
            >
              <Img
                src={staticFile(shot.file)}
                style={{
                  width: "100%",
                  objectFit: "contain",
                  display: "block",
                  transform: `scale(${shot.zoom})`,
                  transformOrigin: shot.origin,
                }}
              />
            </div>

            {/* ── Label ── */}
            <div
              style={{
                position: "absolute",
                bottom: 50,
                right: 80,
                fontSize: 18,
                fontWeight: 400,
                color: C.caption,
                opacity: enterProgress,
                transform: `translateY(${interpolate(enterProgress, [0, 1], [10, 0])}px)`,
              }}
            >
              {shot.label}
            </div>
          </div>
        );
      })}

      {/* ── Closing text overlay ── */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          maxWidth: 700,
          opacity: closingText.opacity,
          transform: `translateY(${closingText.y}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.4,
            padding: "12px 20px",
            background: "rgba(11, 12, 16, 0.85)",
            borderRadius: 8,
          }}
        >
          Connects to any existing system. No rip-and-replace.
        </div>
      </div>
    </AbsoluteFill>
  );
};
