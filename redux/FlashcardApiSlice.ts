import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/firebase/config";
export const flashcardApi = createApi({
  reducerPath: "FlashcardApi",
  tagTypes: ["Interactions"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getFilteredCards: builder.query({
      query: ({
        subject,
        type,
        exam,
        year,
        difficulty,
        alphabet,
        highFrequency,
      }) => {
        const params = new URLSearchParams();
        if (subject) if (subject !== "all") params.append("subject", subject);
        if (type) {
          if (type !== "all") params.append("type", type);
        }
        if (exam) {
          if (exam !== "all") params.append("exam", exam);
        }
        if (year) {
          if (year !== "all") params.append("year", year);
        }
        if (difficulty) {
          if (difficulty !== "all") params.append("difficulty", difficulty);
        }
        if (alphabet) params.append("alphabet", alphabet);

        if (highFrequency) {
          params.append("highFrequency", "true");
        }

        return `/flashcards/getFilteredCards?${params.toString()}`;
      },
    }),
    saveFlashcardInteractions: builder.mutation({
      query: ({ cardId, rating }) => ({
        url: "/interactions/saveInteractions",
        method: "POST",
        body: {
          cardId,
          rating,
        },
      }),
      invalidatesTags: ["Interactions"],
    }),

    getFlashcardInteractions: builder.query<any, void>({
      query: () => ({
        url: `/interactions/getInteractions`,
        method: "GET",
      }),
      providesTags: ["Interactions"],
    }),

    getStudyDeck: builder.query<any, void>({
      query: () => ({
        url: `/flashcards/getStudyDeck`,
        method: "GET",
      }),
      providesTags: ["Interactions"],
    })
  }),
});

export const {
  useGetFilteredCardsQuery,
  useSaveFlashcardInteractionsMutation,
  useGetFlashcardInteractionsQuery,
  useGetStudyDeckQuery
} = flashcardApi;
