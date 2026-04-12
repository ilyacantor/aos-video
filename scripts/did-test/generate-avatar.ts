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
    text: "Hi, I'm Mai. I'm the AI agent built into AOS — I'll walk you through the platform.",
  },
  {
    id: "scene1-problems",
    text: "Every enterprise runs on hundreds of systems that don't talk to each other. The data is there. The context isn't. So reports break, numbers fight each other, and the AI initiatives everyone's betting on stall before they ship.",
  },
  {
    id: "scene2-solution",
    text: "AOS is the layer that fixes this. It sits on top of everything you already have — no migration, no rip and replace — and gives your whole organization one shared understanding of what's actually going on.",
  },
  {
    id: "scene2-discover",
    text: "It starts with discovery. AOS scans your environment and builds a catalog of every system you have — including the ones nobody remembers buying.",
  },
  {
    id: "scene2-connect",
    text: "Then AOS connects to them. Your systems don't change. Your data doesn't move. Our layer sits on top, using the integration tools you already own — your iPaaS, your APIs, your warehouse.",
  },
  {
    id: "scene2-resolve",
    text: "Then it figures out what the data actually means. How customers, products, contracts, and accounts relate to each other — automatically, across every source.",
  },
  {
    id: "scene2-ask",
    text: "And the result is a context layer your whole organization can use.",
  },
  {
    id: "scene3a-mai",
    text: "Each AOS deployment ships with me — I'm Mai, your AI agent. I handle onboarding, training, and configuration, and I answer questions about your data in plain English.",
  },
  {
    id: "scene3a-mai-config",
    text: "You can also ask me to make changes to the platform. Simple things happen instantly. Bigger changes — like adding a new domain to your org — happen with your approval, and I walk you through it.",
  },
  {
    id: "scene4-knowledgegraph",
    text: "The thing that makes all of this work is the knowledge graph. It's not a database — it's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess.",
  },
  {
    id: "scene5-intro",
    text: "Everything I've shown you so far works for one company. Now let me show you what happens when there are two. The leading use case: M&A.",
  },
  {
    id: "scene5-title",
    text: "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours. Here's what we automate.",
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
    text: "Proforma combined earnings, generated in diligence and tracked through close.",
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
    id: "scene6-deploy",
    text: "And the best part: AOS deploys in days, not quarters. No migration. No rip and replace. Your systems stay exactly where they are.",
  },
  {
    id: "scene7-closing",
    text: "AOS is built for the reality of enterprise technology — light, fast, secure. If you want to see more, find us at A.O.S. dot tech.",
  },
  // ─── Merged per-group clips (natural cadence, zero internal gaps) ──
  {
    id: "scene2-all",
    text: "It starts with discovery. AOS scans your environment and builds a catalog of every system you have — including the ones nobody remembers buying. Then AOS connects to them. Your systems don't change. Your data doesn't move. Our layer sits on top, using the integration tools you already own — your iPaaS, your APIs, your warehouse. Then it figures out what the data actually means. How customers, products, contracts, and accounts relate to each other — automatically, across every source. And the result is a context layer your whole organization can use.",
  },
  {
    id: "scene3a-all",
    text: "Each AOS deployment ships with me — I'm Mai, your AI agent. I handle onboarding, training, and configuration, and I answer questions about your data in plain English. You can also ask me to make changes to the platform. Simple things happen instantly. Bigger changes — like adding a new domain to your org — happen with your approval, and I walk you through it.",
  },
  {
    id: "scene5-all",
    text: "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours. Here's what we automate. One unified financial picture across both companies. Quality of earnings, automated — every adjustment flagged. Proforma combined earnings, generated in diligence and tracked through close. Cross-sell thesis, validated across both customer books. Backoffice overlap quantified across people and systems.",
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
