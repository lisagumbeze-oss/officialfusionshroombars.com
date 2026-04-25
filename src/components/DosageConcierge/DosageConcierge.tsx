'use client';

import React, { useState } from 'react';
import styles from './DosageConcierge.module.css';
import { Sparkles, Brain, Zap, Moon, ChevronRight, RefreshCcw } from 'lucide-react';

const STEPS = [
  {
    id: 'level',
    question: 'What is your experience level?',
    options: [
      { id: 'beginner', label: 'Beginner', desc: 'I am new to psilocybin', icon: <Sparkles /> },
      { id: 'intermediate', label: 'Intermediate', desc: 'I have tried it a few times', icon: <Brain /> },
      { id: 'advanced', label: 'Advanced', desc: 'I am an experienced voyager', icon: <Zap /> },
    ]
  },
  {
    id: 'goal',
    question: 'What is your primary goal?',
    options: [
      { id: 'focus', label: 'Focus & Clarity', desc: 'Microdosing for productivity', icon: <Zap /> },
      { id: 'balance', label: 'Emotional Balance', desc: 'Mental wellness and mood', icon: <Moon /> },
      { id: 'journey', label: 'Deep Journey', desc: 'Spiritual or intense experience', icon: <Brain /> },
    ]
  }
];

export default function DosageConcierge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (stepId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [stepId]: optionId }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelections({});
    setShowResult(false);
  };

  const getRecommendation = () => {
    const { level, goal } = selections;
    if (goal === 'focus') return { dosage: '0.1g - 0.2g', recommendation: 'Fusion Microdose Gummies', frequency: 'Every 3 days (Fadiman Protocol)' };
    if (goal === 'journey' && level === 'beginner') return { dosage: '1.5g - 2.0g', recommendation: 'Fusion Milk Chocolate Bar (Half Bar)', frequency: 'Single Session' };
    if (goal === 'journey' && level === 'advanced') return { dosage: '3.5g - 5.0g', recommendation: 'Fusion Dark Chocolate Bar (Full Bar)', frequency: 'Heroic Session' };
    return { dosage: '0.5g - 1.0g', recommendation: 'Fusion Specialty Bars (3-4 squares)', frequency: 'Social or Creative Dose' };
  };

  if (showResult) {
    const rec = getRecommendation();
    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultHeader}>
          <Sparkles className={styles.sparkleIcon} />
          <h3>Your Journey Guide</h3>
        </div>
        <div className={styles.recCard}>
          <div className={styles.recItem}>
            <span>Recommended Product</span>
            <strong>{rec.recommendation}</strong>
          </div>
          <div className={styles.recItem}>
            <span>Target Dosage</span>
            <strong>{rec.dosage}</strong>
          </div>
          <div className={styles.recItem}>
            <span>Protocol</span>
            <strong>{rec.frequency}</strong>
          </div>
        </div>
        <button onClick={reset} className={styles.resetBtn}>
          <RefreshCcw size={16} /> START OVER
        </button>
      </div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        Step {currentStep + 1} of {STEPS.length}
      </div>
      <h2 className={styles.question}>{step.question}</h2>
      <div className={styles.options}>
        {step.options.map(opt => (
          <button 
            key={opt.id} 
            className={styles.optionBtn}
            onClick={() => handleSelect(step.id, opt.id)}
          >
            <div className={styles.optIcon}>{opt.icon}</div>
            <div className={styles.optText}>
              <span className={styles.optLabel}>{opt.label}</span>
              <span className={styles.optDesc}>{opt.desc}</span>
            </div>
            <ChevronRight className={styles.arrow} />
          </button>
        ))}
      </div>
    </div>
  );
}
