'use client';

import React, { useEffect, useState } from 'react';
import './ClickSpark.css';

interface Spark {
    id: number;
    x: number;
    y: number;
    angle: number;
    endX: number;
    endY: number;
}

interface ClickSparkProps {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: string;
    extraScale?: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
    sparkColor = '#5C3A1A',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = 'ease-out',
    extraScale = 1,
}) => {
    const [sparks, setSparks] = useState<Spark[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const newSparks: Spark[] = [];
            const angleStep = (2 * Math.PI) / sparkCount;

            for (let i = 0; i < sparkCount; i++) {
                const angle = i * angleStep;
                const radians = angle;

                newSparks.push({
                    id: Date.now() + i + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    angle: (angle * 180) / Math.PI,
                    endX: e.clientX + Math.cos(radians) * sparkRadius,
                    endY: e.clientY + Math.sin(radians) * sparkRadius,
                });
            }

            setSparks((prev) => [...prev, ...newSparks]);

            // Remove sparks after animation completes
            setTimeout(() => {
                setSparks((prev) => prev.filter((spark) => !newSparks.includes(spark)));
            }, duration);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [sparkCount, duration, sparkRadius]);

    return (
        <div className="click-spark-container">
            {sparks.map((spark) => (
                <div
                    key={spark.id}
                    className="click-spark"
                    style={
                        {
                            '--spark-x': `${spark.x}px`,
                            '--spark-y': `${spark.y}px`,
                            '--spark-end-x': `${spark.endX}px`,
                            '--spark-end-y': `${spark.endY}px`,
                            '--spark-angle': `${spark.angle}deg`,
                            '--spark-color': sparkColor,
                            '--spark-size': `${sparkSize}px`,
                            '--spark-duration': `${duration}ms`,
                            '--spark-easing': easing,
                            '--spark-scale': extraScale,
                        } as React.CSSProperties
                    }
                />
            ))}
        </div>
    );
};

export default ClickSpark;
