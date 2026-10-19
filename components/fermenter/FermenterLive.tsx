"use client";
import { useEffect, useRef, useState } from "react";
import { mountFermenter } from "./live.mjs"; // plain ESM, shared with the build's preview pages
import { FERMENTER_DATA, FERMENTER_SRC } from "./fermenter-data";

// The figure's markup (~0.5 MB of SVG, ~70 KB gzipped) is a static file built by
// scripts/fermenter/build.mjs. Fetch it once, drop it in, then start the springs, hover, keys and tour.
export default function FermenterLive() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    fetch(FERMENTER_SRC)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
      .then((html) => {
        const el = host.current;
        if (cancelled || !el) return;
        el.innerHTML = html;
        const figure = el.querySelector(".fm");
        if (figure) stop = mountFermenter(figure, FERMENTER_DATA);
        setReady(true);
      })
      .catch(() => {
        /* the section still reads without the figure */
      });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return <div ref={host} className="iso fm-host" data-ready={ready ? "" : undefined} aria-busy={!ready} />;
}
