import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const flashcardApi = createApi({
  reducerPath: "FlashcardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/flashcards",
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

        return `getFilteredCards?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetFilteredCardsQuery } = flashcardApi;
