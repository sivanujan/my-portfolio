"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1.2 seconds splash duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-sand text-soil dot-grid select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div className="relative flex flex-col items-center gap-6">
            {/* Centered spinning Kolam */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 text-soil opacity-70"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="50" cy="50" r="45" strokeDasharray="6, 6" />
                <circle cx="50" cy="50" r="30" />
                <line x1="50" y1="5" x2="50" y2="95" />
                <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="3, 3" />
                <path d="M 50,20 C 40,30 30,40 50,50 C 70,40 60,30 50,20 Z" />
                <path d="M 50,80 C 40,70 30,60 50,50 C 70,60 60,70 50,80 Z" />
                <path d="M 20,50 C 30,40 40,30 50,50 C 40,70 30,60 20,50 Z" />
                <path d="M 80,50 C 70,40 60,30 50,50 C 60,70 70,60 80,50 Z" />
              </svg>
            </motion.div>

            {/* Subtitle */}
            <div className="text-center font-mono">
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-soil animate-pulse">
                THANARASAN SIVANUJAN
              </h2>
              <p className="text-[10px] uppercase text-muted-foreground tracking-widest mt-1">
                CODE & SOIL
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
