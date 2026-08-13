"use client";

import React, { useState, useEffect } from "react";
import PasswordGate from "@/components/chat/PasswordGate";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage on mount
    const auth = sessionStorage.getItem("chat_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("chat_authenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem("chat_authenticated");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    // Loading splash state while checking session
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-6">
      {!isAuthenticated ? (
        <PasswordGate onSuccess={handleUnlock} />
      ) : (
        <ChatInterface onLock={handleLock} />
      )}
    </div>
  );
}
