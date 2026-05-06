# AOS Demo — Storyboard

**Active composition:** `aos-demo` (`AosDemo` with Mai PIP). Script text flows: `scripts/did-test/avatar-scenes.ts` → ElevenLabs Matilda MP3 → D-ID Lily audio-driven MP4 → Remotion composition.

**MAINTENANCE RULE:** Update this file in the same edit as any audio trim, `D` map bump, scene regen, or base-video re-export. Narration blocks below contain the **full text** of each clip — not snippets or references. See `feedback_sync_golden_rules.md` Rule 4.

---

## Timeline — Speech-Driven

Speech is the single source of truth. Visual scenes persist until narration finishes. Durations come from the `D` map in `src/AosDemo.tsx` (probed from `public/avatar/*.mp4` headers).

**Total runtime: 2:51.9** (after 2026-04-20 scene1/scene3a/scene6 regens + 2026-04-18 Mai intro retirement and scene5 carousel rebuild).

### Title Card — 0:00.0 → 0:03.0 — 3.0s (silent)
**Visual:** Brand flash — "autonomOS / The trusted context layer for your enterprise / Connect. Contextualize. Execute." with favicon settling into the watermark corner.

> (no narration — `TITLE_FLASH = 3.0s`. The former `scene0-mai-intro` greeting "Hi, I'm Mai…" was retired 2026-04-18 and is no longer in `TRACKS`. The clip is kept in the `D` map for back-compat only.)

### Scene 1 — 0:03.0 → 0:58.2 — 55.2s
**Clip:** `scene1-problems` &nbsp;|&nbsp; **Visual:** `LogoAvalanche` component (application-sprawl / context-gap animation — replaces retired `public/scenes/scene1.mp4`).

> For decades, enterprises have poured billions into every version of the same promise — one system of record, one single source of truth, one integration project after another — and the systems still don't understand each other. The average enterprise runs nearly nine hundred applications, each one describing the same business in its own way, none of them adding up to a single coherent picture. Then comes the next wave. AI agents, multiplying by the quarter. An agent without reliable context isn't an asset, it's a liability — automating the wrong answer faster than any human ever could. Orchestration alone doesn't solve it. Without shared context in the data underneath, the agents keep hallucinating — just in better coordination. That's the gap autonomous closes. One unified context across every system.

**Note:** `D["scene1-problems"] = 55.22` = 55.07 audio + 0.15 breath pad (regen 2026-04-20, trimmed head + tail). Script replaces the prior short "Enterprises have spent millions…" version.

### Scene 2 — 0:58.2 → 1:20.4 — 22.2s
**Clip:** `scene2-all` &nbsp;|&nbsp; **Visual:** `Scene2HowItWorks` component (discover → connect → resolve, built in code — replaces retired `scene2i.mp4` + `scene2.mp4` two-clip split).

> And here's how it works. AOS sits on top of everything you already have — no migration, no replatforming. It scans your systems, figures out what the data means — how customers, products, and contracts actually relate — and gives you a context layer your whole organization can use.

**Note:** `D["scene2-all"] = 22.2` = 0.7s pre-roll fade-in + 19.30s audio + 2.2s tail hold. Audio plays from `T_S2 + f(0.7)` so Mai never cuts in on the dark fade-in frame; every keyframe inside `Scene2HowItWorks` is shifted to match. The prior `scene2-solution` + `scene2-all` merged-narration pair is retired.

### Scene 3A — 1:20.4 → 1:36.2 — 15.7s
**Clip:** `scene3a-all` &nbsp;|&nbsp; **Visual:** `MaiChat` component (chat UI built in code — replaces retired `scene3a.mp4`).

> Each AOS deployment includes an integrated version of me. I'm your concierge agent. I answer questions about your data in plain English, and I can make changes to the platform — simple ones happen instantly, bigger ones need your approval.

**Note:** Regen 2026-04-20 merged the former Q&A + platform-management sentences into one. The "I speak fluent spreadsheet, too." and "No day-one surprises." Mai quips were removed. The 13.31s sacrosanct mid-scene cut is no longer relevant — no hard cut in the code-rendered chat UI.

### Scene 4 — 1:36.2 → 1:50.6 — 14.5s
**Clip:** `scene4-knowledgegraph` &nbsp;|&nbsp; **Visual:** `public/scenes/scene4.mp4` (knowledge graph animation — only remaining base-video scene).

> What ties all of this together is the knowledge graph. It's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess.

### Scene 5 Intro — 1:50.6 → 2:00.1 — 9.4s
**Clip:** `scene5-intro` &nbsp;|&nbsp; **Visual:** `public/convergence_ig.jpeg` full-frame at 0.35 opacity (`FadedBackground`). Kinetic-typography stages from the v6 storyboard have been removed.

> Everything I've shown you so far works for one company. Now let me show you what happens when there are two or more. The leading use case: M&A.

### Scene 5 — 2:00.1 → 2:11.2 — 11.1s
**Clip:** `scene5-all` &nbsp;|&nbsp; **Visual:** 3D carousel ring (`Scene5Slides`) — title card, then 5 screenshots orbit clockwise.

> Here's what we automate. Unified financials. Quality of earnings. Proforma combined earnings. Cross-sell and upsell opportunities. Backoffice overlap.

**Carousel beats** (`CAROUSEL_BEATS` in `AosDemo.tsx`, from `silencedetect` on `scene5-all.mp3` 2026-04-18 regen):
- 0.00–1.02s: "Here's what we automate." title card fades in then out
- 1.30s: carousel activates — `combine_fs.png` at front ("Unified financials")
- 3.08s: `qofe2.png` rotates to front ("Quality of earnings")
- 4.69s: `ebitda2.png` rotates to front ("Proforma combined earnings")
- 6.74s: `x-sell2.png` rotates to front ("Cross-sell and upsell opportunities")
- 9.18s: `backoffice2.png` rotates to front ("Backoffice overlap")

`D["scene5-all"] = 11.1` = 10.89 audio + 0.21 breath. The former long-form narration ("Seventy percent of M&A deals fail… Convergence automates comprehension… Surface what should break the deal…") and the PNG fade-sequence with `MA.png` title slide are retired.

### Scene 6 — 2:11.2 → 2:40.0 — 28.9s
**Clip:** `scene6-deploy` &nbsp;|&nbsp; **Visual:** `Scene6Deploy` component (kinetic headline + contrast bars + 4-reason row — replaces retired static `public/days.png`).

> And the best part: AOS deploys in days, not years. Four reasons. Nothing in your stack changes — no replatforming, no migration. Middleware does the work — your existing integration infrastructure, not hundreds of APIs. A synthetic data farm catches problems before you go live. And I handle the prep myself — discovery, requirements, feasibility — all human supervised.

**Card beats** (`CARD_BEATS` in `AosDemo.tsx`, `silencedetect -35dB:0.2` on 2026-04-20 regen): **5.41 / 11.57 / 18.14 / 24.10s**. Cards: (1) Nothing in the stack changes, (2) Middleware does the work, (3) Synthetic data farm, (4) Mai handles the prep.

**Closing tagline:** "Abstraction over extraction." fades in from 26.5s → 28.0s and holds through scene end at 28.87s. The "No day-one surprises." Mai quip was trimmed out in the 2026-04-20 regen along with the ordinals ("First… Second… Third… And fourth…").

### Scene 7 — 2:40.0 → 2:51.9 — 11.9s (8.87s speech + 3.0s TAIL_HOLD)
**Clip:** `scene7-closing` &nbsp;|&nbsp; **Visual:** `public/closing.png` static slide.

> AOS is changing the paradigm of enterprise technology, and how it's deployed. If you want to learn more, find us at autonomous dot tech.

**Note:** `TAIL_HOLD = 3.0s` cloned-frame padding holds the closing slide after Mai finishes.

---

## Iteration workflow

1. Edit a script in `scripts/did-test/avatar-scenes.ts` (single source of truth).
2. Regen Matilda MP3: `npx tsx scripts/did-test/generate-matilda.ts <clip-id> --force`.
3. Regen D-ID clip: `npx tsx scripts/did-test/generate-avatar.ts <clip-id> --force`.
4. Update `D` map in `src/AosDemo.tsx` from the new MP4 header.
5. Rebuild concat: `npx tsx scripts/did-test/concat-avatar.ts`.
6. **Update this STORYBOARD.md** — new From/To/duration/text for the affected scene AND cumulative recalc for all downstream scenes.
7. **Update `remotion_cut_registry.md`** if any cut bindings changed.
8. Preview in Remotion Studio (port 3011) → `npm run render` only after explicit user approval.

## Avatar pipeline files

| File | Purpose |
|---|---|
| `scripts/did-test/avatar-scenes.ts` | 9-clip narration script — single source of truth (`scene0-mai-intro` retained in file but not in `TRACKS`) |
| `scripts/did-test/generate-matilda.ts` | ElevenLabs Matilda TTS → `public/avatar/audio/*.mp3` |
| `scripts/did-test/generate-avatar.ts` | Uploads MP3s to D-ID `/audios` → audio-driven Lily clips in `public/avatar/*.mp4` |
| `scripts/did-test/concat-avatar.ts` | Concatenates clips into `avatar-combined.mp4` (+ 3s tail hold, + breath gaps) |
| `src/AosDemo.tsx` | Remotion composition — `D` map is the duration source of truth |
| `src/LogoAvalanche.tsx` | Scene 1 visual |
| `src/Scene2HowItWorks.tsx` | Scene 2 visual |
| `src/MaiChat.tsx` | Scene 3A visual |
| `public/avatar/audio/*.mp3` | Matilda voice tracks, played by `<Audio>` BG layer |
| `public/avatar/*.mp4` | D-ID audio-driven Lily clips (per-clip input to `concat-avatar.ts`) |
| `public/avatar/avatar-combined.mp4` | Concatenated avatar video, muted `OffthreadVideo` PIP source |
| `remotion_cut_registry.md` | Append-only ledger of every visual cut tied to speech |

## File map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Title card + persistent watermark |
| `public/convergence_ig.jpeg` | Scene 5 Intro faded background (0.35 opacity) |
| `public/combine_fs.png` | Scene 5 carousel — unified financials |
| `public/qofe2.png` | Scene 5 carousel — quality of earnings |
| `public/ebitda2.png` | Scene 5 carousel — proforma combined earnings |
| `public/x-sell2.png` | Scene 5 carousel — cross-sell & upsell |
| `public/backoffice2.png` | Scene 5 carousel — backoffice overlap |
| `public/closing.png` | Scene 7 static slide |
| `public/scenes/scene4.mp4` | Scene 4 base video (only surviving base-video scene — `scene1.mp4`, `scene2.mp4`, `scene2i.mp4`, `scene3a.mp4` retired in favor of code components) |
