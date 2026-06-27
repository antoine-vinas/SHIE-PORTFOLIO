import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}

const variants = {
  primary:
    "bg-accent text-heading hover:bg-accent/90 font-bold",
  secondary:
    "bg-surface text-heading border border-hairline/30 hover:border-accent/50 font-bold",
  ghost:
    "bg-transparent text-body hover:text-accent font-medium",
  danger:
    "bg-red-900/40 text-red-200 border border-red-800/50 hover:bg-red-900/60 font-bold",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-card px-5 py-3 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
