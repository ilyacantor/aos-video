import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "gJx1vCzNCD1EQHT212Ls"; // Ava – Eager, Helpful

type VoiceSettings = {
  stability: number;
  similarity_boost: number;
  style: number;
};

type Scene = {
  id: string;
  text: string;
  // Scenes sharing a chainGroup are generated sequentially with the prior
  // clip's request_id passed via `previous_request_ids` — stabilises
  // prosody across short back-to-back clips.
  chainGroup?: string;
  // Optional override for voice_settings on a per-scene basis.
  voiceSettings?: VoiceSettings;
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.3,
};

// Tighter settings for scene 5 short clips: higher stability and lower
// style exaggeration keep delivery consistent across the chain.
const SCENE5_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.75,
  style: 0.1,
};

const SCENES: Scene[] = [
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
    id: "scene2-discover",
    text: "First, autonomOS discovers every system in your enterprise and builds a clean catalog of the IT assets we'll connect to.",
  },
  {
    id: "scene2-connect",
    text: "Our patented harness plugs into your existing integration infrastructure and routes your data to the Semantics engine.",
  },
  {
    id: "scene2-resolve",
    text: "There, your data isn't just normalized. The relationships inside it are discovered and stored in a Knowledge Graph.",
  },
  {
    id: "scene2-ask",
    text: "And this context-rich store becomes available in easy-to-consume formats — whether natural language query, or self-generating dashboards. Agents finally get the context they need to act, without hallucinating.",
  },
  {
    id: "scene3a-mai",
    text: "Every autonomOS deployment includes Mai — your customer success agent. Mai handles onboarding, training, and configuration changes, and knows the platform end-to-end. She also answers questions about your data, in natural language.",
  },
  {
    id: "scene3a-mai-config",
    text: "You can also ask Mai to reconfigure the platform — and changes happen instantly.",
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
    text: "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours — and complexity into clarity.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
  {
    id: "scene5-combine",
    text: "One unified financial picture across both companies.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
  {
    id: "scene5-qofe",
    text: "Quality of earnings, automated — every adjustment flagged.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
  {
    id: "scene5-ebitda",
    text: "Pro forma EBITDA with a transparent bridge to run-rate.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
  {
    id: "scene5-xsell",
    text: "Cross-sell thesis, validated across both customer books.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
  {
    id: "scene5-backoffice",
    text: "Backoffice overlap quantified across people and systems.",
    chainGroup: "scene5",
    voiceSettings: SCENE5_VOICE_SETTINGS,
  },
];

const outDir = resolve(__dirname, "../public/voiceover");
mkdirSync(outDir, { recursive: true });

async function generate(
  scene: Scene,
  previousRequestIds: string[] = [],
): Promise<string | null> {
  console.log(`Generating: ${scene.id}...`);

  const body: Record<string, unknown> = {
    text: scene.text,
    model_id: "eleven_multilingual_v2",
    voice_settings: scene.voiceSettings ?? DEFAULT_VOICE_SETTINGS,
  };

  if (previousRequestIds.length > 0) {
    // ElevenLabs accepts up to 3 previous request IDs for prosody continuity.
    body.previous_request_ids = previousRequestIds.slice(-3);
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(
      `ElevenLabs API error: ${response.status} ${await response.text()}`,
    );
  }

  const requestId = response.headers.get("request-id");
  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const outPath = resolve(outDir, `${scene.id}.mp3`);
  writeFileSync(outPath, audioBuffer);
  console.log(
    `  → ${outPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)${
      requestId ? ` [req: ${requestId.slice(0, 8)}…]` : ""
    }`,
  );

  return requestId;
}

function shouldGenerate(scene: Scene, force: boolean): boolean {
  if (force) return true;
  return !existsSync(resolve(outDir, `${scene.id}.mp3`));
}

async function main() {
  const force = process.argv.includes("--force");

  // Partition scenes: chained (grouped) vs standalone. Chained groups are
  // all-or-nothing — if any member needs generation, the whole group
  // regenerates so the request_id chain stays fresh.
  const chainGroups = new Map<string, Scene[]>();
  const standalone: Scene[] = [];

  for (const scene of SCENES) {
    if (scene.chainGroup) {
      const g = chainGroups.get(scene.chainGroup) ?? [];
      g.push(scene);
      chainGroups.set(scene.chainGroup, g);
    } else {
      standalone.push(scene);
    }
  }

  for (const scene of standalone) {
    if (!shouldGenerate(scene, force)) {
      console.log(`Skipping ${scene.id} (already exists, pass --force to regenerate)`);
      continue;
    }
    await generate(scene);
  }

  for (const [groupName, scenes] of chainGroups) {
    const anyMissing = scenes.some((s) => shouldGenerate(s, force));
    if (!anyMissing) {
      console.log(
        `Skipping chain group "${groupName}" (all ${scenes.length} clips exist, pass --force to regenerate)`,
      );
      continue;
    }
    console.log(`\nChain group "${groupName}" — ${scenes.length} clips sequential`);
    const recentIds: string[] = [];
    for (const scene of scenes) {
      const reqId = await generate(scene, recentIds);
      if (reqId) {
        recentIds.push(reqId);
        if (recentIds.length > 3) recentIds.shift();
      }
    }
  }

  console.log("\nDone! Audio files in public/voiceover/");
}

main().catch(console.error);
