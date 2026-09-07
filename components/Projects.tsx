"use client";
import { useEffect, useState } from "react";
import { ExternalLink, Github, Smartphone, Sunset, Gauge, Mic, Bell, Coins, TriangleAlert, X, Expand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ProjectStatus = "live" | "complete" | "in-dev";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  philosophy: string;
  tags: string[];
  icon: React.ReactNode;
  accent: string;
  status: ProjectStatus;
  warning?: string;
  featured?: boolean;
  links: { label: string; href: string; icon: React.ReactNode }[];
}

const STATUS_META: Record<ProjectStatus, { label: string; color: string }> = {
  live: { label: "Live", color: "var(--status-live)" },
  "in-dev": { label: "In Dev", color: "var(--status-dev)" },
  complete: { label: "Complete", color: "var(--clr-muted)" },
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: meta.color,
        border: `1px solid ${meta.color}55`,
        background: `${meta.color}14`,
        padding: "3px 8px",
        borderRadius: "3px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: meta.color,
          boxShadow: status === "live" ? `0 0 6px ${meta.color}` : "none",
        }}
      />
      {meta.label}
    </span>
  );
}

function WarningNote({ text }: { text: string }) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        lineHeight: 1.5,
        color: "var(--status-dev)",
        fontStyle: "italic",
      }}
    >
      <TriangleAlert size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
      {text}
    </p>
  );
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
    status: "complete",
    warning:
      "Built as a group project — this deploy isn't mine to maintain, so the backend/database may be offline, but you can still see the front end part which is my work including MapboxGl",
    links: [
      { label: "Live Site", href: "https://wongnork-frontend.vercel.app/", icon: <ExternalLink size={14} /> },
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
    status: "live",
    featured: true,
    links: [
      { label: "Live Site", href: "https://personal-project-the-velvet-hideawa.vercel.app/", icon: <ExternalLink size={14} /> },
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
    status: "complete",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
  {
    id: "helena",
    title: "Helena",
    subtitle: "Voice-Controlled AI Assistant",
    description:
      "A JARVIS-styled voice assistant running as a continuous loop: microphone audio is transcribed locally with Whisper, routed to a Gemini LLM with live function-calling tools (time, weather), and the reply is synthesized back into speech with Piper TTS. Conversation history persists in-memory across turns for contextual dialogue.",
    philosophy:
      "A local-first cockpit for talking to a model — record, think, speak, repeat — built to feel like an assistant that's actually listening, not just responding.",
    tags: ["Python", "Gemini API", "Whisper", "Piper TTS", "sounddevice"],
    icon: <Mic size={22} />,
    accent: "var(--project-accent-helena)",
    status: "in-dev",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
  {
    id: "steam-sale-bot",
    title: "SteamSaleBot",
    subtitle: "Discord Steam Sale Watcher",
    description:
      "A Discord bot that watches user-submitted Steam games and pings the server (DM + deduplicated channel message) the moment a discount is newly detected. A background loop polls Steam's live pricing every 60 seconds; migrated off a killed unofficial wishlist endpoint onto the official IWishlistService Web API after Valve broke it.",
    philosophy:
      "A from-scratch Python project built to actually learn the language — Cogs, background tasks, and a live third-party API that changes under you.",
    tags: ["Python", "discord.py", "Steam Web API", "JSON persistence"],
    icon: <Bell size={22} />,
    accent: "var(--project-accent-steam)",
    status: "in-dev",
    links: [
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
  {
    id: "poker-chips",
    title: "PokerChips",
    subtitle: "Chip Stack & Turn Tracker",
    description:
      "A shared-screen web app for home poker games played with real physical cards — it doesn't know anyone's hand, but it manages stacks, blinds, No-Limit/Pot-Limit/Limit betting structures, automatic pot and side-pot calculation, turn order, and manual showdown payouts, so the table doesn't have to do the math by hand.",
    philosophy:
      "Game logic kept as a pure, UI-agnostic module from day one, so the same engine can later drive real-time multiplayer without a rewrite.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS v4", "Vitest"],
    icon: <Coins size={22} />,
    accent: "var(--project-accent-poker)",
    status: "live",
    links: [
      { label: "Live Site", href: "https://poker-chips-smoky.vercel.app", icon: <ExternalLink size={14} /> },
      { label: "GitHub", href: "https://github.com/SuchakreeS", icon: <Github size={14} /> },
    ],
  },
];

const featuredProject = projects.find((p) => p.featured) ?? projects[0];
const otherProjects = projects.filter((p) => p.id !== featuredProject.id);

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = otherProjects.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);

  return (
    <section id="projects" className="vertical-section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Projects" subtitle="// six builds. one throughline." />
      </motion.div>

      {/* Featured project — full-width, full detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ marginBottom: "2rem" }}
      >
        <Card
          as="article"
          className={`project-card-${featuredProject.id}`}
          style={{ padding: "2rem" }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${featuredProject.accent}44`,
                  background: `${featuredProject.accent}11`,
                  color: featuredProject.accent,
                  flexShrink: 0,
                }}
              >
                {featuredProject.icon}
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--clr-primary)",
                  }}
                >
                  ★ Featured
                </span>
                <div style={{ marginTop: "2px" }}>
                  <StatusBadge status={featuredProject.status} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {featuredProject.links.map((link) => (
                <Button key={link.label} href={link.href} variant="outline" size="sm">
                  {link.icon}
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          <h3
            className="glitch font-display-bold"
            data-text={featuredProject.title}
            style={{
              fontSize: "1.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--clr-text)",
              marginBottom: "0.25rem",
              cursor: "default",
            }}
          >
            {featuredProject.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: featuredProject.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.1rem",
            }}
          >
            {featuredProject.subtitle}
          </p>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.86rem",
              color: "var(--clr-muted)",
              lineHeight: 1.8,
              marginBottom: "1.1rem",
              maxWidth: "70ch",
            }}
          >
            {featuredProject.description}
          </p>

          <div
            style={{
              borderLeft: `2px solid ${featuredProject.accent}`,
              paddingLeft: "0.75rem",
              marginBottom: "1.25rem",
              maxWidth: "70ch",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--clr-muted)",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              {featuredProject.philosophy}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {featuredProject.tags.map((tag) => (
              <span key={tag} className="code-snippet">
                {tag}
              </span>
            ))}
          </div>

          {featuredProject.warning && (
            <div style={{ marginTop: "1rem" }}>
              <WarningNote text={featuredProject.warning} />
            </div>
          )}
        </Card>
      </motion.div>

      {/* The rest — compact grid */}
      <div className="vertical-grid">
        {otherProjects.map((p, i) => (
          <motion.div
            key={p.id}
            layoutId={`project-modal-${p.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            onClick={() => setSelectedId(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedId(p.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View full details for ${p.title}`}
            style={{ cursor: "pointer", height: "100%" }}
          >
            <Card as="article" className={`project-card-${p.id}`} style={{ padding: "1.5rem", height: "100%", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  color: "var(--clr-muted)",
                  opacity: 0.6,
                }}
              >
                <Expand size={14} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "0.9rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
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
                <StatusBadge status={p.status} />
              </div>

              <h3
                className="glitch font-display-bold"
                data-text={p.title}
                style={{
                  fontSize: "1.25rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--clr-text)",
                  marginBottom: "0.2rem",
                  cursor: "default",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: p.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {p.subtitle}
              </p>

              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  color: "var(--clr-muted)",
                  lineHeight: 1.7,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1rem" }}>
                {p.tags.map((tag) => (
                  <span key={tag} className="code-snippet">
                    {tag}
                  </span>
                ))}
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex", gap: "8px", marginBottom: p.warning ? "0.75rem" : 0 }}
              >
                {p.links.map((link) => (
                  <Button key={link.label} href={link.href} variant="outline" size="sm">
                    {link.icon}
                    {link.label}
                  </Button>
                ))}
              </div>

              {p.warning && <WarningNote text={p.warning} />}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full-detail modal for a compact-grid project */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 lightbox-backdrop"
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              layoutId={`project-modal-${selectedProject.id}`}
              className="relative z-10 w-full"
              style={{ maxWidth: "700px", maxHeight: "88vh", overflowY: "auto" }}
            >
              <Card as="article" style={{ padding: "2rem", position: "relative" }}>
                <button
                  onClick={() => setSelectedId(null)}
                  aria-label="Close project details"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    color: "var(--clr-text)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--clr-dim)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${selectedProject.accent}44`,
                      background: `${selectedProject.accent}11`,
                      color: selectedProject.accent,
                      flexShrink: 0,
                    }}
                  >
                    {selectedProject.icon}
                  </div>
                  <StatusBadge status={selectedProject.status} />
                </div>

                <h3
                  className="glitch font-display-bold"
                  data-text={selectedProject.title}
                  style={{
                    fontSize: "1.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--clr-text)",
                    marginBottom: "0.25rem",
                    cursor: "default",
                  }}
                >
                  {selectedProject.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: selectedProject.accent,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "1.1rem",
                  }}
                >
                  {selectedProject.subtitle}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.86rem",
                    color: "var(--clr-muted)",
                    lineHeight: 1.8,
                    marginBottom: "1.1rem",
                  }}
                >
                  {selectedProject.description}
                </p>

                <div
                  style={{
                    borderLeft: `2px solid ${selectedProject.accent}`,
                    paddingLeft: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      color: "var(--clr-muted)",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedProject.philosophy}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.25rem" }}>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="code-snippet">
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: selectedProject.warning ? "0.75rem" : 0 }}>
                  {selectedProject.links.map((link) => (
                    <Button key={link.label} href={link.href} variant="outline" size="sm">
                      {link.icon}
                      {link.label}
                    </Button>
                  ))}
                </div>

                {selectedProject.warning && <WarningNote text={selectedProject.warning} />}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
