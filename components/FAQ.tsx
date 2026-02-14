import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFAQs, FAQ as FAQType } from '../services/api';
import Loader from './Loader';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [faqs, setFaqs] = useState<FAQType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const data = await getFAQs();
                setFaqs(data);
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out.
                    </p>
                </motion.div>

                <div className="mt-12 max-w-3xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center"><Loader /></div>
                    ) : (
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={faq.id} className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex justify-between items-center text-left px-6 py-4 transition-colors duration-200 hover:bg-slate-800/60"
                                    >
                                        <span className="font-medium text-lg text-white">{faq.question}</span>
                                        <motion.span
                                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDownIcon className="h-6 w-6 text-slate-400" />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            key="content"
                                            initial="collapsed"
                                            animate="open"
                                            exit="collapsed"
                                            variants={{
                                                open: { opacity: 1, height: 'auto' },
                                                collapsed: { opacity: 0, height: 0 },
                                            }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-4 text-slate-300">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FAQ;