import { describe, expect, it, vi } from "vitest";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { isWakeError, SERVER_WAKE_EVENT, withServerWake } from "./server-wake";

const events: boolean[] = [];
Object.assign(globalThis, {
  window: {
    dispatchEvent: (e: CustomEvent<{ waking: boolean }>) => {
      if (e.type === SERVER_WAKE_EVENT) events.push(e.detail.waking);
      return true;
    },
  },
});

const api = { signal: new AbortController().signal } as BaseQueryApi;
const down = { error: { status: "FETCH_ERROR" as const, error: "Failed to fetch" } };
const ok = { data: ["card"] };
const noWait = () => Promise.resolve();

describe("withServerWake", () => {
  it("retries a read until the server answers, and announces the wait", async () => {
    events.length = 0;
    const inner = vi.fn().mockResolvedValueOnce(down).mockResolvedValueOnce(down).mockResolvedValueOnce(ok);
    const result = await withServerWake(inner, [1, 1, 1, 1], noWait)("/flashcards", api, {});
    expect(result).toEqual(ok);
    expect(inner).toHaveBeenCalledTimes(3);
    expect(events).toEqual([true, false]);
  });

  it("gives up after the last retry", async () => {
    const inner = vi.fn().mockResolvedValue(down);
    const result = await withServerWake(inner, [1, 1], noWait)("/pyqs", api, {});
    expect(result).toEqual(down);
    expect(inner).toHaveBeenCalledTimes(3);
  });

  it("never repeats a write", async () => {
    const inner = vi.fn().mockResolvedValue(down);
    await withServerWake(inner, [1, 1], noWait)({ url: "/flashcards/1/review", method: "POST" }, api, {});
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("doesn't retry real answers like 404 or 401", async () => {
    const inner = vi.fn().mockResolvedValue({ error: { status: 404, data: {} } });
    await withServerWake(inner, [1, 1], noWait)("/missing", api, {});
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("treats unreachable and gateway errors as waking", () => {
    expect(isWakeError({ status: "FETCH_ERROR", error: "" })).toBe(true);
    expect(isWakeError({ status: 503, data: null })).toBe(true);
    expect(isWakeError({ status: 500, data: null })).toBe(false);
    expect(isWakeError(undefined)).toBe(false);
  });
});
