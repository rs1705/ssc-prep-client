# PrepPilot Detailed Development Log

This file tracks the in-depth, step-by-step feature implementations and bug fixes added to PrepPilot. It is kept locally for reference and context.

---

## [Earlier Features] Bedrock Platform Foundation

### 🚀 Core Platform & Flashcards
- **Personalized Revision Sessions**: Integrated Leitner-based spaced repetition learning mode (FSRS) for flashcard study runs.
- **Freestyle Mode**: Coded practice limits (10, 20, 30 Qs) and customizable timers on sprint lobbies.
- **Advanced Flashcard Filters**: Filtering vocabulary and study sections by subject, exam type, year, and difficulty.
- **Bookmark & Search**: Enabled bookmarking key cards and searching terms with debounce indicators.
- **Auth & Services**: Integrated Firebase Authentication and RTK Query endpoints for endpoints communication, caching, and state sync.

---

## [2026-07-16] UI/UX Polish Pass & Spacing Audit

### 🗺️ Navigation & Layout Polish
- **Breadcrumbs Removal**: Added `hideBreadcrumbs` boolean option to `TopicPageLayout` props and applied it to all active practice sessions.
- **Responsive Header Height**: Compressed the sticky header navbar height to scale dynamically. Standardized mobile menu slide-out offset margins.

### ⏱️ Timer & Progress Bar Enhancement
- **Urgent Timer Warnings**: Implemented a reactive warning indicator state when the timed sprint timer falls below 10 seconds.
- **Micro-Animations & Alerts**: Added blinking warning icon, text pulse, and a pulsing rose/red gradient fill warning state to the progress timer bar to build urgency.

### ⚡ Practice Board & Score Hierarchy Restructure
- **Primary Score Elevation**: Restructured Row 1 of the game stats header to display the topic title and a highly prominent Score pill adjacent to it.
- **Secondary Metadata Grouping**: Organized secondary attributes (mode, difficulty, mode switcher) to Row 2, reducing vertical height.

---

## [2026-07-17] Design-System Refinement & Global Consistency

### 📏 Game Screen Standardization
- **Dynamic Card Base Height**: Standardized the main Mental Maths game card to a flexible `min-h-[580px]`, perfectly balancing the active game component heights while preventing abrupt layout jumps.
- **Balanced Interactive Elements**: Enlarged Numpad keys and MCQ buttons to provide tactile hit areas for mobile users.
- **Scorecard Message Variety**: Implemented a dynamic encouragement message system utilizing `useMemo` to pull from a pool of 80 unique messages.
- **Scorecard Layout Refinement**: Wrapped the Overview and Review Answer tabs along with their respective content panels into a unified, cleanly bordered container with a top header on the Game Over screen.

### 🎴 Flashcards & Touch Refinement
- **Flashcard Dimensions Upgrade**: Expanded the core Flashcard dimension arrays to `h-[440px] sm:h-[500px]` alongside matching `FlashcardDeck` wrapper min-heights.
- **Swipe Sensitivity Tuning**: Dramatically improved mobile swipe interactions by reducing the static drag-distance threshold from 80px to 40px and adding a responsive `velocityThreshold` check.

### 🪟 Unified Dialogs & Overlays
- **Premium Glass Dialog Overlay**: Upgraded shared `DialogOverlay` and `AlertDialogOverlay` component styles to default to a soft, modern backdrop blur (`backdrop-blur-xs`) and dark neutral overlay shading (`bg-black/40`).

---

## [2026-07-18] Mental Maths Expansion & Responsiveness Polish

### 🧠 Core Mental Math Engine Expansion
- **Any Difficulty Feature**: Implemented a new "Any" difficulty setting that independently generates multi-digit operands to test fluid mental agility (e.g., $ + $$$).
- **Subtraction & Multiplication Modules**: Implemented full generation logic, including "smart distractors" using dynamic arithmetic offsets to mimic common human error (off-by-1, off-by-10).
- **Division Module**: Utilized a reverse-engineering algorithm (generating `divisor` & `answer` first, then multiplying for the `numerator`) to guarantee that every division question resolves to a perfectly clean whole integer, completely eliminating messy decimals.
- **Addition Sprints Module**: Added `generateAdditionQuestion` supporting Easy (2-digit), Medium (3-digit), and Hard (4-digit) addition ranges.
- **Sliding Window Duplicate Prevention**: Implemented a sliding window queue (`recentQuestions`) in the state to track the last 5 generated question keys, completely eliminating back-to-back repeating questions.

### 🎉 Game Over Experience Enhancement
- **Dynamic Height Adaption**: Fixed the Game Over container screen clipping issue by transitioning from fixed bounds to an adaptive expansion, ensuring flexible space for dynamic text.
- **Flawless Victory Effects**: Integrated the lightweight `canvas-confetti` package. Constructed a localized, z-index-layered `<canvas>` overlay directly onto the scorecard bounds triggered exclusively upon a 100% accuracy score.
- **Accuracy Color Sync**: Synchronized the text coloring of the dynamic encouragement messages with the outer stroke ring of the circular gauge progress bar (`emerald`, `amber`, `rose`).
- **Speed Icons & Indexing**: Adjusted question list numbering from `Q1.` to `1)`, aligned badges on the same line, and added Lightning (⚡) and Turtle (🐢) icons based on <2s response times.

### 📱 Responsive Overhaul
- **Header Standardization**: Locked the global application navigation header height to exactly `h-14` (56px) across mobile and desktop. Adjusted the mobile slide-out sidebar menu to calculate its offsets perfectly, eliminating the previous layout jump issue on mobile screens.
- **Active Game Screen Spacing**: Fine-tuned typographic scale of the active question text down to `text-4xl` for large screens to reduce crowding. Pulled the primary question container upwards via top padding adjustments to give the number pad bottom breathing room.
- **Dashboard Feature Highlights**: Overhauled the top dashboard banner to feature a bulleted list outlining the newly released Addition, Subtraction, Multiplication, Division, and ANY modules.

---

## [2026-07-18] PostHog Analytics Integration

### 📊 Client-Side Analytics Setup
- **PostHog Provider**: Created a dedicated `PostHogProvider` client component (`components/posthog-provider.tsx`) that initialises the PostHog SDK inside a `useEffect` and wraps the app with `PostHogProvider` from `posthog-js/react`.
- **Root Layout Wiring**: Integrated the provider into `app/layout.tsx`, replacing the previously removed Vercel Analytics component.
- **Auto Page-Views**: Enabled `capture_pageview` and `capture_pageleave` for automatic route-change tracking and time-on-page metrics.
- **Env-Var Config**: Reads `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.local`. Gracefully warns in the console if the key is missing instead of crashing.

### 🎯 Custom Event Tracking
- **Mental Maths — Topic Selected**: Fires `mental_maths_topic_selected` with the `topic` id when a user navigates into a topic from the lobby.
- **Mental Maths — Session Started**: Fires `mental_maths_session_started` with `topic`, `difficulty`, `mode`, `timeLimit`, and `questionLimit` when a practice session begins.
- **Mental Maths — Answer Submitted**: Fires `mental_maths_answer_submitted` per question with `topic`, `difficulty`, `isCorrect`, `isSkipped`, and `timeTakenMs`.
- **Mental Maths — Session Completed**: Fires `mental_maths_session_completed` on game over with full performance stats: `score`, `accuracy`, `correctAnswers`, `wrongAnswers`, `skippedAnswers`, `totalQuestions`.
- **Flashcards — Session Started**: Fires `flashcard_session_started` with `mode` (freestyle/study) and `deckSize` when a deck of cards loads.
- **Flashcards — Card Rated**: Fires `flashcard_rated` with `rating` (AGAIN/HARD/GOOD/EASY), `ratingValue`, `mode`, and `cardId` on each FSRS action click.

---

## [2026-07-19] Phase 1 UI/UX Polish

### Premium UI Enhancements
- **Topic Cards**: Faded out 'Coming Soon' subject cards (reduced opacity, grayscale) and removed their pointer events to improve dashboard visual hierarchy.
- **Mental Math Settings Lobby**: Grouped the lobby configuration options (Difficulty, Mode, Limits, Input) into distinct, padded cards with numbered badges to reduce cognitive load.
- **Numpad Haptics**: Standardized input button layouts and added subtle active:scale-90 haptic animations. Enhanced visual feedback for Clear (Rose colored) and ? (Amber colored) keys.
- **Game Over Status Indicators**: Introduced Lucide icons (CheckCircle2, XCircle, MinusCircle) inside the Right, Wrong, and Skipped score boxes to improve scannability and accessibility.


## [2026-07-19] Phase 2 UI/UX Polish

### Input Consistency & Flashcards
- **Standardized Inputs**: Aligned the MCQ button styles with the Numpad, utilizing identical active:scale-90 haptic interactions and standardizing border radius + background highlighting to create cohesive play modes.
- **Flashcard Interaction Cues**: Added a pulsing 'Tap to reveal' hint with an accompanying touch icon. Implemented localStorage state (hasFlippedFlashcard) to automatically hide this hint on future views once the user understands the mechanic, reducing visual clutter.
- **Visual Hierarchy Check**: Balanced typographic scales during active timed sprints. Slightly reduced active Question font sizes while bumping the Timer/Progress text size to improve readability without sacrificing layout.
- **Session Review Refactoring**: Compressed the game-over Review list padding, shifted typography to a tighter footprint, and relocated the raw response time (e.g., '1.2s') into an explicit badge adjacent to the right/wrong state, significantly enhancing rapid scannability.

## [2026-07-19] Phase 3 Nocturnal Focus Theme (Black & Gold)

### Premium Dark Aesthetic
- **Color Palette Overhaul**: Completely replaced global primary colors from Indigo to a custom Oklch Gold (`--gold`). Restyled background bases to deep charcoal (`--night`) with slightly elevated surfaces (`--surface`).
- **Three-Font Typography System**: Introduced `Inter` for standard UI, `JetBrains Mono` for scores/timers, and mapped `Plus Jakarta Sans` as the display typeface.
- **Restyled Visual Components**:
  - Remapped global button styles from blue-indigo gradients to a solid premium gold background (`bg-primary`).
  - Adapted the site Logo (Rocket) to the new monochromatic text and solid gold background.
  - Re-colored focus states, hover glow borders, and progress bars to emit the signature nocturnal gold accent.

## [2026-07-20] Unified Practice Dashboard

### Architectural Refactor
- **Centralized Subject Data**: Extracted all subject sections (Maths, English, GK, Reasoning) from hardcoded arrays into a reusable `SUBJECT_SECTIONS` export in `lib/subject-data.tsx` to ensure DRY architecture.
- **Unified Practice Hub**: Created a new root `/practice` page serving as a master syllabus dashboard, rendering scrollable subject rows using the centralized data.
- **Sidebar Update**: Re-routed the 'Practice' link in the main Sidebar from defaulting to `/SSC/maths` directly to the new unified `/practice` dashboard.
- **Dashboard Load Polish**: Swapped the hyper-bouncy load-in animations on the Dashboard subjects for a much more premium, subtle `duration-700 fade-in` sweep.

## [2026-07-19] Phase 4 UI Consistency & Clean Up

### Refined Aesthetics
- **Shadow Clean Up**: Removed heavily saturated `rgba` drop shadows from primary buttons and cards across the dashboard and subject pages to ensure a cohesive color profile tied strictly to the theme's `bg-primary` variable.
- **Animation Standardization**: Replaced custom hover shadows on active subject cards with the subtle lift animation (`hover:-translate-y-0.5`) utilized in the global dashboard design, reducing visual clutter and standardizing interaction feedback.
- **Navbar Button Semantics**: Harmonized the Topbar buttons (Hamburger, Home, Night Mode Toggle, and User Avatar) to a strict `h-10 w-10` circular semantic size. Realigned the 'Sign In' and 'Sign Up' CTAs to lock perfectly onto the exact same `h-10` horizontal axis, creating a flawlessly straight and aligned navigational rail.

### Architectural Blueprint (Upcoming)
- **Database Migration Decision**: Officially finalized the decision to migrate from MongoDB to **PostgreSQL**. The relational structure, ACID compliance, and advanced aggregation capabilities (critical for gamified stats, streaks, and heatmaps) make Postgres the superior enterprise-grade choice for the SSC Prep app.
- **Backend Framework**: Transitioning from Express to **NestJS** to enforce strict service-oriented architecture.
- **PYQ Data Pipeline**: Outlined a master plan to build a semi-automated ETL pipeline using Python (Raw Text Extraction) -> LLMs (JSON Structuring) -> Next.js Admin Panel (Rapid Review) to securely inject highly structured Previous Year Questions directly into PostgreSQL.

### Colour Scheme Restoration
- **Root Cause**: The `--primary` CSS variable in `globals.css` had been changed from `#2563EB` (blue-600) to `oklch(0.78 0.16 85)` (warm gold), causing all `bg-primary`, `from-primary`, `text-primary`, `border-primary`, and `ring` utilities to render gold/amber instead of the original blue.
- **Fix**: Restored the entire `:root` and `.dark` colour palettes from the previous commit (`1c4a265`), including all semantic tokens (`--background`, `--card`, `--secondary`, `--muted`, `--border`, `--accent`, sidebar vars, chart vars).
- **Theme Toggle**: Switched from the "Nocturnal Focus" scheme (`:root` = dark, `.light` = light) back to the standard convention (`:root` = light, `.dark` = dark) which aligns with `next-themes` class-based toggling.
- **Gradient Classes**: All `bg-gradient-to-r from-primary to-indigo-600` usages across buttons, progress bars, and cards now render the correct blue gradient.

## 2026-07-19 - Premium Theme Overhaul: Sapphire & Teal

**Goal:** Overhaul the app's visual identity to match premium, trustworthy, and modern competitors (Testbook, Oliveboard, Unacademy) without altering any layout structures.

**Key Changes:**
- **Palette Implementation:** Implemented a new sophisticated 3-colour system across the entire application:
  - **Deep Sapphire (#1a237e)**: Used as the foundational primary colour for trust and authority.
  - **Electric Teal (#00bfa5)**: Used as a modern, high-contrast accent colour.
  - **Warm Coral (#ff6d3f)**: Used sparingly for urgency, energy, and action elements.
- **CSS Variables:** Completely rewrote :root and .dark blocks in globals.css.
- **Gradient Standardization:** Replaced all hardcoded to-indigo-600 utility classes with to-accent.
- **Shadow Overhauls:** Updated hardcoded rgba box-shadows to match new primary and coral values.
- **Component Polish:** Dashboard, TopicCard, Logo, and Dialogs updated to use proper semantic classes.

**Outcome:** The app now features a highly cohesive, professional, and visually engaging design system that feels premium in both Light and Dark modes.

## 2026-07-19 - Premium Theme Overhaul 2.0: Midnight Obsidian & Amber Gold

**Goal:** Pivot from the safe 'Sapphire & Teal' to a highly distinct, premium SaaS aesthetic (Midnight Obsidian & Amber Gold) to guarantee a noticeable, high-end overhaul.

**Key Changes:**
- **Palette Implementation:** Adopted a stark, high-contrast 3-colour system:
  - **Midnight Obsidian (#09090b)**: Used as the primary brand colour for extreme contrast.
  - **Amber Gold (#f59e0b)**: Used as the vibrant accent for CTAs and highlights.
  - **Alabaster & Zinc**: Used for ultra-clean backgrounds and borders.
- **Gradient Overhaul:** Replaced all blue/teal gradients with solid Obsidian for primary actions, and Amber-to-Orange gradients for highlight CTAs (e.g., the Resume card, Explore button).
- **Shadow Standardization:** Replaced all legacy RGBA blue shadows with new Zinc and Amber glows.

**Outcome:** The application now features a striking, high-end design language that completely differentiates it from generic edtech competitors, achieving the requested 'complete overhaul'.

## 2026-07-19 - UI Polish: Button Uniformity, Responsive Layout & Mobile Sidebar

**Issues Fixed:**
- **Revise Button:** Was ghost variant with white text on white card (invisible). Changed to outline variant with proper foreground text.
- **Ghost/Outline Button Hovers:** hover:bg-accent (amber) on ghost/outline buttons looked jarring. Changed to hover:bg-muted for subtle neutral hovers.
- **Section Card Icons:** indigo theme mapped to bg-primary/10 (Obsidian = near-invisible). Switched to amber accent for vibrant visibility.
- **Stats Badge:** bg-accent/20 (amber tint) on emerald-themed cards looked inconsistent. Changed to bg-muted.
- **Dashboard Responsive Grids:** Subjects grid (grid-cols-2 lg:grid-cols-4) and Quick Actions (md:grid-cols-3) were too cramped at medium widths with sidebar. Bumped to xl:grid-cols-4 and lg:grid-cols-3.
- **Mobile Sidebar:** Added Sheet-based hamburger menu in topbar (visible < md) that mirrors desktop sidebar nav.
- **Revision Dialog:** Fixed amber accent hovers on accordion headers and row items to use neutral muted.
- **Sidebar Logo Shadow:** Removed legacy sapphire rgba glow.

## [2026-07-20] Layout, Routing and Grid Refactoring
- **Layout Consistency**: Refactored app/SSC/maths/page.tsx and app/SSC/english/page.tsx to use the standardized TopicPageLayout and SectionCardGrid.
- **Responsive Auto Sizing**: Switched SectionCardGrid to use grid-cols-[repeat(auto-fit,minmax(280px,1fr))] instead of hardcoded md:grid-cols-2 to allow fluid responsive scaling.
- **Removed Layout Bugs**: Eliminated redundant nested grid wrappers inside SectionCard.
- **Colors Standardization**: Removed hardcoded amber-orange tailwind gradients from SectionCard buttons. Hooked them up with global bg-primary and bg-secondary theme colors.
- **Routing Fixed**: Wired up active routes in Maths (Formula Practice, Practice, Mock Test) and English (Hangman).

- **Standardized Icons**: Stripped hardcoded tailwind text/fill classes and unified dimensions to w-5 h-5 for the icons on GK and Reasoning pages to correctly inherit the generic section-card wrapper colors.

- **App Layout Centering**: Updated RootLayout to use a constrained width (w-[85%] on lg, w-[75%] on 2xl) with mx-auto to center the sidebar and main content, leaving 10-15% margins on large screens as requested.

- **Layout Width Tweaks**: Removed the outer shadows and borders from the main app wrapper. Increased the base width on md/lg/xl breakpoints for a slightly wider, flatter layout.

- **Squishing Fixes**: Replaced brittle lg:grid-cols-3 and flex-wrap layouts in Dashboard and Speed Math with grid-cols-[repeat(auto-fit,minmax(...,1fr))] to ensure buttons and content never overlap or compress.
- **Micro-Animations**: Added group-hover transform to ArrowRight on SectionCards for a subtle interactive nudge.
- **Global Loading Stagger**: Extracted TopicCard's cascading slide-up animation and applied it to Dashboard cards and all SectionCards globally.

- **Vertical Monitor Optimizations**: Adjusted TopicPageLayout default max-widths for Mental Maths by passing contentMaxWidthClass='w-full' to prevent artificial narrowness and allow multi-column rendering. Restructured Dashboard per user request: Subjects locked to 2x2 grid, Recent Sessions moved to left column under Subjects, and Quick Actions shifted to right column in a vertical stack.

- **Dashboard UI Refinement**: Adjusted the bottom row to lg:grid-cols-[1fr_300px] so Recent Sessions commands more width. Grouped Quick Actions into a unified, matching height card container with smaller typography (text-sm) and icons (w-8) for a balanced visual hierarchy.

- **Grid Layout Ratio**: Updated the bottom Dashboard row to an explicit 80-20 ratio (lg:grid-cols-[4fr_1fr]) to maximize the width of Recent Sessions.

- **Grid Layout Ratio**: Updated the bottom Dashboard row to 60-40 (lg:grid-cols-[3fr_2fr]) for a more balanced split between Recent Sessions and Quick Actions.

- **Responsive Architecture**: Engineered a dual-render layout for the dashboard. On 'xl' screens, Subjects map to a 4-col grid, Recent Sessions floats right, and Quick Actions renders as 3 separate horizontal cards. On 'lg' screens and below, it seamlessly falls back to the 2x2 Subjects grid with the 60-40 split bottom section.

## System-Wide Design & Theming Refactor
- **Global Theming**: Implemented strict color mapping (emerald, amber, violet, rose) cascading to all SVGs across the Maths, Reasoning, English, and GK routes.
- **Layout Polishes**: Realigned TopicPageLayout headers to match Dashboard alignment and removed artificial width constraints for a seamless transition between dashboard and subpages.
- **Hover Physics**: Abstracted scale-110 rotate-3 hover animations to SectionCard and page.tsx SVGs.
- **404 Page**: Created custom fallback app/not-found.tsx matching premium styling.

## UI Unification & Component Polish
- **Topic vs Subject Uniformity**: Extensively refactored `TopicCard.tsx` and `SectionCard.tsx` to ensure complete structural parity. Both card components now share the exact same responsive icon placement (w-12 h-12 circular center-top), padding (p-8), and typography hierarchy (text-xl titles, text-sm descriptions) across all nested subpages.
- **Grid Normalization**: Standardized internal topic grids (like Mental Maths) to mirror Subject grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
- **Rogue Layout Extermination**: Identified and deleted hidden `layout.tsx` files nested inside `/maths` and `/english` directories that were injecting massive horizontal margins (`xl:mx-44`), which artificially squished the content and caused the spacing discrepancy.
- **Error State Layout**: Enforced a `fixed inset-0 z-50` overlay on the `404 not-found.tsx` screen to properly hide the sidebar and top navigation for a true fullscreen empty state.
- **Dashboard Load Polish**: Swapped the hyper-bouncy load-in animations on the Dashboard subjects for a much more premium, subtle `duration-700 fade-in` sweep.

### July 20, 2026
- Updated ComingSoon component with framer-motion animations for a better user experience on unreleased pages.
- Standardized ComingSoon component usage across all unreleased pages (analytics, mock tests, maths practice, etc.).

- Disabled unreleased sections across all subjects in subject-data.tsx by setting links to # and text to COMING SOON, showcasing the power of data-driven component rendering.

- Fixed animation cascade issue on the dashboard where inner elements of Recent Sessions and Quick Actions were animating individually instead of their container block.

- Redesigned the Practice Hub (`/practice`) to use a sleek Tabbed navigation interface (`Tabs` from Radix UI), replacing the old vertical scroll layout. Introduced themed subject banners and staggered `framer-motion` animations for seamless context switching.

- Overhauled the Mental Maths active game screens (Idle, Countdown, Active, Game Over) to map perfectly to the premium Midnight Obsidian & Amber Gold theme. Upgraded primary CTA buttons to vibrant Amber gradients and added smooth `framer-motion` spring animations across layout states.
- Fixed an issue where the mobile tab navigation on the Practice Hub still showed a scrollbar by registering a global `.scrollbar-none` CSS utility.
- Refined Primary CTA typography across Mental Maths modules to flawlessly match the display aesthetic (uppercase, bold, tracking-widest, text-[10px]) used globally on Topic and Section cards.
- **Dynamic Countdown Experience**: Integrated a pool of short, motivational messages that randomly fade in beneath the 3-second countdown to keep users engaged and focused.
- **Monospace Typographic Audit**: Extensively deployed `font-mono` across the Mental Maths engine to elevate the technical, high-speed aesthetic. Applied monospace tracking to idle limit buttons, countdown timers, the active question display, numpad keys, and game-over scorecard metrics.

## [2026-07-21] App Shell Architecture & Global Typography Polish

### Navigation & App Shell
- **App Layout Refactoring**: Transitioned to a cohesive App Shell architecture with a centralized Sidebar and Topbar framework.
- **Sticky Glassmorphism Topbar**: Locked the Topbar to the viewport top (sticky top-0 z-50) and applied a premium translucent background (backdrop-blur-md bg-background/80), ensuring vital navigation remains accessible during scroll.
- **Brand Identity Unification**: Standardized the PrepPilot logo using the 'Amber Gold' gradient Rocket icon universally across the Sidebar, Mobile Drawer, and About page.
- **Support Links Integration**: Added missing global routes for "Sign In", "Sign Up", "Feedback", and "About" directly into the desktop sidebar and mobile navigation drawer.

### UI & Component Polish
- **CTA Button Overhaul**: Upgraded major Call-To-Action buttons (Auth forms, Feedback submit) to match the punchy premium aesthetic: uppercase tracking-widest font-extrabold text-[11px] paired with amber-to-orange gradient backgrounds and smooth hover:-translate-y-0.5 active:scale-[0.97] interactions.
- **Contextual Form Icons**: Injected descriptive Lucide icons (LogIn, UserPlus, Send) into form submission CTAs to improve visual clarity and interaction feedback.
- **Theme Button Consistency**: Updated standard button.tsx variants to cleanly leverage standard semantic CSS variables (bg-primary, bg-muted) rather than hardcoded indigo tones.
- **Type Safety**: Cleaned up obsolete definitions from lib/types.ts resulting from the TopicPageLayout abstraction to ensure a clean TypeScript build.

### Tablet & iPad Fluidity Optimization Pass
- **Tablet Responsive Heights**: Replaced rigid fixed height classes (`sm:h-[690px]` in Mental Maths, `sm:min-h-[500px]` in Flashcards) with viewport-responsive fluid height bounds (`h-[min(480px,50dvh)]` and `max-h-[min(650px,calc(100dvh-95px))]`).
- **Eliminated iPad Landscape Scrolling**: Scaled down game containers dynamically on iPad / tablet landscape viewports (~700px-810px height) so flashcard decks, mental maths, and game screens fit 100% on-screen without vertical scrollbars or forcing orientation switches.
- **Compact Auth Form Architecture**: Optimized Sign In and Sign Up form containers to `max-w-[460px]`, scaled down input heights from `h-14` to `h-11`/`h-12`, and reduced card padding to `p-4 sm:p-6 md:p-8`, resolving form bloat on tablets.
- **Tightened Focus-Mode Layout Padding**: Reduced focus-mode padding in `app-layout.tsx` from `md:p-8` (64px) to `p-3 sm:p-4 md:p-6` (48px) to maximize usable vertical height for game screens.
- **Top Alignment for Auth Cards**: Swapped `justify-center` with `min-h-[calc(100dvh-...)]` for top-aligned `justify-start pt-3 sm:pt-6 md:pt-8` on Sign In and Sign Up pages to completely eliminate the massive dead space gap above the forms on tall tablet/desktop viewports.
- **Collapsible Desktop Sidebar & Dedicated PanelLeft Toggle**: Created `SidebarProvider` context and integrated a dedicated `PanelLeftClose` / `PanelLeftOpen` toggle button in the Sidebar header. When collapsed, the sidebar transitions smoothly to a slim icon-only rail (`w-[72px]`) with hover tooltips and a compact Exam D-Day indicator, persisting user preference in `localStorage`.
- **Unified Large Screen Centering & Consistent Page Widths**: Encapsulated the main content area and TopBar within a unified `max-w-7xl mx-auto` layout container inside `app-layout.tsx`. Removed conflicting page-level max-width classes, guaranteeing 100% pixel-perfect width parity and symmetrical auto-centering across Dashboard, Practice Hub, Subject pages, Subsections, and TopBar on large and ultra-wide screens whether the sidebar is expanded or collapsed.
- **Scrollbar Elimination Pass**: Removed `scrollbar-gutter: stable;` from `globals.css` and added `.scrollbar-none` to `sidebar.tsx`, `mental-maths/[topic]/page.tsx` lobby and scorecard panels, and `freestyle/page.tsx` sheets. Replaced artificial container height caps with fluid `sm:min-h-[580px]` bounds so Mental Maths setup cards fit completely on-screen on Windows/Chrome without rendering native OS scrollbars with arrows.
- **Mental Maths Card Auto-Wrap on Desktop**: Changed Mental Maths lobby setup card container from fixed flex height to `sm:flex-none sm:h-auto` so the white card border wraps its setup options tightly on medium and large screens without stretching vertically or generating blank internal dead space.
- **Flashcard Deck Height & Button Overlap Fix**: Removed `50dvh` viewport height constraint from `FlashcardDeck.tsx` wrapper and restored solid responsive card container bounds (`min-h-[420px] sm:min-h-[460px] md:min-h-[480px]`). FSRS action buttons (`AGAIN`, `HARD`, `GOOD`, `EASY`) now sit cleanly below the card with zero clipping or visual overlap.
- **Flashcard Mobile Margin & Container Parity**: Standardized both Freestyle and FSRS study modes to leverage `TopicPageLayout`'s `contentMaxWidthClass="w-full max-w-[500px]"`, `rounded-3xl` header control cards, and uniform `mb-2 sm:mb-3` spacing, creating 100% margin and structural parity with the Mental Maths game screens on mobile.
- **Unified Flashcard Element Width & Gutter Alignment**: Removed redundant inner `px-3` padding inside `fsrs/page.tsx` and `freestyle/page.tsx`. `<main>`'s focus-mode `p-3` (12px) now serves as the single source of truth for mobile outer margins, giving Flashcards the exact same sleek 12px edge margin as Mental Maths game screens with zero double-padding dead space.
- **Dynamic Viewport Height-Based Top Margin for Mobile Ergonomics**: Added height-based media query top margins (`mt-0 [@media(min-height:720px)]:mt-4 [@media(min-height:780px)]:mt-8 [@media(min-height:840px)]:mt-12`) to `fsrs/page.tsx` and `freestyle/page.tsx`. On short mobile viewports (<720px), zero top margin prevents vertical scrolling, while on taller mobile devices (780px-840px+), the flashcard deck smoothly shifts downward into comfortable thumb-reach range.
- **Focus-Mode Desktop & Tablet Slim Rail Integration**: Updated `app-layout.tsx` and `sidebar.tsx` to render the slim icon-only rail (`w-[72px]`) during focus-mode routes (Flashcards, Mental Maths drills, Hangman) on `md:` screens and above. Solved the empty/isolated desktop layout look while keeping navigation 1-click accessible without obstructing mobile screens.
- **Focus-Mode Non-Shifting Slide-Over Sidebar Expansion**: Configured the sidebar in focus mode so that clicking the `PanelLeft` expand button opens the full sidebar as a floating `fixed z-50 shadow-2xl` overlay panel. The outer layout space allocated to the sidebar remains locked at `md:w-[72px]`, ensuring the main flashcard / game screen stays 100% stationary and centered without shifting to the right when the sidebar is stretched open.
- **Buttery Smooth Sidebar Transitions & DOM Crossfades**: Overhauled `sidebar.tsx` layout transitions to completely eliminate snapping and layout jumps. Replaced `fixed`/`sticky` toggling with an always-`absolute` sidebar inside a `relative` layout wrapper. Swapped conditional DOM unmounting (`!isCollapsed && <span>`) with pure CSS transitions (`max-w-0 opacity-0 overflow-hidden` to `max-w-[200px] opacity-100`), ensuring nav links, logos, and the Exam D-Day widget expand and crossfade beautifully without jank.
- **Mobile Focus Mode Quick-Navigation Dock**: Created a floating `MobileFocusDock` (`components/custom/mobile-focus-dock.tsx`) that renders exclusively on mobile devices (`flex md:hidden`) during focus mode. 
- **Responsive Dock Height Ergonomics**: Engineered the Mobile Focus Dock with viewport-height-aware CSS media queries (`[@media(min-height:720px)]`). On tall phones (≥720px), the dock acts as a floating overlay (`fixed bottom-6 z-50`). On shorter viewports (e.g., older phones or landscape mode), it smoothly drops into natural document flow (`relative mt-auto`), guaranteeing it will **never** overlap or block the flashcard rating buttons or game UI.
- **Unified Mental Maths Exit Navigation**: Removed the redundant "Back" buttons from the Mental Maths setup and game-over screens. Implemented a single, universal `X` (Close) button in the top-right corner of the main card wrapper that persists across all states (idle, playing, game over). This strictly enforces Hick's Law, leaving the "Start Practice" and "Practice Again" buttons as the solitary primary CTAs while maintaining a consistent mental model for exiting the game.

## [2026-07-22] SSC CGL Math Modules & Mix Blitz

### 🧮 Math Engine Expansion
- **Simplification Generator**: Built `generateSimplificationQuestion` to test fundamental and advanced BODMAS, including bracket precedence (`easy`, `medium`, `hard` configurations).
- **Percentages Generator**: Developed `generatePercentageQuestion` incorporating fractional equivalents (e.g., $16.66\\% = 1/6$) critical for SSC CGL speed maths, alongside "Find the Base" reversed-percentage calculations.
- **Ratios Generator**: Implemented `generateRatioQuestion` covering missing proportion terms (`A:B :: C:X`), dividing total amounts into parts, and combined ratios (`A:B:C`).
- **Mix Blitz Integration**: Crafted a master `generateMixedBlitzQuestion` orchestrator that randomly calls upon Addition, Subtraction, Multiplication, Division, Squares, Cubes, Simplification, Percentages, and Ratios.

### 🎮 Conditional UI Logic & Configuration
- **Lobby Refinement**: Updated `MentalMathsPractice` component to dynamically hide the "Select Difficulty" and "Practice Mode" (Freestyle/Timed) cards exclusively when `topic === 'mixed'`.
- **Forced State Management**: Added a strict `useEffect` to `app/SSC/maths/mental-maths/[topic]/page.tsx` that forces the core engine into `timed` mode specifically for the Mixed topic, bypassing local storage artifacts.
- **Enhanced Visual Cues**: Updated `getDifficultyDescription` and `renderTopicIcon` to fully support the new Simplification, Percentages, Ratios, and Mixed modules with dedicated SVGs and difficulty tier breakdowns.

---

## [2026-07-25] Math Engine Architectural Blueprint: Templates, Normalization & SSC Percentages

### 📐 Architectural Alignment & Mentorship Session
- **Problem Statement**: Generating arbitrary nested brackets (`()`, `[]`, `{}`) and advanced suffix/prefix/multi-word operators (`²`, `³`, `√`, `∛`, `% of`) in a while-loop creates unpredictable division-by-zero or fractional decimal leftovers, while modifying the Shunting Yard parser in `mathParser.ts` introduces arity and associativity bugs.
- **Solution 1 — Separation of Concerns (Display vs. Engine)**: Decoupled presentation from evaluation by introducing `MathTerm = { display: string, value: number }`. When generating equations, `displayEquation` formats rich symbols for the UI, while `engineEquation` substitutes precomputed integer `.value`s and standard round brackets for `buildAST(tokenize(engineEquation))`.
- **Solution 2 — The Template Pattern (Archetypes)**: Adopted pre-defined structural skeletons for Simplification:
  - **Medium Templates**: `(A op1 B) op2 C²`, `A op1 (B² op2 C)`, `(A op1 B) * (C op2 D)`. Clean division inside brackets is guaranteed by generating the divisor first and computing the dividend as a clean multiple.
  - **Hard Templates**: `[ A op1 { B op2 (C op3 D) } ] op4 E`, `P% of [ (A op1 B) op2 C² ]`.
- **Solution 3 — Normalization Pipeline**: Implemented a regex pre-processing step before AST tokenization: `engineEquation = displayEquation.replace(/\[|\{/g, '(').replace(/\]|\}/g, ')')`, allowing the existing Shunting Yard algorithm to process complex nested SSC bracket styles seamlessly.
- **Solution 4 — SSC Government Exam Percentage Lookup Table**: Built an `SSC_PERCENTAGES` array mapping standard govt exam fractions ($10\% = 1/10$, $12.5\% = 1/8$, $16.66\% = 1/6$, $20\% = 1/5$, $25\% = 1/4$, $33.33\% = 1/3$, $37.5\% = 3/8$, $50\% = 1/2$, $66.66\% = 2/3$, $75\% = 3/4$) with an integer multiplier property (`mult`). To generate `P% of N` without decimals, $N$ is generated as a clean multiple of `mult`.

### ⏸️ Environment Migration & Next Steps on Resumption
- **Dual-Boot Migration**: Session paused as the user is installing Ubuntu in dual boot to resolve Windows OS stability and RAM consumption bottlenecks.
- **Resumption Checklist**:
  1. Verify workspace initialization on Ubuntu.
  2. Implement `MathTerm`, `SSC_PERCENTAGES`, `generateComplexTerm()`, and `generateSSCPercentageTerm()` in `lib/mathGenerator.ts`.
  3. Wire up the Medium and Hard templates in `generateSimplificationQuestion()` and implement `generatePercentageQuestion()`.

---

## [2026-08-14] Game Screen Viewport Height Architecture & Zero-Scroll Ergonomics

### 🎯 Core Architecture Principle: Fit in Visible Vertical Space without Cramping
- **Rule Definition**: All active game and practice screens (`/SSC/maths/mental-maths/[topic]`, `/SSC/english/flashcards/fsrs`, `/SSC/english/flashcards/freestyle`, `/SSC/english/hangman`) MUST fit 100% within the visible vertical screen height (`100dvh` minus navigation bars and padding) so that the user never needs to scroll vertically during gameplay, while simultaneously maintaining **generous, expansive, comfortable** component heights, touch targets, and typography across mobile, medium (tablets/laptops), and large desktop monitors.

### 🧩 Layout Container & Focus Mode Spacing Refinement
- **Focus Mode Main Container (`app-layout.tsx`)**: Refined focus mode padding to `px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 items-center justify-center min-h-0 overflow-hidden`. This recovers over 24px of dead vertical space on standard laptop screens (e.g., 1280x800, 1366x768) without causing layout shift.
- **Dynamic TopicPageLayout Bottom Margin (`TopicPageLayout.tsx`)**: Dynamically omitted `pb-3` when `hideBreadcrumbs` is active (`${hideBreadcrumbs ? 'pb-0' : 'pb-3'}`) to ensure game cards are vertically centered with zero off-screen push.

### ⚡ Mental Maths Speed Drill (`app/SSC/maths/mental-maths/[topic]/page.tsx`)
- **Eliminated Rigid Artificial Height Caps**: Replaced `containerHeightClass = "w-full min-h-[40vh] lg:min-h-[50vh]"` with dynamic responsive state-driven classes:
  - **Lobby Setup Screen (`idle`)**: A spacious `max-w-xl` card (`p-4 sm:p-6 md:p-7`) with `h-10 sm:h-11 md:h-12` difficulty buttons, `h-11 sm:h-12 md:h-13` practice mode buttons, `h-14 sm:h-16 md:h-18` dual-stack input layout cards (MCQs / Numpad), and `h-12 sm:h-13 md:h-14` 3D gradient launch CTA. Total height ~480px–520px fits cleanly on any screen without vertical scroll.
  - **Active Practice Board (`active`)**: Flex-growing container (`flex-1 justify-between min-h-[480px] sm:min-h-[520px] md:min-h-[560px] max-h-[calc(100dvh-4.5rem)] md:max-h-[calc(100dvh-5.5rem)]`).
  - **Question Display Box**: Fluidly scales (`min-h-[110px] sm:min-h-[130px] md:min-h-[150px] max-h-[190px]`) with responsive typography (`text-3xl sm:text-4xl md:text-5xl font-black font-mono`).
  - **Tactile Keypad Grid**: Balanced button heights (`h-10 sm:h-12 md:h-13.5`) and answer input bar (`h-10 sm:h-11 md:h-12`), providing ample touch areas and large `text-xl sm:text-2xl` numerals.
  - **MCQ 3D Options**: `h-18 sm:h-21 md:h-24` option cards with bold A/B/C/D badges and large fonts, leaving the skip button visible without scrolling.

### 🎴 Flashcards & Spaced Repetition (`Flashcard.tsx`, `FlashcardDeck.tsx`, `fsrs/page.tsx`, `freestyle/page.tsx`)
- **Coordinated Height System**: Unified the 3D perspective wrapper in `FlashcardDeck.tsx` with `Flashcard.tsx` to `h-[380px] min-[375px]:h-[420px] min-[414px]:h-[440px] sm:h-[450px] md:h-[470px]`.
- **Card Front Typography**: Scaled main word to `text-3xl min-[375px]:text-4xl sm:text-5xl font-black`, pronunciation to `text-xs sm:text-base`, and badges to `text-[10px] sm:text-xs`.
- **Card Back Typography & Sub-card Spacing**: Definition (`text-sm sm:text-base md:text-lg font-bold`), Synonyms & Antonyms subcards (`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl`, items `px-2 sm:px-2.5 py-0.5 sm:py-1`), and Example sentence subcard (`p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl`).
- **Rating Action Bar (`Again`, `Hard`, `Good`, `Easy`)**: `h-12 sm:h-14 mt-2 sm:mt-3` with `py-2.5 sm:py-3.5` tactile 3D buttons, positioned comfortably within visible space below the deck.

### 🔤 Hangman Vocabulary Sprint (`app/SSC/english/hangman/page.tsx`)
- **Zero-Scroll Viewport Layout**: Replaced cramped heights with fluid `max-w-sm sm:max-w-md md:max-w-[480px] mx-auto flex flex-col justify-between pt-1.5 sm:pt-3 pb-2 sm:pb-4`.
- **Enlarged Letter Tiles & Definition**: Word tiles (`w-8 h-10 sm:w-10 sm:h-12 md:w-11 md:h-13 text-base sm:text-lg md:text-xl font-mono font-black`), definition hint card (`p-3 sm:p-4 text-xs sm:text-sm md:text-base font-semibold`), and virtual keyboard keys (`max-w-[34px] sm:max-w-[42px] h-9 sm:h-11 md:h-12`).

---

## 🎮 Game Screen Width Harmonization & Ergonomic Focus Pass
- **Width Reduction Across Medium/Large Viewports**: Replaced stretched `max-w-3xl` (768px) and `max-w-2xl` containers with a unified, compact, focused arcade constraint (`max-w-sm sm:max-w-md md:max-w-[480px] lg:max-w-[500px]`) across all 4 game screens:
  - **Speed Math Drill (`/SSC/maths/mental-maths/[topic]`)**: Reduced from `max-w-3xl` to `max-w-[480px] / md:max-w-[500px]`, bringing numpads, MCQ options, and question cards into tight, comfortable focus without horizontal over-expansion on desktop/laptop screens.
  - **Scorecard Layout**: Streamlined the results view from a crowded two-column split into full-width dedicated Overview (gauge, stats, pacing chart) and Review (question list) tab panels.
  - **FSRS & Freestyle Flashcards (`/SSC/english/flashcards/fsrs`, `freestyle`)**: Bounded to `max-w-sm sm:max-w-md md:max-w-[480px]`.
  - **Hangman Sprint (`/SSC/english/hangman`)**: Standardized to `max-w-sm sm:max-w-md md:max-w-[480px]`.

---

## 🎨 2px Card Border Standardization, Mastery Progress & Refined Hover System
- **2px Card Border Framing (`border-2 border-border/60`)**: Upgraded card borders across the Dashboard, `TopicCard.tsx`, and `SectionCard.tsx` from hairline 1px to a crisp 2px border structure.
- **Mastery Progression in Dashboard Subjects**: Added the dedicated "Mastery" segment with percentage indicators and gradient progress bars across the 4 subject command center tiles.
- **Refined Subtle Hover Color Fills**: Replaced legacy neon blur glow blobs with gentle, theme-colored fills and borders (`hover:bg-[theme]/[0.03] hover:border-[theme]/50`) across Dashboard subject tiles, SectionCard hubs, and TopicCard grids.
- **Nested Progress Bar Container**: Today's Target / Quest card now encloses the animated gradient progress bar in its own bordered pill container (`bg-muted/70 border border-border/50 p-0.5`).
