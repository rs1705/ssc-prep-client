# EptSsc Production Design System & Engineering Architecture

**Version**: 2.0.0  
**Status**: Authoritative Standard  
**Maintainer**: Senior Principal Design & Frontend Architecture  
**Target Platform**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion  

---

## Table of Contents
1. [Executive Summary & Core Tenets](#1-executive-summary--core-tenets)
2. [Token Architecture & CSS Custom Properties](#2-token-architecture--css-custom-properties)
3. [Color Science & Domain Semantics](#3-color-science--domain-semantics)
4. [Typography & Micro-Layout System](#4-typography--micro-layout-system)
5. [Spatial Grid & Responsive Breakpoints](#5-spatial-grid--responsive-breakpoints)
6. [Surface, Border, & Elevation Physics](#6-surface-border--elevation-physics)
7. [Iconography & Action Hierarchy](#7-iconography--action-hierarchy)
8. [Core Component Anatomy & Code Blueprints](#8-core-component-anatomy--code-blueprints)
   - 8.1 [ProgressBar Component](#81-progressbar-component)
   - 8.2 [Button & CTA Matrix](#82-button--cta-matrix)
   - 8.3 [Card Architecture (TopicCard, SectionCard)](#83-card-architecture)
   - 8.4 [Navigation & Header Infrastructure](#84-navigation--header-infrastructure)
   - 8.5 [Dialogs, Modals, & Overlays](#85-dialogs-modals--overlays)
9. [Motion, Physics, & Micro-Interactions](#9-motion-physics--micro-interactions)
10. [Performance, Hardware Acceleration, & Viewport Rules](#10-performance-hardware-acceleration--viewport-rules)
11. [Accessibility (WCAG 2.1 AAA/AA) & Ergonomics](#11-accessibility-wcag-21-aaaaa--ergonomics)
12. [Anti-Patterns & Architectural Hard Rules](#12-anti-patterns--architectural-hard-rules)

---

## 1. Executive Summary & Core Tenets

The **EptSsc (Elite Prep Training)** interface is designed for competitive exam aspirants (SSC CGL, CHSL, CPO, MTS, GD) where cognitive speed, visual clarity, and mental focus directly dictate success. 

Every design decision stems from three foundational tenets:

1. **Grounded Tactile Structure over Ephemeral Float**: 
   Standard SaaS applications rely on fuzzy drop shadows to delineate cards from the canvas. EptSsc rejects this in favor of crisp, tactile `border-2` architectural outlines. Cards are integral sections of the workspace, not detached widgets floating in space.
2. **Cognitive Ergonomics & Zero Mark-Bleed Latency**:
   The human eye must parse stats, timers, question stems, and action triggers in milliseconds. High-frequency metrics use tabular monospace figures (`Geist Mono`) to prevent layout jitter, while qualitative content uses clean sans-serif typography (`Geist Sans`).
3. **Hardware-Tuned Responsiveness**:
   Low-end mobile devices common in the aspirant demographic must run drills at a locked 60fps. Intensive glassmorphic shaders (`backdrop-blur`) are selectively throttled on mobile viewports to protect GPU fill-rate, while active drills maintain a strict **Zero-Scroll Viewport Architecture**.

---

## 2. Token Architecture & CSS Custom Properties

The design token system is configured via CSS Custom Properties in `app/globals.css`, supporting automatic dark/light mode switching without hydration mismatch.

```css
@layer base {
  :root {
    --radius: 12px;

    /* EptSsc Elite — Light Mode (Obsidian & Gold) */
    --background: #fafafa;
    --foreground: #09090b;
    --card: #ffffff;
    --card-foreground: #09090b;
    --popover: #ffffff;
    --popover-foreground: #09090b;
    --primary: #09090b;
    --primary-foreground: #ffffff;
    --secondary: #f4f4f5;
    --secondary-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --accent: #f59e0b;
    --accent-foreground: #ffffff;
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --success: #10b981;
    --success-foreground: #ffffff;
    --border: #e4e4e7;
    --input: #e4e4e7;
    --ring: #09090b;

    --sidebar: #fafafa;
    --sidebar-foreground: #09090b;
    --sidebar-primary: #09090b;
    --sidebar-primary-foreground: #ffffff;
    --sidebar-accent: #f4f4f5;
    --sidebar-accent-foreground: #09090b;
    --sidebar-border: #e4e4e7;
    --sidebar-ring: #09090b;
  }

  .dark {
    /* EptSsc Elite — Dark Mode (Obsidian & Gold) */
    --background: #18181b;
    --foreground: #fafafa;
    --card: #27272a;
    --card-foreground: #fafafa;
    --popover: #27272a;
    --popover-foreground: #fafafa;
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --secondary: #27272a;
    --secondary-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --accent: #f59e0b;
    --accent-foreground: #18181b;
    --destructive: #7f1d1d;
    --destructive-foreground: #fca5a5;
    --success: #064e3b;
    --success-foreground: #6ee7b7;
    --border: #3f3f46;
    --input: #3f3f46;
    --ring: #d4d4d8;

    --sidebar: #18181b;
    --sidebar-foreground: #fafafa;
    --sidebar-primary: #fafafa;
    --sidebar-primary-foreground: #18181b;
    --sidebar-accent: #27272a;
    --sidebar-accent-foreground: #fafafa;
    --sidebar-border: #3f3f46;
    --sidebar-ring: #d4d4d8;
  }
}
```

---

## 3. Color Science & Domain Semantics

Color in EptSsc is functional, semantic, and domain-mapped. It primes the user’s cognitive focus before they read textual prompts.

### 3.1 Base Palette Tokens
- **Background**: `#fafafa` (Light) / `#18181b` (Dark) — Deep Obsidian canvas.
- **Card Surface**: `#ffffff` (Light) / `#27272a` (Dark) — High-contrast structural plane.
- **Border**: `#e4e4e7` (Light) / `#3f3f46` (Dark) — Structural 2px container anchor.
- **Muted Fill**: `#f4f4f5` (Light) / `#27272a` (Dark) — Recessed progress tracks and inactive chips.

### 3.2 Subject Domain Palette
Each subject track possesses an exclusive primary-to-secondary gradient and telemetry glow:

| Subject Track | Primary Accent | Accent Gradient | Chip / Badge Classes | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Mathematics / Quant** | Amber Gold | `from-amber-500 via-orange-500 to-amber-600` | `bg-amber-500/10 text-amber-500 border-amber-500/20` | Speed calculation, mental arithmetic, arithmetic sprints |
| **English / Verbal** | Sky Blue | `from-sky-400 via-blue-500 to-indigo-600` | `bg-sky-500/10 text-sky-500 border-sky-500/20` | Vocab flashcards, grammar rules, idioms, comprehension |
| **General Knowledge** | Emerald Green | `from-emerald-400 via-teal-500 to-emerald-600` | `bg-emerald-500/10 text-emerald-500 border-emerald-500/20` | Active recall, polity articles, history timelines, static facts |
| **Reasoning / Logic** | Rose Quartz | `from-rose-400 via-pink-500 to-rose-600` | `bg-rose-500/10 text-rose-500 border-rose-500/20` | Pattern recognition, syllogisms, series, spatial puzzles |

### 3.3 Status & Telemetry Indicators
- **Success / Authenticated**: `#10b981` (`emerald-500`) — Valid answers, completed streaks, authenticated questions.
- **Warning / Time Critical**: `#f59e0b` (`amber-500`) — Timer countdown under 5s, D-Day milestones.
- **Destructive / Error**: `#ef4444` (`rose-500`) — Missed questions, marks deducted, destructive resets.
- **Telemetry Pulse**: `<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />` — Live server telemetry, authenticated sync.

---

## 4. Typography & Micro-Layout System

Typography pairs **Geist Sans** (high-legibility variable grotesque sans) with **Geist Mono** (fixed-width tabular figures).

### 4.1 Type Hierarchy Scale

| Token / Level | Tailwind Classes | Tracking / Case | Target UI Element |
| :--- | :--- | :--- | :--- |
| **Hero Display** | `text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black` | `tracking-tight leading-[1.1]` | Landing headline, celebration score display |
| **Screen Title** | `text-2xl sm:text-3xl md:text-4xl font-extrabold` | `tracking-tight text-foreground` | Dashboard greeting, Subject Hub headers |
| **Module / Card Title** | `text-lg sm:text-xl font-bold` | `tracking-tight text-foreground` | Topic card titles, modal headers |
| **Section Subhead** | `text-sm sm:text-base font-semibold` | `tracking-normal text-foreground/80` | Section descriptors, dialog summaries |
| **Body Standard** | `text-xs sm:text-sm font-medium` | `leading-relaxed text-muted-foreground` | Explanations, instructions, metadata descriptions |
| **Telemetry Metric** | `text-xl sm:text-2xl font-black font-mono` | `tracking-tight text-amber-500` | XP values, countdowns, streaks, question counts |
| **HUD Eyebrow** | `text-[10px] font-mono font-bold` | `tracking-widest uppercase text-muted-foreground` | "EXAM D-DAY", "XP EARNED", "QUANT ENGINE" |
| **Micro Badge / Pill** | `text-[9px] font-mono font-bold` | `tracking-wider uppercase` | "TIER 1", "AIR RANK", "PRO", "+25 XP" |

### 4.2 Numerical Formatting Rule (Tabular Lining)
All numbers in timers, counters, scores, and XP progress MUST use `font-mono`. This prevents layout jitter as numbers change width dynamically during rapid solving.

---

## 5. Spatial Grid & Responsive Breakpoints

EptSsc is built on a **4px geometric grid** ($4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px$).

### 5.1 Container Width Targets
- **Public Landing Page**: `max-w-7xl mx-auto px-4 sm:px-6`
- **Application Dashboard & Modules**: `max-w-[1400px] mx-auto`
- **Dedicated Topic Pages**: `max-w-[1280px] mx-auto`
- **Auth & Onboarding Shells**: `max-w-[460px] mx-auto`
- **Modal / Dialog Sheets**: `max-w-lg` (512px) or `max-w-2xl` (672px)

### 5.2 Breakpoint Matrix
- **`sm` (640px)**: Compact tablets & landscape phones.
- **`md` (768px)**: **Primary Layout Split**: Sidebar switches from slide-over drawer to fixed left navigation bar; TopBar switches from sticky mobile header to static flow.
- **`lg` (1024px)**: 3-column bento grids, dual-column revision splits.
- **`xl` (1280px)**: Expanded analytics HUD, full subject overview grids.

### 5.3 Universal Below-TopBar Spacing Standard
Every page rendered within `<AppLayout>` adheres to a single responsive vertical rhythm directly below the TopBar:
- **Mobile (`< 640px`)**: `pt-4 px-4` (16px top buffer between TopBar border and first element: Hero Header / Breadcrumbs).
- **Tablet (`sm:` 640px - 768px)**: `sm:pt-6 sm:px-6` (24px top buffer).
- **Desktop (`md:` 768px - 1024px, `lg:` 1024px+)**: `md:pt-8 md:px-8` (32px top buffer).
- **Practice / Focus Mode**: `pt-2 sm:pt-3 md:pt-4` (compact buffer adhering to the 100dvh Zero-Scroll guarantee).

---

## 6. Surface, Border, & Elevation Physics

### 6.1 The Universal `border-2` Standard
Every distinct surface in EptSsc uses **`border-2`** (2px solid border). 

```
┌────────────────────────────────────────────────────────┐
│  Surface Card (border-2 border-border/60)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Nested Tool Block (border-2 border-border/40)     │  │
│  │ ┌──────────────────────────────────────────────┐ │  │
│  │ │ Accent Pill (border-2 border-amber-500/25)   │ │  │
│  │ └──────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Primary Cards**: `border-2 border-border/60`
- **Nested Inner Containers**: `border-2 border-border/40`
- **Active / Focused Elements**: `border-2 border-amber-500/25` (light) / `border-amber-500/40` (dark)
- **Dividers & Footers**: `border-t-2 border-border/40`
- **Ghost Action Tools**: `border-2 border-border/50`

### 6.2 Corner Radii Mathematical Scale
- **`rounded-3xl` (24px)**: Outer module cards (`TopicCard`, `SectionCard`, Hero blocks).
- **`rounded-2xl` (16px)**: Sub-cards, dialog containers, session rows, quick-action tiles.
- **`rounded-xl` (12px)**: Interactive action buttons, secondary tools, input fields.
- **`rounded-full` (9999px)**: Logo icon container, progress bars, status badges, HUD pills, primary CTAs.

### 6.3 Elevation & Shadow Hierarchy

| Elevation Level | Elevation Target | Tailwind Specification | Rationale |
| :--- | :--- | :--- | :--- |
| **Level 0: Canvas** | Background plane | `bg-background` (`shadow-none`) | Ground level. |
| **Level 1: Resting Surface**| Cards, Tiles, Panels | `bg-card border-2 border-border/60 shadow-none` | Grounded. Separation achieved via borders and whitespace. |
| **Level 2: Interactive Lift**| Card Hover State | `hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1` | Signals interactive tactile responsiveness. |
| **Level 3: Action Anchor**| Primary CTA Buttons | `shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30` | Lifts primary conversion actions into immediate focus. |
| **Level 4: Elevated Overlays**| Modals, Dropdowns, Sheets| `shadow-2xl border-2 border-border/50 bg-card/95 backdrop-blur-xl` | Floating layers above the canvas. |
| **Level 5: Tactile Inset**| Icon containers, Switches | `shadow-inner ring-1 ring-border/40` | Embossed hardware feel. |

---

## 7. Iconography & Action Hierarchy

Icons are sourced exclusively from `lucide-react` with standardized stroke weights.

### 7.1 Stroke Weights
- **Default / Decorative Icons**: `strokeWidth={1.75}`
- **Active / Interactive Indicators**: `strokeWidth={2.25}`
- **Bold HUD Glyphs / Streaks**: `strokeWidth={2.5}`

### 7.2 Button Icon Placement Philosophy

```tsx
/* LEADING ICON: Action Type / Verb Descriptor */
<Button className="...">
  <Swords className="w-3.5 h-3.5" />
  <span>Practice</span>
</Button>

/* TRAILING ICON: Directional Movement / Navigation */
<Link href="/practice" className="...">
  <span>Start Drill</span>
  <ArrowRight className="w-3.5 h-3.5" />
</Link>
```

- **Leading Icon (Left)**: Describes *what action is being performed* (`[⚔️ Practice]`, `[📖 Revise]`, `[🔍 Search]`, `[⚡ Speed Math]`).
- **Trailing Icon (Right)**: Describes *forward navigation into a sub-route* (`[Start Drill →]`, `[Enter App →]`, `[View Report →]`).

### 7.3 Logo Mark Standard
```tsx
<Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group cursor-pointer">
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
    <Rocket className="w-5 h-5" />
  </div>
  <div className="font-bold text-2xl tracking-tight">
    <span className="text-foreground font-extrabold">Ept</span>
    <span className="text-orange-500 font-extrabold">Ssc</span>
  </div>
</Link>
```

---

## 8. Core Component Anatomy & Code Blueprints

### 8.1 `<ProgressBar />` Component
Located at [`components/custom/ProgressBar.tsx`](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/ProgressBar.tsx).

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  barClassName?: string;
  children?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  barClassName,
  children,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("relative w-full h-3.5 bg-muted/70 rounded-full overflow-hidden border-2 border-border/50 p-0.5 z-10", className)}>
      <div
        className={cn(
          "h-full bg-primary transition-all duration-300 ease-out rounded-full",
          barClassName
        )}
        style={{ width: `${clampedValue}%` }}
      />
      {children}
    </div>
  );
};
```

#### Size Variants:
- **Standard Hero / Drill Target**: `className="h-3.5 mb-3.5"` (with default `p-0.5`).
- **Sub-module / Telemetry Metric**: `className="h-1.5 p-0"`.

---

### 8.2 Button & CTA Matrix

#### Primary Action Capsule (Gradient CTA):
```tsx
<Link
  href="/practice"
  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-mono font-bold tracking-wider uppercase px-5 py-2.5 rounded-full shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all duration-200 cursor-pointer border-0"
>
  <span>Start Drill</span>
  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
</Link>
```

#### Secondary Ghost Tool Button:
```tsx
<Button
  variant="ghost"
  className="px-3 py-1.5 h-8 rounded-xl text-xs font-mono font-bold tracking-wider uppercase gap-1 text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted border-2 border-border/50 active:scale-95 transition-all cursor-pointer"
>
  <BookOpen className="w-3.5 h-3.5" />
  <span>Revise</span>
</Button>
```

#### Circular Topbar Icon Button:
```tsx
<button
  aria-label="Toggle Theme"
  className="w-10 h-10 rounded-full border-2 border-border/40 bg-card/70 backdrop-blur-md flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
>
  <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
</button>
```

---

### 8.3 Card Architecture (`TopicCard`, `SectionCard`)

All content cards follow an established 3-row anatomical structure:

```tsx
<div className="group relative rounded-3xl bg-card/60 backdrop-blur-xl border-2 border-border/60 hover:border-amber-500/30 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
  {/* Row 1: Header (Icon Badge + Subject Tag + Status Chip) */}
  <div className="flex items-center justify-between mb-4">
    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
      <Zap className="w-5 h-5" />
    </div>
    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-muted/60 px-2.5 py-1 rounded-full border-2 border-border/40 text-muted-foreground">
      Quant
    </span>
  </div>

  {/* Row 2: Content (Title + Description + Metrics) */}
  <div>
    <h3 className="text-lg font-bold tracking-tight text-foreground mb-1.5 group-hover:text-amber-500 transition-colors">
      Percentage Shortcuts
    </h3>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-4">
      Instant fractional conversion and rapid successive percentage calculations.
    </p>
  </div>

  {/* Row 3: Action Toolbar (Separated by border-t-2) */}
  <div className="flex items-center justify-between pt-3.5 border-t-2 border-border/40 mt-auto gap-2">
    <div className="text-[10px] font-mono font-bold text-muted-foreground">
      Avg. 8.4s / Q
    </div>
    <div className="flex items-center gap-2">
      <Button className="px-3.5 py-1.5 h-8 rounded-xl text-xs font-mono font-bold tracking-wider uppercase gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-95 transition-all border-0 cursor-pointer">
        <Swords className="w-3.5 h-3.5" />
        <span>Practice</span>
      </Button>
    </div>
  </div>
</div>
```

---

### 8.4 Navigation & Header Infrastructure

Located at [`components/custom/app-layout.tsx`](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/app-layout.tsx).

- **Universal App TopBar**: TopBar is `sticky top-0 z-30 w-full bg-background/95 border-b-2 border-border/20 md:backdrop-blur-xl shrink-0`.
- **Drawer Auto-Close**: Every `<Link>` inside `<SheetContent>` MUST trigger `onClick={() => setMobileOpen(false)}`.

---

## 9. Motion, Physics, & Micro-Interactions

Motion is purposeful, snappy, and hardware-accelerated. Never use floaty, sluggish animations that delay drill interactions.

### 9.1 Physics Constants (Framer Motion)
```ts
export const SNAPPY_SPRING = { 
  type: "spring", 
  stiffness: 400, 
  damping: 25 
};

export const SNAPPY_EASE = [0.2, 0.8, 0.2, 1];
```

### 9.2 Transition Durations
- **Color & Border Shifts**: `duration-150`
- **Card Hover Elevation & Lift**: `duration-300 ease-out`
- **Progress Bar Value Interpolation**: `duration-300 ease-out`
- **Sidebar Width Collapse**: `duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]`

---

## 10. Performance, Hardware Acceleration, & Viewport Rules

### 10.1 Mobile GPU Throttling Rule
Heavy `backdrop-filter: blur()` calculations kill battery and drop frames on budget Android devices. The design system enforces global CSS throttling in `app/globals.css`:

```css
@media (max-width: 768px) {
  .backdrop-blur-2xl,
  .backdrop-blur-xl,
  .backdrop-blur-lg {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}
```
*Rule: On mobile, components automatically fall back to opaque/semi-opaque solid surfaces (`bg-card/95` or `bg-background/95`).*

### 10.2 Zero-Scroll Practice Screen Rule
Active drill interfaces (`/SSC/maths/mental-maths/[topic]`, `/SSC/english/flashcards/fsrs`, `/SSC/english/hangman`) MUST lock to `100dvh` without any vertical window scrolling. All question text, interactive keypads, telemetry timers, and submit buttons must fit within the visible viewport.

---

## 11. Accessibility (WCAG 2.1 AAA/AA) & Ergonomics

1. **Touch Target Size**: Every interactive control MUST provide at least a 40px × 40px clickable hit area (`w-10 h-10` on mobile icon buttons, `min-h-[44px]` on full rows).
2. **Accessible Contrast Ratios**:
   - Amber text on dark zinc: `#f59e0b` on `#18181b` yields **8.4:1 contrast** (exceeds WCAG AAA).
   - Primary foreground text on card: `#09090b` on `#ffffff` / `#fafafa` on `#27272a` yields **15+:1 contrast**.
3. **Keyboard Navigation & Focus**:
   - All interactive triggers declare explicit `focus-visible:ring-2 focus-visible:ring-amber-500/50`.
4. **Screen Reader Labels**:
   - Icon-only buttons must declare explicit `aria-label` (e.g. `aria-label="Toggle theme"`).

---

## 12. Anti-Patterns & Architectural Hard Rules

| ❌ NEVER DO | ✅ ALWAYS DO INSTEAD | Rationale |
| :--- | :--- | :--- |
| Adding `shadow-sm`, `shadow-md`, or `shadow-lg` to resting cards. | Use `border-2 border-border/60` with clean whitespace. | Prevents generic floating SaaS aesthetic; preserves grounded hierarchy. |
| Using arbitrary 1px borders (`border`, `border-t`, `border-b`). | Use uniform `border-2` (`border-2`, `border-t-2`, `border-b-2`). | Maintains consistent physical weight and structural rhythm. |
| Superimposing 1px gradient shine lines along card edges. | Rely on the uniform 2px boundary. | Prevents asymmetric rendering artifacts and fake glassmorphism tropes. |
| Forgetting `onClick={() => setMobileOpen(false)}` on drawer links. | Attach auto-close handler to every mobile navigation `<Link>`. | Prevents navigation drawer from getting stuck open over target screens. |
| Using non-monospaced fonts for scores, counters, or timers. | Use `font-mono font-bold` for all numeric metrics. | Prevents layout reflow and text jitter during rapid counting/drills. |
| Using `p-1` (8px total) inside progress bar container. | Use `p-0.5` (4px total) so inner bar retains substantial height. | Eliminates hairline sliver bugs on progress bars. |
