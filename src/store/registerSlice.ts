import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RegisterFormData,
  RegisterRequestData,
  RegisterState,
} from "../types/register/user";

// 회원가입
export const register = createAsyncThunk<void, RegisterFormData>(
  "register/register",
  async (formData, { rejectWithValue }) => {
    try {
      const requestData: RegisterRequestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        gender: formData.gender as "M" | "F",
        birth_date: formData.birth_date,
      };

      const response = await fetch(
        "http://13.125.180.222/api/users/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "이미 가입되어 있는 이메일입니다."
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "회원가입에 실패했습니다."
      );
    }
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
    clearRegisterError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "회원가입에 실패했습니다.";
      });
  },
});

export const { resetRegisterState, clearRegisterError } = registerSlice.actions;

export default registerSlice.reducer;
