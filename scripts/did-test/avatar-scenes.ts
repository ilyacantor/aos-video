/**
 * Shared scene scripts for the avatar pipeline.
 *
 * Single source of truth for both:
 *   - `generate-matilda.ts`  → ElevenLabs Matilda MP3s
 *   - `generate-avatar.ts`   → D-ID audio-driven Lily MP4s
 *
 * Only the 10 group-level clips that AosDemo.tsx consumes are listed.
 * Sub-clips (scene2-discover, scene5-combine, …) were retired when the
 * merged group clips landed.
 */

export type Scene = {
  id: string;
  text: string;
};

export const SCENES: Scene[] = [
  {
    id: "scene0-mai-intro",
    text: "Hi, I'm Mai, I'm the AI agent built into AOS, let me walk you through the platform.",
  },
  {
    id: "scene1-problems",
    text: "For decades, enterprises have poured billions into every version of the same promise — one system of record, one single source of truth, one integration project after another — and the systems still don't understand each other. The average enterprise runs nearly nine hundred applications, each one describing the same business in its own way, none of them adding up to a single coherent picture. Then comes the next wave. AI agents, multiplying by the quarter. An agent without reliable context isn't an asset, it's a liability — automating the wrong answer faster than any human ever could. Orchestration alone doesn't solve it. Without shared context in the data underneath, the agents keep hallucinating — just in better coordination. That's the gap autonomous closes. One unified context across every system.",
  },
  {
    id: "scene2-all",
    text: "And here's how it works. AOS sits on top of everything you already have — no migration, no replatforming. It scans your systems, figures out what the data means — how customers, products, and contracts actually relate — and gives you a context layer your whole organization can use.",
  },
  {
    id: "scene3a-all",
    text: "Each AOS deployment includes an integrated version of me. I'm your concierge agent. I answer questions about your data in plain English, and I can make changes to the platform — simple ones happen instantly, bigger ones need your approval.",
  },
  {
    id: "scene4-knowledgegraph",
    text: "What ties all of this together is the knowledge graph. It's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess.",
  },
  {
    id: "scene5-intro",
    text: "Everything I've shown you so far works for one company. Now let me show you what happens when there are two or more. The leading use case: M&A.",
  },
  {
    id: "scene5-all",
    text: "Here's what we automate. Unified financials. Quality of earnings. Proforma combined earnings. Cross-sell and upsell opportunities. Backoffice overlap.",
  },
  {
    id: "scene6-deploy",
    text: "And the best part: AOS deploys in days, not years. Four reasons. Nothing in your stack changes — no replatforming, no migration. Middleware does the work — your existing integration infrastructure, not hundreds of APIs. A synthetic data farm catches problems before you go live. And I handle the prep myself — discovery, requirements, feasibility — all human supervised.",
  },
  {
    id: "scene7-closing",
    text: "AOS is changing the paradigm of enterprise technology, and how it's deployed. If you want to learn more, find us at autonomous dot tech.",
  },
];
