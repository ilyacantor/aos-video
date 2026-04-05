import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "gJx1vCzNCD1EQHT212Ls"; // Ava – Eager, Helpful

const SCENES: { id: string; text: string }[] = [
  {
    id: "scene0-title",
    text: "What if your enterprise could finally understand itself?",
  },
  {
    id: "scene1-problems",
    text: "Every enterprise hits the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should.",
  },
  {
    id: "scene2-solution",
    text: "That's what AOS changes. One layer that sits on top of everything you already have. No migration. No rip and replace. It connects, it resolves, and it gives your entire organization a shared language.",
  },
];

const outDir = resolve(__dirname, "../public/voiceover");
mkdirSync(outDir, { recursive: true });

async function generate(scene: { id: string; text: string }) {
  console.log(`Generating: ${scene.id}...`);

  const response = await fetch(
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
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status} ${await response.text()}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const outPath = resolve(outDir, `${scene.id}.mp3`);
  writeFileSync(outPath, audioBuffer);
  console.log(`  → ${outPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  for (const scene of SCENES) {
    await generate(scene);
  }
  console.log("\nDone! Audio files in public/voiceover/");
}

main().catch(console.error);
