# AOS Demo V2 — Storyboard

**Total runtime:** 1:59 (119s · 3,570 frames @ 30 fps)
**Composition:** `DemoV2` in `src/DemoV2.tsx`
**Scene durations:** see `S0_DUR` … `S5_DUR` (lines 35–41)
**Transitions:** uniform 0.3s end-of-scene fade (`sceneFadeOut`) except Scene 5, which uses 0.5s crossfades between slides
**Persistent elements:** `favicon.png` watermark (top-right) from 0:04 to end

---

## Scene 0 — Title Card  `0:00 – 0:04` · **4s**

- **Component:** `Scene0Title`
- **Assets:** `public/favicon.png`
- **VO:** `public/voiceover/scene0-title.mp3` · 2.85s
- **Script:** *"What if your enterprise could finally understand itself?"*
- **Action:** Cold open on brand mark + pose-setting question. End-of-scene fade at 3.7s.

---

## Scene 1 — The Problem  `0:04 – 0:16` · **12s**

- **Component:** `Scene1Problems`
- **Assets:** `public/funnel.mp4` (background), `COLUMNS` data block (src lines 78–95)
- **VO:** `public/voiceover/scene1-problems.mp3` · 10.79s
- **Script:** *"Every enterprise hits the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should."*
- **Action:** Two-column layout lands over the funnel video.
  - **Left column — "Enterprise Information is Broken":** 900+ applications (avg enterprise, before agentic sprawl) · 71% are disconnected · 95% of IT leaders cite integration as the #1 barrier to AI adoption.
  - **Right column — "The Context Gap":** enterprise data exists across hundreds of systems with no shared semantic layer · teams operate from different numbers, different definitions, multiple sources of truth · AI agents hallucinate without structured context.

---

## Scene 2 — The Solution  `0:16 – 0:30` · **14s**

- **Component:** `Scene2Solution`
- **Assets:** `public/a1.jpeg` (AOS platform diagram)
- **VO:** `public/voiceover/scene2-solution.mp3` · 12.88s
- **Script:** *"That's what AOS changes. One layer that sits on top of everything you already have. No migration. No rip and replace. It connects, it resolves, and it gives your entire organization a shared language."*
- **Action:** Reveal the AOS platform layer sitting over existing enterprise systems. Calls out connect / resolve / shared language.

---

## Scene 3A — Meet Mai  `0:30 – 0:45` · **15s**

- **Component:** `Scene3aNLQ`
- **VO:** `public/voiceover/scene3a-mai.mp3` · 14.31s
- **Script:** *"Every autonomOS deployment includes Mai — your customer success agent. Mai handles onboarding, training, and configuration changes, and knows the platform end-to-end. She also answers questions about your data, in natural language."*
- **Action:** Introduces Mai as the embedded CSM agent + NLQ surface.

---

## Scene 3B — Self-Generating Dashboards  `0:45 – 0:57` · **12s**

- **Component:** `Scene3bDash`
- **Assets:** `public/dash.png`
- **VO:** `public/voiceover/scene3b-dashboards.mp3` · 10.66s
- **Script:** *"Dashboards are fully-featured and self-generating. Start from a preset, or spin one up on demand, in response to a natural language query — grounded in your live enterprise data."*
- **Action:** Dashboard screenshot with call-outs to presets + on-demand NLQ-driven view creation.

---

## Scene 4 — Knowledge Graph  `0:57 – 1:28` · **31s**

- **Component:** `Scene4KnowledgeGraph`
- **Assets:** `public/aos_kg_v3.html` (interactive graph, embedded via iframe)
- **VO:** `public/voiceover/scene4-knowledgegraph.mp3` · 29.73s
- **Script:** *"For agents and humans to truly collaborate, they need more than just data — they need context. contextOS deploys Mai to scan surface-level relationships and work with your stakeholders to build a dynamic Knowledge Graph. This isn't just a database; it's a living network of people, assets, and concepts. By mapping these connections, Mai provides the semantic intelligence your enterprise needs to power autonomous agents and establish a single, context-aware source of truth."*
- **Action:** Live interactive knowledge graph plays in-frame while VO explains the semantic layer.

---

## Scene 5 — Convergence (M&A Use Case)  `1:28 – 2:00` · **31s**

Five slides with **0.5s crossfades** between each. Title card extends the fade into slide 1. Each visual is full-bleed with a translucent overlay card that translateY-eases in over 0.5s. Background holds a gentle Ken Burns zoom.

### 5.0 — Title  `1:28 – 1:39` · **11s**
- **Assets:** `public/convergence-title2.png`
- **VO:** `public/voiceover/scene5-title.mp3` · 10.40s
- **Script:** *"M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours — and complexity into clarity."*
- **Action:** Full-bleed title card. Scale 1.00 → 1.06 over 11.5s; crossfades into slide 5.1 during the last 0.5s.

### 5.1 — Combine  `1:39 – 1:43` · **4s** · card on **left**
- **Assets:** `public/combine_fs.png`
- **VO:** `public/voiceover/scene5-combine.mp3` · 3.16s
- **Script:** *"One unified financial picture across both companies."*
- **Card:** *(no overlay — full-bleed visual only)*

### 5.2 — Quality of Earnings  `1:43 – 1:47` · **4s** · card on **right**
- **Assets:** `public/qofe2.png`
- **VO:** `public/voiceover/scene5-qofe.mp3` · 4.00s
- **Script:** *"Quality of earnings, automated — every adjustment flagged."*
- **Card title:** "QoE"
- **Card body:** Quality of earnings evaluates the sustainability, accuracy, and reliability of a company's reported earnings, primarily during mergers, acquisitions, or investments. It helps stakeholders validate EBITDA, identify non-recurring items, assess cash flow, and uncover risks — ensuring a fair valuation and reducing overpayment risks.

### 5.3 — Pro forma EBITDA  `1:47 – 1:51` · **4s** · card on **left**
- **Assets:** `public/ebitda2.png`
- **VO:** `public/voiceover/scene5-ebitda.mp3` · 4.00s
- **Script:** *"Pro forma EBITDA with a transparent bridge to run-rate."*
- **Card title:** "Proforma EBITDA"
- **Card body:** Reported EBITDA always needs adjustment — for one-time items, normalizations, run-rate corrections, and pro forma synergies. Convergence builds the bridge automatically, entity-tagged with confidence scores distinguishing high-certainty items from estimates.

### 5.4 — Cross-Sell / Upsell  `1:51 – 1:55` · **4s** · card on **right**
- **Assets:** `public/x-sell2.png`
- **VO:** `public/voiceover/scene5-xsell.mp3` · 3.84s
- **Script:** *"Cross-sell thesis, validated across both customer books."*
- **Card title:** "Cross-sell and upsell roadmap"
- **Card body:** The cross-sell thesis is the core thesis of most deals — and the hardest to validate. AOS.AI profiles 80% of the combined customer base automatically, then works with your sales team on the rest.

### 5.5 — Backoffice Overlap  `1:55 – 2:00` · **4s** · card on **left** *(last slide — parent scene fade handles end)*
- **Assets:** `public/backoffice2.png`
- **VO:** `public/voiceover/scene5-backoffice.mp3` · 3.42s
- **Script:** *"Backoffice overlap quantified across people and systems."*
- **Card title:** "Backoffice overlap assessment"
- **Card body:** Convergence produces overlap analysis automatically — across customers, vendors, IT, and personnel — with match confidence and combined financial impact.

---

## Voiceover Pipeline

- **Provider:** ElevenLabs (`eleven_multilingual_v2`)
- **Voice:** `gJx1vCzNCD1EQHT212Ls` — Ava, Eager / Helpful
- **Default voice_settings:** stability 0.5 · similarity_boost 0.75 · style 0.3
- **Scene 5 voice_settings (tighter):** stability 0.75 · similarity_boost 0.75 · style 0.1
- **Prosody chaining:** scene 5 clips share a `chainGroup` and pass up to 3 `previous_request_ids` so Ava's delivery threads across the six short clips
- **Generator:** `scripts/generate-voiceover.ts` — skips existing unless `--force`; chain groups regenerate all-or-nothing
- **Fit checker:** `scripts/measure-scene5.mjs` — measures every scene 5 clip against its slot via `@remotion/media-parser`

## File Map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Scene 0 mark + persistent watermark |
| `public/funnel.mp4` | Scene 1 background |
| `public/a1.jpeg` | Scene 2 platform diagram |
| `public/dash.png` | Scene 3B dashboards |
| `public/aos_kg_v3.html` | Scene 4 interactive graph (iframe) |
| `public/convergence-title2.png` | Scene 5.0 title card |
| `public/combine_fs.png` | Scene 5.1 |
| `public/qofe2.png` | Scene 5.2 |
| `public/ebitda2.png` | Scene 5.3 |
| `public/x-sell2.png` | Scene 5.4 |
| `public/backoffice2.png` | Scene 5.5 |
| `public/voiceover/scene{0..5}-*.mp3` | One VO clip per scene; Scene 5 has 6 per-slide clips |
