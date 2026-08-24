"use client";
import { Mail, Github, Twitter, Linkedin, Send } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

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
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", textAlign: "center" }}>
        {/* Stud decoration */}
        <div className="stud-row" style={{ marginBottom: "2.5rem" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </div>

        <SectionHeader title="Get In Touch" />
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
        <div style={{ marginBottom: "3rem" }}>
          <Button href="mailto:suchakreesattanusorn@gmail.com" variant="outline">
            <Mail size={16} />
            Say Hello
            <Send size={14} />
          </Button>
        </div>

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
