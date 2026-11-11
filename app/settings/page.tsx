"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Music, Smartphone, Sun, Type, Waves } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { playFeedback } from "@/features/games/feedback";
import { usePreferences, type Preferences } from "@/lib/preferences";

function Row({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Sun;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-border bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0 sm:pl-4">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-xl border-2 border-border bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-9 flex-1 rounded-lg px-3 text-sm font-bold transition-colors ${
            value === o.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors ${
        checked ? "border-brand-600 bg-brand-500" : "border-border bg-muted"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { prefs, update } = usePreferences();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const set = <K extends keyof Preferences>(key: K) => (value: Preferences[K]) => update({ [key]: value } as Partial<Preferences>);

  return (
    <TopicPageLayout
      title="Settings"
      description="Saved on this device. They don't need an account."
      contentMaxWidthClass="w-full max-w-2xl"
    >
      <div className="flex w-full flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="section-label px-1">Appearance</h2>
          <div className="surface-card divide-y-2 divide-border overflow-hidden rounded-2xl">
            <Row icon={Monitor} title="Theme" description="Light, dark, or follow your device.">
              {mounted && (
                <Segmented
                  label="Theme"
                  value={(theme as "light" | "dark" | "system") ?? "system"}
                  options={[
                    { id: "light", label: "Light" },
                    { id: "dark", label: "Dark" },
                    { id: "system", label: "Auto" },
                  ]}
                  onChange={setTheme}
                />
              )}
            </Row>
            <Row icon={Type} title="Text size" description="Make all text a little larger.">
              <Segmented
                label="Text size"
                value={prefs.textSize}
                options={[
                  { id: "normal", label: "Normal" },
                  { id: "large", label: "Large" },
                ]}
                onChange={set("textSize")}
              />
            </Row>
            <Row icon={Waves} title="Motion" description="Turn off animations, or follow your device setting.">
              <Segmented
                label="Motion"
                value={prefs.reducedMotion}
                options={[
                  { id: "off", label: "Full" },
                  { id: "on", label: "Reduced" },
                  { id: "system", label: "Auto" },
                ]}
                onChange={set("reducedMotion")}
              />
            </Row>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="section-label px-1">Games and drills</h2>
          <div className="surface-card divide-y-2 divide-border overflow-hidden rounded-2xl">
            <Row icon={Music} title="Sounds" description="A soft chime for right answers and a low tone for wrong ones.">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => playFeedback("correct")}
                  className="text-sm font-bold text-brand-700 hover:underline disabled:opacity-40 dark:text-brand-300"
                  disabled={!prefs.sound}
                >
                  Test sound
                </button>
                <Toggle label="Sounds" checked={prefs.sound} onChange={set("sound")} />
              </div>
            </Row>
            <Row icon={Smartphone} title="Vibration" description="A short buzz on answers (phones that support it).">
              <Toggle label="Vibration" checked={prefs.haptics} onChange={set("haptics")} />
            </Row>
          </div>
        </section>
      </div>
    </TopicPageLayout>
  );
}
