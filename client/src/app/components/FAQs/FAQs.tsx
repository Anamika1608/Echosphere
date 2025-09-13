import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion.tsx";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import splineGIF from "../../../assets/splineGIF.gif";

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
  // Animation variants
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const accordionVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="faq"
      className="grid grid-cols-1 mx-auto px-4 py-8 sm:py-16 gap-4"
      style={{
        background: "linear-gradient(180deg, #f9f7f5 0%, #FFF 19.11%)",
      }}
    >
      {/* Header Section */}
      <motion.div
        className="sm:mx-auto mx-10 px-0 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="text-center py-4 sm:mb-8" variants={fadeInUp}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* Spline GIF Container */}
        <motion.div
          className="hidden lg:flex justify-center items-center h-[160px] sm:h-[200px] mt-6 mx-auto relative"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <img
            src={splineGIF}
            alt="Spline Animation"
            className="w-full h-full object-contain pointer-events-none"
            loading="lazy"
          />
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-3xl mx-4 sm:mx-auto sm:w-xl mb-20 overflow-visible"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={accordionVariants}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <AccordionItem value={`item-${index}`} className="border-b">
                  <motion.div
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <AccordionTrigger className="hover:text-orange-500 transition-colors duration-200">
                      {faq.q}
                    </AccordionTrigger>
                  </motion.div>
                  <AccordionContent className="text-gray-500">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {faq.a}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
