import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import CreativeArtifacts from "@/components/CreativeArtifacts";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";



export default function Home() {
  return (
    <div className="layout-container">
      <Navbar />
      <ThemeSwitcher />
      <div className="main-content-wrapper">
        <main style={{ display: "contents" }}>
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <CreativeArtifacts />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
