import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store/index";
import type {
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetState,
} from "../types/myPage/findPassword";

// 비밀번호 재설정 이메일 전송
export const sendPasswordResetEmail = createAsyncThunk<
  PasswordResetResponse,
  PasswordResetRequest,
  { state: RootState }
>(
  "passwordReset/sendEmail",
  async (requestData, { rejectWithValue, getState }) => {
    try {
      const { email } = requestData;
      const state = getState();
      const token = state.auth.token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://13.125.180.222/api/password-reset/",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "비밀번호 재설정 이메일 전송에 실패했습니다."
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "비밀번호 재설정 이메일 전송에 실패했습니다."
      );
    }
  }
);

const initialState: PasswordResetState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

const findPasswordSlice = createSlice({
  name: "findPassword",
  initialState,
  reducers: {
    resetPasswordResetState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    clearPasswordResetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendPasswordResetEmail.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload.message ||
          "비밀번호 재설정 링크를 이메일로 보냈습니다.";
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "비밀번호 재설정 이메일 전송에 실패했습니다.";
      });
  },
});

export const { resetPasswordResetState, clearPasswordResetError } =
  findPasswordSlice.actions;

export default findPasswordSlice.reducer;
