/**
 * Converts green screen MP4 avatar clips → WebM with alpha transparency.
 * Output: public/avatar/*.webm (used by AosDemo with <OffthreadVideo transparent>)
 */
import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ffmpeg-static provides a bundled ffmpeg binary
const ffmpegPath = resolve(
  __dirname,
  "../../node_modules/ffmpeg-static/ffmpeg",
);

const inputDir = resolve(__dirname, "../../public/avatar");
const files = readdirSync(inputDir).filter((f) => f.endsWith(".mp4"));

const force = process.argv.includes("--force");

for (const file of files) {
  const input = resolve(inputDir, file);
  const output = resolve(inputDir, file.replace(".mp4", ".webm"));

  if (!force && existsSync(output)) {
    console.log(`Skipping ${file} (webm exists)`);
    continue;
  }

  console.log(`Processing: ${file}...`);
  const cmd = [
    ffmpegPath,
    "-y",
    "-i",
    `"${input}"`,
    "-vf",
    '"colorkey=0x00b140:0.35:0.15"', // D-ID green screen color, tuned tolerance
    "-c:v",
    "libvpx-vp9",
    "-pix_fmt",
    "yuva420p",
    "-b:v",
    "2M",
    "-c:a",
    "libopus",
    `"${output}"`,
  ].join(" ");

  try {
    execSync(cmd, { stdio: "pipe" });
    console.log(`  → ${basename(output)}`);
  } catch (e: any) {
    console.error(`  ✗ Failed: ${e.stderr?.toString().slice(-200)}`);
  }
}

console.log("\nDone!");
