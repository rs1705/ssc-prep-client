/**
 * When the desktop sidebar is narrow (icons only) or wide (icons and labels).
 *
 * - Focus pages (a game, drill, flashcard deck or review in progress) start narrow, so
 *   the work gets the room.
 * - Other pages start wide on big screens (1280px and up) and narrow below that.
 * - The collapse button records the learner's own choice for the kind of page they are
 *   on ("focus" or "browse"); that choice wins over the defaults from then on.
 */

/** Screens at least this wide get the full sidebar on ordinary pages. */
export const WIDE_SCREEN_PX = 1280;

export type PageKind = "focus" | "browse";

/** The learner's choices, one per kind of page (absent = use the default). */
export type SidebarChoice = Partial<Record<PageKind, boolean>>;

/** Pages where one task fills the screen: games, drills, flashcard decks, mistakes review. */
export function isFocusRoute(path: string): boolean {
  if (path.includes("/hangman")) return true;
  if (path.includes("/fsrs")) return true;
  if (path.includes("/freestyle")) return true;
  if (path.endsWith("/maths/flashcards")) return true;
  // Individual games live under /games/<name>; the /games hub itself is a normal page.
  if (/\/games\/.+/.test(path)) return true;
  if (/\/speed-drills\/.+/.test(path)) return true;
  if (/\/(maths|reasoning)\/match$/.test(path)) return true;
  if (path === "/review") return true;
  // A topic inside Speed Maths, but not the topic list itself.
  if (/\/mental-maths\/[^/]+/.test(path)) return true;
  return false;
}

export function pageKind(path: string): PageKind {
  return isFocusRoute(path) ? "focus" : "browse";
}

/** True when the sidebar should be narrow. */
export function sidebarCollapsed({
  path,
  width,
  choice,
}: {
  path: string;
  width: number;
  choice: SidebarChoice;
}): boolean {
  const kind = pageKind(path);
  const saved = choice[kind];
  if (typeof saved === "boolean") return saved;
  return kind === "focus" ? true : width < WIDE_SCREEN_PX;
}
