import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const vo = resolve(__dirname, "../public/voiceover");

const clips = [
  "scene2-discover",
  "scene2-connect",
  "scene2-resolve",
  "scene2-ask",
  "scene3a-mai-config",
];
for (const id of clips) {
  const { durationInSeconds } = await parseMedia({
    src: resolve(vo, `${id}.mp3`),
    fields: { durationInSeconds: true },
    reader: nodeReader,
    acknowledgeRemotionLicense: true,
  });
  console.log(`${id.padEnd(22)} ${(durationInSeconds ?? 0).toFixed(2)}s`);
}
