import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MeteorsProps {
  number?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Meteors = ({ number = 20, className = "", children }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const styles = [...Array(number)].map(() => ({
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 2 + 0.5}s`
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {meteorStyles.map((style, idx) => (
          <span
            key={idx}
            className="absolute inline-flex h-1 w-1 rounded-full bg-blue-500 opacity-0 shadow-[0_0_2px_2px_rgba(59,130,246,0.5)]"
            style={{
              top: style.top,
              left: style.left,
              animation: `meteor ${style.animationDuration} linear ${style.animationDelay} infinite`,
            }}
          />
        ))}
      </div>
      {children}

      <style jsx global>{`
        @keyframes meteor {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translate(-5px, 5px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-120px, 120px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};