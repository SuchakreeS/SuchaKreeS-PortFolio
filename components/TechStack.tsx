"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "tooling";
}

const skills: Skill[] = [
  // Frontend
  { name: "JavaScript / TypeScript", level: 90, category: "frontend" },
  { name: "React.js / Next.js", level: 85, category: "frontend" },
  { name: "HTML5 & CSS3", level: 90, category: "frontend" },
  { name: "Tailwind CSS", level: 95, category: "frontend" },
  { name: "Zustand", level: 88, category: "frontend" },
  { name: "Axios", level: 85, category: "frontend" },

  // Backend
  { name: "Node.js / Express.js", level: 88, category: "backend" },
  { name: "MySQL", level: 80, category: "backend" },
  { name: "JWT / Bcrypt", level: 85, category: "backend" },
  { name: "Socket.io", level: 82, category: "backend" }, // mentioned in projects

  // Tooling / Soft Skills
  { name: "Git", level: 85, category: "tooling" },
  { name: "Figma", level: 80, category: "tooling" },
  { name: "QA & Testing", level: 88, category: "tooling" },
  { name: "Troubleshooting", level: 92, category: "tooling" },
  { name: "Documentation", level: 85, category: "tooling" },
];

const CATEGORIES = ["all", "frontend", "backend", "tooling"] as const;
type Category = (typeof CATEGORIES)[number];

const categoryColors: Record<string, string> = {
  frontend: "var(--clr-cat-frontend)",
  backend: "var(--clr-cat-backend)",
  tooling: "var(--clr-cat-tooling)",
};

export default function TechStack() {
  const [active, setActive] = useState<Category>("all");

  const filtered = skills.filter((s) => active === "all" || s.category === active);

  return (
    <section
      id="stack"
      className="vertical-section"
      style={{
        padding: "6rem 1.5rem",
        background: "var(--bg-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
            Tech Stack
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--clr-muted)",
              marginTop: "0.75rem",
            }}
          >
            // tools of the trade
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 18px",
                background: active === cat ? "var(--clr-primary)" : "var(--bg-elevated)",
                color: active === cat ? "#fff" : "var(--clr-muted)",
                border: `1px solid ${active === cat ? "var(--clr-primary)" : "var(--clr-dim)"}`,
                clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: active === cat ? "var(--glow-purple)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                background: "var(--bg-surface)",
                border: `1px solid var(--tech-border)`,
                borderLeft: `3px solid ${categoryColors[skill.category]}`,
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.6rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "var(--tech-text)",
                  }}
                >
                  {skill.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: categoryColors[skill.category],
                    letterSpacing: "0.1em",
                  }}
                >
                  {skill.level}%
                </span>
              </div>
              <div className="skill-bar">
                <motion.div
                  className="skill-bar-fill"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 + 0.2 }}
                  style={{
                    background: `linear-gradient(90deg, var(--clr-secondary), ${categoryColors[skill.category]})`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
