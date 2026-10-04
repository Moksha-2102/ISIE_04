"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopCommandBar } from "./TopCommandBar";
import { CommandPalette } from "../command/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  scopeBadge?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  pageTitle,
  scopeBadge,
}) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-isie-bg-deep text-isie-text-primary overflow-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Right Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Command Bar */}
        <TopCommandBar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          title={pageTitle}
          scopeBadge={scopeBadge}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto scrollbar-thin relative flex flex-col min-h-0">
          {children}
        </main>
      </div>

      {/* Interactive Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
