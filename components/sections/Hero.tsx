"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, FileDown, Terminal, Sprout } from "lucide-react";

const WORDS = [
  "Full-Stack Developer",
  "Crypto Algo-Trader",
  "Farmer",
  "Leo Ascendant",
];
const TYPING_PERIOD = 1500;

// Simple custom count-up hook
function useCountUp(target: number, duration = 1000, delay = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };
      frameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay]);

  return count;
}

export default function Hero() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);
  const [kolamRotate, setKolamRotate] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Scroll listener to hide scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats count up
  const yearsCoding = useCountUp(5, 1000, 1500);
  const activeClients = useCountUp(6, 1000, 1700);
  const continentsCount = useCountUp(3, 1000, 1900);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % WORDS.length;
      const fullText = WORDS[i];
      
      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(60);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(120);
      }

      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
        setTypingSpeed(TYPING_PERIOD);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(120);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Mouse move handler to rotate Kolam SVG toward cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    // Calculate rotation angle (max ±15 degrees)
    const angle = (x / (rect.width / 2)) * 15;
    setKolamRotate(angle);
  };

  const handleMouseLeave = () => {
    setKolamRotate(0);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-sand dark:bg-dark dot-grid border-b-2 border-foreground"
    >
      {/* Kolam Rotating Backdrop SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10 z-0 overflow-hidden">
        <motion.div
          animate={{ rotate: kolamRotate }}
          transition={{ type: "spring", stiffness: 35, damping: 20 }}
          className="relative w-[80vw] h-[80vw] max-w-[600px] max-h-[600px]"
        >
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full animate-rotate-kolam text-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Concentric rings */}
            <circle cx="300" cy="300" r="280" strokeDasharray="10, 10" />
            <circle cx="300" cy="300" r="220" />
            <circle cx="300" cy="300" r="160" strokeDasharray="5, 5" />
            <circle cx="300" cy="300" r="100" />
            <circle cx="300" cy="300" r="40" />

            {/* Symmetrical lines */}
            <line x1="300" y1="20" x2="300" y2="580" />
            <line x1="20" y1="300" x2="580" y2="300" />
            <line x1="102" y1="102" x2="498" y2="498" />
            <line x1="102" y1="498" x2="498" y2="102" />

            {/* Kolam Loops and Shapes */}
            <path d="M 300,100 C 260,140 220,180 300,200 C 380,180 340,140 300,100 Z" />
            <path d="M 300,500 C 260,460 220,420 300,400 C 380,420 340,460 300,500 Z" />
            <path d="M 100,300 C 140,260 180,220 200,300 C 180,380 140,340 100,300 Z" />
            <path d="M 500,300 C 460,260 420,220 400,300 C 420,380 460,340 500,300 Z" />

            {/* Small grid of dots */}
            {Array.from({ length: 9 }).map((_, i) =>
              Array.from({ length: 9 }).map((_, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={100 + i * 50}
                  cy={100 + j * 50}
                  r="3"
                  fill="currentColor"
                />
              ))
            )}
          </svg>
        </motion.div>
      </div>

      {/* Scattered Floating Badges (Desktop Only) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block z-10">
        <div className="max-w-7xl mx-auto h-full w-full relative">
          {/* Badge 1: Top Right */}
          <motion.div
            className="absolute top-[20%] right-[10%] px-3.5 py-1.5 border border-soil/40 bg-sand/35 dark:border-terminal-green/30 dark:bg-dark/30 backdrop-blur-sm rounded-full font-mono text-[10px] text-foreground font-semibold"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ⚡ Next.js 14 Expert
          </motion.div>

          {/* Badge 2: Mid Right */}
          <motion.div
            className="absolute top-[42%] right-[5%] px-3.5 py-1.5 border border-soil/40 bg-sand/35 dark:border-terminal-green/30 dark:bg-dark/30 backdrop-blur-sm rounded-full font-mono text-[10px] text-foreground font-semibold"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            🪐 Saturn Mahadasha Active
          </motion.div>

          {/* Badge 3: Lower Right */}
          <motion.div
            className="absolute top-[68%] right-[12%] px-3.5 py-1.5 border border-soil/40 bg-sand/35 dark:border-terminal-green/30 dark:bg-dark/30 backdrop-blur-sm rounded-full font-mono text-[10px] text-foreground font-semibold"
            animate={{ y: [0, -11, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
          >
            ₿ 4+ Yrs Binance Futures
          </motion.div>

          {/* Badge 4: Far Right */}
          <motion.div
            className="absolute top-[50%] right-[22%] px-3.5 py-1.5 border border-soil/40 bg-sand/35 dark:border-terminal-green/30 dark:bg-dark/30 backdrop-blur-sm rounded-full font-mono text-[10px] text-foreground font-semibold"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          >
            🌿 Crop Batch #7
          </motion.div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center relative z-10 pt-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Tamil Spelled Script Overlay */}
          <span className="font-display font-medium text-lg md:text-xl text-soil dark:text-gold block tracking-widest uppercase opacity-85">
            தனராசன் சிவனுஜன்
          </span>

          {/* Large Title name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-black tracking-tight text-foreground leading-none">
            THANARASAN
            <br />
            SIVANUJAN
          </h1>

          {/* Dynamic subtitle */}
          <div className="flex items-center gap-2 font-mono text-lg sm:text-2xl border-l-4 border-foreground pl-4 h-8">
            <span className="text-muted-foreground select-none">&gt;</span>
            <span className="font-bold text-foreground">{text}</span>
            <span className="animate-pulse w-2.5 h-6 bg-foreground inline-block" />
          </div>

          <p className="font-sans text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            A software engineer building distributed web architecture, specialized in Next.js, FastAPI, and data pipelines. Under shadow transits in Jaffna, translating astrological cycles into algo-trading bots and organic crop harvests.
          </p>

          {/* Hero Stats Row */}
          <div className="flex items-center gap-6 py-4 border-t border-b border-border/50 max-w-lg font-mono">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-soil dark:text-terminal-green">
                {yearsCoding}+
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Years Coding</div>
            </div>
            <div className="w-[1px] h-8 bg-border/60" />
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-soil dark:text-terminal-green">
                {activeClients}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Active Clients</div>
            </div>
            <div className="w-[1px] h-8 bg-border/60" />
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-soil dark:text-terminal-green">
                {continentsCount}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Continents Served</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              className="px-6 py-3 border-2 border-foreground bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-background hover:text-foreground hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_0px_var(--color-soil)] dark:shadow-[4px_4px_0px_0px_var(--terminal-green)]"
            >
              <span className="flex items-center gap-2">
                See My Work <ArrowDown className="w-4 h-4" />
              </span>
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 border-2 border-foreground bg-background text-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background hover:scale-105 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                Download CV <FileDown className="w-4 h-4" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Down Indicator */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hidden sm:flex"
          >
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-foreground">
              SCROLL
            </span>
            <div className="w-[1px] h-10 bg-foreground/45 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-2.5 bg-soil dark:bg-terminal-green"
                animate={{ y: [0, 40, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Farming Log Marquee Ticker */}
      <div className="w-full bg-soil dark:bg-terminal-dim border-t-2 border-foreground overflow-hidden py-3 relative z-10 select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-sand dark:text-terminal-green font-mono text-xs uppercase tracking-widest">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-4 text-[10px] md:text-xs">
              <Sprout className="w-4 h-4 text-gold shrink-0 animate-pulse" />
              <span className="dark:hidden">🌱 Farming Log: Organic Crops, Batch #7 — Est. harvest: Q3 2025</span>
              <span className="hidden dark:inline">$ harvest --crop=organic --batch=7 | next.js --mode=production</span>
              <span className="opacity-40">|</span>
              <Terminal className="w-4 h-4 text-rust shrink-0" />
              <span>CryptoEdge Bot v2.4: active in Binance Futures</span>
              <span className="opacity-40">|</span>
              <span>SLST (Jaffna): UTC+5:30</span>
              <span className="opacity-40">|</span>
              <span>Next.js 14 App Router + Tailwind</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
