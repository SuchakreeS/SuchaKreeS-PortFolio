"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Zap, Code2, Skull } from "lucide-react";
import { motion } from "framer-motion";

const TAGLINES = [
  "Full-Stack Developer",
  "Biotech Precision. Web Scalability.",
  "Architecting Secure Multi-Tenant Systems",
  "Gothic for Introverts. Code for Everyone."
];

export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = TAGLINES[taglineIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else {
        setTaglineIdx((i) => (i + 1) % TAGLINES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, taglineIdx]);

  return (
    <section
      id="hero"
      className="vertical-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
      }}
    >
      {/* Atmospheric Background Orb */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        style={{ zIndex: -10 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] blur-[80px] opacity-60"
          style={{
            background: "var(--hero-orb-gradient)",
            borderRadius: "50%",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        {/* Horizontal military divider - top */}
        <div className="stud-row animate-fade-up" style={{ width: "min(600px, 90%)", marginBottom: "2rem" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </div>

        {/* Name */}
        <div className="animate-fade-up delay-100" style={{ marginBottom: "0.5rem" }}>
          <h1
            className="font-display-bold animate-flicker"
            style={{
              fontSize: "clamp(3rem, 12vw, 8rem)",
              letterSpacing: "0.18em",
              lineHeight: 1.05,
              /* Cinzel Bold — carved in Electric Amethyst stone */
              background: "var(--hero-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
            }}
          >
            SUCHAKREE <br className="hidden md:block" /><span style={{ fontSize: "clamp(2rem, 8vw, 6rem)", opacity: 0.9 }}>SATTANUSORN</span>
          </h1>
        </div>

        {/* Role line */}
        <div className="animate-fade-up delay-200" style={{ marginBottom: "1.75rem" }}>
          <p
            className="font-mono"
            style={{
              fontSize: "clamp(0.8rem, 2.5vw, 1.05rem)",
              color: "var(--clr-primary)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              minHeight: "1.6em",
            }}
          >
            <span className="cursor-blink">{displayed}</span>
          </p>
        </div>

        {/* Tagline row */}
        <div
          className="animate-fade-up delay-300"
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <span className="tech-badge"><Code2 size={12} /> React & Next.js</span>
          <span className="tech-badge"><Zap size={12} /> WebSockets</span>
          <span className="tech-badge"><Skull size={12} /> Seventh Trumpet</span>
        </div>

        {/* CTA buttons */}
        <div
          className="animate-fade-up delay-400"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}
        >
          <a
            href="#projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "var(--clr-primary)",
              color: "#fff",
              border: "none",
              clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
              textDecoration: "none",
              transition: "background 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-primary)";
            }}
          >
            View Projects
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 2rem",
              background: "transparent",
              color: "var(--clr-primary)",
              border: "1px solid var(--clr-primary)",
              clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(168,85,247,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Get in Touch
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="animate-fade-up delay-500"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "var(--clr-muted)",
          textDecoration: "none",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          transition: "color 0.25s",
          animation: "fadeUp 0.7s ease forwards, blink-scroll 2s ease-in-out infinite 1s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-muted)")}
      >
        Scroll
        <ChevronDown size={16} style={{ animation: "bounceRight 1.5s infinite", transform: "rotate(-90deg)" }} />
      </a>

      {/* Horizontal military divider - bottom */}
      <div className="stud-row animate-fade-up delay-600" style={{ width: "min(600px, 90%)", marginTop: "2.5rem" }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="stud" />
        ))}
      </div>

      <style>{`
        @keyframes bounceRight {
          0%, 100% { transform: translateX(0) rotate(-90deg); }
          50%       { transform: translateX(6px) rotate(-90deg); }
        }
      `}</style>
    </section>
  );
}
