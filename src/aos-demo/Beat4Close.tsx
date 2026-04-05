import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";
import { C, FONT, textSpring, fadeOut, lerp } from "./shared";

/**
 * Beat 4: THE CLOSE (1:45–2:00, local frames 0–450)
 *
 * Clean exit. No feature recap. No CTA.
 * "Deployed in days." → "Enterprise context..." → Logo → "The platform is built and running." → Black
 */
export const Beat4Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── "Deployed in days." (0–3s) ──
  const line1 = textSpring(frame, fps, 0.5);
  const line1Fade = fadeOut(frame, fps, 3, 0.3);

  // ── "Enterprise context..." (3.5–7s) ──
  const line2 = textSpring(frame, fps, 3.5);
  const line2Fade = fadeOut(frame, fps, 7, 0.3);

  // ── Logo resolves (7.5s) ──
  const logoIn = lerp(frame, [7.5 * fps, 8.1 * fps], [0, 1]); // 600ms, opacity only

  // ── "The platform is built and running." (8.5s) ──
  const tagline = textSpring(frame, fps, 8.5);

  // ── Final fade to black (13s–14.5s) ──
  const finalFade = lerp(frame, [13 * fps, 14 * fps], [1, 0]);

  // ── Last 0.5s: pure dark ──
  const isBlack = frame >= durationInFrames - 0.5 * fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.dark,
        fontFamily: FONT,
      }}
    >
      {isBlack ? null : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: finalFade,
          }}
        >
          {/* ── Line 1 ── */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.white,
              opacity: line1.opacity * line1Fade,
              transform: `translateY(${line1.y}px)`,
              position: "absolute",
            }}
          >
            Deployed in days.
          </div>

          {/* ── Line 2 ── */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.white,
              opacity: line2.opacity * line2Fade,
              transform: `translateY(${line2.y}px)`,
              position: "absolute",
            }}
          >
            Enterprise context that adapts as the business changes.
          </div>

          {/* ── Logo ── */}
          <div
            style={{
              opacity: logoIn,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 600, color: C.white }}>
              autonom
            </span>
            <span style={{ fontSize: 48, fontWeight: 600, color: C.teal }}>
              OS
            </span>
          </div>

          {/* ── Tagline ── */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: C.caption,
              opacity: tagline.opacity,
              transform: `translateY(${tagline.y}px)`,
              marginTop: 8,
            }}
          >
            The platform is built and running.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
