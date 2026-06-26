"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "var(--font-geist-sans), sans-serif",
  themeVariables: {
    primaryColor: "#f4f4f5",
    primaryTextColor: "#18181b",
    primaryBorderColor: "#d4d4d8",
    lineColor: "#a1a1aa",
    secondaryColor: "#eff6ff",
    tertiaryColor: "#f0fdf4",
    noteBkgColor: "#fffbeb",
    noteTextColor: "#18181b",
  },
});

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive: remove fixed width/height, keep viewBox
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            const vb = svgEl.getAttribute("viewBox");
            if (!vb) {
              const w = svgEl.getAttribute("width") || "800";
              const h = svgEl.getAttribute("height") || "600";
              svgEl.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
            }
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.maxWidth = expanded ? "none" : "100%";
            svgEl.style.minWidth = expanded ? "900px" : "0";
          }
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [chart, expanded]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Diagram error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={`mermaid-container rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 ${expanded ? "overflow-x-auto" : "overflow-hidden"}`}
      />
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        {expanded ? "📐 Fit to screen" : "🔍 Expand / Zoom"}
      </button>
    </div>
  );
}
