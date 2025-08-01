import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  RegisterFormData,
  RegisterRequestData,
  RegisterState,
} from "../types/user";

// 이메일 중복 확인 API
// export const checkEmailDuplicate = createAsyncThunk(
//   "auth/checkEmailDuplicate",
//   async (email: string) => {
//     // 실제 API 호출 로직으로 대체
//     const response = await fetch(`/api/users/check-email/${email}`);

//     if (!response.ok) {
//       throw Error("이메일 확인 중 오류가 발생했습니다!");
//     }

//     const data = await response.json();
//     return data.isDuplicate;
//   }
// );

// 회원가입 API
export const register = createAsyncThunk(
  "auth/register",
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // 이메일 중복 확인
      // .addCase(checkEmailDuplicate.pending, state => {
      //   state.loading = true;
      // })
      // .addCase(checkEmailDuplicate.fulfilled, state => {
      //   state.loading = false;
      // })
      // .addCase(checkEmailDuplicate.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error =
      //     action.error.message || "이메일 확인 중 오류가 발생했습니다.";
      // })
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

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
