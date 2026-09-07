"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { themes, type ThemeMeta } from "./themes";

const REMEMBER_KEY = "portfolio-theme-remember";

// Band-logo artwork per theme, shown in the wheel's center hub.
const themeLogos: Record<ThemeMeta["id"], string> = {
  "seventh-trumpet": "/Resource/A7X2.svg",
  "black-parade": "/Resource/MCR2.svg",
  californication: "/Resource/RHCP.svg",
};

// Radial "weapon wheel" geometry — annulus divided into one wedge per theme.
const CX = 200;
const CY = 200;
const R_OUTER = 180;
const R_INNER = 82;
const GAP_DEG = 6;
const WEDGE_SPAN = 360 / themes.length;

// Rounded to avoid an SSR/client hydration mismatch: Math.cos/sin can differ
// in their last floating-point digit between Node and the browser.
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: round(CX + r * Math.cos(rad)), y: round(CY + r * Math.sin(rad)) };
}

function wedgePath(startAngle: number, endAngle: number) {
  const p1 = polar(R_OUTER, startAngle);
  const p2 = polar(R_OUTER, endAngle);
  const p3 = polar(R_INNER, endAngle);
  const p4 = polar(R_INNER, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
}

// Start the first wedge pointing straight up, like the reference weapon wheel.
const wedges = themes.map((t, i) => {
  const center = -90 + i * WEDGE_SPAN;
  const half = WEDGE_SPAN / 2 - GAP_DEG / 2;
  const startAngle = center - half;
  const endAngle = center + half;
  return {
    ...t,
    startAngle,
    endAngle,
    labelPos: polar((R_OUTER + R_INNER) / 2, center),
  };
});

function applyPreview(id: ThemeMeta["id"]) {
  const root = document.documentElement;
  if (id === "seventh-trumpet") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", id);
  }
}

export default function ThemeGate({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [armed, setArmed] = useState<ThemeMeta["id"]>(theme);
  const [remember, setRemember] = useState(false);
  const [entered, setEntered] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Keep the wheel's default (hover) selection in sync with the persisted
  // theme (e.g. once ThemeProvider finishes reading localStorage on mount).
  useEffect(() => {
    setArmed(theme);
  }, [theme]);

  // If the visitor previously checked "remember my choice", skip the gate
  // entirely — the theme itself is already restored by ThemeProvider.
  useEffect(() => {
    if (localStorage.getItem(REMEMBER_KEY) === "true") {
      setSkipAnimation(true);
      setEntered(true);
    }
  }, []);

  const previewTheme = useCallback((id: ThemeMeta["id"]) => {
    setArmed(id);
    applyPreview(id);
  }, []);

  const resetPreview = useCallback(() => {
    applyPreview(theme);
  }, [theme]);

  const confirm = useCallback(
    (id: ThemeMeta["id"]) => {
      setTheme(id);
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      setEntered(true);
    },
    [remember, setTheme]
  );

  useEffect(() => {
    if (entered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const idx = Number(e.key) - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < themes.length) {
        e.preventDefault();
        confirm(themes[idx].id);
        return;
      }
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        confirm(armed);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [entered, armed, confirm]);

  useEffect(() => {
    if (entered) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [entered]);

  const armedMeta = themes.find((t) => t.id === armed) ?? themes[0];

  return (
    <>
      {children}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="theme-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={skipAnimation ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 5000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              padding: "2rem",
              background:
                "radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-void) 75%)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1
                className="glitch font-display-bold"
                data-text="Welcome to my portfolio site"
                style={{
                  fontSize: "clamp(1.5rem, 4.4vw, 2.4rem)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--clr-text)",
                  cursor: "default",
                }}
              >
                Welcome to my portfolio site
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--clr-muted)",
                  marginTop: "0.6rem",
                }}
              >
                choose your aesthetic
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--clr-muted)",
                  marginTop: "0.6rem",
                }}
              >
                hover a slice to preview · click it to enter
              </p>
            </div>

            <svg
              viewBox="0 0 400 400"
              width={340}
              height={340}
              style={{ maxWidth: "80vw", maxHeight: "50vh", overflow: "visible" }}
              onMouseLeave={resetPreview}
              role="listbox"
              aria-label="Choose a theme"
            >
              {wedges.map((w) => {
                const isArmed = armed === w.id;
                return (
                  <g
                    key={w.id}
                    role="option"
                    aria-selected={isArmed}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => previewTheme(w.id)}
                    onClick={() => confirm(w.id)}
                  >
                    <path
                      d={wedgePath(w.startAngle, w.endAngle)}
                      fill={isArmed ? `${w.dot}33` : "var(--bg-surface)"}
                      stroke={isArmed ? w.dot : "var(--clr-dim)"}
                      strokeWidth={isArmed ? 2 : 1}
                      style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
                    />
                    <foreignObject
                      x={w.labelPos.x - 60}
                      y={w.labelPos.y - 28}
                      width={120}
                      height={56}
                      style={{ pointerEvents: "none" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: w.dot,
                            boxShadow: isArmed ? `0 0 8px ${w.dot}` : "none",
                            transition: "box-shadow 0.2s ease",
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.66rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: isArmed ? "var(--clr-text)" : "var(--clr-muted)",
                            textAlign: "center",
                            lineHeight: 1.3,
                            transition: "color 0.2s ease",
                          }}
                        >
                          {w.label}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Center hub — decorative, shows the armed theme's band logo */}
              <g style={{ pointerEvents: "none" }}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_INNER - 4}
                  fill="var(--clr-text)"
                  stroke={armedMeta.dot}
                  strokeWidth={2}
                  style={{
                    filter: `drop-shadow(0 0 10px ${armedMeta.dot})`,
                    transition: "stroke 0.2s ease, filter 0.2s ease",
                  }}
                />
                <foreignObject x={CX - 45} y={CY - 45} width={90} height={90}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={armedMeta.id}
                        src={themeLogos[armedMeta.id]}
                        alt={`${armedMeta.label} logo`}
                        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
                        transition={{ duration: 0.18 }}
                        style={{ width: "62px", height: "62px", objectFit: "contain" }}
                      />
                    </AnimatePresence>
                  </div>
                </foreignObject>
              </g>
            </svg>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--clr-muted)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{
                    width: 14,
                    height: 14,
                    accentColor: "var(--clr-primary)",
                    cursor: "pointer",
                  }}
                />
                remember my choice
              </label>

              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--clr-muted)",
                }}
              >
                press 1–{themes.length} to enter · esc for current
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
