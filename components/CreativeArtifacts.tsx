"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Aperture, Image as ImageIcon, X, ZoomIn, ChevronRight } from "lucide-react";
import { artifacts, Artifact } from "@/data/artifacts";

// --- Sub-components ---

const ArtifactCard = ({ 
  artifact, 
  index, 
  onClick 
}: { 
  artifact: Artifact; 
  index: number; 
  onClick: () => void 
}) => {
  const spanClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-2 row-span-1",
    large: "col-span-2 row-span-2",
    tall: "col-span-1 row-span-2",
  };

  return (
    <motion.div
      layoutId={`artifact-${artifact.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`industrial-card group cursor-pointer overflow-hidden ${spanClasses[artifact.span]}`}
      onClick={onClick}
    >
      {/* Image & Effects */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={artifact.imageUrl}
          alt={artifact.title}
          className="w-full h-full object-cover artifact-desaturate group-hover:artifact-clear"
          whileHover={{ scale: 1.05 }}
        />
        <div className="scanline-overlay opacity-30 group-hover:opacity-10 transition-opacity" />
      </div>

      <motion.div 
        className="absolute inset-0 bg-[var(--clr-primary)] opacity-0 z-10 pointer-events-none"
        whileHover={{ 
          opacity: [0, 0.1, 0, 0.05, 0],
          transition: { duration: 0.3, repeat: Infinity }
        }}
      />

      {/* Overlays */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-[var(--clr-dim)] px-2 py-1">
          {artifact.category === "Photography" && <Camera size={12} className="text-[var(--clr-primary)]" />}
          {artifact.category === "Design" && <ImageIcon size={12} className="text-[var(--clr-primary)]" />}
          {artifact.category === "Architecture" && <Aperture size={12} className="text-[var(--clr-primary)]" />}
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--clr-text)]">
            {artifact.title}
          </span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/60 backdrop-blur-sm border border-[var(--clr-primary)] p-1 text-[var(--clr-primary)]">
          <ZoomIn size={14} />
        </div>
      </div>

      <div className="absolute top-3 left-3 z-20 opacity-60">
        <p className="font-mono text-[8px] text-[var(--clr-text)] leading-tight bg-black/40 p-1">
          ISO {artifact.metadata.iso} <br />
          {artifact.metadata.aperture} <br />
          {artifact.metadata.shutter}
        </p>
      </div>
    </motion.div>
  );
};

const LightboxHUD = ({ artifact }: { artifact: Artifact }) => (
  <div className="bg-black/60 backdrop-blur-xl border-l-2 border-[var(--clr-primary)] p-6">
    <h3 className="font-display text-2xl tracking-widest uppercase mb-2">
      {artifact.title}
    </h3>
    <div className="flex gap-6 font-mono text-xs text-[var(--clr-muted)]">
      <div>
        <span className="text-[var(--clr-primary)] opacity-50 block mb-1">SENSOR</span>
        ISO {artifact.metadata.iso}
      </div>
      <div>
        <span className="text-[var(--clr-primary)] opacity-50 block mb-1">OPTICS</span>
        {artifact.metadata.aperture}
      </div>
      <div>
        <span className="text-[var(--clr-primary)] opacity-50 block mb-1">EXPOSURE</span>
        {artifact.metadata.shutter}
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function CreativeArtifacts({ isGalleryPage = false }: { isGalleryPage?: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const displayArtifacts = isGalleryPage ? artifacts : artifacts.slice(0, 3);
  const selectedArtifact = artifacts.find((a) => a.id === selectedId);

  return (
    <section 
      id="artifacts" 
      className={`vertical-section ${!isGalleryPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`} 
      style={{ 
        background: "var(--bg-void)", 
        paddingTop: isGalleryPage ? "10rem" : undefined,
        paddingLeft: isGalleryPage ? "20rem" : undefined,
        paddingRight: isGalleryPage ? "4rem" : undefined
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}>
          {isGalleryPage ? "Technical Gallery" : "Creative Artifacts"}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--clr-muted)] mt-2">
          // {isGalleryPage ? "complete mechanical archive" : "precision in pixels. mechanical vision."}
        </p>
      </motion.div>

      {/* Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isGalleryPage ? 'auto-rows-[300px]' : 'auto-rows-[180px] md:auto-rows-[220px]'} w-full max-w-7xl mx-auto px-4`}>
        {displayArtifacts.map((artifact, i) => (
          <ArtifactCard 
            key={artifact.id} 
            artifact={artifact} 
            index={i} 
            onClick={() => setSelectedId(artifact.id)} 
          />
        ))}
      </div>

      {/* Call to Action */}
      {!isGalleryPage && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <a 
            href="/gallery"
            className="group relative px-8 py-3 bg-transparent border border-[var(--clr-primary)] overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10 font-mono text-xs tracking-[0.3em] text-[var(--clr-primary)]">
              VIEW FULL GALLERY
            </span>
            <div className="absolute inset-0 bg-[var(--clr-primary)] translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-300 opacity-10" />
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={16} className="text-[var(--clr-primary)]" />
            </div>
          </a>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedId && selectedArtifact && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 lightbox-backdrop"
              onClick={() => setSelectedId(null)}
            />
            
            <motion.div
              layoutId={`artifact-${selectedId}`}
              className="relative z-10 w-full max-w-5xl aspect-video md:aspect-auto md:h-full flex items-center justify-center"
            >
              <img
                src={selectedArtifact.imageUrl}
                alt={selectedArtifact.title}
                className="max-w-full max-h-full object-contain border border-[var(--clr-dim)] shadow-[0_0_50px_rgba(191,0,255,0.2)]"
              />
              
              <button
                className="absolute top-4 right-4 text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors p-2 bg-black/40 backdrop-blur-md rounded-full border border-[var(--clr-dim)]"
                onClick={() => setSelectedId(null)}
              >
                <X size={24} />
              </button>

              <div className="absolute bottom-8 left-8 hidden md:block">
                <LightboxHUD artifact={selectedArtifact} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
