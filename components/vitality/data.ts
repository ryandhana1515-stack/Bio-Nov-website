/**
 * BIO N:OV — Interactive body visualization configuration.
 *
 * Ported from the "Vitality Explorer" Lovable project (a7da8f5e). The narration
 * script, storyboards, timecodes and annotations are carried across verbatim so
 * the experience matches the one signed off there.
 *
 * Each topic is a short cinematic medical explainer built from a STORYBOARD: an
 * ordered list of shots, each with its own narration line, camera framing and
 * dedicated footage. Shot timecodes are DERIVED from the length of the spoken
 * line (see `timeStoryboard`), so a cut always lands on the sentence it
 * illustrates and the narration never runs out of picture.
 *
 * MEDIA. The footage lives on the published Lovable project rather than in this
 * repository: sixty-odd clips come to roughly two hundred megabytes, which does
 * not belong in git and should not be copied into every build. The browser
 * streams only the clip currently on screen. Point MEDIA_BASE somewhere else and
 * every path below follows.
 */

export const MEDIA_BASE = "https://bionov-vitality-explorer.lovable.app";

/** A single piece of footage in the shot bank. */
export type ClipId =
  | "bodyNetwork" | "heart" | "aorta" | "redCells" | "capillaries" | "endothelium"
  | "lungs" | "alveoli" | "muscle" | "mitochondria" | "carotid" | "cerebral"
  | "neurons" | "brain" | "gutOrgans" | "villi" | "liver" | "cellUptake"
  | "whiteCell" | "migration" | "signalling" | "vesselAgeing" | "cellActivity"
  | "pullback" | "torsoBreath" | "headEstablish" | "torsoDigestive"
  | "bloodstreamEntry" | "fullSilhouette" | "oxygenBlood" | "tissueDelivery"
  | "mitoEnergy" | "microOxygen" | "brainNetwork" | "nutrientTransport"
  | "immuneVessel" | "muscleAgeing" | "pullbackVitality" | "pullbackCognition"
  | "pullbackMetabolic" | "pullbackImmune" | "pullbackAgeing" | "redCellsCrowd"
  | "elderPortrait" | "faceToBrain" | "digestiveOpen" | "vesselOpen"
  | "bodyBloodFlow" | "headDemand" | "carotidFlow" | "gutEnzymes" | "elderHome"
  | "arterialNetwork" | "smallVessels" | "tissueOxygen" | "veinsReturn"
  | "venaCavaHeart" | "heartFlow" | "bodyInternal" | "elderWindow";

/** Every clip is a 1280-wide H.264 MP4, hardware-decoded in every browser. */
const clip = (file: string) => `${MEDIA_BASE}/videos/hd/${file}.mp4`;

export const clipSources: Record<ClipId, string> = {
  bodyNetwork: clip("shot-body-network"),
  heart: clip("shot-heart"),
  aorta: clip("shot-aorta"),
  redCells: clip("shot-red-cells"),
  capillaries: clip("shot-capillaries"),
  endothelium: clip("shot-endothelium"),
  lungs: clip("shot-lungs"),
  alveoli: clip("shot-alveoli"),
  muscle: clip("shot-muscle"),
  mitochondria: clip("shot-mitochondria"),
  carotid: clip("shot-carotid"),
  cerebral: clip("shot-cerebral"),
  neurons: clip("shot-neurons"),
  brain: clip("shot-brain"),
  gutOrgans: clip("shot-gut-organs"),
  villi: clip("shot-villi"),
  liver: clip("shot-liver"),
  cellUptake: clip("shot-cell-uptake"),
  whiteCell: clip("shot-white-cell"),
  migration: clip("shot-migration"),
  signalling: clip("shot-signalling"),
  vesselAgeing: clip("shot-vessel-ageing"),
  cellActivity: clip("shot-cell-activity"),
  pullback: clip("shot-full-body-pullback"),
  torsoBreath: clip("shot-torso-breath"),
  headEstablish: clip("shot-head-establish"),
  torsoDigestive: clip("shot-torso-digestive"),
  bloodstreamEntry: clip("shot-bloodstream-entry"),
  fullSilhouette: clip("shot-full-silhouette"),
  oxygenBlood: clip("shot-oxygen-blood"),
  tissueDelivery: clip("shot-tissue-delivery"),
  mitoEnergy: clip("shot-mito-energy"),
  microOxygen: clip("shot-micro-oxygen"),
  brainNetwork: clip("shot-brain-network"),
  nutrientTransport: clip("shot-nutrient-transport"),
  immuneVessel: clip("shot-immune-vessel"),
  muscleAgeing: clip("shot-muscle-ageing"),
  pullbackVitality: clip("shot-pullback-vitality"),
  pullbackCognition: clip("shot-pullback-cognition"),
  pullbackMetabolic: clip("shot-pullback-metabolic"),
  pullbackImmune: clip("shot-pullback-immune"),
  pullbackAgeing: clip("shot-pullback-ageing"),
  redCellsCrowd: clip("shot-red-cells-crowd"),
  elderPortrait: clip("shot-elder-portrait"),
  faceToBrain: clip("shot-face-to-brain"),
  digestiveOpen: clip("shot-digestive-open"),
  vesselOpen: clip("shot-vessel-open"),
  bodyBloodFlow: clip("shot-body-blood-flow"),
  headDemand: clip("shot-head-demand"),
  carotidFlow: clip("shot-carotid-flow"),
  gutEnzymes: clip("shot-gut-enzymes"),
  elderHome: clip("shot-elder-home"),
  arterialNetwork: clip("shot-arterial-network"),
  smallVessels: clip("shot-small-vessels"),
  tissueOxygen: clip("shot-tissue-oxygen"),
  veinsReturn: clip("shot-veins-return"),
  venaCavaHeart: clip("shot-vena-cava-heart"),
  heartFlow: clip("shot-heart-flow"),
  bodyInternal: clip("shot-body-internal"),
  elderWindow: clip("shot-elder-window"),
};

export type VisualizationId =
  | "circulation" | "vitality" | "cognition" | "metabolic" | "immune" | "ageing";

/** Camera framing for a shot — drives the synthetic camera move on the footage. */
export type Framing = "wide" | "approach" | "inside" | "micro" | "pullback";

export type Shot = {
  start: number;
  end: number;
  /** Short shot title, e.g. "Inside the aorta". */
  shot: string;
  /** The narration sentence spoken over this shot. */
  line: string;
  /** What must be visible on screen for this line. */
  visual: string;
  /** Dedicated footage for this shot — matches the sentence exactly. */
  clip: ClipId;
  framing: Framing;
  /** Callout drawn over the footage; x/y are percentages of the frame. */
  annotation: { label: string; note: string; x: number; y: number };
};

type ShotSeed = Omit<Shot, "start" | "end">;

export type Visualization = {
  id: VisualizationId;
  title: string;
  menuDescription: string;
  label: string;
  caption: string;
  storyboard: Shot[];
  duration: number;
  poster: string;
  narration: string;
  icon: "droplet" | "wind" | "brain" | "activity" | "shield" | "hourglass";
};

/** Narration pace of the studio voice, in words per second. */
const WORDS_PER_SECOND = 2.35;

/** Derives shot timecodes from how long each line takes to speak. */
const timeStoryboard = (seeds: ShotSeed[]): Shot[] => {
  let cursor = 0;
  return seeds.map((seed) => {
    const words = (seed.line.match(/\S+/g) ?? []).length;
    const span = Math.max(words / WORDS_PER_SECOND, 3.2);
    const shot = { ...seed, start: Number(cursor.toFixed(2)), end: Number((cursor + span).toFixed(2)) };
    cursor += span;
    return shot;
  });
};

const storyboards: Record<VisualizationId, ShotSeed[]> = {
  circulation: [
    { shot: "Establish — the whole body",
      line: "Your cardiovascular system is a closed, pressurised network of roughly one hundred thousand kilometres of vessels, and every single cell you own depends on it.",
      visual: "Real human body with red arterial and blue venous blood visibly flowing throughout.",
      clip: "bodyBloodFlow", framing: "wide",
      annotation: { label: "Vascular network", note: "~100,000 km of vessels", x: 52, y: 44 } },
    { shot: "The heart",
      line: "At the centre of that network the heart contracts about sixty to eighty times a minute, generating the pressure wave that moves five litres of blood through the whole body every minute.",
      visual: "Camera pushes into the chest; the beating heart fills the frame.",
      clip: "heartFlow", framing: "approach",
      annotation: { label: "Heart", note: "60–80 beats · 5 L per minute", x: 50, y: 48 } },
    { shot: "Blood leaves the heart",
      line: "Blood leaves the left ventricle into the aorta, whose elastic walls stretch with each beat and recoil between beats to keep the flow smooth and continuous rather than pulsing violently.",
      visual: "Cut inside the aorta — vessel wall passing, flow moving away from the heart.",
      clip: "aorta", framing: "inside",
      annotation: { label: "Aorta", note: "Blood leaving the heart", x: 28, y: 32 } },
    { shot: "The arterial network",
      line: "From the aorta the blood travels outward through the arteries, thick muscular vessels that carry it under pressure into every region of the body.",
      visual: "Red arterial tree branching through the torso and limbs, flow moving outward.",
      clip: "arterialNetwork", framing: "wide",
      annotation: { label: "Arteries", note: "Carrying blood away from the heart", x: 46, y: 42 } },
    { shot: "Red blood cells in the current",
      line: "Inside that current, red blood cells deform and slip past one another, each carrying oxygen bound to haemoglobin and releasing it exactly where the tissue demand is highest.",
      visual: "Macro on red blood cells streaming past in pulsatile waves.",
      clip: "redCells", framing: "micro",
      annotation: { label: "Red blood cell", note: "Oxygen carried on haemoglobin", x: 62, y: 52 } },
    { shot: "Into smaller vessels",
      line: "The arteries then divide into smaller and smaller vessels called arterioles, and as each one narrows the flow slows down so that delivery can happen gently.",
      visual: "Interior of an artery narrowing step by step into arterioles.",
      clip: "smallVessels", framing: "inside",
      annotation: { label: "Arterioles", note: "Vessels narrow · flow slows", x: 44, y: 48 } },
    { shot: "Capillaries",
      line: "Finally the vessels become capillaries so fine that cells must pass in single file, and it is here, across a membrane thinner than a wavelength of light, that exchange with your tissue takes place.",
      visual: "Zoom into a dense capillary network, single-file cells.",
      clip: "capillaries", framing: "micro",
      annotation: { label: "Capillaries", note: "Single-file cells · thinnest walls", x: 40, y: 62 } },
    { shot: "Oxygen and nutrients reach the cells",
      line: "Through those thin walls oxygen and nutrients pass out of the blood and into the surrounding cells, which is the entire reason circulation exists.",
      visual: "Oxygen leaving a capillary and entering living tissue cells.",
      clip: "tissueOxygen", framing: "micro",
      annotation: { label: "Delivery to tissue", note: "Oxygen & nutrients enter the cells", x: 56, y: 56 } },
    { shot: "The endothelium",
      line: "How well that delivery works depends on the endothelium, the single living layer lining every vessel, which relaxes and widens the vessel so blood reaches the smallest capillary beds without resistance.",
      visual: "Micro shot of the vessel lining relaxing, flow widening through it.",
      clip: "endothelium", framing: "micro",
      annotation: { label: "Endothelium", note: "One cell thick · controls vessel width", x: 30, y: 60 } },
    { shot: "Veins",
      line: "Having given up its oxygen, the blood collects into the veins, thinner vessels with one-way valves that keep it moving in a single direction and never let it fall backwards.",
      visual: "Clearly blue veins with valves opening and closing, dark blood flowing one way.",
      clip: "veinsReturn", framing: "inside",
      annotation: { label: "Veins", note: "One-way valves · blood returning", x: 48, y: 50 } },
    { shot: "Return to the heart",
      line: "That returning blood travels back up through the great veins into the right side of the heart, where it is sent to the lungs for fresh oxygen and the whole circuit begins again.",
      visual: "Dark venous blood entering the right heart, then moving toward the lungs.",
      clip: "venaCavaHeart", framing: "approach",
      annotation: { label: "Back to the heart", note: "Then to the lungs · circuit repeats", x: 50, y: 46 } },
    { shot: "Pull back — whole body",
      line: "This is precisely where BIO N:OV is designed to matter, supporting healthy circulation and vascular function so that oxygen, nutrients and cellular signals keep reaching every system you rely on.",
      visual: "Pull outward to the whole body with circulation active throughout.",
      clip: "pullback", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Supports circulation & vascular function", x: 50, y: 40 } },
  ],
  vitality: [
    { shot: "Upper torso",
      line: "Energy in the human body is not something you simply feel, it is manufactured continuously inside your cells, and it begins with a single breath.",
      visual: "Wide shot of the upper torso, respiratory system highlighted.",
      clip: "torsoBreath", framing: "wide",
      annotation: { label: "Respiratory system", note: "Energy starts with one breath", x: 50, y: 46 } },
    { shot: "Inside the lungs",
      line: "Air travels down the branching airways into roughly three hundred million alveoli, giving your lungs an internal surface area close to that of a tennis court.",
      visual: "Camera enters the lungs; lobes expand, bronchial tree fills with air.",
      clip: "lungs", framing: "approach",
      annotation: { label: "Lungs", note: "~300 million alveoli", x: 44, y: 40 } },
    { shot: "Lung–blood interface",
      line: "Across that surface oxygen diffuses in less than a quarter of a second into the capillary blood, while carbon dioxide moves the other way in the same instant.",
      visual: "Micro shot of alveoli, oxygen particles crossing into capillaries.",
      clip: "alveoli", framing: "micro",
      annotation: { label: "Gas exchange", note: "O₂ in, CO₂ out · under 0.25 s", x: 58, y: 54 } },
    { shot: "Oxygen-rich blood",
      line: "Oxygen binds to haemoglobin, and the enriched blood returns to the heart to be driven out again into the systemic circulation under pressure.",
      visual: "Oxygen loading onto red cells, flow moving toward the heart.",
      clip: "oxygenBlood", framing: "inside",
      annotation: { label: "Oxygenated blood", note: "Haemoglobin fully loaded", x: 60, y: 46 } },
    { shot: "Delivery to tissue",
      line: "In working muscle, capillaries open and blood flow can rise many times over resting levels, because the tissue is signalling that it needs more fuel right now.",
      visual: "Flow arriving in muscle tissue vessels, oxygen released.",
      clip: "tissueDelivery", framing: "inside",
      annotation: { label: "Muscle capillary", note: "Flow rises on demand", x: 36, y: 58 } },
    { shot: "Inside the mitochondrion",
      line: "Within each cell the mitochondria take that oxygen and use it to convert nutrients into adenosine triphosphate, the universal energy currency that powers every heartbeat, every thought and every movement.",
      visual: "Micro shot inside a cell, mitochondria producing energy.",
      clip: "mitoEnergy", framing: "micro",
      annotation: { label: "Mitochondria", note: "ATP — the body's energy currency", x: 55, y: 50 } },
    { shot: "Pull back",
      line: "Because that entire chain depends on efficient delivery, BIO N:OV focuses on supporting circulation and oxygen transport, which is the foundation of genuine, sustained daily energy rather than a short stimulant lift.",
      visual: "Pull back through tissue to the whole torso.",
      clip: "pullbackVitality", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Oxygen transport = sustained energy", x: 50, y: 40 } },
  ],
  cognition: [
    { shot: "Head and upper body",
      line: "Your brain is about two percent of your body weight, yet it consumes roughly twenty percent of the oxygen and glucose you take in, which makes it the most flow-dependent organ you have.",
      visual: "Real head turning translucent; the brain glows as it burns oxygen and glucose.",
      clip: "headDemand", framing: "wide",
      annotation: { label: "Brain", note: "2% of body weight · 20% of oxygen", x: 50, y: 36 } },
    { shot: "Blood travelling upward",
      line: "Blood rises through the carotid and vertebral arteries at close to three quarters of a litre every minute, and that supply cannot be interrupted for even a few seconds without a loss of function.",
      visual: "Red blood visibly rushing upward through the carotid arteries into the head.",
      clip: "carotidFlow", framing: "approach",
      annotation: { label: "Carotid artery", note: "~750 ml of blood per minute", x: 42, y: 50 } },
    { shot: "Cerebral vessels",
      line: "Inside the brain the vessels divide into an extraordinarily fine network, so dense that almost no neuron sits more than a few cell widths away from a capillary.",
      visual: "Cut inside cerebral vasculature, dense fine branching.",
      clip: "cerebral", framing: "inside",
      annotation: { label: "Cerebral microvessels", note: "Every neuron sits beside a capillary", x: 58, y: 44 } },
    { shot: "Oxygen delivery, micro",
      line: "Through those capillary walls, oxygen and glucose pass into brain tissue, and because neurons store almost no fuel of their own they rely entirely on this moment-to-moment delivery.",
      visual: "Macro on red cells in a capillary releasing oxygen into tissue.",
      clip: "microOxygen", framing: "micro",
      annotation: { label: "Oxygen & glucose", note: "Neurons hold no fuel reserve", x: 62, y: 56 } },
    { shot: "Neurons",
      line: "When a region becomes active, local blood flow increases to meet it within seconds, a coupling that researchers call neurovascular coupling and that underlies clear, responsive thinking.",
      visual: "Transition to neurons, signals travelling along axons.",
      clip: "neurons", framing: "inside",
      annotation: { label: "Neurovascular coupling", note: "Activity pulls in more blood flow", x: 36, y: 42 } },
    { shot: "Brain network",
      line: "Well-perfused neurons fire cleanly and communicate across networks with the timing precision that attention, memory formation and mental stamina all depend on.",
      visual: "Signalling spreading through a realistic brain network.",
      clip: "brainNetwork", framing: "micro",
      annotation: { label: "Neural network", note: "Attention · memory · stamina", x: 50, y: 44 } },
    { shot: "Reveal the brain",
      line: "This is why BIO N:OV is built around vascular health, because supporting cerebral blood flow is one of the most direct ways to support clarity, focus and long-term cognitive resilience.",
      visual: "Pull back to reveal the whole brain, calm and steady.",
      clip: "pullbackCognition", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Cerebral blood flow = clarity & focus", x: 50, y: 40 } },
  ],
  metabolic: [
    { shot: "Torso and digestive system",
      line: "Metabolism is the sum of every chemical reaction that keeps you alive, and it starts with how efficiently your body extracts and distributes what you eat.",
      visual: "Wide torso shot, digestive organs and liver highlighted.",
      clip: "digestiveOpen", framing: "wide",
      annotation: { label: "Digestive system", note: "Extract, then distribute", x: 50, y: 50 } },
    { shot: "Toward the organs",
      line: "Food is broken down through the stomach and small intestine, where enzymes reduce it to amino acids, fatty acids and simple sugars small enough to be absorbed.",
      visual: "Enzymes visibly dissolving food into amino acids, fatty acids and sugars.",
      clip: "gutEnzymes", framing: "approach",
      annotation: { label: "Small intestine", note: "Enzymes break food into building blocks", x: 46, y: 54 } },
    { shot: "Absorptive surface",
      line: "The intestinal lining is folded into villi and microvilli, expanding the absorptive surface to around thirty square metres so that very little of what you consume is wasted.",
      visual: "Conceptual breakdown of nutrient molecules in the gut lining.",
      clip: "villi", framing: "inside",
      annotation: { label: "Villi", note: "~30 m² of absorptive surface", x: 40, y: 44 } },
    { shot: "Into circulation",
      line: "Those molecules cross into the capillary blood and travel first to the liver, which decides in real time what is stored, what is converted and what is released for immediate use.",
      visual: "Molecules crossing the intestinal wall into a capillary.",
      clip: "liver", framing: "micro",
      annotation: { label: "Liver", note: "Store · convert · release", x: 56, y: 48 } },
    { shot: "Transport",
      line: "From there the bloodstream carries fuel and hormonal signals such as insulin to every tissue, coordinating whether the body is storing energy or spending it.",
      visual: "Nutrients travelling with the flow through branching vessels.",
      clip: "nutrientTransport", framing: "inside",
      annotation: { label: "Nutrient transport", note: "Fuel and insulin signals in the blood", x: 34, y: 40 } },
    { shot: "Reaching cells",
      line: "At the cell membrane, transporters draw glucose and amino acids inside, and mitochondria oxidise them to release the energy that keeps metabolic rate steady.",
      visual: "Micro shot of nutrients entering cells and being used.",
      clip: "cellUptake", framing: "micro",
      annotation: { label: "Cellular uptake", note: "Glucose enters · energy released", x: 60, y: 54 } },
    { shot: "Pull back",
      line: "Every one of those steps is a delivery problem before it is a chemical one, and that is why BIO N:OV supports circulation and nutrient transport as the groundwork for healthy metabolic function.",
      visual: "Pull back through tissue to the whole torso.",
      clip: "pullbackMetabolic", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Delivery first, chemistry second", x: 50, y: 40 } },
  ],
  immune: [
    { shot: "Enter the bloodstream",
      line: "Your immune system is not a single organ, it is a mobile population of billions of cells that patrols the entire body through the bloodstream and lymphatic vessels.",
      visual: "Camera enters a vessel, wall texture passing by.",
      clip: "vesselOpen", framing: "approach",
      annotation: { label: "Bloodstream patrol", note: "Billions of mobile immune cells", x: 48, y: 44 } },
    { shot: "Red cells pass",
      line: "Red blood cells dominate the current, crowding the centre of the vessel while the larger white cells are pushed gently toward the wall where they can sense what is happening in the tissue.",
      visual: "Red blood cells rushing past the lens.",
      clip: "redCellsCrowd", framing: "inside",
      annotation: { label: "Red cells", note: "Centre of the flow · white cells to the wall", x: 58, y: 52 } },
    { shot: "Reveal a white blood cell",
      line: "Among them travel neutrophils, monocytes and lymphocytes, each reading chemical signals released by tissue that needs attention.",
      visual: "A white blood cell revealed among the red cells.",
      clip: "whiteCell", framing: "inside",
      annotation: { label: "White blood cell", note: "Reads chemical distress signals", x: 44, y: 46 } },
    { shot: "Follow the immune cell",
      line: "When a signal is detected, the immune cell begins to roll along the endothelium, slowing itself against the flow before committing to the site.",
      visual: "Camera tracks a single white blood cell through the vessel.",
      clip: "immuneVessel", framing: "micro",
      annotation: { label: "Rolling adhesion", note: "Slowing against the current", x: 34, y: 58 } },
    { shot: "Into tissue",
      line: "It then squeezes between the endothelial cells and crosses into the tissue, a controlled migration that can happen within minutes of the first alert.",
      visual: "The immune cell squeezing through the wall into tissue.",
      clip: "migration", framing: "inside",
      annotation: { label: "Migration", note: "Crossing the vessel wall in minutes", x: 52, y: 56 } },
    { shot: "Cellular communication",
      line: "Once inside, cells communicate with cytokines and other molecular messengers, coordinating a proportionate response and, just as importantly, knowing when to stand down.",
      visual: "Subtle molecular signalling between cells.",
      clip: "signalling", framing: "micro",
      annotation: { label: "Cytokine signalling", note: "Proportionate response · then stand down", x: 60, y: 44 } },
    { shot: "Pull back",
      line: "None of that surveillance works without good blood flow to carry it, so BIO N:OV supports healthy circulation and vascular function as part of keeping your natural defences responsive.",
      visual: "Pull back to immune cells travelling body-wide.",
      clip: "pullbackImmune", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Blood flow carries your defences", x: 50, y: 40 } },
  ],
  ageing: [
    { shot: "A life already lived",
      line: "Most of us only notice ageing when we feel it, a little less energy in the afternoon, a longer recovery, a heart that has been beating faithfully for decades.",
      visual: "An older man stands calmly in the daylight by his window, relaxed and unhurried.",
      clip: "elderWindow", framing: "wide",
      annotation: { label: "Ageing is felt before it is seen", note: "Energy · recovery · resilience", x: 50, y: 74 } },
    { shot: "Beneath the hand",
      line: "Beneath that hand the heart has completed more than two billion contractions, and everything you feel as vitality begins with how well it still moves blood.",
      visual: "Into the beating heart: blood visibly flowing through the chambers and out the aorta.",
      clip: "heartFlow", framing: "approach",
      annotation: { label: "The heart", note: "Over 2 billion beats", x: 50, y: 48 } },
    { shot: "Inside the whole body",
      line: "Ageing is not one process but many, unfolding quietly at the level of cells, vessels and mitochondria long before anyone notices a change.",
      visual: "The body turns translucent — heart, vessels and organs visible working inside.",
      clip: "bodyInternal", framing: "wide",
      annotation: { label: "Whole-body ageing", note: "Cells · vessels · mitochondria", x: 50, y: 48 } },
    { shot: "Cardiovascular system",
      line: "With time, arteries tend to become stiffer and the endothelium becomes less responsive, which gradually reduces how easily blood reaches the smallest vessels.",
      visual: "Push toward the heart and vascular network.",
      clip: "vesselAgeing", framing: "approach",
      annotation: { label: "Arterial stiffening", note: "Less responsive endothelium", x: 40, y: 46 } },
    { shot: "The brain",
      line: "Because the brain has no fuel reserve, even a modest decline in microvascular perfusion can be felt as slower recall and reduced mental stamina.",
      visual: "Transition to the brain, signalling active.",
      clip: "brain", framing: "inside",
      annotation: { label: "Microvascular perfusion", note: "No fuel reserve in the brain", x: 54, y: 42 } },
    { shot: "Muscle tissue",
      line: "In muscle, capillary density and mitochondrial efficiency both matter, which is why strength and endurance depend as much on delivery as on the tissue itself.",
      visual: "Camera enters muscle tissue fibres.",
      clip: "muscleAgeing", framing: "inside",
      annotation: { label: "Capillary density", note: "Strength depends on delivery", x: 38, y: 54 } },
    { shot: "Microscopic cells",
      line: "At the cellular level, energy production, repair and clearance continue every second, and their efficiency is what researchers describe as biological rather than chronological age.",
      visual: "Micro shot of cellular activity.",
      clip: "cellActivity", framing: "micro",
      annotation: { label: "Biological age", note: "Energy · repair · clearance", x: 58, y: 50 } },
    { shot: "Change over time",
      line: "The encouraging part is that these systems remain responsive, and supporting circulation and cellular energy is one of the most studied ways to help them stay that way.",
      visual: "Cellular activity shifting slowly, respectfully — no face morph.",
      clip: "mitochondria", framing: "micro",
      annotation: { label: "Still responsive", note: "Circulation & cellular energy", x: 46, y: 46 } },
    { shot: "Pull back through the body",
      line: "That is the purpose of BIO N:OV, to support vascular health and cellular vitality so the body can keep functioning well through every stage of life.",
      visual: "Pull back out through the body to the full figure.",
      clip: "pullbackAgeing", framing: "pullback",
      annotation: { label: "Why BIO N:OV", note: "Vascular health for every stage of life", x: 50, y: 40 } },
  ],
};

type Draft = Omit<Visualization, "narration" | "duration" | "storyboard"> & { seeds: ShotSeed[] };

const poster = (file: string) => `${MEDIA_BASE}/posters/${file}.jpg`;

const drafts: Record<VisualizationId, Draft> = {
  circulation: {
    id: "circulation", title: "Circulation",
    menuDescription: "How blood travels through the cardiovascular system.",
    label: "Circulation",
    caption: "How the heart, arteries and capillaries deliver oxygen to every cell — and where BIO N:OV supports that flow.",
    seeds: storyboards.circulation, poster: poster("circulation"), icon: "droplet",
  },
  vitality: {
    id: "vitality", title: "Vitality & Energy",
    menuDescription: "Oxygen delivery and the body's energy systems.",
    label: "Vitality & Energy",
    caption: "From the first breath to mitochondrial energy production — why delivery, not stimulation, creates real energy.",
    seeds: storyboards.vitality, poster: poster("vitality-energy"), icon: "wind",
  },
  cognition: {
    id: "cognition", title: "Cognition & Clarity",
    menuDescription: "Circulation and communication inside the brain.",
    label: "Cognition & Clarity",
    caption: "The brain uses a fifth of your oxygen with no reserve of its own — cerebral blood flow is clarity itself.",
    seeds: storyboards.cognition, poster: poster("cognition-clarity"), icon: "brain",
  },
  metabolic: {
    id: "metabolic", title: "Metabolic Support",
    menuDescription: "Nutrients processed, transported and used.",
    label: "Metabolic Support",
    caption: "Absorption, liver processing, transport and cellular uptake — metabolism is a delivery problem first.",
    seeds: storyboards.metabolic, poster: poster("metabolic-support"), icon: "activity",
  },
  immune: {
    id: "immune", title: "Immune Function",
    menuDescription: "How immune cells travel and communicate.",
    label: "Immune Function",
    caption: "Billions of immune cells patrol the body through the bloodstream — good flow is what carries the response.",
    seeds: storyboards.immune, poster: poster("immune-function"), icon: "shield",
  },
  ageing: {
    id: "ageing", title: "Healthy Ageing",
    menuDescription: "Biological systems that change over time.",
    label: "Healthy Ageing",
    caption: "Vessel stiffness, microvascular perfusion and mitochondrial efficiency — the biology behind biological age.",
    seeds: storyboards.ageing, poster: poster("healthy-ageing"), icon: "hourglass",
  },
};

const build = ({ seeds, ...draft }: Draft): Visualization => {
  const storyboard = timeStoryboard(seeds);
  return {
    ...draft,
    storyboard,
    duration: storyboard[storyboard.length - 1]?.end ?? 18,
    narration: storyboard.map((shot) => shot.line).join(" "),
  };
};

export const bodyVisualizations: Record<VisualizationId, Visualization> = {
  circulation: build(drafts.circulation),
  vitality: build(drafts.vitality),
  cognition: build(drafts.cognition),
  metabolic: build(drafts.metabolic),
  immune: build(drafts.immune),
  ageing: build(drafts.ageing),
};

export const visualizationOrder: VisualizationId[] = [
  "circulation", "vitality", "cognition", "metabolic", "immune", "ageing",
];

/** Formats a shot timecode as "0:03–0:06". */
export const shotTimecode = (shot: Shot) => {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return `${fmt(shot.start)}–${fmt(shot.end)}`;
};

/** Returns the shot playing at `time` seconds. */
export const shotAt = (shots: Shot[], time: number) =>
  shots.find((shot) => time >= shot.start && time < shot.end) ?? shots[shots.length - 1];

/** Cinematic link between two topics, so the six read as one journey. */
export const transitionNarration: Partial<Record<`${VisualizationId}->${VisualizationId}`, string>> = {
  "circulation->cognition": "Following the bloodstream upward into the brain",
  "cognition->vitality": "Exiting cerebral circulation toward the heart and lungs",
  "vitality->metabolic": "Travelling through circulation to the abdominal organs",
  "metabolic->immune": "From nutrient transport into the bloodstream",
  "immune->ageing": "Pulling outward to a whole-body cellular overview",
};

/** The footage that must be on screen for a given shot. */
export const shotClip = (shot: Shot, fallback: string) => clipSources[shot.clip] ?? fallback;
