"use client";
import { Mail, Github, Twitter, Linkedin, Send } from "lucide-react";

const socials = [
  { icon: <Github size={20} />, label: "GitHub", href: "https://github.com/SuchakreeS", handle: "SuchakreeS" },
  { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://linkedin.com/in/suchakrees0803", handle: "suchakrees0803" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="vertical-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "100px", // space for sticky footer
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", textAlign: "center" }}>
        {/* Stud decoration */}
        <div className="stud-row" style={{ marginBottom: "2.5rem" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </div>

        <h2
          className="section-title"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "1rem" }}
        >
          Get In Touch
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--clr-muted)",
            marginBottom: "3rem",
            lineHeight: 1.8,
          }}
        >
          Based in Pathum Thani, Thailand. <br/>
          Whether you have a project idea, want to collaborate, or just want to
          talk shop about industrial precision systems — my inbox is always open.
        </p>

        {/* Email CTA */}
        <a
          href="mailto:suchakreesattanusorn@gmail.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "1rem 2.5rem",
            background: "transparent",
            color: "var(--clr-primary)",
            border: "1px solid var(--clr-primary)",
            textDecoration: "none",
            clipPath: "polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)",
            transition: "all 0.3s",
            marginBottom: "3rem",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--clr-primary)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          <Mail size={16} />
          Say Hello
          <Send size={14} />
        </a>

        {/* Socials */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                color: "var(--clr-muted)",
                textDecoration: "none",
                padding: "1rem",
                border: "1px solid var(--clr-dim)",
                background: "var(--bg-surface)",
                minWidth: "110px",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-primary)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-primary)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--glow-purple)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--clr-muted)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--clr-dim)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              }}
            >
              {s.icon}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                {s.handle}
              </span>
            </a>
          ))}
        </div>

        {/* Bottom stud */}
        <div className="stud-row" style={{ marginTop: "3.5rem" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </div>
      </div>
    </section>
  );
}
