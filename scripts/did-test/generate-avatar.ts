/**
 * D-ID Avatar Generation — standalone experiment
 * Generates Lily (green screen) clips for all VO scenes using D-ID's built-in TTS.
 * Output: out/avatar/*.mp4
 *
 * Usage:
 *   npx tsx scripts/did-test/generate-avatar.ts          # skip existing
 *   npx tsx scripts/did-test/generate-avatar.ts --force   # regenerate all
 *   npx tsx scripts/did-test/generate-avatar.ts scene0-title scene2-resolve  # specific clips
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.DID_API_KEY!;
const API = "https://api.d-id.com";

// Lily — office background, red shirt (no green screen)
const PRESENTER_ID = "v2_public_Lily_NoHands_RedShirt_Office@JDOtgQlb_L";

type Scene = {
  id: string;
  text: string;
};

const SCENES: Scene[] = [
  {
    id: "scene0-mai-intro",
    text: "Hi, I'm Mai, the autonomous customer success agent. I'm here to walk you through our platform.",
  },
  {
    id: "scene0-title",
    text: "Now, imagine that your enterprise can finally understand itself.",
  },
  {
    id: "scene1-problems",
    text: "Many enterprises hit the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should.",
  },
  {
    id: "scene2-solution",
    text: "That's what autonomous changes. One layer that sits on top of everything you already have. No migration, no rip and replace. It connects, it resolves, and it gives your entire organization a shared language.",
  },
  {
    id: "scene2-discover",
    text: "Let me tell you how it works. First, autonomous discovers every system in your enterprise and builds a clean catalog of the IT assets we'll connect to.",
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
    text: "Every autonomous deployment includes me — I'm your customer success agent. I handle onboarding, training, and configuration changes, and I know the platform end-to-end. I also answer questions about your data, in natural language.",
  },
  {
    id: "scene3a-mai-config",
    text: "You can also ask me to make human-supervised changes to the platform, from simple configuration and UI changes to adding entire domains to the org structure. Simple changes happen instantly.",
  },
  {
    id: "scene4-knowledgegraph",
    text: "For agents and humans to work effectively, they need more than just data — they need context. I scan surface-level relationships and work with your stakeholders to build a dynamic Knowledge Graph. This isn't just a database; it's a living network of people, assets, and concepts. By mapping these connections, I provide the semantic intelligence your enterprise needs to power autonomous agents and establish a single context-aware source of truth.",
  },
  {
    id: "scene5-intro",
    text: "Our core platform for single entities extends to multiple entities. Now I will take you through the leading multi-entity use case, M&A.",
  },
  {
    id: "scene5-title",
    text: "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours — and complexity into clarity. Here are some of the essential diligence tools we automate.",
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
    text: "Proforma combined earnings, automatically generated in due diligence, and tracked through the entire deal cycle to post-close.",
  },
  {
    id: "scene5-xsell",
    text: "Cross-sell thesis, validated across both customer books.",
  },
  {
    id: "scene5-backoffice",
    text: "Backoffice overlap quantified across people and systems.",
  },
  {
    id: "scene6-closing",
    text: "autonomous is purpose-built to thrive in the reality of enterprise technology. Our light, fast, secure abstraction layer enables outcome-based automation at scale. If you want to learn more, visit us at autonomous dot tech.",
  },
];

const outDir = resolve(__dirname, "../../out/avatar");
mkdirSync(outDir, { recursive: true });

async function createClip(text: string): Promise<string> {
  const res = await fetch(`${API}/clips`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      presenter_id: PRESENTER_ID,
      script: {
        type: "text",
        input: text,
        provider: {
          type: "microsoft",
          voice_id: "en-US-JennyNeural",
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Create clip failed: ${res.status} ${await res.text()}`);
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
  throw new Error("Timed out");
}

async function generate(scene: Scene) {
  console.log(`\nGenerating: ${scene.id}...`);
  const id = await createClip(scene.text);
  process.stdout.write(`  id: ${id} polling`);

  const url = await pollClip(id);
  console.log();

  const video = await fetch(url);
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
    specific.length > 0
      ? SCENES.filter((s) => specific.includes(s.id))
      : SCENES;

  for (const scene of scenes) {
    const outPath = resolve(outDir, `${scene.id}.mp4`);
    if (!force && existsSync(outPath)) {
      console.log(`Skipping ${scene.id} (exists, --force to regenerate)`);
      continue;
    }
    await generate(scene);
  }

  console.log(`\nDone! Avatar clips in out/avatar/`);
}

main().catch(console.error);
