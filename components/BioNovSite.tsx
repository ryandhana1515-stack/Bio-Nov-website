"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, Brain, Check, ChevronDown, CircleDot, Dna, Droplets, FlaskConical, Gift, HeartPulse, Leaf, Link2, Megaphone, Menu, Microscope, MousePointerClick, Plus, ShieldPlus, Sparkles, Sun, TrendingUp, Users, Wind, X, Zap } from "lucide-react";

const VesselScene = dynamic(() => import("./VesselScene"), { ssr: false });
import XrayBody, { journeyStages } from "./XrayBody";
import XrayJourney from "./XrayJourney";

const nav = [["Home","home"],["Why Nitric Oxide?","why-no"],["X-Ray Vision","journey"],["Blood Flow","flow"],["See It in 3D","vessels"],["Technology","technology"],["Benefits","benefits"],["Research Team","team"],["Product","product"],["Affiliate","affiliate"],["FAQ","faq"]];

type Detail = { title: string; subtitle?: string; body: string[]; points?: string[] };

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const flowStages = [
  {
    icon: Droplets,
    title: "Blood is the delivery system",
    short: "Every cell you own is served by the same courier.",
    detail: {
      title: "Blood is the delivery system",
      subtitle: "Oxygen, nutrients and signals travel one road",
      body: [
        "Your circulatory system carries oxygen from the lungs and nutrients from the gut to roughly every cell in the body. It also carries away the by-products cells produce while doing their work.",
        "That means circulation is not one system among many — it is the road that every other system depends on. When the road is open, delivery is easy. When the road narrows, every destination downstream waits longer for what it needs."
      ],
      points: [
        "Oxygen delivery to muscle, brain and organ tissue",
        "Nutrient transport from digestion to cells",
        "Removal of metabolic by-products",
        "Distribution of hormones and signalling molecules",
        "Temperature regulation across the body"
      ]
    }
  },
  {
    icon: Wind,
    title: "Nitric oxide opens the road",
    short: "The signal that tells vessels to relax and widen.",
    detail: {
      title: "Nitric oxide opens the road",
      subtitle: "A signalling molecule made by the vessel lining",
      body: [
        "The inner lining of your blood vessels — the endothelium — produces nitric oxide, a short-lived gas that signals the smooth muscle around the vessel to relax. When that muscle relaxes, the vessel widens. This is called vasodilation, and it is one of the body's normal, everyday mechanisms for regulating flow.",
        "A wider, more relaxed vessel moves blood with less resistance. That is why nitric oxide is often described as the body's own circulation signal — it is not adding anything foreign, it is part of how healthy vessels already work."
      ],
      points: [
        "Produced naturally by healthy blood-vessel lining",
        "Signals smooth muscle in the vessel wall to relax",
        "Supports normal vasodilation and healthy flow",
        "Involved in normal cell-to-cell communication",
        "Short-lived — the body regenerates it continuously"
      ]
    }
  },
  {
    icon: Dna,
    title: "Production changes with age",
    short: "The body's own output tends to decline over the decades.",
    detail: {
      title: "Production changes with age",
      subtitle: "Why circulation support becomes a mid-life priority",
      body: [
        "Natural nitric oxide production is generally understood to decline as we age. It is a normal part of the ageing process rather than a disease — but it is one reason many people become more interested in supporting healthy circulation from their forties onward.",
        "This is also why the same habits that felt effortless at 25 — recovery after exercise, steady energy through the afternoon, clear focus late in the day — can start to feel like work later. Supporting the body's normal circulation pathways is a sensible part of a healthy-ageing routine.",
        "This information is educational. It describes normal physiology and does not predict any individual outcome."
      ],
      points: [
        "Natural production is understood to decline with age",
        "A normal ageing change, not a medical diagnosis",
        "Often why circulation becomes a focus after 40",
        "Supported by movement, nutrition and daylight",
        "BIO N:OV is designed to complement — not replace — those habits"
      ]
    }
  },
  {
    icon: Sparkles,
    title: "Smooth flow supports the whole body",
    short: "Energy, recovery, clarity and healthy ageing all ride on it.",
    detail: {
      title: "Smooth flow supports the whole body",
      subtitle: "Why circulation is a whole-system wellness story",
      body: [
        "Because circulation serves every organ, supporting healthy blood flow is a whole-body wellness strategy rather than a single-target one. Muscles that receive oxygen efficiently support stamina. A well-perfused brain supports normal cognitive function. Skin, like every other tissue, depends on the same delivery network.",
        "This is the heart of the BIO N:OV philosophy: rather than chasing one symptom, support the system that serves everything — and let the body do what it is designed to do.",
        "BIO N:OV is a wellness product. It is not a medicine and is not intended to diagnose, treat, cure or prevent any disease."
      ],
      points: [
        "Supports normal energy-related processes",
        "Supports normal cognitive function through healthy perfusion",
        "Supports recovery as part of an active lifestyle",
        "Part of a healthy-ageing routine at any adult age",
        "Complements exercise, balanced nutrition and rest"
      ]
    }
  }
];

const bodySystems: (Detail & { name: string; short: string })[] = [
  {
    name: "Brain",
    short: "Cellular signalling and processes linked with normal cognition.",
    title: "Brain & cognition",
    subtitle: "Perfusion, signalling and mental clarity",
    body: [
      "The brain is one of the most metabolically demanding organs in the body — it consumes a disproportionate share of the oxygen you breathe relative to its weight. That oxygen arrives through blood flow, which is why healthy cerebral perfusion is part of normal cognitive function.",
      "Nitric oxide also participates in normal neuronal signalling. Supporting the body's natural nitric oxide pathways is therefore part of a whole-body approach to cognitive wellness."
    ],
    points: [
      "Brain tissue depends on continuous oxygen delivery",
      "Nitric oxide participates in normal neuronal signalling",
      "Healthy perfusion supports normal focus and mental clarity",
      "Part of a healthy-ageing wellness routine"
    ]
  },
  {
    name: "Heart & circulation",
    short: "Normal vascular signalling that supports circulation.",
    title: "Heart & circulation",
    subtitle: "The pump and the network it serves",
    body: [
      "The heart moves blood; the vessels decide how easily it travels. Nitric oxide signals the smooth muscle in vessel walls to relax, which supports normal vasodilation and healthy flow through the network.",
      "Supporting the body's own circulation signalling is a foundational wellness goal — one that complements, and never replaces, medical care or prescribed medication."
    ],
    points: [
      "Supports normal vasodilation and vessel relaxation",
      "Lower resistance means easier flow through the network",
      "Complements exercise and balanced nutrition",
      "Not a substitute for medical treatment"
    ]
  },
  {
    name: "Muscles & energy",
    short: "Oxygen delivery underpins stamina and recovery.",
    title: "Muscles & everyday energy",
    subtitle: "Where oxygen delivery becomes stamina",
    body: [
      "Working muscle needs oxygen, and it needs it delivered continuously. Efficient blood flow to muscle tissue is part of how the body sustains activity and recovers afterwards.",
      "Many people describe their interest in circulation support in exactly these terms: wanting the energy for a full day and the recovery to do it again tomorrow."
    ],
    points: [
      "Supports normal energy-related processes",
      "Oxygen delivery underpins stamina during activity",
      "Supports recovery as part of an active lifestyle",
      "Works alongside regular physical activity"
    ]
  },
  {
    name: "Immune system",
    short: "Signalling involved in normal immune responses.",
    title: "Immune function",
    subtitle: "Circulation as the immune system's transport network",
    body: [
      "Immune cells travel through the bloodstream. Healthy circulation is therefore part of how the body's normal defences move to where they are needed.",
      "Nitric oxide is also involved in normal immune signalling pathways — one more reason it is described as a whole-system molecule rather than a single-purpose one."
    ],
    points: [
      "Immune cells are transported via the bloodstream",
      "Nitric oxide participates in normal immune signalling",
      "Helps support the body's natural defences",
      "Part of a balanced wellness routine"
    ]
  },
  {
    name: "Digestive system",
    short: "Cell communication within normal digestive physiology.",
    title: "Digestive wellness",
    subtitle: "Absorption depends on blood supply too",
    body: [
      "Nutrients absorbed through the gut enter the bloodstream to reach the rest of the body. Healthy blood supply to digestive tissue is part of normal digestive physiology.",
      "Nitric oxide participates in signalling within the digestive tract as part of these normal processes."
    ],
    points: [
      "Nutrient absorption feeds directly into circulation",
      "Blood supply supports normal digestive tissue function",
      "Nitric oxide participates in normal gut signalling",
      "Supports a whole-body wellness approach"
    ]
  },
  {
    name: "Skin & healthy ageing",
    short: "Skin is served by the same delivery network as everything else.",
    title: "Skin & healthy ageing",
    subtitle: "The visible edge of your circulation",
    body: [
      "Skin is the body's largest organ and, like every other tissue, it is fed by blood flow. Supporting healthy circulation is part of a whole-body routine that includes skin wellness.",
      "BIO N:OV is presented as everyday wellness support for adults at any age — it makes no cosmetic or anti-disease claim."
    ],
    points: [
      "Skin tissue is served by the same circulatory network",
      "Supports a whole-body wellness routine",
      "Suitable as part of an adult healthy-ageing routine",
      "No cosmetic or medical claim is made"
    ]
  }
];

const pillars: (Detail & { name: string; short: string; Icon: typeof HeartPulse })[] = [
  {
    name: "Circulatory Wellness",
    short: "Designed to support normal blood-vessel function as part of everyday wellbeing.",
    Icon: HeartPulse,
    title: "Circulatory Wellness",
    subtitle: "The foundation everything else is built on",
    body: [
      "BIO N:OV is formulated around the body's own nitric oxide pathways — the signalling system that supports normal vessel relaxation and healthy flow.",
      "Because circulation serves every organ, this is the pillar the other four depend on. Support the road, and delivery to every destination gets easier."
    ],
    points: [
      "Supports normal vasodilation signalling",
      "Fermentation-derived, no enzyme conversion step required",
      "Designed for daily, long-term use",
      "Complements exercise and balanced nutrition"
    ]
  },
  {
    name: "Metabolic Wellness",
    short: "A wellness-focused formula intended to complement balanced nutrition and healthy routines.",
    Icon: Activity,
    title: "Metabolic Wellness",
    subtitle: "Supporting the body's normal processing of fuel",
    body: [
      "Metabolism is the set of normal processes by which your body converts what you eat into what you use. Those processes depend on nutrients and oxygen arriving where they are needed — which brings circulation back into the picture.",
      "BIO N:OV is intended to complement balanced nutrition and healthy daily routines, not to replace them."
    ],
    points: [
      "Supports normal metabolic processes as part of a balanced routine",
      "Complements — never replaces — balanced nutrition",
      "Naturally derived fermented plant ingredients",
      "Convenient daily format: one tablet, three times a day"
    ]
  },
  {
    name: "Everyday Vitality",
    short: "Supports an active lifestyle and the body's normal energy-related processes.",
    Icon: Zap,
    title: "Everyday Vitality",
    subtitle: "Energy for the day you actually have",
    body: [
      "Energy is not a single thing the body stores — it is the outcome of oxygen and nutrients reaching working tissue efficiently. That is why circulation and vitality are so closely linked in wellness thinking.",
      "BIO N:OV is designed for people who want to support their natural energy as part of an active lifestyle."
    ],
    points: [
      "Supports the body's normal energy-related processes",
      "Designed for an active adult lifestyle",
      "Supports recovery alongside regular movement",
      "Taken daily as a routine, not as a stimulant"
    ]
  },
  {
    name: "Healthy Ageing",
    short: "Created for everyday wellness habits throughout adulthood.",
    Icon: Dna,
    title: "Healthy Ageing",
    subtitle: "Why the forties are the turning point for so many people",
    body: [
      "Natural nitric oxide production is generally understood to decline with age. That is a normal life-course change — and it is the single most common reason people begin looking at circulation support in mid-life.",
      "BIO N:OV is positioned as an everyday wellness habit for adults, designed to be gentle enough for long-term daily use."
    ],
    points: [
      "Natural production is understood to decline with age",
      "Formulated for gentle, long-term daily use",
      "A habit, not a quick fix",
      "Fits alongside movement, nutrition and daylight exposure"
    ]
  },
  {
    name: "Skin Wellness",
    short: "Helps support a whole-body wellness routine that includes healthy skin care.",
    Icon: Sparkles,
    title: "Skin Wellness",
    subtitle: "Whole-body wellness includes your largest organ",
    body: [
      "Skin depends on the same circulatory delivery network as every other tissue in the body. Supporting healthy circulation is therefore part of a complete wellness routine that includes skin care.",
      "No cosmetic claim is made. BIO N:OV supports whole-body wellness; visible skin care remains the job of your skincare routine, sun protection and hydration."
    ],
    points: [
      "Skin is served by the same delivery network",
      "Part of a complete whole-body wellness routine",
      "No cosmetic or medical claim is made",
      "Best combined with sun protection and hydration"
    ]
  }
];

const generations: (Detail & { gen: string; label: string; headline: string })[] = [
  {
    gen: "01",
    label: "First Generation",
    headline: "Arginine-Based Formulas",
    title: "First generation — arginine-based",
    subtitle: "The original approach to nitric oxide support",
    body: [
      "The first generation of nitric oxide supplements used amino-acid precursors such as arginine. The body must convert these precursors through an enzyme-dependent pathway before nitric oxide becomes available.",
      "That extra conversion step is the defining characteristic of this generation, and it is the constraint later generations set out to work around."
    ],
    points: [
      "Uses amino-acid precursors",
      "Depends on an enzyme conversion step in the body",
      "The longest-established approach on the market"
    ]
  },
  {
    gen: "02",
    label: "Second Generation",
    headline: "Vegetable & Fruit Extracts",
    title: "Second generation — plant extracts",
    subtitle: "Whole-food derived nitrate sources",
    body: [
      "The second generation turned to concentrated vegetable and fruit extracts as naturally derived sources. This approach moved away from isolated amino acids toward whole-plant material.",
      "Formulation and tolerability vary considerably between products in this category, which is one reason the category continued to evolve."
    ],
    points: [
      "Naturally derived from vegetable and fruit sources",
      "Moves away from isolated amino-acid precursors",
      "Formulation and tolerability vary between products"
    ]
  },
  {
    gen: "03",
    label: "Third Generation",
    headline: "BIO N:OV Microbial Fermentation",
    title: "Third generation — microbial fermentation",
    subtitle: "The BIO N:OV approach",
    body: [
      "BIO N:OV uses a patented microbial fermentation process (strain reference KACC91554P) developed in Korea and manufactured in a GMP-certified facility. Fermentation transforms the plant ingredients before they ever reach you, rather than relying on a conversion step inside the body.",
      "The result is a formulation designed to be gentle enough for everyday, long-term use by adults.",
      "Patent, strain and certification details should be verified against current official documentation before publication in any market."
    ],
    points: [
      "Patented microbial fermentation process (KACC91554P)",
      "GMP-certified Korean manufacturing",
      "Fermented garlic and fermented lettuce extracts, soybean and soybean sprout",
      "Designed for gentle, everyday adult use",
      "Developed with Korean university researchers"
    ]
  }
];

const researchers = [
  {
    name: "Dr. Cheon Hyun Soo",
    org: "SunChon National University",
    role: "Head of BIO N:OV Medical Development & Research Board",
    img: "researcher-cheon.png",
    focus: ["Product development leadership", "Research board oversight", "Formulation science"]
  },
  {
    name: "Prof. Dr. Hyun-Ock Pae",
    org: "Wonkwang University, School of Medicine",
    role: "Research in nitric oxide and metabolites",
    img: "researcher-pae.png",
    focus: ["Nitric oxide biology", "Metabolite research", "Medical school faculty"]
  },
  {
    name: "Ph.D. Min Sun Kim",
    org: "Wonkwang University School of Medicine",
    role: "Research in cardiovascular health",
    img: "researcher-min.png",
    focus: ["Cardiovascular research", "Vascular physiology", "Medical school faculty"]
  },
  {
    name: "Prof. Dr. Yong-Il Shin",
    org: "Pusan National University, School of Medicine",
    role: "Research in neuro-rehabilitation",
    img: "researcher-shin.png",
    focus: ["Neuro-rehabilitation", "Clinical research", "Medical school faculty"]
  },
  {
    name: "Dr. Ju Sung-Min",
    org: "Center of TKM, Wonkwang University",
    role: "Research in nitric oxide and physiological systems",
    img: "researcher-ju.png",
    focus: ["Nitric oxide pathways", "Physiological systems", "Traditional Korean medicine research"]
  },
  {
    name: "Ass. Prof. A-Lum Han",
    org: "University Hospital of Wonkwang",
    role: "Research in metabolic health and clinical nutrition",
    img: "researcher-han.png",
    focus: ["Metabolic health", "Clinical nutrition", "Hospital-based research"]
  },
  {
    name: "Prof. Dr. Kim Jong-Suk",
    org: "Jeonbuk National University Medical School",
    role: "Research in nitric oxide and body metabolism",
    img: "researcher-kim.png",
    focus: ["Nitric oxide research", "Body metabolism", "Medical school faculty"]
  },
  {
    name: "Dr. Sooah Kim",
    org: "College of Medical Science, Jeonju University",
    role: "Research in regenerative medicine and food application",
    img: "researcher-sooah.png",
    focus: ["Regenerative medicine", "Food science application", "Medical science faculty"]
  }
];

const ingredients: (Detail & { name: string; short: string; img?: string })[] = [
  {
    name: "Fermented Garlic Extract",
    short: "A traditional botanical, transformed by patented fermentation.",
    img: "garlic-product.jpg",
    title: "Fermented Garlic Extract",
    subtitle: "One of the most studied botanicals in the world, fermented",
    body: [
      "Garlic has one of the longest histories of any wellness botanical. In BIO N:OV it is not used raw — it is put through a controlled microbial fermentation process before it is formulated.",
      "Fermentation is a transformation step: microorganisms act on the plant material, changing its composition before it reaches the finished tablet."
    ],
    points: [
      "Naturally derived plant ingredient",
      "Processed through controlled microbial fermentation",
      "A featured ingredient in the BIO N:OV formulation",
      "Confirm the full authorised ingredient list on the market label"
    ]
  },
  {
    name: "Fermented Lettuce Extract",
    short: "An unexpected hero — leafy green material, fermented.",
    img: "lettuce-product.jpg",
    title: "Fermented Lettuce Extract",
    subtitle: "Leafy greens, reimagined through fermentation",
    body: [
      "Leafy green vegetables are a familiar part of a circulation-friendly diet. BIO N:OV features lettuce extract that has been through the same controlled fermentation process as the garlic component.",
      "The fermentation concept is central to the product's third-generation positioning."
    ],
    points: [
      "Leafy plant material, naturally derived",
      "Processed through controlled microbial fermentation",
      "Part of the third-generation formulation approach",
      "Confirm the full authorised ingredient list on the market label"
    ]
  },
  {
    name: "Soybean & Soybean Sprout",
    short: "Staples of Korean nutrition forming the formulation base.",
    title: "Soybean & Soybean Sprout",
    subtitle: "Foundational plant nutrition from the Korean tradition",
    body: [
      "Soybean and soybean sprout are staples of Korean nutrition and form part of the BIO N:OV formulation base alongside the fermented extracts.",
      "As with every ingredient, the complete authorised formula and exact ingredient naming should be confirmed against the approved market label."
    ],
    points: [
      "Plant-protein staples of Korean nutrition",
      "Part of the BIO N:OV formulation base",
      "Naturally derived",
      "Contains soy — check the label if you have a soy allergy"
    ]
  }
];

/* Six biological roles — each opens a full explanation on click. */
const noRoles: (Detail & { name: string; short: string; Icon: typeof Droplets })[] = [
  {
    name: "Circulation",
    short: "The signal that tells your vessels to open.",
    Icon: Droplets,
    title: "Circulation",
    subtitle: "Nitric oxide is the body's own vasodilation signal",
    body: [
      "Your blood vessels are lined with a single layer of cells called the endothelium. This lining continuously produces nitric oxide, which diffuses into the smooth muscle wrapped around the vessel and tells it to relax. A relaxed vessel is a wider vessel, and a wider vessel carries blood with less resistance.",
      "This is why nitric oxide was such a significant discovery in vascular physiology — it explained how the body regulates its own blood flow from moment to moment, second by second, without conscious effort.",
      "Every other role on this page ultimately traces back to this one. Circulation is the delivery network; nitric oxide helps keep it open."
    ],
    points: [
      "Produced continuously by the healthy endothelium",
      "Signals vessel smooth muscle to relax (vasodilation)",
      "Wider vessels move blood with less resistance",
      "Regulated moment to moment as your needs change",
      "The foundation the other five roles depend on"
    ]
  },
  {
    name: "Vitality & Energy",
    short: "Oxygen delivered efficiently is what energy feels like.",
    Icon: Zap,
    title: "Vitality & Energy",
    subtitle: "Why circulation and energy are the same conversation",
    body: [
      "Energy is not something the body keeps in a tank. It is produced continuously inside your cells, in mitochondria, and that process needs a steady supply of oxygen and nutrients. Both arrive by blood.",
      "This is why efficient circulation and the feeling of having energy are so tightly linked. When working muscle receives oxygen readily, it can sustain effort and recover afterwards. Nitric oxide's role in vasodilation is part of how the body matches blood supply to demand — including during exercise, when muscle needs far more than at rest.",
      "BIO N:OV is designed to support the body's normal energy-related processes as part of an active lifestyle. It is not a stimulant and contains no caffeine."
    ],
    points: [
      "Cellular energy production requires continuous oxygen",
      "Blood flow matches supply to demand during activity",
      "Supports stamina and recovery as part of an active lifestyle",
      "Not a stimulant — no caffeine, no jitters",
      "Works alongside regular movement, not instead of it"
    ]
  },
  {
    name: "Cognition & Clarity",
    short: "Your brain is the hungriest organ you own.",
    Icon: Brain,
    title: "Cognition & Clarity",
    subtitle: "The brain takes a disproportionate share of your blood supply",
    body: [
      "The brain accounts for roughly 2% of body weight but consumes around 20% of the oxygen you breathe. It has almost no capacity to store fuel, which means it depends on blood arriving continuously — a supply interruption is felt in seconds, not minutes.",
      "Nitric oxide participates in this in two ways. It helps regulate cerebral blood flow, directing supply to the regions currently working hardest. It also acts as a neurotransmitter in its own right, participating in normal signalling between neurons.",
      "Supporting healthy circulation is therefore part of a whole-body approach to cognitive wellness — the same reason cardiovascular health and brain health are so often discussed together."
    ],
    points: [
      "~2% of body weight, ~20% of oxygen consumption",
      "Almost no stored fuel — depends on continuous supply",
      "Nitric oxide helps regulate cerebral blood flow",
      "Also acts as a signalling molecule between neurons",
      "Supports normal focus and mental clarity"
    ]
  },
  {
    name: "Metabolic Support",
    short: "Nutrients are useless until they arrive.",
    Icon: Activity,
    title: "Metabolic Support",
    subtitle: "Delivery is the step between eating well and feeling well",
    body: [
      "Metabolism is the set of processes that turn what you eat into what your body uses. It is easy to focus entirely on the input — the quality of the diet — and forget the logistics. Nutrients absorbed through the gut still have to reach the tissues that need them, and they travel by blood.",
      "Nitric oxide participates in how blood is distributed to metabolically active tissue, including skeletal muscle, which is one of the largest sites of glucose uptake in the body.",
      "BIO N:OV is intended to complement balanced nutrition and healthy daily routines — never to replace them, and never as a substitute for medical care or prescribed medication."
    ],
    points: [
      "Nutrient absorption feeds directly into circulation",
      "Blood distribution serves metabolically active tissue",
      "Skeletal muscle is a major site of glucose uptake",
      "Complements balanced nutrition, does not replace it",
      "Not a substitute for medical treatment"
    ]
  },
  {
    name: "Immune Function",
    short: "Your defences travel by bloodstream.",
    Icon: ShieldPlus,
    title: "Immune Function",
    subtitle: "Circulation is the immune system's transport network",
    body: [
      "Immune cells are not stationed permanently where they are needed — they patrol, and they travel through the bloodstream and lymphatic system to reach tissue that requires them. Healthy circulation is part of how that patrol operates efficiently.",
      "Nitric oxide has a second role here: immune cells themselves produce it as part of normal immune signalling. It is one of the molecules the body uses in its own defensive processes.",
      "This is educational information about normal immune physiology. BIO N:OV is a wellness product intended to help support the body's natural defences — it does not prevent, treat or cure any illness or infection."
    ],
    points: [
      "Immune cells patrol via the bloodstream and lymphatics",
      "Healthy circulation supports efficient transport",
      "Immune cells produce nitric oxide themselves",
      "Part of normal immune signalling pathways",
      "Supports natural defences — does not prevent illness"
    ]
  },
  {
    name: "Healthy Ageing",
    short: "Production falls with each decade. That is the whole story.",
    Icon: Dna,
    title: "Healthy Ageing",
    subtitle: "Why this becomes a mid-life priority for so many people",
    body: [
      "Here is the part that makes everything else on this page personal. Natural nitric oxide production is widely understood to decline as we age. The endothelium becomes less efficient at producing it, and the decline is generally described as beginning surprisingly early — in the twenties and thirties — and becoming more noticeable from the forties onward.",
      "This is normal ageing, not a disease. But it helps explain something people describe to us constantly: that the recovery, stamina and clarity that once felt automatic start to feel like work. When the signal that keeps your delivery network open becomes weaker, everything downstream is served a little less readily.",
      "That is the gap BIO N:OV was formulated to support — daily, gently, for the long term, through fermented plant ingredients rather than an enzyme conversion step inside the body."
    ],
    points: [
      "Natural production declines with age — normal, not a diagnosis",
      "Decline typically described as starting in the 20s-30s",
      "Becomes more noticeable from the 40s onward",
      "Explains why stamina and recovery change over time",
      "BIO N:OV supports this pathway for long-term daily use",
      "Always consult your healthcare professional about your own health"
    ]
  }
];

/* Decade-by-decade context for the interactive decline strip. */
const decades = [
  {
    label: "20s",
    headline: "Peak output",
    text: "Nitric oxide production is typically at its highest. Recovery after exertion feels quick and mostly automatic — most people never think about their circulation at this age."
  },
  {
    label: "30s",
    headline: "The quiet decline begins",
    text: "Natural production is generally described as already easing downward. The change is subtle and usually goes unnoticed, which is exactly why it is worth understanding early."
  },
  {
    label: "40s",
    headline: "You start to notice",
    text: "This is the decade when most people first describe a difference — recovery takes longer, afternoon energy dips, focus takes more effort. It is also when interest in circulation support typically begins."
  },
  {
    label: "50s",
    headline: "Support becomes a routine",
    text: "Healthy circulation habits — movement, balanced nutrition, daylight, and targeted support — become a deliberate daily practice rather than something taken for granted."
  },
  {
    label: "60+",
    headline: "Consistency matters most",
    text: "The value is in the routine rather than any single dose. Gentle, long-term daily support is the approach BIO N:OV was formulated for — alongside, never instead of, medical care."
  }
];

const researchAreas = [
  {
    Icon: Microscope,
    title: "A Nobel-recognised molecule",
    text: "Nitric oxide's role as a signalling molecule in the cardiovascular system was recognised with the 1998 Nobel Prize in Physiology or Medicine. It moved from obscurity to one of the most studied molecules in vascular biology."
  },
  {
    Icon: FlaskConical,
    title: "Patented fermentation process",
    text: "BIO N:OV uses a microbial fermentation process with strain reference KACC91554P, developed in Korea and manufactured in a GMP-certified facility. Patent and certification documentation should be verified for each market."
  },
  {
    Icon: Users,
    title: "Developed with university researchers",
    text: "The formulation was developed with researchers from Korean universities and medical schools across nitric oxide biology, cardiovascular research, metabolism and regenerative medicine."
  }
];

const vesselDetail: Detail = {
  title: "What you just watched",
  subtitle: "The mechanism behind the model",
  body: [
    "Blood vessels are not rigid pipes. They are living tubes wrapped in smooth muscle, and that muscle is constantly being told how much to relax or tighten. The molecule doing most of that telling is nitric oxide, produced by the endothelium — the single-cell lining on the inside of every vessel you own.",
    "When nitric oxide signalling is working well, the muscle relaxes, the vessel widens, and blood moves with less resistance. That is the 'relaxed' state in the model. When the vessel stays constricted, the same volume of blood has to squeeze through a smaller opening — so it moves more slowly, and everything downstream is served more slowly too.",
    "Natural nitric oxide production is generally understood to decline with age. That is the gap BIO N:OV is formulated to support — through fermented plant ingredients rather than an enzyme conversion step inside your body."
  ],
  points: [
    "The endothelium produces nitric oxide naturally",
    "Nitric oxide signals vessel smooth muscle to relax",
    "Relaxed vessels move blood with less resistance",
    "Natural production is understood to decline with age",
    "BIO N:OV supports this pathway with fermented botanicals",
    "Educational model — not a depiction of product performance"
  ]
};

const affiliatePerks = [
  { Icon: TrendingUp, title: "Earn on every sale", text: "Competitive commission on every order that comes through your unique link — tracked automatically, paid on schedule." },
  { Icon: Link2, title: "Your own referral link", text: "Get a personal link and coupon code the moment you're approved. Share it anywhere you already talk to people." },
  { Icon: Megaphone, title: "Content, ready to go", text: "Product photos, videos, approved claims and campaign briefs in a shared media library. No guesswork." },
  { Icon: Gift, title: "Try it yourself first", text: "Selected creators receive product to try before promoting. We'd rather you speak from experience." }
];


/* Anatomical label shown over the 3D body when a role is selected. */
const hotspotLabels: Record<string, string> = {
  "Circulation": "Heart · the pump",
  "Cognition & Clarity": "Brain · ~20% of your oxygen",
  "Immune Function": "Chest · immune transport",
  "Metabolic Support": "Core · nutrient delivery",
  "Vitality & Energy": "Muscle · oxygen to work",
  "Healthy Ageing": "Whole body · every tissue"
};
function bodyHotspotLabel(key: string) {
  return hotspotLabels[key] ?? key;
}

/* ------------------------------------------------------------------ *
 * UI primitives
 * ------------------------------------------------------------------ */

function Modal({ detail, onClose }: { detail: Detail | null; onClose: () => void }) {
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [detail, onClose]);

  return (
    <AnimatePresence>
      {detail && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={detail.title}
            initial={{ opacity: 0, y: 60, scale: .9, rotateX: -14 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 34, scale: .94, rotateX: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, mass: .9 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
            {detail.subtitle && <span className="eyebrow">{detail.subtitle}</span>}
            <h3>{detail.title}</h3>
            {detail.body.map(p => <p key={p.slice(0, 24)}>{p}</p>)}
            {detail.points && (
              <ul className="modal-points">
                {detail.points.map(pt => <li key={pt}><Check size={16} /><span>{pt}</span></li>)}
              </ul>
            )}
            <button className="button primary modal-cta" onClick={onClose}>Got it</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reveal({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: .7, ease: [.2,.8,.2,1] }}
    >
      {children}
    </motion.section>
  );
}

function Heading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className="heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={light ? "text-white" : ""}>{title}</h2>
      {copy && <p className={light ? "text-blue-100" : ""}>{copy}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function BioNovSite({ faq }: { faq: { question: string; answer: string }[] }) {
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [modal, setModal] = useState<Detail | null>(null);
  const [activeSystem, setActiveSystem] = useState(0);
  const [vesselOpen, setVesselOpen] = useState(true);
  const [activeDecade, setActiveDecade] = useState(2);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll();
  const productY = useTransform(scrollYProgress, [0, .35], [0, 80]);

  return (
    <main className="overflow-hidden">
      <Modal detail={modal} onClose={() => setModal(null)} />

      <header className="nav-shell">
        <a href="#home" className="brand" aria-label="BIO N:OV home"><span className="brand-mark">V</span><span>BIO N:OV</span></a>
        <nav className="desktop-nav">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <a className="nav-cta" href="#contact">Contact us <ArrowRight size={15} /></a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Open navigation">{menu ? <X /> : <Menu />}</button>
        {menu && <div className="mobile-nav">{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</div>}
      </header>

      {/* ---------------- Hero ---------------- */}
      <section id="home" className="hero">
        <div className="orb orb-a" /><div className="orb orb-b" />
        <div className="hero-copy">
          <span className="hero-kicker"><CircleDot size={14} /> Third-generation fermentation science</span>
          <h1>BIO N:OV</h1>
          <h2>Clearing the Way<br />to <span>Optimum Health</span></h2>
          <p>When blood flows freely, everything downstream works better. BIO N:OV is a next-generation wellness formula built on patented microbial fermentation, designed to support your body&rsquo;s natural nitric oxide pathways &mdash; the signal that helps blood vessels relax.</p>
          <div className="hero-actions">
            <a className="button primary" href="#product">Discover BIO N:OV <ArrowRight size={18} /></a>
            <a className="button glass" href="#flow">Why blood flow matters</a>
          </div>
          <div className="hero-badges">
            <span><ShieldPlus size={15} /> GMP-Certified Korea</span>
            <span><FlaskConical size={15} /> Patented Fermentation</span>
            <span><Leaf size={15} /> Naturally Derived</span>
          </div>
          <small>Information on this website is for educational purposes only and is not intended to diagnose, treat, cure or prevent any disease.</small>
        </div>
        <motion.div className="hero-product" style={{ y: productY }} whileHover={{ rotateY: 5, rotateX: -2 }}>
          <div className="product-halo" />
          <video
            className="hero-video"
            poster="/video/bio-nov-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="BIO N:OV product animation showing the box, tablets and a nitric oxide molecular visualisation"
          >
            <source src="/video/bio-nov-hero.mp4" type="video/mp4" />
          </video>
          {/* Shown instead of the video when the visitor prefers reduced motion */}
          <img
            className="hero-poster-fallback"
            src="/video/bio-nov-hero-poster.jpg"
            alt="BIO N:OV product box, blister pack and tablets"
            width={1280}
            height={720}
          />
        </motion.div>
        <a href="#why-no" className="scroll-cue">Scroll to discover <ChevronDown /></a>
      </section>

      {/* ---------------- Why nitric oxide ---------------- */}
      <Reveal id="why-no" className="molecule-section">
        <div className="molecule-inner">
          <Heading
            light
            eyebrow="X-ray vision"
            title="See It Work Inside Your Body"
            copy="Follow a single tablet from your mouth to every cell you own. Nitric oxide was named Molecule of the Year in 1992 and won a Nobel Prize in 1998 — yet most people have never heard of the signal keeping their blood vessels open."
          />

          <div className="molecule-grid">
            <div className="body-canvas">
              <XrayBody stage={stage} onStage={setStage} />
            </div>

            <div className="no-roles">
              <div className="journey-panel">
                <span className="journey-stage-no">Stage {String(stage + 1).padStart(2, "0")} &mdash; {journeyStages[stage].label}</span>
                <h3>{journeyStages[stage].title}</h3>
                <p>{journeyStages[stage].text}</p>
                <div className="journey-nav">
                  <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={stage === 0}>&larr; Back</button>
                  <button
                    className="is-next"
                    onClick={() => setStage(stage < journeyStages.length - 1 ? stage + 1 : 0)}
                  >
                    {stage < journeyStages.length - 1 ? "Follow it further \u2192" : "Watch again \u21ba"}
                  </button>
                </div>
              </div>

              <p className="click-prompt light"><MousePointerClick size={17} /> Hover to light up the body &middot; click for the full science</p>
              {noRoles.map(role => (
                <motion.button
                  whileHover={{ x: 6 }}
                  className={`no-role-card ${activeRole === role.name ? "is-active" : ""}`}
                  key={role.name}
                  onMouseEnter={() => setActiveRole(role.name)}
                  onFocus={() => setActiveRole(role.name)}
                  onClick={() => { setActiveRole(role.name); setModal(role); }}
                  aria-label={`Read more about ${role.name}`}
                >
                  <span className="no-role-icon"><role.Icon /></span>
                  <div>
                    <b>{role.name}</b>
                    <small>{role.short}</small>
                  </div>
                  <Plus size={18} className="row-plus" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* ---- The decline story ---- */}
          <div className="decline-block">
            <div className="decline-head">
              <span className="eyebrow">The part that makes it personal</span>
              <h3>Your body makes less of it every decade</h3>
              <p>
                This is the single most important thing to understand about nitric oxide: your natural production
                declines as you age. It is normal ageing, not a diagnosis &mdash; but it explains why the energy,
                recovery and clarity that once felt automatic start to feel like work.
              </p>
              <p className="click-prompt light" style={{ marginTop: 6 }}>
                <MousePointerClick size={17} /> Select your decade
              </p>
            </div>

            <div className="decade-strip" role="tablist" aria-label="Nitric oxide production by decade">
              {decades.map((d, i) => (
                <button
                  key={d.label}
                  role="tab"
                  aria-selected={activeDecade === i}
                  className={`decade-pill ${activeDecade === i ? "active" : ""}`}
                  onClick={() => setActiveDecade(i)}
                >
                  <span className="decade-bar" style={{ height: `${100 - i * 17}%` }} />
                  <b>{d.label}</b>
                </button>
              ))}
            </div>

            <motion.div
              key={activeDecade}
              className="decade-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span>{decades[activeDecade].label}</span>
              <h4>{decades[activeDecade].headline}</h4>
              <p>{decades[activeDecade].text}</p>
            </motion.div>
          </div>

          {/* ---- Research credibility ---- */}
          <div className="research-strip">
            {researchAreas.map(r => (
              <div className="research-note" key={r.title}>
                <r.Icon />
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </div>
            ))}
          </div>

          <div className="molecule-cta">
            <p>Now see what that actually looks like inside a blood vessel &mdash; in 3D.</p>
            <a className="button primary" href="#vessels">Show me the 3D model <ArrowRight size={18} /></a>
          </div>

          <div className="source-note dark">
            Educational information about normal human physiology. Statements describe the role of nitric oxide in the
            body generally, not measured outcomes of this product. BIO N:OV is not intended to diagnose, treat, cure or
            prevent any disease. Primary references to be added following regulatory review in each market.
          </div>
        </div>
      </Reveal>

      {/* ---------------- Scroll-scrubbed X-ray journey ---------------- */}
      <XrayJourney />

      {/* ---------------- Blood flow story (NEW) ---------------- */}
      <Reveal id="flow" className="flow-section">
        <div className="flow-inner">
          <Heading
            light
            eyebrow="The story that matters most"
            title="Everything Your Body Does Depends on Flow"
            copy="Blood carries oxygen and nutrients to every cell you own. When flow is easy, the whole system is served. When flow becomes harder, every destination waits longer. This is why BIO N:OV starts with circulation — not with symptoms."
          />

          <p className="click-prompt light"><MousePointerClick size={17} /> Click any stage below to read the full explanation</p>

          <div className="flow-track">
            {flowStages.map((stage, i) => (
              <motion.button
                key={stage.title}
                className="flow-card"
                whileHover={{ y: -8 }}
                onClick={() => setModal(stage.detail)}
                aria-label={`Read more about ${stage.title}`}
              >
                <span className="flow-step">{String(i + 1).padStart(2, "0")}</span>
                <stage.icon />
                <h3>{stage.title}</h3>
                <p>{stage.short}</p>
                <span className="learn-more">Read the detail <Plus size={15} /></span>
              </motion.button>
            ))}
          </div>

          <div className="flow-statement">
            <p>
              <b>The simple version:</b> blood is the delivery system, nitric oxide is the signal that opens the road,
              and your natural production of that signal is understood to decline with age. BIO N:OV exists to support
              that pathway &mdash; every single day, gently, for the long run.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Age chart ---------------- */}
      <Reveal className="section age dark-age" id="science">
        <Heading
          eyebrow="A natural life-course change"
          title="Nitric Oxide Production Changes with Age"
          copy="Natural nitric oxide production is generally understood to decline as we age. This illustration is educational and does not predict an individual outcome."
        />
        <div className="chart">
          <svg viewBox="0 0 1000 320" role="img" aria-label="Illustrative declining trend from the twenties to age sixty plus">
            <defs><linearGradient id="line" x1="0" x2="1"><stop stopColor="#12bdf3" /><stop offset=".55" stopColor="#7367ec" /><stop offset="1" stopColor="#f24ea6" /></linearGradient></defs>
            <motion.path d="M70 62 C 245 70, 310 98, 410 124 S 620 182, 720 215 S 870 258, 940 266" fill="none" stroke="url(#line)" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
            {[70, 270, 470, 670, 870].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy={[62, 92, 140, 198, 250][i]} r="12" fill="#fff" stroke="#206ddd" strokeWidth="6" />
                <text x={x} y="305" textAnchor="middle">{["20s", "30s", "40s", "50s", "60+"][i]}</text>
              </g>
            ))}
          </svg>
        </div>
      </Reveal>

      {/* ---------------- Body atlas (now clickable with detail) ---------------- */}
      <Reveal className="body-section">
        <div className="body-copy">
          <Heading light eyebrow="Interactive body atlas" title="One Signal. Many Biological Roles." copy="Select any system to read how circulation and nitric oxide participate in its normal function." />
          <div className="body-list">
            {bodySystems.map((sys, i) => (
              <motion.button
                whileHover={{ x: 6 }}
                key={sys.name}
                className={activeSystem === i ? "is-active" : ""}
                onClick={() => { setActiveSystem(i); setModal(sys); }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{sys.name}</b>
                  <small>{sys.short}</small>
                </div>
                <Plus size={18} className="row-plus" />
              </motion.button>
            ))}
          </div>
        </div>
        <div className="body-visual">
          <Image src="/images/body-systems.png" alt="Medical illustration of body systems" width={1920} height={1080} />
          <div className="scanline" />
        </div>
      </Reveal>

      {/* ---------------- Lifestyle ---------------- */}
      <Reveal className="section">
        <Heading
          eyebrow="Everyday foundations"
          title="Supporting Your Body's Natural Nitric Oxide Pathways"
          copy="BIO N:OV is designed as a convenient wellness product. It does not replace exercise, a balanced diet or medical care."
        />
        <div className="lifestyle-path">
          {[["Regular physical activity", "Movement supports overall cardiovascular wellbeing.", Activity], ["Balanced nutrition", "A varied diet provides nutrients for normal body functions.", Leaf], ["Healthy sunlight exposure", "Appropriate daylight supports normal daily rhythms.", Sun]].map(([a, b, Icon]) => {
            const I = Icon as typeof Activity;
            return (
              <div className="lifestyle" key={a as string}>
                <I /><h3>{a as string}</h3><p>{b as string}</p>
              </div>
            );
          })}
          <div className="path-line" />
          <div className="product-node"><span>V</span><b>BIO N:OV</b><small>Convenient daily support</small></div>
        </div>
      </Reveal>

      {/* ---------------- Technology (clickable) ---------------- */}
      <Reveal id="technology" className="section tech">
        <Heading
          eyebrow="Evolution of formulation"
          title="Three Generations of Nitric Oxide Science"
          copy="Click any generation to read how the approaches differ. Comparative performance claims are intentionally excluded pending approved evidence."
        />
        <p className="click-prompt"><MousePointerClick size={17} /> Click any generation to compare them in detail</p>
        <div className="timeline">
          {generations.map((g, i) => (
            <motion.button
              whileHover={{ y: -8 }}
              className={`timeline-card ${i === 2 ? "active" : ""}`}
              key={g.gen}
              onClick={() => setModal(g)}
              aria-label={`Read more about ${g.label}`}
            >
              <span>{g.gen}</span>
              {i === 2 ? <FlaskConical /> : <Microscope />}
              <h3>{g.label}</h3>
              <p>{g.headline}</p>
              <span className="learn-more">Read the detail <Plus size={15} /></span>
              {i === 2 && <div className="bubbles">{[1, 2, 3, 4, 5].map(n => <i key={n} />)}</div>}
            </motion.button>
          ))}
        </div>
        <div className="tech-note"><Check /> BIO N:OV uses a patented fermentation-based approach with naturally derived ingredients.</div>
      </Reveal>

      {/* ---------------- Ingredients (clickable) ---------------- */}
      <Reveal className="ingredients section">
        <Heading
          eyebrow="Premium raw materials"
          title="Naturally Derived. Thoughtfully Fermented."
          copy="Click any ingredient for the full story. Confirm the complete authorised formula and exact ingredient naming on the market label."
        />
        <p className="click-prompt"><MousePointerClick size={17} /> Click any ingredient for the full story</p>
        <div className="ingredient-grid">
          {ingredients.map((ing, i) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              key={ing.name}
              className={ing.img ? "" : "ingredient-brand"}
              onClick={() => setModal(ing)}
              aria-label={`Read more about ${ing.name}`}
            >
              {ing.img
                ? <Image src={`/images/${ing.img}`} alt={`${ing.name} and BIO N:OV product imagery`} fill sizes="(max-width: 800px) 100vw, 40vw" />
                : <FlaskConical />}
              <div>
                <span>Fermented ingredient {String(i + 1).padStart(2, "0")}</span>
                <h3>{ing.name}</h3>
                <p>{ing.short}</p>
                <span className="learn-more">Read the detail <Plus size={15} /></span>
              </div>
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Pillars (clickable) ---------------- */}
      <Reveal id="benefits" className="section">
        <Heading eyebrow="Five wellness pillars" title="Wellbeing, Viewed as a Whole" copy="Every pillar traces back to the same foundation: healthy flow. Click any pillar to read more." />
        <p className="click-prompt"><MousePointerClick size={17} /> Click any pillar to read the full explanation</p>
        <div className="pillars">
          {pillars.map(p => (
            <motion.button whileHover={{ y: -8 }} key={p.name} onClick={() => setModal(p)} aria-label={`Read more about ${p.name}`}>
              <p.Icon />
              <h3>{p.name}</h3>
              <p>{p.short}</p>
              <span className="learn-more">Learn more <ArrowRight size={15} /></span>
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Interactive 3D vessel ---------------- */}
      <Reveal id="vessels" className="vessel-section">
        <Heading
          light
          eyebrow="See it for yourself — in 3D"
          title="Narrow Road. Open Road."
          copy="This is the difference everyone talks about but almost nobody sees. Press the buttons below and watch what happens to the blood cells when a vessel is constricted versus relaxed."
        />

        <div className="vessel-3d-wrap">
          <div className="vessel-canvas">
            <VesselScene open={vesselOpen} />
            <div className={`vessel-stateplate ${vesselOpen ? "is-open" : "is-narrow"}`}>
              <span>{vesselOpen ? "RELAXED VESSEL" : "CONSTRICTED VESSEL"}</span>
              <b>{vesselOpen ? "Smooth, unrestricted flow" : "Slower, crowded flow"}</b>
            </div>
          </div>

          <div className="vessel-controls">
            <p className="vessel-prompt"><MousePointerClick size={17} /> Click a state to switch the 3D model</p>
            <button className={`vessel-toggle ${!vesselOpen ? "active" : ""}`} onClick={() => setVesselOpen(false)}>
              <span className="dot narrow" />
              <div>
                <b>Constricted</b>
                <small>Vessel narrowed &mdash; cells crowd together and slow down. Every organ downstream waits longer for oxygen.</small>
              </div>
            </button>
            <button className={`vessel-toggle ${vesselOpen ? "active" : ""}`} onClick={() => setVesselOpen(true)}>
              <span className="dot open" />
              <div>
                <b>Relaxed &mdash; the nitric oxide signal</b>
                <small>Nitric oxide signals the vessel wall to relax. The road opens, cells spread out and flow freely.</small>
              </div>
            </button>

            <button className="button primary vessel-cta" onClick={() => setModal(vesselDetail)}>
              Read how this works <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <p className="vessel-note">Educational 3D visual model illustrating normal vascular physiology. Not a depiction of measured product performance. Individual results vary.</p>
      </Reveal>

      {/* ---------------- Conversion band ---------------- */}
      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <span className="eyebrow">Ready when you are</span>
            <h2>Support your circulation, starting today</h2>
            <p>One box is a 20-day supply. Third-generation Korean fermentation science, GMP-certified, shipped worldwide.</p>
          </div>
          <div className="cta-band__actions">
            <a className="button primary" href="#product">Buy BIO N:OV now <ArrowRight size={18} /></a>
            <a className="button glass" href="#affiliate">Earn with us &mdash; become an affiliate</a>
          </div>
        </div>
      </section>

      {/* ---------------- Research team (brighter + clickable) ---------------- */}
      <Reveal id="team" className="section team">
        <div className="team-aurora" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <div className="team-inner">
        <Heading
          eyebrow="People behind the science"
          title="Science & Research Team"
          copy="BIO N:OV was developed with researchers from Korean universities and medical schools — eight specialists across nitric oxide biology, cardiovascular research, metabolism and regenerative medicine."
        />
        <p className="click-prompt"><MousePointerClick size={17} /> Click any researcher to open their full profile</p>
        <div className="research-grid">
          {researchers.map(r => (
            <motion.button
              whileHover={{ y: -8 }}
              key={r.name}
              onClick={() => setModal({
                title: r.name,
                subtitle: r.org,
                body: [r.role, "Professional titles, affiliations and research information are transcribed from the supplied product presentation and require verification and written permission before public use."],
                points: r.focus
              })}
              aria-label={`Read more about ${r.name}`}
            >
              <div className="research-photo">
                <Image src={`/images/${r.img}`} alt={`Portrait of ${r.name}`} width={320} height={320} />
              </div>
              <div className="research-body">
                <h3>{r.name}</h3>
                <span>{r.org}</span>
                <p>{r.role}</p>
                <span className="learn-more">View profile <Plus size={15} /></span>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="warning">Professional titles, affiliations, portraits and research information must be verified and permission obtained before publication.</div>
        </div>
      </Reveal>

      {/* ---------------- Product ---------------- */}
      <Reveal id="product" className="product-section">
        <div className="showcase">
          <motion.div className="showcase-image" animate={{ y: [0, -10, 0], rotateY: [-3, 3, -3] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <Image src="/images/product-showcase.jpg" alt="BIO N:OV package, blister and tablet presentation" width={1920} height={1080} />
          </motion.div>
          <div className="showcase-copy">
            <span className="eyebrow">Product showcase</span>
            <h2>BIO N:OV</h2>
            <div className="specs"><span>500 mg × 60 tablets</span><span>30 g</span><span>20-day supply</span></div>
            <div className="tabs">
              {["Product Overview", "Ingredients", "Technology", "How to Use", "Safety Information"].map((x, i) => (
                <button className={tab === i ? "active" : ""} onClick={() => setTab(i)} key={x}>{x}</button>
              ))}
            </div>
            <div className="tab-content">
              {[
                "A fermentation-based wellness product designed to support your body's natural nitric oxide pathways — the signalling system behind healthy circulation.",
                "Featured ingredients include fermented garlic extract, fermented lettuce extract, soybean and soybean sprout. Verify the complete authorised ingredient list on the market label.",
                "Third-generation microbial fermentation technology (strain reference KACC91554P), manufactured in a GMP-certified Korean facility. Patent, strain and certification details require verification.",
                "The standard suggestion is one 500 mg tablet, three times per day, with water — one box is a 20-day supply. Use only according to the authorised product label.",
                "Consult a qualified healthcare professional if you are pregnant, nursing, taking medication or managing a medical condition. Do not use this product as a substitute for medical treatment."
              ][tab]}
            </div>
            <a className="button primary" href="#contact">Request product information <ArrowRight /></a>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Testimonials ---------------- */}
      <Reveal className="section">
        <Heading eyebrow="Experience framework" title="Stories Shared with Care" />
        <div className="testimonial">
          <div className="quote">&ldquo;</div>
          <p>Sample testimonial layout &mdash; replace with verified, consented customer reviews before publication.</p>
          <div className="dots"><i /><i /><i /></div>
        </div>
      </Reveal>

      {/* ---------------- Affiliate & creator program ---------------- */}
      <Reveal id="affiliate" className="affiliate-section">
        <div className="affiliate-inner">
          <Heading
            light
            eyebrow="Partner with us"
            title="Join the BIO N:OV Affiliate & Creator Program"
            copy="A science revolution spreads because people talk about it. If you have an audience that cares about healthy ageing, energy and circulation — we'd like you to earn from sharing it."
          />

          <div className="affiliate-grid">
            {affiliatePerks.map(perk => (
              <div className="affiliate-card" key={perk.title}>
                <perk.Icon />
                <h3>{perk.title}</h3>
                <p>{perk.text}</p>
              </div>
            ))}
          </div>

          <div className="affiliate-steps">
            {[
              ["Apply", "Fill in the short application — it takes two minutes."],
              ["Get approved", "We review and send your unique link, coupon code and dashboard access."],
              ["Share & earn", "Post, recommend, refer. Track every click and commission in real time."]
            ].map(([t, d], i) => (
              <div key={t}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{t}</b>
                <small>{d}</small>
              </div>
            ))}
          </div>

          <div className="affiliate-cta">
            <a className="button primary big" href="#contact">Click here to join as an affiliate <ArrowRight size={19} /></a>
            <a className="button glass" href="#contact">Apply as a content creator</a>
          </div>
          <p className="affiliate-note">
            Affiliates must follow our marketing guidelines: disclose partnerships (#ad), use only approved product claims,
            and never make medical or disease-treatment claims. Commission rates, cookie window and payout terms are set out
            in the program terms you receive on approval.
          </p>
        </div>
      </Reveal>

      {/* ---------------- FAQ ---------------- */}
      <Reveal id="faq" className="section faq">
        <Heading eyebrow="Clear answers" title="Frequently Asked Questions" />
        <div className="faq-list">
          {faq.map((x, i) => (
            <article key={x.question}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                <span>{x.question}</span>
                <ChevronDown className={openFaq === i ? "rotate" : ""} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    {x.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Contact ---------------- */}
      <Reveal id="contact" className="contact">
        <div>
          <Heading light eyebrow="Start a conversation" title="Contact the BIO N:OV Team" copy="Use this form for distributor, product or scientific enquiries. Official contact details should be added before launch." />
          <div className="contact-placeholder">
            <p><span>Official distributor</span>To be confirmed</p>
            <p><span>Email</span>To be confirmed</p>
            <p><span>Phone</span>To be confirmed</p>
            <p><span>Business address</span>To be confirmed</p>
          </div>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-grid">
            <label>Full name<input required placeholder="Your name" /></label>
            <label>Email<input type="email" required placeholder="name@example.com" /></label>
            <label>Phone<input type="tel" placeholder="Country code + number" /></label>
            <label>Country<input placeholder="Your country" /></label>
          </div>
          <label>Product enquiry
            <select defaultValue="">
              <option value="" disabled>Select an enquiry</option>
              <option>Product information</option>
              <option>Distribution</option>
              <option>Science and research</option>
              <option>Other</option>
            </select>
          </label>
          <label>Message<textarea rows={5} placeholder="How can we help?" /></label>
          <label className="consent"><input type="checkbox" required /> I consent to the processing of my information for this enquiry.</label>
          <button className="button primary">Send enquiry <ArrowRight /></button>
        </form>
      </Reveal>

      <div className="sticky-cta">
        <div className="sticky-cta__inner">
          <div className="sticky-cta__text">
            <b>BIO N:OV</b>
            <small>500 mg × 60 tablets · 20-day supply</small>
          </div>
          <div className="sticky-cta__actions">
            <a className="button primary" href="#product">Buy now <ArrowRight size={16} /></a>
            <a className="button glass" href="#affiliate">Become an affiliate</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-top">
          <div>
            <a href="#home" className="brand"><span className="brand-mark">V</span><span>BIO N:OV</span></a>
            <p>Clearing the Way to Optimum Health</p>
          </div>
          <div><b>Explore</b>{nav.slice(1, 6).map(([a, b]) => <a href={`#${b}`} key={b}>{a}</a>)}</div>
          <div><b>Earn With Us</b><a href="#affiliate">Affiliate Program</a><a href="#affiliate">Creator Program</a><a href="#contact">Wholesale Enquiry</a><a href="#contact">Contact Us</a></div>
          <div><b>Information</b><a href="#product">Product</a><a href="#faq">FAQ</a><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a><a href="#">Cookie Policy</a></div>
          <div><b>Contact</b><span>Official details to be confirmed</span><span>Social links to be confirmed</span></div>
        </div>
        <div className="medical-disclaimer">This website provides general educational and product information only. It is not intended as medical advice, diagnosis or treatment. BIO N:OV is not intended to diagnose, treat, cure or prevent any disease. Results may vary. Always follow the authorised product label and consult a qualified healthcare professional when appropriate.</div>
        <div className="copyright">© {new Date().getFullYear()} BIO N:OV. All rights reserved. Website content requires regulatory approval before publication.</div>
      </footer>
    </main>
  );
}
