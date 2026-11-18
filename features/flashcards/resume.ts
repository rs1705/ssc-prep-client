/** Where a freestyle deck was left: the card's id, and its position as a fallback. */
export interface SavedSpot {
  id: string;
  index: number;
}

/**
 * The index to reopen a deck at. Finds the saved card by id (so it survives cards being
 * added or reordered); if it's gone, keeps the old position within the deck's size.
 */
export function resumeIndex(cards: { _id: string }[], saved: SavedSpot | null | undefined): number {
  if (!saved || cards.length === 0) return 0;
  const byId = cards.findIndex((c) => c._id === saved.id);
  if (byId >= 0) return byId;
  const i = Number.isInteger(saved.index) ? saved.index : 0;
  return Math.min(Math.max(i, 0), cards.length - 1);
}

/** Storage key for one freestyle deck: its tab plus the filters that decide which cards it holds. */
export function freestyleSpotKey(tab: string, filters: object | undefined): string {
  const parts = Object.entries((filters ?? {}) as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
  return `ssc:flashcards:freestyle:${tab}:${parts.join("&")}`;
}
