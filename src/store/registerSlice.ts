import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RegisterFormData,
  RegisterRequestData,
  RegisterState,
} from "../types/register/user";

// 회원가입
export const register = createAsyncThunk(
  "register/register",
  async (formData: RegisterFormData) => {
    const requestData: RegisterRequestData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      gender: formData.gender as "M" | "F",
      birth_date: formData.birth_date,
    };

    const response = await fetch("http://13.125.180.222/api/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.status === 400) {
      throw new Error("이미 가입되어 있는 이메일입니다.");
    }

    if (!response.ok) {
      throw new Error("회원가입에 실패했습니다.");
    }

    return await response.json();
  }
);

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // 회원가입
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "회원가입에 실패했습니다.";
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
