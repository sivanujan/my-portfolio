"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Sprout, Cpu, Menu, X, Play, Code } from "lucide-react";
import ChessPuzzle from "./ChessPuzzle";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showChess, setShowChess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset logo clicks after 3 seconds of inactivity
  useEffect(() => {
    if (logoClicks === 0) return;
    const timer = setTimeout(() => setLogoClicks(0), 3000);
    return () => clearTimeout(timer);
  }, [logoClicks]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      setLogoClicks(0);
      setShowChess(true);
    }
  };

  if (!mounted) return null;

  const isDevMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDevMode ? "light" : "dark");
  };

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Easter Egg Trigger */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 select-none group focus:outline-none"
          >
            <div className="relative w-8 h-8 flex items-center justify-center border-2 border-foreground rounded-none bg-foreground text-background transition-transform duration-200 group-hover:-rotate-6">
              <span className="font-display font-black text-lg">T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wide leading-none uppercase text-soil dark:text-terminal-green">
                Sivanujan
              </span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase leading-none mt-1">
                {isDevMode ? "root@sivanujan: ~" : "code & soil"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider hover:text-soil dark:hover:text-terminal-green hover:underline decoration-2 underline-offset-4 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Mode Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-200 text-xs font-mono select-none"
              title={isDevMode ? "Switch to Human (Earthy) Mode" : "Switch to Dev (Terminal) Mode"}
            >
              {isDevMode ? (
                <>
                  <Sprout className="w-3.5 h-3.5 text-teal animate-bounce" />
                  <span>SOIL MODE</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-soil" />
                  <span>DEV MODE</span>
                </>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-3">
            {/* Mode Switcher for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-foreground flex items-center justify-center text-foreground"
              aria-label="Toggle Theme Mode"
            >
              {isDevMode ? <Sprout className="w-4 h-4 text-teal" /> : <Cpu className="w-4 h-4 text-soil" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-foreground flex items-center justify-center text-foreground"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-background border-b-2 border-foreground z-40 md:hidden py-6 px-4 flex flex-col gap-4 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-sm uppercase tracking-wider border-b border-border py-2 text-foreground hover:text-soil dark:hover:text-terminal-green"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chess Easter Egg Modal */}
      <AnimatePresence>
        {showChess && <ChessPuzzle onClose={() => setShowChess(false)} />}
      </AnimatePresence>
    </>
  );
}
