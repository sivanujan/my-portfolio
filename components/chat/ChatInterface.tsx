"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image as ImageIcon,
  X,
  Bot,
  User,
  SlidersHorizontal,
  Trash2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Lock,
  Cpu,
  FileImage,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
  timestamp: string;
}

interface ChatInterfaceProps {
  onLock: () => void;
}

const DEFAULT_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3-5-sonnet",
  "claude-3-haiku",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "deepseek-chat",
  "llama-3.1-70b-instruct",
  "qwen-2.5-72b-instruct",
];

export default function ChatInterface({ onLock }: ChatInterfaceProps) {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [availableModels, setAvailableModels] = useState<string[]>(DEFAULT_MODELS);
  const [customModel, setCustomModel] = useState("");
  const [isCustomModelMode, setIsCustomModelMode] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Parameter drawer
  const [showSettings, setShowSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an intelligent, helpful AI assistant built into Sivanujan's Portfolio platform. Provide concise, expert responses."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [maxTokens, setMaxTokens] = useState<number | undefined>(undefined);

  // Status & UI
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch models from API on mount
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/chat/models");
        if (res.ok) {
          const data = await res.json();
          if (data?.data && Array.isArray(data.data)) {
            const fetchedList = data.data.map((m: any) => m.id || m.name).filter(Boolean);
            if (fetchedList.length > 0) {
              setAvailableModels(Array.from(new Set([...fetchedList, ...DEFAULT_MODELS])));
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch model list from API, using default list", err);
      }
    }
    fetchModels();
  }, []);

  // Handle Image File Selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, GIF)");
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAttachedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove attached image
  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const currentModel = isCustomModelMode ? customModel.trim() || "gpt-4o" : selectedModel;

    // Build payload content for message
    let messageContent: string | Array<any>;
    if (attachedImage) {
      const parts: Array<any> = [];
      if (input.trim()) {
        parts.push({ type: "text", text: input.trim() });
      }
      parts.push({
        type: "image_url",
        image_url: { url: attachedImage },
      });
      messageContent = parts;
    } else {
      messageContent = input.trim();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);

    // Prepare assistant placeholder message
    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      // Prepare payload for backend API endpoint
      const payloadMessages = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          model: currentModel,
          temperature,
          top_p: topP,
          max_tokens: maxTokens,
          system_prompt: systemPrompt,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Server error: ${response.status}`);
      }

      // Read SSE stream
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.replace("data: ", "");
              if (dataStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  accumulatedContent += delta;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId ? { ...msg, content: accumulatedContent } : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore parse errors for broken chunk pieces
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `⚠️ **Error:** ${err.message || "Failed to generate response. Please check your API key or model availability."}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Message Text
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear Chat
  const clearChat = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      setMessages([]);
    }
  };

  // Export Chat
  const exportChat = () => {
    const exportData = JSON.stringify(messages, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to extract plain text from content
  const getTextContent = (content: string | Array<any>): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");
    }
    return "";
  };

  // Helper to extract image URLs from content
  const getImageUrls = (content: string | Array<any>): string[] => {
    if (Array.isArray(content)) {
      return content
        .filter((item) => item.type === "image_url" && item.image_url?.url)
        .map((item) => item.image_url.url);
    }
    return [];
  };

  return (
    <div className="flex-grow flex flex-col max-w-6xl w-full mx-auto p-2 sm:p-4 lg:p-6 min-h-[85vh]">
      {/* Top Controls Header */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-4 mb-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Model Selector */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-teal/10 text-teal border border-teal/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Selected Model
            </label>
            {!isCustomModelMode ? (
              <div className="relative inline-block w-full sm:w-64">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomModelMode(true);
                    } else {
                      setSelectedModel(e.target.value);
                    }
                  }}
                  className="w-full appearance-none bg-muted/50 border border-border rounded-xl px-3 py-1.5 pr-8 text-xs font-mono text-foreground focus:outline-none focus:border-teal cursor-pointer"
                >
                  <optgroup label="Available Models">
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom">
                    <option value="custom">+ Enter Custom Model Name</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full sm:w-64">
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g. gpt-4-turbo"
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-1 text-xs font-mono text-foreground focus:outline-none focus:border-teal"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomModelMode(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 bg-muted rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 transition-all ${
              showSettings
                ? "bg-teal text-white dark:text-dark border-teal"
                : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Toggle Settings & System Prompt"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Parameters</span>
          </button>

          {messages.length > 0 && (
            <>
              <button
                onClick={exportChat}
                className="p-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-mono flex items-center space-x-1.5 transition-all"
                title="Export Conversation"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={clearChat}
                className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-mono flex items-center space-x-1.5 transition-all"
                title="Clear Messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={onLock}
            className="p-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-mono flex items-center space-x-1.5 transition-all"
            title="Lock Session"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* Settings Drawer (Collapsible) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-5 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-teal" />
                  <span>Model Hyperparameters & System Role</span>
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* System Prompt */}
                <div className="md:col-span-2">
                  <label className="block text-muted-foreground mb-1 font-semibold">
                    System Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Enter persona or system instructions..."
                    className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none focus:border-teal"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Temperature ({temperature})</span>
                    <span className="text-muted-foreground text-[10px]">Creativity</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-teal cursor-pointer"
                  />
                </div>

                {/* Top P */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Top P ({topP})</span>
                    <span className="text-muted-foreground text-[10px]">Nucleus Sampling</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-teal cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Display Window */}
      <div className="flex-grow flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[400px] max-h-[65vh]">
          {messages.length === 0 ? (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-teal/10 text-teal border border-teal/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold font-display text-foreground">
                AgentRouter AI Workspace
              </h2>
              <p className="text-xs font-mono max-w-sm mt-2 leading-relaxed">
                Start a conversation using model{" "}
                <span className="text-teal font-semibold">
                  {isCustomModelMode ? customModel || "custom" : selectedModel}
                </span>
                . Attach images or text to begin.
              </p>

              {/* Sample Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full mt-6">
                {[
                  "Explain quantum computing in simple terms",
                  "Write a Python script for algorithmic trading",
                  "Analyze this image and describe its key elements",
                  "Draft a clean Next.js 14 server component pattern",
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(sample);
                    }}
                    className="text-left text-xs font-mono p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-teal/50 transition-all text-muted-foreground hover:text-foreground"
                  >
                    &quot;{sample}&quot;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const textContent = getTextContent(msg.content);
              const imageUrls = getImageUrls(msg.content);
              const isUser = msg.role === "user";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-teal/10 border border-teal/30 text-teal flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm relative group ${
                      isUser
                        ? "bg-teal text-white dark:text-dark font-sans rounded-tr-none"
                        : "bg-muted/60 dark:bg-muted/30 border border-border/80 text-foreground rounded-tl-none font-mono text-xs sm:text-sm leading-relaxed"
                    }`}
                  >
                    {/* Render Uploaded Images if present */}
                    {imageUrls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {imageUrls.map((url, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-white/20">
                            <img
                              src={url}
                              alt="Uploaded attachment"
                              className="max-h-60 w-auto object-cover rounded-xl"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Text Content */}
                    {textContent ? (
                      <div className="whitespace-pre-wrap break-words">{textContent}</div>
                    ) : (
                      isLoading && !textContent && (
                        <div className="flex items-center space-x-1.5 text-muted-foreground py-1">
                          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-teal animate-pulse delay-150" />
                          <div className="w-2 h-2 rounded-full bg-teal animate-pulse delay-300" />
                        </div>
                      )
                    )}

                    {/* Message Meta & Action Bar */}
                    <div
                      className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] ${
                        isUser
                          ? "border-white/20 text-white/80 dark:text-dark/80"
                          : "border-border/40 text-muted-foreground"
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && textContent && (
                        <button
                          onClick={() => copyToClipboard(textContent, msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 hover:text-teal ml-2"
                          title="Copy content"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Attachment Preview Bar */}
        {attachedImage && (
          <div className="px-4 pt-3 pb-1 bg-muted/40 border-t border-border flex items-center space-x-3">
            <div className="relative group">
              <img
                src={attachedImage}
                alt="Attachment preview"
                className="w-14 h-14 object-cover rounded-lg border border-teal"
              />
              <button
                type="button"
                onClick={removeAttachedImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold flex items-center space-x-1">
                <FileImage className="w-3.5 h-3.5 text-teal" />
                <span>Image attached</span>
              </span>
              <p className="text-[10px]">Will be transmitted as multi-modal payload</p>
            </div>
          </div>
        )}

        {/* Input Form Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-border/80 bg-background/60 backdrop-blur-md"
        >
          <div className="flex items-center space-x-2">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="chat-image-input"
            />
            <label
              htmlFor="chat-image-input"
              className={`p-3 rounded-xl border border-border hover:border-teal bg-muted/40 hover:bg-muted text-muted-foreground hover:text-teal cursor-pointer transition-all ${
                attachedImage ? "border-teal text-teal bg-teal/10" : ""
              }`}
              title="Attach image file"
            >
              <ImageIcon className="w-5 h-5" />
            </label>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                attachedImage ? "Ask a question about this image..." : "Type your prompt here..."
              }
              className="flex-grow bg-muted/30 border border-border focus:border-teal rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !attachedImage)}
              className="p-3 rounded-xl bg-teal text-white dark:text-dark hover:bg-teal/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal/20"
              title="Send message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
