"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export interface SkillNode {
  id: string; // 2-letter abbreviation
  label: string; // full name
  group: "frontend" | "backend" | "database" | "devops" | "blockchain" | "ai" | "ecommerce";
  years: string;
  level: string;
  projects: string[];
  desc?: string;
  // D3 force simulation attributes:
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Connection {
  source: string;
  target: string;
}

export const SKILL_ITEMS: SkillNode[] = [
  // FRONTEND (color: #0D6E6E teal)
  { id: "NE", label: "Next.js 14", group: "frontend", 
    years: "3+", level: "Expert", projects: ["KIO-X", "AstroZen", "CryptoEdge"], desc: "React framework for server rendering, Server Components, and App Router." },
  { id: "RE", label: "React.js", group: "frontend",
    years: "3+", level: "Expert", projects: ["KIO-X", "Neuron"], desc: "Component-driven layouts, virtual DOM state machines, and lifecycle management." },
  { id: "TA", label: "Tailwind", group: "frontend",
    years: "3+", level: "Expert", projects: ["KIO-X", "AstroZen"], desc: "Utility-first CSS framework for rapid responsive styling configurations." },
  { id: "TY", label: "TypeScript", group: "frontend",
    years: "2+", level: "Advanced", projects: ["KIO-X", "CryptoEdge"], desc: "Strictly typed Javascript superset resolving design-time type errors." },
  { id: "LI", label: "Liquid", group: "frontend",
    years: "2+", level: "Advanced", projects: ["A***", "***"], desc: "Shopify templating language for safe dynamic e-commerce data rendering." },

  // BACKEND (color: #8B4513 soil/ochre)
  { id: "FA", label: "FastAPI", group: "backend",
    years: "2+", level: "Advanced", projects: ["CryptoEdge", "AstroZen"], desc: "High-performance async Python APIs built on Starlette and Pydantic." },
  { id: "PY", label: "Python", group: "backend",
    years: "4+", level: "Expert", projects: ["CryptoEdge", "AstroZen", "Scripts"], desc: "General-purpose programming language for data pipelines, scripting, and trading engines." },
  { id: "NO", label: "Node.js", group: "backend",
    years: "3+", level: "Advanced", projects: ["KIO-X", "APIs"], desc: "Javascript runtime engine for scalable backend network APIs." },
  { id: "PH", label: "PHP", group: "backend",
    years: "3+", level: "Advanced", projects: ["WordPress", "***"], desc: "Server-side web scripting engine for legal portals and CMS backends." },
  { id: "LA", label: "Laravel", group: "backend",
    years: "1+", level: "Intermediate", projects: ["Client Projects"], desc: "PHP MVC web framework utilizing Eloquent ORM and robust routing subsystems." },
  { id: "WP", label: "WordPress", group: "backend",
    years: "4+", level: "Expert", projects: ["Neuron", "Ezhukai"], desc: "CMS platform customized with custom PHP template modifications." },

  // DATABASE (color: #C9972C gold)
  { id: "SU", label: "Supabase", group: "database",
    years: "2+", level: "Advanced", projects: ["KIO-X"], desc: "Open-source PostgreSQL BaaS backend with real-time replication rules." },
  { id: "MY", label: "MySQL", group: "database",
    years: "3+", level: "Expert", projects: ["Multiple clients"], desc: "Relational database server for web products and content systems." },
  { id: "PO", label: "PostgreSQL", group: "database",
    years: "2+", level: "Advanced", projects: ["CryptoEdge"], desc: "Object-relational database specialized in complex queries and security rules." },
  { id: "RE2", label: "Redis", group: "database",
    years: "1+", level: "Intermediate", projects: ["CryptoEdge"], desc: "In-memory database used for high-speed sub-millisecond caching." },
  { id: "MO", label: "MongoDB", group: "database",
    years: "1+", level: "Intermediate", projects: ["API projects"], desc: "NoSQL document database optimized for flexible JSON schema structures." },

  // DEVOPS (color: #C0432A rust)
  { id: "AW", label: "AWS EC2", group: "devops",
    years: "2+", level: "Advanced", projects: ["KIO-X"], desc: "Elastic compute cloud servers for hosting production deployments." },
  { id: "NG", label: "Nginx", group: "devops",
    years: "2+", level: "Advanced", projects: ["KIO-X", "AWS"], desc: "Reverse proxy server and load balancer managing route traffic distributions." },
  { id: "DO", label: "Docker", group: "devops",
    years: "1+", level: "Intermediate", projects: ["CryptoEdge"], desc: "Containerization engine isolating microservices inside reproducible containers." },
  { id: "GI", label: "Git", group: "devops",
    years: "4+", level: "Expert", projects: ["All projects"], desc: "Distributed version control system managing codebase history and merges." },

  // BLOCKCHAIN/TRADING (color: #FFD700 gold bright)
  { id: "BI", label: "Binance API", group: "blockchain",
    years: "4+", level: "Expert", projects: ["CryptoEdge"], desc: "Exchange socket endpoints for executing automated high-speed algo-trading." },
  { id: "PS", label: "Pine Script", group: "blockchain",
    years: "2+", level: "Advanced", projects: ["TradingView strategies"], desc: "TradingView scripting language for backtesting indicators and quantitative strategies." },
  { id: "SO", label: "Solidity", group: "blockchain",
    years: "1+", level: "Beginner", projects: ["Exploration"], desc: "Smart contract programming language for Ethereum-based virtual machines." },

  // AI/ML (color: #6B48FF purple)  
  { id: "CL", label: "Claude AI", group: "ai",
    years: "1+", level: "Advanced", projects: ["AstroZen", "Agents"], desc: "Advanced LLM integrated via API triggers for astrological forecasts." },
  { id: "LC", label: "LangChain", group: "ai",
    years: "1+", level: "Intermediate", projects: ["AstroZen RAG"], desc: "Orchestration tool coordinating document retrieval and vector databases." },
  { id: "SH2", label: "Shopify", group: "ecommerce",
    years: "2+", level: "Advanced", projects: ["A***", "***"], desc: "Multi-store retail platform integrated via custom Liquid and inventory scripts." },
];

export const CONNECTIONS: Connection[] = [
  { source: "NE", target: "RE" },
  { source: "NE", target: "TA" },
  { source: "NE", target: "TY" },
  { source: "NE", target: "FA" },
  { source: "NE", target: "SU" },
  { source: "FA", target: "PY" },
  { source: "FA", target: "RE2" },
  { source: "FA", target: "PO" },
  { source: "FA", target: "BI" },
  { source: "PY", target: "LC" },
  { source: "PY", target: "CL" },
  { source: "LC", target: "CL" },
  { source: "AW", target: "NG" },
  { source: "AW", target: "DO" },
  { source: "NE", target: "AW" },
  { source: "SU", target: "PO" },
  { source: "WP", target: "PH" },
  { source: "SH2", target: "LI" },
  { source: "BI", target: "PS" },
  { source: "RE", target: "TA" },
  { source: "MY", target: "PH" },
  { source: "MY", target: "WP" },
  { source: "GI", target: "DO" },
];

const GROUP_COLORS: Record<string, string> = {
  frontend: "#0D6E6E",   // teal
  backend: "#8B4513",    // soil
  database: "#C9972C",   // gold
  devops: "#C0432A",     // rust
  blockchain: "#FFD700", // bright gold
  ai: "#6B48FF",         // purple
  ecommerce: "#2D8653",  // green
};

const ICON_SLUGS: Record<string, string> = {
  NE: "nextdotjs",
  RE: "react",
  TA: "tailwindcss",
  TY: "typescript",
  LI: "shopify",
  FA: "fastapi",
  PY: "python",
  NO: "nodedotjs",
  PH: "php",
  LA: "laravel",
  WP: "wordpress",
  SU: "supabase",
  MY: "mysql",
  PO: "postgresql",
  RE2: "redis",
  MO: "mongodb",
  AW: "amazonwebservices",
  NG: "nginx",
  DO: "docker",
  GI: "git",
  BI: "binance",
  PS: "tradingview",
  SO: "solidity",
  CL: "anthropic",
  LC: "langchain",
  SH2: "shopify",
};

const getSourceId = (d: any): string => {
  if (!d.source) return "";
  return typeof d.source === "object" ? d.source.id : d.source;
};

const getTargetId = (d: any): string => {
  if (!d.target) return "";
  return typeof d.target === "object" ? d.target.id : d.target;
};

interface SkillsGraphProps {
  selectedNode: SkillNode | null;
  setSelectedNode: (node: SkillNode) => void;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}

export default function SkillsGraph({
  selectedNode,
  setSelectedNode,
  hoveredNode,
  setHoveredNode,
}: SkillsGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });
  const [isLoading, setIsLoading] = useState(true);

  // Loading timer for simulation stabilization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Monitor container sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setDimensions({
            width: rect.width,
            height: 450,
          });
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Resolve devMode status from body class or DOM
  const [isDevMode, setIsDevMode] = useState(false);
  useEffect(() => {
    const checkDevMode = () => {
      const htmlElement = document.documentElement;
      setIsDevMode(htmlElement.classList.contains("dark"));
    };

    checkDevMode();

    const mutationObserver = new MutationObserver(() => {
      checkDevMode();
    });
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => mutationObserver.disconnect();
  }, []);

  // D3 force simulation setup - Run only on dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || !svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove(); // Clear previous nodes/lines

    const width = dimensions.width;
    const height = dimensions.height;
    const NODE_RADIUS = 28;

    svgElement.attr("width", width).attr("height", height);

    // Create deep copies for D3 simulation mutation
    const simNodes: any[] = SKILL_ITEMS.map((n) => ({ ...n }));
    const simLinks: any[] = CONNECTIONS.map((l) => ({
      source: l.source,
      target: l.target,
    }));

    // Setup Simulation
    const simulation = d3.forceSimulation(simNodes)
      .velocityDecay(0.25) // Less damping for faster, slipperier sways
      .force("link", d3.forceLink(simLinks).id((d: any) => d.id).distance(100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.08))
      .force("y", d3.forceY(height / 2).strength(0.08))
      .force("charge", d3.forceManyBody().strength(-280))
      .force("collision", d3.forceCollide().radius(NODE_RADIUS + 12))
      .alphaTarget(0.07); // Higher baseline alphaTarget for faster constant floating sways

    // Drag handlers
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    // Dragged: clamp positions within viewable canvas
    function dragged(event: any, d: any) {
      d.fx = Math.max(NODE_RADIUS + 10, Math.min(width - NODE_RADIUS - 10, event.x));
      d.fy = Math.max(NODE_RADIUS + 10, Math.min(height - NODE_RADIUS - 10, event.y));
    }

    // Drag ended: return back to the higher baseline alphaTarget
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.07);
      d.fx = null;
      d.fy = null;
    }

    // 1. Draw Links (edges) first so they sit underneath the nodes
    const linkGroup = svgElement.append("g").attr("class", "links-group");
    const link = linkGroup.selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        const sourceId = getSourceId(d);
        const sourceNode = simNodes.find((n) => n.id === sourceId);
        const group = sourceNode ? sourceNode.group : "frontend";
        return GROUP_COLORS[group] || "#ffffff";
      })
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    // 2. Draw Nodes group on top of links
    const nodeGroup = svgElement.append("g").attr("class", "nodes-group");
    const node = nodeGroup.selectAll("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node-container")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseenter", (event, d) => {
        setHoveredNode(d.id);
      })
      .on("mouseleave", () => {
        setHoveredNode(null);
      })
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // 3. Append Circle inside each Node Group
    node.append("circle")
      .attr("class", "node-circle transition-all duration-300")
      .attr("r", NODE_RADIUS)
      .attr("fill", (d: any) => GROUP_COLORS[d.group] || "#ffffff")
      .attr("stroke", "var(--foreground)")
      .attr("stroke-width", 1.5);

    // 4. Append Tech Brand Icon (Image) inside each Node Group
    node.append("image")
      .attr("href", (d: any) => {
        const slug = ICON_SLUGS[d.id];
        if (!slug) return "";
        return `https://cdn.simpleicons.org/${slug}/ffffff`;
      })
      .attr("x", -13)
      .attr("y", -13)
      .attr("width", 26)
      .attr("height", 26)
      .attr("class", "node-icon")
      .attr("opacity", 0.9)
      .on("error", function(this: any, event: any, d: any) {
        // Fallback to text abbreviation if the image fails to load
        const g = d3.select(this.parentNode);
        g.append("text")
          .text(d.id)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .attr("font-family", "JetBrains Mono, monospace")
          .attr("fill", "#ffffff");
        d3.select(this).remove();
      });

    // Update simulation positions on tick
    simulation.on("tick", () => {
      // Update link positions
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      // Update node positions with boundary clamping and gentle random wobble
      node.attr("transform", (d: any) => {
        // Inject continuous tiny random forces so nodes sway dynamically even after reaching equilibrium
        if (!d.fx) {
          d.vx += (Math.random() - 0.5) * 0.12;
        }
        if (!d.fy) {
          d.vy += (Math.random() - 0.5) * 0.12;
        }

        d.x = Math.max(NODE_RADIUS + 10, Math.min(width - NODE_RADIUS - 10, d.x));
        d.y = Math.max(NODE_RADIUS + 10, Math.min(height - NODE_RADIUS - 10, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions.width, dimensions.height, setSelectedNode, setHoveredNode]);

  // Styling updates on selection, hover, or mode changes without rebuilding the topology
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || !svgRef.current) return;

    const svgElement = d3.select(svgRef.current);

    // Update links (edges) styling
    svgElement.selectAll(".links-group line")
      .attr("opacity", (d: any) => {
        if (hoveredNode) {
          const sourceId = getSourceId(d);
          const targetId = getTargetId(d);
          const isConnected = sourceId === hoveredNode || targetId === hoveredNode;
          return isConnected ? 0.9 : 0.08;
        }
        return 0.6;
      })
      .style("filter", (d: any) => {
        if (isDevMode) {
          const sourceId = getSourceId(d);
          const sourceNode = SKILL_ITEMS.find((n) => n.id === sourceId);
          const group = sourceNode ? sourceNode.group : "frontend";
          const color = GROUP_COLORS[group] || "#00FF41";
          return `drop-shadow(0 0 4px ${color})`;
        }
        return "none";
      });

    // Update node circles styling
    svgElement.selectAll(".node-container circle")
      .attr("fill", (d: any) => {
        if (isDevMode) return "#0A1A0A";
        return GROUP_COLORS[d.group] || "#ffffff";
      })
      .attr("stroke", (d: any) => {
        if (selectedNode && selectedNode.id === d.id) {
          return "#FFD700"; // Gold stroke for selected
        }
        if (isDevMode) return "#00FF41"; // Neon green stroke in dev mode
        return "var(--foreground)";
      })
      .attr("stroke-width", (d: any) => {
        if (selectedNode && selectedNode.id === d.id) return 3;
        return 1.5;
      })
      .style("filter", (d: any) => {
        if (selectedNode && selectedNode.id === d.id) {
          return "drop-shadow(0 0 8px #FFD700)";
        }
        return "none";
      })
      .attr("class", (d: any) => {
        const baseClass = "node-circle transition-all duration-300";
        if (selectedNode && selectedNode.id === d.id) {
          return `${baseClass} node-selected-pulse`;
        }
        return baseClass;
      });

    // Update node icons image URLs (handles switching between brand colors & terminal green)
    svgElement.selectAll(".node-container image")
      .attr("href", (d: any) => {
        const slug = ICON_SLUGS[d.id];
        if (!slug) return "";
        const color = isDevMode ? "00ff41" : "ffffff";
        return `https://cdn.simpleicons.org/${slug}/${color}`;
      });

    // Update fallback texts
    svgElement.selectAll(".node-container text")
      .attr("fill", isDevMode ? "#00FF41" : "#ffffff");

  }, [selectedNode, hoveredNode, isDevMode, dimensions.width, dimensions.height]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[450px] relative mt-4 select-none overflow-hidden border-4 border-foreground shadow-[6px_6px_0px_0px_var(--color-soil)] dark:shadow-[6px_6px_0px_0px_var(--terminal-green)] brutalist-border"
      style={{ backgroundColor: isDevMode ? "#0A1A0A" : undefined }}
    >
      {/* 30px Grid Backdrop */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke={isDevMode ? "#00FF41" : "currentColor"}
              strokeWidth="1"
              opacity={isDevMode ? 0.06 : 0.25}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graph-grid)" />
      </svg>

      {/* D3 Graph SVG */}
      <svg ref={svgRef} className="w-full h-full relative z-10" />

      {/* Loading Spinner */}
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-sand/80 dark:bg-dark/80 z-20 transition-all duration-300"
          style={{ backgroundColor: isDevMode ? "rgba(10, 26, 10, 0.9)" : undefined }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-t-soil dark:border-t-terminal-green border-border rounded-full animate-spin" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-soil dark:text-terminal-green">
              {isDevMode ? "STABILIZING_TOPOLOGY..." : "Stabilizing system map..."}
            </span>
          </div>
        </div>
      )}

      {/* Pulse Animation Styles */}
      <style jsx global>{`
        @keyframes selected-pulse {
          0% { filter: drop-shadow(0 0 4px #FFD700); }
          50% { filter: drop-shadow(0 0 12px #FFD700); }
          100% { filter: drop-shadow(0 0 4px #FFD700); }
        }
        .node-selected-pulse {
          animation: selected-pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
