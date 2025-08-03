import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  UserProfile,
  ProfileFormData,
  ProfileState,
} from "../types/profile";

// 프로필 정보 가져오기
export const fetchProfile = createAsyncThunk<UserProfile>(
  "profile/fetchProfile",
  async () => {
    const response = await fetch("http://13.125.180.222/api/users/mypage/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("프로필 정보를 불러오는데 실패했습니다.");
    }

    return await response.json();
  }
);

// 프로필 정보 수정
export const updateProfile = createAsyncThunk<UserProfile, ProfileFormData>(
  "profile/updateProfile",
  async (formData: ProfileFormData) => {
    const requestData = new FormData();
    requestData.append("name", formData.name);
    requestData.append("gender", formData.gender as string);
    requestData.append("birth_date", formData.birth_date);

    if (formData.profile_image) {
      requestData.append("profile_image", formData.profile_image);
    }

    const response = await fetch(
      "http://13.125.180.222/api/profile/users/mypage/",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: requestData,
      }
    );

    if (!response.ok) {
      throw new Error("프로필 수정에 실패했습니다.");
    }

    return await response.json();
  }
);

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
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
          action.error.message || "프로필 정보를 불러오는데 실패했습니다.";
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
        state.error = action.error.message || "프로필 수정에 실패했습니다.";
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
