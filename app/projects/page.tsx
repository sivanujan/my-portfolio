"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, BookOpen, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Github } from "@/components/shared/Icons";
import Link from "next/link";

interface ProjectDetail {
  id: string;
  name: string;
  client: string;
  category: "Web Platform" | "E-commerce" | "Algo Trading" | "AI / RAG";
  tech: string[];
  link?: string;
  github?: string;
  description: string;
  challengeStory: string;
  deliverables: string[];
}

const ALL_PROJECTS: ProjectDetail[] = [
  {
    id: "kiox",
    name: "KIO-X Human Performance Platform",
    client: "Berlin, Germany",
    category: "Web Platform",
    tech: ["Next.js 14", "Supabase", "Tailwind CSS", "Real-time WebSockets", "PostgreSQL"],
    link: "https://kiox.de",
    github: "https://github.com/sivanujan",
    description: "Enterprise biometric and performance tracking portal built for elite sports coaching networks, integrating real-time telemetry streams and interactive graphs.",
    challengeStory: "Designed high-fidelity real-time WebSockets gateways bypassing heavy DB storage loops during surge events, cutting chat stream and telemetry latency from 400ms to 50ms.",
    deliverables: [
      "Built clean real-time chat widgets using Supabase real-time broadcast mechanisms.",
      "Engineered biometric graph plots visualizing athlete heartrate and speed datasets.",
      "Configured multi-role access controls restricting client team data scopes.",
    ],
  },
  {
    id: "cryptoedge",
    name: "CryptoEdge Trading Bot",
    client: "Proprietary Software",
    category: "Algo Trading",
    tech: ["FastAPI", "Redis Pub/Sub", "Binance Futures API", "WebSockets", "Pandas"],
    github: "https://github.com/sivanujan",
    description: "A secure high-frequency trading engine executing grid trading and market making strategies on digital asset derivatives.",
    challengeStory: "Addressed connection instability due to remote packet routing from Jaffna by developing a dual-worker architecture—one local ticker pinging status, and one hosted in Singapore running active trades.",
    deliverables: [
      "Configured sub-100ms Binance WebSocket handlers.",
      "Built safety circuit breakers assessing balance margins before placing levered orders.",
      "Coded Redis Pub/Sub buffer loops preventing database deadlock blocks.",
    ],
  },
  {
    id: "astrozen",
    name: "AstroZen AI Jyotish",
    client: "AI Product",
    category: "AI / RAG",
    tech: ["Python", "LangChain", "Pinecone VectorDB", "Tamil Jyotish Corpus", "Next.js"],
    link: "https://astrozen.me",
    github: "https://github.com/sivanujan",
    description: "RAG intelligence tool translating classical Tamil astrology records into personal horoscope suggestions.",
    challengeStory: "Resolved LLM text hallucinations on intricate chart calculations by writing custom math filters evaluating planetary coordinates before prompt assembly.",
    deliverables: [
      "Created vector embeddings index referencing 10,000+ pages of classical Sanskrit and Tamil texts.",
      "Built RAG pipeline parsing search intents dynamically.",
      "Assembled modern user UI with dark mode theme switches.",
    ],
  },
  {
    id: "atusa",
    name: "Atusa / Eraa Supermarket",
    client: "Canada Retail",
    category: "E-commerce",
    tech: ["Shopify Liquid", "Python", "Bulk CSV Upload", "REST APIs", "AWS Lambda"],
    link: "https://eraa.ca",
    description: "Enterprise catalog synchronizer and theme overrides built for a large scale Canadian retail supermarket.",
    challengeStory: "Developed an asynchronous bulk upload loader in Python that synchronizes daily pricing and availability for 50,000+ SKU database entries without hit limit API bans.",
    deliverables: [
      "Created customizable Shopify Liquid theme interfaces.",
      "Configured cron sync workflows updating item levels every morning.",
      "Optimized site loading speeds by refactoring JavaScript template tags.",
    ],
  },
  {
    id: "vassolicitors",
    name: "Vas Solicitors Portal",
    client: "United Kingdom",
    category: "Web Platform",
    tech: ["Next.js 14", "PostgreSQL", "Tailwind CSS", "PDF Generator", "SendGrid"],
    link: "https://vassolicitors.co.uk",
    description: "Online case management and secure client file portal designed for a busy London legal practice.",
    challengeStory: "Protected sensitive litigation files by implementing secure row-level security policies (RLS) on PostgreSQL tables mapped to verified client JWT credentials.",
    deliverables: [
      "Designed secure customer login dashboards.",
      "Integrated PDF generation engines building case invoices automatically.",
      "Coded custom document drop zones supporting encrypted uploads.",
    ],
  },
  {
    id: "neuron",
    name: "Neuron / Neeram Landing Pages",
    client: "Sri Lanka Venturing",
    category: "Web Platform",
    tech: ["React.js", "Framer Motion", "Vanilla CSS", "Vite", "SVG Animations"],
    link: "https://neeram.lk",
    github: "https://github.com/sivanujan",
    description: "Creative product marketing land pages optimized for micro-interactions, responsive devices, and maximum lead generation.",
    challengeStory: "Achieved a 98% Lighthouse score by utilizing hand-drawn optimized SVG vectors and avoiding external UI libraries, keeping resource bundles exceptionally lean.",
    deliverables: [
      "Wrote custom layout scripts utilizing CSS Grid.",
      "Built fluid micro-animations reacting to user hover interactions.",
      "Configured simple API email submission hooks.",
    ],
  },
];

type CategoryFilter = "All" | "Web Platform" | "E-commerce" | "Algo Trading" | "AI / RAG";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [expandedStory, setExpandedStory] = useState<Record<string, boolean>>({});

  const toggleStory = (id: string) => {
    setExpandedStory((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProjects = ALL_PROJECTS.filter(
    (p) => filter === "All" || p.category === filter
  );

  const filterTabs: CategoryFilter[] = ["All", "Web Platform", "E-commerce", "Algo Trading", "AI / RAG"];

  return (
    <div className="min-h-screen bg-sand dark:bg-dark py-12 px-4 sm:px-6 lg:px-8 text-foreground dot-grid">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-soil dark:text-terminal-green hover:underline decoration-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Header */}
        <div className="mb-12 border-b-2 border-foreground pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            [ARCHIVES / PRODUCTIONS]
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight">
            Full Projects Directory
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
            A deep-dive index of software systems, automated scripts, and online platforms. Use filters to query specific domains.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 border-2 font-mono text-xs uppercase tracking-wider transition-all select-none ${
                filter === tab
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const isStoryOpen = expandedStory[project.id];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="border-2 border-foreground bg-card text-foreground p-6 rounded-none brutalist-border flex flex-col justify-between"
                >
                  <div>
                    {/* Category Label */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-soil dark:text-terminal-green">
                        {"// "}{project.category}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase">
                        {project.client}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-display font-black uppercase tracking-wide leading-tight mb-2">
                      {project.name}
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="mb-6 space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-wide text-foreground font-bold block">
                        Work Executed:
                      </span>
                      <ul className="space-y-1.5 text-[11px] font-sans text-muted-foreground">
                        {project.deliverables.map((del, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-soil dark:text-terminal-green font-mono font-bold">•</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stacks */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[8px] font-mono font-semibold px-2 py-0.5 border border-foreground/30 bg-background text-foreground uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Story & Links */}
                  <div className="space-y-4 pt-4 border-t border-border mt-auto">
                    
                    {/* Challenge Toggler */}
                    <button
                      onClick={() => toggleStory(project.id)}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-soil dark:text-terminal-green hover:underline font-bold"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>The Engineering Challenge</span>
                      {isStoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Collapsible Story Text */}
                    <AnimatePresence initial={false}>
                      {isStoryOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="font-mono text-[10px] text-foreground bg-foreground/5 p-3 border-l-2 border-foreground dark:border-terminal-green leading-relaxed">
                            {project.challengeStory}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Links */}
                    <div className="flex items-center gap-6 pt-2 font-mono text-[10px]">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline font-bold text-foreground"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline font-bold text-foreground"
                        >
                          <span>Repository</span>
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
