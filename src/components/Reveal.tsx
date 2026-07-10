'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    direction?: RevealDirection;
}

const directionClass: Record<RevealDirection, string> = {
    up: '',
    down: styles.fromDown,
    left: styles.fromLeft,
    right: styles.fromRight,
    scale: styles.fromScale,
};

export const Reveal = ({ children, width = '100%', delay = 0, direction = 'up' }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.reveal} ${directionClass[direction]} ${isVisible ? styles.visible : ''}`}
            style={{
                width,
                transitionDelay: `${delay}s`,
            }}
        >
            {children}
        </div>
    );
};
