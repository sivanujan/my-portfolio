"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Star, Info } from "lucide-react";

interface TransitInfo {
  planet: string;
  symbol: string;
  house: number;
  houseName: string;
  sign: string;
  status: "favorable" | "neutral" | "challenging";
  effect: string;
  description: string;
}

const SIMHA_TRANSITS: TransitInfo[] = [
  {
    planet: "Saturn (Shani)",
    symbol: "🪐",
    house: 8,
    houseName: "Ashtama Bhava",
    sign: "Pisces (Meena)",
    status: "challenging",
    effect: "Deep Transformation & Research Focus",
    description:
      "Saturn transits your 8th house. Excellent for deep coding exploration, cryptography research, and building long-term trading algorithms. Demands discipline, patience, and avoiding high-risk impulse trading.",
  },
  {
    planet: "Jupiter (Guru)",
    symbol: "☀️",
    house: 11,
    houseName: "Labha Bhava",
    sign: "Gemini (Mithuna)",
    status: "favorable",
    effect: "Expansion of Network & Crypto Gains",
    description:
      "Jupiter in the 11th house of gains brings spiritual blessings to your financial modeling and professional networks. Direct support for scaling SaaS systems and high-value partnerships.",
  },
  {
    planet: "Rahu (North Node)",
    symbol: "🐉",
    house: 8,
    houseName: "Randhra Bhava",
    sign: "Pisces (Meena)",
    status: "neutral",
    effect: "Unorthodox Financial Models",
    description:
      "Rahu in the 8th house fuels deep interest in occult studies, Vedic astrology research, and alternative blockchain protocols. Inspires unconventional insights but warns against speculative trading.",
  },
  {
    planet: "Ketu (South Node)",
    symbol: "⚱️",
    house: 2,
    houseName: "Dhana Bhava",
    sign: "Virgo (Kanya)",
    status: "neutral",
    effect: "Detachment from Material Volatility",
    description:
      "Ketu transiting your 2nd house of speech and accumulated wealth encourages detachment from market volatility. Promotes focus on pure engineering output rather than short-term price actions.",
  },
];

export default function AstrologyWidget() {
  const [activePlanet, setActivePlanet] = useState<number>(0);
  const [hoveredPlanetIdx, setHoveredPlanetIdx] = useState<number | null>(null);

  return (
    <div className="border-2 border-soil dark:border-terminal-green bg-sand/50 dark:bg-dark/50 p-5 rounded-none w-full max-w-md relative overflow-hidden">
      
      {/* Subtle Star Field Backdrop */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40 z-0">
        <circle cx="15%" cy="25%" r="1" fill="currentColor" className="animate-pulse" />
        <circle cx="85%" cy="15%" r="1" fill="currentColor" />
        <circle cx="45%" cy="75%" r="1.5" fill="currentColor" className="animate-pulse" />
        <circle cx="75%" cy="85%" r="1" fill="currentColor" />
        <circle cx="25%" cy="65%" r="1" fill="currentColor" />
        <circle cx="90%" cy="55%" r="2" fill="var(--color-gold)" className="animate-pulse" />
        <circle cx="10%" cy="85%" r="1.2" fill="currentColor" />
        <circle cx="60%" cy="20%" r="1" fill="currentColor" className="animate-pulse" />
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-border pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold animate-spin-slow" />
          <span className="font-display font-bold text-sm tracking-wider uppercase">
            Vedic Transits (Leo Ascendant)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-gold/10 text-gold border border-gold/30">
          Simha Lagna • June 2026
        </span>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4 relative z-10">
        {SIMHA_TRANSITS.map((transit, idx) => {
          const isActive = activePlanet === idx;
          const isHovered = hoveredPlanetIdx === idx;
          
          return (
            <div key={transit.planet} className="relative">
              {/* Tooltip on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-30 bg-soil text-sand dark:bg-terminal-green dark:text-dark px-2 py-1 text-[8px] font-mono border border-foreground bottom-full left-1/2 -translate-x-1/2 mb-2 uppercase text-center w-24 pointer-events-none"
                  >
                    {transit.sign.split(" ")[0]}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setActivePlanet(idx)}
                onMouseEnter={() => setHoveredPlanetIdx(idx)}
                onMouseLeave={() => setHoveredPlanetIdx(null)}
                className={`w-full p-2 text-center border font-mono text-xs transition-all flex flex-col items-center gap-1 relative overflow-hidden ${
                  isActive
                    ? "bg-soil text-sand border-soil dark:bg-terminal-green dark:text-dark dark:border-terminal-green"
                    : "border-border hover:bg-muted/10 bg-background/30"
                }`}
              >
                {/* Golden Rotating Halo Ring */}
                {isActive && (
                  <div className="absolute inset-0 border border-dashed border-gold scale-110 animate-spin-slow pointer-events-none" />
                )}

                <span className="text-lg relative z-10">{transit.symbol}</span>
                <span className="text-[9px] truncate max-w-full relative z-10">
                  {transit.planet.split(" ")[0]}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Transit Card Details */}
      <div className="min-h-[140px] flex flex-col justify-between relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlanet}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-display font-bold text-base text-soil dark:text-terminal-green">
                  {SIMHA_TRANSITS[activePlanet].planet}
                </h4>
                <p className="text-xs font-mono text-muted-foreground">
                  Transiting {SIMHA_TRANSITS[activePlanet].house}th House (
                  {SIMHA_TRANSITS[activePlanet].houseName}) in{" "}
                  {SIMHA_TRANSITS[activePlanet].sign}
                </p>
              </div>
              <span
                className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                  SIMHA_TRANSITS[activePlanet].status === "favorable"
                    ? "bg-teal/10 text-teal border-teal/40 dark:text-primary dark:border-primary/40"
                    : SIMHA_TRANSITS[activePlanet].status === "challenging"
                    ? "bg-rust/10 text-rust border-rust/40"
                    : "bg-gold/10 text-gold border-gold/40"
                }`}
              >
                {SIMHA_TRANSITS[activePlanet].status}
              </span>
            </div>

            <div className="text-sm font-semibold mb-2 flex items-center gap-1 text-foreground">
              <Star className="w-3.5 h-3.5 text-gold fill-gold" />
              {SIMHA_TRANSITS[activePlanet].effect}
            </div>

            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              {SIMHA_TRANSITS[activePlanet].description}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Quote/Vedic astrology wisdom note */}
        <div className="mt-4 pt-2 border-t border-border flex items-start gap-1.5 text-[9px] font-mono text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
          <span>
            &ldquo;Grahas (planets) guide tendencies; conscious action (Karma) shapes destiny. As in farming, we plant when transits favor the soil.&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
