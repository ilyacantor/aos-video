# AOS Demo — Storyboard

Two compositions share the same component (`src/AvatarDemo.tsx`), same scripts,
same Matilda audio track. The only difference is whether Mai's avatar PIP is
rendered.

| | `aos-movie` | `avatar-demo` |
|---|---|---|
| **Component** | `AvatarDemo` with `showAvatar: false` | `AvatarDemo` with `showAvatar: true` |
| **VO** | Matilda (ElevenLabs) — identical for both | Matilda (ElevenLabs) — identical for both |
| **Avatar PIP** | none | D-ID Lily audio-driven lipsync |
| **Runtime** | 3:24 (204s) | 3:24 (204s) |

**Pipeline:** script text → ElevenLabs (Matilda) MP3 → D-ID `/audios` upload →
audio-driven clip → audio and video paths decoupled in Remotion. Both variants
render from the exact same source of truth (`scripts/did-test/avatar-scenes.ts`).

---

## Timeline — Speech-Driven

Speech is the single source of truth. Visual scenes persist until narration finishes.
Durations in `D` map (`AvatarDemo.tsx`) ← `public/avatar/*.mp4` headers → `concat-avatar.ts`.

| Visual | From | To | Dur | Clip | Speech |
|--------|------|----|-----|------|--------|
| **Title Card** | 0:00 | 0:05 | 5.4s | scene0-mai-intro | "Hi, I'm Mai. I'm the AI agent built into AOS, let me walk you through the platform." |
| **Scene 1** | 0:05 | 0:19 | 13.8s | scene1-problems | "Every enterprise runs on hundreds of systems that don't talk to each other…" |
| **Scene 2 Intro** | 0:19 | 0:33 | 13.6s | scene2-solution | "AOS is the layer that fixes this…" |
| **Scene 2** | 0:33 | 1:12 | 39.0s | scene2-all | Merged narration: discover → connect → resolve → ask. |
| **Scene 3A** | 1:12 | 1:35 | 23.2s | scene3a-all | "Each AOS deployment includes an integrated version of me…" |
| **Scene 4** | 1:35 | 1:49 | 14.2s | scene4-knowledgegraph | "…the knowledge graph…" |
| **Scene 5 Intro** | 1:49 | 1:59 | 9.4s | scene5-intro | "…The leading use case: M&A." **Visual: `convergence_ig.jpeg` full-frame at 0.35 opacity.** |
| **Scene 5** | 1:59 | 2:33 | 33.8s | scene5-all | **Visual: PNG slides (MA.png → combine_fs → qofe2 → ebitda2 → x-sell2 → backoffice2) timed to speech breakpoints from `silencedetect` on scene5-all Matilda MP3 — 12.10 / 15.88 / 20.02 / 27.10 / 29.85.** |
| **Scene 6** | 2:33 | 3:13 | 40.7s | scene6-deploy | "Four reasons…" walks through all 4 boxes. **Visual: static `days.png`.** |
| **Scene 7** | 3:13 | 3:24 | 7.4s + 3.0s hold | scene7-closing | "…find us at autonomous dot tech." **Visual: static `closing-new.png`, with `TAIL_HOLD = 3s` cloned-frame padding.** |

### Iteration workflow

1. Edit a script in `scripts/did-test/avatar-scenes.ts` (single source of truth)
2. Regen Matilda MP3: `npx tsx scripts/did-test/generate-matilda.ts scene2-solution --force`
3. Regen D-ID clip: `npx tsx scripts/did-test/generate-avatar.ts scene2-solution --force`
4. Update `D` map in `src/AvatarDemo.tsx` + `DUR` in `concat-avatar.ts` from MP4 header
5. Rebuild concat: `npx tsx scripts/did-test/concat-avatar.ts`
6. Preview in Remotion Studio → render with `npm run render:both`

### Avatar pipeline files

| File | Purpose |
|---|---|
| `scripts/did-test/avatar-scenes.ts` | 10-clip script source of truth (shared by both generators) |
| `scripts/did-test/generate-matilda.ts` | ElevenLabs Matilda → `public/avatar/audio/*.mp3` |
| `scripts/did-test/generate-avatar.ts` | Uploads MP3s to D-ID `/audios` → audio-driven Lily clips in `public/avatar/*.mp4` |
| `scripts/did-test/concat-avatar.ts` | Concatenates clips into `avatar-combined.mp4` (+ 3s tail hold) |
| `src/AvatarDemo.tsx` | Remotion composition — `D` map is single source of truth, `showAvatar` prop toggles PIP |
| `src/Root.tsx` | Registers both `aos-movie` (no PIP) and `avatar-demo` (PIP) compositions |
| `public/avatar/audio/*.mp3` | Matilda voice tracks (played by `<Audio>` in both variants) |
| `public/avatar/*.mp4` | D-ID audio-driven Lily clips |
| `public/avatar/avatar-combined.mp4` | Concatenated avatar video (muted `OffthreadVideo` PIP source) |

## File Map

| Asset | Used By |
|---|---|
| `public/favicon.png` | Title card + persistent watermark |
| `public/convergence_ig.jpeg` | Scene 5 Intro faded background |
| `public/MA.png` | Scene 5.0 title |
| `public/combine_fs.png` | Scene 5.1 |
| `public/qofe2.png` | Scene 5.2 |
| `public/ebitda2.png` | Scene 5.3 |
| `public/x-sell2.png` | Scene 5.4 |
| `public/backoffice2.png` | Scene 5.5 |
| `public/days.png` | Scene 6 static slide |
| `public/closing-new.png` | Scene 7 static slide |
| `public/scenes/scene{1,2i,2,3a,4}.mp4` | Base video segments for scenes 1–4 |
