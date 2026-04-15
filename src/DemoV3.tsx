import React, { useRef, useEffect } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  staticFile,
} from "remotion";

const lerp = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ═══════════════════════════════════════════════════════════
// DemoV3: Knowledge Graph — 3D zoom-in + frame-synced clicks
// ═══════════════════════════════════════════════════════════
const S4_DUR = 15;
export const DEMO_V3_FRAMES = S4_DUR * 30;

// Click sequence: [startSec, endSec, nodeId, cursorX%, cursorY%]
// Positions extracted from fixed vis-network layout via Playwright
const CLICKS: [number, number, string, number, number][] = [
  [4, 6, "meridian", 44.2, 60.5],
  [6.5, 8.5, "contract", 56.4, 36.7],
  [9, 11, "engagement", 47, 39.6],
  [11.5, 13.5, "owner", 31.8, 51.6],
];

export const DemoV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 3D zoom-in: tilted + pulled back → flat + full screen over 3s
  const zoomProgress = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 30, mass: 2 },
  });

  const rotX = interpolate(zoomProgress, [0, 1], [18, 0]);
  const rotY = interpolate(zoomProgress, [0, 1], [-12, 0]);
  const scale = interpolate(zoomProgress, [0, 1], [0.65, 1]);
  const translateZ = interpolate(zoomProgress, [0, 1], [-200, 0]);

  // Determine which node should be selected at this frame
  const activeClick = CLICKS.find(([start, end]) => sec >= start && sec < end);
  const activeNodeId = activeClick ? activeClick[2] : null;

  // Send postMessage to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    if (activeNodeId) {
      iframe.contentWindow.postMessage({ type: "selectNode", nodeId: activeNodeId }, "*");
    } else {
      iframe.contentWindow.postMessage({ type: "clear" }, "*");
    }
  }, [activeNodeId]);

  // Cursor position: interpolate toward active target
  let cursorX = 50;
  let cursorY = 90; // start at bottom center
  let cursorVisible = false;

  if (sec >= 3.5) {
    cursorVisible = true;

    // Find which click we're heading toward or dwelling on
    for (let i = 0; i < CLICKS.length; i++) {
      const [start, end, , tx, ty] = CLICKS[i];
      const approachStart = i === 0 ? 3.5 : CLICKS[i - 1][1] + 0.2;

      if (sec >= approachStart && sec < end + 0.2) {
        // Moving toward this node
        const moveProgress = lerp(
          frame,
          [approachStart * fps, (start - 0.2) * fps],
          [0, 1],
        );
        const prevX = i === 0 ? 50 : CLICKS[i - 1][3];
        const prevY = i === 0 ? 90 : CLICKS[i - 1][4];
        cursorX = prevX + (tx - prevX) * moveProgress;
        cursorY = prevY + (ty - prevY) * moveProgress;
        break;
      }
    }

    // After last click, stay at last position
    if (sec >= CLICKS[CLICKS.length - 1][1]) {
      cursorX = CLICKS[CLICKS.length - 1][3];
      cursorY = CLICKS[CLICKS.length - 1][4];
      cursorVisible = sec < CLICKS[CLICKS.length - 1][1] + 0.5;
    }
  }

  // Click pulse: scale down briefly at click moment
  const isClicking = activeClick && sec >= activeClick[0] && sec < activeClick[0] + 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1400,
        }}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            transform: `
              translateZ(${translateZ}px)
              rotateX(${rotX}deg)
              rotateY(${rotY}deg)
              scale(${scale})
            `,
            transformOrigin: "center center",
            borderRadius: interpolate(zoomProgress, [0, 1], [16, 0]),
            overflow: "hidden",
            boxShadow:
              zoomProgress < 0.95
                ? `0 ${interpolate(zoomProgress, [0, 1], [30, 0])}px ${interpolate(zoomProgress, [0, 1], [60, 0])}px rgba(0,0,0,0.6)`
                : "none",
          }}
        >
          <iframe
            ref={iframeRef}
            src={staticFile("aos_kg_v3.html")}
            style={{
              width: 1920,
              height: 1080,
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ── Remotion-controlled cursor overlay ── */}
      {cursorVisible && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            transform: `translate(-2px, -2px) ${isClicking ? "scale(0.75)" : "scale(1)"}`,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
            pointerEvents: "none",
            zIndex: 100,
            opacity: lerp(frame, [3.5 * fps, 3.8 * fps], [0, 1]),
          }}
        >
          <path
            d="M5 3l14 8-6 2 4 8-3 1.5-4-8-5 5z"
            fill="#ffffff"
            stroke="#000"
            strokeWidth="1"
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
