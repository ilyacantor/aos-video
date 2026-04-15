# AOS Demo — Storyboard

Two compositions share the same visual scenes:

| | `aos-movie` (ElevenLabs) | `avatar-demo` (D-ID Mai) |
|---|---|---|
| **Source** | `src/DemoV2.tsx` | `src/AvatarDemo.tsx` |
| **VO** | ElevenLabs MP3s, fixed scene durations | D-ID Lily avatar, speech-driven timing |
| **Runtime** | 3:39 (219s) | 3:31 (211s) |

---

## Avatar Demo — Speech-Driven Timeline

Speech is the single source of truth. Visual scenes persist until narration finishes.
Durations in `D` map (`AvatarDemo.tsx`) → `concat-avatar.ts` → everything reflows.

| Visual | From | To | Dur | Clip | Speech |
|--------|------|----|-----|------|--------|
| **Title Card** | 0:00 | 0:07 | 7.0s | scene0-mai-intro | "Hi, I'm Mai. I'm the AI agent built into AOS, let me walk you through the platform." |
| **Scene 1** | 0:07 | 0:23 | 15.5s | scene1-problems | "Every enterprise runs on hundreds of systems that don't talk to each other. The data is there. The context isn't. So reports break, numbers fight each other, and the AI initiatives everyone's betting on stall before they ship." |
| **Scene 2 Intro** | 0:23 | 0:36 | 13.4s | scene2-solution | "AOS is the layer that fixes this. It sits on top of everything you already have — no migration, no replatforming — and gives your whole organization one shared understanding of what's actually going on." |
| **Scene 2** | 0:36 | 1:15 | 39.4s | scene2-all | Merged narration: discover → connect → resolve → ask. "integration platforms" instead of "iPaaS" for TTS pronunciation. |
| **Scene 3A** | 1:15 | 1:39 | 23.5s | scene3a-all | Merged narration opens with "Each AOS deployment includes an integrated version of me." → platform config. |
| **Scene 4** | 1:39 | 1:55 | 15.7s | scene4-knowledgegraph | "The thing that makes all of this work is the knowledge graph. It's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess." |
| **Scene 5 Intro** | 1:55 | 2:05 | 10.1s | scene5-intro | "Everything I've shown you so far works for one company. Now let me show you what happens when there are two or more. The leading use case: M&A." **Visual: `convergence_ig.jpeg` full-frame at 0.35 opacity.** |
| **Scene 5** | 2:05 | 2:39 | 34.4s | scene5-all | Merged narration: M&A framing → combine → QoE → ebitda → x-sell → backoffice. **Visual: PNG slides (MA.png → combine_fs → qofe2 → ebitda2 → x-sell2 → backoffice2) timed to speech breakpoints from `silencedetect` on scene5-all.mp4 — 12.57 / 16.41 / 20.53 / 25.67 / 30.03. scene5.mp4 no longer used.** |
| **Scene 6** | 2:39 | 3:20 | 40.6s | scene6-deploy | "And the best part: AOS deploys in days, not years. Four reasons…" walks through all 4 boxes (nothing changes / middleware does the work / synthetic data farm / Mai handles the prep). **Visual: static `days.png`.** |
| **Scene 7** | 3:20 | 3:31 | 8.2s + 3.0s hold | scene7-closing | "AOS is changing the paradigm of enterprise technology. If you want to learn more, find us at autonomous dot tech." **Visual: static `closing-new.png`, with `TAIL_HOLD = 3s` cloned-frame padding so the slide remains on screen after narration ends.** |

### Iteration workflow

1. Edit script text in `scripts/did-test/generate-avatar.ts`
2. Regenerate clip: `npx tsx scripts/did-test/generate-avatar.ts scene2-solution`
3. Update `D` duration in `src/AvatarDemo.tsx` (read from MP4 header)
4. Rebuild concat: `npx tsx scripts/did-test/concat-avatar.ts`
5. Preview in Remotion Studio

### Avatar pipeline files

| File | Purpose |
|---|---|
| `scripts/did-test/generate-avatar.ts` | D-ID clip generation (Lily presenter, Microsoft TTS) |
| `scripts/did-test/concat-avatar.ts` | Concatenates clips into `avatar-combined.mp4` with timing gaps |
| `src/AvatarDemo.tsx` | Remotion composition — `D` map is single source of truth |
| `public/avatar/*.mp4` | Individual D-ID clips |
| `public/avatar/avatar-combined.mp4` | Combined avatar video |
| `public/scenes/*.mp4` | Base video split into per-scene segments |

---

## ElevenLabs Demo — Fixed Timeline

Scene durations are constants in `src/DemoV2.tsx` (lines 40-48).

### Scene 0 — Title Card  `0:00 – 0:04` · 4s
- **VO:** `scene0-title.mp3` — *"What if your enterprise could finally understand itself?"*

### Scene 1 — The Problem  `0:04 – 0:18` · 14s
- **VO:** `scene1-problems.mp3` — *"Many enterprises hit the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should."*

### Scene 2 Intro  `0:18 – 0:33` · 15s
- **VO:** `scene2-solution.mp3` — *"That's what autonomous changes. One layer that sits on top of everything you already have. No migration, no rip and replace. It connects, it resolves, and it gives your entire organization a shared language."*

### Scene 2 — Zoom Walkthrough  `0:33 – 1:17` · 44s
- **Chain group:** `scene2` (stability 0.75, style 0.1)
- **VO:** 4 clips at offsets 1.5s, 12.5s, 20.5s, 29.5s

### Scene 3A — Meet Mai  `1:17 – 1:47` · 30s
- **VO:** `scene3a-mai.mp3` + `scene3a-mai-config.mp3` (@16s)

### Scene 4 — Knowledge Graph  `1:47 – 2:21` · 34s
- **VO:** `scene4-knowledgegraph.mp3`

### Scene 5 Intro  `2:21 – 2:32` · 11s
- **VO:** `scene5-intro.mp3`

### Scene 5 — Convergence  `2:32 – 3:16` · 44s
- **Chain group:** `scene5` (stability 0.75, style 0.1)
- **VO:** 6 slides (title@0, combine@16, qofe@21, ebitda@26, xsell@34, backoffice@39)

### Scene 6 — Closing  `3:16 – 3:39` · 23s
- **VO:** `scene6-closing.mp3` — *"autonomous is purpose-built to thrive in the reality of enterprise technology: legacy systems, data silos, and constant change. Our light, fast, secure connectivity — combined with unified intelligence — enables outcome-based automation at scale. Visit our website for an interactive demo and contact information."*

---

## Voiceover Pipeline (ElevenLabs)

- **Provider:** ElevenLabs (`eleven_multilingual_v2`)
- **Voice:** `XrExE9yKIg1WjnnlVkGX` — Matilda
- **Default settings:** stability 0.5 · similarity_boost 0.75 · style 0.3
- **Tight settings (scene2 + scene5):** stability 0.75 · style 0.1
- **Generator:** `scripts/generate-voiceover.ts`

## File Map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Title card + persistent watermark |
| `public/funnel.mp4` | Scene 1 background |
| `public/a1.jpeg` | Scene 2 Intro + Scene 2 zoom |
| `public/aos_kg_v3.html` | Scene 4 interactive graph |
| `public/convergence-title2.png` | Scene 5.0 title |
| `public/combine_fs.png` | Scene 5.1 |
| `public/qofe2.png` | Scene 5.2 |
| `public/ebitda2.png` | Scene 5.3 |
| `public/x-sell2.png` | Scene 5.4 |
| `public/backoffice2.png` | Scene 5.5 |
| `public/closing2.png` | Scene 6 |
