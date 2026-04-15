/**
 * Shared scene scripts for the avatar pipeline.
 *
 * Single source of truth for both:
 *   - `generate-matilda.ts`  → ElevenLabs Matilda MP3s
 *   - `generate-avatar.ts`   → D-ID audio-driven Lily MP4s
 *
 * Only the 10 group-level clips that AvatarDemo.tsx consumes are listed.
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
    text: "Enterprises have spent millions on data infrastructure, and it still doesn't work. Most companies plan to invest in AI, but only a few have the systems to support it. Application sprawl and legacy jail leave a wide gap to a reliable, contextual single source of truth. That's the gap AOS closes.",
  },
  {
    id: "scene2-solution",
    text: "And here's how it works. It sits on top of everything you already have — no migration, no replatforming — and gives your whole organization one shared understanding of what's actually going on.",
  },
  {
    id: "scene2-all",
    text: "It starts with discovery. AOS scans your environment and builds a catalog of every system you have — including the ones nobody remembers buying. Then AOS connects to them. Your systems don't change. Your data doesn't move. Our layer sits on top, using the tools you already own — your integration platforms, your APIs, your warehouse. Then it figures out what the data actually means. How customers, products, contracts, and accounts relate to each other — automatically, across every source. And the result is a context layer your whole organization can use. With real-world context captured in your data, analytics are higher-quality and search results are more relevant.",
  },
  {
    id: "scene3a-all",
    text: "Each AOS deployment includes an integrated version of me. I handle onboarding, training, and configuration, and I answer questions about your data in plain English. I speak fluent spreadsheet, too. You can also ask me to make changes to the platform. Simple things happen instantly. Bigger changes — like adding a new domain to your org — happen with your approval, and I walk you through it.",
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
    text: "Seventy percent of M&A deals fail. The real deal-breakers got lost in execution trivia. Convergence automates comprehension. Surface what should break the deal — before it does. Here's what we automate. One unified financial picture across both companies. Quality of earnings, automated — every adjustment flagged. Proforma combined earnings, generated in diligence and tracked through close. Cross-sell thesis, validated across both customer books. Backoffice overlap quantified across people and systems.",
  },
  {
    id: "scene6-deploy",
    text: "And the best part: AOS deploys in days, not years. Four reasons. First, nothing in your stack changes. We use the systems already in place — no replatforming, no migration. Second, middleware does the work. We connect through your existing integration infrastructure, not to hundreds of APIs. Third, a synthetic data farm gives us enterprise-scale readiness before deployment, so the common problems are caught before you go live. And fourth, I handle the prep myself. Technical discovery, requirements gathering, integration feasibility — all human supervised. No day-one surprises.",
  },
  {
    id: "scene7-closing",
    text: "AOS is changing the paradigm of enterprise technology, and how it's deployed. If you want to learn more, find us at autonomous dot tech.",
  },
];
