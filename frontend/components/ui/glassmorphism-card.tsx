import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassmorphismCard({ children, className, ...props }: GlassmorphismCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-sm border border-gray-800/50 bg-gray-900/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}