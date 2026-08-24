import { CSSProperties, ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  as?: ElementType;
}

export default function Card({
  children,
  accentColor,
  className = "",
  as: Tag = "div",
}: CardProps) {
  const style: CSSProperties | undefined = accentColor
    ? ({
        "--card-border": accentColor,
        "--current-card-glow": `0 0 14px ${accentColor}99, 0 0 36px ${accentColor}33`,
      } as CSSProperties)
    : undefined;

  return (
    <Tag className={`industrial-card ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
