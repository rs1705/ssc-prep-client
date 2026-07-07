import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionType } from "@/features/flashcards/FlashcardDeck";
type CardStatus = "new" | "unknown" | "known";
type CardMeta = {
  status: CardStatus;
  isImportant: boolean;
  seenCount: number;
  correctCount: number;
};

type CardMetaMap = Record<string, CardMeta>;

type SessionState = {
  deck: string[];
  cardMeta: CardMetaMap;
  currentCardId: string | null;
};


export type HandleActionPayload = {
  cardId: string;
  action: ActionType;
};

type InitializeSessionPayload = {
  deck: string[];
};

type SetCardPayload = {
  cardId: string | null;
};
const initialState: SessionState = {
  deck: [],
  cardMeta: {},
  currentCardId: null,
};

const sessionSlice = createSlice({
  name: "sessionSlice",
  initialState,
  reducers: {
    handleUserAction: (state, action: PayloadAction<HandleActionPayload>) => {
      const { cardId, action: userAction } = action.payload;
      if (!state.cardMeta[cardId]) {
        state.cardMeta[cardId] = {
          status: "new",
          isImportant: false,
          seenCount: 0,
          correctCount: 0,
        };
      }
      const card = state.cardMeta[cardId];
      if (userAction === "AGAIN") {
        card.seenCount += 1;
        card.correctCount = 0;
        card.status = "unknown";
      }
      if (userAction === "HARD") {
        card.seenCount += 1;
        card.correctCount += 1;
        card.status = "known";
      }
    },
    initializeSession: (
      state,
      action: PayloadAction<InitializeSessionPayload>,
    ) => {
      const { deck } = action.payload;
      state.deck = deck;
      state.cardMeta = {};

      deck.forEach((cardId) => {
        state.cardMeta[cardId] = {
          status: "new",
          isImportant: false,
          seenCount: 0,
          correctCount: 0,
        };
      });

      state.currentCardId = deck[0] || null;
    },
    setCurrentCard: (state, action: PayloadAction<SetCardPayload>) => {
      state.currentCardId = action.payload.cardId;
    },
  },
});

export const { handleUserAction, initializeSession, setCurrentCard } =
  sessionSlice.actions;
export default sessionSlice;
