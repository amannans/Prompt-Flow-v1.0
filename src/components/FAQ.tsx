import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "Is there a long-term contract?",
    answer: "Our standard plans are monthly rolling. We believe in earning your business every single month through results, not legal lock-ins."
  },
  {
    question: "Does the price include ad spend?",
    answer: "No, the pricing covers our management fee and platform tools. Ad spend (Google/Meta) is paid directly to the platforms."
  },
  {
    question: "Can I upgrade or downgrade later?",
    answer: "Absolutely. You can switch between tiers at any time to match your business growth and budget."
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  key?: number | string;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className="text-lg md:text-xl font-semibold group-hover:text-pink-500 transition-colors">
          {question}
        </span>
        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-pink-500/10 transition-colors`}>
          {isOpen ? <Minus className="w-5 h-5 text-pink-500" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-slate-300 font-medium leading-relaxed max-w-3xl">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          <div className="md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" id="faq-title">
                Common <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-slate-300 font-semibold leading-relaxed">
                Everything you need to know about partnering with Prompt Flow. Still have questions? 
                <a href="#contact" className="text-pink-500 hover:underline ml-1">Drop us a message.</a>
              </p>
            </motion.div>
          </div>

          <div className="md:w-2/3" aria-labelledby="faq-title">
            <div className="glass rounded-3xl p-8 md:p-12">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
