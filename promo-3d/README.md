# NextPath promo – Three.js + Remotion + HyperFrames

Pipeline (56 s, 1920x1080, 30 fps):
1. `hf/` (HyperFrames, HTML + GSAP) renders the 2D scenes (old way, logo reveal, why it matters, roadmap)
   cd hf && npx hyperframes render -q standard -o ../remotion/public/hf_2d.mp4
2. `remotion/` (Remotion + @remotion/three + Three.js) renders the 3D network scenes (hook, demo),
   overlays the UI panel, and sequences the HyperFrames clip for scenes 2/3/5/6.
   npx remotion render remotion/src/index.ts NextPathPromo out.mp4 --public-dir=remotion/public

Needs Chrome (`remotion.config.ts` points to /usr/bin/google-chrome; change for your machine) and ffmpeg.

## Narration (ElevenLabs)
Voice: "Marty - Warm, Confident Narrator" (id Z7AcxChWJEFai8hz5vYZ), model eleven_v4.
Final clips live in `remotion/public/narration/` (silence-trimmed, loudness-normalised to -16 LUFS,
some sped up 5-12% to fit their slot); NEPS is written "Neps" in the prompts so it is read as one word. Raw takes are in `narration/takes/`. Timings are in the `VO` list in Promo.tsx.

| Start | Clip | Line |
|------:|------|------|
|  0.50 | vo1_hook     | A fibre cut. A single point of failure. So... where is the next path? |
|  6.30 | vo2_oldway   | Today, there's no reroute function. Find the cable in NEPS, recall routes from memory, check spare cores in FLASH, and repeat. Thirty to sixty minutes, per route. |
| 16.60 | vo3_logo     | This is NextPath. Cut point in. Next path out. |
| 21.70 | vo4_click    | Click a cable on the map to mark the cut point. |
| 24.80 | vo5_affected | NextPath instantly flags every affected system: DWDM, Metro-E, 5G sites, and customer links. |
| 32.50 | vo6_routes   | Then it finds the alternative paths, and ranks the best route first. |
| 37.60 | vo7_ready    | Alternative path, ready. In seconds. |
| 41.15 | vo8_why      | Why it matters. Thirty to sixty minutes, down to seconds. Faster restoration. And 5G sites at risk, right on the map. |
| 49.50 | vo9_next     | Next: live data from NEPS and FLASH. NextPath. Cut point in, next path out. |

## Music & sound effects (ElevenLabs)
- `remotion/public/music/bgm.mp3` – Music v2.5, 57 s instrumental (take `bgm_1`; `bgm_2` kept in `music/takes/`).
  Its lift (17.45 s in the file) is trimmed to land on the logo reveal at 16.58 s (`MUSIC_TRIM`), and
  `musicVolume()` ducks it ~4 dB under each narration line.
- `remotion/public/sfx/*.mp3` – Sound Effects v3, peak-normalised to -3 dBFS (all 4 variations per sound in `sfx/takes/`).
  Cue times and levels are in the `SFX` list in Promo.tsx: fibre cut, whooshes on scene changes, clock ticks,
  UI pops for each list item/card, mouse click, scan sweep, logo hits and a success chime.
