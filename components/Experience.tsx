"use client";
import { Briefcase, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const experiences = [
  {
    role: "Technical Support",
    company: "Oskon Co.,Ltd.",
    period: "01/2025 — 10/2025",
    description:
      "Bridging the gap between complex engineering solutions and client requirements. Specialized in industrial-grade systems and precision instrumentation.",
    highlights: [
      "Provided technical consultation on specialized filtration systems and lab equipment to meet precise client specifications.",
      "Managed technical documentation and product specs for industrial-grade microbial testing systems.",
    ],
  },
  {
    role: "Bioproduct Production Staff",
    company: "Innovative Center for Production of Industrially used microorganisms",
    period: "07/2023 — 12/2024",
    description:
      "Operating at the intersection of biotechnology and system optimization. Managed critical processes where a 'zero-error' tolerance was not just an ideal, but a baseline requirement.",
    highlights: [
      "Data Integrity: Managed high-stakes fermentation cycles with a 'zero-error' mindset, ensuring 100% batch integrity and strict adherence to sterile protocols.",
      "System Troubleshooting: Monitored real-time production data to optimize yields and performed root-cause analysis on system deviations.",
      "Regulatory Compliance: Maintained rigorous audit trails and production logs to ensure total data accuracy and regulatory validation.",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="vertical-section"
      style={{ background: "var(--bg-surface)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ marginBottom: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
            Experience
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--clr-muted)",
              marginTop: "0.75rem",
            }}
          >
            // the riffs that built the repertoire
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="timeline-container">
        {/* Line */}
        <motion.div
          className="timeline-line"
          initial={{ scaleY: 0, transformOrigin: "top" }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {experiences.map((exp, i) => (
          <motion.div
            key={exp.role}
            className="timeline-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 + i * 0.15 }}
          >
            {/* Timeline dot */}
            <div
              className="timeline-dot animate-pulse-glow"
              style={{
                width: 12,
                height: 12,
                background: "var(--clr-primary)",
                border: "2px solid var(--bg-surface)",
              }}
            />

              {/* Card */}
              <div
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--clr-dim)",
                  borderTop: "2px solid var(--clr-primary)",
                  padding: "1.75rem",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--glow-purple)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--clr-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--clr-dim)";
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Briefcase size={16} style={{ color: "var(--clr-primary)" }} />
                    <h3
                      className="font-display-bold"
                      style={{ fontSize: "1.1rem", color: "var(--clr-text)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      {exp.role}
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--clr-muted)",
                      marginLeft: "auto",
                    }}
                  >
                    <Calendar size={12} />
                    {exp.period}
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "var(--clr-primary)",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                  }}
                >
                  @ {exp.company}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "var(--clr-muted)",
                    lineHeight: 1.8,
                    marginBottom: "1.25rem",
                  }}
                >
                  {exp.description}
                </p>

                {/* Highlights */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {exp.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--clr-muted)",
                        lineHeight: 1.75,
                      }}
                    >
                      <CheckCircle
                        size={14}
                        style={{ color: "var(--clr-primary)", flexShrink: 0, marginTop: "3px" }}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
