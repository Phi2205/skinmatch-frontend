import { cn } from "@/shared/utils/format";
import React from "react";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassContainer({ children, className, ...props }: GlassContainerProps) {
  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
