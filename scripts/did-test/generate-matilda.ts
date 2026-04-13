/**
 * Generate Matilda MP3s for the avatar pipeline.
 *
 * Output: public/avatar/audio/*.mp3
 * Usage:
 *   npx tsx scripts/did-test/generate-matilda.ts              # skip existing
 *   npx tsx scripts/did-test/generate-matilda.ts --force      # regenerate all
 *   npx tsx scripts/did-test/generate-matilda.ts scene0-mai-intro  # one clip
 *
 * Downstream: generate-avatar.ts consumes these MP3s and creates audio-driven
 * D-ID Lily clips. Both branches (avatar + non-avatar) use these files as the
 * canonical voice track.
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { SCENES, type Scene } from "./avatar-scenes";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "XrExE9yKIg1WjnnlVkGX"; // Matilda
const MODEL_ID = "eleven_multilingual_v2";
const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.3,
};

const outDir = resolve(__dirname, "../../public/avatar/audio");
mkdirSync(outDir, { recursive: true });

async function generate(scene: Scene): Promise<void> {
  console.log(`Generating: ${scene.id}...`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: MODEL_ID,
        voice_settings: VOICE_SETTINGS,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const path = resolve(outDir, `${scene.id}.mp3`);
  writeFileSync(path, buf);
  console.log(`  → ${path} (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const specific = args.filter((a) => !a.startsWith("--"));
  const scenes =
    specific.length > 0 ? SCENES.filter((s) => specific.includes(s.id)) : SCENES;

  for (const scene of scenes) {
    const path = resolve(outDir, `${scene.id}.mp3`);
    if (!force && existsSync(path)) {
      console.log(`Skipping ${scene.id} (exists, --force to regenerate)`);
      continue;
    }
    await generate(scene);
  }
  console.log(`\nDone! Matilda MP3s in ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
