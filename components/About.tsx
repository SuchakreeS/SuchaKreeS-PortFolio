"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Beer, Cpu, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const [textIndex, setTextIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullText = "const developer = {\n  name: \"Suchakree Sattanusorn\",\n  role: \"Full-Stack Dev\",\n  education: \"KMITL (2018-2022)\",\n  languages: [\"English\", \"Spanish\"],\n  mindset: \"Zero-Error Tolerance\",\n};";

  const startTyping = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    const type = () => {
      setTextIndex(0);
      timerRef.current = setInterval(() => {
        setTextIndex((prev) => {
          if (prev < fullText.length) return prev + 1;
          if (timerRef.current) clearInterval(timerRef.current);

          timerRef.current = setTimeout(type, 4000);
          return prev;
        });
      }, 15);
    };

    type();
  }, [fullText.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTyping();
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
        }
      },
      { threshold: 0.3 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTyping]);

  const getPart = (text: string, start: number) => {
    if (textIndex <= start) return "";
    return text.slice(0, Math.max(0, textIndex - start));
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="vertical-section"
      style={{
        padding: "6rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "1.75rem" }}>
            About Me
          </h2>

          <div className="military-border" style={{ marginBottom: "1.5rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--clr-text)", lineHeight: 1.85 }}>
              Full-Stack Developer with a professional background in{" "}
              <span style={{ color: "var(--clr-primary)" }}>biotech production</span> and{" "}
              <span style={{ color: "var(--clr-primary)" }}>technical support</span>.
              Merging industrial precision with scalable web solutions.
            </p>
          </div>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--clr-muted)", lineHeight: 1.85, marginBottom: "2rem" }}>
            Specialized in architecting secure, multi-tenant systems using React, Node.js, and Prisma.
            With a "zero-error" mindset forged in high-stakes fermentation labs, I bring strict data integrity to software engineering—implementing complex real-time features like Socket.io notifications and robust RBAC security.
          </p>

          {/* Interest pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {[
              { icon: <Cpu size={14} />, label: "Zero-Error Mindset" },
              { icon: <Beer size={14} />, label: "B.S. Fermentation Tech" },
              { icon: <Music size={14} />, label: "Industrial Precision" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  border: "1px solid var(--clr-dim)",
                  background: "var(--bg-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--clr-muted)",
                  borderRadius: "2px",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--clr-primary)";
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--clr-primary)";
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = "var(--glow-purple)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--clr-dim)";
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--clr-muted)";
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = "none";
                }}
              >
                <span style={{ color: "var(--clr-primary)" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Decorative code block */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--clr-dim)",
            borderLeft: "3px solid var(--clr-primary)",
            padding: "1.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            lineHeight: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
            {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
            ))}
            <span style={{ marginLeft: "auto", color: "var(--clr-muted)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
              suchakree.dev
            </span>
          </div>
          <pre style={{ margin: 0, overflowX: "auto", whiteSpace: "pre-wrap" }}>
            <code style={{ display: "block" }}>
              {/* Line 1 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>1</span>
                <span>
                  <span style={{ color: "var(--clr-syntax-keyword)" }}>{getPart("const", 0)}</span>
                  {" "}
                  <span style={{ color: "var(--clr-primary)" }}>{getPart("developer", 6)}</span>
                  {" "}
                  <span style={{ color: "var(--clr-text)" }}>{getPart("= {", 16)}</span>
                </span>
              </div>
              {/* Line 2 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>2</span>
                <span style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--clr-syntax-prop)" }}>{getPart("name", 22)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(": ", 26)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"Suchakree Sattanusorn\"", 28)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(",", 51)}</span>
                </span>
              </div>
              {/* Line 3 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>3</span>
                <span style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--clr-syntax-prop)" }}>{getPart("role", 53)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(": ", 57)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"Full-Stack Dev\"", 59)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(",", 75)}</span>
                </span>
              </div>
              {/* Line 4 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>4</span>
                <span style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--clr-syntax-prop)" }}>{getPart("education", 77)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(": ", 86)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"KMITL (2018-2022)\"", 88)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(",", 107)}</span>
                </span>
              </div>
              {/* Line 5 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>5</span>
                <span style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--clr-syntax-prop)" }}>{getPart("languages", 109)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(": [", 118)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"English\"", 121)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(", ", 130)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"Spanish\"", 132)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart("],", 141)}</span>
                </span>
              </div>
              {/* Line 6 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>6</span>
                <span style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--clr-syntax-prop)" }}>{getPart("mindset", 144)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(": ", 151)}</span>
                  <span style={{ color: "var(--clr-syntax-string)" }}>{getPart("\"Zero-Error Tolerance\"", 153)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart(",", 175)}</span>
                </span>
              </div>
              {/* Line 7 */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ color: "var(--clr-syntax-linenum)", width: "1rem", textAlign: "right", userSelect: "none", fontSize: "0.7rem" }}>7</span>
                <span>
                  <span style={{ color: "var(--clr-text)" }}>{getPart("};", 177)}</span>
                  {textIndex < 180 && <span className="cursor-blink" style={{ marginLeft: "2px" }} />}
                </span>
              </div>
            </code>
          </pre>

          {/* Decorative corner accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0, right: 0,
              width: 0, height: 0,
              borderStyle: "solid",
              borderWidth: "0 0 32px 32px",
              borderColor: "transparent transparent var(--clr-primary) transparent",
              opacity: 0.4,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
