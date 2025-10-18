'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface StatsCounterProps {
  end: number;
  duration?: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export function StatsCounter({ 
  end, 
  duration = 2000, 
  label, 
  suffix = '',
  prefix = ''
}: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = Math.floor(end * easeOutQuad(percentage));
      
      setCount(current);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-center mb-2">
        <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
        <span className="text-3xl md:text-4xl font-bold text-primary-600">
          {prefix}{count.toLocaleString()}{suffix}
        </span>
      </div>
      <p className="text-sm md:text-base text-gray-600 font-medium">{label}</p>
    </div>
  );
}
