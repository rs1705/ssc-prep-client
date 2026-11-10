import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/firebase/config";
import type { FlashCardInterface } from "@/lib/types";

/** Filters accepted by GET /flashcards. "all" (or empty) means "don't filter". */
export interface FlashcardFilters {
  subject?: string;
  type?: string;
  exam?: string;
  year?: string;
  difficulty?: string;
  alphabet?: string;
  highFrequency?: boolean;
  /** Max number of cards. */
  limit?: number;
  /** Random order (a fresh sample each request). */
  random?: boolean;
}

/** 1 = Again, 2 = Hard, 3 = Good, 4 = Easy. */
export type ReviewRating = 1 | 2 | 3 | 4;

export interface ReviewArgs {
  cardId: string;
  rating: ReviewRating;
  /** Seconds spent on the card (optional). */
  timeTaken?: number;
}

export interface ReviewResult {
  cardId: string;
  rating: ReviewRating;
  dueDate: string;
  state: number;
  reps: number;
  lapses: number;
  stability: number;
  scheduledDays: number;
}

// The NestJS server (Postgres/Neon). Set NEXT_PUBLIC_API_URL in production.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const flashcardApi = createApi({
  reducerPath: "FlashcardApi",
  tagTypes: ["Interactions"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFilteredCards: builder.query<FlashCardInterface[], FlashcardFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        const { highFrequency, alphabet, limit, random, ...rest } = filters;

        for (const [key, value] of Object.entries(rest)) {
          if (value && value !== "all") params.append(key, String(value));
        }
        if (alphabet) params.append("alphabet", alphabet);
        if (highFrequency) params.append("highFrequency", "true");
        if (limit) params.append("limit", String(limit));
        if (random) params.append("random", "true");

        return `/flashcards?${params.toString()}`;
      },
    }),

    saveFlashcardInteractions: builder.mutation<ReviewResult, ReviewArgs>({
      query: ({ cardId, rating, timeTaken }) => ({
        url: `/flashcards/${cardId}/review`,
        method: "POST",
        body: timeTaken === undefined ? { rating } : { rating, timeTaken },
      }),
    }),

    getStudyDeck: builder.query<FlashCardInterface[], void>({
      query: () => ({
        url: "/flashcards/study-deck",
        method: "GET",
      }),
      providesTags: ["Interactions"],
    }),
  }),
});

export const {
  useGetFilteredCardsQuery,
  useLazyGetFilteredCardsQuery,
  useSaveFlashcardInteractionsMutation,
  useGetStudyDeckQuery,
} = flashcardApi;
