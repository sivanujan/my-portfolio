"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sprout, Compass, Sword, ShieldCheck, Flame, TrendingUp } from "lucide-react";

const TIMELINE = [
  {
    year: "2020",
    title: "The Genesis",
    description: "Wrote first lines of code in Python. Built web scrapers and simple automation scripts to gather market data.",
  },
  {
    year: "2022",
    title: "Academia & Systems",
    description: "Enrolled in Bachelor of Software Engineering (BSE Honours). Mastered relational databases, computer science theory, and system design.",
  },
  {
    year: "2023",
    title: "Web Engine & Algo Trading",
    description: "Expanded into Next.js, FastAPI, and Redis. Built Shopify customizations and launched first automated trading algorithms on crypto exchanges.",
  },
  {
    year: "2024",
    title: "Production Deploys",
    description: "Scaled web systems on AWS. Deployed complex web platforms (KIO-X Berlin) and integrated LLMs with astrological datasets (AstroZen).",
  },
  {
    year: "Present",
    title: "The Code & Soil Integration",
    description: "Balancing enterprise contract engineering with traditional agriculture in Jaffna's rich red soil.",
  },
];

const INTERESTS = [
  {
    icon: <Sprout className="w-5 h-5 text-teal dark:text-terminal-green relative z-10" />,
    title: "Traditional Farming",
    description: "Cultivating organic crops in the Jaffna dry zone. Applying systemic water-routing schedules to land parcels.",
    color: "rgba(13, 110, 110, 0.12)", // Green/Teal tint
  },
  {
    icon: <Sword className="w-5 h-5 text-rust relative z-10" />,
    title: "Tactical Chess",
    description: "Analyzing middlegame combinations. Translating board geometry and tree search logic into algorithmic code structures.",
    color: "rgba(192, 67, 42, 0.12)", // Rust/Dark tint
  },
  {
    icon: <Compass className="w-5 h-5 text-gold relative z-10" />,
    title: "Vedic Jyotish Astrology",
    description: "Studying planetary transits, planetary periods (Dashas), and their correlation with cycles in human behavior and markets.",
    color: "rgba(201, 151, 44, 0.12)", // Gold tint
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-emerald-500 relative z-10" />,
    title: "Crypto Algorithmic Trading",
    description: "Developing automated quantitative engines using FastAPI, Redis Pub/Sub, and WebSockets to trade digital assets.",
    color: "rgba(16, 185, 129, 0.12)", // Emerald/Blue tint
  },
];

const QUOTE_WORDS = "I write code that runs on servers and plants that grow in red soil.".split(" ");

export default function About() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDevMode = mounted && resolvedTheme === "dark";
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <section id="about" className="py-20 border-b-2 border-foreground bg-sand dark:bg-dark relative overflow-hidden">
      
      {/* Styles for Rotating Border Sweeps */}
      <style jsx global>{`
        @keyframes border-sweep-anim {
          100% { transform: rotate(360deg); }
        }
        .animate-border-sweep::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, var(--primary), transparent 30%);
          animation: border-sweep-anim 4s linear infinite;
          z-index: 0;
          pointer-events: none;
        }
      `}</style>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        
        {/* Title */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            {isDevMode ? "> 02_IDENTITY" : "[02 / IDENTITY]"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-foreground">
            Code & Soil
          </h2>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Timeline - Left Column */}
          <div className="lg:col-span-6 space-y-8 relative">
            <h3 className="font-display font-bold text-2xl mb-6 border-b border-border pb-2 text-foreground">
              Developer Chronology
            </h3>

            <div className="relative pl-6 ml-3 space-y-8">
              
              {/* Self-drawing vertical line */}
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-[2px] bg-foreground/15 z-0" />
              <svg className="absolute left-[7px] top-1.5 bottom-1.5 w-[2px] h-[calc(100%-12px)] z-10 pointer-events-none" fill="none">
                <motion.line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>

              {TIMELINE.map((item, idx) => {
                const isPresent = item.year === "Present";
                
                return (
                  <div key={item.year} className="relative group">
                    {/* Timeline Checkbox Dot */}
                    <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-none border-2 border-foreground bg-background group-hover:bg-foreground transition-colors z-20" />

                    <div className="space-y-1">
                      {/* Left-to-right filling Year Badge */}
                      <span className="relative overflow-hidden inline-block font-mono text-xs font-bold text-soil dark:text-terminal-green border border-border px-2 py-0.5 z-10 group/year">
                        {/* Background slider fill */}
                        <span className="absolute inset-0 bg-soil dark:bg-terminal-green translate-x-[-101%] group-hover/year:translate-x-0 transition-transform duration-300 z-0" />
                        
                        <motion.span
                          className="relative z-10 group-hover/year:text-sand dark:group-hover/year:text-dark transition-colors duration-300"
                          animate={isPresent ? {
                            boxShadow: [
                              "0px 0px 0px 0px rgba(201,151,44,0.4)",
                              "0px 0px 0px 6px rgba(201,151,44,0)",
                              "0px 0px 0px 0px rgba(201,151,44,0)",
                            ]
                          } : {}}
                          transition={{ repeat: Infinity, duration: 2.0 }}
                        >
                          {item.year}
                        </motion.span>
                      </span>

                      <h4 className="font-display font-bold text-lg text-foreground mt-1.5">
                        {item.title}
                      </h4>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interests & Quote - Right Column */}
          <div className="lg:col-span-6 space-y-10">
            
            {/* Philosophy Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="border-4 border-foreground p-8 bg-sand dark:bg-dark relative shadow-[6px_6px_0px_0px_var(--color-soil)] dark:shadow-[6px_6px_0px_0px_var(--terminal-green)] text-foreground overflow-hidden"
            >
              {/* Giant massive quote glyph backdrop */}
              <span className="absolute -top-6 -left-2 font-display text-[11rem] leading-none text-soil dark:text-terminal-green opacity-[0.12] select-none pointer-events-none">
                “
              </span>

              {/* Decorative Kolam Diamonds */}
              <svg className="absolute top-2 right-2 w-6 h-6 text-soil/25 dark:text-terminal-green/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L22 12L12 22L2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg className="absolute bottom-2 left-2 w-6 h-6 text-soil/25 dark:text-terminal-green/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L22 12L12 22L2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>

              <span className="absolute top-2 left-10 font-mono text-[9px] opacity-40 uppercase tracking-widest">
                [Philosophy]
              </span>

              {/* Word-by-word Reveal text */}
              <div className="font-display italic text-lg sm:text-xl md:text-2xl text-foreground text-center font-bold pt-6 relative z-10 flex flex-wrap justify-center">
                {QUOTE_WORDS.map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.35, ease: "easeOut" }}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Beyond The Screen Grid */}
            <div className="space-y-6">
              <h3 className="font-display font-bold text-2xl border-b border-border pb-2 text-foreground">
                Beyond the Screen
              </h3>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {INTERESTS.map((interest) => (
                  <motion.div
                    key={interest.title}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group/card relative p-4 border-2 border-border bg-card overflow-hidden transition-all duration-200 cursor-pointer"
                  >
                    {/* Laser sweep border container */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 overflow-hidden animate-border-sweep" />

                    {/* Inside box content to block the center of conic gradient */}
                    <div className="absolute inset-[2px] bg-card z-0" />

                    {/* Radial Tint Backdrop */}
                    <div
                      className="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${interest.color} 0%, transparent 70%)`
                      }}
                    />

                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-1.5 border border-border bg-background relative overflow-hidden">
                          {interest.icon}
                        </div>
                        <h4 className="font-display font-bold text-xs uppercase tracking-wide text-foreground relative z-10">
                          {interest.title}
                        </h4>
                      </div>
                      <p className="font-sans text-[11px] text-muted-foreground leading-relaxed relative z-10">
                        {interest.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>

        </div>

      </motion.div>
    </section>
  );
}
