"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/auth";
import { clearLocalProgress, OWNER_KEY, startProgressSync, syncNow } from "@/lib/progress-sync";
import { readStored, removeStored } from "@/lib/storage";

/**
 * Keeps practice progress in sync with the signed-in account. On sign-out the
 * synced progress is removed from the device (it lives in the account), so the
 * next person on this device starts clean.
 */
export function ProgressSync() {
  const { user, isLoading } = useAuth();
  const uid = user?.uid ?? null;
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !uid) {
      if (wasSignedIn.current && readStored<string | null>(OWNER_KEY, null)) {
        clearLocalProgress();
        removeStored(OWNER_KEY);
      }
      wasSignedIn.current = false;
      return;
    }
    wasSignedIn.current = true;
    const stop = startProgressSync(uid, () => user.getIdToken());
    // Send anything still pending if the tab is closed or hidden.
    const onHide = () => {
      if (document.visibilityState === "hidden") void syncNow();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      stop();
    };
    // Restart only when the account changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, isLoading]);

  return null;
}
