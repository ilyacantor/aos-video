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
  "scene0-mai-intro": 5.43,
  "scene1-problems": 26.98,
  "scene2-solution": 13.64,
  "scene2-all": 39.00,
  "scene3a-all": 23.16,
  "scene4-knowledgegraph": 14.24,
  "scene5-intro": 9.43,
  "scene5-all": 33.80,
  "scene6-deploy": 40.68,
  "scene7-closing": 7.38,
};

// ─── Narration groups (mirrors AvatarDemo.tsx) ────────────────
// One merged D-ID clip per group — zero internal gaps.

interface ClipEntry { id: string; offsetInGroup: number }
interface Group { name: string; clips: ClipEntry[]; duration: number }

const single = (name: string, id: string): Group => ({
  name,
  clips: [{ id, offsetInGroup: 0 }],
  duration: DUR[id],
});

const TAIL_HOLD = 3.0; // Must match AvatarDemo.tsx — pads PIP on last clip

const groups: Group[] = [
  single("Title Card", "scene0-mai-intro"),
  single("Scene 1", "scene1-problems"),
  single("Scene 2 Intro", "scene2-solution"),
  single("Scene 2", "scene2-all"),
  single("Scene 3A", "scene3a-all"),
  single("Scene 4", "scene4-knowledgegraph"),
  single("Scene 5 Intro", "scene5-intro"),
  single("Scene 5", "scene5-all"),
  single("Scene 6", "scene6-deploy"),
  {
    name: "Scene 7",
    clips: [{ id: "scene7-closing", offsetInGroup: 0 }],
    duration: DUR["scene7-closing"] + TAIL_HOLD,
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
