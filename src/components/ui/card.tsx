import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border text-card-foreground", {
  variants: {
    variant: {
      default: "bg-card border-border shadow-[0_4px_24px_hsl(0_0%_0%/0.4)]",
      gradient: "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(222_47%_8%)] border-border shadow-[0_4px_24px_hsl(0_0%_0%/0.4)]",
      glass: "bg-[hsl(var(--card)/0.8)] backdrop-blur-xl border-[hsl(var(--border)/0.5)]",
      elevated: "bg-card border-border shadow-[0_8px_32px_hsl(0_0%_0%/0.5)]",
      outline: "bg-transparent border-border",
      feature: "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(222_47%_8%)] border-border shadow-[0_4px_24px_hsl(0_0%_0%/0.4)] hover:border-primary/50 hover:shadow-[0_0_60px_hsl(var(--primary)/0.3)] transition-all duration-300",
      pricing: "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(222_47%_8%)] border-border shadow-[0_4px_24px_hsl(0_0%_0%/0.4)] hover:scale-[1.02] transition-all duration-300",
      popular: "bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(222_47%_8%)] border-primary shadow-[0_0_60px_hsl(var(--primary)/0.3)] hover:scale-[1.02] transition-all duration-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
