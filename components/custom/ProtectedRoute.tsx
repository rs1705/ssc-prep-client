"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();

  const wasLoggedIn = useRef(!!user);

  useEffect(() => {
    if (user) {
      wasLoggedIn.current = true;
    }
    if (!isLoading && !user) {
      // Only show error toast if they are trying to access without ever being logged in and not currently logging out
      if (!isLoggingOut && !wasLoggedIn.current) {
        toast.error("Please sign in to access this page.", { id: "auth-guard" });
      }
      router.replace("/");
    }
  }, [user, isLoading, isLoggingOut, router]);

  if (isLoading || !user) return null;

  return <>{children}</>;
}
