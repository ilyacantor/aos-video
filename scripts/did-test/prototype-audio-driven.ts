/**
 * Prototype: ElevenLabs Matilda → D-ID Lily lipsynced clip
 *
 * Flow:
 *   1. Generate Matilda MP3 via ElevenLabs
 *   2. Upload MP3 to D-ID /audios → audio_url
 *   3. Create clip with script.type="audio" + audio_url
 *   4. Poll + download
 *
 * Output: out/avatar-audio-driven/scene0-mai-intro.{mp3,mp4}
 * Usage:  npx tsx scripts/did-test/prototype-audio-driven.ts
 */
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DID_API = "https://api.d-id.com";
const EL_API = "https://api.elevenlabs.io";
const DID_KEY = process.env.DID_API_KEY!;
const EL_KEY = process.env.ELEVENLABS_API_KEY!;

const VOICE_ID = "XrExE9yKIg1WjnnlVkGX"; // Matilda
const PRESENTER_ID = "v2_public_Lily_NoHands_RedShirt_Office@JDOtgQlb_L";

const SCENE_ID = "scene0-mai-intro";
const SCENE_TEXT =
  "Hi, I'm Mai. I'm the AI agent built into AOS, let me walk you through the platform.";

const outDir = resolve(__dirname, "../../out/avatar-audio-driven");
mkdirSync(outDir, { recursive: true });

async function generateMatildaAudio(): Promise<string> {
  console.log("1. ElevenLabs Matilda → MP3");
  const res = await fetch(
    `${EL_API}/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": EL_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: SCENE_TEXT,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const audio = Buffer.from(await res.arrayBuffer());
  const path = resolve(outDir, `${SCENE_ID}.mp3`);
  writeFileSync(path, audio);
  console.log(`   → ${path} (${(audio.length / 1024).toFixed(0)} KB)`);
  return path;
}

async function uploadToDid(audioPath: string): Promise<string> {
  console.log("2. Upload to D-ID /audios");
  const audioBuf = readFileSync(audioPath);
  const form = new FormData();
  form.append(
    "audio",
    new Blob([audioBuf], { type: "audio/mpeg" }),
    `${SCENE_ID}.mp3`,
  );
  const res = await fetch(`${DID_API}/audios`, {
    method: "POST",
    headers: { Authorization: `Basic ${DID_KEY}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`D-ID upload ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { url: string };
  console.log(`   → ${data.url}`);
  return data.url;
}

async function createAudioClip(audioUrl: string): Promise<string> {
  console.log("3. Create D-ID clip (audio-driven)");
  const res = await fetch(`${DID_API}/clips`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${DID_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      presenter_id: PRESENTER_ID,
      script: { type: "audio", audio_url: audioUrl },
    }),
  });
  if (!res.ok) {
    throw new Error(`D-ID clip ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string };
  console.log(`   id: ${data.id}`);
  return data.id;
}

async function pollClip(id: string): Promise<string> {
  process.stdout.write("4. Polling");
  for (let i = 0; i < 120; i++) {
    const res = await fetch(`${DID_API}/clips/${id}`, {
      headers: { Authorization: `Basic ${DID_KEY}` },
    });
    const data = (await res.json()) as {
      status: string;
      result_url?: string;
      error?: { description: string };
    };
    if (data.status === "done" && data.result_url) {
      console.log();
      return data.result_url;
    }
    if (data.status === "error") {
      throw new Error(`Clip failed: ${JSON.stringify(data.error)}`);
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Polling timed out");
}

async function downloadResult(url: string): Promise<string> {
  console.log("5. Download result MP4");
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const path = resolve(outDir, `${SCENE_ID}.mp4`);
  writeFileSync(path, buf);
  console.log(`   → ${path} (${(buf.length / 1024).toFixed(0)} KB)`);
  return path;
}

async function main() {
  const audioPath = await generateMatildaAudio();
  const audioUrl = await uploadToDid(audioPath);
  const clipId = await createAudioClip(audioUrl);
  const resultUrl = await pollClip(clipId);
  const videoPath = await downloadResult(resultUrl);
  console.log(`\nDone → ${videoPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
