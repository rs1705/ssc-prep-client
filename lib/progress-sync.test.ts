import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();
Object.assign(globalThis, {
  window: {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    },
    dispatchEvent: () => true,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
    clearTimeout: (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
  },
});

const { applyDoc, buildLocalDoc, clearLocalProgress, isSyncedKey, OWNER_KEY, startProgressSync } = await import("./progress-sync");
const { dismissMistake, logActivity, logMistakes, readMistakes } = await import("./activity-log");
const { recordPlanActivity } = await import("./today-plan");
const { clearUnfinished, saveUnfinished } = await import("@/features/games/unfinished");

beforeEach(() => store.clear());

describe("progress document", () => {
  it("collects everything that syncs from the device", () => {
    logActivity({ kind: "game", subject: "english", label: "Cloze", href: "/c" }, 5);
    logMistakes([{ subject: "english", source: "Cloze", prompt: "q1", answer: "a", href: "/c" }], 6);
    recordPlanActivity("cards", 3, new Date(2026, 10, 12, 9));
    saveUnfinished({ path: "/p", label: "P", subject: "english", done: 2, total: 10, state: {} }, 7);
    store.set("ssc:exam-date", JSON.stringify("2027-02-15"));
    store.set("ssc:preferences", JSON.stringify({ sound: true })); // device setting: not synced

    const doc = buildLocalDoc();
    expect(doc.activities).toHaveLength(1);
    expect(doc.mistakes.map((m) => m.prompt)).toEqual(["q1"]);
    expect(doc.plan["2026-11-12"].cards).toBe(3);
    expect(Object.keys(doc.unfinished)).toEqual(["/p"]);
    expect(doc.examDate.value).toBe("2027-02-15");
    expect(isSyncedKey("ssc:preferences")).toBe(false);
  });

  it("writes a merged document back, including removing finished sessions", () => {
    saveUnfinished({ path: "/old", label: "", subject: "english", done: 1, total: 10, state: {} }, 1);
    const doc = buildLocalDoc();
    applyDoc({
      ...doc,
      activities: [{ id: "x", at: 9 }],
      unfinished: {},
      planStreak: { last: "2026-11-12", count: 4 },
    });
    expect(JSON.parse(store.get("ssc:activity")!)).toEqual([{ id: "x", at: 9 }]);
    expect(store.has("ssc:unfinished:/old")).toBe(false);
    expect(JSON.parse(store.get("ssc:plan-streak")!).count).toBe(4);
  });

  it("remembers removals so other devices drop them too", () => {
    logMistakes([{ subject: "english", source: "s", prompt: "q1", answer: "a", href: "/c" }], 1);
    dismissMistake(readMistakes()[0].id, 50);
    saveUnfinished({ path: "/p", label: "", subject: "english", done: 1, total: 10, state: {} }, 1);
    clearUnfinished("/p", 60);
    const doc = buildLocalDoc();
    expect(doc.mistakesRemoved).toEqual([{ prompt: "q1", at: 50 }]);
    expect(doc.unfinishedRemoved).toEqual([{ path: "/p", at: 60 }]);
  });

  it("clears synced progress but keeps device settings", () => {
    logActivity({ kind: "game", subject: "english", label: "x", href: "/x" });
    store.set("ssc:preferences", "{}");
    clearLocalProgress();
    expect(store.has("ssc:activity")).toBe(false);
    expect(store.has("ssc:preferences")).toBe(true);
  });
});

describe("syncing", () => {
  it("sends the device's document and adopts the server's merged one", async () => {
    logActivity({ kind: "game", subject: "english", label: "local", href: "/x" }, 1);
    const merged = { ...buildLocalDoc(), activities: [{ id: "server", at: 2 }, { id: "local", at: 1 }] };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => merged });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const stop = startProgressSync("user-1", async () => "token");
    await vi.waitFor(() => expect(JSON.parse(store.get("ssc:activity")!)).toHaveLength(2));
    stop();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/me\/progress$/);
    expect(init.method).toBe("PUT");
    expect(init.headers.Authorization).toBe("Bearer token");
    expect(JSON.parse(init.body).data.activities[0].label).toBe("local");
    expect(JSON.parse(store.get(OWNER_KEY)!)).toBe("user-1");
  });

  it("clears another account's progress before syncing a new one", async () => {
    store.set(OWNER_KEY, JSON.stringify("someone-else"));
    logActivity({ kind: "game", subject: "english", label: "theirs", href: "/x" });
    const fetchMock = vi.fn().mockImplementation(async (_url: string, init: { body: string }) => ({
      ok: true,
      json: async () => JSON.parse(init.body).data,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const stop = startProgressSync("me", async () => "t");
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    stop();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).data.activities).toEqual([]);
  });

  it("keeps progress on the device when the server can't be reached", async () => {
    logActivity({ kind: "game", subject: "english", label: "kept", href: "/x" });
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
    const stop = startProgressSync("me", async () => "t");
    await new Promise((r) => setTimeout(r, 20));
    stop();
    expect(JSON.parse(store.get("ssc:activity")!)[0].label).toBe("kept");
  });
});

describe("changes made during a sync", () => {
  it("are not overwritten by the server's reply; they are sent again", async () => {
    let calls = 0;
    const fetchMock = vi.fn().mockImplementation(async (_url: string, init: { body: string }) => {
      calls += 1;
      const data = JSON.parse(init.body).data;
      // While the first request is out, the user dismisses something on the device.
      if (calls === 1) logActivity({ kind: "game", subject: "english", label: "during", href: "/x" }, 99);
      return { ok: true, json: async () => data };
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const stop = startProgressSync("me", async () => "t");
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), { timeout: 3000 });
    stop();
    expect(JSON.parse(store.get("ssc:activity")!)[0].label).toBe("during");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).data.activities[0].label).toBe("during");
  });
});
