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
    text: "Most enterprises have spent millions on data infrastructure — warehouses, integration tools, BI layers — and it still doesn't work. Data teams spend up to 80 percent of their time just cleaning and reconciling data before anyone can use it. And while 86 percent of companies are betting on agentic AI this year, only 15 percent have data systems ready to support it. That gap is what AOS closes.",
  },
  {
    id: "scene2-solution",
    text: "AOS is the layer that fixes this. It sits on top of everything you already have — no migration, no replatforming — and gives your whole organization one shared understanding of what's actually going on.",
  },
  {
    id: "scene2-all",
    text: "It starts with discovery. AOS scans your environment and builds a catalog of every system you have — including the ones nobody remembers buying. Then AOS connects to them. Your systems don't change. Your data doesn't move. Our layer sits on top, using the tools you already own — your integration platforms, your APIs, your warehouse. Then it figures out what the data actually means. How customers, products, contracts, and accounts relate to each other — automatically, across every source. And the result is a context layer your whole organization can use.",
  },
  {
    id: "scene3a-all",
    text: "Each AOS deployment includes an integrated version of me. I handle onboarding, training, and configuration, and I answer questions about your data in plain English. You can also ask me to make changes to the platform. Simple things happen instantly. Bigger changes — like adding a new domain to your org — happen with your approval, and I walk you through it.",
  },
  {
    id: "scene4-knowledgegraph",
    text: "The thing that makes all of this work is the knowledge graph. It's a living map of your people, your systems, and how they actually relate to each other. That's the context your agents have been missing. And it's what lets them act instead of guess.",
  },
  {
    id: "scene5-intro",
    text: "Everything I've shown you so far works for one company. Now let me show you what happens when there are two or more. The leading use case: M&A.",
  },
  {
    id: "scene5-all",
    text: "M&A runs on an impossible clock. Two companies, two sets of books, two versions of the truth. Convergence turns weeks of diligence into hours. Here's what we automate. One unified financial picture across both companies. Quality of earnings, automated — every adjustment flagged. Proforma combined earnings, generated in diligence and tracked through close. Cross-sell thesis, validated across both customer books. Backoffice overlap quantified across people and systems.",
  },
  {
    id: "scene6-deploy",
    text: "And the best part: AOS deploys in days, not years. Four reasons. First, nothing in your stack changes. We use the systems already in place — no replatforming, no migration. Second, middleware does the work. We connect through your existing integration infrastructure, not to hundreds of APIs. Third, a synthetic data farm gives us enterprise-scale readiness before deployment, so the common problems are caught before you go live. And fourth, I handle the prep myself. Technical discovery, requirements gathering, integration feasibility — all human supervised.",
  },
  {
    id: "scene7-closing",
    text: "AOS is changing the paradigm of enterprise technology. If you want to learn more, find us at autonomous dot tech.",
  },
];
