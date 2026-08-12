# PrepPilot Frontend — Comprehensive Review

## Screenshots

````carousel
![Practice page — Mathematics tab with sidebar and section cards](C:/Users/Home/.gemini/antigravity-ide/brain/9dddca2f-909f-4af7-a224-9bd0bba56064/practice_page_1786474237813.png)
<!-- slide -->
![Sign-in page — Clean centered form with Google OAuth](C:/Users/Home/.gemini/antigravity-ide/brain/9dddca2f-909f-4af7-a224-9bd0bba56064/signin_page_1786474256414.png)
<!-- slide -->
![About page — Focus, Practice, Achieve pillars](C:/Users/Home/.gemini/antigravity-ide/brain/9dddca2f-909f-4af7-a224-9bd0bba56064/about_page_1786474266437.png)
<!-- slide -->
![Feedback page — Roadmap expanded with updated feature names](C:/Users/Home/.gemini/antigravity-ide/brain/9dddca2f-909f-4af7-a224-9bd0bba56064/feedback_page_roadmap_1786474285332.png)
````

---

## 🟢 THE GOODS

### 1. Exceptional Visual Design & Polish
The UI is genuinely premium. This is **not** a typical student project — the dark mode, glassmorphism, ambient background blobs, shimmer gradients, and micro-animations (framer-motion) on the landing page are at a SaaS-marketing-site level of polish. The "Obsidian & Gold" color system with `oklch`-based tokens is a mature design decision.

### 2. Strong Design System Foundation
- Proper CSS custom properties with light/dark mode via `:root` / `.dark`
- Tailwind `@theme inline` integration for semantic color tokens (`--color-primary`, `--color-muted-foreground`, etc.)
- Consistent border radius system (`--radius-sm` through `--radius-4xl`)
- Curated typography stack: Inter + JetBrains Mono + Plus Jakarta Sans
- Custom utilities like `.shine-sweep`, `.scrollbar-none`, and `@keyframes shimmer` show attention to detail

### 3. Solid Architecture Choices
- **Next.js 16 with Turbopack** — cutting edge, fast DX
- **App Router** with proper layouts, nested routes (`/SSC/maths/mental-maths/[topic]`)
- **Feature-based folder structure** (`features/flashcards`, `features/hangman`) alongside route-based pages
- **Redux Toolkit + RTK Query** for server state (flashcard API), local state (filters, sessions)
- **Firebase Auth** with a clean context-based pattern and `ProtectedRoute` wrapper
- **PostHog** analytics already integrated — shows production-mindedness

### 4. Smart UX Patterns
- **View Transition API** for theme switching (the radial clip-path animation) — very few apps do this
- **Sidebar with focus mode** that auto-collapses during game routes (mental maths, hangman) — thoughtful
- **Exam D-Day countdown** in sidebar — motivating for SSC aspirants
- **Animated counters** on the landing page using `useMotionValue` — smooth, performant
- **Staggered scroll-reveal animations** with `whileInView` — professional touch
- **Coming Soon states** that don't break the UI — cards still look good with disabled buttons

### 5. Good Component Reuse
- `TopicPageLayout` for consistent page scaffolding with breadcrumbs
- `SectionCard` / `SectionCardGrid` for subject module tiles
- `ComingSoon` component for placeholder pages
- `ErrorState`, `Loader`, `LoadingOverlay` — proper loading/error state handling
- `InfoDialog`, `RevisionDialog`, `ProUpgradeModal` — feature-specific modals

### 6. Competitor Positioning Section
The "Legacy Apps vs PrepPilot" comparison on the landing page is a strong marketing move. It's well-designed with red/green color coding and builds trust with aspirants who've been burned by cluttered Indian edtech apps.

### 7. Landing Page Content Strategy
The copy is **SSC-specific and credible** — it mentions specific exams (CGL, CHSL, CPO, MTS, GD), uses exam jargon ("shifts", "bleed topics", "selection"), and the pricing at ₹99/month positions it well for the target audience.

---

## 🔴 THE BADS

### 1. `page.tsx` is 806 Lines — Monolith Landing Page

> [!WARNING]
> [page.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/app/page.tsx) is a single 806-line file containing the hero, stats, dashboard preview, competitor comparison, how-it-works timeline, features grid, pricing section, and footer.

This is fragile and hard to maintain. Each section should be its own component in `components/landing/` or `features/landing/`.

### 2. `header.tsx` is 962 Lines — The Largest Component

> [!WARNING]
> [header.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/header.tsx) at **962 lines** and **51KB** is by far the largest file. It contains the entire desktop mega-menu, mobile navigation, subject dropdowns, and auth state handling in one file.

This should be split into `DesktopNav`, `MobileNav`, `SubjectMegaMenu`, `UserMenu` etc.

### 3. Duplicated Theme Toggle Logic
The `toggleTheme` function (with the View Transition API clip-path animation) is **copy-pasted identically** in:
- [sidebar.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/sidebar.tsx) (lines 48–90)
- [topbar.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/topbar.tsx) (lines 44–89)

This should be extracted into a `useThemeToggle()` hook.

### 4. "Active Practice Modules" Count is Misleading
On the practice page, each subject banner says things like **"4 active practice modules"** for Maths — but only 1 (Speed Math) is actually functional; the other 3 say "COMING SOON". The count should reflect only truly active modules, or the label should say "4 practice modules" without "active".

### 5. SEO Metadata is Minimal

> [!IMPORTANT]
> The root [layout.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/app/layout.tsx) only defines:
> ```ts
> title: "PrepPilot",
> description: "Your exam co-pilot"
> ```

For an SSC prep app competing for organic search traffic, this is a missed opportunity. You need:
- Specific `<title>` per page (e.g., "SSC CGL PYQ Practice — PrepPilot")
- Rich meta descriptions mentioning SSC exams
- Open Graph / Twitter cards for social sharing
- Structured data (FAQ schema for landing page)

### 6. Footer Links Are Dead (`href="#"`)
The entire "Resources" and "Support" columns in the footer link to `#`:
- SSC CGL Syllabus → `#`
- Previous Year Cutoffs → `#`
- Study Strategy → `#`
- Blog → `#`
- Help Center, Contact Us, Privacy Policy, Terms of Service → all `#`

Dead links hurt SEO and user trust. Either build these pages or remove them.

### 7. No Error Boundaries
There are no React Error Boundaries anywhere. If the flashcard API fails or a mental-maths question generator throws, the entire app will crash to a white screen. At minimum, wrap the main content area with an error boundary.

### 8. Breadcrumb "Home" Links to `/dashboard` for Guests
On pages like About, the breadcrumb's "Home" link points to `/dashboard`. Since `/dashboard` is a protected route, unauthenticated users get redirected to `/` with a "Please sign in" toast — a confusing and jarring experience. The "Home" breadcrumb should conditionally link to `/` for guests.

### 9. Hardcoded Strings Everywhere
There's no i18n or even a centralized strings file. Content like pricing ("₹99/month"), feature descriptions, and section labels are all hardcoded inline. While full i18n may be overkill, a `constants/strings.ts` would help keep marketing copy consistent and editable.

### 10. No Loading States for Route Transitions
When switching between subject tabs on the practice page, the animation is smooth (thanks to Framer Motion). But navigating between full pages (e.g., `/practice` → `/about`) has no loading indicator — the page just freezes for a beat. A `loading.tsx` in the app router or a top progress bar (like NProgress) would help.

### 11. Console Warnings Likely from Unused Imports
[header.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/components/custom/header.tsx) imports many icons (`Puzzle`, `Brain`, `Layers3`, `Newspaper`, `Landmark`, `FlaskConical`, etc.) that are used in different sub-menus. Given the 962 lines, there could be unused imports bloating the bundle. A lint pass would clean this up.

### 12. Redux May Be Over-Engineered for Current Scale
The Redux store manages:
- `flashcardApi` (RTK Query) — ✅ justified
- `filter` slice — simple filter state
- `session` slice — game session state

For the current app size, the filter and session slices could be handled with React Context or Zustand with less boilerplate. Redux is fine but adds cognitive overhead for 2 small slices.

---

## 📊 Summary Scorecard

| Category | Score | Notes |
|---|---|---|
| **Visual Design** | ⭐⭐⭐⭐⭐ | Genuinely premium, best-in-class for the edtech niche |
| **UX / Interactions** | ⭐⭐⭐⭐ | View transitions, focus mode, animations — well thought out |
| **Architecture** | ⭐⭐⭐⭐ | Good foundations but the monolith files need refactoring |
| **Code Quality** | ⭐⭐⭐ | Duplicated logic, no error boundaries, huge files |
| **SEO** | ⭐⭐ | Minimal metadata, dead links, no OG tags |
| **Accessibility** | ⭐⭐⭐ | Semantic HTML used, `aria-label` present, but needs audit |
| **Production Readiness** | ⭐⭐⭐ | PostHog + Firebase + Vercel Analytics = good; but no error boundaries, no loading.tsx, dead links |

---

## 🎯 Top 5 Priority Fixes

1. **Split `page.tsx` (806 lines) and `header.tsx` (962 lines)** into smaller components
2. **Fix "active modules" count** to only count enabled features
3. **Add per-page SEO metadata** with proper titles and descriptions
4. **Extract duplicated `toggleTheme` logic** into a shared hook
5. **Add Error Boundaries** and `loading.tsx` files for graceful degradation
