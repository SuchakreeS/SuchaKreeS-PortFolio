import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function Container({
  children,
  maxWidth = "1200px",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`container-primitive ${className}`.trim()}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
