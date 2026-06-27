import { type ReactNode } from "react";

interface DotGridBackgroundProps {
  children: ReactNode;
  className?: string;
  perspective?: boolean;
}

export function DotGridBackground({
  children,
  className = "",
  perspective = false,
}: DotGridBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${
          perspective ? "dot-grid-perspective opacity-40" : "dot-grid-bg"
        }`}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
