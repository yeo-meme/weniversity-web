// store/passwordResetSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetState,
} from "../types/findPassword";

// 비밀번호 재설정 이메일 전송 API
export const sendPasswordResetEmail = createAsyncThunk<
  PasswordResetResponse,
  PasswordResetRequest
>("passwordReset/sendEmail", async (requestData: PasswordResetRequest) => {
  const { email } = requestData;

  await fetch("http://13.125.180.222/api/users/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "jaeho614a@gmail.com",
      password: "jaeho614!",
    }),
  });

  const response = await fetch("http://13.125.180.222/api/password-reset/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "비밀번호 재설정 이메일 전송에 실패했습니다."
    );
  }
  return await response.json();
});

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
          action.error.message || "비밀번호 재설정 이메일 전송에 실패했습니다.";
      });
  },
});

export const { resetPasswordResetState, clearPasswordResetError } =
  findPasswordSlice.actions;
export default findPasswordSlice.reducer;
