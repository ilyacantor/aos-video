import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";

const SCREENSHOTS = [
  { file: "demo_1.png", label: "AOS Discover" },
  { file: "sankey.png", label: "Data Context Layer" },
  { file: "se_e2e.png", label: "Operator Console" },
];

// ═══════════════════════════════════════════════════════════
// Values from CSS3 Transform visualizer screenshot
// ═══════════════════════════════════════════════════════════
const ROTATE_X = -59;
const ROTATE_Y = -138;
const ROTATE_Z = 0;
const PERSPECTIVE = 1600;
const SCALE = 0.5;
const ORIGIN = "55% 50% 0px";   // transform-origin from screenshot

// Per-plane depth spread
const SPREAD_Z = -200;

export const StackedPlanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fan-out spring
  const fanOut = spring({
    frame: frame - 0.5 * fps,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.5 },
  });

  // Animate rotation and scale from 0 to target
  const rx = interpolate(fanOut, [0, 1], [0, ROTATE_X]);
  const ry = interpolate(fanOut, [0, 1], [0, ROTATE_Y]);
  const s = interpolate(fanOut, [0, 1], [1, SCALE]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080b14",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Perspective wrapper */}
      <div style={{ perspective: PERSPECTIVE }}>
        {/* Rotated container — all planes rotate together */}
        <div
          style={{
            width: 700,
            height: 500,
            position: "relative",
            transformStyle: "preserve-3d",
            transformOrigin: ORIGIN,
            transform: `
              scale(${s})
              rotateX(${rx}deg)
              rotateY(${ry}deg)
            `,
          }}
        >
          {SCREENSHOTS.map((shot, i) => {
            // Staggered entrance
            const enter = spring({
              frame: frame - (0.3 + i * 0.4) * fps,
              fps,
              config: { damping: 200 },
            });

            // Each plane only spreads along Z
            const z = interpolate(fanOut, [0, 1], [0, i * SPREAD_Z]);

            return (
              <div
                key={shot.file}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translateZ(${z}px)`,
                  transformStyle: "preserve-3d",
                  opacity: enter,
                }}
              >
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: `
                      0 20px 60px rgba(0,0,0,0.5),
                      0 0 0 1px rgba(139,92,246,${0.15 + i * 0.05}),
                      0 0 30px rgba(139,92,246,${0.05 + i * 0.03})
                    `,
                    background: "#0f1420",
                  }}
                >
                  <Img
                    src={staticFile(shot.file)}
                    style={{
                      width: 600,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#a78bfa",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  {shot.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
