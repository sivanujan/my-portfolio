"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { theme } = useTheme();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for lag effect
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("custom-cursor-active");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.classList.contains("interactive-cursor");

      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  const isDevMode = theme === "dark";

  return (
    <>
      {/* Outer Pointer Ring / Border */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[99999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          border: isDevMode
            ? "1px solid var(--terminal-green)"
            : "1px solid var(--color-soil)",
          borderRadius: isDevMode ? "0px" : "9999px", // Box-shaped in Dev mode, Circle in Human mode
        }}
        animate={{
          scale: isHovered ? 1.5 : isClicking ? 0.8 : 1,
          rotate: isDevMode && isHovered ? 45 : 0,
          backgroundColor: isHovered
            ? isDevMode
              ? "rgba(0, 255, 102, 0.15)"
              : "rgba(139, 69, 19, 0.15)"
            : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Inner Dot / Terminal Block */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: isDevMode ? "var(--terminal-green)" : "var(--color-soil)",
          borderRadius: isDevMode ? "0px" : "9999px", // Square dot in Dev mode
          width: isDevMode ? "8px" : "8px",
          height: isDevMode ? "14px" : "8px",
        }}
        animate={{
          scale: isHovered ? (isDevMode ? 1.2 : 0.5) : 1,
          opacity: isDevMode ? [1, 1, 0, 0, 1] : 1,
        }}
        transition={
          isDevMode
            ? {
                opacity: {
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "linear",
                  times: [0, 0.49, 0.5, 0.99, 1],
                },
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }
            : {
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }
        }
      />
    </>
  );
}
