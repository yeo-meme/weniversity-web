import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  currentTab: string; 
}

const initialState: PageState = {
  currentTab: "home",
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    },
  },
});

export const { setCurrentTab } = pageSlice.actions;
export default pageSlice.reducer;
