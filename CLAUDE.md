# CLAUDE.md — REMOTION/test/my-video

Project rules for any agent (Claude or otherwise) editing this Remotion composition.

## Sacrosanct cut registry

`remotion_cut_registry.md` (repo root) is the single source of truth for every visual cut tied to speech — both code constants in `src/AosDemo.tsx` and base-video hard-cuts in `public/scenes/*.mp4`. The file is **append-only**: entries are marked RETIRED with a date, never deleted.

### Mandatory workflow

1. **Before any audio trim, cut, or re-export:** read `remotion_cut_registry.md` and print every entry whose offset falls inside the edit window, plus the downstream consumer impact (which `Sequence`, slide, or hard-cut depends on it). **No edit executes until that print is done.**

2. **After any audio edit:** re-run `silencedetect` on the changed file and verify every registry entry whose audio matches still resolves to its bound phoneme. Print **pass/fail per entry**. A "pass" means the bound phoneme is still present at a tolerable offset (< 0.15s). A "fail" means the bound phoneme is shifted, removed, or destroyed — in which case revert the audio edit, re-cut the visual, or re-export the base video.

3. **Any new base-video hard-cut or code constant tied to speech** must be appended to `remotion_cut_registry.md` **before the PR is considered done**. New entries record: location, value, audio file, bound phoneme, verification date, status.

4. **`remotion_cut_registry.md` is append-only.** Entries are marked RETIRED, never deleted. The history matters: future audits need to see what was bound to what, and when it stopped being true.

## Preview before render

Edit → Remotion studio (port 3011, hot reload) → user scrubs → only then `npm run render` → publish to `ilyacantor/aos-video`. Never fire `npm run render` immediately after an edit. Renders are slow and the user reviews changes by scrubbing the studio composition. Wait for explicit approval after preview.

## Single sources of truth

- **Clip durations:** `src/AosDemo.tsx` `D` map (lines 27–38) — derived from on-disk MP4/MP3 headers. `scripts/did-test/concat-avatar.ts` re-probes live, never reads a stale constant.
- **Scene scripts:** `scripts/did-test/avatar-scenes.ts` `SCENES` array — consumed by both Matilda TTS and D-ID avatar generation.
- **Cut↔speech bindings:** `remotion_cut_registry.md` (this file's companion).
