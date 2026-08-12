"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, Brain, Check, ChevronDown, CircleDot, Dna, Droplets, FlaskConical, Gift, HeartPulse, Leaf, Link2, Megaphone, Menu, Microscope, MousePointerClick, Plus, ShieldCheck, ShieldPlus, Sparkles, Sun, Timer, TrendingUp, Users, Globe, Volume2, VolumeX, Wind, X, Zap } from "lucide-react";

import XrayJourney from "./XrayJourney";
import { allLocales, englishLocale, localeGroups, includedLanguages, type Locale } from "./i18n";

const nav = [["Home","home"],["Why Nitric Oxide?","why-no"],["The Crisis","crisis"],["Inside The Body","journey"],["Blood Flow","vessels"],["Technology","technology"],["Benefits","benefits"],["Research Team","team"],["Product","product"],["Affiliate","affiliate"],["FAQ","faq"]];

/* "BIO N:OV" is a product name, not a phrase. Left alone, the translator turns
   it into things like 生物学编号：OV — "biology number: OV". Every render path
   that can contain it runs through this so the token is marked notranslate. */
const BRAND = "BIO N:OV";
function brandSafe(text: string) {
  if (!text.includes(BRAND)) return text;
  return text.split(BRAND).flatMap((part, i) =>
    i === 0
      ? [part]
      : [<span className="notranslate" translate="no" key={i}>{BRAND}</span>, part]
  );
}

type Detail = { title: string; subtitle?: string; body: string[]; points?: string[]; img?: string; imgAlt?: string };

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

/* The brochure panels are JPEGs with their text baked into the pixels, so no
   translator can reach them — a Thai or Arabic visitor still met English.
   These rebuild the figure-heavy ones in markup: same numbers, same sources,
   but every word is a real text node the page translator can reach. */
type StatPanelData = {
  eyebrow: string;
  title: string;
  accent: string;
  lead?: string;
  stats: { value: string; unit?: string; label: string }[];
  notes?: string[];
  source: string;
  tone?: "alert" | "brand";
  /** The original brochure slide this panel was rebuilt from, shown beneath it. */
  slide?: string;
};

type ItemPanelData = {
  eyebrow: string;
  title: string;
  accent: string;
  lead?: string;
  bars?: { label: string; value: string; caption: string }[];
  items: { img?: string; label: string; heading?: string; points: string[]; bad?: boolean }[];
  columns?: 2 | 3 | 4;
  notes?: string[];
  source: string;
  /** The original brochure slide this panel was rebuilt from, shown beneath it. */
  slide?: string;
};

const itemPanels: Record<string, ItemPanelData> = {
  rawMaterials: {
    slide: "slide-raw-materials.jpg",
    eyebrow: "Premium raw materials",
    title: "Four materials, and what each one",
    accent: "contributes",
    lead: "Nothing exotic. This is food, fermented. Confirm the complete authorised formula against the market label for your country.",
    columns: 4,
    items: [
      { img: "ingredient-lettuce.jpg", label: "Lettuce",
        points: ["Vitamin A, vitamin B, amino acids", "Stated to help prevent skin ageing problems"] },
      { img: "ingredient-garlic.jpg", label: "Garlic",
        points: ["Listed as a top 10 superfood", "Allicin promotes anticancer substances and metabolism"] },
      { img: "ingredient-sprouts.jpg", label: "Soybean sprouts",
        points: ["β-carotene and vitamin C", "Stated to remove active acids to improve immunity"] },
      { img: "ingredient-soybean.jpg", label: "Soybean",
        points: ["Various vitamins, minerals and fibres", "Stated to help prevent arteriosclerosis and reduce cholesterol"] }
    ],
    source: "Manufacturer product documentation"
  },
  patents: {
    slide: "slide-fermentation-patents.jpg",
    eyebrow: "Exclusive proprietary microbial strain",
    title: "The part you can verify on",
    accent: "paper",
    lead: "BIO N:OV is developed from a proprietary microbial strain, KACC91554P, owned by the Korea Research Institute of Bioscience and Biotechnology. It is a fermented composition of natural vegetables and herbs.",
    columns: 4,
    items: [
      { img: "cert-cn-patent.jpg", label: "Patent certificate", points: ["China"] },
      { img: "cert-kr-patent.jpg", label: "Patent certificate", points: ["Korea"] },
      { img: "cert-us-patent.jpg", label: "Patent certificate", points: ["United States"] },
      { img: "cert-gmp.jpg", label: "GMP certificate", points: ["Ministry of Food and Drug Safety"] }
    ],
    source: "Manufacturer product documentation"
  },
  techRoadmap: {
    slide: "slide-tech-roadmap.jpg",
    eyebrow: "Nitric oxide supplements",
    title: "Three generations, and what was wrong with the first",
    accent: "two",
    columns: 3,
    items: [
      { label: "1st generation", heading: "Arginine", bad: true,
        points: ["Enzyme needed, and unstable", "Prohibited for heart disease patients"] },
      { label: "2nd generation", heading: "Vegetable & fruit extracts", bad: true,
        points: ["Side effects: nausea, diarrhoea, headache", "Not suitable for the over-40s"] },
      { label: "3rd generation", heading: "BIO N:OV — microbial fermentation",
        points: ["Stated 40–400% more effective than other competition", "No enzyme conversion needed inside your body"] }
    ],
    notes: ["Comparative figure as published by the manufacturer."],
    source: "Manufacturer product documentation"
  },
  bloodPressure: {
    slide: "slide-blood-pressure.jpg",
    eyebrow: "Balancing blood pressure",
    title: "What the decades do to an",
    accent: "artery",
    lead: "Nitric oxide production falls with age, and the artery changes with it. The manufacturer puts the whole arc at 85% of production capability lost across a lifetime.",
    bars: [
      { label: "20s", value: "100%", caption: "Healthy, open vessel" },
      { label: "30s", value: "80%",  caption: "Arterial thickening begins" },
      { label: "40s", value: "50%",  caption: "Inflammation clumped" },
      { label: "50s", value: "35%",  caption: "Atherosclerosis" },
      { label: "60+", value: "15%",  caption: "Vessel ruptured" }
    ],
    columns: 2,
    items: [
      { label: "Vessel with sufficient NO", points: ["Relaxed", "Broad", "Smooth"] },
      { label: "Vessel with less NO", bad: true, points: ["Stiff", "Stuck", "Slow running"] }
    ],
    source: "Dr. Nathan Bryan, Functional Nitric Oxide Nutrition"
  },
  vesselRepair: {
    slide: "slide-vessel-repair.jpg",
    eyebrow: "Repairing blood vessels",
    title: "Stroke and heart disease both start",
    accent: "here",
    lead: "Stroke is caused by poor elasticity of blood vessels, or by blocked blood flow. Heart disease follows the same road.",
    columns: 2,
    items: [
      { label: "Blocked vessel", bad: true,
        points: ["Plaque narrows the channel", "Blood crawls past the blockage", "Stroke and heart disease risk"] },
      { label: "Open vessel",
        points: ["Elasticity recovered", "Nitric oxide present in the flow", "Oxygen reaches every cell"] }
    ],
    notes: ["BIO N:OV is stated to help generate NO, supporting the elasticity of the vessel itself."],
    source: "Manufacturer product documentation"
  }
};

const statPanels: Record<string, StatPanelData> = {
  hypertension: {
    slide: "slide-hypertension.jpg",
    eyebrow: "Hypertension",
    title: "Sowing seeds of",
    accent: "risks",
    lead: "High blood pressure is the leading risk factor for stroke, ischaemic heart disease, other vascular diseases and renal disease.",
    stats: [
      { value: "1.28", unit: "billion", label: "Hypertension patients worldwide" },
      { value: "8.5", unit: "million", label: "Deaths directly linked to hypertension" },
      { value: "80", unit: "%", label: "Of patients fail to control blood pressure" }
    ],
    source: "World Health Organization · UNSW",
    tone: "alert"
  },
  diabetes: {
    slide: "slide-diabetes.jpg",
    eyebrow: "Diabetes",
    title: "Spiralling out of",
    accent: "control",
    lead: "One in ten adults is living with diabetes, and almost half are undiagnosed. It ranks among the top causes of premature death.",
    stats: [
      { value: "537", unit: "million", label: "Adults living with diabetes" },
      { value: "5", unit: "seconds", label: "Between each death from diabetes" },
      { value: "6.7", unit: "million", label: "Deaths in 2021" }
    ],
    source: "International Diabetes Federation",
    tone: "alert"
  },
  stroke: {
    slide: "slide-stroke.jpg",
    eyebrow: "Stroke",
    title: "Weighing down",
    accent: "families",
    lead: "Fifteen million people worldwide suffer a stroke every year, and the burden falls on the whole family rather than the patient alone.",
    stats: [
      { value: "15", unit: "million", label: "Strokes worldwide every year" },
      { value: "6", unit: "million", label: "Deaths" },
      { value: "5", unit: "million", label: "Permanently disabled" },
      { value: "87", unit: "%", label: "Caused by blocked blood flow to the brain" }
    ],
    source: "World Heart Federation · Harvard Health Publishing",
    tone: "alert"
  },
  dementia: {
    slide: "slide-dementia.jpg",
    eyebrow: "Dementia",
    title: "Trapping the",
    accent: "aged",
    lead: "Ten million new cases a year — and the carers pay a price that is rarely counted.",
    stats: [
      { value: "10", unit: "million", label: "New cases per year" },
      { value: "3.2", unit: "seconds", label: "Between each new case" },
      { value: "1 in 3", label: "Seniors die with Alzheimer's or another dementia" },
      { value: "70", unit: "%", label: "Of the expense is borne by families" }
    ],
    notes: ["Carers are twice as likely to be emotionally depressed and physically exhausted."],
    source: "2022 Alzheimer's Association",
    tone: "alert"
  },
  skin: {
    slide: "slide-skin.jpg",
    eyebrow: "Tester-reported results",
    title: "What testers reported about their",
    accent: "skin",
    lead: "Self-reported results from a panel of 100 testers aged 15 to 76. Tester-reported outcomes are not a clinical trial and individual results vary.",
    stats: [
      { value: "78", unit: "%", label: "Feel brighter" },
      { value: "84", unit: "%", label: "Report wrinkles reduce" },
      { value: "68", unit: "%", label: "Report pores shrink" },
      { value: "68", unit: "%", label: "Report less inflammation" }
    ],
    source: "Gregory Chernoff, The Utilization of a Topical Nitric Oxide Generating Serum in Aesthetic Medicine"
  },
  diabetesEase: {
    slide: "slide-diabetes-ease.jpg",
    eyebrow: "Laboratory measurement",
    title: "What the lab measured on",
    accent: "blood sugar",
    lead: "The manufacturer's laboratory reports blood sugar dropping by 8% within one hour, by reducing insulin resistance and slowing digestive enzyme activity after meals.",
    stats: [
      { value: "8", unit: "%", label: "Stated drop in blood sugar" },
      { value: "1", unit: "hour", label: "Stated response window" }
    ],
    notes: ["This laboratory data is not intended or implied to be a substitute for professional medical advice, diagnosis or treatment. BIO N:OV is not a diabetes treatment and must never replace prescribed medication."],
    source: "Bzzworld Smart Lab"
  },
  vigor: {
    slide: "slide-vigor.jpg",
    eyebrow: "Energy and stamina",
    title: "Why energy fades, and what reverses the",
    accent: "chain",
    lead: "Nitric oxide declines with age. Mitochondrial function is affected and blood flow to skeletal muscle slows, so the muscle itself is damaged and performance drops. Raising the nitric oxide level is stated to reverse the same chain.",
    stats: [
      { value: "01", label: "NO declines with age — performance follows" },
      { value: "02", label: "Mitochondrial function affected, muscle blood flow slows" },
      { value: "03", label: "Raising NO restores affected functions" },
      { value: "04", label: "More oxygen supplied to working muscle" }
    ],
    source: "Nitric oxide, aging and aerobic exercise — sedentary individuals to Master's athletes"
  },
  telomeres: {
    slide: "slide-telomeres.jpg",
    eyebrow: "Cellular ageing",
    title: "Ageing, at the level of the",
    accent: "chromosome",
    lead: "Telomeres cap the ends of your chromosomes and shorten every time a cell divides. When they reach a critical length the cell stops dividing. Telomerase is the enzyme that protects that length.",
    stats: [
      { value: "Normal", label: "Telomeres shorten with every cell division" },
      { value: "With BIO N:OV", label: "Stated to activate telomerase through NO generated" }
    ],
    notes: ["A manufacturer statement about their product documentation, not an established clinical finding."],
    source: "Circulation"
  }
};

/* Manufacturer brochure panels (Bzzworld Korea BIO N:OV product deck). Each one
   is shown inline as a picture and opens full size with its own explanation.
   Figures and sources are reproduced as published in that deck. */
const slides: Record<string, Detail> = {
  bloodPressure: {
    subtitle: "Manufacturer product documentation",
    title: "Balancing blood pressure, cleansing blood",
    body: [
      "This is the decline, drawn as a single artery. At 20 your nitric oxide production sits at 100%. By your 30s it is around 80% and the arterial wall begins to thicken. By your 40s, roughly half — inflammation starts to clump. By your 50s, about 35%, with atherosclerosis. Past 60, around 15%.",
      "The deck puts the whole arc at 85% of nitric oxide production capability lost as we age. That is the number worth sitting with, because nothing else on this page matters if the road itself is closing."
    ],
    points: [
      "Vessel with sufficient NO — relaxed, broad, smooth",
      "Vessel with less NO — stiff, stuck, slow running",
      "85% of NO production capability is lost as we age",
      "Source: Dr. Nathan Bryan, Functional Nitric Oxide Nutrition"
    ]
  },
  vesselRepair: {
    subtitle: "Manufacturer product documentation",
    title: "Repairing blood vessels, preventing cardiovascular disease",
    body: [
      "Two vessels, side by side. The left one is narrowed by plaque and the blood is crawling past it. The right one is open, and the NO molecules are visible in the flow.",
      "Stroke is caused by poor elasticity of blood vessels or blocked blood flow. Heart disease follows the same road. The manufacturer's position is that supporting nitric oxide generation supports the elasticity of the vessel itself."
    ],
    points: [
      "Recover elasticity of blood vessel",
      "Prevent cardiovascular disease caused by blocked blood flow",
      "Stroke and heart disease share one underlying cause — flow"
    ]
  },
  hypertension: {
    subtitle: "World Health Organization / UNSW",
    title: "Hypertension: sowing seeds of risks",
    body: [
      "High blood pressure is the leading risk factor for stroke, ischaemic heart disease, other vascular diseases and renal disease.",
      "It is also the quietest. Most people carrying it feel completely normal, which is exactly why 80% of patients never get it under control."
    ],
    points: [
      "1.28 billion hypertension patients worldwide",
      "8.5 million deaths directly linked to hypertension",
      "80% of patients fail to control blood pressure",
      "Source: World Health Organization, UNSW"
    ]
  },
  stroke: {
    subtitle: "World Heart Federation / Harvard Health Publishing",
    title: "Stroke: weighing down families",
    body: [
      "15 million people worldwide suffer a stroke every year. Six million die. Five million are left permanently disabled — which makes this a burden carried by the whole family and community, not just the patient.",
      "And the mechanism is the one this entire page has been about: 87% of strokes are caused by blocked blood flow to the brain."
    ],
    points: [
      "15 million strokes worldwide every year",
      "6 million deaths, 5 million permanently disabled",
      "87% caused by blocked blood flow to the brain",
      "Source: World Heart Federation, Harvard Health Publishing"
    ]
  },
  dementia: {
    subtitle: "2022 Alzheimer's Association",
    title: "Dementia: trapping the aged",
    body: [
      "Ten million new cases a year — one new case every 3.2 seconds. One in three seniors dies with Alzheimer's or another dementia.",
      "The half of this that rarely gets counted is the caregiver. They are twice as likely to be emotionally depressed and physically exhausted, and families bear 70% of the expense."
    ],
    points: [
      "10 million new cases per year — one every 3.2 seconds",
      "1 in 3 seniors dies with Alzheimer's or another dementia",
      "Caregivers are 2× more likely to be depressed and exhausted",
      "70% of the expense is borne by families",
      "Source: 2022 Alzheimer's Association"
    ]
  },
  telomeres: {
    subtitle: "Manufacturer product documentation",
    title: "Slowing down the ageing process",
    body: [
      "Telomeres are the caps on the ends of your chromosomes. Every time a cell divides they get a little shorter, and when they reach a critical length the cell stops dividing altogether. The deck states it plainly: the length of telomeres determines the lifespan of a person.",
      "The manufacturer's claim is that BIO N:OV activates telomerase through the nitric oxide it generates, slowing the shortening process."
    ],
    points: [
      "Telomeres shorten every time a cell divides",
      "Telomerase is the enzyme that protects that length",
      "BIO N:OV is stated to activate telomerase through NO generated",
      "Source: Circulation"
    ]
  },
  skin: {
    subtitle: "100 testers, aged 15 to 76",
    title: "What testers reported about their skin",
    body: [
      "Skin is fed by the smallest vessels you own, so it tends to show a circulation change earlier and more visibly than anything else. These are self-reported results from a panel of 100 testers ranging from 15 to 76 years old.",
      "Tester-reported outcomes are not a clinical trial. Individual results vary."
    ],
    points: [
      "78% of testers feel brighter",
      "84% of testers report wrinkles reduce",
      "68% of testers report pores shrink",
      "68% of testers report less inflammation",
      "Source: Gregory Chernoff, The Utilization of a Topical Nitric Oxide Generating Serum in Aesthetic Medicine"
    ]
  },
  rawMaterials: {
    subtitle: "Premium raw materials",
    title: "What is actually in the tablet",
    body: [
      "Four raw materials, each chosen for what it contributes rather than for the label. Nothing exotic — this is food, fermented.",
      "Confirm the complete authorised formula and exact ingredient naming on the market label for your country."
    ],
    points: [
      "Lettuce — vitamin A, vitamin B, amino acids; prevents skin ageing problems",
      "Garlic — a top 10 superfood; allicin promotes anticancer substances and metabolism",
      "Soybean sprouts — β-carotene and vitamin C; remove active acids to improve immunity",
      "Soybean — various vitamins, minerals and fibres; prevent arteriosclerosis and reduce cholesterol"
    ]
  },
  patents: {
    subtitle: "Exclusive proprietary microbial strains",
    title: "The patents and the GMP certificate",
    body: [
      "BIO N:OV is developed from a proprietary microbial strain (KACC91554P) owned by the Korea Research Institute of Bioscience and Biotechnology. It is a fermented composition of natural vegetables and herbs.",
      "The documents shown are the patent certificates and the GMP certificate for the manufacturing establishment. This is the part of the story you can verify on paper rather than take on trust."
    ],
    points: [
      "Proprietary microbial strain KACC91554P",
      "Owned by the Korea Research Institute of Bioscience and Biotechnology",
      "Patent certificates issued in multiple jurisdictions",
      "GMP certificate — Ministry of Food and Drug Safety"
    ]
  },
  techRoadmap: {
    subtitle: "Manufacturer product documentation",
    title: "Three generations, and what was wrong with the first two",
    body: [
      "First generation was arginine. It needs an enzyme to work and it is unstable — and the deck states it is prohibited for heart disease patients, which rules out a large part of the people who came looking for it.",
      "Second generation moved to vegetable and fruit extracts. Gentler, but the listed side effects are nausea, diarrhoea and headache, and it is marked not suitable for the over-40s. Again: the wrong group excluded.",
      "Third generation is microbial fermentation. The manufacturer states it is 40–400% more effective than other competition."
    ],
    points: [
      "1st gen — arginine: enzyme needed, unstable, prohibited for heart disease patients",
      "2nd gen — veg & fruit extracts: nausea, diarrhoea, headache; not suitable for 40+",
      "3rd gen — BIO N:OV: microbial fermentation, stated 40–400% more effective",
      "Comparative figure as published by the manufacturer"
    ]
  },
  sixSystems: {
    subtitle: "Dr. Ferid Murad, Magical Nitric Oxide",
    title: "One signal, six systems",
    body: [
      "This is the claim drawn out in full. Six systems, and the conditions the deck associates with each when the nitric oxide signal weakens.",
      "It is worth noticing what these have in common. They are not six unrelated illnesses in six unrelated places — they are six destinations on one delivery network, and the deck's argument is that they suffer together when that network narrows."
    ],
    points: [
      "Brain — stroke, dementia, Alzheimer's disease",
      "Respiratory system — rhinitis, pneumonia",
      "Blood circulation — hypertension, diabetes",
      "Heart — myocardial infarction, arrhythmia",
      "Immune system — flu, cold, fever, allergy",
      "Digestive system — indigestion, diarrhoea, bloating"
    ]
  },
  diabetes: {
    subtitle: "International Diabetes Federation",
    title: "Diabetes spiralling out of control",
    body: [
      "One in ten adults is living with diabetes, and almost half of them do not know it. That is the part that makes it dangerous — undiagnosed means untreated.",
      "The deck ranks it among the top causes of premature death worldwide."
    ],
    points: [
      "537 million adults living with diabetes",
      "Every 5 seconds, one person dies from diabetes",
      "6.7 million deaths in 2021",
      "Almost half of all cases are undiagnosed",
      "Source: International Diabetes Federation"
    ]
  },
  diabetesEase: {
    subtitle: "Bzzworld Smart Lab",
    title: "What the lab measured on blood sugar",
    body: [
      "The manufacturer's laboratory reports blood sugar dropping by 8% within one hour, by two routes: reducing insulin resistance to speed up blood sugar metabolism, and reducing digestive enzyme activity so blood sugar does not spike as fast after a meal.",
      "This laboratory data is not intended or implied to be a substitute for professional medical advice, diagnosis or treatment. BIO N:OV is not a diabetes treatment and must never replace prescribed medication."
    ],
    points: [
      "Blood sugar stated to drop by 8%",
      "Within 1 hour",
      "Reduces insulin resistance, speeding blood sugar metabolism",
      "Reduces digestive enzyme activity after meals",
      "Source: Bzzworld Smart Lab"
    ]
  },
  vigor: {
    subtitle: "Manufacturer product documentation",
    title: "Why energy fades, and what changes it",
    body: [
      "The chain runs in one direction. Nitric oxide declines with age. Mitochondrial function is affected and blood flow to skeletal muscle slows, so the muscle itself is damaged. Performance drops — and it feels like simply getting older.",
      "The deck's argument is that raising the nitric oxide level reverses the same chain: affected functions restored, blood flow increased, more oxygen supplied."
    ],
    points: [
      "NO declines with age — lesser performance follows",
      "Mitochondrial function affected, blood flow to muscle slows",
      "Raising NO is stated to restore affected functions",
      "More oxygen supplied to working muscle",
      "Source: Nitric oxide, aging and aerobic exercise — sedentary individuals to Master's athletes"
    ]
  },
  betterChoice: {
    subtitle: "Manufacturer product documentation",
    title: "Why the manufacturer calls it the better choice",
    body: [
      "Five claims, and they answer the five objections people actually raise about nitric oxide supplements: is it natural, will it work for me, how long until anything happens, does my body have to do the work, and will I become dependent on it.",
      "These are the manufacturer's stated positions. Read them alongside the disclaimer at the foot of this section."
    ],
    points: [
      "Pure herbal formula — ingredients stated 100% natural and safe",
      "Works on everyone",
      "Superfast response — blood pressure controlled within 30 minutes",
      "No enzyme needed — instantly releases NO on contact with stomach acid",
      "Zero dependence"
    ]
  }
};

/* The five claims from the Better Choice panel, each one clickable. */
const betterReasons = [
  {
    Icon: Leaf,
    name: "Pure herbal formula",
    title: "Pure herbal formula",
    subtitle: "Manufacturer product documentation",
    headline: "Ingredients stated 100% natural and safe",
    body: [
      "Fermented garlic, fermented lettuce, soybean and soybean sprouts. That is the whole list — food, transformed by a microbial process, rather than a synthesised compound.",
      "Confirm the complete authorised formula and exact ingredient naming on the market label for your country."
    ],
    points: ["Fermented garlic and lettuce extracts", "Soybean and soybean sprouts", "No synthesised nitric oxide donor"]
  },
  {
    Icon: Users,
    name: "Works on everyone",
    title: "Works on everyone — no age ceiling",
    subtitle: "Manufacturer product documentation",
    headline: "Not limited to one age group",
    body: [
      "This is the direct answer to the second-generation problem. Vegetable and fruit extract formulas are marked not suitable for the over-40s — precisely the people whose nitric oxide production has already dropped by half.",
      "Because BIO N:OV does not depend on your body making the conversion, the manufacturer's position is that it works the same way regardless of age."
    ],
    points: ["No age ceiling stated", "Does not depend on declining enzyme efficiency", "The group earlier formulas excluded"]
  },
  {
    Icon: Timer,
    name: "Superfast response",
    title: "Superfast response",
    subtitle: "Manufacturer product documentation",
    headline: "Blood pressure controlled within 30 minutes",
    body: [
      "The manufacturer states blood pressure is controlled within 30 minutes of taking it.",
      "This is a manufacturer claim about their product documentation, not a clinical endpoint from a published trial. BIO N:OV is a wellness supplement and must never replace prescribed blood pressure medication. Speak to your doctor before changing anything you are already taking."
    ],
    points: ["Stated 30-minute response window", "Manufacturer product documentation", "Not a substitute for prescribed medication"]
  },
  {
    Icon: FlaskConical,
    name: "No enzyme needed",
    title: "No enzyme needed",
    subtitle: "Manufacturer product documentation",
    headline: "Instantly releases NO in contact with stomach acid",
    body: [
      "First-generation arginine needs an enzyme to convert it, and that enzyme becomes less efficient with age. It is the single reason those formulas disappoint the people who need them most.",
      "The fermentation already did that work. The deck states NO is released instantly on contact with stomach acid — no conversion step required from you."
    ],
    points: ["No enzyme conversion required", "Released on contact with stomach acid", "The step that fails with age is removed"]
  },
  {
    Icon: ShieldCheck,
    name: "Zero dependence",
    title: "Zero dependence",
    subtitle: "Manufacturer product documentation",
    headline: "Nothing to taper off",
    body: [
      "The manufacturer states zero dependence — you are supporting a pathway your body already runs, not substituting for it.",
      "As with everything on this page, this is the manufacturer's stated position rather than a regulatory determination."
    ],
    points: ["Stated zero dependence", "Supports a pathway the body already has", "Manufacturer product documentation"]
  }
];

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
    short: "A top-10 superfood, transformed by patented fermentation.",
    img: "ingredient-garlic.jpg",
    title: "Fermented Garlic Extract",
    subtitle: "One of the most studied botanicals in the world, fermented",
    body: [
      "Garlic has one of the longest histories of any wellness botanical. In BIO N:OV it is not used raw \u2014 it is put through a controlled microbial fermentation process before it is formulated.",
      "Fermentation is a transformation step: microorganisms act on the plant material, changing its composition before it reaches the finished tablet. The manufacturer lists garlic as a top 10 superfood and credits allicin with promoting anticancer substances and metabolism."
    ],
    points: [
      "Listed by the manufacturer as a top 10 superfood",
      "Allicin promotes anticancer substances and metabolism",
      "Processed through controlled microbial fermentation",
      "Confirm the full authorised ingredient list on the market label"
    ]
  },
  {
    name: "Fermented Lettuce Extract",
    short: "Vitamin A, vitamin B and amino acids \u2014 fermented.",
    img: "ingredient-lettuce.jpg",
    title: "Fermented Lettuce Extract",
    subtitle: "Leafy greens, reimagined through fermentation",
    body: [
      "Leafy green vegetables are a familiar part of a circulation-friendly diet. BIO N:OV features lettuce extract that has been through the same controlled fermentation process as the garlic component.",
      "The manufacturer lists vitamin A, vitamin B and amino acids among its contributions, and credits it with helping prevent skin ageing problems."
    ],
    points: [
      "Vitamin A, vitamin B and amino acids",
      "Stated to help prevent skin ageing problems",
      "Processed through controlled microbial fermentation",
      "Confirm the full authorised ingredient list on the market label"
    ]
  },
  {
    name: "Soybean Sprouts",
    short: "\u03b2-carotene and vitamin C, to support immunity.",
    img: "ingredient-sprouts.jpg",
    title: "Soybean Sprouts",
    subtitle: "A staple of Korean nutrition",
    body: [
      "Soybean sprouts are an everyday staple of Korean cooking and part of the BIO N:OV formulation base alongside the fermented extracts.",
      "The manufacturer lists \u03b2-carotene and vitamin C among their contributions, and states they remove active acids to improve immunity."
    ],
    points: [
      "\u03b2-carotene and vitamin C",
      "Stated to remove active acids to improve immunity",
      "Naturally derived plant material",
      "Contains soy \u2014 check the label if you have a soy allergy"
    ]
  },
  {
    name: "Soybean",
    short: "Vitamins, minerals and fibres forming the base.",
    img: "ingredient-soybean.jpg",
    title: "Soybean",
    subtitle: "Foundational plant nutrition from the Korean tradition",
    body: [
      "Soybean forms part of the BIO N:OV formulation base. It is one of the most established plant proteins in Korean nutrition.",
      "The manufacturer lists various vitamins, minerals and fibres among its contributions, and states it helps prevent arteriosclerosis and reduce cholesterol. As with every ingredient, confirm the complete authorised formula against the approved market label."
    ],
    points: [
      "Various vitamins, minerals and fibres",
      "Stated to help prevent arteriosclerosis and reduce cholesterol",
      "Part of the BIO N:OV formulation base",
      "Contains soy \u2014 check the label if you have a soy allergy"
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


/* Headline figures from the manufacturer's laboratory testing. Each opens a
   full explanation on click. */
const flowStats: (Detail & { value: string; label: string })[] = [
  {
    value: "+18%",
    label: "Vessel diameter",
    title: "+18% vessel diameter",
    subtitle: "Manufacturer laboratory measurement",
    body: [
      "Blood vessels are not fixed pipes. They are living tubes wrapped in a layer of smooth muscle, and that muscle is constantly being told how tightly to squeeze. Nitric oxide is the message that tells it to let go.",
      "An 18% wider vessel is not an 18% improvement in flow — it is far more. Flow through a tube rises steeply with radius, which is why a modest widening produces a large change in how easily blood moves. That relationship is the entire reason nitric oxide matters so much to circulation.",
      "Figure from the manufacturer's laboratory testing. Individual results vary."
    ],
    points: [
      "Vessels are muscle-wrapped, not rigid pipes",
      "Nitric oxide signals that muscle to relax",
      "Flow rises steeply as radius increases",
      "A small widening produces a large flow change",
      "Manufacturer laboratory data — results vary"
    ]
  },
  {
    value: "+42%",
    label: "Blood flow",
    title: "+42% blood flow",
    subtitle: "Manufacturer laboratory measurement",
    body: [
      "This is the number that matters most, because blood flow is delivery. Every cell in your body is waiting on a delivery of oxygen and nutrients, and the bloodstream is the only road.",
      "When flow improves, nothing about your cells changes — they simply receive what they were always waiting for, sooner. Muscle gets oxygen to sustain effort. The brain gets the continuous supply it cannot store. Skin, gut and immune tissue are all served by the same network.",
      "Figure from the manufacturer's laboratory testing. Individual results vary."
    ],
    points: [
      "Blood flow is the body's delivery system",
      "Oxygen and nutrients travel only by blood",
      "Muscle, brain and skin all share one network",
      "Better flow means faster delivery everywhere",
      "Manufacturer laboratory data — results vary"
    ]
  },
  {
    value: "-25%",
    label: "Blood pressure",
    title: "-25% blood pressure",
    subtitle: "Manufacturer laboratory measurement",
    body: [
      "Pressure is what the heart has to generate to push blood through the network. When vessels relax and widen, resistance falls — and the heart does not have to work as hard to move the same volume of blood.",
      "That is the mechanism behind this figure: not force applied to the system, but resistance removed from it.",
      "Figure from the manufacturer's laboratory testing. Individual results vary. BIO N:OV is a wellness supplement and is not a treatment for high blood pressure. It must never replace prescribed medication — if you are managing blood pressure, speak to your doctor before changing anything."
    ],
    points: [
      "Pressure reflects resistance in the network",
      "Relaxed vessels lower that resistance",
      "The heart moves the same blood with less effort",
      "Manufacturer laboratory data — results vary",
      "Not a treatment; never replace prescribed medication",
      "Consult your doctor before any change"
    ]
  }
];


/* ---- Systems affected by nitric oxide deficiency (from the BIO N:OV deck,
   attributed to Dr. Ferid Murad, Nobel Laureate in Physiology or Medicine) ---- */
const noSystems: (Detail & { name: string; conditions: string; Icon: typeof Brain })[] = [
  {
    name: "Brain",
    conditions: "Stroke · Dementia · Alzheimer's Disease",
    Icon: Brain,
    title: "Brain",
    subtitle: "Stroke · Dementia · Alzheimer's Disease",
    body: [
      "The brain is the most blood-hungry organ you own — roughly 2% of body weight consuming around 20% of your oxygen, with almost no capacity to store fuel. It depends on blood arriving continuously.",
      "This is why cerebrovascular health and cognitive health are so tightly linked in the research literature. 87% of strokes are caused by blocked blood flow to the brain.",
      "Nitric oxide helps regulate cerebral blood flow and participates in normal neuronal signalling."
    ],
    points: [
      "~20% of your oxygen goes to the brain",
      "Almost no stored fuel — needs continuous supply",
      "87% of strokes are caused by blocked blood flow",
      "Nitric oxide helps regulate cerebral blood flow"
    ]
  },
  {
    name: "Respiratory System",
    conditions: "Rhinitis · Pneumonia",
    Icon: Wind,
    title: "Respiratory System",
    subtitle: "Rhinitis · Pneumonia",
    body: [
      "Nitric oxide is produced in the airways and paranasal sinuses, where it participates in normal respiratory physiology and airway defence.",
      "Oxygen enters the body through the lungs — but it only reaches tissue if circulation carries it there. The respiratory and circulatory systems work as one delivery chain."
    ],
    points: [
      "Nitric oxide is produced in the airways and sinuses",
      "Participates in normal airway defence",
      "Oxygen intake means nothing without delivery",
      "Respiratory and circulatory systems work as one"
    ]
  },
  {
    name: "Blood Circulation",
    conditions: "Hypertension · Diabetes",
    Icon: Droplets,
    title: "Blood Circulation",
    subtitle: "Hypertension · Diabetes",
    body: [
      "This is the system nitric oxide governs most directly. It signals the smooth muscle around every vessel to relax — widening the vessel and lowering the resistance blood must overcome.",
      "1.28 billion people worldwide live with hypertension, and 80% do not have it under control. 537 million adults live with diabetes, and almost half are undiagnosed.",
      "These figures describe global disease burden and are not claims about this product."
    ],
    points: [
      "Nitric oxide directly governs vessel relaxation",
      "1.28 billion people live with hypertension",
      "80% of them do not have it under control",
      "537 million adults live with diabetes",
      "Almost half of diabetes cases are undiagnosed"
    ]
  },
  {
    name: "Heart",
    conditions: "Myocardial Infarction · Arrhythmia",
    Icon: HeartPulse,
    title: "Heart",
    subtitle: "Myocardial Infarction · Arrhythmia",
    body: [
      "The heart is a pump, but what it pumps against is resistance. When vessels stay constricted, the heart must generate more force to move the same volume of blood.",
      "The heart also feeds itself through its own coronary vessels — so circulation is not something the heart merely serves, it is something the heart depends on."
    ],
    points: [
      "The heart pumps against vascular resistance",
      "Relaxed vessels mean less work per beat",
      "The heart feeds itself via coronary vessels",
      "Circulation serves the pump as much as the pump serves it"
    ]
  },
  {
    name: "Immune System",
    conditions: "Flu · Cold · Fever · Allergy",
    Icon: ShieldPlus,
    title: "Immune System",
    subtitle: "Flu · Cold · Fever · Allergy",
    body: [
      "Immune cells patrol the body through the bloodstream and lymphatic system. Healthy circulation is how they reach tissue that needs them.",
      "Nitric oxide has a second role here — immune cells produce it themselves as part of normal immune signalling and defence."
    ],
    points: [
      "Immune cells travel via the bloodstream",
      "Circulation is their transport network",
      "Immune cells produce nitric oxide themselves",
      "Part of normal immune signalling"
    ]
  },
  {
    name: "Digestive System",
    conditions: "Indigestion · Diarrhea · Bloating",
    Icon: Activity,
    title: "Digestive System",
    subtitle: "Indigestion · Diarrhea · Bloating",
    body: [
      "Nitric oxide participates in signalling throughout the digestive tract, including the relaxation of smooth muscle that governs normal gut motility.",
      "Nutrients absorbed through the gut enter the bloodstream — so digestion and circulation are two halves of the same delivery system."
    ],
    points: [
      "Nitric oxide signals within the digestive tract",
      "Involved in normal gut motility",
      "Absorbed nutrients enter via the bloodstream",
      "Digestion and circulation are one delivery chain"
    ]
  }
];

/* ---- Global disease burden. Public-health statistics, sourced. ---- */
const burden: (Detail & { figure: string; unit: string; name: string; source: string })[] = [
  {
    figure: "537",
    unit: "million",
    name: "Living with diabetes",
    source: "International Diabetes Federation",
    title: "Diabetes — spiralling out of control",
    subtitle: "International Diabetes Federation",
    body: [
      "1 in 10 adults worldwide is living with diabetes, and almost half of them are undiagnosed — they do not yet know.",
      "Every 5 seconds, one person dies from diabetes. In 2021 alone it was linked to 6.7 million deaths, ranking among the top causes of premature death globally.",
      "These are public-health statistics describing global disease burden. They are not claims about this product."
    ],
    points: [
      "537 million adults living with diabetes",
      "1 in 10 adults worldwide",
      "Almost 1 in 2 are undiagnosed",
      "One death every 5 seconds",
      "6.7 million deaths in 2021"
    ]
  },
  {
    figure: "1.28",
    unit: "billion",
    name: "Living with hypertension",
    source: "World Health Organization",
    title: "Hypertension — sowing seeds of risk",
    subtitle: "World Health Organization",
    body: [
      "High blood pressure is the leading risk factor for stroke, ischaemic heart disease, other vascular diseases and renal disease.",
      "1.28 billion people live with it worldwide, and 80% do not have it under control. It is directly linked to 8.5 million deaths.",
      "These are public-health statistics describing global disease burden. They are not claims about this product. If you are managing blood pressure, follow your doctor's guidance."
    ],
    points: [
      "1.28 billion people worldwide",
      "80% fail to control their blood pressure",
      "8.5 million deaths directly linked",
      "Leading risk factor for stroke and heart disease",
      "Follow your doctor's guidance — always"
    ]
  },
  {
    figure: "15",
    unit: "million",
    name: "Strokes every year",
    source: "World Heart Federation · Harvard Health",
    title: "Stroke — weighing down families",
    subtitle: "World Heart Federation · Harvard Health Publishing",
    body: [
      "15 million people worldwide suffer a stroke every year. 6 million die. 5 million are left permanently disabled — becoming a heavy burden on their family and community.",
      "87% of strokes are caused by blocked blood flow to the brain. That single figure is why circulation is not an abstract topic.",
      "These are public-health statistics describing global disease burden. They are not claims about this product."
    ],
    points: [
      "15 million strokes every year worldwide",
      "6 million deaths",
      "5 million left permanently disabled",
      "87% caused by blocked blood flow to the brain",
      "A burden carried by whole families"
    ]
  },
  {
    figure: "10",
    unit: "million",
    name: "New dementia cases a year",
    source: "2022 Alzheimer's Association",
    title: "Dementia — trapping the aged",
    subtitle: "2022 Alzheimer's Association",
    body: [
      "10 million new cases every year — one new case every 3.2 seconds. 1 in 3 seniors dies with Alzheimer's or another dementia.",
      "The weight falls on families too. Caregivers are twice as likely to be emotionally depressed, physically exhausted and financially hard-pressed, with 70% of the expense borne by families.",
      "These are public-health statistics describing global disease burden. They are not claims about this product."
    ],
    points: [
      "10 million new cases every year",
      "One new case every 3.2 seconds",
      "1 in 3 seniors dies with dementia",
      "Caregivers 2x more likely to suffer",
      "70% of the expense borne by families"
    ]
  }
];


/* ---- What BIO N:OV does (Bzzworld Smart Lab data, per the product deck) ---- */
const novActions: (Detail & { name: string; headline: string; Icon: typeof Activity })[] = [
  {
    name: "Blood sugar support",
    headline: "Stabilises blood sugar level",
    Icon: Activity,
    title: "BIO N:OV and blood sugar",
    subtitle: "Bzzworld Smart Lab measurement",
    body: [
      "Laboratory testing recorded blood sugar dropping by 8% within 1 hour of taking BIO N:OV.",
      "Two mechanisms are described: reducing insulin resistance to speed up blood sugar metabolism, and reducing digestive enzyme activity so blood sugar does not spike as fast after a meal.",
      "Source: Bzzworld Smart Lab. This laboratory data is not intended or implied to be a substitute for professional medical advice, diagnosis or treatment. BIO N:OV is not a treatment for diabetes and must never replace prescribed medication."
    ],
    points: [
      "Blood sugar drops by 8% within 1 hour",
      "Reduces insulin resistance",
      "Speeds up blood sugar metabolism",
      "Reduces digestive enzyme activity after meals",
      "Laboratory data — not medical advice",
      "Never replace prescribed medication"
    ]
  },
  {
    name: "Vigor & performance",
    headline: "Stay energetic all day long",
    Icon: Zap,
    title: "BIO N:OV boosts your vigor",
    subtitle: "The chain from nitric oxide to performance",
    body: [
      "As nitric oxide declines with age, mitochondrial function is affected and blood flow at the skeletal muscle slows. Muscle receives less of what it needs, and performance drops.",
      "Raising nitric oxide reverses the chain: affected functions restored, blood flow increased, more oxygen supplied to working muscle.",
      "Source: research on nitric oxide, ageing and aerobic exercise — sedentary individuals to Master's athletes."
    ],
    points: [
      "NO declines with age → performance declines",
      "Mitochondrial function is affected",
      "Blood flow at skeletal muscle slows",
      "Raising NO restores affected functions",
      "More oxygen supplied to working muscle"
    ]
  },
  {
    name: "Healthy ageing",
    headline: "Slows down the ageing process",
    Icon: Dna,
    title: "BIO N:OV and telomeres",
    subtitle: "The length of telomeres determines lifespan",
    body: [
      "Telomeres are the protective caps at the ends of your chromosomes. They shorten each time a cell divides, and when they reach a critical length the cell stops dividing altogether.",
      "The deck describes BIO N:OV activating telomerase through the nitric oxide it generates, slowing the shortening process and making slower ageing possible.",
      "Source: Circulation. This describes a proposed mechanism from the product documentation, not a measured outcome in individual users."
    ],
    points: [
      "Telomeres cap the ends of your chromosomes",
      "They shorten every time a cell divides",
      "Cells stop dividing at a critical length",
      "Telomerase slows that shortening",
      "Proposed mechanism — individual results vary"
    ]
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
            <h3>{brandSafe(detail.title)}</h3>
            {detail.img && (
              <Image
                className="modal-figure"
                src={`/images/${detail.img}`}
                alt={detail.imgAlt ?? detail.title}
                width={1308}
                height={724}
                sizes="(max-width: 900px) 100vw, 760px"
              />
            )}
            {detail.body.map(p => <p key={p.slice(0, 24)}>{brandSafe(p)}</p>)}
            {detail.points && (
              <ul className="modal-points">
                {detail.points.map(pt => <li key={pt}><Check size={16} /><span>{brandSafe(pt)}</span></li>)}
              </ul>
            )}
            <button className="button primary modal-cta" onClick={onClose}>Got it</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* A manufacturer brochure panel shown inline. The picture carries the argument
   before anyone clicks; clicking opens the same panel full size with the
   written explanation beside it. */
function SlideFigure({
  slide,
  caption,
  onOpen,
  tone = "light"
}: {
  slide: Detail & { img: string };
  caption: string;
  onOpen: (d: Detail) => void;
  tone?: "light" | "dark";
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      className={`slide-figure slide-figure--${tone}`}
      onClick={() => onOpen(slide)}
      aria-label={`Enlarge and read: ${slide.title}`}
    >
      <Image
        src={`/images/${slide.img}`}
        alt={slide.imgAlt ?? slide.title}
        width={1308}
        height={724}
        sizes="(max-width: 900px) 100vw, 620px"
      />
      <span className="slide-figure__bar">
        <span className="slide-figure__cap">{brandSafe(caption)}</span>
        <span className="slide-figure__more">Enlarge &amp; read <Plus size={14} /></span>
      </span>
    </motion.button>
  );
}

/* Renders a brochure panel as real markup. Same figures and the same cited
   source as the original artwork, but translatable, responsive, and clickable
   through to the full detail. */
/* The original brochure slide, sat at the foot of the panel it was rebuilt
   from. The rebuilt text above carries the meaning into every language; the
   picture below carries the impact, which no amount of typography replaces.
   Its own words stay English — that is the trade, and it is why the numbers
   are repeated as text rather than left to the image alone. */
function PanelSlide({ slide }: { slide?: string }) {
  if (!slide) return null;
  return (
    <span className="panelslide">
      <Image src={`/images/${slide}`} alt="" width={1600} height={900} loading="lazy" />
      <span className="panelslide__cap">From the original {brandSafe("BIO N:OV")} presentation</span>
    </span>
  );
}

function StatPanel({
  panel,
  detail,
  onOpen
}: {
  panel: StatPanelData;
  detail: Detail;
  onOpen: (d: Detail) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      className={`statpanel statpanel--${panel.tone ?? "brand"}`}
      onClick={() => onOpen(detail)}
      aria-label={`Read more: ${panel.eyebrow}`}
    >
      <span className="statpanel__eyebrow">{panel.eyebrow}</span>
      <h4 className="statpanel__title">
        {panel.title} <span>{panel.accent}</span>
      </h4>
      {panel.lead && <p className="statpanel__lead">{brandSafe(panel.lead)}</p>}

      <span className={`statpanel__stats count-${panel.stats.length}`}>
        {panel.stats.map(st => (
          <span className="statpanel__stat" key={st.label}>
            <b>
              {st.value}
              {st.unit && <em>{st.unit}</em>}
            </b>
            <small>{st.label}</small>
          </span>
        ))}
      </span>

      {panel.notes?.map(n => (
        <span className="statpanel__note" key={n.slice(0, 24)}>{brandSafe(n)}</span>
      ))}

      <PanelSlide slide={panel.slide} />

      <span className="statpanel__foot">
        <span className="statpanel__source">Source: {panel.source}</span>
        <span className="statpanel__more">Read the detail <Plus size={14} /></span>
      </span>
    </motion.button>
  );
}

/* The remaining brochure panels, rebuilt the same way: illustrations kept as
   images where the picture is the point (food, certificates), but every word
   is markup so it reaches the translator. */
function ItemPanel({
  panel,
  detail,
  onOpen
}: {
  panel: ItemPanelData;
  detail: Detail;
  onOpen: (d: Detail) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      className="statpanel itempanel"
      onClick={() => onOpen(detail)}
      aria-label={`Read more: ${panel.eyebrow}`}
    >
      <span className="statpanel__eyebrow">{panel.eyebrow}</span>
      <h4 className="statpanel__title">
        {panel.title} <span>{panel.accent}</span>
      </h4>
      {panel.lead && <p className="statpanel__lead">{brandSafe(panel.lead)}</p>}

      {panel.bars && (
        <span className="itempanel__bars">
          {panel.bars.map((b, i) => (
            <span className="itempanel__bar" key={b.label}>
              <span className="itempanel__barfill" style={{ height: `${100 - i * 18}%` }} />
              <b>{b.value}</b>
              <em>{b.label}</em>
              <small>{b.caption}</small>
            </span>
          ))}
        </span>
      )}

      <span className={`itempanel__items cols-${panel.columns ?? 3}`}>
        {panel.items.map(item => (
          <span className={`itempanel__item ${item.bad ? "is-bad" : ""}`} key={item.label + item.points[0]}>
            {item.img && (
              <span className="itempanel__thumb">
                <Image src={`/images/${item.img}`} alt="" width={420} height={300} />
              </span>
            )}
            <b>{item.label}</b>
            {item.heading && <strong>{brandSafe(item.heading)}</strong>}
            <span className="itempanel__points">
              {item.points.map(pt => (
                <span key={pt}>
                  {item.bad ? <X size={13} /> : <Check size={13} />}
                  <em>{brandSafe(pt)}</em>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>

      {panel.notes?.map(n => (
        <span className="statpanel__note" key={n.slice(0, 24)}>{brandSafe(n)}</span>
      ))}

      <PanelSlide slide={panel.slide} />

      <span className="statpanel__foot">
        <span className="statpanel__source">Source: {panel.source}</span>
        <span className="statpanel__more">Read the detail <Plus size={14} /></span>
      </span>
    </motion.button>
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

export default function BioNovSite({ faq }: { faq: { group: string; question: string; answer: string }[] }) {
  /* preserve author order rather than sorting alphabetically */
  const faqGroups = faq.reduce<string[]>((acc, x) => acc.includes(x.group) ? acc : [...acc, x.group], []);

  /* Hero audio is opt-in: autoplay with sound is blocked by every browser, so
     the clip starts muted and the visitor turns it on. */
  /* Whole-page translation. Hand-authored strings could only ever cover the
     copy we remembered to wrap; the translate element reaches every node on
     the page, including modal bodies and FAQ answers. */
  const [langOpen, setLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState("");
  const [locale, setLocale] = useState<Locale>(englishLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem("bionov-locale");
    if (saved) {
      const found = allLocales.find(l => l.code === saved);
      if (found) setLocale(found);
    }
    if (document.getElementById("gt-script")) return;
    (window as unknown as Record<string, unknown>).googleTranslateElementInit = () => {
      const g = (window as unknown as { google?: { translate?: { TranslateElement: new (o: unknown, el: string) => void } } }).google;
      if (!g?.translate) return;
      new g.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages, autoDisplay: false },
        "gt-element"
      );
    };
    const script = document.createElement("script");
    script.id = "gt-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
  }, []);

  const applyLocale = (l: Locale) => {
    setLocale(l);
    setLangOpen(false);
    setLangQuery("");
    window.localStorage.setItem("bionov-locale", l.code);
    document.documentElement.dir = l.rtl ? "rtl" : "ltr";

    /* The cookie is what survives a reload; the select gives an instant swap
       when the widget has already booted. */
    const value = l.code === "en" ? "/en/en" : `/en/${l.code}`;
    const host = window.location.hostname;
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;

    const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (select) {
      select.value = l.code;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const langMatches = (l: Locale) =>
    !langQuery ||
    l.label.toLowerCase().includes(langQuery.toLowerCase()) ||
    l.english.toLowerCase().includes(langQuery.toLowerCase());

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroMuted, setHeroMuted] = useState(true);
  const toggleHeroSound = () => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    const next = !heroMuted;
    vid.muted = next;
    setHeroMuted(next);
    if (!next) vid.play().catch(() => {});
  };
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
        <a href="#home" className="brand notranslate" translate="no" aria-label="BIO N:OV home"><span className="brand-mark">V</span><span>BIO N:OV</span></a>
        <nav className="desktop-nav">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>

        <div className="langpick notranslate" translate="no">
          <button
            className="langpick__btn"
            onClick={() => setLangOpen(!langOpen)}
            aria-expanded={langOpen}
            aria-label="Choose language"
          >
            <Globe size={15} />
            <span className="langpick__flag">{locale.flag}</span>
            <span className="langpick__code">{locale.code.toUpperCase()}</span>
            <ChevronDown size={14} className={langOpen ? "rotate" : ""} />
          </button>

          {langOpen && (
            <div className="langpick__menu" role="menu">
              <input
                className="langpick__search"
                value={langQuery}
                onChange={e => setLangQuery(e.target.value)}
                placeholder="Search language…"
                aria-label="Search language"
                autoFocus
              />

              {langMatches(englishLocale) && (
                <button
                  role="menuitem"
                  className={locale.code === "en" ? "is-active" : ""}
                  onClick={() => applyLocale(englishLocale)}
                >
                  <span className="langpick__flag">{englishLocale.flag}</span>
                  <b>{englishLocale.label}</b>
                  <small>Original</small>
                </button>
              )}

              {localeGroups.map(group => {
                const shown = group.locales.filter(langMatches);
                if (!shown.length) return null;
                return (
                  <div className="langpick__group" key={group.region}>
                    <span className="langpick__region">{group.region}</span>
                    {shown.map(l => (
                      <button
                        key={l.code}
                        role="menuitem"
                        className={l.code === locale.code ? "is-active" : ""}
                        onClick={() => applyLocale(l)}
                      >
                        <span className="langpick__flag">{l.flag}</span>
                        <b>{l.label}</b>
                        <small>{l.english}</small>
                      </button>
                    ))}
                  </div>
                );
              })}

              <p className="langpick__note">
                Machine translation. Product and compliance wording is reviewed per market before
                it is used in advertising.
              </p>
            </div>
          )}
        </div>
        <div id="gt-element" aria-hidden="true" />

        <a className="nav-cta" href="#contact">Contact us <ArrowRight size={15} /></a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Open navigation">{menu ? <X /> : <Menu />}</button>
        {menu && <div className="mobile-nav">{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</div>}
      </header>

      {/* ---------------- Hero ---------------- */}
      <section id="home" className="hero">
        <div className="orb orb-a" /><div className="orb orb-b" />
        <div className="hero-copy">
          <span className="hero-kicker"><CircleDot size={14} /> Third-generation fermentation science</span>
          <h1 className="notranslate" translate="no">BIO N:OV</h1>
          <h2>Clearing the Way<br />to <span>Optimum Health</span></h2>
          <p>When blood flows freely, everything downstream works better. BIO N:OV is a next-generation wellness formula built on patented microbial fermentation, designed to support your body&rsquo;s natural nitric oxide pathways &mdash; the signal that helps blood vessels relax.</p>
          <div className="hero-actions">
            <a className="button primary" href="#product">Discover <span className="notranslate" translate="no">BIO N:OV</span> <ArrowRight size={18} /></a>
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
            ref={heroVideoRef}
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
          {/* browsers refuse autoplay with audio, so sound is opt-in */}
          <button
            className={`hero-sound ${heroMuted ? "" : "is-on"}`}
            onClick={toggleHeroSound}
            aria-pressed={!heroMuted}
            aria-label={heroMuted ? "Turn sound on" : "Turn sound off"}
          >
            {heroMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span>{heroMuted ? "Sound off" : "Sound on"}</span>
          </button>
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

            <div className="no-roles">

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

            {/* what the signal physically does, drawn rather than described */}
            <div className="vesselviz">
              <span className="vesselviz__eyebrow">Cross-section &middot; artery wall</span>

              <div className="vesselviz__tube">
                <span className="vesselviz__muscle" />
                <span className="vesselviz__endo" />
                <span className="vesselviz__lumen">
                  {[0, 1, 2, 3, 4, 5, 6].map(n => <i className="vesselviz__rbc" key={n} style={{ animationDelay: `${n * -0.9}s` }} />)}
                  {[0, 1, 2, 3].map(n => <b className="vesselviz__no" key={n} style={{ animationDelay: `${n * -1.6}s` }} />)}
                </span>
                <span className="vesselviz__endo vesselviz__endo--b" />
                <span className="vesselviz__muscle vesselviz__muscle--b" />
              </div>

              <ul className="vesselviz__key">
                <li><span className="k k--muscle" /> Smooth muscle &mdash; relaxes when NO arrives</li>
                <li><span className="k k--endo" /> Endothelium &mdash; where NO is released</li>
                <li><span className="k k--rbc" /> Red blood cells carrying oxygen</li>
                <li><span className="k k--no" /> Nitric oxide, the signal itself</li>
              </ul>

              <div className="vesselviz__creds">
                <span><Sparkles size={14} /> Molecule of the Year, 1992</span>
                <span><Microscope size={14} /> Nobel Prize in Medicine, 1998</span>
              </div>
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

            <div className="slide-pair">
              <ItemPanel panel={itemPanels.bloodPressure} detail={slides.bloodPressure} onOpen={setModal} />
              <ItemPanel panel={itemPanels.vesselRepair}  detail={slides.vesselRepair}  onOpen={setModal} />
            </div>
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
      <XrayJourney videoSrc="/video/xray-journey.mp4" />

      {/* ---------------- Blood flow story (NEW) ---------------- */}
      <Reveal id="vessels" className="noflow-section">
        <div className="noflow-inner">
          {/* ---- left: copy, figures, and the vessel control ---- */}
          <div className="noflow-copy">
            <span className="eyebrow">Inside the body</span>
            <h2>
              When NO flows,<br />
              <span>life flows freely.</span>
            </h2>
            <p>
              Nitric oxide signals the smooth muscle inside every blood vessel to relax. Vessels widen.
              Pressure drops. Oxygen-rich blood reaches every cell &mdash; your brain, your heart, your skin,
              your stamina.
            </p>

            <p className="click-prompt light"><MousePointerClick size={17} /> Click any figure to see why it matters</p>
            <div className="noflow-stats">
              {flowStats.map(stat => (
                <button key={stat.label} className="noflow-stat" onClick={() => setModal(stat)}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                  <i><Plus size={14} /></i>
                </button>
              ))}
            </div>

            {/* ---- explain, then the two vessel buttons ---- */}
            <button className="button glass noflow-how" onClick={() => setModal(vesselDetail)}>
              How this works <ArrowRight size={16} />
            </button>

            <p className="vessel-pick__prompt">
              <MousePointerClick size={16} /> Click a vessel &mdash; the video on the right changes
            </p>
            <div className="vessel-pick">
              <button
                className={`vessel-pick__btn is-red ${!vesselOpen ? "active" : ""}`}
                onClick={() => setVesselOpen(false)}
              >
                <span className="vessel-pick__swatch" />
                <span className="vessel-pick__txt">
                  <b>Constricted</b>
                  <em>Low nitric oxide</em>
                  <small>Vessel narrows. Blood crawls. Every organ waits longer for oxygen.</small>
                </span>
              </button>
              <button
                className={`vessel-pick__btn is-blue ${vesselOpen ? "active" : ""}`}
                onClick={() => setVesselOpen(true)}
              >
                <span className="vessel-pick__swatch" />
                <span className="vessel-pick__txt">
                  <b>Relaxed</b>
                  <em>Nitric oxide signal active</em>
                  <small>Vessel opens. Blood races. Oxygen reaches every cell freely.</small>
                </span>
              </button>
            </div>

            <p className="noflow-source">Figures from the manufacturer&rsquo;s laboratory testing. Individual results vary.</p>
          </div>

          {/* ---- right: the flow itself, nothing on top of it ---- */}
          <div className="noflow-stage">
            <video
              className={`noflow-flowvideo ${vesselOpen ? "is-open" : "is-narrow"}`}
              poster="/video/blood-flow-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              ref={el => { if (el) el.playbackRate = vesselOpen ? 1.35 : 0.32; }}
              aria-label="Blood cells flowing through a vessel"
            >
              <source src="/video/blood-flow.mp4" type="video/mp4" />
            </video>
            <div className={`noflow-stage__label ${vesselOpen ? "is-open" : "is-narrow"}`}>
              <span>{vesselOpen ? "RELAXED VESSEL" : "CONSTRICTED VESSEL"}</span>
              <b>{vesselOpen ? "Wide open — blood moves freely" : "Narrowed — blood crawls through"}</b>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Conversion band ---------------- */}
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
          <video
            className="body-visual__video"
            poster="/video/xray-journey-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/video/xray-journey.mp4" type="video/mp4" />
          </video>

          {/* the selected system, explained over the body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bodySystems[activeSystem].name}
              className="body-readout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="body-readout__no">
                System {String(activeSystem + 1).padStart(2, "0")} of {bodySystems.length}
              </span>
              <h3>{bodySystems[activeSystem].name}</h3>
              <p>{bodySystems[activeSystem].body[0]}</p>
              <ul>
                {bodySystems[activeSystem].points?.slice(0, 3).map(pt => (
                  <li key={pt}><Check size={14} /><span>{pt}</span></li>
                ))}
              </ul>
              <button className="button primary" onClick={() => setModal(bodySystems[activeSystem])}>
                Read the full science <ArrowRight size={16} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      {/* ---------------- The NO deficiency crisis ---------------- */}
      <Reveal id="crisis" className="crisis-section">
        <div className="crisis-inner">
          <div className="crisis-top">
            <div className="crisis-head">
              <span className="eyebrow">The scale of the problem</span>
              <h2>
                <b>99.9%</b> of human diseases<br />are <span>NO-related.</span>
              </h2>
              <p className="crisis-attrib">
                &mdash; Dr. Ferid Murad, Nobel Laureate in Physiology or Medicine, <em>Magical Nitric Oxide</em>
              </p>
              <p className="crisis-lead">
                Nitric oxide touches almost every system you own. When the signal weakens, the effects are not felt
                in one place &mdash; they are felt everywhere at once. Here is where, and here is the scale of it.
              </p>
            </div>

            {/* the six-systems map, built rather than dropped in as artwork, so
                the background is the brand navy and the centre is a nitric
                oxide core instead of an anatomical figure */}
            <div className="crisis-figure">
              <div className="nomap">
                <span className="nomap__eyebrow">One signal &middot; six systems</span>

                <div className="nomap__grid">
                  <div className="nomap__col nomap__col--left">
                    {noSystems.slice(0, 3).map((sys, i) => (
                      <motion.button
                        whileHover={{ x: -5 }}
                        key={sys.name}
                        className={`nomap__node accent-${i}`}
                        onClick={() => setModal(sys)}
                        aria-label={`Read more about ${sys.name}`}
                      >
                        <span className="nomap__txt">
                          <b>{sys.name}</b>
                          <small>{sys.conditions}</small>
                        </span>
                        <span className="nomap__icon"><sys.Icon /></span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="nomap__core" aria-hidden="true">
                    <span className="nomap__ring nomap__ring--a" />
                    <span className="nomap__ring nomap__ring--b" />
                    <span className="nomap__orb">
                      <b>NO</b>
                      <small>Nitric oxide</small>
                    </span>
                  </div>

                  <div className="nomap__col nomap__col--right">
                    {noSystems.slice(3).map((sys, i) => (
                      <motion.button
                        whileHover={{ x: 5 }}
                        key={sys.name}
                        className={`nomap__node accent-${i + 3}`}
                        onClick={() => setModal(sys)}
                        aria-label={`Read more about ${sys.name}`}
                      >
                        <span className="nomap__icon"><sys.Icon /></span>
                        <span className="nomap__txt">
                          <b>{sys.name}</b>
                          <small>{sys.conditions}</small>
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <p className="nomap__source">Source: Dr. Ferid Murad, <em>Magical Nitric Oxide</em></p>

                <figure className="panelslide panelslide--wide">
                  <Image src="/images/slide-six-systems.jpg" alt="" width={1600} height={900} loading="lazy" />
                  <figcaption className="panelslide__cap">From the original {brandSafe("BIO N:OV")} presentation</figcaption>
                </figure>
              </div>
            </div>
          </div>

          <p className="click-prompt light"><MousePointerClick size={17} /> Click any system to see what it means</p>
          <div className="crisis-grid">
            {noSystems.map(sys => (
              <motion.button
                whileHover={{ y: -6 }}
                key={sys.name}
                className="crisis-card"
                onClick={() => setModal(sys)}
              >
                <span className="crisis-card__icon"><sys.Icon /></span>
                <b>{sys.name}</b>
                <small>{sys.conditions}</small>
                <span className="crisis-card__more">Read <Plus size={17} /></span>
              </motion.button>
            ))}
          </div>

          <div className="burden-band">
            <h3>What that costs the world</h3>
            <p className="click-prompt light"><MousePointerClick size={17} /> Click any figure for the full picture</p>
            <div className="burden-grid">
              {burden.map(b => (
                <button key={b.name} className="burden-card" onClick={() => setModal(b)}>
                  <b>{b.figure}<em>{b.unit}</em></b>
                  <span>{b.name}</span>
                  <small>{b.source}</small>
                </button>
              ))}
            </div>
            <div className="slide-quad">
              <StatPanel panel={statPanels.hypertension} detail={slides.hypertension} onOpen={setModal} />
              <StatPanel panel={statPanels.diabetes}     detail={slides.diabetes}     onOpen={setModal} />
              <StatPanel panel={statPanels.stroke}       detail={slides.stroke}       onOpen={setModal} />
              <StatPanel panel={statPanels.dementia}     detail={slides.dementia}     onOpen={setModal} />
            </div>

            <p className="burden-note">
              Public-health statistics describing global disease burden, shown to explain why circulation matters.
              They are not claims about BIO N:OV. BIO N:OV is a wellness supplement, not a treatment for any
              condition, and must never replace prescribed medication.
            </p>
          </div>

          <div className="crisis-cta">
            <p>Your body makes less of this signal every decade. That is the part you can act on.</p>
            <a className="button primary" href="#product">See what BIO N:OV does <ArrowRight size={18} /></a>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Technology (clickable) ---------------- */}
      <Reveal id="technology" className="section tech tech--dark">
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

        <div className="slide-solo">
          <ItemPanel panel={itemPanels.techRoadmap} detail={slides.techRoadmap} onOpen={setModal} />
        </div>

        <div className="tech-showcase">
          <ItemPanel panel={itemPanels.patents} detail={slides.patents} onOpen={setModal} />

          <div className="tech-showcase__copy">
            <span className="eyebrow">What third generation means</span>
            <h3>Fermented first &mdash; so your body doesn&rsquo;t have to do the work.</h3>
            <p>
              First- and second-generation formulas hand your body a raw precursor and rely on it to make the
              conversion. That conversion depends on enzymes that grow less efficient with every decade &mdash;
              which is exactly why those formulas tend to disappoint the people who need them most.
            </p>
            <p>
              BIO N:OV moves that step out of your body and into the fermentation tank. Garlic and lettuce are
              transformed by a patented microbial process (KACC91554P) inside a GMP-certified Korean facility
              before the tablet is ever pressed.
            </p>
            <ul className="tech-showcase__list">
              <li><Check size={16} /> <span>Patented fermentation strain &mdash; KACC91554P</span></li>
              <li><Check size={16} /> <span>No enzyme conversion required inside your body</span></li>
              <li><Check size={16} /> <span>Works the same way at 60 as it does at 30</span></li>
              <li><Check size={16} /> <span>Naturally derived &mdash; fermented garlic and lettuce</span></li>
            </ul>
            <div className="tech-showcase__cta">
              <a className="button primary" href="#product">See the product <ArrowRight size={17} /></a>
              <a className="button glass" href="#affiliate">Join us as an affiliate <ArrowRight size={17} /></a>
            </div>
          </div>
        </div>

        <div className="nov-actions">
          <h3>What that third generation actually does</h3>
          <p className="click-prompt light"><MousePointerClick size={17} /> Click any effect for the full detail and its source</p>
          <div className="nov-actions__grid">
            {novActions.map(a => (
              <motion.button whileHover={{ y: -6 }} key={a.name} className="nov-action" onClick={() => setModal(a)}>
                <span className="nov-action__icon"><a.Icon /></span>
                <b>{a.name}</b>
                <strong>{a.headline}</strong>
                <span className="nov-action__more">Read the detail <Plus size={13} /></span>
              </motion.button>
            ))}
          </div>
          <p className="nov-actions__note">
            Figures and mechanisms from the manufacturer&rsquo;s product documentation and Bzzworld Smart Lab testing.
            This laboratory data is not intended or implied to be a substitute for professional medical advice,
            diagnosis or treatment. Individual results vary.
          </p>
        </div>
      </Reveal>

      {/* ---------------- Ingredients (clickable) ---------------- */}
      <Reveal className="ingredients-section">
        <div className="ing-inner">
          {/* heading spans the full width so the panel below can centre against
              the list itself rather than against heading-plus-list */}
          <div className="ing-head">
            <Heading
              light
              eyebrow="Premium raw materials"
              title="Naturally Derived. Thoughtfully Fermented."
              copy="Four raw materials, each chosen for what it contributes rather than for the label. Nothing exotic — this is food, fermented."
            />
            <p className="click-prompt light"><MousePointerClick size={17} /> Click any ingredient for the full story</p>
          </div>

          <div className="ing-body">
            {/* left: one row per raw material, each carrying its own photograph */}
            <div className="ing-list">
              {ingredients.map((ing, i) => (
                <motion.button
                  whileHover={{ x: 6 }}
                  key={ing.name}
                  className="ing-row"
                  onClick={() => setModal(ing)}
                  aria-label={`Read more about ${ing.name}`}
                >
                  <span className="ing-row__photo">
                    {ing.img
                      ? <Image src={`/images/${ing.img}`} alt={ing.name} fill sizes="150px" />
                      : <FlaskConical />}
                  </span>
                  <span className="ing-row__txt">
                    <span className="ing-row__no">Raw material {String(i + 1).padStart(2, "0")}</span>
                    <b>{ing.name}</b>
                    <small>{ing.short}</small>
                  </span>
                  <Plus size={18} className="row-plus" />
                </motion.button>
              ))}
            </div>

            {/* right: the manufacturer's own panel, showing all four together */}
            <div className="ing-stage">
<ItemPanel panel={itemPanels.rawMaterials} detail={slides.rawMaterials} onOpen={setModal} />
              <p className="slide-note">
                Confirm the complete authorised formula and exact ingredient naming on the market label for your
                country. Ingredient descriptions are reproduced from the manufacturer&rsquo;s product documentation.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Pillars (clickable) ---------------- */}
      <Reveal id="benefits" className="section benefits-section">
        <Heading
          light
          eyebrow="Five wellness pillars"
          title="Wellbeing, Viewed as a Whole"
          copy="Every pillar traces back to the same foundation: healthy flow. Click any pillar to read more."
        />
        <p className="click-prompt light"><MousePointerClick size={17} /> Click any pillar to read the full explanation</p>
        <div className="pillars pillars--dark">
          {pillars.map(p => (
            <motion.button whileHover={{ y: -8 }} key={p.name} onClick={() => setModal(p)} aria-label={`Read more about ${p.name}`}>
              <p.Icon />
              <h3>{p.name}</h3>
              <p>{p.short}</p>
              <span className="learn-more">Learn more <ArrowRight size={15} /></span>
            </motion.button>
          ))}
        </div>

        {/* ---- Why the manufacturer calls it the better choice ---- */}
        <div className="better-block">
          {/* copy spans the full width so the panel centres against the five
              reasons rather than against copy-plus-reasons */}
          <div className="better-copy">
            <span className="eyebrow">The five objections, answered</span>
            <h3>Why they call it the better choice</h3>
            <p>
              Every one of these answers a question people actually ask before they buy: is it natural, will it work
              for someone my age, how long before anything happens, does my body have to do the work, and will I end
              up dependent on it.
            </p>
            <p className="click-prompt light" style={{ marginTop: 4 }}>
              <MousePointerClick size={17} /> Click any reason for the full answer
            </p>
          </div>

          <div className="better-body">
            <div className="better-grid">
              {betterReasons.map(r => (
                <motion.button
                  whileHover={{ x: 5 }}
                  key={r.name}
                  className="better-card"
                  onClick={() => setModal(r)}
                  aria-label={`Read more about ${r.name}`}
                >
                  <span className="better-card__icon"><r.Icon /></span>
                  <span className="better-card__txt">
                    <b>{r.name}</b>
                    <small>{r.headline}</small>
                  </span>
                  <Plus size={17} className="row-plus" />
                </motion.button>
              ))}
            </div>

            <figure className="better-figure">
              <Image
                src="/images/tech-product.jpg"
                alt="BIO N:OV carton and tablets surrounded by nitric oxide molecules"
                width={1280}
                height={720}
                sizes="(max-width: 1000px) 100vw, 52vw"
              />
              <figcaption>500 mg &times; 60 tablets &middot; GMP-certified Korean manufacture</figcaption>
            </figure>
          </div>

          <figure className="panelslide panelslide--wide">
            <Image src="/images/slide-better-choice.jpg" alt="" width={1600} height={900} loading="lazy" />
            <figcaption className="panelslide__cap">From the original {brandSafe("BIO N:OV")} presentation</figcaption>
          </figure>
        </div>

        <div className="slide-quad slide-pair--spaced">
          <StatPanel panel={statPanels.vigor}        detail={slides.vigor}        onOpen={setModal} />
          <StatPanel panel={statPanels.diabetesEase} detail={slides.diabetesEase} onOpen={setModal} />
          <StatPanel panel={statPanels.telomeres}    detail={slides.telomeres}    onOpen={setModal} />
          <StatPanel panel={statPanels.skin}         detail={slides.skin}         onOpen={setModal} />
        </div>

        <div className="benefits-cta">
          <p>Every claim on this page points at the same thing: keep the road open, and the whole system is served.</p>
          <a className="button primary" href="#product">See the product <ArrowRight size={18} /></a>
          <a className="button glass" href="#affiliate">Join us as an affiliate <ArrowRight size={18} /></a>
        </div>

        <p className="slide-note">
          Panels reproduced from the manufacturer&rsquo;s product documentation with their stated sources. Tester-reported
          outcomes are not a clinical trial and individual results vary. BIO N:OV is a wellness supplement, not a
          treatment for any condition, and must never replace prescribed medication. Speak to your doctor before
          changing anything you are already taking.
        </p>
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
      <Reveal id="team" className="team-section">
        <div className="team-inner">
          <div className="team-head">
            <Heading
              light
              eyebrow="People behind the science"
              title="Science & Research Team"
              copy="BIO N:OV was developed with researchers from Korean universities and medical schools — eight specialists across nitric oxide biology, cardiovascular research, metabolism and regenerative medicine."
            />
            <div className="team-creds">
              <div><b>8</b><span>Specialists</span></div>
              <div><b>5</b><span>Universities &amp; medical schools</span></div>
              <div><b>KACC91554P</b><span>Patented fermentation strain</span></div>
            </div>
            <p className="click-prompt light"><MousePointerClick size={17} /> Click any researcher to open their full profile</p>
          </div>

          <div className="research-grid">
            {researchers.map(r => (
              <motion.button
                whileHover={{ y: -8 }}
                key={r.name}
                className="research-card"
                onClick={() => setModal({
                  title: r.name,
                  subtitle: r.org,
                  body: [r.role, "Professional titles, affiliations and research information are transcribed from the supplied product presentation and require verification and written permission before public use."],
                  points: r.focus
                })}
                aria-label={`Read more about ${r.name}`}
              >
                <span className="research-photo">
                  <Image src={`/images/${r.img}`} alt={`Portrait of ${r.name}`} width={320} height={320} />
                </span>
                <span className="research-body">
                  <b>{r.name}</b>
                  <em>{r.org}</em>
                  <small>{r.role}</small>
                  <span className="research-more">View profile <Plus size={16} /></span>
                </span>
              </motion.button>
            ))}
          </div>

          <p className="slide-note">
            Professional titles, affiliations, portraits and research information are transcribed from the supplied
            product presentation. All of it must be verified and written permission obtained from each named
            individual and institution before this page is published or used in advertising.
          </p>
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
            <h2 className="notranslate" translate="no">BIO N:OV</h2>
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
            <div className="showcase-trust">
              <span><ShieldCheck size={16} /> GMP-certified manufacture</span>
              <span><FlaskConical size={16} /> Patented strain KACC91554P</span>
              <span><Leaf size={16} /> Naturally derived, fermented</span>
            </div>

            <div className="showcase-box">
              <b>Every box contains</b>
              <ul>
                <li><Check size={15} /><span>60 tablets &times; 500 mg (30 g net)</span></li>
                <li><Check size={15} /><span>A 20-day supply at three tablets daily</span></li>
                <li><Check size={15} /><span>Sealed blister packs, manufactured in Korea</span></li>
              </ul>
            </div>

            <div className="showcase-cta">
              <a className="button primary" href="/product">Buy {brandSafe("BIO N:OV")} <ArrowRight size={18} /></a>
              <a className="button glass" href="#affiliate">Join us as an affiliate <ArrowRight size={18} /></a>
            </div>
            <p className="showcase-note">
              Single boxes and multi-box bundles are priced in Singapore dollars and checked out securely through our
              store. Prefer to partner instead? Join the affiliate programme.
            </p>
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
      <Reveal id="faq" className="faq-section">
        <div className="faq-inner">
          <div className="faq-head">
            <Heading
              light
              eyebrow="Clear answers"
              title="Frequently Asked Questions"
              copy="The science, the product, the safety rules and how to buy — answered straight, with the sources named."
            />
          </div>

          {faqGroups.map(group => (
            <div className="faq-group" key={group}>
              <h3 className="faq-group__title">{group}</h3>
              <div className="faq-list">
                {faq.map((x, i) => x.group === group && (
                  <article key={x.question} className={openFaq === i ? "is-open" : ""}>
                    <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                      <span>{brandSafe(x.question)}</span>
                      <ChevronDown className={openFaq === i ? "rotate" : ""} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {brandSafe(x.answer)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <div className="faq-cta">
            <div>
              <b>Still have a question?</b>
              <span>Ask us directly — we answer every enquiry personally before the store opens.</span>
            </div>
            <div className="faq-cta__buttons">
              <a className="button primary" href="#contact">Ask us a question <ArrowRight size={18} /></a>
              <a className="button glass" href="#affiliate">Join us as an affiliate <ArrowRight size={18} /></a>
            </div>
          </div>
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
            <b className="notranslate" translate="no">BIO N:OV</b>
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
            <a href="#home" className="brand notranslate" translate="no"><span className="brand-mark">V</span><span>BIO N:OV</span></a>
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
