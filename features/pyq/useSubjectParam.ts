"use client";

import { useParams } from "next/navigation";
import { SUBJECT_HUE, type SubjectKey } from "@/lib/subject-theme";

/** The `[subject]` route segment, or null when it isn't one of the four subjects. */
export function useSubjectParam(): SubjectKey | null {
  const params = useParams<{ subject: string }>();
  const value = params?.subject;
  return value && value in SUBJECT_HUE ? (value as SubjectKey) : null;
}
