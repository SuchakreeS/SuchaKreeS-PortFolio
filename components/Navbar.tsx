"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X, Folder, Skull, Music, Star, Download } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { themes } from "./themes";

const files = [
  { name: "About Me", id: "about" },
  { name: "TechStack", id: "stack" },
  { name: "Projects", id: "projects" },
  { name: "CreativeArtifacts", id: "artifacts" },
  { name: "Experience", id: "experience" },
  { name: "Contact", id: "contact" },
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

  const src = themes.find((t) => t.id === theme)?.logo ?? null;

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
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobileOpen) return;

    const drawer = drawerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableEls = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    focusableEls[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

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
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
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
        ref={mobileToggleRef}
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileOpen}
        aria-controls="vscode-sidebar-nav"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1101,
          background: "var(--bg-elevated)",
          border: "1px solid var(--clr-dim)",
          padding: "0.75rem",
          borderRadius: "4px",
          display: "none",
          color: "var(--clr-text)"
        }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <nav
        ref={drawerRef}
        id="vscode-sidebar-nav"
        className={`vscode-sidebar ${isMobileOpen ? 'open' : ''}`}
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label="Site navigation"
      >
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
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollToSection('hero');
                setIsFolderOpen(!isFolderOpen);
              }
            }}
          >
            {isFolderOpen ? <ChevronDown size={14} style={{ marginRight: "4px" }} /> : <ChevronRight size={14} style={{ marginRight: "4px" }} />}
            <Folder size={16} style={{ marginRight: "8px", color: "var(--clr-gold)" }} />
            <span className="font-display">Welcome</span>
          </div>

          {/* Nested Files */}
          {isFolderOpen && (
            <div className="nested-files">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`file ${activeSection === file.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(file.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToSection(file.id);
                    }
                  }}
                >
                  <BandIcon size={14} />
                  <span className="font-display" style={{ marginLeft: "8px" }}>{file.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Resume download — sibling to the Welcome folder, always visible */}
          <a
            href="/Suchakree-Resume.pdf"
            download
            className="file"
            style={{ marginTop: "6px", textDecoration: "none" }}
          >
            <Download size={14} style={{ marginRight: "8px" }} />
            <span className="font-display">resume.pdf</span>
          </a>
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
            zIndex: "var(--z-nav)"
          }}
        />
      )}
    </>
  );
}

