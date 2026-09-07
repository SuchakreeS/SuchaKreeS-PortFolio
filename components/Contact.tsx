"use client";
import { useState } from "react";
import { Mail, Github, Linkedin, MapPin, Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });

const EMAIL = "suchakreesattanusorn@gmail.com";

const socials = [
  { icon: <Github size={20} />, label: "GitHub", href: "https://github.com/SuchakreeS", handle: "SuchakreeS" },
  { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://linkedin.com/in/suchakrees0803", handle: "suchakrees0803" },
];

function AvailabilityBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--status-live)",
        border: "1px solid var(--status-live)55",
        background: "var(--status-live)14",
        padding: "5px 12px",
        borderRadius: "3px",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--status-live)",
          boxShadow: "0 0 6px var(--status-live)",
        }}
      />
      Open to Opportunities
    </span>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
  copyValue,
  isLast,
}: {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
  copyValue?: string;
  isLast?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (permissions, insecure context) — the
      // value is still visible and selectable, so fail silently.
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        paddingLeft: "1.25rem",
        marginBottom: "0.6rem",
      }}
    >
      <span style={{ color: "var(--clr-primary)", display: "flex", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: "var(--clr-syntax-prop)" }}>{label}</span>
      <span style={{ color: "var(--clr-text)" }}>:</span>
      {href ? (
        <a
          href={href}
          style={{ color: "var(--clr-syntax-string)", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          &quot;{value}&quot;
        </a>
      ) : (
        <span style={{ color: "var(--clr-syntax-string)" }}>&quot;{value}&quot;</span>
      )}
      {!isLast && <span style={{ color: "var(--clr-text)" }}>,</span>}
      {copyValue && (
        <button
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: copied ? "var(--status-live)" : "var(--clr-muted)",
            display: "flex",
            padding: "2px",
            flexShrink: 0,
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="vertical-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <ParticleField count={180} />
      </div>

      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Stud decoration */}
        <div className="stud-row" style={{ marginBottom: "2.5rem" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </div>

        <SectionHeader title="Get In Touch" />

        <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem 0 1.5rem" }}>
          <AvailabilityBadge />
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--clr-muted)",
            marginBottom: "2.5rem",
            lineHeight: 1.8,
          }}
        >
          Whether it&apos;s a project idea, a collab, or just talking shop about
          industrial precision systems — my inbox is always open.
        </p>

        {/* Terminal-style contact panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--clr-dim)",
            borderLeft: "3px solid var(--clr-primary)",
            padding: "1.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            textAlign: "left",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "6px", marginBottom: "1.1rem" }}>
            {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
            ))}
            <span style={{ marginLeft: "auto", color: "var(--clr-muted)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
              contact.json
            </span>
          </div>

          <div style={{ color: "var(--clr-text)", marginBottom: "0.6rem" }}>{"{"}</div>
          <ContactRow
            label="email"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
            icon={<Mail size={14} />}
            copyValue={EMAIL}
          />
          <ContactRow label="location" value="Pathum Thani, Thailand" icon={<MapPin size={14} />} isLast />
          <div style={{ color: "var(--clr-text)" }}>{"}"}</div>
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
            <Card key={s.label} accentColor="var(--clr-primary)" style={{ padding: 0 }}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="contact-social-link"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "1.1rem 1.5rem",
                  color: "var(--clr-muted)",
                  textDecoration: "none",
                  minWidth: "110px",
                }}
              >
                {s.icon}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                  {s.handle}
                </span>
              </a>
            </Card>
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
