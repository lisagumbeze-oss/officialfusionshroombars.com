'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DosageConcierge.module.css';
import { Sparkles, Brain, Zap, Moon, ChevronRight, RefreshCcw, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    id: 'level',
    question: 'Where are you on the journey?',
    subtitle: 'We tailor every recommendation to your experience.',
    options: [
      { id: 'beginner', label: 'First voyage', desc: 'New to psilocybin edibles', icon: Sparkles },
      { id: 'intermediate', label: 'Seasoned explorer', desc: 'A few meaningful experiences', icon: Brain },
      { id: 'advanced', label: 'Deep practitioner', desc: 'Comfortable with intensity', icon: Zap },
    ],
  },
  {
    id: 'goal',
    question: 'What are you seeking?',
    subtitle: 'Your intention shapes the ideal dose and product.',
    options: [
      { id: 'focus', label: 'Focus & clarity', desc: 'Microdosing for productivity', icon: Zap },
      { id: 'balance', label: 'Emotional balance', desc: 'Mood and mental wellness', icon: Moon },
      { id: 'journey', label: 'Deep journey', desc: 'Spiritual or transformative', icon: Brain },
    ],
  },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function DosageConcierge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (stepId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [stepId]: optionId }));
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setDirection(-1);
    setCurrentStep(0);
    setSelections({});
    setShowResult(false);
  };

  const getRecommendation = () => {
    const { level, goal } = selections;
    if (goal === 'focus')
      return {
        dosage: '0.1g – 0.2g',
        recommendation: 'Fusion Microdose Gummies',
        frequency: 'Every 3 days · Fadiman Protocol',
        shopHref: '/shop',
      };
    if (goal === 'journey' && level === 'beginner')
      return {
        dosage: '1.5g – 2.0g',
        recommendation: 'Fusion Milk Chocolate Bar',
        frequency: 'Half bar · single session',
        shopHref: '/shop',
      };
    if (goal === 'journey' && level === 'advanced')
      return {
        dosage: '3.5g – 5.0g',
        recommendation: 'Fusion Dark Chocolate Bar',
        frequency: 'Full bar · heroic session',
        shopHref: '/shop',
      };
    return {
      dosage: '0.5g – 1.0g',
      recommendation: 'Fusion Specialty Bars',
      frequency: '3–4 squares · social dose',
      shopHref: '/shop',
    };
  };

  const progress = showResult ? 100 : ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className={styles.shell}>
      <div className={styles.orbLeft} aria-hidden />
      <div className={styles.orbRight} aria-hidden />

      <div className={styles.panel}>
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressFill}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {showResult ? (
            <motion.div
              key="result"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className={styles.resultContainer}
            >
              <div className={styles.resultHeader}>
                <div className={styles.resultIconRing}>
                  <Sparkles className={styles.sparkleIcon} />
                </div>
                <span className={styles.resultLabel}>Your guide</span>
                <h3 className={styles.resultTitle}>Personalized protocol</h3>
              </div>

              <div className={styles.recCard}>
                <div className={styles.recItem}>
                  <span>Recommended</span>
                  <strong>{getRecommendation().recommendation}</strong>
                </div>
                <div className={styles.recDivider} />
                <div className={styles.recRow}>
                  <div className={styles.recItem}>
                    <span>Dosage</span>
                    <strong>{getRecommendation().dosage}</strong>
                  </div>
                  <div className={styles.recItem}>
                    <span>Protocol</span>
                    <strong>{getRecommendation().frequency}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.resultActions}>
                <Link href={getRecommendation().shopHref} className={styles.shopBtn}>
                  Shop collection
                  <ArrowRight size={16} />
                </Link>
                <button type="button" onClick={reset} className={styles.resetBtn}>
                  <RefreshCcw size={14} />
                  Start over
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className={styles.stepContainer}
            >
              <div className={styles.stepMeta}>
                <span className={styles.stepLabel}>
                  Concierge · {currentStep + 1} / {STEPS.length}
                </span>
              </div>

              <h2 className={styles.question}>{STEPS[currentStep].question}</h2>
              <p className={styles.subtitle}>{STEPS[currentStep].subtitle}</p>

              <div className={styles.options}>
                {STEPS[currentStep].options.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      className={styles.optionBtn}
                      onClick={() => handleSelect(STEPS[currentStep].id, opt.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className={styles.optNumber}>0{i + 1}</span>
                      <div className={styles.optIcon}>
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div className={styles.optText}>
                        <span className={styles.optLabel}>{opt.label}</span>
                        <span className={styles.optDesc}>{opt.desc}</span>
                      </div>
                      <ChevronRight className={styles.arrow} size={18} />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
