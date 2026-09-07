import { CSSProperties, ReactNode } from "react";

// Narrowed on purpose (not the generic `ElementType`): once any file imports
// @react-three/fiber, its types add ~100 three.js elements to the *global*
// JSX.IntrinsicElements, which breaks TypeScript's inference for a fully
// generic polymorphic `as` prop. Widen this union if a new tag is needed.
type CardTag = "div" | "article" | "section";

interface CardProps {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  as?: CardTag;
  style?: CSSProperties;
}

export default function Card({
  children,
  accentColor,
  className = "",
  as: Tag = "div",
  style: styleProp,
}: CardProps) {
  const accentStyle: CSSProperties | undefined = accentColor
    ? ({
        "--card-border": accentColor,
        "--current-card-glow": `0 0 14px ${accentColor}99, 0 0 36px ${accentColor}33`,
      } as CSSProperties)
    : undefined;

  return (
    <Tag className={`industrial-card ${className}`.trim()} style={{ ...accentStyle, ...styleProp }}>
      {children}
    </Tag>
  );
}
