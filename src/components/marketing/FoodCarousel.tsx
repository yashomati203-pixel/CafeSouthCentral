'use client';

import Image from 'next/image';
import { useRef } from 'react';

interface FoodItem {
    id: string;
    image: string;
    title: string;
    description: string;
    blobStyle?: string;
}

interface FoodCarouselProps {
    items: FoodItem[];
}

export default function FoodCarousel({ items }: FoodCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="food-carousel flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-8">
            {items.map((item, index) => (
                <div key={item.id} className="flex-shrink-0 w-4/5 snap-center">
                    <div
                        className={`relative aspect-square overflow-hidden bg-white shadow-xl ${item.blobStyle || 'organic-blob-1'
                            }`}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-4 px-2">
                        <h3 className="font-serif text-xl font-bold text-[#102214]">
                            {item.title}
                        </h3>
                        <p className="text-sm opacity-70 text-[#4a5d50]">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
