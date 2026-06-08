"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, MapPin, Clock, Info } from "lucide-react";
import { Github } from "@/components/shared/Icons";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function Contact() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDevMode = mounted && resolvedTheme === "dark";
  const [localTime, setLocalTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // States for floating labels focus check
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Click particles state
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const colomboTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
      });
      const dateObj = new Date(colomboTime);
      
      const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setLocalTime(timeStr);

      // Available between 8:00 AM and 10:00 PM (22:00) Sri Lanka Time
      const hour = dateObj.getHours();
      setIsAvailable(hour >= 8 && hour < 22);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const triggerParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 4 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
    }));

    setParticles(newParticles);
    // Clear particles after animation
    setTimeout(() => setParticles([]), 600);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const isLabelFloating = (field: string, val: string) => {
    return focusedField === field || val.length > 0;
  };

  return (
    <section id="contact" className="py-20 bg-sand dark:bg-dark relative overflow-hidden">
      
      {/* Particle animation styles */}
      <style jsx global>{`
        @keyframes particle-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--p-x), var(--p-y)) scale(0.2); opacity: 0; }
        }
        .animate-particle {
          animation: particle-fly 0.5s ease-out forwards;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        
        {/* Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            {isDevMode ? "> 06_DIALOGUE" : "[06 / DIALOGUE]"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-foreground">
            Get in Touch
          </h2>
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info cards - Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display font-bold text-2xl border-b border-border pb-2 text-foreground">
              Direct Channels
            </h3>
            
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              If you want to collaborate on a full-stack Next.js project, scale mathematical trading models, discuss Vedic transits, or share agro-technology concepts — leave a message!
            </p>

            <div className="space-y-4 font-mono text-xs">
              {/* Mail Card */}
              <motion.a
                href="mailto:thanarasansivanujan@gmail.com"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 border-2 border-foreground bg-card hover:bg-soil/5 dark:hover:bg-terminal-green/5 transition-all duration-200 brutalist-border group/mail"
              >
                <motion.div
                  className="p-2 border border-foreground bg-background text-foreground"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Email</span>
                  <span className="font-bold">thanarasansivanujan@gmail.com</span>
                </div>
              </motion.a>

              {/* Github Card */}
              <motion.a
                href="https://github.com/sivanujan"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 border-2 border-foreground bg-card hover:bg-soil/5 dark:hover:bg-terminal-green/5 transition-all duration-200 brutalist-border group/git"
              >
                <motion.div
                  className="p-2 border border-foreground bg-background text-foreground"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Github className="w-5 h-5" />
                </motion.div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">GitHub</span>
                  <span className="font-bold">github.com/sivanujan</span>
                </div>
              </motion.a>
            </div>

            {/* Location Status Badge */}
            <div className="border-4 border-foreground p-5 bg-card/50 brutalist-border relative text-foreground">
              <span className="absolute top-2 left-3 font-mono text-[9px] opacity-40 uppercase">
                Status
              </span>
              <div className="space-y-3.5 pt-3.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rust shrink-0 animate-bounce" />
                    <span>Jaffna, Sri Lanka 🇱🇰</span>
                  </div>
                  {/* Pulsing Availability Dot */}
                  <div className="flex items-center gap-1.5 font-bold text-[9px]">
                    <span className={`relative flex h-2 w-2`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? "bg-green-400" : "bg-red-400"} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                    </span>
                    <span className={isAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {isAvailable ? "AVAILABLE FOR WORK" : "AWAY / OFFLINE"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Clock className="w-4 h-4 text-soil dark:text-terminal-green shrink-0 animate-spin-slow" />
                  <span>Jaffna Local Time:</span>
                  <span className="font-bold text-soil dark:text-terminal-green tabular-nums">
                    {localTime || "15:45:28 PM"}
                  </span>
                </div>

                <div className="flex items-start gap-1.5 font-mono text-[10px] text-muted-foreground border-t border-border/60 pt-2.5">
                  <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <span>📡 Response time: Usually within 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Right Column */}
          <div className="lg:col-span-7">
            <h3 className="font-display font-bold text-2xl border-b border-border pb-2 mb-6 text-foreground">
              Transmission Portal
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Name & Email inputs row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name field */}
                <div className="space-y-1 relative pt-3">
                  <label
                    htmlFor="name"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none uppercase font-bold text-foreground bg-sand dark:bg-dark px-1 z-10 ${
                      isLabelFloating("name", formState.name)
                        ? "top-1 text-[8px] opacity-100 text-teal dark:text-terminal-green"
                        : "top-6 text-xs opacity-50"
                    }`}
                  >
                    Sender Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder=""
                    className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground focus:outline-none focus:border-teal dark:focus:border-terminal-green focus:ring-4 focus:ring-teal/15 dark:focus:ring-terminal-green/15 transition-all"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1 relative pt-3">
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none uppercase font-bold text-foreground bg-sand dark:bg-dark px-1 z-10 ${
                      isLabelFloating("email", formState.email)
                        ? "top-1 text-[8px] opacity-100 text-teal dark:text-terminal-green"
                        : "top-6 text-xs opacity-50"
                    }`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder=""
                    className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground focus:outline-none focus:border-teal dark:focus:border-terminal-green focus:ring-4 focus:ring-teal/15 dark:focus:ring-terminal-green/15 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1 relative pt-3">
                <label
                  htmlFor="subject"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none uppercase font-bold text-foreground bg-sand dark:bg-dark px-1 z-10 ${
                    isLabelFloating("subject", formState.subject)
                      ? "top-1 text-[8px] opacity-100 text-teal dark:text-terminal-green"
                      : "top-6 text-xs opacity-50"
                  }`}
                >
                  Subject Line *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formState.subject}
                  onFocus={() => handleFocus("subject")}
                  onBlur={handleBlur}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder=""
                  className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground focus:outline-none focus:border-teal dark:focus:border-terminal-green focus:ring-4 focus:ring-teal/15 dark:focus:ring-terminal-green/15 transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1 relative pt-3">
                <label
                  htmlFor="message"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none uppercase font-bold text-foreground bg-sand dark:bg-dark px-1 z-10 ${
                    isLabelFloating("message", formState.message)
                      ? "top-1 text-[8px] opacity-100 text-teal dark:text-terminal-green"
                      : "top-6 text-xs opacity-50"
                  }`}
                >
                  Message Payload *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onFocus={() => handleFocus("message")}
                  onBlur={handleBlur}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder=""
                  className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground focus:outline-none focus:border-teal dark:focus:border-terminal-green focus:ring-4 focus:ring-teal/15 dark:focus:ring-terminal-green/15 transition-all resize-none"
                />
              </div>

              {/* Status Message */}
              {status === "success" && (
                <p className="p-3 border-2 border-teal bg-teal/10 text-teal font-bold uppercase text-[10px]">
                  Success: Message transmitted successfully. Bids you welcome!
                </p>
              )}
              {status === "error" && (
                <p className="p-3 border-2 border-rust bg-rust/10 text-rust font-bold uppercase text-[10px]">
                  Error: Transmission failed. Please contact via direct email.
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                onClick={triggerParticles}
                className="group relative px-6 py-4 border-2 border-foreground text-foreground hover:text-background transition-all w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest disabled:opacity-50 overflow-hidden select-none z-10"
              >
                {/* Click Particles Burst Overlay */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  {particles.map((p) => {
                    const angle = Math.random() * 2 * Math.PI;
                    const r = 30 + Math.random() * 25;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    return (
                      <div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-full bg-soil dark:bg-terminal-green animate-particle"
                        style={{
                          left: `${p.x}px`,
                          top: `${p.y}px`,
                          "--p-x": `${x}px`,
                          "--p-y": `${y}px`,
                        } as any}
                      />
                    );
                  })}
                </div>

                {/* Background sliding fill */}
                <div className="absolute inset-0 bg-soil dark:bg-terminal-green translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 z-0" />

                {status === "loading" ? (
                  <span className="relative z-10">Transmitting...</span>
                ) : (
                  <div className="relative z-10 flex items-center gap-2">
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-[3px] group-hover:rotate-[15deg] transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
