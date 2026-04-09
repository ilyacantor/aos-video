// Detect tight dashboard bounding box for each Convergence PNG.
//
// Strategy: the dashboard panels have a distinctively dark background
// (R,G,B all < ~50). The cardBg wrapper is ~[80,84,97]. The sidebar text
// area is cardBg. So we find the bounding box of "dark" pixels — that
// is, the dashboard itself — ignoring the wrapper and text sidebar.

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const FILES = [
  "combine_fs.png",
  "qofe.png",
  "ebitda.png",
  "x-sell.png",
  "hr_lap.png",
];

// A pixel counts as "dashboard-dark" if all channels are below this.
const DARK_MAX = 55;

// Columns/rows that contain at least this fraction of dark pixels are
// considered part of the dashboard body.
const DARK_FRACTION = 0.15;

function analyze(file) {
  return sharp(path.join(PUBLIC, file))
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const w = info.width;
      const h = info.height;

      const colDark = new Array(w).fill(0);
      const rowDark = new Array(h).fill(0);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (data[i] < DARK_MAX && data[i + 1] < DARK_MAX && data[i + 2] < DARK_MAX) {
            colDark[x]++;
            rowDark[y]++;
          }
        }
      }

      const colThreshold = h * DARK_FRACTION;
      const rowThreshold = w * DARK_FRACTION;

      let L = 0;
      while (L < w && colDark[L] < colThreshold) L++;
      let R = w - 1;
      while (R > L && colDark[R] < colThreshold) R--;
      let T = 0;
      while (T < h && rowDark[T] < rowThreshold) T++;
      let B = h - 1;
      while (B > T && rowDark[B] < rowThreshold) B--;

      return { file, w, h, L, R, T, B };
    });
}

for (const f of FILES) {
  const { file, w, h, L, R, T, B } = await analyze(f);
  const cL = L / w;
  const cR = 1 - (R + 1) / w;
  const cT = T / h;
  const cB = 1 - (B + 1) / h;
  console.log(
    `${file.padEnd(16)} ${w}x${h}  bbox=(${L}..${R}, ${T}..${B})  ` +
      `crops L=${cL.toFixed(3)} R=${cR.toFixed(3)} T=${cT.toFixed(3)} B=${cB.toFixed(3)}`,
  );
}
