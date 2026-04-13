/**
 * D-ID audio-driven avatar generation.
 *
 * For each scene: upload the Matilda MP3 to D-ID /audios → create an
 * audio-driven clip with the Lily presenter → poll → download MP4.
 *
 * Matilda MP3s must already exist in public/avatar/audio/
 * (run `generate-matilda.ts` first).
 *
 * Output: public/avatar/*.mp4
 * Usage:
 *   npx tsx scripts/did-test/generate-avatar.ts              # skip existing
 *   npx tsx scripts/did-test/generate-avatar.ts --force      # regenerate all
 *   npx tsx scripts/did-test/generate-avatar.ts scene0-mai-intro scene6-deploy
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { SCENES, type Scene } from "./avatar-scenes";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API = "https://api.d-id.com";
const API_KEY = process.env.DID_API_KEY!;
const PRESENTER_ID = "v2_public_Lily_NoHands_RedShirt_Office@JDOtgQlb_L";

const audioDir = resolve(__dirname, "../../public/avatar/audio");
const outDir = resolve(__dirname, "../../public/avatar");
mkdirSync(outDir, { recursive: true });

async function uploadAudio(scene: Scene): Promise<string> {
  const audioPath = resolve(audioDir, `${scene.id}.mp3`);
  if (!existsSync(audioPath)) {
    throw new Error(
      `Missing MP3: ${audioPath}\n  run: npx tsx scripts/did-test/generate-matilda.ts ${scene.id}`,
    );
  }
  const buf = readFileSync(audioPath);
  const form = new FormData();
  form.append("audio", new Blob([buf], { type: "audio/mpeg" }), `${scene.id}.mp3`);
  const res = await fetch(`${API}/audios`, {
    method: "POST",
    headers: { Authorization: `Basic ${API_KEY}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`D-ID /audios upload ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

async function createClip(audioUrl: string): Promise<string> {
  const res = await fetch(`${API}/clips`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      presenter_id: PRESENTER_ID,
      script: { type: "audio", audio_url: audioUrl },
    }),
  });
  if (!res.ok) {
    throw new Error(`D-ID /clips ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

async function pollClip(id: string): Promise<string> {
  for (let i = 0; i < 120; i++) {
    const res = await fetch(`${API}/clips/${id}`, {
      headers: { Authorization: `Basic ${API_KEY}` },
    });
    const data = (await res.json()) as {
      status: string;
      result_url?: string;
      error?: { description: string };
    };
    if (data.status === "done" && data.result_url) return data.result_url;
    if (data.status === "error") {
      throw new Error(`Clip failed: ${JSON.stringify(data.error)}`);
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Polling timed out");
}

async function generate(scene: Scene) {
  console.log(`\nGenerating: ${scene.id}...`);
  const audioUrl = await uploadAudio(scene);
  process.stdout.write(`  audio_url ok, clip `);
  const clipId = await createClip(audioUrl);
  process.stdout.write(`id=${clipId.slice(0, 12)}… polling`);
  const resultUrl = await pollClip(clipId);
  console.log();
  const video = await fetch(resultUrl);
  const buf = Buffer.from(await video.arrayBuffer());
  const outPath = resolve(outDir, `${scene.id}.mp4`);
  writeFileSync(outPath, buf);
  console.log(`  → ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const specific = args.filter((a) => !a.startsWith("--"));
  const scenes =
    specific.length > 0 ? SCENES.filter((s) => specific.includes(s.id)) : SCENES;

  for (const scene of scenes) {
    const outPath = resolve(outDir, `${scene.id}.mp4`);
    if (!force && existsSync(outPath)) {
      console.log(`Skipping ${scene.id} (exists, --force to regenerate)`);
      continue;
    }
    await generate(scene);
  }
  console.log(`\nDone! D-ID clips in ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
