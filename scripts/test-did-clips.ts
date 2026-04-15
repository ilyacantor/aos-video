import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.DID_API_KEY!;
const API = "https://api.d-id.com";

const TEST_TEXT = "What if your enterprise could finally understand itself?";

const PRESENTERS = [
  { name: "alyssa-lobby", id: "v2_public_alyssa_red_suite_lobby@eRGtappQAP" },
  { name: "diana-gs", id: "v2_public_diana@so9Pg73d6N" },
];

async function createClip(presenterId: string): Promise<string> {
  const res = await fetch(`${API}/clips`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      presenter_id: presenterId,
      script: {
        type: "text",
        input: TEST_TEXT,
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
  console.log(`  Clip created: ${data.id}`);
  return data.id;
}

async function pollClip(id: string): Promise<string> {
  for (let i = 0; i < 90; i++) {
    const res = await fetch(`${API}/clips/${id}`, {
      headers: { Authorization: `Basic ${API_KEY}` },
    });
    const data = (await res.json()) as {
      status: string;
      result_url?: string;
      error?: { description: string };
    };

    if (data.status === "done" && data.result_url) {
      return data.result_url;
    }
    if (data.status === "error") {
      throw new Error(`Clip failed: ${JSON.stringify(data.error)}`);
    }

    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Timed out waiting for clip");
}

async function main() {
  for (const p of PRESENTERS) {
    console.log(`\nGenerating: ${p.name}...`);
    const id = await createClip(p.id);

    process.stdout.write("  Polling");
    const url = await pollClip(id);
    console.log();

    const video = await fetch(url);
    const buf = Buffer.from(await video.arrayBuffer());
    const outPath = resolve(__dirname, `../out/did-${p.name}.mp4`);
    writeFileSync(outPath, buf);
    console.log(`  Saved: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
}

main().catch(console.error);
