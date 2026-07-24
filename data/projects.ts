export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  role: string;
  year: string;
  description: string;
  detail: string[];
  status: string;
  poster: string;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "omnix-ai",
    index: "01",
    title: "OmniX AI",
    category: "Platform Concept",
    role: "Founder-in-training · Concept & Direction",
    year: "Ongoing",
    description:
      "An idea for an all-in-one AI business platform that brings together creative, marketing and operational tools.",
    detail: [
      "OmniX AI is a concept I keep returning to: a single workspace where a small team — or a single creator — can move from idea to product using AI at every step.",
      "I use it as a sandbox for learning product thinking: mapping user journeys, sketching interfaces, and studying how existing AI tools could be composed into one coherent system.",
      "It is a concept in active exploration, not a launched product — which is exactly what makes it a good teacher.",
    ],
    status: "Concept in exploration",
    poster: "/assets/projects/omnix.svg",
    accent: "#e8813a",
  },
  {
    slug: "bio-nov-digital-experience",
    index: "02",
    title: "BIO N:OV Digital Experience",
    category: "Interactive Web",
    role: "Design & Build",
    year: "2025",
    description:
      "An exploration of immersive product storytelling, scroll-controlled motion and scientific visual design.",
    detail: [
      "A cinematic product website exploring how a wellness brand could present fermentation science through scroll-driven motion, 3D molecular visuals and careful editorial copy.",
      "Built with Next.js and React Three Fiber, it was my first deep dive into treating a website as a directed film rather than a stack of sections.",
      "The lessons from that build — restraint, pacing, verified wording — flowed directly into this portfolio.",
    ],
    status: "Design exploration",
    poster: "/images/bio-nov-hero.jpg",
    accent: "#4a7dbb",
  },
  {
    slug: "travel-stories",
    index: "03",
    title: "Travel Stories",
    category: "Short-form Content",
    role: "Creator · Filming & Edit",
    year: "Ongoing",
    description:
      "Short-form travel and hotel content designed to turn everyday experiences into engaging stories.",
    detail: [
      "Hotels, flights, cities — I film and edit short vertical stories that try to find the cinematic angle in ordinary travel moments.",
      "Each piece is an exercise in pacing, sound and framing: what makes someone stop scrolling, and what makes them feel like they were there.",
      "This is where I practise storytelling fundamentals that later feed every other project.",
    ],
    status: "Ongoing series",
    poster: "/assets/projects/travel.svg",
    accent: "#d9a441",
  },
  {
    slug: "creative-ai-experiments",
    index: "04",
    title: "Creative AI Experiments",
    category: "AI Exploration",
    role: "Direction & Prompt Craft",
    year: "Ongoing",
    description:
      "Experiments with AI video, avatars, cinematic product visuals and interactive web experiences.",
    detail: [
      "A running lab of experiments: AI-generated video sequences, digital avatars, product visualisations and generative imagery for the web.",
      "The goal is fluency — learning what each model is actually good at, where it breaks, and how to direct it with intention instead of luck.",
      "The generation pipeline behind this very website is one of these experiments.",
    ],
    status: "Active lab",
    poster: "/assets/projects/experiments.svg",
    accent: "#aac4d4",
  },
  {
    slug: "feifeitoy",
    index: "05",
    title: "FeiFeiToy",
    category: "Character & Story",
    role: "Concept & World-building",
    year: "Concept",
    description:
      "A motivational character and storytelling concept built around curiosity, courage and imagination.",
    detail: [
      "FeiFeiToy is a character concept — a small companion figure whose stories are about being brave enough to stay curious.",
      "I'm exploring it as a world: character sheets, short story arcs, and how a character brand could live across video, print and product.",
      "It is early, playful and deliberately unfinished.",
    ],
    status: "Early concept",
    poster: "/assets/projects/feifei.svg",
    accent: "#c98a9a",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
