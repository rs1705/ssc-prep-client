"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readStored, writeStored } from "@/lib/storage";
import { WIDE_SCREEN_PX, pageKind, sidebarCollapsed, type SidebarChoice } from "@/lib/sidebar-mode";

interface SidebarContextType {
  isCollapsed: boolean;
  isMounted: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/** The learner's sidebar choices, one for focus pages and one for the rest (lib/sidebar-mode). */
const CHOICE_KEY = "eptssc_sidebar_choice";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [choice, setChoice] = useState<SidebarChoice>({});
  const [width, setWidth] = useState<number>(WIDE_SCREEN_PX);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Read the saved choice and the screen width once mounted (both are browser-only), then
  // follow the width across the 1280px line as the window is resized.
  useEffect(() => {
    setChoice(readStored<SidebarChoice>(CHOICE_KEY, {}));
    const wide = window.matchMedia(`(min-width: ${WIDE_SCREEN_PX}px)`);
    const update = () => setWidth(window.innerWidth);
    update();
    wide.addEventListener("change", update);
    // Enable the slide animation only after the first correct layout, so loading a page
    // never shows the sidebar sliding into place.
    requestAnimationFrame(() => setIsMounted(true));
    return () => {
      wide.removeEventListener("change", update);
    };
  }, []);

  const isCollapsed = sidebarCollapsed({ path: pathname, width, choice });

  // The button records a choice for the kind of page it was pressed on.
  const setIsCollapsed = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(isCollapsed) : value;
      setChoice((prev) => {
        const updated = { ...prev, [pageKind(pathname)]: next };
        writeStored(CHOICE_KEY, updated);
        return updated;
      });
    },
    [isCollapsed, pathname],
  );

  const toggleSidebar = useCallback(() => setIsCollapsed((prev) => !prev), [setIsCollapsed]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMounted, setIsCollapsed, toggleSidebar }}>
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
