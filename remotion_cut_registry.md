# Remotion Sacrosanct Cut Registry

Append-only ledger of every visual cut tied to speech. Update when you add a code constant or a base-video transition. **Never delete an entry — mark RETIRED with a date.**

Two kinds of cut are tracked:
- **Code constants** — `Sequence` splits, slide breakpoints, kinetic-typography stage windows in `src/AvatarDemo.tsx`.
- **Base-video hard-cuts** — scene changes baked into `public/scenes/*.mp4` by the upstream animator.

## Code constants — src/AvatarDemo.tsx

| Constant | Value (s) | Audio file | Bound phoneme | Verified | Status |
|---|---|---|---|---|---|
| Scene3A split (pre-quip) | 10.72 | scene3a-all.mp3 | mid-silence between "plain English." and "You can also ask me to make changes…" | 2026-04-14 | RETIRED 2026-04-15 — "I speak fluent spreadsheet, too." quip inserted after "plain English."; binding topic preserved but silence position moved |
| Scene3A split (post-quip, line 889) | 13.31 | scene3a-all.mp3 | mid-silence between "I speak fluent spreadsheet, too." and "You can also ask me to make changes…" — preserves topical break (answer questions → make changes) around base-video hard cut at frame 420 | 2026-04-15 | ACTIVE |
| Scene5Slides breakpoints (pre-trim) | 13.42 / 18.65 / 22.80 / 28.26 / 32.59 | scene5-all.mp3 | silence_ends after "M&A, de-risked" / "across both companies" / "every adjustment flagged" / "tracked through close" / "across both customer books" | 2026-04-14 | RETIRED 2026-04-14 — "M&A, de-risked" deleted; binding for first breakpoint destroyed, others shifted -0.99s |
| Scene5Slides breakpoints (post-trim, 240–246) | 12.44 / 17.66 / 21.82 / 27.27 / 31.60 | scene5-all.mp3 | silence_ends after "before it does" (trim splice) / "across both companies" / "every adjustment flagged" / "tracked through close" / "across both customer books" | 2026-04-14 | ACTIVE |
| Scene5Intro stages (pre-trim) | s1[0.2,2.6] s2[2.8,5.8] s3[6.1,9.7] s4[9.9,12.2] s5[12.4,13.5] | scene5-all.mp3 | sentences "Seventy percent of M&A deals fail" / "real deal-breakers got lost in execution trivia" / "Convergence automates comprehension" / "Surface what should break the deal — before it does" / "M&A, de-risked" | 2026-04-14 | RETIRED 2026-04-14 — s5 sentence deleted from VO and visual |
| Scene5Intro stages (post-trim, 327–330) | s1[0.2,2.6] s2[2.8,5.8] s3[6.1,9.7] s4[9.9,13.0] | scene5-all.mp3 | sentences "Seventy percent of M&A deals fail" / "real deal-breakers got lost in execution trivia" / "Convergence automates comprehension" / "Surface what should break the deal — before it does" | 2026-04-14 | ACTIVE |
| Scene5Intro rootFade close | 12.44 | scene5-all.mp3 | crossfade with combine_fs.png at "Here's what we automate" speech start | 2026-04-14 | ACTIVE |
| Scene6 CARD_BEATS (pre-quip) | 6.36 / 14.89 / 23.02 / 31.15 | scene6-deploy.mp3 | silence_ends after intro / "no replatforming, no migration" / "not to hundreds of APIs" / "before you go live" | 2026-04-14 | RETIRED 2026-04-15 — scene6-deploy.mp3 regenerated for "No day-one surprises." quip; beats 1–3 shifted left, beat 4 coincidentally stable |
| Scene6 CARD_BEATS (post-quip, line 543) | 6.20 / 14.35 / 22.45 / 31.15 | scene6-deploy.mp3 | silence_ends after "Four reasons." / "no replatforming, no migration." / "not to hundreds of APIs." / "before you go live." (quip "No day-one surprises." appended at end, after beat 4) | 2026-04-15 | ACTIVE |
| Scene6 closing tagline window | 39.9 → 41.4 | scene6-deploy.mp3 | "Abstraction over extraction." tagline floats in near scene end, tuned to +2.4s relative to pre-quip timing | 2026-04-15 | ACTIVE |
| D["scene1-problems"] breath pad | 20.71 (audio 20.56 + 0.15 silence pad) | scene1-problems.mp3 / scene2-solution.mp3 boundary | adds breath gap before "And here's" — must match concat-avatar.ts Scene 1 group duration | 2026-04-14 | ACTIVE |

## Base-video hard-cuts — public/scenes/*.mp4

| File | Cut (s) | Audio | Bound phoneme | Status |
|---|---|---|---|---|
| scene2.mp4 (pre-fix, 57.60s) | 12.03 | scene2-all.mp3 | silence 12.15–12.77 between "…connects to them." and "Your systems don't change." | RETIRED 2026-04-14 — file regenerated to clean head + freeze |
| scene2.mp4 (pre-fix, 57.60s) | 20.03 | scene2-all.mp3 | silence 19.71–20.28 between "…tools you already own" and "your integration platforms" — content (chatbox panel) had no VO bond in either .bak (54.28s) or current (47.96s) | RETIRED 2026-04-14 — content violation; chatbox is sacrosanct to scene3a only |
| scene2.mp4 (pre-fix, 57.60s) | 29.03 | scene2-all.mp3 | MID-WORD inside "How customers, products, contracts" (speech 28.55–30.77) — never bound to a phoneme boundary | RETIRED 2026-04-14 — alignment violation |
| scene2.mp4 (post-fix, 47.96s) | none | — | clean 3-panel head 0.00–19.97s + last-frame freeze through 47.96s | ACTIVE 2026-04-14 |

## Process — when editing audio

1. **Before the edit:** Read this registry. List every entry whose offset falls inside the edit window. Print each entry + downstream consumer impact.
2. **Make the edit.**
3. **After the edit:** Re-run silencedetect on the changed file. Verify every registry entry whose audio matches still resolves to its bound phoneme. Print pass/fail per entry.
4. **Failure modes:**
   - Bound phoneme **still present at new offset** → cut moves with it; update the constant; mark verified date.
   - Bound phoneme **shifted by < 0.15s** → tolerable; verify perceptually in studio.
   - Bound phoneme **removed or destroyed** → cut is broken; revert the audio edit, re-cut the visual, or re-export the base video.
5. **New cuts:** any new code constant or base-video hard-cut tied to speech must be appended here **before the PR is considered done**.

## How to derive bindings

```bash
# Sentence boundaries in an audio file
./node_modules/ffmpeg-static/ffmpeg -i public/avatar/audio/<file>.mp3 \
  -af silencedetect=n=-35dB:d=0.25 -f null - 2>&1 | grep silence_

# Scene-change frames in a base video
./node_modules/ffmpeg-static/ffmpeg -i public/scenes/<file>.mp4 \
  -filter:v "select='gt(scene,0.20)',showinfo" -f null - 2>&1 | grep pts_time
```
