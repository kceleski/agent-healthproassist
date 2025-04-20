
import * as React from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
  hoverEffect?: boolean;
  glowColor?: "blue" | "purple" | "cyan" | "pink";
}

const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  ({ className, children, variant = "default", hoverEffect = true, glowColor = "blue", ...props }, ref) => {
    const glowMap = {
      blue: "rgba(56, 189, 248, 0.3)",
      purple: "rgba(124, 58, 237, 0.3)",
      cyan: "rgba(34, 211, 238, 0.3)",
      pink: "rgba(232, 121, 249, 0.3)"
    };
    
    const hoverGlowMap = {
      blue: "rgba(56, 189, 248, 0.5)",
      purple: "rgba(124, 58, 237, 0.5)",
      cyan: "rgba(34, 211, 238, 0.5)",
      pink: "rgba(232, 121, 249, 0.5)"
    };

    const baseStyle = "relative overflow-hidden backdrop-blur-lg border rounded-xl transition-all duration-300";
    
    const variantStyles = {
      default: "bg-white/70 dark:bg-slate-900/50 border-white/30 dark:border-white/10",
      elevated: "bg-white/80 dark:bg-slate-900/60 border-white/40 dark:border-white/15 shadow-lg",
      interactive: "bg-white/70 dark:bg-slate-900/50 border-white/30 dark:border-white/10 cursor-pointer"
    };
    
    const hoverStyles = hoverEffect 
      ? "hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:border-white/40 dark:hover:border-white/20 transform-gpu hover:-translate-y-0.5 hover:translate-z-0"
      : "";
      
    const glowStyle = {
      boxShadow: `0 0 10px ${glowMap[glowColor]}`
    };
    
    const hoverGlowStyle = hoverEffect ? {
      "--hover-glow": hoverGlowMap[glowColor]
    } as React.CSSProperties : {};
    
    return (
      <div
        className={cn(baseStyle, variantStyles[variant], hoverStyles, className)}
        ref={ref}
        style={{...glowStyle, ...hoverGlowStyle}}
        {...props}
      >
        {/* Holographic Effect Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        {children}
      </div>
    );
  }
);

HolographicCard.displayName = "HolographicCard";

const HolographicCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
));

HolographicCardHeader.displayName = "HolographicCardHeader";

const HolographicCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

HolographicCardTitle.displayName = "HolographicCardTitle";

const HolographicCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

HolographicCardDescription.displayName = "HolographicCardDescription";

const HolographicCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
));

HolographicCardContent.displayName = "HolographicCardContent";

const HolographicCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-6 pt-0", className)}
    {...props}
  />
));

HolographicCardFooter.displayName = "HolographicCardFooter";

export {
  HolographicCard,
  HolographicCardHeader,
  HolographicCardFooter,
  HolographicCardTitle,
  HolographicCardDescription,
  HolographicCardContent
};
