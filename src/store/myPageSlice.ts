import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store/index";
import type {
  UserProfile,
  ProfileFormData,
  MyPageState,
} from "../types/myPage/myPage";

// 프로필 정보 가져오기
export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { state: RootState }
>("myPage/fetchProfile", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch("http://13.125.180.222/api/users/mypage/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "프로필 정보를 불러오는데 실패했습니다."
    );
  }
});

// 프로필 정보 수정
export const updateProfile = createAsyncThunk<
  UserProfile,
  ProfileFormData,
  { state: RootState }
>("myPage/updateProfile", async (formData, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const requestData = new FormData();
    requestData.append("name", formData.name);
    requestData.append("gender", formData.gender as string);
    requestData.append("birth_date", formData.birth_date);

    if (formData.profile_image) {
      requestData.append("profile_image", formData.profile_image);
    }

    const response = await fetch("http://13.125.180.222/api/users/mypage/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: requestData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "프로필 수정에 실패했습니다."
    );
  }
});

const initialState: MyPageState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
};

const myPageSlice = createSlice({
  name: "myPage",
  initialState,
  reducers: {
    resetMyPageState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearMyPageError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // 프로필 정보 가져오기
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "프로필 정보를 불러오는데 실패했습니다.";
      })
      // 프로필 정보 수정
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "프로필 수정에 실패했습니다.";
      });
  },
});

export const { resetMyPageState, clearMyPageError } = myPageSlice.actions;

export default myPageSlice.reducer;
