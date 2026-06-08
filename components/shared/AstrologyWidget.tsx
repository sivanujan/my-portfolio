"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Compass } from "lucide-react";

interface CellData {
  isCenter?: boolean;
  sign?: string;
  name?: string;
  label?: string;
  tamil?: string;
  planets?: string[];
  isLagna?: boolean;
}

const CHART_CELLS: CellData[] = [
  // Row 0
  { sign: "MEE", name: "Meena", label: "Pis", tamil: "மீனம்", planets: ["Sa", "Ra"] },
  { sign: "MES", name: "Mesha", label: "Ari", tamil: "மேஷம்", planets: [] },
  { sign: "VRI", name: "Vrishabha", label: "Tau", tamil: "ரிஷபம்", planets: ["Su", "Ma"] },
  { sign: "MIT", name: "Mithuna", label: "Gem", tamil: "மிதுனம்", planets: ["Ju", "Me"] },
  // Row 1
  { sign: "KUM", name: "Kumbha", label: "Aqu", tamil: "கும்பம்", planets: [] },
  { isCenter: true },
  { sign: "KAR", name: "Karka", label: "Can", tamil: "கடகம்", planets: ["Ve"] },
  // Row 2
  { sign: "MAK", name: "Makara", label: "Cap", tamil: "மகரம்", planets: [] },
  { sign: "SIM", name: "Simha", label: "Leo", tamil: "சிம்மம்", planets: ["ASC"], isLagna: true },
  // Row 3
  { sign: "DHA", name: "Dhanu", label: "Sag", tamil: "தனுசு", planets: [] },
  { sign: "VRI_SCO", name: "Vrishchika", label: "Sco", tamil: "விருச்சிகம்", planets: [] },
  { sign: "TUL", name: "Tula", label: "Lib", tamil: "துலாம்", planets: ["Mo"] },
  { sign: "KAN", name: "Kanya", label: "Vir", tamil: "கன்னி", planets: ["Ke"] },
];

export default function AstrologyWidget() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const colomboTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
      });
      const dateObj = new Date(colomboTime);
      const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setLocalTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDevMode = mounted && resolvedTheme === "dark";

  return (
    <div className="border-2 border-soil dark:border-terminal-green bg-sand/50 dark:bg-dark/50 p-5 rounded-none w-full max-w-sm relative overflow-hidden transition-all duration-300">
      
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
          <span className="font-display font-bold text-xs tracking-wider uppercase">
            Vedic Transits (Leo Ascendant)
          </span>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 bg-gold/10 text-gold border border-gold/30">
          June 2026
        </span>
      </div>

      {/* Centered Chart */}
      <div className="flex justify-center relative z-10">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full aspect-square border-2 border-foreground bg-foreground/5 p-1 relative font-mono select-none">
          {CHART_CELLS.map((cell, idx) => {
            if (cell.isCenter) {
              return (
                <div
                  key="center"
                  className="col-span-2 row-span-2 border border-foreground/30 flex flex-col items-center justify-center text-center font-mono text-[9px] bg-background/80 p-2 uppercase leading-relaxed text-soil dark:text-terminal-green font-bold"
                >
                  <span>D1 Transit</span>
                  <span className="text-[7px] text-muted-foreground mt-1 lowercase">Simha Lagna</span>
                  <span className="text-[7px] text-muted-foreground mt-0.5 tabular-nums text-foreground">{localTime}</span>
                </div>
              );
            }

            return (
              <div
                key={cell.sign || idx}
                className={`border border-foreground/20 p-1 flex flex-col justify-between transition-all duration-200 bg-background/40 hover:bg-foreground/5 ${
                  cell.isLagna ? "overflow-hidden" : ""
                }`}
              >
                {/* Lagna Diagonal Indicator */}
                {cell.isLagna && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-soil/10 dark:via-terminal-green/10 to-transparent pointer-events-none" />
                )}

                {/* Sign Label */}
                <div className="flex justify-between items-center text-[7px] text-muted-foreground/80 leading-none">
                  <span>{cell.label}</span>
                  <span className="text-[6px] opacity-60 font-sans">{cell.tamil}</span>
                </div>

                {/* Planets list */}
                <div className="flex flex-wrap gap-0.5 justify-center py-1">
                  {cell.planets?.map((p) => {
                    const isAscendant = p === "ASC";

                    return (
                      <span
                        key={p}
                        className={`text-[8px] font-bold px-1 border leading-normal uppercase transition-all ${
                          isAscendant
                            ? "bg-soil/10 text-soil border-soil/30 dark:bg-terminal-green/10 dark:text-terminal-green dark:border-terminal-green/30 font-black italic"
                            : "bg-background/80 text-foreground border-foreground/20"
                        }`}
                      >
                        {p}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
