import { writeFileSync, mkdirSync, existsSync } from "fs";
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
  {
    id: "scene3a-mai",
    text: "Every autonomOS deployment includes Mai — your customer success agent. Mai handles onboarding, training, and configuration changes, and knows the platform end-to-end. She also answers questions about your data, in natural language.",
  },
  {
    id: "scene3b-dashboards",
    text: "Dashboards are fully-featured and self-generating. Start from a preset, or spin one up on demand, in response to a natural language query — grounded in your live enterprise data.",
  },
  {
    id: "scene4-knowledgegraph",
    text: "For agents and humans to truly collaborate, they need more than just data—they need context. contextOS deploys Mai to scan surface-level relationships and work with your stakeholders to build a dynamic Knowledge Graph. This isn't just a database; it's a living network of people, assets, and concepts. By mapping these connections, Mai provides the semantic intelligence your enterprise needs to power autonomous agents and establish a single, context-aware source of truth.",
  },
  {
    id: "scene5-title",
    text: "M&A creates complexity. Convergence delivers clarity — in hours, not weeks.",
  },
  {
    id: "scene5-combine",
    text: "One unified financial picture across both companies.",
  },
  {
    id: "scene5-qofe",
    text: "Quality of earnings, automated — every adjustment flagged.",
  },
  {
    id: "scene5-ebitda",
    text: "Pro forma EBITDA with a transparent bridge to run-rate.",
  },
  {
    id: "scene5-xsell",
    text: "Cross-sell thesis, validated across both customer books.",
  },
  {
    id: "scene5-backoffice",
    text: "Backoffice overlap quantified across people and systems.",
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
  const force = process.argv.includes("--force");
  for (const scene of SCENES) {
    const outPath = resolve(outDir, `${scene.id}.mp3`);
    if (!force && existsSync(outPath)) {
      console.log(`Skipping ${scene.id} (already exists, pass --force to regenerate)`);
      continue;
    }
    await generate(scene);
  }
  console.log("\nDone! Audio files in public/voiceover/");
}

main().catch(console.error);
