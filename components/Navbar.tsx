"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X, Folder, Skull, Music, Star } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const files = [
  { name: "About.tsx", id: "about" },
  { name: "TechStack.tsx", id: "stack" },
  { name: "Projects.tsx", id: "projects" },
  { name: "Experience.tsx", id: "experience" },
  { name: "Contact.tsx", id: "contact" },
];

const ReactIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0px' }}>
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const BandIcon = ({ size = 14 }: { size?: number }) => {
  const { theme } = useTheme();

  const getIconSrc = () => {
    switch (theme) {
      case "seventh-trumpet":
        return "/Resource/A7X2.svg";
      case "black-parade":
        return "/Resource/MCR2.svg";
      case "californication":
        return "/Resource/RHCP.svg";
      default:
        return null;
    }
  };

  const src = getIconSrc();

  if (!src) return <ReactIcon size={size} />;

  return (
    <img
      src={src}
      alt={theme}
      width={size}
      height={size}
      style={{
        display: 'block',
        filter: theme === 'black-parade' ? 'invert(1) brightness(0.2)' : 'none',
        opacity: 1,
        objectFit: 'contain'
      }}
    />
  );
};

export default function Navbar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const allIds = ["hero", ...files.map(f => f.id)];
      const sections = allIds.map(id => document.getElementById(id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(allIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1101,
          background: "var(--bg-elevated)",
          border: "1px solid var(--clr-dim)",
          padding: "0.5rem",
          borderRadius: "4px",
          display: "none",
          color: "var(--clr-text)"
        }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <nav className={`vscode-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          Explorer
        </div>

        <div className="folder-container">
          {/* Root Folder: Hero.tsx */}
          <div
            className={`folder-header ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => {
              scrollToSection('hero');
              setIsFolderOpen(!isFolderOpen);
            }}
          >
            {isFolderOpen ? <ChevronDown size={14} style={{ marginRight: "4px" }} /> : <ChevronRight size={14} style={{ marginRight: "4px" }} />}
            <Folder size={16} style={{ marginRight: "8px", color: "var(--clr-gold)" }} />
            <span className="font-display">Hero.tsx</span>
          </div>

          {/* Nested Files */}
          {isFolderOpen && (
            <div className="nested-files">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`file ${activeSection === file.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(file.id)}
                >
                  <BandIcon size={14} />
                  <span className="font-display" style={{ marginLeft: "8px" }}>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 1100
          }}
        />
      )}
    </>
  );
}

