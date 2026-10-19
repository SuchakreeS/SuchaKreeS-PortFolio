import { ChevronDown } from "lucide-react";
import FermenterLive from "@/components/fermenter/FermenterLive";
import "@/components/iso/kit/iso.css";
import "@/components/fermenter/fermenter.css";
import "@/components/fermenter/intro.css";

// Landing section above the Hero: the fermenter I used to run, taken apart.
export default function FermenterIntro() {
  return (
    <section id="intro" className="vertical-section fm-intro" aria-labelledby="fm-intro-title">
      <div className="fm-intro-grid">
        <div className="fm-intro-copy">
          <p className="fm-intro-kicker font-mono">Bioprocess → Software</p>
          <h2 id="fm-intro-title" className="fm-intro-title font-display-bold">
            From fermenter
            <br />
            to fullstack developer.
          </h2>
          <p className="fm-intro-lede">
            A degree in fermentation technology, then production runs where every batch had to be right: probes in, setpoints
            held, sterile, logged. I build software with the same zero-error discipline.
          </p>
          <p className="fm-intro-tip font-mono">Hover the vessel to take it apart · tap on a phone</p>
          <a href="#hero" className="fm-intro-next font-mono">
            Enter the portfolio
            <ChevronDown size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="fm-intro-figure">
          <FermenterLive />
        </div>
      </div>
    </section>
  );
}
