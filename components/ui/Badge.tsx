import { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  variant?: "pill" | "tech";
}

export default function Badge({ icon, children, variant = "pill" }: BadgeProps) {
  const className = variant === "tech" ? "tech-badge" : "badge-pill";
  return (
    <span className={className}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
}
