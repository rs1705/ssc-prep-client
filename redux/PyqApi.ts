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

export interface MockPaperSummary extends PyqPaper {
  sections: { subject: SubjectKey; count: number }[];
}

export interface MockSection {
  subject: SubjectKey;
  questions: Pyq[];
}

/** A full-length Tier 1 test: a real past paper or a generated mock. */
export interface FullMock extends PyqPaper {
  /** "section" = one subject of a past paper (Sectional PYQs). */
  kind: "paper" | "mock" | "section";
  durationSeconds: number;
  sections: MockSection[];
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
    getMockPapers: builder.query<MockPaperSummary[], void>({
      query: () => "/mocks/papers",
    }),
    getMockPaper: builder.query<FullMock, string>({
      query: (id) => `/mocks/papers/${id}`,
    }),
    getNewMock: builder.query<FullMock, void>({
      query: () => "/mocks/new",
      // Every mock is freshly drawn, so never reuse a cached one.
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetPyqTopicsQuery,
  useLazyGetPyqSetQuery,
  useGetPyqPapersQuery,
  useLazyGetSectionalPaperQuery,
  useGetMockPapersQuery,
  useLazyGetMockPaperQuery,
  useLazyGetNewMockQuery,
} = pyqApi;
