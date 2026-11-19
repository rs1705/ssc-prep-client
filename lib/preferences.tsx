"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { readStored, writeStored } from "@/lib/storage";
import { CONTENT_ZOOM, clampContentSize, DEFAULT_CONTENT_SIZE } from "@/lib/content-size";

/**
 * Per-device preferences (no account needed): sound and vibration in games,
 * reduced motion and text size. Saved in localStorage and applied to <html>.
 */
export interface Preferences {
  sound: boolean;
  haptics: boolean;
  /** "system" follows the OS setting. */
  reducedMotion: "system" | "on" | "off";
  textSize: "normal" | "large";
  /** Size step for question text in practice, PYQs and mock tests (see lib/content-size). */
  contentSize: number;
}

export const PREFS_KEY = "ssc:preferences";

export const DEFAULT_PREFERENCES: Preferences = {
  sound: true,
  haptics: true,
  reducedMotion: "system",
  textSize: "normal",
  contentSize: DEFAULT_CONTENT_SIZE,
};

/** Read the saved preferences anywhere (e.g. when a game plays a sound). */
export function readPreferences(): Preferences {
  const saved = { ...DEFAULT_PREFERENCES, ...readStored<Partial<Preferences>>(PREFS_KEY, {}) };
  return { ...saved, contentSize: clampContentSize(saved.contentSize) };
}

interface PreferencesContextValue {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  prefs: DEFAULT_PREFERENCES,
  update: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    setPrefs(readPreferences());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = prefs.textSize;
    if (prefs.reducedMotion === "on") root.dataset.reduceMotion = "on";
    else delete root.dataset.reduceMotion;
    root.style.setProperty("--content-zoom", String(CONTENT_ZOOM[clampContentSize(prefs.contentSize)]));
  }, [prefs.textSize, prefs.reducedMotion, prefs.contentSize]);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      writeStored(PREFS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ prefs, update }), [prefs, update]);
  const motion = prefs.reducedMotion === "on" ? "always" : prefs.reducedMotion === "off" ? "never" : "user";

  return (
    <PreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={motion}>{children}</MotionConfig>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
