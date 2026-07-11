import BioNovSite from "@/components/BioNovSite";

const faq = [
  { question: "What is nitric oxide?", answer: "Nitric oxide (NO) is a signalling molecule involved in normal biological processes, including blood-vessel relaxation and cellular communication." },
  { question: "What is BIO N:OV?", answer: "BIO N:OV is presented as a fermentation-based wellness product featuring naturally derived ingredients. Product claims and market authorisation must be verified locally before publication." },
  { question: "What is microbial fermentation?", answer: "It is a controlled process in which microorganisms transform ingredients. The exact BIO N:OV process and specifications should be confirmed with the manufacturer." },
  { question: "What ingredients are featured?", answer: "The presentation features fermented garlic, fermented lettuce and other naturally fermented plant ingredients. Confirm the authorised ingredient list on the official product label." },
  { question: "Is BIO N:OV a medicine?", answer: "No medical status is claimed on this website. Check the product’s official classification in the country where it is offered." },
  { question: "Can BIO N:OV replace prescribed medication?", answer: "No. BIO N:OV should not replace medical treatment or prescribed medication." },
  { question: "Who should speak to a healthcare professional before using it?", answer: "People who are pregnant, breastfeeding, taking medication, managing a medical condition or preparing for surgery should consult a qualified healthcare professional before use." },
  { question: "Where can I find the official product instructions?", answer: "Use only the authorised product label supplied with the product. Contact the official distributor if instructions are unclear." }
];

export default function Page() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(x => ({ "@type": "Question", name: x.question, acceptedAnswer: { "@type": "Answer", text: x.answer } })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><BioNovSite faq={faq} /></>;
}
