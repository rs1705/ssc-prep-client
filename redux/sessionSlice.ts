import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export type ActionType = "known" | "unknown" | "important";

export type HandleActionPayload = {
  cardId: string;
  action: ActionType;
};

type InitializeSessionPayload = {
  deck: string[];
};

type SetCurrentCardPayload = {
  cardId: string;
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
      if (userAction === "important") {
        card.isImportant = true;
        return;
      }
      if (userAction === "unknown") {
        card.seenCount += 1;
        card.correctCount = 0;
        card.status = "unknown";
      }
      if (userAction === "known") {
        card.seenCount += 1;
        card.correctCount += 1;
        card.status = "unknown";
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
    setCurrentCard: (state, action: PayloadAction<SetCurrentCardPayload>) => {
      state.currentCardId = action.payload.cardId;
    },
  },
});

export const { handleUserAction, initializeSession, setCurrentCard } =
  sessionSlice.actions;
export default sessionSlice;
