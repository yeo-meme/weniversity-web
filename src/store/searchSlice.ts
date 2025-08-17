import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  SearchState,
  SearchApiResponse,
  SearchParams,
} from "../types/search/search";

// 검색 API 호출
export const searchCourses = createAsyncThunk<SearchApiResponse, SearchParams>(
  "search/searchCourses",
  async (params, { rejectWithValue }) => {
    try {
      const { title, page = 1 } = params;
      const baseUrl = "/api/courses/";
      const queryParams = new URLSearchParams();

      queryParams.append("title", title);
      queryParams.append("page", page.toString());

      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "검색에 실패했습니다."
      );
    }
  }
);

const initialState: SearchState = {
  courses: [],
  searchQuery: "",
  pagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
  },
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchState: state => {
      state.courses = [];
      state.searchQuery = "";
      state.pagination.currentPage = 1;
      state.pagination.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchCourses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;

        state.courses = response?.results || [];
        state.pagination.totalItems = response?.count || 0;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "검색에 실패했습니다.";
        state.courses = [];
        state.pagination.totalItems = 0;
      });
  },
});

export const { resetSearchState, setSearchQuery, setCurrentPage, clearError } =
  searchSlice.actions;

export default searchSlice.reducer;
