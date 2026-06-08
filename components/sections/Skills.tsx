"use client";

import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ShieldCheck, Code2, Link as LinkIcon, Network } from "lucide-react";
import SkillsGraphSkeleton from "../SkillsGraphSkeleton";
import { SKILL_ITEMS, CONNECTIONS, type SkillNode } from "../SkillsGraph";

// Dynamically import the heavy interactive graph on the client-side
const SkillsGraph = dynamic(() => import("../SkillsGraph"), {
  ssr: false,
  loading: () => <SkillsGraphSkeleton />,
});

export default function Skills() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDevMode = mounted && resolvedTheme === "dark";

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode>(SKILL_ITEMS[0]);
  const [githubStats, setGithubStats] = useState<any>(null);

  // Color mapping based on group for the UI panel
  const getGroupColor = (group: string, active = false) => {
    switch (group) {
      case "frontend":
        return active ? "bg-teal text-sand border-teal" : "border-teal text-teal dark:border-teal/80 dark:text-teal";
      case "backend":
        return active ? "bg-soil text-sand border-soil" : "border-soil text-soil dark:border-soil/80 dark:text-soil";
      case "database":
        return active ? "bg-[#C9972C] text-sand border-[#C9972C]" : "border-[#C9972C] text-[#C9972C]";
      case "devops":
        return active ? "bg-rust text-sand border-rust" : "border-rust text-rust dark:border-rust/80 dark:text-rust";
      case "blockchain":
        return active ? "bg-yellow-500 text-dark border-yellow-500" : "border-yellow-500 text-yellow-500";
      case "ai":
        return active ? "bg-purple-600 text-sand border-purple-600" : "border-purple-600 text-purple-600";
      case "ecommerce":
        return active ? "bg-emerald-600 text-sand border-emerald-600" : "border-emerald-600 text-emerald-600";
      default:
        return "border-foreground";
    }
  };

  const getGroupStroke = (group: string) => {
    switch (group) {
      case "frontend":
        return "#0D6E6E";
      case "backend":
        return "#8B4513";
      case "database":
        return "#C9972C";
      case "devops":
        return "#C0432A";
      case "blockchain":
        return "#FFD700";
      case "ai":
        return "#6B48FF";
      case "ecommerce":
        return "#2D8653";
      default:
        return "var(--foreground)";
    }
  };

  // Memoize connected nodes for inspector panel performance
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    return CONNECTIONS.filter(
      (c) => c.source === selectedNode.id || c.target === selectedNode.id
    )
      .map((c) => {
        const targetId = c.source === selectedNode.id ? c.target : c.source;
        return SKILL_ITEMS.find((n) => n.id === targetId);
      })
      .filter((n): n is SkillNode => !!n);
  }, [selectedNode]);

  // Fetch GitHub Repository and language statistics for the selected technology
  useEffect(() => {
    if (!selectedNode) return;

    const processRepos = (repos: any[]) => {
      const techKeywords: Record<string, string[]> = {
        "NE": ["next", "nextjs"],
        "RE": ["react"],
        "TA": ["tailwind"],
        "TY": ["typescript"],
        "LI": ["liquid"],
        "FA": ["fastapi", "python"],
        "PY": ["python"],
        "SU": ["supabase"],
        "WP": ["wordpress"],
        "SH2": ["shopify"],
        "NO": ["node", "nodejs"],
        "PH": ["php"],
        "LA": ["laravel"],
        "MY": ["mysql", "sql"],
        "PO": ["postgres", "postgresql"],
        "RE2": ["redis"],
        "MO": ["mongodb", "mongo"],
        "AW": ["aws", "ec2"],
        "NG": ["nginx"],
        "DO": ["docker"],
        "GI": ["git"],
        "BI": ["binance", "futures"],
        "PS": ["pine", "pinescript"],
        "SO": ["solidity"],
        "CL": ["claude", "anthropic"],
        "LC": ["langchain"],
      };

      const keywords = techKeywords[selectedNode.id] || [selectedNode.label.toLowerCase()];

      const matchingRepos = repos.filter(repo =>
        keywords.some(kw =>
          repo.name.toLowerCase().includes(kw) ||
          (repo.description || "").toLowerCase().includes(kw) ||
          (repo.language || "").toLowerCase().includes(kw)
        )
      );

      const languages = repos
        .filter(r => r.language)
        .reduce((acc: Record<string, number>, r) => {
          acc[r.language] = (acc[r.language] || 0) + 1;
          return acc;
        }, {});

      setGithubStats({
        totalRepos: repos.length,
        matchingRepos: matchingRepos.length,
        recentRepo: matchingRepos[0]?.name || null,
        stars: matchingRepos.reduce((sum, r) => sum + r.stargazers_count, 0),
        topLanguage: languages
      });
    };

    // Check session level cache to conserve API requests
    const cachedData = sessionStorage.getItem("gh_repos_sivanujan");
    if (cachedData) {
      try {
        const repos = JSON.parse(cachedData);
        processRepos(repos);
        return;
      } catch (e) {
        // Fallback to fetch
      }
    }

    fetch("https://api.github.com/users/sivanujan/repos?per_page=100")
      .then(r => {
        if (!r.ok) throw new Error("HTTP error " + r.status);
        return r.json();
      })
      .then(repos => {
        if (Array.isArray(repos)) {
          sessionStorage.setItem("gh_repos_sivanujan", JSON.stringify(repos));
          processRepos(repos);
        }
      })
      .catch(err => {
        console.error("Failed to fetch Github stats:", err);
      });
  }, [selectedNode]);

  return (
    <section id="skills" className="py-20 border-b-2 border-foreground bg-sand/20 dark:bg-dark/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            {isDevMode ? "> 03_EXPERTISE" : "[03 / EXPERTISE]"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-foreground">
            System Graph
          </h2>
        </div>

        {/* Node Graph Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Graph Map (Left Panel) */}
          <div className="lg:col-span-8 relative">
            <div className="absolute top-2 left-3 font-mono text-[9px] opacity-40 uppercase flex items-center gap-1.5 z-10 pointer-events-none">
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Topology Map — Drag nodes / Hover to trace routes</span>
            </div>

            <SkillsGraph
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          </div>

          {/* Details Sidepanel (Right Panel) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Info Panel Container */}
            <div 
              className="border-4 border-foreground p-6 brutalist-border shadow-[6px_6px_0px_0px_var(--foreground)] dark:shadow-[6px_6px_0px_0px_var(--terminal-green)] min-h-[450px] flex flex-col justify-between"
              style={{ 
                backgroundColor: isDevMode ? "#0A1A0A" : "var(--card)",
                borderColor: isDevMode ? "#00FF41" : "var(--foreground)",
                color: isDevMode ? "#00FF41" : "var(--foreground)"
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isDevMode ? "NODE_INSPECTOR" : "Node Inspector"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Code2 className="w-4 h-4 text-soil dark:text-terminal-green" />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Skill title & group tag */}
                  <div>
                    <h3 className="text-2xl font-display font-black tracking-wide uppercase">
                      {selectedNode.label}
                    </h3>
                    <span
                      className={`inline-block text-[9px] font-mono font-bold uppercase px-2 py-0.5 border mt-1 ${getGroupColor(
                        selectedNode.group,
                        true
                      )}`}
                    >
                      {selectedNode.group}
                    </span>
                  </div>

                  {/* Rating / Experience Level */}
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase block">
                      {isDevMode ? "EXPERIENCE_BAND" : "Experience Band"}
                    </span>
                    <p className="font-sans text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      {selectedNode.level} ({selectedNode.years} Years)
                    </p>
                  </div>

                  {/* Project Count Usage */}
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase block">
                      {isDevMode ? "SYSTEM_PLACEMENT" : "System Placement"}
                    </span>
                    <p className="font-sans text-xs font-bold text-foreground uppercase tracking-wide">
                      Used in {selectedNode.projects.length} production project{selectedNode.projects.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Representative Projects */}
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase block">
                      {isDevMode ? "DEPLOYED_IN" : "Deployed In"}
                    </span>
                    <p className="font-mono text-xs font-bold text-soil dark:text-terminal-green flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                      {selectedNode.projects.join(", ")}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedNode.desc && (
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] text-muted-foreground uppercase block">
                        {isDevMode ? "DESCRIPTION" : "Description"}
                      </span>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                        {selectedNode.desc}
                      </p>
                    </div>
                  )}

                  {/* Connection Map */}
                  <div className="space-y-1 pt-2 border-t border-border/60">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase block mb-1">
                      {isDevMode ? "CONNECTION_MAP" : "Connection Map"}
                    </span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {connectedNodes.length > 0 ? (
                        connectedNodes.map((n) => {
                          const dotColor = getGroupStroke(n.group);
                          return (
                            <div
                              key={n.id}
                              className="flex items-center gap-1 font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 border border-border bg-background/50 rounded-none cursor-help hover:border-foreground"
                              title={`${n.label} (${n.group})`}
                              onClick={() => setSelectedNode(n)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: dotColor }} />
                              <span>{n.id}</span>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-[10px] italic text-muted-foreground">No active connections.</span>
                      )}
                    </div>
                  </div>

                  {/* GitHub API Integration Panel */}
                  {githubStats && (
                    <div className="space-y-2 pt-2.5 border-t border-border/60 font-mono text-[10px]">
                      <span className="text-muted-foreground uppercase block text-[9px]">
                        {isDevMode ? "GITHUB_REPOS_USING_THIS" : "Github Repos Using This"}
                      </span>
                      <div className="flex items-center justify-between">
                        <span>Matching Repositories:</span>
                        <span className="font-bold">{githubStats.matchingRepos}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Repo Stars:</span>
                        <span className="font-bold">⭐ {githubStats.stars}</span>
                      </div>
                      {githubStats.recentRepo && (
                        <div className="flex flex-col gap-1 mt-1">
                          <span>Recent Project Repo:</span>
                          <a
                            href={`https://github.com/sivanujan/${githubStats.recentRepo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-soil dark:text-terminal-green hover:underline flex items-center gap-1 font-bold"
                          >
                            📦 {githubStats.recentRepo}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Legend */}
              <div className="border-t border-border pt-3 mt-4">
                <span className="font-mono text-[8px] uppercase tracking-wide text-muted-foreground block mb-1.5">
                  {isDevMode ? "PALETTE_LEGEND:" : "Palette Legend:"}
                </span>
                <div className="flex flex-wrap gap-1.5 text-[8px] font-mono font-bold">
                  <span className="border border-teal text-teal px-1.5 py-0.5 uppercase">
                    Frontend
                  </span>
                  <span className="border border-soil text-soil px-1.5 py-0.5 uppercase">
                    Backend
                  </span>
                  <span className="border border-gold text-gold px-1.5 py-0.5 uppercase">
                    Database
                  </span>
                  <span className="border border-rust text-rust px-1.5 py-0.5 uppercase">
                    Devops
                  </span>
                  <span className="border border-yellow-500 text-yellow-500 px-1.5 py-0.5 uppercase">
                    Blockchain
                  </span>
                  <span className="border border-purple-600 text-purple-600 px-1.5 py-0.5 uppercase">
                    AI / RAG
                  </span>
                  <span className="border border-emerald-600 text-emerald-600 px-1.5 py-0.5 uppercase">
                    E-Commerce
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
