import BioNovSite from "@/components/BioNovSite";

/* Grouped so a reader can jump to the part they care about — the science, the
   practicalities, safety, or how to buy and partner. */
const faq = [
  // ---- The science ----
  {
    group: "The science",
    question: "What is nitric oxide, in plain language?",
    answer: "Nitric oxide (NO) is a signalling molecule your body makes. Its best-known job is telling the smooth muscle wrapped around every blood vessel to relax, which widens the vessel and lets blood move more easily. It was named Molecule of the Year in 1992, and the researchers who uncovered its role shared the Nobel Prize in Physiology or Medicine in 1998."
  },
  {
    group: "The science",
    question: "Why does nitric oxide matter more as I get older?",
    answer: "Your natural production declines with age. The manufacturer's documentation puts it at roughly 100% in your twenties falling to around 15% past sixty, and attributes about 85% of production capability lost across a lifetime. That is normal ageing rather than a diagnosis, but it is why energy, recovery and clarity that once felt automatic start to feel like work."
  },
  {
    group: "The science",
    question: "What does third-generation actually mean?",
    answer: "First-generation formulas used arginine, which needs an enzyme to convert — and that enzyme becomes less efficient with age. Second-generation moved to vegetable and fruit extracts. BIO N:OV uses microbial fermentation, so the conversion happens in the fermentation tank rather than inside your body. The manufacturer states this is why it works the same way at 60 as it does at 30."
  },
  {
    group: "The science",
    question: "What is microbial fermentation?",
    answer: "A controlled process in which microorganisms transform the raw plant material before it is formulated. BIO N:OV uses a proprietary strain, KACC91554P, owned by the Korea Research Institute of Bioscience and Biotechnology. Confirm exact process specifications with the manufacturer."
  },

  // ---- The product ----
  {
    group: "The product",
    question: "What is actually in it?",
    answer: "Four raw materials: fermented garlic extract, fermented lettuce extract, soybean and soybean sprouts. Nothing exotic — it is food, fermented. Always confirm the complete authorised ingredient list against the official label for your country."
  },
  {
    group: "The product",
    question: "How do I take it, and how long does a box last?",
    answer: "The standard suggestion is one 500 mg tablet three times a day with water. A box contains 60 tablets, which is a 20-day supply at that serving. Use only according to the authorised product label."
  },
  {
    group: "The product",
    question: "Where is it made?",
    answer: "In a GMP-certified facility in Korea. The patent certificates and the GMP certificate are shown in the Technology section of this page."
  },
  {
    group: "The product",
    question: "Does it contain anything I might react to?",
    answer: "It contains soy. If you have a soy allergy, check the label carefully and speak to a healthcare professional before use. Review the full ingredient list on the authorised label for any other sensitivities."
  },

  // ---- Safety ----
  {
    group: "Safety",
    question: "Is BIO N:OV a medicine?",
    answer: "No. It is a wellness supplement. No medical status is claimed on this website. Check the product's official classification in the country where it is offered."
  },
  {
    group: "Safety",
    question: "Can it replace my prescribed medication?",
    answer: "No — and this matters more than anything else on this page. BIO N:OV must never replace medical treatment or prescribed medication. If you take anything for blood pressure, blood sugar or your heart, speak to your doctor before adding any supplement."
  },
  {
    group: "Safety",
    question: "Who should speak to a healthcare professional first?",
    answer: "Anyone who is pregnant, breastfeeding, taking medication, managing a medical condition or preparing for surgery should consult a qualified healthcare professional before use."
  },
  {
    group: "Safety",
    question: "Where do the figures on this page come from?",
    answer: "Public-health statistics come from the cited sources — the World Health Organization, World Heart Federation, Harvard Health Publishing, the International Diabetes Federation and the Alzheimer's Association — and describe global disease burden rather than outcomes of this product. Product performance figures come from the manufacturer's documentation and Bzzworld Smart Lab testing, and are not a substitute for professional medical advice, diagnosis or treatment. Individual results vary."
  },

  // ---- Buying and partnering ----
  {
    group: "Buying & partnering",
    question: "How do I order?",
    answer: "The store is being prepared now. Register your interest through the contact form and we will reach you first when ordering opens, with pricing and shipping for your market."
  },
  {
    group: "Buying & partnering",
    question: "Which countries do you ship to?",
    answer: "BioExcela Global is operated from Singapore by Bio Green Elixirs. Launch markets and shipping options are being confirmed — tell us where you are in the contact form and we will confirm availability for your country."
  },
  {
    group: "Buying & partnering",
    question: "Can I become an affiliate or a distributor?",
    answer: "Yes. We are building the founding affiliate group now, and early partners get first access to territories. Use the affiliate section on this page to register your interest."
  },
  {
    group: "Buying & partnering",
    question: "Where can I find the official product instructions?",
    answer: "Use only the authorised product label supplied with the product. If anything is unclear, contact the official distributor before use rather than relying on this page."
  }
];

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(x => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer }
    }))
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BioNovSite faq={faq} />
    </>
  );
}
