import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion.tsx";

const faqs = [
  {
    q: "Is Community-AI suitable for small residential communities?",
    a: "Absolutely! Our platform is designed to scale, offering valuable features for communities of any size, from small apartment buildings to large residential complexes.",
  },
  {
    q: "How is my community's data handled?",
    a: "We use state-of-the-art security practices. All data is encrypted, and any analytics used for AI suggestions are fully anonymized to ensure complete privacy.",
  },
  {
    q: "Can this integrate with other software?",
    a: "While direct integration is a premium feature, our platform allows for easy data exporting that can be imported into most accounting or management software.",
  },
  {
    q: "What happens if the AI misunderstands a request?",
    a: "If the AI is unsure, it will provide options or guide the user to file a manual ticket. These interactions help us continuously improve the AI's accuracy.",
  },
];

export function FAQs() {
  return (
    <section id="faq" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
