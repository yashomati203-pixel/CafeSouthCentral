'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  dataCategory: string;
  icon?: string;
  iconImage?: string;
  color: string;
}

interface ScrollParallaxProps {
  categories?: Category[];
  onCategorySelect?: (category: string) => void;
  children?: React.ReactNode;
}

const defaultCategories: Category[] = [
  { name: 'South Indian', dataCategory: 'South Indian', iconImage: '/images/categories/south-indian.png', color: '#ffedd5' },
  { name: 'Dosa Special', dataCategory: 'Dosa', iconImage: '/images/categories/dosa.png', color: '#fee2e2' },
  { name: 'Rice Bowls', dataCategory: 'Rice', iconImage: '/images/categories/rice.png', color: '#dcfce7' },
  { name: 'North Indian', dataCategory: 'North Indian', iconImage: '/images/categories/north-indian.png', color: '#e0e7ff' },
  { name: 'Snacks', dataCategory: 'Snacks', iconImage: '/images/categories/snacks.png', color: '#fef9c3' },
  { name: 'Beverages', dataCategory: 'Beverages', iconImage: '/images/categories/beverages.png', color: '#fae8ff' },
  { name: 'Chaat', dataCategory: 'Chaat', iconImage: '/images/categories/chaat.png', color: '#f3f4f6' },
  { name: 'Desserts', dataCategory: 'Dessert', iconImage: '/images/categories/desserts.png', color: '#ffe4e6' },
];

export default function ScrollParallax({ categories = defaultCategories, onCategorySelect, children }: ScrollParallaxProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.dataCategory);
    if (onCategorySelect) {
      onCategorySelect(category.dataCategory);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2rem',
        background: 'linear-gradient(135deg, #fefaef 0%, #faf5ed 100%)'
      }}
    >
      {/* Category Tabs Grid */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '0 1rem'
      }}>
        {categories.map((category, index) => (
          <motion.button
            key={category.dataCategory}
            onClick={() => handleCategoryClick(category)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            style={{
              padding: '0.9rem 0.6rem',
              borderRadius: '12px',
              border: selectedCategory === category.dataCategory ? '2px solid #3C2A21' : '2px solid #e0d4c9',
              backgroundColor: selectedCategory === category.dataCategory ? category.color : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              boxShadow: selectedCategory === category.dataCategory
                ? '0 8px 16px rgba(60, 42, 33, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.05)',
              transform: selectedCategory === category.dataCategory ? 'scale(1.05)' : 'scale(1)',
              minWidth: '140px',
              maxWidth: '140px',
              flex: '0 0 140px',
              whiteSpace: 'nowrap' as const
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== category.dataCategory) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(60, 42, 33, 0.15)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== category.dataCategory) {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {category.iconImage ? (
              <img
                src={category.iconImage}
                alt={category.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>{category.icon}</span>
            )}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#3C2A21',
              textAlign: 'center',
              lineHeight: '1.1',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box' as const,
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const
            }}>
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
