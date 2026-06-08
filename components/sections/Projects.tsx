"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Github } from "@/components/shared/Icons";

interface Project {
  id: string;
  name: string;
  client: string;
  flag: string;
  category: "Web Platform" | "E-commerce" | "Blockchain / Algorithmic" | "AI / RAG";
  categoryKey: "web" | "ecommerce" | "blockchain" | "ai";
  tech: string[];
  link?: string;
  github?: string;
  description: string;
  challengeStory: string;
  emoji: string;
  borderClass: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: "kiox",
    name: "KIO-X Human Performance",
    client: "Berlin, Germany",
    flag: "🇩🇪",
    category: "Web Platform",
    categoryKey: "web",
    tech: ["Next.js", "Supabase", "Tailwind CSS", "Real-time WebSockets"],
    link: "https://kiox.de",
    github: "https://github.com/sivanujan",
    description: "A secure dashboards portal for tracking pro-athlete biometrics, training logs, and active real-time messaging coaching feeds.",
    challengeStory: "Engineered real-time socket messaging channels that bypass standard database calls during high concurrency peaks, reducing channel load latency by 65%.",
    emoji: "🔧",
    borderClass: "border-l-4 border-l-teal",
  },
  {
    id: "cryptoedge",
    name: "CryptoEdge Trading Bot",
    client: "Jaffna, Sri Lanka",
    flag: "🇱🇰",
    category: "Blockchain / Algorithmic",
    categoryKey: "blockchain",
    tech: ["FastAPI", "Redis Pub/Sub", "Binance Futures API", "WebSockets"],
    github: "https://github.com/sivanujan",
    description: "High-frequency quantitative trading engine monitoring order books and executing automated market-making orders.",
    challengeStory: "Designed a heartbeat connection monitor that automatically detects socket drops and recovers trading state in under 120ms without missing order executions.",
    emoji: "⚡",
    borderClass: "border-l-4 border-l-gold",
  },
  {
    id: "astrozen",
    name: "AstroZen AI Jyotish",
    client: "AI Product • Sri Lanka",
    flag: "🇱🇰",
    category: "AI / RAG",
    categoryKey: "ai",
    tech: ["Python", "LangChain", "Pinecone VectorDB", "Tamil Jyotish Corpus"],
    link: "https://astrozen.me",
    github: "https://github.com/sivanujan",
    description: "Vedic astrology prediction interface utilizing RAG pipelines to translate astrological transits into readable personality insights.",
    challengeStory: "Overcame predictions hallucination by introducing a semantic filter that parses query intents against 5,000+ classical Tamil Jyotish verses before running the LLM.",
    emoji: "🧠",
    borderClass: "border-l-4 border-l-rust",
  },
  {
    id: "atusa",
    name: "Atusa / Eraa Supermarket",
    client: "Toronto, Canada",
    flag: "🇨🇦",
    category: "E-commerce",
    categoryKey: "ecommerce",
    tech: ["Shopify Liquid", "Python", "Bulk CSV Upload", "REST APIs"],
    link: "https://eraa.ca",
    description: "Automated inventory synchronizer and custom Liquid design modifications for a large multi-store enterprise.",
    challengeStory: "Wrote custom inventory parsing pipelines in Python that process 50k+ daily SKU additions from local XML feeds to Shopify, reducing sync duration from hours to 8 minutes.",
    emoji: "🛒",
    borderClass: "border-l-4 border-l-emerald-600",
  },
  {
    id: "vassolicitors",
    name: "Vas Solicitors Portal",
    client: "London, United Kingdom",
    flag: "🇬🇧",
    category: "Web Platform",
    categoryKey: "web",
    tech: ["Next.js", "PostgreSQL", "Tailwind CSS", "PDF Generator"],
    link: "https://vassolicitors.co.uk",
    description: "Secure intake portal and document management database system built for a London-based solicitors firm.",
    challengeStory: "Established document compliance security using PostgreSQL Row Level Security (RLS) policies based on JWT token identities, preventing cross-tenant document visibility.",
    emoji: "🔧",
    borderClass: "border-l-4 border-l-teal",
  },
  {
    id: "neuron",
    name: "Neuron / Neeram Pages",
    client: "Colombo, Sri Lanka",
    flag: "🇱🇰",
    category: "Web Platform",
    categoryKey: "web",
    tech: ["React.js", "Framer Motion", "Vanilla CSS", "Vite"],
    link: "https://neeram.lk",
    github: "https://github.com/sivanujan",
    description: "Highly performant, modern responsive product showcase and marketing pages optimized for speed and conversion.",
    challengeStory: "Attained a 98/100 Lighthouse speed index by avoiding third-party dependencies, implementing custom CSS grid rules, and hand-crafting responsive SVG graphics.",
    emoji: "🔧",
    borderClass: "border-l-4 border-l-teal",
  },
];

// Custom local typewriter hook helper for solved accordion
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    let current = "";
    const timer = setInterval(() => {
      if (i < text.length) {
        current += text[i];
        setDisplayedText(current);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 12); // Speed of character reveal

    return () => clearInterval(timer);
  }, [text, active]);

  return <span>{displayedText}</span>;
}

export default function Projects() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDevMode = mounted && resolvedTheme === "dark";
  const [filter, setFilter] = useState<"all" | "web" | "blockchain" | "ai" | "ecommerce">("all");
  const [expandedStory, setExpandedStory] = useState<Record<string, boolean>>({});

  const toggleStory = (id: string) => {
    setExpandedStory((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (filter === "all") return true;
    return p.categoryKey === filter;
  });

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25, ease: "easeIn" as any },
    },
  };

  return (
    <section id="projects" className="py-20 border-b-2 border-foreground bg-sand dark:bg-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
              {isDevMode ? "> 04_CREATIONS" : "[04 / CREATIONS]"}
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-foreground">
              Featured Works
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-xs leading-normal">
            Click &ldquo;Challenge Solved&rdquo; to view the underlying engineering hurdle resolved in each deployment.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-12 font-mono text-xs">
          {[
            { label: "ALL", key: "all" },
            { label: "WEB PLATFORM", key: "web" },
            { label: "BLOCKCHAIN", key: "blockchain" },
            { label: "AI / RAG", key: "ai" },
            { label: "E-COMMERCE", key: "ecommerce" },
          ].map((btn) => {
            const isActive = filter === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key as any)}
                className={`px-4 py-2 border-2 border-foreground transition-all duration-200 uppercase tracking-widest select-none ${
                  isActive
                    ? "bg-soil text-sand border-soil dark:bg-terminal-green dark:text-dark dark:border-terminal-green font-bold shadow-[2px_2px_0px_0px_var(--foreground)]"
                    : "hover:bg-muted/15"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Masonry Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const isStoryOpen = expandedStory[project.id];

              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    y: -6,
                    borderColor: "var(--color-soil)",
                    boxShadow: "inset 0 0 20px rgba(139, 69, 19, 0.08)",
                  }}
                  className={`flex flex-col justify-between border-2 border-foreground bg-card text-foreground p-6 rounded-none brutalist-border relative group/card transition-all duration-200 ${project.borderClass}`}
                >
                  <div>
                    {/* Category Tag (Slides right on hover) */}
                    <div className="flex items-center justify-between mb-2">
                      <motion.span
                        className="font-mono text-[9px] font-bold uppercase tracking-wider text-soil dark:text-terminal-green block"
                        whileHover={{ x: 4 }}
                      >
                        {"// "}{project.category}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-black uppercase tracking-wide leading-tight group-hover/card:text-soil dark:group-hover/card:text-terminal-green transition-colors">
                      {project.name}
                    </h3>

                    {/* Flag & Client Location */}
                    <p className="font-mono text-[9px] text-muted-foreground mt-1 mb-4 uppercase flex items-center gap-1">
                      <span>{project.flag}</span>
                      <span>{project.client}</span>
                    </p>

                    {/* Short Description */}
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[8px] font-mono font-semibold px-2 py-0.5 border border-foreground/30 bg-background text-foreground uppercase group-hover/card:brightness-105 transition-all"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom section with triggers & links */}
                  <div className="space-y-4 pt-4 border-t border-border mt-auto">
                    
                    {/* Challenge Story Toggler */}
                    <button
                      onClick={() => toggleStory(project.id)}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-soil dark:text-terminal-green hover:underline font-bold"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Challenge Solved</span>
                      {isStoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Collapsible Story Text */}
                    <AnimatePresence initial={false}>
                      {isStoryOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden border-l-2 border-soil dark:border-terminal-green pl-3"
                        >
                          <div className="font-mono text-[10px] text-foreground bg-foreground/5 p-2.5 leading-relaxed">
                            <span className="mr-1.5 select-none">{project.emoji}</span>
                            <Typewriter text={project.challengeStory} active={isStoryOpen} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* External Links */}
                    <div className="flex items-center gap-4 pt-2 font-mono text-[10px]">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline text-foreground"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline text-foreground"
                        >
                          <span>Repository</span>
                          <Github className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
