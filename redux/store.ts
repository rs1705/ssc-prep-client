import { configureStore } from "@reduxjs/toolkit";
import { flashcardApi } from "./FlashcardApiSlice";
import filterSlice from "./FilterSlice";

export const store = configureStore({
  reducer: {
    [flashcardApi.reducerPath]: flashcardApi.reducer,
    filter: filterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(flashcardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
