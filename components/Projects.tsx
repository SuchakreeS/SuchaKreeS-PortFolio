"use client";
import { ExternalLink, Github, Smartphone, Sunset, Gauge } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  philosophy: string;
  tags: string[];
  icon: React.ReactNode;
  accent: string;
  links: { label: string; href: string; icon: React.ReactNode }[];
}

const projects: Project[] = [
  {
    id: "wong-nork",
    title: "Wong Nork",
    subtitle: "Group-Dining Discovery Platform",
    description:
      "A mobile-first restaurant discovery engine architected with React and Prisma. Real-time bidirectional communication via Socket.io enables instant group notifications and high-concurrency data synchronization. Integrated Mapbox API for real-time visual mapping of local listings.",
    philosophy:
      "Moody, mobile-first interface masking a highly complex group-sync architecture. Designed for the generation that plans dinner in a group chat with absolute precision.",
    tags: ["React", "Prisma", "Socket.io", "Mapbox API"],
    icon: <Smartphone size={22} />,
    accent: "var(--project-accent-wong)",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
  {
    id: "velvet-hideaway",
    title: "The Velvet Hideaway",
    subtitle: "Virtual Ambiance & Mixology App",
    description:
      "A full-stack platform utilizing React and Node.js to manage complex, categorized data for specialized recipes. Features Cloudinary integration reducing image payloads by 40%, and secure JWT/RBAC authentication for distinct user and administrative interfaces.",
    philosophy:
      "\"Gothic for Introverts\" — a UI so atmospheric it feels like ambient lighting, underpinned by ruthless performance optimization and strict access control.",
    tags: ["React", "Node.js", "Cloudinary", "JWT / RBAC"],
    icon: <Sunset size={22} />,
    accent: "var(--project-accent-velvet)",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
  {
    id: "luxe-fuel",
    title: "Luxe Fuel",
    subtitle: "JDM-Inspired Fleet Dashboard",
    description:
      "A high-end cockpit-aesthetic dashboard paying tribute to JDM engineering philosophy. Real-time telemetry, EV/PHEV monitoring, and precision data visualizations that feel like staring at a Recaro-bolstered instrument cluster at 9,000 RPM.",
    philosophy:
      "VTEC kicked in, yo. Every UI transition is engineered to feel like VTEC hitting the high-rev zone — snappy, decisive, mechanical.",
    tags: ["Next.js", "TypeScript", "Zustand", "Chart.js", "Tailwind CSS"],
    icon: <Gauge size={22} />,
    accent: "var(--project-accent-luxe)",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="vertical-section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ marginBottom: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
            Projects
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--clr-muted)",
              marginTop: "0.75rem",
            }}
          >
            // three acts. one vision.
          </p>
        </div>
      </motion.div>

      <div className="vertical-grid">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            className={`industrial-card project-card-${p.id}`}
            style={{ padding: "1.75rem" }}
          >
            {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${p.accent}44`,
                    background: `${p.accent}11`,
                    color: p.accent,
                    flexShrink: 0,
                  }}
                >
                  {p.icon}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {p.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "var(--clr-muted)",
                        textDecoration: "none",
                        border: "1px solid var(--clr-dim)",
                        padding: "4px 8px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-primary)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-muted)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-dim)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      }}
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Title - Glitch + Cinzel Bold */}
              <h3
                className="glitch font-display-bold"
                data-text={p.title}
                style={{
                  fontSize: "1.45rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--clr-text)",
                  marginBottom: "0.25rem",
                  cursor: "default",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: p.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                {p.subtitle}
              </p>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  color: "var(--clr-muted)",
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                }}
              >
                {p.description}
              </p>

              {/* Philosophy block */}
              <div
                style={{
                  borderLeft: `2px solid ${p.accent}`,
                  paddingLeft: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--clr-muted)",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                  }}
                >
                  {p.philosophy}
                </p>
              </div>

              {/* Tags — code-snippet style (JetBrains Mono + amethyst) */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {p.tags.map((tag) => (
                  <span key={tag} className="code-snippet">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
    </section>
  );
}
