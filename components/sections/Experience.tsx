"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Calendar, Briefcase, GraduationCap, MapPin, Award } from "lucide-react";

interface Milestone {
  role: string;
  client: string;
  location: string;
  flag: string;
  duration: string;
  tag: "freelance" | "student" | "academic";
  deliverables: string[];
}

const MILESTONES: Milestone[] = [
  {
    role: "Full-Stack Web Contractor",
    client: "Freelance Clients (UK / Berlin)",
    location: "Remote",
    flag: "🇬🇧🇩🇪",
    duration: "Jan 2024 - Present",
    tag: "freelance",
    deliverables: [
      "Built athlete biometrics data dashboard with Next.js & Supabase.",
      "Configured PDF intakes systems for UK-based Solicitors portals.",
      "Integrated OpenAI RAG pipelines for Astrological chart translations.",
    ],
  },
  {
    role: "Quantitative Systems Developer",
    client: "Proprietary Algorithmic Engines",
    location: "Jaffna, Sri Lanka",
    flag: "🇱🇰",
    duration: "May 2023 - Present",
    tag: "freelance",
    deliverables: [
      "Engineered Websocket trading handlers in FastAPI processing 1,000+ ticks/sec.",
      "Configured Redis Pub/Sub queuing systems preventing trade latency.",
      "Coded safety circuit-breakers checking account margins before order submission.",
    ],
  },
  {
    role: "E-commerce Automation Engineer",
    client: "Retail Enterprise (Canada)",
    location: "Remote",
    flag: "🇨🇦",
    duration: "Mar 2023 - Dec 2023",
    tag: "freelance",
    deliverables: [
      "Built Python scraping script translating XML logs to standard Shopify formats.",
      "Customized checkout and navigation Liquid hooks improving loading speeds.",
      "Synchronized daily SKU inventories across Shopify APIs.",
    ],
  },
  {
    role: "BSE Honours Candidate",
    client: "University Studies (SLTC)",
    location: "Jaffna, Sri Lanka",
    flag: "🇱🇰",
    duration: "Jan 2022 - Present",
    tag: "academic",
    deliverables: [
      "Mastered Data Structures, Operating Systems, Database Indexing, and C++.",
      "Conducted web architecture security audits checking cross-site scripting vulnerabilities.",
      "Collaborated on student compilers coding compilers parsing AST tokens.",
    ],
  },
];

export default function Experience() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDevMode = mounted && resolvedTheme === "dark";
  return (
    <section id="experience" className="py-20 border-b-2 border-foreground bg-sand/10 dark:bg-dark/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            {isDevMode ? "> 05_JOURNEY" : "[05 / JOURNEY]"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-foreground">
            Experience Map
          </h2>
        </div>

        {/* Horizontal scroll container wrapper */}
        <div className="relative overflow-x-auto pb-8 pt-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-border">
          
          {/* Horizontal Line backdrop for timeline */}
          <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-foreground/30 -translate-y-1/2 z-0 hidden lg:block" />

          {/* Cards container */}
          <div className="flex gap-6 lg:gap-12 min-w-max relative z-10">
            {MILESTONES.map((item, idx) => (
              <motion.div
                key={item.role + idx}
                className="w-[300px] sm:w-[350px] border-2 border-foreground bg-card text-foreground p-6 rounded-none brutalist-border shadow-[4px_4px_0px_0px_var(--foreground)] dark:shadow-[4px_4px_0px_0px_var(--terminal-green)] relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                {/* Node connector on timeline line */}
                <div className="absolute top-1/2 -left-3.5 w-6 h-6 border-2 border-foreground bg-foreground rounded-none rotate-45 -translate-y-1/2 hidden lg:block" />

                {/* Duration Badge */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-soil dark:text-terminal-green bg-muted/10 px-2 py-0.5 border border-border inline-flex mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.duration}</span>
                </div>

                {/* Role and Client */}
                <h3 className="text-lg font-display font-bold text-foreground leading-tight">
                  {item.role}
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground uppercase mt-0.5">
                  {item.client}
                </p>

                {/* Location indicator */}
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-foreground mt-2 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-rust" />
                  <span>
                    {item.location} {item.flag}
                  </span>
                  <span className="opacity-30">|</span>
                  
                  {/* Tag */}
                  <span
                    className={`uppercase text-[8px] font-bold px-1.5 py-0.2 border ${
                      item.tag === "freelance"
                        ? "bg-teal/10 text-teal border-teal/30 dark:text-terminal-green dark:border-terminal-green/30"
                        : "bg-gold/10 text-gold border-gold/30"
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Deliverables checklist */}
                <div className="border-t border-border pt-4">
                  <span className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground block mb-2">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-2 text-[11px] font-sans text-muted-foreground leading-relaxed">
                    {item.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-soil dark:text-terminal-green select-none mt-0.5 font-bold font-mono">
                          •
                        </span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
