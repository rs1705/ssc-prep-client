import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TabFilter {
  subject: string;
  exam?: string;
  year?: string;
  type?: string;
  difficulty?: string;
  alphabet?: string;
  highFrequency?: boolean;
}

export interface FilterState {
  [key: string]: TabFilter;
}

const defaultEnglishFilter: TabFilter = {
  subject: "english",
  type: "all",
  exam: "all",
  difficulty: "all",
  year: "all",
  highFrequency: false,
};

const initialState: FilterState = {
  all: { ...defaultEnglishFilter },
  ows: { ...defaultEnglishFilter, type: "ows" },
  vocab: { ...defaultEnglishFilter, type: "vocab" },
  idiom: { ...defaultEnglishFilter, type: "idiom" },
};

const filterSlice = createSlice({
  name: "filterSlice",
  initialState,
  reducers: {
    updateFilter: (
      state,
      action: PayloadAction<{ tab: string; filter: Partial<TabFilter> }>
    ) => {
      const { tab, filter } = action.payload;
      state[tab] = { ...state[tab], ...filter };
    },
    resetFilter: (state, action: PayloadAction<{ tab: string }>) => {
      const { tab } = action.payload;
      state[tab] = { ...defaultEnglishFilter, type: tab };
    },
  },
});

export const { updateFilter, resetFilter } = filterSlice.actions;
export default filterSlice;
