"use client";

import { readPreferences } from "@/lib/preferences";

/**
 * Answer feedback for games: a short synthesized tone (no audio files) and a
 * tiny vibration on phones. Both respect the Settings page.
 */

let audio: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audio ??= new Ctor();
  if (audio.state === "suspended") void audio.resume();
  return audio;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number) {
  const ctx = context();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export type FeedbackKind = "correct" | "wrong" | "finish";

export function playFeedback(kind: FeedbackKind) {
  const prefs = readPreferences();
  if (prefs.sound) {
    try {
      if (kind === "correct") {
        tone(660, 0, 0.12, "sine", 0.12);
        tone(990, 0.07, 0.16, "sine", 0.1);
      } else if (kind === "wrong") {
        tone(220, 0, 0.18, "triangle", 0.12);
        tone(165, 0.08, 0.2, "triangle", 0.1);
      } else {
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.18, "sine", 0.1));
      }
    } catch {
      // Audio can be blocked until the first user gesture; that's fine.
    }
  }
  if (prefs.haptics && typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(kind === "wrong" ? [40, 40, 40] : kind === "finish" ? [30, 60, 30] : 25);
  }
}
