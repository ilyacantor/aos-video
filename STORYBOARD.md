# AOS Demo — Storyboard

Two compositions share the same visual scenes:

| | `aos-movie` (ElevenLabs) | `avatar-demo` (D-ID Mai) |
|---|---|---|
| **Source** | `src/DemoV2.tsx` | `src/AvatarDemo.tsx` |
| **VO** | ElevenLabs MP3s, fixed scene durations | D-ID Lily avatar, speech-driven timing |
| **Runtime** | 3:39 (219s) | 3:27 (207s) |

---

## Avatar Demo — Speech-Driven Timeline

Speech is the single source of truth. Visual scenes persist until narration finishes.
Durations in `D` map (`AvatarDemo.tsx`) → `concat-avatar.ts` → everything reflows.

| Visual | From | To | Dur | Clip | Speech |
|--------|------|----|-----|------|--------|
| **Title Card** | 0:00 | 0:07 | 7.0s | scene0-mai-intro | "Hi, I'm Mai, the autonomous customer success agent. I'm here to walk you through our platform." |
| **Scene 1** | 0:07 | 0:25 | 18.4s | scene0-title | "Now, imagine that your enterprise can finally understand itself." |
| | | | | scene1-problems | "Many enterprises hit the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should." |
| **Scene 2 Intro** | 0:25 | 0:41 | 15.3s | scene2-solution | "That's what autonomous changes. One layer that sits on top of everything you already have. No migration, no rip and replace. It connects, it resolves, and it gives your entire organization a shared language." |
| **Scene 2** | 0:41 | 1:24 | 43.3s | scene2-discover (@1.5s) | "Let me tell you how it works. First, autonomous discovers every system in your enterprise and builds a clean catalog of the IT assets we'll connect to." |
| | | | | scene2-connect (@12.5s) | "Our patented harness plugs into your existing integration infrastructure and routes your data to the Semantics engine." |
| | | | | scene2-resolve (@20.5s) | "There, your data isn't just normalized. The relationships inside it are discovered and stored in a Knowledge Graph." |
| | | | | scene2-ask (@29.5s) | "And this context-rich store becomes available in easy-to-consume formats — whether natural language query, or self-generating dashboards. Agents finally get the context they need to act, without hallucinating." |
| **Scene 3A** | 1:24 | 1:52 | 28.4s | scene3a-mai | "Every autonomous deployment includes me — I'm your customer success agent. I handle onboarding, training, and configuration changes, and I know the platform end-to-end. I also answer questions about your data, in natural language." |
| | | | | scene3a-mai-config (@16s) | "You can also ask me to make human-supervised changes to the platform, from simple configuration and UI changes to adding entire domains to the org structure. Simple changes happen instantly." |
| **Scene 4** | 1:52 | 2:20 | 28.0s | scene4-knowledgegraph | "For agents and humans to work effectively, they need more than just data — they need context. I scan surface-level relationships and work with your stakeholders to build a dynamic Knowledge Graph. This isn't just a database; it's a living network of people, assets, and concepts. By mapping these connections, I provide the semantic intelligence your enterprise needs to power autonomous agents and establish a single context-aware source of truth." |
| **Scene 5 Intro** | 2:20 | 2:29 | 8.8s | scene5-intro | "Our core platform for single entities extends to multiple entities. Now I will take you through the leading multi-entity use case, M&A." |
| **Scene 5** | 2:29 | 3:12 | 43.0s | scene5-title (@0s) | "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours — and complexity into clarity. Here are some of the essential diligence tools we automate." |
| | | | | scene5-combine (@16s) | "One unified financial picture across both companies." |
| | | | | scene5-qofe (@21s) | "Quality of earnings, automated — every adjustment flagged." |
| | | | | scene5-ebitda (@26s) | "Proforma combined earnings, automatically generated in due diligence, and tracked through the entire deal cycle to post-close." |
| | | | | scene5-xsell (@34s) | "Cross-sell thesis, validated across both customer books." |
| | | | | scene5-backoffice (@39s) | "Backoffice overlap quantified across people and systems." |
| **Scene 6** | 3:12 | 3:27 | 15.1s | scene6-closing | "autonomous is purpose-built to thrive in the reality of enterprise technology. Our light, fast, secure abstraction layer enables outcome-based automation at scale. If you want to learn more, visit us at autonomous dot tech." |

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
