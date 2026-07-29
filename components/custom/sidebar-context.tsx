"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMounted: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("preppilot_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    // Set mounted after a microtask to ensure hydration completes before animations enable
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  const handleSetCollapsed = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsed((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      localStorage.setItem("preppilot_sidebar_collapsed", String(next));
      return next;
    });
  };

  const toggleSidebar = () => {
    handleSetCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMounted,
        setIsCollapsed: handleSetCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isCollapsed: false,
      isMounted: true,
      setIsCollapsed: () => {},
      toggleSidebar: () => {},
    };
  }
  return context;
}
