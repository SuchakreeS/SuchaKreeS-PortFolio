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
          <CreativeArtifacts isGalleryPage={true} />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
