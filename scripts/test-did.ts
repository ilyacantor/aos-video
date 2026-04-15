import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.DID_API_KEY!;
const API = "https://api.d-id.com";

// D-ID stock presenter — young woman
const SOURCE_URL =
  "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg";

const TEST_TEXT =
  "What if your enterprise could finally understand itself?";

async function createTalk(): Promise<string> {
  const res = await fetch(`${API}/talks`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_url: SOURCE_URL,
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
    throw new Error(`Create talk failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string };
  console.log(`Talk created: ${data.id}`);
  return data.id;
}

async function pollTalk(id: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${API}/talks/${id}`, {
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
      throw new Error(`Talk failed: ${data.error?.description}`);
    }

    console.log(`  status: ${data.status}...`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Timed out waiting for talk");
}

async function main() {
  console.log("Creating D-ID talk...");
  const id = await createTalk();

  console.log("Polling for result...");
  const url = await pollTalk(id);

  console.log(`Downloading: ${url}`);
  const video = await fetch(url);
  const buf = Buffer.from(await video.arrayBuffer());
  const outPath = resolve(__dirname, "../out/did-test.mp4");
  writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

main().catch(console.error);
