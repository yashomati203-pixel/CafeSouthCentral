'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollParallaxItem {
  id: number;
  src: string;
  alt: string;
  delay?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}

interface ScrollParallaxProps {
  items?: ScrollParallaxItem[];
  children?: React.ReactNode;
}

const defaultItems: ScrollParallaxItem[] = [
  {
    id: 1,
    src: '/images/hero/filter-coffee.png',
    alt: 'Filter Coffee',
    delay: 0.2,
    offsetX: -100,
    offsetY: -50,
    scale: 1
  },
  {
    id: 2,
    src: '/images/hero/latte.png',
    alt: 'Latte',
    delay: 0.3,
    offsetX: 100,
    offsetY: 50,
    scale: 1.1
  },
  {
    id: 3,
    src: '/images/hero/dosa.png',
    alt: 'Dosa',
    delay: 0.4,
    offsetX: -80,
    offsetY: 60,
    scale: 0.95
  },
  {
    id: 4,
    src: '/images/hero/idli.png',
    alt: 'Idli',
    delay: 0.5,
    offsetX: 120,
    offsetY: -60,
    scale: 1.05
  }
];

export default function ScrollParallax({ items = defaultItems, children }: ScrollParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [containerTop, setContainerTop] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setContainerTop(rect.top + window.scrollY);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fefaef 0%, #faf5ed 100%)'
      }}
    >
      {/* Parallax Items */}
      {items.map((item, index) => {
        const itemOffset = containerTop + (index * 150);
        const yTransform = useTransform(
          scrollY,
          [Math.max(0, itemOffset - 500), itemOffset + 500],
          [item.offsetY || 100, -(item.offsetY || 100)]
        );
        const xTransform = useTransform(
          scrollY,
          [Math.max(0, itemOffset - 500), itemOffset + 500],
          [item.offsetX || 100, -(item.offsetX || 100)]
        );
        const rotateTransform = useTransform(
          scrollY,
          [Math.max(0, itemOffset - 600), itemOffset + 400],
          [index % 2 === 0 ? -15 : 15, index % 2 === 0 ? 15 : -15]
        );
        const opacityTransform = useTransform(
          scrollY,
          [Math.max(0, itemOffset - 700), itemOffset + 300],
          [0, 1]
        );

        return (
          <motion.div
            key={item.id}
            style={{
              position: 'absolute',
              y: yTransform,
              x: xTransform,
              rotate: rotateTransform,
              opacity: opacityTransform,
              willChange: 'transform',
              pointerEvents: 'none'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: item.scale || 1 }}
            transition={{ duration: 0.6, delay: item.delay }}
          >
            <div
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                background: '#fff'
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </div>
    </div>
  );
}
