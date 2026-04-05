import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Img,
  staticFile,
  Easing,
  interpolate,
} from "remotion";
import { C, FONT, textSpring, lerp } from "./shared";

/**
 * Beat 3: THE PEAK (local 18 seconds)
 *
 * A2 straightens to full screen. Text overlays. Slow zoom.
 * Screenshot visible ≤3s per overlay phase.
 */
export const Beat3Peak: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── A2 straightening (0–0.6s) ──
  const straightenDur = 0.6 * fps;
  const straighten = interpolate(frame, [0, straightenDur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const a2RotX = interpolate(straighten, [0, 1], [4, 1]);
  const a2RotY = interpolate(straighten, [0, 1], [-6, 0]);
  const a2Scale = interpolate(straighten, [0, 1], [0.7, 1]);

  // ── Slow zoom (10s–16s) ──
  const zoom = lerp(frame, [10 * fps, 16 * fps], [1, 1.15]);

  // ── Text overlays (tight, ≤3s visible each) ──
  const text1 = textSpring(frame, fps, 1);
  const text1Fade = lerp(frame, [3.5 * fps, 4 * fps], [1, 0]);

  const text2 = textSpring(frame, fps, 4);
  const text2Fade = lerp(frame, [7 * fps, 7.5 * fps], [1, 0]);

  const text3 = textSpring(frame, fps, 7.5);
  const text3Fade = lerp(frame, [11 * fps, 11.5 * fps], [1, 0]);

  // ── Exit (15.5–17.5s) ──
  const exitFade = lerp(frame, [15.5 * fps, 17 * fps], [1, 0]);
  const exitScale = lerp(frame, [15.5 * fps, 17 * fps], [1, 0.92]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.dark, fontFamily: FONT, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
          opacity: exitFade,
        }}
      >
        <div
          style={{
            transform: `
              rotateX(${a2RotX}deg)
              rotateY(${a2RotY}deg)
              scale(${a2Scale * zoom * exitScale})
            `,
            transformOrigin: "50% 65%",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("a2.png")}
            style={{ width: 1600, objectFit: "contain", display: "block" }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          opacity: text1.opacity * text1Fade,
          transform: `translateY(${text1.y}px)`,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 600, color: C.white, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          Reported EBITDA to proforma.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 110,
          left: 80,
          opacity: text2.opacity * text2Fade,
          transform: `translateY(${text2.y}px)`,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 400, color: C.white, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          Entity-tagged. Confidence-scored. Built from the data.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          opacity: text3.opacity * text3Fade,
          transform: `translateY(${text3.y}px)`,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 400, color: C.white, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          <span style={{ color: C.teal }}>Not</span> a template.{" "}
          <span style={{ color: C.teal }}>Not</span> a guess.
        </div>
      </div>
    </AbsoluteFill>
  );
};
