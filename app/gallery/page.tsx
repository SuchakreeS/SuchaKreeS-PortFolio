"use client";

import Navbar from "@/components/Navbar";
import CreativeArtifacts from "@/components/CreativeArtifacts";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="layout-container">
      <Navbar />
      <ThemeSwitcher />
      
      <div className="main-content-wrapper">
        <main className="relative z-10">
          {/* Back Button */}
          <div className="fixed top-24 left-[17rem] z-50 hidden md:block">
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[var(--clr-muted)] hover:text-[var(--clr-primary)] transition-colors uppercase"
            >
              <ArrowLeft size={14} />
              Return to Nexus
            </motion.a>
          </div>

          <CreativeArtifacts isGalleryPage={true} />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
