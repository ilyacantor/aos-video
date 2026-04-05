import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { C, FONT, textSpring, fadeOut } from "./shared";

/**
 * Beat 1: THE STAKES (0:00–0:25, 750 frames)
 * Text only on dark. Stats → pivot → bridge to product.
 */
export const Beat1Stakes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Stats phase (0:00–0:09) ──
  const stat1 = textSpring(frame, fps, 0.3);
  const stat2 = textSpring(frame, fps, 2.5);
  const stat3 = textSpring(frame, fps, 4.5);
  const statsFade = fadeOut(frame, fps, 9, 0.3);
  const statsVisible = frame / fps < 9 ? 1 : statsFade;

  // ── Pivot phase (0:09.5–0:16) ──
  const pivot1 = textSpring(frame, fps, 10);
  const pivot1Fade = fadeOut(frame, fps, 13, 0.3);

  const pivot2 = textSpring(frame, fps, 14);
  const pivot2Fade = fadeOut(frame, fps, 17, 0.3);

  // ── Bridge phase (0:17.5–0:25) ──
  const bridge = textSpring(frame, fps, 18);
  const logoOpacity = textSpring(frame, fps, 18.5);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.dark,
        fontFamily: FONT,
        padding: "0 80px",
        justifyContent: "center",
      }}
    >
      {/* ── Three stats ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 900,
          opacity: statsVisible,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.2,
            opacity: stat1.opacity,
            transform: `translateY(${stat1.y}px)`,
          }}
        >
          The average enterprise runs 900+ applications.
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: C.white,
            lineHeight: 1.2,
            opacity: stat2.opacity,
            transform: `translateY(${stat2.y}px)`,
          }}
        >
          71% are disconnected.
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.3,
            opacity: stat3.opacity,
            transform: `translateY(${stat3.y}px)`,
          }}
        >
          95% of IT leaders say integration is the #1 barrier to AI adoption.
        </div>
      </div>

      {/* ── Pivot 1: Fragmentation ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          opacity: pivot1.opacity * pivot1Fade,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: C.white,
            textAlign: "center" as const,
            maxWidth: 900,
            transform: `translateY(${pivot1.y}px)`,
          }}
        >
          Enterprise data gets more fragmented every year.
        </div>
      </div>

      {/* ── Pivot 2: Context ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          opacity: pivot2.opacity * pivot2Fade,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: C.white,
            textAlign: "center" as const,
            maxWidth: 900,
            transform: `translateY(${pivot2.y}px)`,
          }}
        >
          <span style={{ color: C.teal }}>Context</span> is the missing layer.
        </div>
      </div>

      {/* ── Bridge: AOS builds it ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          opacity: bridge.opacity,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: C.white,
            textAlign: "center" as const,
            maxWidth: 900,
            transform: `translateY(${bridge.y}px)`,
          }}
        >
          AOS builds it in days.
        </div>
      </div>

      {/* ── Logo watermark ── */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          opacity: logoOpacity.opacity * 0.3,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 600, color: C.white }}>
          autonom
        </span>
        <span style={{ fontSize: 36, fontWeight: 600, color: C.teal }}>
          OS
        </span>
      </div>
    </AbsoluteFill>
  );
};
