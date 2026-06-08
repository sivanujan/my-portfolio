"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, ExternalLink, Calendar, ArrowUp } from "lucide-react";
import { Github, Linkedin } from "@/components/shared/Icons";
import { motion, AnimatePresence } from "framer-motion";
import AstrologyWidget from "./AstrologyWidget";

export default function Footer() {
  const [localTime, setLocalTime] = useState("");
  const [plantEmoji, setPlantEmoji] = useState("🌱");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sri Lanka time zone clock
  useEffect(() => {
    const updateClock = () => {
      const timeString = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setLocalTime(timeString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Plant Emoji Loop (🌱 -> 🌿 -> 🌳 -> 🌱) every 3 seconds
  useEffect(() => {
    const emojis = ["🌱", "🌿", "🌳"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % emojis.length;
      setPlantEmoji(emojis[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t-2 border-foreground bg-sand/30 dark:bg-dark/80 py-12 transition-all duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Branding and Duality */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display font-black text-2xl tracking-wider text-soil dark:text-terminal-green uppercase">
              Thanarasan S.
            </h3>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed max-w-sm">
              Cultivating the land in Jaffna, Sri Lanka, and writing code that scales globally.
              Merging Vedic patterns, algorithm modeling, and organic agriculture.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-foreground bg-muted/10 p-2.5 border border-border inline-flex">
              <MapPin className="w-4 h-4 text-rust shrink-0" />
              <span>Jaffna, Sri Lanka 🇱🇰</span>
              <span className="opacity-40">|</span>
              <span className="text-soil dark:text-terminal-green font-bold tabular-nums">
                {localTime || "15:45:28 PM"} (SLST)
              </span>
            </div>
          </div>

          {/* Middle Column: Social & Directories */}
          <div className="lg:col-span-3 space-y-4 font-mono text-xs">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-soil dark:text-terminal-green">
              Directories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:contact@sivanujan.online"
                  className="flex items-center gap-2 hover:text-soil dark:hover:text-terminal-green hover:underline decoration-2 underline-offset-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>contact@sivanujan.online</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sivanujan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-soil dark:hover:text-terminal-green hover:underline decoration-2 underline-offset-2"
                >
                  <Github className="w-4 h-4" />
                  <span>github.com/sivanujan</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/thanarasan-s-94a001122/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-soil dark:hover:text-terminal-green hover:underline decoration-2 underline-offset-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin/in/thanarasan-s...</span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[10px] text-muted-foreground leading-normal max-w-xs">
                🌱 farming logs & transit coordinates are updated monthly. Astro values represent Lahiri Ayanamsha placements.
              </p>
            </div>
          </div>

          {/* Right Column: Astrology widget container */}
          <div className="lg:col-span-5 flex justify-end">
            <AstrologyWidget />
          </div>

        </div>

        {/* Bottom border & disclaimer */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Thanarasan Sivanujan. All Rights Reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="/sitemap.xml" className="hover:underline">
              Sitemap
            </a>
            <span>•</span>
            <a href="/robots.txt" className="hover:underline">
              Robots.txt
            </a>
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-6 right-6 p-3 bg-soil text-sand dark:bg-terminal-green dark:text-dark border-2 border-foreground z-40 shadow-[4px_4px_0px_0px_var(--foreground)] dark:shadow-[4px_4px_0px_0px_var(--foreground)] hover:scale-105 transition-all focus:outline-none"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
