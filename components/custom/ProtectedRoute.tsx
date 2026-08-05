"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access this page.", { id: "auth-guard" });
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
