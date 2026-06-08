"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, X, Terminal, Sprout, Compass } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  category: "Astrology" | "Algo Trading" | "Farming & Code";
  date: string;
  readTime: string;
  summary: string;
  icon: React.ReactNode;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "saturn-mahadasha",
    title: "Saturn Mahadasha & the Developer's Journey",
    category: "Astrology",
    date: "June 2026",
    readTime: "7 min read",
    summary:
      "Understanding how the planetary cycles of Saturn (Shani Dev) dictate discipline, long-term testing architectures, and the psychological patience required to debug legacy distributed systems.",
    icon: <Compass className="w-5 h-5 text-gold" />,
    content: [
      "In Vedic astrology, Saturn represents Shani—the cosmic taskmaster. Saturn demands structure, absolute accountability, and strict adherence to natural laws. As a developer currently undergoing transits through the 8th house (representing occult depth, research, and transformations), I have found that debugging complex systems is a form of Saturnian meditation.",
      "Young developers are often driven by quick deployments and instant feedback loops (represented by Mercury and Rahu). But building high-fidelity trading engines or scalable platforms requires the slow, methodical energy of Saturn. You cannot rush a compiling compiler, and you cannot bypass database indices without eventual failure.",
      "When you encounter the Saturn Mahadasha or strong Saturnian transits, your code is tested. Refactoring 10,000 lines of spaghetti code, writing exhaustive unit tests, and verifying API boundaries under strict resource constraints become daily rituals. Saturn teaches us that a robust architecture is built not in hours of high-dopamine coding, but in days of patient tracing.",
      "Embracing this planetary transit means aligning with Saturn's demands: write clean documentation, build robust fail-safes, double-check your socket handshakes, and accept that some debugging sessions take days. In the end, the systems that survive are those baptized in Saturnian patience.",
    ],
  },
  {
    id: "trading-bot-jaffna",
    title: "Building a Trading Bot from Jaffna",
    category: "Algo Trading",
    date: "May 2026",
    readTime: "9 min read",
    summary:
      "Engineering a low-latency cryptocurrency futures execution engine while coping with dry-zone infrastructure limitations, power outages, and routing packets to Singapore server nodes.",
    icon: <Terminal className="w-5 h-5 text-rust" />,
    content: [
      "Building quantitative trading systems is usually the domain of high-speed fiber lines in financial hubs like New York or London. Designing a high-frequency trading bot from the dry zone of Jaffna, Sri Lanka, requires a different set of engineering solutions.",
      "The core problem is not just writing clean algorithms; it is infrastructure availability. Frequent grid drops and local network packet losses mean your bot can easily lose connection to the exchange (Binance Futures) in the middle of executing a leveraged position. A single unhedged order can wipe out months of agricultural savings.",
      "To solve this, I designed a microservices architecture using FastAPI, Redis, and Docker. The bot is hosted on a high-availability virtual server (AWS EC2) located close to the exchange's Asia-Pacific exchange endpoints in Singapore. This ensures a stable sub-40ms WebSocket execution pathway.",
      "Meanwhile, local controls in Jaffna are managed through a low-bandwidth, light telemetry dashboard. I wrote custom heartbeat scripts in Python that check if the server is responsive every 2 seconds. If a network socket drop is detected, a backup system immediately triggers defensive orders, canceling active bids and securing open contracts. Building from Jaffna teaches you to expect failure at the socket level and design defensive code accordingly.",
    ],
  },
  {
    id: "farming-makes-better-engineer",
    title: "Why Farming Makes Me a Better Engineer",
    category: "Farming & Code",
    date: "April 2026",
    readTime: "6 min read",
    summary:
      "How cultivating organic crops in red loam soil mirrors data pipeline modeling, teaches resource pacing, and highlights the value of seasonal execution.",
    icon: <Sprout className="w-5 h-5 text-teal" />,
    content: [
      "Every afternoon, I close VS Code, swap my keyboard for a weeding hoe, and step into the organic fields of Jaffna. At first glance, software engineering and traditional farming have nothing in common. One is digital, virtual, and abstract; the other is physical, earthy, and labor-intensive. But the underlying systems logic is identical.",
      "An organic crop takes 9 to 12 months to grow. You cannot speed up its development cycle by throwing more water, fertilizer, or labor at it, just as you cannot speed up a complex codebase development by simply doubling the engineering team size (Brooks' Law). You must respect the organic compilation cycle.",
      "Farming is data pipeline modeling in physical space. Water routing channels must be dug with precise angles to prevent overflow, mimicking rate limiters and load balancers. Over-watering drowns the root system; under-watering starves it. This mirrors memory management and buffer allocations in system programming.",
      "Most importantly, working with the soil grounds your mental state. In tech, we are obsessed with instant deployments and immediate reactions. But nature works on seasonal release cycles. Farming teaches you to accept delay, plan for unforeseen climate disruptions, and value the slow harvesting of long-term projects. When you understand the soil, your code gains structural integrity.",
    ],
  },
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-sand dark:bg-dark py-12 px-4 sm:px-6 lg:px-8 text-foreground dot-grid">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-soil dark:text-terminal-green hover:underline decoration-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Heading */}
        <div className="mb-12 border-b-2 border-foreground pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-soil dark:text-terminal-green block mb-2">
            [TRANSMISSIONS / ESSAYS]
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight">
            Field Notes & Logs
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
            Personal reflections on cosmic cycles, financial math networks, and the organic rhythms of traditional Sri Lankan farming.
          </p>
        </div>

        {/* Grid List */}
        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <motion.div
              key={post.id}
              className="border-2 border-foreground bg-card p-6 rounded-none brutalist-border flex flex-col md:flex-row gap-6 justify-between items-start cursor-pointer hover:scale-[1.01] transition-all"
              onClick={() => setSelectedPost(post)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category, icon and title */}
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2">
                  <div className="p-1 border border-foreground bg-background">
                    {post.icon}
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-soil dark:text-terminal-green border border-border px-2 py-0.5">
                    {post.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wide leading-snug">
                  {post.title}
                </h2>

                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Time stats */}
              <div className="md:text-right shrink-0 font-mono text-[10px] space-y-1 text-muted-foreground pt-1 md:pt-0">
                <div className="flex md:justify-end items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>
                <div>Released: {post.date}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Article Reader Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4 backdrop-blur-md text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-sand dark:bg-dark border-4 border-foreground max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 rounded-none brutalist-border shadow-[8px_8px_0px_0px_var(--foreground)] dark:shadow-[8px_8px_0px_0px_var(--terminal-green)] relative"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-1 border-2 border-foreground hover:bg-destructive hover:text-white transition-colors"
                  aria-label="Close Blog Modal"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="mb-6 border-b border-border pb-4 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-soil dark:text-terminal-green border border-border px-2 py-0.5">
                      {selectedPost.category}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {selectedPost.date} • {selectedPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-wide leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>

                {/* Content paragraphs */}
                <div className="space-y-4 font-sans text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {selectedPost.content.map((pText, pIdx) => (
                    <p key={pIdx}>{pText}</p>
                  ))}
                </div>

                {/* Bottom closing */}
                <div className="mt-8 pt-4 border-t border-border flex justify-end">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background font-mono text-xs uppercase tracking-widest transition-colors"
                  >
                    Close Log
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
