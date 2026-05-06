import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const introProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const orbScale = interpolate(introProgress, [0, 1], [0.5, 1]);

  const orbGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const titleY = interpolate(introProgress, [0, 1], [50, 0]);

  const contentStart = 1.5 * fps;
  const line1Progress = spring({
    frame: frame - contentStart,
    fps,
    config: { damping: 200 },
  });

  const line2Start = 4 * fps;
  const line2Progress = spring({
    frame: frame - line2Start,
    fps,
    config: { damping: 200 },
  });

  const line3Start = 6.5 * fps;
  const line3Progress = spring({
    frame: frame - line3Start,
    fps,
    config: { damping: 200 },
  });

  const outroStart = 14 * fps;
  const outroProgress = spring({
    frame: frame - outroStart,
    fps,
    config: { damping: 200 },
  });

  const fadeOutStart = 17 * fps;
  const fadeOut = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0f",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, #6366f1, #8b5cf6, #d946ef)`,
            boxShadow: `
              0 0 ${60 * orbGlow}px rgba(139, 92, 246, ${0.8 * orbGlow}),
              0 0 ${100 * orbGlow}px rgba(217, 70, 239, ${0.6 * orbGlow}),
              0 0 ${140 * orbGlow}px rgba(99, 102, 241, ${0.4 * orbGlow})
            `,
            transform: `scale(${orbScale})`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "20%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), transparent)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "30%",
              width: "40%",
              height: "8%",
              borderRadius: 4,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 20px rgba(255,255,255,0.8)",
              transform: `scaleY(${Math.sin(frame * 0.15) > 0 ? 1 : 0.1})`,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `translateY(${titleY}px)`,
            opacity: introProgress,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
            }}
          >
            M.ai
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#a78bfa",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Your Embedded AI Agent
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            maxWidth: 800,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "#e2e8f0",
              textAlign: "center",
              opacity: line1Progress,
              transform: `translateY(${(1 - line1Progress) * 30}px)`,
            }}
          >
            The trusted context layer for your enterprise
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#c4b5fd",
              textAlign: "center",
              opacity: line2Progress,
              transform: `translateY(${(1 - line2Progress) * 30}px)`,
            }}
          >
            Project onboarding • Platform education • Configuration
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#c4b5fd",
              textAlign: "center",
              opacity: line3Progress,
              transform: `translateY(${(1 - line3Progress) * 30}px)`,
            }}
          >
            Debugging • Testing • Human-supervised modifications
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginTop: 20,
            opacity: outroProgress,
            transform: `scale(${outroProgress})`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            Her incentive is CSAT
          </div>
          <div
            style={{
              width: 120,
              height: 4,
              background: "linear-gradient(90deg, #6366f1, #d946ef)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: 0.6,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#64748b",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          autonomOS
        </div>
      </div>

      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(139, 92, 246, 0.1)",
            left: "50%",
            top: "50%",
            marginLeft: -150,
            marginTop: -150,
            transform: `scale(${1 + i * 0.3 + Math.sin(frame * 0.02 + i) * 0.05})`,
            opacity: 0.3 - i * 0.05,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
