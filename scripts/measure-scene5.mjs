import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const vo = resolve(__dirname, "../public/voiceover");

const clips = [
  { id: "scene5-title", slot: 11 },
  { id: "scene5-combine", slot: 4 },
  { id: "scene5-qofe", slot: 4 },
  { id: "scene5-ebitda", slot: 4 },
  { id: "scene5-xsell", slot: 4 },
  { id: "scene5-backoffice", slot: 4 },
];

for (const c of clips) {
  const { durationInSeconds } = await parseMedia({
    src: resolve(vo, `${c.id}.mp3`),
    fields: { durationInSeconds: true },
    reader: nodeReader,
  });
  const d = durationInSeconds ?? 0;
  const fit = d <= c.slot ? "OK " : "OVER";
  console.log(
    `${fit}  ${c.id.padEnd(22)} ${d.toFixed(2)}s / ${c.slot}s slot`,
  );
}
