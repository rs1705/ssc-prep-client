import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const flashcardApi = createApi({
  reducerPath: "FlashcardApi",
  tagTypes: ["Interactions"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/",
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
      query: ({ userId, cardId, action }) => ({
        url: "/interactions/saveInteractions",
        method: "POST",
        body: {
          userId,
          cardId,
          action,
        },
      }),
      invalidatesTags: ["Interactions"],
    }),

    getFlashcardInteractions: builder.query({
      query: (userId) => ({
        url: `/interactions/getInteractions?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Interactions"],
    }),
  }),
});

export const {
  useGetFilteredCardsQuery,
  useSaveFlashcardInteractionsMutation,
  useGetFlashcardInteractionsQuery,
} = flashcardApi;
