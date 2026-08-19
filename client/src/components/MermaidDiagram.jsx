import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        setError("");
        containerRef.current.innerHTML = "";

        const id = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`;

        const result = await mermaid.render(id, chart);

        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      } catch (err) {
        console.error("Mermaid error:", err);

        setError("Diagram could not be rendered.");
      }
    };

    renderDiagram();
  }, [chart]);

  if (!chart) return null;

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
        <p className="text-red-400">{error}</p>

        <details className="mt-3">
          <summary className="cursor-pointer text-gray-400">
            Show diagram source
          </summary>

          <pre className="mt-3 text-xs text-gray-400 whitespace-pre-wrap">
            {chart}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto flex justify-center py-6"
    />
  );
};

export default MermaidDiagram;