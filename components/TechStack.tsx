"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, Database, Code, Terminal, Server, HelpCircle,
  Cpu, Layout, Layers, RefreshCw, GitBranch, Ship, Globe
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface TechItem {
  key: string;
  name: string;
  desc: string;
  tagline: string;
  colorName: "blue" | "light-blue" | "green" | "purple" | "red" | "orange" | "black";
  icon: React.ReactNode;
}



const techSkills: TechItem[] = [
  // Row 1 (Frontend Core & State)
  {
    key: "Q",
    name: "JavaScript / TypeScript",
    desc: "Frontend Core",
    tagline: "Dynamic web interaction powered by robust strictly typed scripting!",
    colorName: "blue",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <rect x="0" y="0" width="50" height="100" fill="#F7DF1E" />
        <rect x="50" y="0" width="50" height="100" fill="#3178C6" />
        <text x="25" y="65" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="32" fill="#000" textAnchor="middle">JS</text>
        <text x="75" y="65" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="32" fill="#FFF" textAnchor="middle">TS</text>
      </svg>
    )
  },
  {
    key: "W",
    name: "React.js / Next.js",
    desc: "Frontend UI Framework",
    tagline: "Component-driven render pipelines and server-optimized page architectures!",
    colorName: "light-blue",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <ellipse cx="25" cy="50" rx="6" ry="22" fill="none" stroke="#61DAFB" strokeWidth="3" transform="rotate(30 25 50)" />
        <ellipse cx="25" cy="50" rx="6" ry="22" fill="none" stroke="#61DAFB" strokeWidth="3" transform="rotate(-30 25 50)" />
        <ellipse cx="25" cy="50" rx="6" ry="22" fill="none" stroke="#61DAFB" strokeWidth="3" transform="rotate(90 25 50)" />
        <circle cx="25" cy="50" r="3" fill="#61DAFB" />
        <circle cx="75" cy="50" r="22" fill="#000" stroke="#FFF" strokeWidth="2" />
        <path d="M68 62 V38 L81 60 V38" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  },
  {
    key: "E",
    name: "HTML5 & CSS3",
    desc: "Layout Core",
    tagline: "Semantic content hierarchy and modern responsive stylesheet declarations!",
    colorName: "red",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <path d="M5 15 L13 75 L30 80 L47 75 L55 15 Z" fill="#E34F26" />
        <path d="M30 22 H13 L15 40 H30 V22" fill="#FFF" opacity="0.9" />
        <path d="M30 48 H14 L15 62 L30 66 V48" fill="#FFF" opacity="0.9" />
        <path d="M45 15 L53 75 L70 80 L87 75 L95 15 Z" fill="#1572B6" />
        <path d="M70 22 H87 L85 40 H70 V22" fill="#FFF" opacity="0.9" />
        <path d="M70 48 H84 L82 62 L70 66 V48" fill="#FFF" opacity="0.9" />
      </svg>
    )
  },
  {
    key: "R",
    name: "Tailwind CSS",
    desc: "Atomic Styling",
    tagline: "Rapid, utility-first UI styling with custom themes and responsive layout helpers!",
    colorName: "light-blue",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <path d="M50 30 C30 30, 20 45, 20 60 C35 60, 40 50, 50 50 C65 50, 70 60, 80 60 C80 45, 70 30, 50 30 Z" fill="#06B6D4" />
        <path d="M30 50 C15 50, 10 65, 10 80 C25 80, 30 70, 40 70 C55 70, 60 80, 70 80 C70 65, 60 50, 40 50 Z" fill="#38BDF8" />
      </svg>
    )
  },
  {
    key: "T",
    name: "Zustand",
    desc: "Global State",
    tagline: "Lightweight, high-performance central state store for react loop data flow!",
    colorName: "purple",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
        <circle cx="50" cy="55" r="32" stroke="#A855F7" strokeWidth="4" />
        <circle cx="37" cy="50" r="4" fill="#A855F7" />
        <circle cx="63" cy="50" r="4" fill="#A855F7" />
        <path d="M42 68 Q50 76 58 68" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
        <circle cx="28" cy="24" r="10" fill="#A855F7" />
        <circle cx="72" cy="24" r="10" fill="#A855F7" />
      </svg>
    )
  },

  // Row 2 (API & Backend Systems)
  {
    key: "A",
    name: "Axios",
    desc: "HTTP Client",
    tagline: "Promise-based API requests, automatic JSON transforms, and request interceptors!",
    colorName: "blue",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <polygon points="50,15 85,80 15,80" fill="#5A29E4" />
        <text x="50" y="70" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="28" fill="#FFF" textAnchor="middle">A</text>
      </svg>
    )
  },
  {
    key: "S",
    name: "Node.js / Express.js",
    desc: "Backend Router",
    tagline: "High-performance, event-driven async javascript RESTful routing runtime!",
    colorName: "green",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <polygon points="20,25 45,10 70,25 70,55 45,70 20,55" fill="#339933" />
        <text x="45" y="47" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="#FFF" textAnchor="middle">N</text>
        <circle cx="68" cy="68" r="20" fill="#000" stroke="#FFF" strokeWidth="2" />
        <text x="68" y="75" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="18" fill="#FFF" textAnchor="middle">ex</text>
      </svg>
    )
  },
  {
    key: "D",
    name: "MySQL",
    desc: "Relational Database",
    tagline: "Robust, scalable tabular data storage with strictly defined schema constraints!",
    colorName: "blue",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <path d="M15 30 Q50 10 85 30 T85 70 Q50 90 15 70 Z" fill="#00758F" opacity="0.8" />
        <path d="M25 40 Q50 22 75 40" stroke="#FFF" strokeWidth="4" fill="none" />
        <path d="M25 58 Q50 40 75 58" stroke="#FFF" strokeWidth="4" fill="none" />
      </svg>
    )
  },
  {
    key: "F",
    name: "JWT / Bcrypt",
    desc: "Auth Security",
    tagline: "Cryptographic hash salting and stateless JSON Web Token auth handshakes!",
    colorName: "purple",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <circle cx="50" cy="50" r="38" stroke="#FB009B" strokeWidth="5" fill="none" strokeDasharray="140 100" />
        <circle cx="50" cy="50" r="26" stroke="#00B9FF" strokeWidth="5" fill="none" strokeDasharray="80 100" />
        <circle cx="50" cy="50" r="14" stroke="#D9D9D9" strokeWidth="5" fill="none" />
      </svg>
    )
  },
  {
    key: "G",
    name: "Socket.io",
    desc: "Real-time Network",
    tagline: "Full-duplex, low-latency bi-directional websocket communication tunnels!",
    colorName: "orange",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <circle cx="50" cy="50" r="40" fill="#010101" />
        <path d="M30 50 A20 20 0 1 1 70 50 A20 20 0 1 1 30 50" fill="none" stroke="#FFF" strokeWidth="5" />
        <circle cx="50" cy="50" r="8" fill="#FFF" />
      </svg>
    )
  },

  // Row 3 (Tooling & Mapping)
  {
    key: "Z",
    name: "Git",
    desc: "Version Control",
    tagline: "Branch merges, pull request code commits, and team collaboration safety!",
    colorName: "red",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#F05032" transform="rotate(45 50 50)" />
        <circle cx="50" cy="30" r="7" fill="#FFF" />
        <circle cx="50" cy="70" r="7" fill="#FFF" />
        <circle cx="70" cy="50" r="7" fill="#FFF" />
        <line x1="50" y1="37" x2="50" y2="63" stroke="#FFF" strokeWidth="4" />
        <path d="M50 50 Q60 50 63 50" stroke="#FFF" strokeWidth="4" fill="none" />
      </svg>
    )
  },
  {
    key: "X",
    name: "Figma",
    desc: "UI/UX Prototyping",
    tagline: "Collaborative component vector layouts, wireframes, and design specs!",
    colorName: "purple",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <path d="M30 20 A15 15 0 0 1 60 20 L60 35 L30 35 Z" fill="#F24E1E" />
        <path d="M60 20 A15 15 0 0 1 90 20 L90 35 L60 35 Z" fill="#FF7262" />
        <path d="M30 50 A15 15 0 0 1 60 50 L60 65 L30 65 Z" fill="#A259FF" />
        <circle cx="75" cy="50" r="15" fill="#1ABCFE" />
        <path d="M30 80 A15 15 0 0 1 60 80 L60 65 L30 65 Z" fill="#0ACF83" transform="rotate(90 45 80)" />
      </svg>
    )
  },
  {
    key: "C",
    name: "Mapbox GL",
    desc: "Geospatial Visualization",
    tagline: "Complex 2D/3D map layer rendering and high-performance geographic data visualization!",
    colorName: "green",
    icon: (
      <svg viewBox="0 0 100 100" className="w-7 h-7">
        <path d="M50 10 C32 10, 18 24, 18 42 C18 66, 50 88, 50 88 C50 88, 82 66, 82 42 C82 24, 68 10, 50 10 Z" fill="#30B678" />
        <circle cx="50" cy="40" r="14" fill="#FFF" />
      </svg>
    )
  },
];

const keyToTechMap = techSkills.reduce((acc, skill) => {
  acc[skill.key] = skill;
  return acc;
}, {} as Record<string, TechItem>);

// Synthesizer mechanical click sound function
const playClickSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Snappy contact click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1200, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    // Bottom-out resonance
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(250, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(filter);
    filter.connect(ctx.destination);

    osc1.start();
    osc1.stop(ctx.currentTime + 0.06);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.09);
  } catch (err) {
    console.error("Audio Context failed:", err);
  }
};

const DriftingCodeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || 600;

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    const codeLines = [
      "import { useEffect } from 'react';",
      "const osc = ctx.createOscillator();",
      "ctx.currentTime + 0.05",
      "transform: rotateX(45deg);",
      "animate={{ translateY: pressed }}",
      "const [active, setActive] = useState();",
      "const ctx = canvas.getContext('2d');",
      "using use = useUsing('use');",
      "const playClickSound = () => {",
      "boxShadow: pressed ? '0px 1px' : '0px 8px'",
      "const filter = ctx.createBiquadFilter();",
      "clip-path: polygon(0 0, 100% 0);",
      "framer-motion-springs-active",
      "mongodb://localhost:27017/portfolio",
      "docker run -p 3000:3000 nextjs-site"
    ];

    const columns = Math.floor(width / 180);
    const particles = Array.from({ length: columns }, (_, idx) => ({
      x: idx * 180 + Math.random() * 50,
      y: Math.random() * height + height,
      speed: 0.3 + Math.random() * 0.3,
      text: codeLines[Math.floor(Math.random() * codeLines.length)],
      opacity: 0.03 + Math.random() * 0.06
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(16, 185, 129, 1)";

      particles.forEach((p) => {
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.fillText(p.text, p.x, p.y);

        p.y -= p.speed;

        if (p.y < -20) {
          p.y = height + 30;
          p.x = Math.random() * width;
          p.text = codeLines[Math.floor(Math.random() * codeLines.length)];
          p.speed = 0.3 + Math.random() * 0.3;
          p.opacity = 0.03 + Math.random() * 0.06;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30 z-0" />;
};

export default function TechStack() {
  const [focusedTech, setFocusedTech] = useState<TechItem>(techSkills[1]); // Default React.js / Next.js
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const handleChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const getThemeKeycapColors = (colorName: string) => {
    if (colorName === "blue" || colorName === "light-blue") {
      return {
        topBg: "var(--clr-primary)",
        textColor: "var(--bg-void)",
        borderStyle: "1px solid rgba(255, 255, 255, 0.35)",
        frontBg: "var(--clr-primary)",
        glowColor: "var(--clr-primary)"
      };
    } else if (colorName === "green" || colorName === "purple") {
      return {
        topBg: "var(--clr-secondary)",
        textColor: "#FFFFFF",
        borderStyle: "1px solid rgba(255, 255, 255, 0.2)",
        frontBg: "var(--clr-secondary)",
        glowColor: "var(--clr-secondary)"
      };
    } else {
      return {
        topBg: "var(--bg-elevated)",
        textColor: "var(--clr-text)",
        borderStyle: "1px solid var(--clr-dim)",
        frontBg: "var(--bg-elevated)",
        glowColor: "var(--clr-primary)"
      };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (keyToTechMap[key]) {
        e.preventDefault();
        setActiveKey(key);
        setFocusedTech(keyToTechMap[key]);
        playClickSound();

        setTimeout(() => {
          setActiveKey(null);
        }, 120);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyClick = (skill: TechItem) => {
    setActiveKey(skill.key);
    setFocusedTech(skill);
    playClickSound();

    setTimeout(() => {
      setActiveKey(null);
    }, 120);
  };

  const handleKeyHover = (skill: TechItem) => {
    setHoveredKey(skill.key);
    if (focusedTech.key !== skill.key) {
      setActiveKey(skill.key);
      setFocusedTech(skill);
      playClickSound();

      setTimeout(() => {
        setActiveKey(null);
      }, 120);
    }
  };

  return (
    <section
      id="stack"
      className="vertical-section bg-base-100 relative overflow-hidden"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Drifting Code hacker background decoration */}
      <DriftingCodeBackground />

      <div className="relative z-10 w-full" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header Block */}
        <SectionHeader
          title="Skills"
          subtitle="(hint: press any corresponding letter on your physical keyboard)"
        />

        {/* Console layout columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Panel: Giant Floating Skill Title & Tagline */}
          <div className="lg:col-span-5 flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={focusedTech.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 font-mono"
              >
                {/* Trigger Key visual box */}
                <div className="inline-flex items-center gap-3">
                  <span className="border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 text-xs rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    KEY [{focusedTech.key}]
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[var(--clr-muted)]">
                    {focusedTech.desc}
                  </span>
                </div>

                {/* Giant glitching 3D title */}
                <h3
                  className="font-display-bold text-5xl sm:text-6xl tracking-wider text-[var(--clr-primary)] uppercase select-none drop-shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                  style={{
                    color: "var(--clr-primary)"
                  }}
                >
                  {focusedTech.name}
                </h3>

                {/* Cyber tagline block */}
                <div className="border-l-2 border-emerald-500 pl-4 py-1 mt-2">
                  <p className="text-sm italic leading-relaxed text-[var(--clr-text)]">
                    "{focusedTech.tagline}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel: Isometric Floating mechanical keycaps centerpiece */}
          <div className="lg:col-span-7 flex justify-center items-center py-10">

            {/* 3D Perspective container */}
            <div
              style={{ perspective: "1200px" }}
              className="w-full flex justify-center items-center"
            >

              {/* Rotated mechanical keyboard grid */}
              <div
                className="transform-gpu rotate-x-[52deg] -rotate-z-[36deg] rotate-y-[4deg] preserve-3d flex flex-col gap-5 scale-90 sm:scale-100"
              >

                {/* Staggered Row 1 */}
                <div className="flex gap-4">
                  {techSkills.slice(0, 5).map((skill) => {
                    const pressed = activeKey === skill.key || focusedTech.key === skill.key;
                    const colors = getThemeKeycapColors(skill.colorName);
                    return (
                      <motion.button
                        key={skill.key}
                        aria-label={`${skill.name} — press ${skill.key} key`}
                        onClick={() => handleKeyClick(skill)}
                        onMouseEnter={() => handleKeyHover(skill)}
                        onMouseLeave={() => setHoveredKey(null)}
                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                        animate={{
                          translateY: pressed ? 6 : 0,
                          boxShadow: pressed
                            ? "0px 1px 2px rgba(0,0,0,0.6)"
                            : `0px 8px 0px rgba(0,0,0,0.25), 0px 12px 20px rgba(0,0,0,0.6)`
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md font-mono flex flex-col justify-between p-2 cursor-pointer select-none border-t border-l border-r"
                        style={{
                          transformStyle: "preserve-3d",
                          backgroundColor: colors.topBg,
                          color: colors.textColor,
                          borderTop: colors.borderStyle,
                          borderLeft: colors.borderStyle,
                          borderRight: colors.borderStyle,
                          boxShadow: pressed ? "none" : `0 0 15px ${colors.glowColor}33`
                        }}
                      >
                        {/* 3D front-edge extrusion depth */}
                        <div
                          className="absolute inset-x-0 -bottom-[8px] h-[8px] rounded-b-md transition-all duration-100"
                          style={{
                            background: colors.frontBg,
                            filter: "brightness(0.65) contrast(1.1)",
                            transform: pressed ? "scaleY(0)" : "scaleY(1)",
                            transformOrigin: "top"
                          }}
                        />

                        {/* Holographic float-out brand logo when hovered */}
                        <AnimatePresence>
                          {hoveredKey === skill.key && (
                            <motion.div
                              initial={{ opacity: 0, y: 0, scale: 0.6, z: 0 }}
                              animate={
                                prefersReducedMotion
                                  ? { opacity: 0.8, y: -50, scale: 1.45, z: 40 }
                                  : {
                                      opacity: [0, 0.8, 0.5, 0.9, 0.6, 0.8], // futuristic glitch flicker
                                      y: -50,
                                      scale: 1.45,
                                      z: 40,
                                    }
                              }
                              exit={{ opacity: 0, y: 0, scale: 0.6 }}
                              transition={
                                prefersReducedMotion
                                  ? { y: { type: "spring", stiffness: 120, damping: 10 } }
                                  : {
                                      y: { type: "spring", stiffness: 120, damping: 10 },
                                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "reverse" },
                                    }
                              }
                              className="absolute pointer-events-none z-30 flex flex-col items-center justify-center"
                              style={{
                                transformStyle: "preserve-3d",
                                filter: `drop-shadow(0 0 10px ${colors.glowColor}) brightness(1.2)`
                              }}
                            >
                              <div className="w-10 h-10 flex items-center justify-center filter saturate-150 transform rotate-x-[15deg] scale-125">
                                {skill.icon}
                              </div>
                              {/* projector vertical beam effect */}
                              <div
                                className="w-[1px] h-[22px] opacity-40 mt-1"
                                style={{
                                  backgroundImage: `linear-gradient(to top, transparent, ${colors.glowColor})`
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Letter in top-left */}
                        <span className="text-[10px] opacity-70 font-bold self-start leading-none uppercase animate-fade-in">
                          {skill.key}
                        </span>

                        {/* Graphic Icon in center */}
                        <div className="self-center flex items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                          {skill.icon}
                        </div>

                        {/* Blank placeholder to balance flex */}
                        <div className="h-[2px]" />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Staggered Row 2 */}
                <div className="flex gap-4 pl-4 sm:pl-6">
                  {techSkills.slice(5, 10).map((skill) => {
                    const pressed = activeKey === skill.key || focusedTech.key === skill.key;
                    const colors = getThemeKeycapColors(skill.colorName);
                    return (
                      <motion.button
                        key={skill.key}
                        aria-label={`${skill.name} — press ${skill.key} key`}
                        onClick={() => handleKeyClick(skill)}
                        onMouseEnter={() => handleKeyHover(skill)}
                        onMouseLeave={() => setHoveredKey(null)}
                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                        animate={{
                          translateY: pressed ? 6 : 0,
                          boxShadow: pressed
                            ? "0px 1px 2px rgba(0,0,0,0.6)"
                            : `0px 8px 0px rgba(0,0,0,0.25), 0px 12px 20px rgba(0,0,0,0.6)`
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md font-mono flex flex-col justify-between p-2 cursor-pointer select-none border-t border-l border-r"
                        style={{
                          transformStyle: "preserve-3d",
                          backgroundColor: colors.topBg,
                          color: colors.textColor,
                          borderTop: colors.borderStyle,
                          borderLeft: colors.borderStyle,
                          borderRight: colors.borderStyle,
                          boxShadow: pressed ? "none" : `0 0 15px ${colors.glowColor}33`
                        }}
                      >
                        {/* 3D front-edge extrusion depth */}
                        <div
                          className="absolute inset-x-0 -bottom-[8px] h-[8px] rounded-b-md transition-all duration-100"
                          style={{
                            background: colors.frontBg,
                            filter: "brightness(0.65) contrast(1.1)",
                            transform: pressed ? "scaleY(0)" : "scaleY(1)",
                            transformOrigin: "top"
                          }}
                        />

                        {/* Holographic float-out brand logo when hovered */}
                        <AnimatePresence>
                          {hoveredKey === skill.key && (
                            <motion.div
                              initial={{ opacity: 0, y: 0, scale: 0.6, z: 0 }}
                              animate={
                                prefersReducedMotion
                                  ? { opacity: 0.8, y: -50, scale: 1.45, z: 40 }
                                  : {
                                      opacity: [0, 0.8, 0.5, 0.9, 0.6, 0.8], // futuristic glitch flicker
                                      y: -50,
                                      scale: 1.45,
                                      z: 40,
                                    }
                              }
                              exit={{ opacity: 0, y: 0, scale: 0.6 }}
                              transition={
                                prefersReducedMotion
                                  ? { y: { type: "spring", stiffness: 120, damping: 10 } }
                                  : {
                                      y: { type: "spring", stiffness: 120, damping: 10 },
                                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "reverse" },
                                    }
                              }
                              className="absolute pointer-events-none z-30 flex flex-col items-center justify-center"
                              style={{
                                transformStyle: "preserve-3d",
                                filter: `drop-shadow(0 0 10px ${colors.glowColor}) brightness(1.2)`
                              }}
                            >
                              <div className="w-10 h-10 flex items-center justify-center filter saturate-150 transform rotate-x-[15deg] scale-125">
                                {skill.icon}
                              </div>
                              {/* projector vertical beam effect */}
                              <div
                                className="w-[1px] h-[22px] opacity-40 mt-1"
                                style={{
                                  backgroundImage: `linear-gradient(to top, transparent, ${colors.glowColor})`
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Letter in top-left */}
                        <span className="text-[10px] opacity-70 font-bold self-start leading-none uppercase">
                          {skill.key}
                        </span>

                        {/* Graphic Icon in center */}
                        <div className="self-center flex items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                          {skill.icon}
                        </div>

                        {/* Blank placeholder to balance flex */}
                        <div className="h-[2px]" />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Staggered Row 3 */}
                <div className="flex gap-4 pl-8 sm:pl-12">
                  {techSkills.slice(10, 13).map((skill) => {
                    const pressed = activeKey === skill.key || focusedTech.key === skill.key;
                    const colors = getThemeKeycapColors(skill.colorName);
                    return (
                      <motion.button
                        key={skill.key}
                        aria-label={`${skill.name} — press ${skill.key} key`}
                        onClick={() => handleKeyClick(skill)}
                        onMouseEnter={() => handleKeyHover(skill)}
                        onMouseLeave={() => setHoveredKey(null)}
                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                        animate={{
                          translateY: pressed ? 6 : 0,
                          boxShadow: pressed
                            ? "0px 1px 2px rgba(0,0,0,0.6)"
                            : `0px 8px 0px rgba(0,0,0,0.25), 0px 12px 20px rgba(0,0,0,0.6)`
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md font-mono flex flex-col justify-between p-2 cursor-pointer select-none border-t border-l border-r"
                        style={{
                          transformStyle: "preserve-3d",
                          backgroundColor: colors.topBg,
                          color: colors.textColor,
                          borderTop: colors.borderStyle,
                          borderLeft: colors.borderStyle,
                          borderRight: colors.borderStyle,
                          boxShadow: pressed ? "none" : `0 0 15px ${colors.glowColor}33`
                        }}
                      >
                        {/* 3D front-edge extrusion depth */}
                        <div
                          className="absolute inset-x-0 -bottom-[8px] h-[8px] rounded-b-md transition-all duration-100"
                          style={{
                            background: colors.frontBg,
                            filter: "brightness(0.65) contrast(1.1)",
                            transform: pressed ? "scaleY(0)" : "scaleY(1)",
                            transformOrigin: "top"
                          }}
                        />

                        {/* Holographic float-out brand logo when hovered */}
                        <AnimatePresence>
                          {hoveredKey === skill.key && (
                            <motion.div
                              initial={{ opacity: 0, y: 0, scale: 0.6, z: 0 }}
                              animate={
                                prefersReducedMotion
                                  ? { opacity: 0.8, y: -50, scale: 1.45, z: 40 }
                                  : {
                                      opacity: [0, 0.8, 0.5, 0.9, 0.6, 0.8], // futuristic glitch flicker
                                      y: -50,
                                      scale: 1.45,
                                      z: 40,
                                    }
                              }
                              exit={{ opacity: 0, y: 0, scale: 0.6 }}
                              transition={
                                prefersReducedMotion
                                  ? { y: { type: "spring", stiffness: 120, damping: 10 } }
                                  : {
                                      y: { type: "spring", stiffness: 120, damping: 10 },
                                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "reverse" },
                                    }
                              }
                              className="absolute pointer-events-none z-30 flex flex-col items-center justify-center"
                              style={{
                                transformStyle: "preserve-3d",
                                filter: `drop-shadow(0 0 10px ${colors.glowColor}) brightness(1.2)`
                              }}
                            >
                              <div className="w-10 h-10 flex items-center justify-center filter saturate-150 transform rotate-x-[15deg] scale-125">
                                {skill.icon}
                              </div>
                              {/* projector vertical beam effect */}
                              <div
                                className="w-[1px] h-[22px] opacity-40 mt-1"
                                style={{
                                  backgroundImage: `linear-gradient(to top, transparent, ${colors.glowColor})`
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Letter in top-left */}
                        <span className="text-[10px] opacity-70 font-bold self-start leading-none uppercase">
                          {skill.key}
                        </span>

                        {/* Graphic Icon in center */}
                        <div className="self-center flex items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                          {skill.icon}
                        </div>

                        {/* Blank placeholder to balance flex */}
                        <div className="h-[2px]" />
                      </motion.button>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
