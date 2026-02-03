import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Category {
    name: string;
    dataCategory: string;
    image: string;
}

const CATEGORIES: Category[] = [
    { name: 'South Indian', dataCategory: 'South Indian', image: '/images/categories/south-indian.png' },
    { name: 'Dosa Special', dataCategory: 'Dosa', image: '/images/categories/dosa.png' },
    { name: 'Rice Bowls', dataCategory: 'Rice', image: '/images/categories/rice.png' },
    { name: 'North Indian', dataCategory: 'North Indian', image: '/images/categories/north-indian.png' },
    { name: 'Snacks', dataCategory: 'Snacks', image: '/images/categories/snacks.png' },
    { name: 'Beverages', dataCategory: 'Beverages', image: '/images/categories/beverages.png' },
    { name: 'Chaat', dataCategory: 'Chaat', image: '/images/categories/chaat.png' },
    { name: 'Desserts', dataCategory: 'Dessert', image: '/images/categories/desserts.png' },
];

interface CategoriesSectionProps {
    onCategorySelect?: (category: string) => void;
    onViewAll?: () => void;
}

export default function CategoriesSection({ onCategorySelect, onViewAll }: CategoriesSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            style={{
                padding: '4rem 0',
                backgroundColor: '#e2e9e0',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div style={{
                padding: '0 2rem', // Fixed left padding, no centering
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: '#3C2A21',
                        lineHeight: 1.1,
                        marginBottom: '0',
                    }}>
                        We Serve You With
                    </h2>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onClick={onViewAll}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#3C2A21',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    View All <ArrowRight size={18} />
                </motion.button>
            </div>

            {/* Horizontal Scroll Container - Hide Scrollbar but allow scroll */}
            <div
                ref={scrollContainerRef}
                style={{
                    display: 'flex',
                    gap: '1.5rem',
                    overflowX: 'auto',
                    padding: '1rem 2rem 3rem 2rem',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none',  // IE 10+
                }}
                className="hide-scrollbar" // Helper class if global CSS exists, otherwise relying on inline styles above + style tag below
            >
                {/* Spacer removed for left alignment */}


                {CATEGORIES.map((cat, index) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        onClick={() => onCategorySelect?.(cat.dataCategory)}
                        style={{
                            flex: '0 0 auto',
                            width: '200px',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        whileHover={{ y: -10 }}
                    >
                        <div style={{
                            width: '100%',
                            aspectRatio: '3/4', // Taller card as per visual
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(60, 42, 33, 0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Image Area */}
                            <div style={{
                                flex: 1,
                                position: 'relative',
                                width: '100%',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(max-width: 768px) 200px, 250px"
                                    style={{
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                    className="category-image"
                                />
                            </div>

                            {/* Label */}
                            <div style={{
                                padding: '1rem',
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderTop: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: '#3C2A21'
                                }}>
                                    {cat.name}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Right Spacer */}
                <div style={{ width: '2rem', flexShrink: 0 }} />
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Custom Hover Effect Styles */}
            <style jsx>{`
                div:hover .category-image {
                    transform: scale(1.1);
                }
            `}</style>
        </section>
    );
}
