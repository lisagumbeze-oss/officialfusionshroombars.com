'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import styles from './FAQAccordion.module.css';

interface FAQAccordionProps {
    question: string;
    answer: string;
}

export function FAQAccordion({ question, answer }: FAQAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}
            layout
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
            <button 
                className={styles.question} 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <motion.span
                    className={styles.icon}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className={styles.answerWrapper}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className={styles.answer}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
