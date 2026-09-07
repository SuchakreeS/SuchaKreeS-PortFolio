"use client";
import { useTheme } from "./ThemeProvider";
import { themes } from "./themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "3.5rem",
        right: "1.5rem",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignItems: "flex-end",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--clr-muted)",
          marginBottom: "2px",
        }}
      >
        // theme
      </span>

      {/* Pill container */}
      <div
        style={{
          display: "flex",
          background: "var(--bg-elevated)",
          border: "1px solid var(--clr-dim)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {themes.map((t, i) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              title={t.description}
              onClick={() => setTheme(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                border: "none",
                borderRight: i < themes.length - 1 ? "1px solid var(--clr-dim)" : "none",
                background: isActive ? "var(--clr-primary)" : "transparent",
                color: isActive ? (t.id === "black-parade" ? "#1A1A1A" : "#fff") : "var(--clr-muted)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--clr-text)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--clr-muted)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
              }}
            >
              {/* Color dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: t.dot,
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 6px ${t.dot}88` : "none",
                  transition: "box-shadow 0.25s",
                }}
              />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
