/* Plain exam-style buttons: the CBT look, not the app's chunky game buttons.
   Shared by the full-screen exam (MockRunner) and topic practice (PyqRunner). */
const BTN_BASE =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

export const BTN = {
  primary: `${BTN_BASE} bg-brand-600 text-white hover:bg-brand-700`,
  outline: `${BTN_BASE} border border-border bg-card text-foreground hover:bg-muted`,
  save: `${BTN_BASE} bg-emerald-600 text-white hover:bg-emerald-700`,
  mark: `${BTN_BASE} border border-brand-500 bg-card text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10`,
  ghost: `${BTN_BASE} text-muted-foreground hover:bg-muted hover:text-foreground`,
};
