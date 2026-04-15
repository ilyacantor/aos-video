# AOS Demo — Storyboard

**Active composition:** `avatar-demo` (`AvatarDemo` with Mai PIP) — single output, single render target. Script text flows: `scripts/did-test/avatar-scenes.ts` → ElevenLabs Matilda MP3 → D-ID Lily audio-driven MP4 → Remotion composition.

**RETIRED 2026-04-14:** The `aos-movie` (no-PIP) variant was removed. Do not re-register it in `Root.tsx` or re-add `render` / `render:both` scripts. All edits and renders land only on `avatar-demo`. `npm run render` = avatar-demo.

**MAINTENANCE RULE:** This file MUST be updated in the same edit as any audio trim, D map bump, scene regen, breath gap, or base-video re-export. Narration blocks below contain the **full text** of each clip — not snippets or references. See `feedback_sync_golden_rules.md` Rule 4.

---

## Timeline — Speech-Driven

Speech is the single source of truth. Visual scenes persist until narration finishes. Durations come from the `D` map in `src/AvatarDemo.tsx` (probed from `public/avatar/*.mp4` headers).

**Total runtime: 3:46.2** (current state after the 2026-04-15 Mai quip additions to scene3a + scene6).

### Title Card — 0:00.0 → 0:05.4 — 5.4s
**Clip:** `scene0-mai-intro` &nbsp;|&nbsp; **Visual:** Title card with name + favicon watermark.

> Hi, I'm Mai, I'm the AI agent built into AOS, let me walk you through the platform.

### Scene 1 — 0:05.4 → 0:26.1 — 20.7s
**Clip:** `scene1-problems` &nbsp;|&nbsp; **Visual:** `public/scenes/scene1.mp4` (problem-space animation).

> Enterprises have spent millions on data infrastructure, and it still doesn't work. Most companies plan to invest in AI, but only a few have the systems to support it. Application sprawl and legacy jail leave a wide gap to a reliable, contextual single source of truth. That's the gap AOS closes.

**Note:** `D["scene1-problems"] = 20.71` = 20.56 audio + 0.15 silent breath gap. The breath gap was added 2026-04-15 to fix the rough "And here's…" onset into Scene 2 Intro. Must match `concat-avatar.ts` Scene 1 group duration (`DUR["scene1-problems"] + 0.15`) or BG audio and PIP avatar desync.

### Scene 2 Intro — 0:26.1 → 0:38.2 — 12.1s
**Clip:** `scene2-solution` &nbsp;|&nbsp; **Visual:** `public/scenes/scene2i.mp4` (solution intro animation).

> And here's how it works. It sits on top of everything you already have — no migration, no replatforming — and gives your whole organization one shared understanding of what's actually going on.

### Scene 2 — 0:38.2 → 1:26.2 — 48.0s
**Clip:** `scene2-all` &nbsp;|&nbsp; **Visual:** `public/scenes/scene2.mp4` (discover → connect → resolve animation).

> It starts with discovery. AOS scans your environment and builds a catalog of every system you have — including the ones nobody remembers buying. Then AOS connects to them. Your systems don't change. Your data doesn't move. Our layer sits on top, using the tools you already own — your integration platforms, your APIs, your warehouse. Then it figures out what the data actually means. How customers, products, contracts, and accounts relate to each other — automatically, across every source. And the result is a context layer your whole organization can use. With real-world context captured in your data, analytics are higher-quality and search results are more relevant.

**Note:** scene2.mp4 was regenerated 2026-04-14 — clean 3-panel head 0–19.97s + frozen last frame through 47.96s. The pre-fix version baked in three hard-cuts (12.03 / 20.03 / 29.03s) that bound the chatbox panel to wrong narration; all retired in `remotion_cut_registry.md`.

### Scene 3A — 1:26.2 → 1:52.4 — 26.2s
**Clip:** `scene3a-all` &nbsp;|&nbsp; **Visual:** `public/scenes/scene3a.mp4` (chatbox + platform management).

> Each AOS deployment includes an integrated version of me. I handle onboarding, training, and configuration, and I answer questions about your data in plain English. I speak fluent spreadsheet, too. You can also ask me to make changes to the platform. Simple things happen instantly. Bigger changes — like adding a new domain to your org — happen with your approval, and I walk you through it.

**Mai quip (2026-04-15):** "I speak fluent spreadsheet, too." — fluency/knowledge note, inserted after "plain English." Added +3.04s to scene3a-all (was 23.16 → 26.20). Cascades scene4→scene7 forward by 3.04s.

**Sacrosanct cut:** mid-scene split at **13.31s** (was 10.72 pre-quip, bumped 2026-04-15), bound to the silence between "I speak fluent spreadsheet, too." and "You can also ask me to make changes…". Preserves the topical break (answering questions → making platform changes) around the base-video hard cut at frame 420. Registry-tracked in `remotion_cut_registry.md`.

### Scene 4 — 1:52.4 → 2:06.9 — 14.5s
**Clip:** `scene4-knowledgegraph` &nbsp;|&nbsp; **Visual:** `public/scenes/scene4.mp4` (knowledge graph animation).

> What ties all of this together is the knowledge graph. It's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess.

### Scene 5 Intro — 2:06.9 → 2:16.3 — 9.4s
**Clip:** `scene5-intro` &nbsp;|&nbsp; **Visual:** `public/convergence_ig.jpeg` full-frame at 0.35 opacity + kinetic typography stages.

> Everything I've shown you so far works for one company. Now let me show you what happens when there are two or more. The leading use case: M&A.

**Kinetic typography stages** (driven by `scene5-all.mp3` sentence onsets, not `scene5-intro.mp3` — the next scene's opening beats are foreshadowed here):
- Stage 1 (0.2–2.6s): "Seventy percent of M&A deals fail"
- Stage 2 (2.8–5.8s): "real deal-breakers got lost in execution trivia"
- Stage 3 (6.1–9.7s): "Convergence automates comprehension"
- Stage 4 (9.9–13.0s): "Surface what should break the deal — before it does"
- `rootFade` cross-fade to `combine_fs.png` at 12.44s ("Here's what we automate" speech start in scene5-all)

The former Stage 5 "M&A, de-risked" was removed 2026-04-14 from both narration (`scene5-all.mp3` trim) and visual. All prior Scene5Intro/Scene5Slides entries are retired in `remotion_cut_registry.md`; current ACTIVE entries are the post-trim values.

### Scene 5 — 2:16.3 → 2:51.3 — 35.0s
**Clip:** `scene5-all` &nbsp;|&nbsp; **Visual:** PNG slide sequence timed to speech breakpoints in `scene5-all.mp3`.

> Seventy percent of M&A deals fail. The real deal-breakers got lost in execution trivia. Convergence automates comprehension. Surface what should break the deal — before it does. Here's what we automate. One unified financial picture across both companies. Quality of earnings, automated — every adjustment flagged. Proforma combined earnings, generated in diligence and tracked through close. Cross-sell thesis, validated across both customer books. Backoffice overlap quantified across people and systems.

**Slide sequence** (breakpoints from `silencedetect` on `scene5-all.mp3`, post-trim):
- 0.00–12.44s: cross-fade from Scene 5 Intro kinetic typography into `combine_fs.png`
- 12.44–17.66s: `combine_fs.png` — "one unified financial picture across both companies"
- 17.66–21.82s: `qofe2.png` — "quality of earnings, automated — every adjustment flagged"
- 21.82–27.27s: `ebitda2.png` — "proforma combined earnings, generated in diligence and tracked through close"
- 27.27–31.60s: `x-sell2.png` — "cross-sell thesis, validated across both customer books"
- 31.60–34.96s: `backoffice2.png` — "backoffice overlap quantified across people and systems"

### Scene 6 — 2:51.3 → 3:34.4 — 43.1s
**Clip:** `scene6-deploy` &nbsp;|&nbsp; **Visual:** `public/days.png` static slide + card animation beats.

> And the best part: AOS deploys in days, not years. Four reasons. First, nothing in your stack changes. We use the systems already in place — no replatforming, no migration. Second, middleware does the work. We connect through your existing integration infrastructure, not to hundreds of APIs. Third, a synthetic data farm gives us enterprise-scale readiness before deployment, so the common problems are caught before you go live. And fourth, I handle the prep myself. Technical discovery, requirements gathering, integration feasibility — all human supervised. No day-one surprises.

**Mai quip (2026-04-15):** "No day-one surprises." — prep/pragmatism note, appended after "all human supervised." Added +2.40s to scene6-deploy (was 40.68 → 43.08). Cascades scene7 forward by 2.40s.

**Card beats** (`CARD_BEATS` in AvatarDemo.tsx line 543): **6.20 / 14.35 / 22.45 / 31.15s** (bumped 2026-04-15 post-quip regen), bound to silence_ends after "Four reasons." / "no replatforming, no migration." / "not to hundreds of APIs." / "before you go live." All four beats land before the quip — beat 4 coincidentally stable.

**Closing tagline:** "Abstraction over extraction." floats in at 39.9s → 41.4s (was 37.5/39.0 pre-quip, +2.4s), holds until scene end at 43.08s. Mai's quip plays over the fully-visible tagline.

### Scene 7 — 3:34.4 → 3:46.2 — 11.9s (8.9s speech + 3.0s TAIL_HOLD)
**Clip:** `scene7-closing` &nbsp;|&nbsp; **Visual:** `public/closing-new.png` static slide.

> AOS is changing the paradigm of enterprise technology, and how it's deployed. If you want to learn more, find us at autonomous dot tech.

**Note:** `TAIL_HOLD = 3.0s` cloned-frame padding holds the closing slide after Mai finishes.

---

## Iteration workflow

1. Edit a script in `scripts/did-test/avatar-scenes.ts` (single source of truth).
2. Regen Matilda MP3: `npx tsx scripts/did-test/generate-matilda.ts <clip-id> --force`.
3. Regen D-ID clip: `npx tsx scripts/did-test/generate-avatar.ts <clip-id> --force`.
4. Update `D` map in `src/AvatarDemo.tsx` from the new MP4 header.
5. Rebuild concat: `npx tsx scripts/did-test/concat-avatar.ts`.
6. **Update this STORYBOARD.md** — new From/To/duration/text for the affected scene AND cumulative recalc for all downstream scenes.
7. **Update `remotion_cut_registry.md`** if any cut bindings changed.
8. Preview in Remotion Studio (port 3011) → `npm run render` only after explicit user approval.

## Avatar pipeline files

| File | Purpose |
|---|---|
| `scripts/did-test/avatar-scenes.ts` | 10-clip narration script — single source of truth |
| `scripts/did-test/generate-matilda.ts` | ElevenLabs Matilda TTS → `public/avatar/audio/*.mp3` |
| `scripts/did-test/generate-avatar.ts` | Uploads MP3s to D-ID `/audios` → audio-driven Lily clips in `public/avatar/*.mp4` |
| `scripts/did-test/concat-avatar.ts` | Concatenates clips into `avatar-combined.mp4` (+ 3s tail hold, + breath gaps) |
| `src/AvatarDemo.tsx` | Remotion composition — `D` map is the duration source of truth |
| `public/avatar/audio/*.mp3` | Matilda voice tracks, played by `<Audio>` BG layer |
| `public/avatar/*.mp4` | D-ID audio-driven Lily clips (per-clip input to `concat-avatar.ts`) |
| `public/avatar/avatar-combined.mp4` | Concatenated avatar video, muted `OffthreadVideo` PIP source |
| `remotion_cut_registry.md` | Append-only ledger of every visual cut tied to speech |

## File map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Title card + persistent watermark |
| `public/convergence_ig.jpeg` | Scene 5 Intro faded background |
| `public/combine_fs.png` | Scene 5 slide 1 — unified financial picture |
| `public/qofe2.png` | Scene 5 slide 2 — quality of earnings |
| `public/ebitda2.png` | Scene 5 slide 3 — proforma combined earnings |
| `public/x-sell2.png` | Scene 5 slide 4 — cross-sell thesis |
| `public/backoffice2.png` | Scene 5 slide 5 — backoffice overlap |
| `public/days.png` | Scene 6 static slide |
| `public/closing-new.png` | Scene 7 static slide |
| `public/scenes/scene{1,2i,2,3a,4}.mp4` | Base video segments for scenes 1–4 |
