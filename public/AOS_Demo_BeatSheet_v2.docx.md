  
**AOS DEMO**

End-to-End Beat Sheet — Remotion Build

2:00 runtime  |  4 beats  |  v2 — visual mapping locked

**Structure**

Four beats. No narration — text overlays and the product UI carry it. Music underneath (ambient, not corporate). The demo should feel like watching someone competent work, not like being sold to.

| BEAT | TIMING | JOB | VISUAL |
| :---- | :---- | :---- | :---- |
| **1\. The Stakes** | 0:00–0:30 | Establish the problem as a fact about the world. | **None. Text only on dark.** |
| **2\. The Engine** | 0:30–1:15 | Show the mechanism — what AOS is and does. | **A1 pipeline \+ A2 tab bar \+ A3 cross-sell** |
| **3\. The Peak** | 1:15–1:45 | One deep capability proving domain mastery. | **A2 EBITDA Bridge, full screen** |
| **4\. The Close** | 1:45–2:00 | Land the takeaway. End clean. | **A4 logo SVG. Text only.** |

**Asset Manifest**

Five assets. CC needs these before starting the Remotion build.

| \# | ASSET | SOURCE | USED IN | FORMAT |
| :---- | :---- | :---- | :---- | :---- |
| **A1** | **Pipeline diagram** | Corp deck slide 7 — full 5-stage 'How autonomOS Works' flow | Beat 2A (0:30–0:50) | PNG, high-res |
| **A2** | **EBITDA Bridge** | Corp deck slide 18 — NLQ Reports view with tab bar \+ bridge table \+ confidence badges | Beat 2B (tab bar) \+ Beat 3 (full screen peak) | PNG, high-res |
| **A3** | **Cross-sell table** | Corp deck slide 15 — $273M pipeline, scoring, expanded rationale | Beat 2C (1:05–1:12) | PNG, high-res |
| **A4** | **Logo** | Brand asset — 'autonym' white \+ 'OS' teal | Beat 4 (1:50–2:00) | SVG |
| **A5** | **QoE tab (alt)** | Corp deck slide 19 — sustainability score \+ adjustment lifecycle | Beat 3 alternate | PNG, high-res |

  **0:00 – 0:30  —  THE STAKES**

30 seconds. No product. No logo. Dark screen, statements appear one at a time.

**ASSET → None. Text-only beat. No screenshots.**

**ON-SCREEN TEXT — SEQUENCE**

**The average enterprise runs 900+ applications.**

**\[VISUAL\]** *White text on dark (\#2D3142). Left-justified, large (48–56px). Fade+translateY entrance. Holds 3s.*

**71% are disconnected.**

**\[VISUAL\]** *Appears below first line. Same treatment. Holds 2s.*

**95% of IT leaders say integration is the \#1 barrier to AI adoption.**

**\[VISUAL\]** *Third line appears. All three visible together. Hold full frame 3s.*

*Pivot — shift from stats to meaning.*

**Enterprise data gets more fragmented every year.**

**\[VISUAL\]** *Previous three lines fade out (300ms). New statement, centered, slightly larger. The emotional turn. Holds 3s.*

**Context is the missing layer.**

**\[VISUAL\]** *Replaces previous. Teal (\#2BBDB6) on 'Context'. Holds 2s.*

*Bridge to the product —*

**AOS builds it in days.**

**\[VISUAL\]** *autonomOS logo fades into lower-left at \~30% opacity. Hold 3s. Transition to Beat 2\.*

**CC DIRECTION:** spring() for text entrances: damping 20, stiffness 120\. fade+translateY(20px→0) over 400ms. Dark bg \#2D3142 throughout. Font: Inter 600 for statements, 400 for stats. Max-width 900px, left-aligned, \~80px left padding.

**WHY:** *Primacy effect: first information anchors all subsequent evaluation. These facts are inarguable. The viewer maps them to their own org without being told to.*

  **0:30 – 1:15  —  THE ENGINE**

45 seconds. Three visual phases. The viewer should understand: AOS is a semantic abstraction layer that connects to existing systems and makes enterprise data contextually queryable.

**PHASE 2A — PIPELINE DIAGRAM (0:30–0:50)**

**ASSET → A1: Corp deck slide 7 — 'How autonomOS Works' pipeline diagram**

The five-stage pipeline is the mental model. Show it as a spatial object, then walk through each stage with a traveling teal highlight.

**A lightweight semantic layer that floats on top of the enterprise.**

**\[VISUAL\]** *Text overlay on dark, holds 2s alone. Then A1 emerges behind/below — entering from bottom with 3D perspective.*

**CC DIRECTION:** A1 entrance: translateY(100px→0) \+ opacity(0→1) over 800ms. Settled state: perspective(1200px) rotateX(8deg) rotateY(-4deg). box-shadow: 0 20px 60px rgba(0,0,0,0.4).

Traveling highlight — teal glow moves across A1, pausing on each stage:

**Discover.**

**\[VISUAL\]** *Teal glow on AOD (Stage 2). 2s.*

*Finds every system. Classifies what it finds.*

**Connect.**

**\[VISUAL\]** *Glow shifts to AAM (Stage 3). 2s.*

*Maps how systems talk to each other. Builds the connection graph.*

**Resolve.**

**\[VISUAL\]** *Glow shifts to DCL (Stage 4). 3s. This is the core.*

*Maps raw fields to business meaning. Confidence-scored. Full provenance.*

**Ask.**

**\[VISUAL\]** *Glow shifts to NLQ (Stage 5). 2s.*

*Plain-language query against resolved, sourced data.*

**CC DIRECTION:** Glow: teal (\#2BBDB6) rounded rect at \~20% opacity, 12px blur, positioned absolutely over each stage area on A1. Animate position with interpolate(). Stage label: 32px Inter 600 top-left. Sub-caption: 18px Inter 400 bottom-center, \#999. Each fades in/out with the glow.

**PHASE 2B — TAB BAR BREADTH (0:50–1:05)**

**ASSET → A2: Corp deck slide 18 — EBITDA Bridge (used here for the tab bar; reused full-screen in Beat 3\)**

A1 recedes (scale to 0.85, rotateX to 12deg, pushed back in z). A2 enters from the right, angled, overlapping A1. The viewer is NOT reading the EBITDA data yet — the eye catches the tab bar: Income Statement, Balance Sheet, Cash Flow, Reconciliation, Combining, Overlap, Cross-Sell, EBITDA Bridge, What-If, QoE, Dashboards.

**\[VISUAL\]** *A2 enters: translateX(200px→0) \+ opacity(0→1), rotateY(-6deg) rotateX(4deg). Overlaps A1 by \~30% on the right. Holds 5s.*

**CC DIRECTION:** The tab bar IS the breadth signal. 10+ report types visible without narration. Optional: subtle teal underline traces across the tab labels left→right over 3s. Only if it reads cleanly at render resolution. If not, skip. The screenshot does the work.

**Connects to any existing system. No rip-and-replace.**

**\[VISUAL\]** *Text overlay in clear space to the left of the screenshots, or bottom-left. White on semi-transparent dark backing. Holds 3s.*

**PHASE 2C — CROSS-SELL DEPTH (1:05–1:12)**

**ASSET → A3: Corp deck slide 15 — Cross-sell pipeline, scoring table, expanded rationale**

Third card enters. The 'iceberg depth' moment — three overlapping surfaces, each showing different analytical capability. A3 enters from the left, angled opposite to A2.

**\[VISUAL\]** *A3 enters: translateX(-200px→0) \+ opacity(0→1), rotateY(6deg) rotateX(4deg). Overlaps A2 by \~20% on the left. Holds 4s.*

**CC DIRECTION:** Three-card composition: documents fanned on a desk. Z-ordering via translateZ — A1 at \-40px (back), A2 at 0px (middle-right), A3 at 40px (front-left). Ensemble holds 2s before transition begins. All three then fade together into Beat 3\.

**WHY:** *Cognitive load management: the pipeline (2A) gave the viewer a 5-stage mental model. The floating screenshots (2B, 2C) show breadth without explaining each one. The tab bar on A2 implies 10+ capabilities without a word said. The 7±2 rule working in the demo's favor.*

  **1:15 – 1:45  —  THE PEAK**

30 seconds. One screenshot. Full screen. The moment the viewer will remember.

**ASSET → A2: Corp deck slide 18 — EBITDA Bridge (now full screen, straightened, scaled up)**

**TRANSITION**

A3 and A1 fade out. A2 (already visible from 2B) moves to center, straightens, scales to fill the frame. Same screenshot, now commanding full attention.

**\[VISUAL\]** *A2: rotateX(4deg→0) rotateY(-6deg→0) scale(0.7→1.0) translateX(offset→0). 1.2s, ease-out. Shadow softens from dramatic angled to subtle (0 8px 30px rgba(0,0,0,0.2)). Slight remaining rotateX(1deg) preserves spatial feel.*

**CC DIRECTION:** interpolate() with Easing.out(Easing.cubic). The straightening should feel like someone placing a document squarely in front of the viewer.

**TEXT OVERLAYS ON A2**

**Reported EBITDA to proforma.**

**\[VISUAL\]** *Top-left above screenshot content. White, subtle text-shadow. 3s.*

**Entity-tagged. Confidence-scored. Built from the data.**

**\[VISUAL\]** *Second line below first. 4s.*

**Not a template. Not a guess.**

**\[VISUAL\]** *Third line. Teal on both 'Not' words. 4s.*

**DETAIL ZOOM**

While third overlay holds, slow zoom into the adjustment rows — individual lines, HIGH/MEDIUM confidence badges, expanded run-rate item showing range ($28M–$28M), category, supporting evidence.

**\[VISUAL\]** *Scale 1.0→1.15 over 6s. transform-origin: \~50% 65% (center of adjustment table, not top of screenshot). Linear easing — feels like leaning in.*

**CC DIRECTION:** No easing on the zoom — linear feels more natural for slow movement. The data IS the demo here. The more the viewer looks, the more real detail they find.

**ALTERNATE PEAK — QOE (PE/DILIGENCE AUDIENCE)**

**ASSET → A5 (swap): Corp deck slide 19 — QoE sustainability score \+ adjustment lifecycle**

Same choreography as above. Different overlays:

**Quality of Earnings. Automated.**

**Sustainability scored. Adjustments tracked across the deal lifecycle.**

**Every item sourced. Every change versioned.**

QoE shows sustainability score (79/100, Grade B) and status columns (active/resolved/new/changed) — implies a living process, not a static report. Stronger for PE audiences who have sat through QoE processes.

**WHY:** *Peak moment: research shows experience is judged by peak intensity and ending. This screenshot chosen for usefulness, not flash. A domain expert recognizes immediately what this output costs manually. Confidence scores and entity tags are proof of substance.*

  **1:45 – 2:00  —  THE CLOSE**

15 seconds. Clean exit. No feature recap. No CTA.

**ASSET → A4: autonomOS logo, SVG**

**TRANSITION**

**\[VISUAL\]** *A2 (zoomed from Beat 3\) scales back and fades. Dark background returns. 2s transition.*

**CLOSING SEQUENCE**

**Deployed in days.**

**\[VISUAL\]** *Center-screen. Inter 600, 40px. Fade+translateY entrance. 2s.*

**Enterprise context that adapts as the business changes.**

**\[VISUAL\]** *Replaces previous. Same position. 3s.*

**\[VISUAL\]** *Text fades. A4 logo resolves center-screen. Opacity 0→1 over 600ms. No translation — appears in place.*

**The platform is built and running.**

**\[VISUAL\]** *Below logo. Smaller (24px Inter 400, \#999). Holds with logo 5s. Both fade to black over 1s.*

**CC DIRECTION:** Logo must not animate with fanfare. It resolves — opacity only. Closing text 400ms after logo reaches full opacity. Music at its most present here, fades with visual. Last frame: pure \#2D3142 for 0.5s minimum.

**WHY:** *Peak-end rule: final impression carries disproportionate weight. 'The platform is built and running' counters remaining skepticism. Last thing in working memory.*

**Production Notes**

**MUSIC**

Ambient, not corporate. No synth-pad-over-piano. Tycho / Boards of Canada territory. Low in Beat 1 (quiet, heavy). Builds through Beat 2 (momentum). Peaks with Beat 3 (arriving somewhere). Resolves in Beat 4 (confident, not triumphant). Artlist or Epidemic Sound.

**TYPOGRAPHY**

Inter or system sans-serif. 600 for statements, 400 for supporting text. Teal (\#2BBDB6) accent on specific words only. White on dark for all overlays. Never all-caps on screen.

**COLOR**

Dark: \#2D3142. Teal: \#2BBDB6. Text: \#FFFFFF primary, \#999999 captions. Product screenshots bring their own dark UI palette. No additional colors.

**RESOLUTION**

1920×1080, 30fps. Screenshots at native resolution or higher. If exporting from Slides/PDF, use 2x–3x export and downscale in Remotion. The Beat 3 slow zoom is unforgiving of low-res source.

**PACING RULE**

Every text overlay: minimum 2s after fully appearing. Every screenshot: minimum 3s after reaching final position. If editing feels slow, cut content. Never speed up transitions.

**3D TRANSFORM VOCABULARY**

All screenshots share: perspective(1200px) base, rotateX 4–12deg range, rotateY \-6 to 6deg range, translateZ for layering. Shadows scale with tilt. Consistency makes 3D feel like an environment, not a gimmick.

**ITERATION PATH**

v2 \= scaffold with visuals locked. Next: (1) First render — refine overlay pacing. (2) Swap peak for audience (A2 default, A5 for PE). (3) Optional NLQ query-answer moment between 2C and 3 if runtime allows. (4) Music selection \+ sync. (5) Final text polish.

**WHAT THIS DEMO IS NOT**

Not a feature tour. Not a narrated walkthrough. Not a sizzle reel. Not a product demo with mouse cursors. It is a 2-minute proof of depth. The viewer leaves thinking 'that is a real system with serious domain intelligence' and wanting to see it live. The hunger is the goal.