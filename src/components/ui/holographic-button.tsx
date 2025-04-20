
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const holographicButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-holo-blue/80 to-holo-purple/80 text-white border border-white/20 shadow-[0_4px_12px_rgba(56,189,248,0.25)] hover:shadow-[0_6px_16px_rgba(56,189,248,0.4)] hover:-translate-y-0.5",
        glowing: "bg-gradient-to-r from-holo-blue/60 to-holo-cyan/60 text-white border border-white/20 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5",
        outline: "border border-holo-blue/50 hover:border-holo-blue/80 bg-white/10 backdrop-blur-lg text-foreground shadow-sm hover:bg-white/20 hover:text-holo-blue",
        ghost: "bg-transparent hover:bg-white/10 text-foreground hover:text-holo-blue",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface HolographicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof holographicButtonVariants> {
  asChild?: boolean;
}

const HolographicButton = React.forwardRef<HTMLButtonElement, HolographicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(holographicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        <span className="absolute inset-0 overflow-hidden rounded-md">
          <span className="absolute -inset-[400%] animate-holographic-shine bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] opacity-0 group-hover:opacity-100"></span>
        </span>
      </Comp>
    );
  }
);

HolographicButton.displayName = "HolographicButton";

export { HolographicButton, holographicButtonVariants };
