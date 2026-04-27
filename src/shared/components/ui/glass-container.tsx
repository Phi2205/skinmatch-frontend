"use client"

import type React from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sm" | "lg" | "none"
  interactive?: boolean
  blur?: number
  opacity?: number
  borderOpacity?: number
  borderRadius?: number
}

export function GlassCard({
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
}: GlassCardProps) {
  const baseStyles =
    "backdrop-blur-xl bg-white/20 border border-white/20 rounded-2xl shadow-xl transition-all duration-300"

  const variantStyles = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
    none: "",
  }

  const interactiveStyles = interactive ? "hover:bg-white/15 hover:shadow-2xl hover:border-white/30" : ""

  const glassStyles: React.CSSProperties = {
    ...(blur !== undefined && { backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }),
    ...(opacity !== undefined && { backgroundColor: `rgba(255, 255, 255, ${opacity})` }),
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
