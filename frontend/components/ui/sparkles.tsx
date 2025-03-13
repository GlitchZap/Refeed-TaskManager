import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  id = "sparkles",
  className,
  background = "transparent",
  minSize = 0.5,
  maxSize = 1,
  speed = 1,
  particleCount = 30,
  particleColor = "#FFFFFF",
  style,
  children,
}: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleCount?: number;
  particleColor?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const particles = useRef<Array<{x: number, y: number, size: number, speedX: number, speedY: number}>>([]);

  // Initialize particles
  const initParticles = () => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvasSize.width,
        y: Math.random() * canvasSize.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed
      });
    }
  };

  // Update particles
  const updateParticles = () => {
    if (!context.current) return;
    
    context.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.current.fillStyle = particleColor;
    
    particles.current.forEach((particle) => {
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around edges
      if (particle.x > canvasSize.width) particle.x = 0;
      else if (particle.x < 0) particle.x = canvasSize.width;
      if (particle.y > canvasSize.height) particle.y = 0;
      else if (particle.y < 0) particle.y = canvasSize.height;
      
      // Draw particle
      context.current!.beginPath();
      context.current!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.current!.fill();
    });
    
    animationRef.current = requestAnimationFrame(updateParticles);
  };

  useEffect(() => {
    if (canvasContainerRef.current) {
      const { offsetWidth, offsetHeight } = canvasContainerRef.current;
      setCanvasSize({
        width: offsetWidth,
        height: offsetHeight,
      });
    }

    const handleResize = () => {
      if (canvasContainerRef.current) {
        const { offsetWidth, offsetHeight } = canvasContainerRef.current;
        setCanvasSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || canvasSize.width === 0 || canvasSize.height === 0) return;
    
    context.current = canvasRef.current.getContext("2d");
    if (!context.current) return;
    
    initParticles();
    updateParticles();
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [canvasSize, particleCount, minSize, maxSize, speed, particleColor]);

  return (
    <div
      ref={canvasContainerRef}
      className={cn("h-full w-full", className)}
      style={{ position: "relative", ...style }}
    >
      <canvas
        id={id}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background,
        }}
      />
      {children}
    </div>
  );
};