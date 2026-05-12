"use client"

import type React from "react"

interface DarkGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sm" | "lg" | "none"
  interactive?: boolean
  blur?: number
  opacity?: number
  borderOpacity?: number
  borderRadius?: number
}

export function DarkGlassCard({
  children,
  className = "",
  variant = "default",
  interactive = false,
  blur,
  opacity,
  borderOpacity,
  borderRadius,
  style,
  ...props
}: DarkGlassCardProps) {
  const baseStyles =
    "backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 text-white"

  const variantStyles = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
    none: "",
  }

  const interactiveStyles = interactive ? "hover:bg-black/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/20" : ""

  const glassStyles: React.CSSProperties = {
    ...(blur !== undefined && { backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }),
    ...(opacity !== undefined && { backgroundColor: `rgba(0, 0, 0, ${opacity})` }),
    ...(borderOpacity !== undefined && { borderColor: `rgba(255, 255, 255, ${borderOpacity})` }),
    ...(borderRadius !== undefined && { borderRadius: `${borderRadius}px` }),
    ...style,
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      style={glassStyles}
      {...props}
    >
      {children}
    </div>
  )
}
