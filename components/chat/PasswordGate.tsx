"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      if (password === "PASSword@2026") {
        sessionStorage.setItem("chat_authenticated", "true");
        onSuccess();
      } else {
        setError(true);
        setErrorMessage("Invalid Password. Access Denied.");
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal/10 dark:bg-teal/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gold/10 dark:bg-gold/15 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-teal/20 dark:border-teal/30 bg-background/80 dark:bg-card/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-gold to-teal" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 dark:bg-teal/20 border border-teal/30 text-teal mb-4 shadow-lg shadow-teal/10">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              Restricted AI Workspace
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Authentication required to access AgentRouter AI endpoint.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="chat-password"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2"
              >
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="chat-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Enter security key..."
                  className={`w-full pl-10 pr-12 py-3 bg-muted/40 dark:bg-muted/20 border ${
                    error
                      ? "border-red-500 text-red-500 focus:ring-red-500"
                      : "border-border focus:border-teal focus:ring-teal/30"
                  } rounded-xl text-sm font-mono placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2`}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="flex items-center space-x-2 text-xs font-mono text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3.5 px-4 bg-teal text-white dark:text-dark font-mono font-semibold rounded-xl hover:bg-teal/90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer badge */}
          <div className="mt-8 pt-4 border-t border-border/50 text-center flex items-center justify-center space-x-2 text-xs text-muted-foreground/80 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Powered by AgentRouter API</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
