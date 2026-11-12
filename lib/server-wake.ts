import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * If the API is briefly unreachable (a deploy or restart on Railway, a sleeping
 * instance, a flaky connection), GET requests are retried for a while instead
 * of failing, and screens get an event so they can say "waking up the server".
 */

export const SERVER_WAKE_EVENT = "ssc:server-wake";
/** Show the notice once a request has been waiting this long. */
export const SLOW_AFTER_MS = 6000;
/** Waits between retries: about 75 seconds in total, enough for a cold start. */
export const RETRY_DELAYS_MS = [2000, 3000, 5000, 8000, 12000, 15000, 15000, 15000];

let waiting = 0;

function announce() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SERVER_WAKE_EVENT, { detail: { waking: waiting > 0 } }));
  }
}

/** Unreachable, or the host answered that the app isn't up yet. */
export function isWakeError(error: FetchBaseQueryError | undefined): boolean {
  if (!error) return false;
  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") return true;
  return error.status === 502 || error.status === 503 || error.status === 504;
}

function isGet(args: string | FetchArgs): boolean {
  return typeof args === "string" || !args.method || args.method.toUpperCase() === "GET";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function withServerWake(
  inner: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  delays: number[] = RETRY_DELAYS_MS,
  wait: (ms: number) => Promise<unknown> = sleep,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  return async (args, api, extra) => {
    let marked = false;
    const mark = () => {
      if (marked) return;
      marked = true;
      waiting += 1;
      announce();
    };
    const slow = setTimeout(mark, SLOW_AFTER_MS);
    try {
      let result = await inner(args, api, extra);
      // Only safe-to-repeat reads are retried.
      for (let i = 0; i < delays.length && isGet(args) && isWakeError(result.error); i++) {
        if (api.signal.aborted) break;
        mark();
        await wait(delays[i]);
        result = await inner(args, api, extra);
      }
      return result;
    } finally {
      clearTimeout(slow);
      if (marked) {
        waiting -= 1;
        announce();
      }
    }
  };
}
