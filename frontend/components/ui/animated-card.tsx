import { cn } from "@/lib/utils";
import React, { useState } from "react";

export const AnimatedCard = ({
  className,
  children,
  borderRadius = "1.5rem",
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  borderRadius?: string;
  onClick?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={cn(
        "relative h-full w-full rounded-3xl p-px transition-all duration-500",
        {
          "bg-gradient-to-r from-blue-500/30 via-violet-600/50 to-purple-500/30": isFocused,
          "bg-transparent": !isFocused,
        },
        className
      )}
      style={{ 
        borderRadius: borderRadius,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div
        className="absolute inset-0 rounded-3xl bg-black"
        style={{ borderRadius }}
      />
      <div
        className={cn(
          "relative h-full w-full rounded-3xl bg-black p-6 transition-all duration-500",
          {
            "bg-gradient-to-r from-black via-gray-900/90 to-black": isFocused,
          }
        )}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
};