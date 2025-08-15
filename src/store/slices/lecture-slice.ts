import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PageType = "main" | "login" | "my-lectures";

interface LectureState {
  currentPage: PageType;
}

const initialState: LectureState = {
  currentPage: "main",
};

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload;
    },
    goToMain: (state) => {
      state.currentPage = "main";
    },
    goToLogin: (state) => {
      state.currentPage = "login";
    },
    goToMyLectures: (state) => {
      state.currentPage = "my-lectures";
    },
  },
});

export const { setCurrentPage, goToMain, goToLogin, goToMyLectures } =
  lectureSlice.actions;
export default lectureSlice.reducer;
