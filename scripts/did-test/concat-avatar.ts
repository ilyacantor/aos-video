/**
 * Concatenates D-ID avatar clips into one continuous video,
 * timed to match speech-driven scene layout.
 *
 * SINGLE SOURCE OF TRUTH: clip durations + narration group structure.
 * Change script text → regen clip → update DUR → rerun this → preview.
 *
 * Output: public/avatar/avatar-combined.mp4
 * Usage:  npx tsx scripts/did-test/concat-avatar.ts
 */
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ffmpeg = resolve(__dirname, "../../node_modules/ffmpeg-static/ffmpeg");
const avatarDir = resolve(__dirname, "../../public/avatar");
const outFile = resolve(avatarDir, "avatar-combined.mp4");

// ─── Clip durations (seconds) — MUST match AvatarDemo.tsx D map ─
const DUR: Record<string, number> = {
  "scene0-mai-intro": 7.03, "scene0-title": 4.76,
  "scene1-problems": 13.64, "scene2-solution": 15.31,
  "scene2-discover": 10.0, "scene2-connect": 7.0,
  "scene2-resolve": 7.8, "scene2-ask": 13.75,
  "scene3a-mai": 15.44, "scene3a-mai-config": 12.4,
  "scene4-knowledgegraph": 28.0, "scene5-intro": 8.84,
  "scene5-title": 16.16, "scene5-combine": 3.91,
  "scene5-qofe": 4.16, "scene5-ebitda": 8.04,
  "scene5-xsell": 4.4, "scene5-backoffice": 4.04,
  "scene6-closing": 15.08,
};

// ─── Narration groups (mirrors AvatarDemo.tsx) ────────────────
// Each group: [groupStartOffset, [...clips with intra-group offsets]]
// groupStartOffset = cumulative time from groups before it
// Clips within a group use offsets relative to group start.

const S2_OFF = { discover: 1.5, connect: 12.5, resolve: 20.5, ask: 29.5 };
const S3A_CFG = 16.0;
const S5_OFF = { title: 0, combine: 16, qofe: 21, ebitda: 26, xsell: 34, backoffice: 39 };

interface ClipEntry { id: string; offsetInGroup: number }
interface Group { name: string; clips: ClipEntry[]; duration: number }

const groups: Group[] = [
  {
    name: "Title Card",
    clips: [{ id: "scene0-mai-intro", offsetInGroup: 0 }],
    duration: DUR["scene0-mai-intro"], // 7.03
  },
  {
    name: "Scene 1",
    clips: [
      { id: "scene0-title", offsetInGroup: 0 },
      { id: "scene1-problems", offsetInGroup: DUR["scene0-title"] }, // 4.76
    ],
    duration: DUR["scene0-title"] + DUR["scene1-problems"], // 18.40
  },
  {
    name: "Scene 2 Intro",
    clips: [{ id: "scene2-solution", offsetInGroup: 0 }],
    duration: DUR["scene2-solution"], // 15.31
  },
  {
    name: "Scene 2",
    clips: [
      { id: "scene2-discover", offsetInGroup: S2_OFF.discover },
      { id: "scene2-connect", offsetInGroup: S2_OFF.connect },
      { id: "scene2-resolve", offsetInGroup: S2_OFF.resolve },
      { id: "scene2-ask", offsetInGroup: S2_OFF.ask },
    ],
    duration: S2_OFF.ask + DUR["scene2-ask"], // 43.25
  },
  {
    name: "Scene 3A",
    clips: [
      { id: "scene3a-mai", offsetInGroup: 0 },
      { id: "scene3a-mai-config", offsetInGroup: S3A_CFG },
    ],
    duration: S3A_CFG + DUR["scene3a-mai-config"], // 28.40
  },
  {
    name: "Scene 4",
    clips: [{ id: "scene4-knowledgegraph", offsetInGroup: 0 }],
    duration: DUR["scene4-knowledgegraph"], // 28.00
  },
  {
    name: "Scene 5 Intro",
    clips: [{ id: "scene5-intro", offsetInGroup: 0 }],
    duration: DUR["scene5-intro"], // 8.84
  },
  {
    name: "Scene 5",
    clips: [
      { id: "scene5-title", offsetInGroup: S5_OFF.title },
      { id: "scene5-combine", offsetInGroup: S5_OFF.combine },
      { id: "scene5-qofe", offsetInGroup: S5_OFF.qofe },
      { id: "scene5-ebitda", offsetInGroup: S5_OFF.ebitda },
      { id: "scene5-xsell", offsetInGroup: S5_OFF.xsell },
      { id: "scene5-backoffice", offsetInGroup: S5_OFF.backoffice },
    ],
    duration: S5_OFF.backoffice + DUR["scene5-backoffice"], // 43.04
  },
  {
    name: "Scene 6",
    clips: [{ id: "scene6-closing", offsetInGroup: 0 }],
    duration: DUR["scene6-closing"], // 15.08
  },
];

// ─── Resolve absolute timeline ────────────────────────────────
interface Resolved { id: string; absStart: number; dur: number }
const timeline: Resolved[] = [];
let groupStart = 0;
for (const g of groups) {
  for (const clip of g.clips) {
    timeline.push({
      id: clip.id,
      absStart: groupStart + clip.offsetInGroup,
      dur: DUR[clip.id],
    });
  }
  groupStart += g.duration;
}
const totalDuration = groupStart;

// Sort by absStart
timeline.sort((a, b) => a.absStart - b.absStart);

// Verify no overlaps
for (let i = 1; i < timeline.length; i++) {
  const prev = timeline[i - 1];
  const cur = timeline[i];
  const overlap = (prev.absStart + prev.dur) - cur.absStart;
  if (overlap > 0.2) {
    console.warn(`  ⚠ ${prev.id} overlaps ${cur.id} by ${overlap.toFixed(2)}s`);
  }
}

console.log(`Total: ${totalDuration.toFixed(1)}s (${Math.round(totalDuration * 30)} frames)\n`);
console.log("Timeline:");
for (const t of timeline) {
  console.log(`  ${t.id.padEnd(24)} ${t.absStart.toFixed(1).padStart(6)}s → ${(t.absStart + t.dur).toFixed(1).padStart(6)}s`);
}

// ─── Compute gaps between clips for concat padding ────────────
interface ConcatEntry { id: string; dur: number; gapAfter: number }
const concatList: ConcatEntry[] = [];
for (let i = 0; i < timeline.length; i++) {
  const t = timeline[i];
  const nextStart = i < timeline.length - 1 ? timeline[i + 1].absStart : totalDuration;
  const gapAfter = Math.max(0, nextStart - (t.absStart + t.dur));
  concatList.push({ id: t.id, dur: t.dur, gapAfter });
}

// ─── Build ffmpeg filter_complex ──────────────────────────────
const inputs = concatList.map((c) => `-i "${resolve(avatarDir, `${c.id}.mp4`)}"`).join(" ");

const filters: string[] = [];
const concatInputs: string[] = [];
for (let i = 0; i < concatList.length; i++) {
  const c = concatList[i];
  if (c.gapAfter > 0.03) {
    filters.push(`[${i}:v]tpad=stop_duration=${c.gapAfter.toFixed(3)}:stop_mode=clone[v${i}]`);
    filters.push(`[${i}:a]apad=pad_dur=${c.gapAfter.toFixed(3)}[a${i}]`);
  } else {
    filters.push(`[${i}:v]null[v${i}]`);
    filters.push(`[${i}:a]anull[a${i}]`);
  }
  concatInputs.push(`[v${i}][a${i}]`);
}
filters.push(`${concatInputs.join("")}concat=n=${concatList.length}:v=1:a=1[outv][outa]`);

const cmd = [
  `"${ffmpeg}" -y`,
  inputs,
  `-filter_complex "${filters.join("; ")}"`,
  `-map "[outv]" -map "[outa]"`,
  `-c:v libx264 -preset fast -crf 18`,
  `-c:a aac -ar 96000 -ac 1`,
  `"${outFile}"`,
].join(" ");

console.log("\nConcatenating...");
execSync(cmd, { stdio: "inherit", timeout: 600_000 });
console.log(`\n→ ${outFile}`);
console.log("Done!");
