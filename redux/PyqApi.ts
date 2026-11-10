import { flashcardApi } from "./FlashcardApiSlice";
import type { SubjectKey } from "@/lib/subject-theme";

export interface PyqOption {
  label: string;
  text: string;
}

export interface Pyq {
  id: string;
  topic: string;
  subtopics: string[];
  difficulty: string | null;
  /** Markdown with inline LaTeX ($...$). */
  question: string;
  options: PyqOption[];
  /** Label of the correct option. */
  answer: string;
  explanation: string;
  passage: string | null;
  source: string | null;
}

export interface PyqTopic {
  topic: string;
  count: number;
  subtopics: string[];
}

export interface PyqPaper {
  id: string;
  title: string;
  year: number;
  shift: string | null;
  date: string | null;
  questionCount: number;
}

export interface SectionalPaper extends PyqPaper {
  durationSeconds: number;
  questions: Pyq[];
}

// Shares the Nest base URL and auth header set up for flashcards.
export const pyqApi = flashcardApi.injectEndpoints({
  endpoints: (builder) => ({
    getPyqTopics: builder.query<PyqTopic[], SubjectKey>({
      query: (subject) => `/pyqs/topics?subject=${subject}`,
    }),
    getPyqSet: builder.query<Pyq[], { subject: SubjectKey; topic?: string; limit?: number }>({
      query: ({ subject, topic, limit }) => {
        const params = new URLSearchParams({ subject });
        if (topic) params.set("topic", topic);
        if (limit) params.set("limit", String(limit));
        return `/pyqs?${params.toString()}`;
      },
      // Sets are shuffled server-side, so never reuse a cached one.
      keepUnusedDataFor: 0,
    }),
    getPyqPapers: builder.query<PyqPaper[], SubjectKey>({
      query: (subject) => `/pyqs/papers?subject=${subject}`,
    }),
    getSectionalPaper: builder.query<SectionalPaper, { paperId: string; subject: SubjectKey }>({
      query: ({ paperId, subject }) => `/pyqs/papers/${paperId}?subject=${subject}`,
    }),
  }),
});

export const {
  useGetPyqTopicsQuery,
  useLazyGetPyqSetQuery,
  useGetPyqPapersQuery,
  useLazyGetSectionalPaperQuery,
} = pyqApi;
