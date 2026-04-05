import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

// ═══════════════════════════════════════════════════════════
// Design Tokens
// ═══════════════════════════════════════════════════════════
const C = {
  bg: "#080b14",
  header: "#0f1420",
  maestraBg: "rgba(99,102,241,0.08)",
  maestraBorder: "rgba(99,102,241,0.2)",
  vpBg: "rgba(255,255,255,0.04)",
  vpBorder: "rgba(255,255,255,0.08)",
  text: "#e2e8f0",
  textMuted: "#64748b",
  accent: "#8b5cf6",
  blue: "#6366f1",
  green: "#22c55e",
  amber: "#f59e0b",
};

const FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ═══════════════════════════════════════════════════════════
// Animation Helper
// ═══════════════════════════════════════════════════════════
const anim = (frame: number, fps: number, delaySec: number) => {
  const p = spring({
    frame: frame - delaySec * fps,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: p,
    y: interpolate(p, [0, 1], [15, 0]),
    p,
  };
};

// ═══════════════════════════════════════════════════════════
// Scroll Keyframes (time in seconds → translateY)
// ═══════════════════════════════════════════════════════════
const SCROLL_TIMES = [0, 30, 33, 36, 40, 43, 48, 52, 57, 61, 68, 73];
const SCROLL_OFFSETS = [0, 0, -60, -250, -480, -580, -700, -820, -940, -1080, -1180, -1280];

// ═══════════════════════════════════════════════════════════
// Avatar
// ═══════════════════════════════════════════════════════════
const Avatar: React.FC<{ letter: string; gradient: string }> = ({
  letter,
  gradient,
}) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    }}
  >
    {letter}
  </div>
);

// ═══════════════════════════════════════════════════════════
// Typing Indicator
// ═══════════════════════════════════════════════════════════
const TypingDots: React.FC<{
  frame: number;
  fps: number;
  showAt: number;
  hideAt: number;
  sender: "maestra" | "vp";
}> = ({ frame, fps, showAt, hideAt, sender }) => {
  const timeSec = frame / fps;
  if (timeSec < showAt || timeSec >= hideAt) return null;

  const isM = sender === "maestra";
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        justifyContent: isM ? "flex-start" : "flex-end",
      }}
    >
      {isM && (
        <Avatar
          letter="M"
          gradient={`linear-gradient(135deg, ${C.blue}, ${C.accent})`}
        />
      )}
      <div
        style={{
          background: isM ? C.maestraBg : C.vpBg,
          border: `1px solid ${isM ? C.maestraBorder : C.vpBorder}`,
          borderRadius: isM ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
          padding: "12px 18px",
          display: "flex",
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.textMuted,
              opacity: interpolate(
                Math.sin(frame * 0.15 + i * 1.2),
                [-1, 1],
                [0.3, 1],
              ),
            }}
          />
        ))}
      </div>
      {!isM && (
        <Avatar letter="J" gradient="linear-gradient(135deg, #475569, #334155)" />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Chat Bubbles
// ═══════════════════════════════════════════════════════════
const MaestraMsg: React.FC<{
  text: string;
  frame: number;
  fps: number;
  at: number;
}> = ({ text, frame, fps, at }) => {
  const a = anim(frame, fps, at);
  if (a.opacity < 0.01) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
      }}
    >
      <Avatar
        letter="M"
        gradient={`linear-gradient(135deg, ${C.blue}, ${C.accent})`}
      />
      <div
        style={{
          background: C.maestraBg,
          border: `1px solid ${C.maestraBorder}`,
          borderRadius: "4px 12px 12px 12px",
          padding: "12px 16px",
          maxWidth: "72%",
          color: C.text,
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const VPMsg: React.FC<{
  text: string;
  frame: number;
  fps: number;
  at: number;
}> = ({ text, frame, fps, at }) => {
  const a = anim(frame, fps, at);
  if (a.opacity < 0.01) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        justifyContent: "flex-end",
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
          Jordan · VP Data
        </div>
        <div
          style={{
            background: C.vpBg,
            border: `1px solid ${C.vpBorder}`,
            borderRadius: "12px 4px 12px 12px",
            padding: "12px 16px",
            maxWidth: 500,
            color: C.text,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {text}
        </div>
      </div>
      <Avatar letter="J" gradient="linear-gradient(135deg, #475569, #334155)" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Network Diagram
// ═══════════════════════════════════════════════════════════
const SYSTEMS_LEFT = ["NetSuite", "Salesforce", "Workday"];
const SYSTEMS_RIGHT = ["Snowflake", "Oracle", "Jira"];

const NetworkDiagram: React.FC<{
  frame: number;
  fps: number;
  at: number;
}> = ({ frame, fps, at }) => {
  const a = anim(frame, fps, at);
  if (a.opacity < 0.01) return null;

  return (
    <div
      style={{
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
        padding: "4px 44px",
      }}
    >
      <div
        style={{
          border: "2px dashed rgba(99,102,241,0.25)",
          borderRadius: 16,
          padding: "32px 24px 24px",
          position: "relative",
        }}
      >
        {/* Label */}
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 20,
            background: C.bg,
            padding: "0 8px",
            fontSize: 11,
            color: C.textMuted,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          Meridian Network
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
          }}
        >
          {/* Left systems */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SYSTEMS_LEFT.map((sys, i) => {
              const sa = anim(frame, fps, at + 0.3 + i * 0.15);
              return (
                <div
                  key={sys}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: sa.opacity,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: C.green,
                    }}
                  />
                  <span style={{ fontSize: 12, color: C.text }}>{sys}</span>
                  <span style={{ fontSize: 14, color: "rgba(99,102,241,0.4)" }}>
                    ──
                  </span>
                </div>
              );
            })}
          </div>

          {/* AOS Runtime */}
          <div
            style={{
              border: `2px solid ${C.accent}`,
              borderRadius: 12,
              padding: "18px 28px",
              background: "rgba(139,92,246,0.08)",
              textAlign: "center" as const,
              transform: `scale(${anim(frame, fps, at + 0.2).p})`,
            }}
          >
            <div
              style={{ fontSize: 15, fontWeight: 700, color: C.accent }}
            >
              AOS Runtime
            </div>
            <div
              style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}
            >
              Listening · No credentials
            </div>
          </div>

          {/* Right systems */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SYSTEMS_RIGHT.map((sys, i) => {
              const sa = anim(frame, fps, at + 0.5 + i * 0.15);
              return (
                <div
                  key={sys}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: sa.opacity,
                  }}
                >
                  <span style={{ fontSize: 14, color: "rgba(99,102,241,0.4)" }}>
                    ──
                  </span>
                  <span style={{ fontSize: 12, color: C.text }}>{sys}</span>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: sys === "Oracle" ? C.amber : C.green,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Systems Table
// ═══════════════════════════════════════════════════════════
const SYSTEMS_DATA = [
  { name: "NetSuite", cat: "ERP", conf: 0.95 },
  { name: "Salesforce", cat: "CRM", conf: 0.97 },
  { name: "Workday", cat: "HR", conf: 0.93 },
  { name: "Snowflake", cat: "Warehouse", conf: 0.91 },
  { name: "Oracle E-Business Suite", cat: "ERP/Legacy", conf: 0.88 },
  { name: "Jira", cat: "PM", conf: 0.9 },
  { name: "Greenhouse", cat: "ATS", conf: 0.87 },
  { name: "Stripe", cat: "Payments", conf: 0.94 },
  { name: "HubSpot", cat: "Marketing", conf: 0.89 },
  { name: "Okta", cat: "Identity", conf: 0.96 },
  { name: "Slack", cat: "Comms", conf: 0.92 },
  { name: "Tableau", cat: "BI", conf: 0.9 },
];

const SystemsTable: React.FC<{
  frame: number;
  fps: number;
  at: number;
}> = ({ frame, fps, at }) => {
  const a = anim(frame, fps, at);
  if (a.opacity < 0.01) return null;

  return (
    <div
      style={{
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
        padding: "4px 44px",
      }}
    >
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            padding: "8px 14px",
            background: "rgba(99,102,241,0.08)",
            fontSize: 10,
            fontWeight: 600,
            color: C.textMuted,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
          }}
        >
          <div style={{ flex: 2.5 }}>System</div>
          <div style={{ flex: 1 }}>Category</div>
          <div style={{ flex: 1 }}>Status</div>
          <div style={{ flex: 0.8, textAlign: "right" as const }}>
            Confidence
          </div>
        </div>

        {/* Rows */}
        {SYSTEMS_DATA.map((sys, i) => {
          const ra = anim(frame, fps, at + 0.1 + i * 0.08);
          return (
            <div
              key={sys.name}
              style={{
                display: "flex",
                padding: "6px 14px",
                background:
                  i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                fontSize: 12,
                color: C.text,
                borderTop: "1px solid rgba(255,255,255,0.03)",
                opacity: ra.opacity,
              }}
            >
              <div style={{ flex: 2.5, fontWeight: 500 }}>{sys.name}</div>
              <div style={{ flex: 1, color: C.textMuted }}>{sys.cat}</div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    color: C.green,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: C.green,
                    }}
                  />
                  Active
                </span>
              </div>
              <div
                style={{
                  flex: 0.8,
                  textAlign: "right" as const,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color:
                    sys.conf >= 0.93
                      ? C.green
                      : sys.conf >= 0.9
                        ? C.text
                        : C.amber,
                }}
              >
                {sys.conf.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Contour Map Update Notification
// ═══════════════════════════════════════════════════════════
const ContourUpdate: React.FC<{
  frame: number;
  fps: number;
  at: number;
}> = ({ frame, fps, at }) => {
  const a = anim(frame, fps, at);
  const tagA = anim(frame, fps, at + 0.5);
  if (a.opacity < 0.01) return null;

  return (
    <div
      style={{
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
        padding: "4px 44px",
      }}
    >
      <div
        style={{
          borderRadius: 10,
          border: "1px solid rgba(245,158,11,0.2)",
          background: "rgba(245,158,11,0.04)",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: C.amber,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          Contour Map Updated
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
          Oracle E-Business Suite
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap" as const,
            opacity: tagA.opacity,
          }}
        >
          {["Apex acquisition", "Legacy", "Migration pending"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                padding: "2px 10px",
                borderRadius: 20,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: C.amber,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Phase Divider
// ═══════════════════════════════════════════════════════════
const PhaseDivider: React.FC<{
  text: string;
  frame: number;
  fps: number;
  at: number;
}> = ({ text, frame, fps, at }) => {
  const a = anim(frame, fps, at);
  const lineP = spring({
    frame: frame - (at + 0.3) * fps,
    fps,
    config: { damping: 200 },
  });
  const lineW = interpolate(lineP, [0, 1], [0, 160]);
  if (a.opacity < 0.01) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "20px 0 8px",
        opacity: a.opacity,
        transform: `translateY(${a.y}px)`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.accent,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: lineW,
          height: 2,
          borderRadius: 1,
          background: `linear-gradient(90deg, ${C.blue}, ${C.accent})`,
          opacity: lineP,
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════
export const DemoScript: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance
  const hdr = anim(frame, fps, 0.3);

  // Smooth scroll
  const scrollY = interpolate(
    frame,
    SCROLL_TIMES.map((t) => t * fps),
    SCROLL_OFFSETS,
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      {/* ── Header ── */}
      <div
        style={{
          height: 52,
          background: C.header,
          borderBottom: "1px solid rgba(99,102,241,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          opacity: hdr.opacity,
          transform: `translateY(${interpolate(hdr.p, [0, 1], [-8, 0])}px)`,
          zIndex: 10,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${C.blue}, ${C.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
            Meridian Partners
          </span>
          <span
            style={{
              fontSize: 10,
              color: C.textMuted,
              padding: "2px 8px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            Maestra
          </span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.green,
              boxShadow: "0 0 6px rgba(34,197,94,0.4)",
            }}
          />
          <span style={{ fontSize: 11, color: C.textMuted }}>Live</span>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div
        style={{
          position: "absolute",
          top: 52,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `translateY(${scrollY}px)`,
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Typing → Message 1 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={1.5} hideAt={3}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={3}
            text="Hi Jordan. I'm Maestra, your AOS engagement lead. We signed the contract last Thursday, and I've been busy since then. Let me catch you up."
          />

          {/* Typing → Message 2 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={7} hideAt={8.5}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={8.5}
            text="First things first — we dropped the AOS runtime onto your network yesterday. It's a lightweight container that sits inside your firewall. It doesn't store data, it doesn't move data, it doesn't need credentials to your systems yet. It just listens."
          />

          {/* Network Diagram */}
          <NetworkDiagram frame={frame} fps={fps} at={16} />

          {/* Message 3 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={21} hideAt={22.5}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={22.5}
            text="Think of it like a new hire who showed up on day one and is just looking around the office, figuring out where things are. That process is called discovery, and it's already running. Here's what I've found so far."
          />

          {/* Phase 2 divider */}
          <PhaseDivider
            frame={frame} fps={fps} at={28}
            text="Phase 2 — Discovery (AOD)"
          />

          {/* Message 4 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={31} hideAt={32.5}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={32.5}
            text="The runtime has been scanning your network for about 18 hours. Here's the system landscape it found."
          />

          {/* Systems Table */}
          <SystemsTable frame={frame} fps={fps} at={35} />

          {/* Message 5 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={42} hideAt={43.5}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={43.5}
            text="Twelve systems so far. The big five are your core stack — NetSuite, Salesforce, Workday, Snowflake, and that Oracle instance. I'm guessing that Oracle box came with the Apex acquisition?"
          />

          {/* VP Response */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={49} hideAt={50}
            sender="vp"
          />
          <VPMsg
            frame={frame} fps={fps} at={50}
            text="Yeah, that's their old ERP. We haven't migrated them off it yet."
          />

          {/* Message 6 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={53} hideAt={54}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={54}
            text="Got it. That's going to be important later — we'll need to understand how Apex data flows into your consolidated reporting. I'm flagging it now."
          />

          {/* Contour Update */}
          <ContourUpdate frame={frame} fps={fps} at={58} />

          {/* Message 7 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={62} hideAt={63.5}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={63.5}
            text="I also found something interesting. Your Snowflake instance has inbound connections from both NetSuite and Oracle. But the schemas don't match — NetSuite uses a 4-digit cost center code, Oracle uses a 6-digit entity code. That's probably one of the reasons your consolidated reporting is painful."
          />

          {/* VP Response 2 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={71} hideAt={72}
            sender="vp"
          />
          <VPMsg
            frame={frame} fps={fps} at={72}
            text="That's exactly the problem. Finance spends three weeks every quarter manually mapping those."
          />

          {/* Message 8 */}
          <TypingDots
            frame={frame} fps={fps}
            showAt={76} hideAt={77}
            sender="maestra"
          />
          <MaestraMsg
            frame={frame} fps={fps} at={77}
            text="We're going to fix that. But first, let me show you how these systems are connected."
          />

          {/* Bottom spacer */}
          <div style={{ height: 300 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
