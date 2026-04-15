# AOS Demo — Storyboard

**Total runtime:** 2:53 (173s · 5,190 frames @ 30 fps)
**Composition:** `aos-movie` in `src/DemoV2.tsx`
**Scene durations:** `S0_DUR` … `S5_DUR` (lines 40–48)
**Transitions:** uniform 0.3s end-of-scene fade (`sceneFadeOut`) except Scene 5, which uses 0.5s crossfades between slides
**Persistent elements:** `favicon.png` watermark (bottom-left) from 0:04 to end

---

## Scene 0 — Title Card  `0:00 – 0:04` · **4s**

- **Component:** `Scene0Title`
- **Assets:** `public/favicon.png`
- **VO:** `scene0-title.mp3` · 2.85s
- **Script:** *"What if your enterprise could finally understand itself?"* - this starts abruptly and often cuts off the first second or two.  insert a 1 second gap pre.  
- **Action:** Cold open on brand mark + pose-setting question.

---

## Scene 1 — The Problem  `0:04 – 0:16` · **12s**

- **Component:** `Scene1Problems`
- **Assets:** `public/funnel.mp4`, `COLUMNS` data block
- **VO:** `scene1-problems.mp3` · 10.79s
- **Script:** *"Many enterprises hit the same wall. Hundreds of systems, none of them talking to each other. The data is there, but the context isn't. And without context, nothing works the way it should."*
- **Action:** Two-column layout over funnel video. Left: "Enterprise Information is Broken". Right: "The Context Gap".

---

## Scene 2 Intro — Establishing Shot  `0:16 – 0:30` · **14s**

- **Component:** `Scene2Intro`
- **Assets:** `public/a1.jpeg`
- **VO:** `scene2-solution.mp3` · ~12s
- **Script:** *"That's what autonomous changes. One layer that sits on top of everything you already have. No migration. No rip and replace. It connects, it resolves, and it gives your entire organization a shared language."*
- **Action:** Full a1.jpeg on right with 3D perspective float-in. Card on left with "Introducing autonomOS" title and four text lines animating in staggered.

---

## Scene 2 — Zoom Walkthrough  `0:30 – 1:07` · **37s**

- **Component:** `Scene2Solution`
- **Assets:** `public/a1.jpeg`
- **VO:** 4 clips aligned to zoom stages:
  - `scene2-discover.mp3` @ 1.5s — *"Let me tell you how it works.  First, autonomous discovers every system in your enterprise and builds a clean catalog of the IT assets we'll connect to."*
insert a 1-sec pause
  - `scene2-connect.mp3` @ 8.5s — *"Our patented harness plugs into your existing integration infrastructure and routes your data to the Semantics engine."*
  - `scene2-resolve.mp3` @ 15s — *"There, your data isn't just normalized. The relationships inside it are discovered and stored in a Knowledge Graph."*
insert 1 sec pause
  - `scene2-ask.mp3` @ 21.5s — *"And this context-rich store becomes available in easy-to-consume formats — whether natural language query, or self-generating dashboards. Agents finally get the context they need to act, without hallucinating."*
- **Action:** 3s cinematic zoom from wide into stages 1+2, then 0.5s pans between stages. No title overlay.
remove 1 secs from the transition to 3a

---

## Scene 3A — Meet Mai  `1:07 – 1:28` · **21s**

- **Component:** `Scene3aNLQ`
- **VO:** `scene3a-mai.mp3` + `scene3a-mai-config.mp3` (@ ~14.8s)
- **Script:** *"Every autonomous deployment includes Mai — your customer success agent. Mai handles onboarding, training, and configuration changes, and knows the platform end-to-end. She also answers questions about your data, in natural language."* then *"You can also ask Mai to make human-supervised changes to the platform, from simple configuration and UI changes to adding entire domains to the org structure.  Simple changes happen instantly."*
- **Action:** Mai chat demo + config change demo.

---

## Scene 4 — Knowledge Graph  `1:40 – 2:11` · **31s**

- **Component:** `Scene4KnowledgeGraph`
- **Assets:** `public/aos_kg_v3.html` (interactive graph via iframe)
- **VO:** `scene4-knowledgegraph.mp3` · 29.73s
- **Script:** *"For agents and humans to work effectively, they need more than just data — they need context. context OS deploys Mai to scan surface-level relationships and work with your stakeholders to build a dynamic Knowledge Graph. This isn't just a database; it's a living network of people, assets, and concepts. By mapping these connections, Mai provides the semantic intelligence your enterprise needs to power autonomous agents and establish a single, context-aware source of truth."*
- **Action:** Live interactive knowledge graph plays in-frame.

---

## Scene 5 Intro — Multi-Entity Transition  `2:11 – 2:22` · **11s**

- **Component:** `Scene5Intro`
- **VO:** `scene5-intro.mp3` · ~9s
- **Script:** *"Our core platform for single entities extends to multiple entities. Now I will take you through the leading multi-entity use case, M&A."*
- **Action:** Centered text card. Line 1 (white + teal) fades in at 0.3s, line 2 (gray + orange "M&A") at 2.5s.

---

## Scene 5 — Convergence (M&A)  `2:22 – 2:53` · **31s**

Five slides with **0.5s crossfades**. Each visual is full-bleed with translucent overlay card. Background Ken Burns zoom.

### 5.0 — Title  `2:22 – 2:33` · **11s**
- **Assets:** `public/convergence-title2.png`
- **VO:** `scene5-title.mp3` · 10.40s
- **Script:** *"M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours — and complexity into clarity."*

### 5.1 — Combine  `2:33 – 2:37` · **5s**
- **Assets:** `public/combine_fs.png`
- **VO:** `scene5-combine.mp3` · *"One unified financial picture across both companies."*

### 5.2 — Quality of Earnings  `2:37 – 2:41` · **5s**
- **Assets:** `public/qofe2.png`
- **VO:** `scene5-qofe.mp3` · *"Quality of earnings, automated — every adjustment flagged."*

### 5.3 — Proforma ebitda `2:41 – 2:45` · **5s**
- **Assets:** `public/ebitda2.png`
- **VO:** `scene5-ebitda.mp3` · *"Pro forma ee-BIT-dah with a transparent bridge to run-rate."*

### 5.4 — Cross-Sell  `2:45 – 2:49` · **5s**
- **Assets:** `public/x-sell2.png`
- **VO:** `scene5-xsell.mp3` · *"Cross-sell thesis, validated across both customer books."*

### 5.5 — Backoffice Overlap  `2:49 – 2:53` · **4s**
- **Assets:** `public/backoffice2.png`
- **VO:** `scene5-backoffice.mp3` · *"Backoffice overlap quantified across people and systems."*

insert closing2.png.  can you make the CTAs clickable?  Keep this there until user closes the demo.  


---

## Voiceover Pipeline

- **Provider:** ElevenLabs (`eleven_multilingual_v2`)
- **Voice:** `gJx1vCzNCD1EQHT212Ls` — Ava, Eager / Helpful
- **Default voice_settings:** stability 0.5 · similarity_boost 0.75 · style 0.3
- **Scene 5 voice_settings (tighter):** stability 0.75 · similarity_boost 0.75 · style 0.1
- **Prosody chaining:** Scene 5 clips share a `chainGroup` and pass up to 3 `previous_request_ids`
- **Pronunciation overrides (in script text):** autonomOS → "autonomous", AOS → "autonomous", contextOS → "context OS", EBITDA → "ee-BIT-dah"
- **Generator:** `scripts/generate-voiceover.ts` — skips existing unless `--force`; chain groups regenerate all-or-nothing

## File Map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Scene 0 mark + persistent watermark |
| `public/funnel.mp4` | Scene 1 background |
| `public/a1.jpeg` | Scene 2 Intro + Scene 2 zoom walkthrough |
| `public/dash.png` | Scene 3B dashboards |
| `public/aos_kg_v3.html` | Scene 4 interactive graph (iframe) |
| `public/convergence-title2.png` | Scene 5.0 title card |
| `public/combine_fs.png` | Scene 5.1 |
| `public/qofe2.png` | Scene 5.2 |
| `public/ebitda2.png` | Scene 5.3 |
| `public/x-sell2.png` | Scene 5.4 |
| `public/backoffice2.png` | Scene 5.5 |
| `public/voiceover/*.mp3` | 18 VO clips total (see sections above) |
