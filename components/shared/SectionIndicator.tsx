"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", num: "01", human: "INTRO", dev: "01_INTRO" },
  { id: "about", num: "02", human: "IDENTITY", dev: "02_IDENTITY" },
  { id: "skills", num: "03", human: "EXPERTISE", dev: "03_EXPERTISE" },
  { id: "projects", num: "04", human: "CREATIONS", dev: "04_CREATIONS" },
  { id: "experience", num: "05", human: "JOURNEY", dev: "05_JOURNEY" },
  { id: "contact", num: "06", human: "DIALOGUE", dev: "06_DIALOGUE" },
];

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState("hero");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when center of viewport hits
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    // Special case: check if we are at the very top
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("hero");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDevMode = mounted && theme === "dark";

  return (
    <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-40 font-mono text-[10px] select-none pointer-events-none">
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        const displayName = isDevMode ? `> ${sec.dev}` : sec.num;

        return (
          <div
            key={sec.id}
            className={`flex items-center gap-3 transition-all duration-300 ${
              isActive
                ? "text-soil dark:text-terminal-green font-bold opacity-100 translate-x-2"
                : "text-muted-foreground opacity-30"
            }`}
          >
            {/* Indication Dot/Line */}
            <div
              className={`w-2 h-2 border transition-all duration-300 ${
                isActive
                  ? "bg-soil border-soil dark:bg-terminal-green dark:border-terminal-green scale-125 rotate-45"
                  : "border-muted-foreground rounded-full"
              }`}
            />
            
            <span className="tracking-widest uppercase">
              {isActive ? displayName : isDevMode ? sec.num : sec.num}
            </span>
          </div>
        );
      })}
    </div>
  );
}
export { SECTIONS };
