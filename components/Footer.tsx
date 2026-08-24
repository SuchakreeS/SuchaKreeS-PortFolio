"use client";
import { Skull, Music, Star, Heart } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();

  const getThemeBrand = () => {
    switch (theme) {
      case "black-parade":
        return {
          icon: <img src="/Resource/MCR2.svg" width={18} height={18} style={{ filter: 'invert(1) brightness(0.2)' }} />,
          name: "THE BLACK PARADE"
        };
      case "californication":
        return {
          icon: <img src="/Resource/RHCP.svg" width={18} height={18} />,
          name: "CALIFORNICATION"
        };
      default:
        return {
          icon: <img src="/Resource/A7X2.svg" width={22} height={22} />,
          name: "SEVENTH TRUMPET"
        };
    }
  };

  const brand = getThemeBrand();

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0.5rem 1.5rem",
        background: "rgba(var(--bg-void-rgb), 0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--clr-dim)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--clr-primary)" }}>{brand.icon}</span>
          <span
            className="font-display"
            style={{ fontSize: "0.9rem", letterSpacing: "0.15em", color: "var(--clr-muted)" }}
          >
            {brand.name}
          </span>
        </div>

        {/* Center */}
        <p
          className="footer-signature"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--clr-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.05em",
          }}
        >
          Crafted with{" "}
          <Heart size={12} style={{ color: "var(--clr-primary)", fill: "var(--clr-primary)" }} />{" "}
          & dark roast by{" "}
          <span style={{ color: "var(--clr-primary)" }}>SUCHAKREE</span>
        </p>

        {/* Right */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--clr-dim)",
            letterSpacing: "0.08em",
          }}
        >
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </footer>
  );
}
