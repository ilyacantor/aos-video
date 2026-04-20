import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Message = {
  role: "user" | "mai";
  text: string;
  meta?: [string, string][];
};

const SCENARIO: Message[] = [
  {
    role: "user",
    text: "How did we do this month?",
  },
  {
    role: "mai",
    text: "March was solid. Revenue came in at $48.2M against a $46.5M plan — 3.7% above target. Gross margin held at 62.4%, up 80bps from February. Here's the full picture:",
    meta: [
      ["Revenue", "$48.2M (plan: $46.5M)"],
      ["Gross Margin", "62.4% (+80bps MoM)"],
      ["EBITDA", "$11.6M (24.1% margin)"],
      ["Cash from Ops", "$8.9M"],
      ["Net New ARR", "$3.1M"],
      ["DSO", "41 days (−3 MoM)"],
    ],
  },
  {
    role: "user",
    text: "Where did the upside come from?",
  },
  {
    role: "mai",
    text: "Two drivers. First, the Cascadia services line closed $1.4M in unforecasted project work tied to their ERP migration — that's non-recurring, so don't bank on it in April. Second, platform subscription revenue beat plan by $620K from three mid-month upsells that were slipping into Q2 but pulled forward. On the cost side, COGS improved because the renegotiated cloud commit kicked in March 1 — that $340K/month savings is durable. One flag: G&A ran 6% over budget on legal fees from the IP review. Finance tagged it as one-time.",
    meta: [
      ["Cascadia Upside", "$1.4M (non-recurring)"],
      ["Subscription Beat", "+$620K (pull-forward)"],
      ["Cloud Savings", "$340K/mo (durable)"],
      ["G&A Overage", "+6% (legal, one-time)"],
    ],
  },
];

const CHARS_PER_FRAME = 3;
const MSG_PAUSE = 30; // frames
const META_DELAY = 10; // frames
const FADE_IN = 15; // frames

type TimelineEntry = {
  msg: Message;
  msgIndex: number;
  typeStart: number;
  typeEnd: number;
  metaAppear: number | null;
};

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  let cursor = FADE_IN + MSG_PAUSE;

  for (let i = 0; i < SCENARIO.length; i++) {
    const msg = SCENARIO[i];
    const typeFrames = Math.ceil(msg.text.length / CHARS_PER_FRAME);
    const typeStart = cursor;
    const typeEnd = cursor + typeFrames;
    const metaAppear = msg.meta ? typeEnd + META_DELAY : null;
    entries.push({ msg, msgIndex: i, typeStart, typeEnd, metaAppear });
    cursor = typeEnd + (msg.meta ? META_DELAY + 8 : 0) + MSG_PAUSE;
  }
  return entries;
}

const TIMELINE = buildTimeline();

const S = {
  chatBg: "#1a1e28",
  border: "rgba(255,255,255,0.08)",
  purple: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  textMuted: "#97999E",
  text: "#e2e8f0",
  green: "#34d399",
  maiBubbleBg: "rgba(255,255,255,0.06)",
  userBubbleBg: "rgba(139,92,246,0.15)",
  userBubbleBorder: "rgba(139,92,246,0.2)",
  metaCellBg: "rgba(255,255,255,0.04)",
  cursor: "#a78bfa",
};

const MetaGrid: React.FC<{ meta: [string, string][] }> = ({ meta }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 4,
      marginTop: 6,
      marginLeft: 32,
      maxWidth: "80%",
    }}
  >
    {meta.map(([label, value], i) => (
      <div
        key={i}
        style={{
          background: S.metaCellBg,
          border: `1px solid ${S.border}`,
          borderRadius: 5,
          padding: "5px 7px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: S.textMuted,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: S.text }}>
          {value}
        </div>
      </div>
    ))}
  </div>
);

const Bubble: React.FC<{
  entry: TimelineEntry;
  frame: number;
}> = ({ entry, frame }) => {
  const { msg, typeStart, typeEnd, metaAppear } = entry;
  if (frame < typeStart) return null;

  const isUser = msg.role === "user";
  const progress = Math.min(1, (frame - typeStart) / (typeEnd - typeStart));
  const charsShown = Math.floor(progress * msg.text.length);
  const typing = frame < typeEnd;
  const showMeta = metaAppear !== null && frame >= metaAppear;

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 7,
          alignItems: "flex-start",
          justifyContent: isUser ? "flex-end" : "flex-start",
        }}
      >
        {!isUser && (
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: S.purple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            M
          </div>
        )}
        <div
          style={{
            maxWidth: "80%",
            padding: "8px 11px",
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.55,
            background: isUser ? S.userBubbleBg : S.maiBubbleBg,
            border: `1px solid ${isUser ? S.userBubbleBorder : S.border}`,
            color: isUser ? "#e0d4fc" : S.text,
          }}
        >
          {msg.text.slice(0, charsShown)}
          {typing && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "0.9em",
                background: S.cursor,
                marginLeft: 1,
                verticalAlign: "text-bottom",
                opacity: Math.floor(frame / 9) % 2 === 0 ? 1 : 0,
              }}
            />
          )}
        </div>
        {isUser && (
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: S.textMuted,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            U
          </div>
        )}
      </div>
      {showMeta && msg.meta && <MetaGrid meta={msg.meta} />}
    </>
  );
};

const TAB_LABELS = ["Discovery Status", "Report Config", "Monthly Review"];

export const MaiChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOp = Math.min(1, frame / FADE_IN);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#2F4050",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOp,
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 680,
          height: 760,
          borderRadius: 14,
          border: `1px solid ${S.border}`,
          background: S.chatBg,
          boxShadow:
            "0 0 0 1px rgba(21,227,214,0.06), 0 24px 48px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "14px 17px",
            borderBottom: `1px solid ${S.border}`,
            background: "rgba(0,0,0,0.2)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: S.purple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            M
          </div>
          <div style={{ marginRight: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: S.text }}>
              Mai
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: S.green,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: S.green,
                  boxShadow: `0 0 5px rgba(52,211,153,0.8)`,
                  opacity: Math.floor(frame / 30) % 2 === 0 ? 1 : 0.35,
                }}
              />
              Online
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexBasis: "100%",
              marginTop: 6,
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <div
                key={label}
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: i === 2 ? 600 : 500,
                  borderRadius: 999,
                  border: `1px solid ${i === 2 ? "rgba(139,92,246,0.45)" : S.border}`,
                  background:
                    i === 2 ? "rgba(139,92,246,0.1)" : "transparent",
                  color: i === 2 ? "#c4b5fd" : S.textMuted,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "16px 17px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            overflow: "hidden",
          }}
        >
          {TIMELINE.map((entry, i) => (
            <Bubble key={i} entry={entry} frame={frame} />
          ))}
        </div>

        {/* Input bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "11px 17px",
            borderTop: `1px solid ${S.border}`,
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 13,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Ask Mai anything...
          </div>
          <div
            style={{
              width: 27,
              height: 27,
              borderRadius: 5,
              background: S.purple,
              opacity: 0.35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "#fff",
            }}
          >
            ↑
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
