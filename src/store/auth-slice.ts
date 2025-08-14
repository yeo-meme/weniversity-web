import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access?: string;
  refresh?: string;
  email?: string;
  role?: string;
  success?: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      email: string;
      name: string;
    };
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// 비동기 로그인 액션
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "로그인에 실패했습니다.");
    }

    return data;
  } catch (error) {
    return rejectWithValue("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_role");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.error = null;

          const data = action.payload;

          if (data.access) {
            state.isAuthenticated = true;
            state.token = data.access;
            state.refreshToken = data.refresh || null;
            state.user = {
              email: data.email || "",
              role: data.role,
            };

            // localStorage 저장
            localStorage.setItem("access_token", data.access);
            if (data.refresh)
              localStorage.setItem("refresh_token", data.refresh);
            if (data.email) localStorage.setItem("user_email", data.email);
            if (data.role) localStorage.setItem("user_role", data.role);
          } else if (data.success && data.data?.token) {
            state.isAuthenticated = true;
            state.token = data.data.token;
            state.user = {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
            };

            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user_email", data.data.user.email);
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "로그인에 실패했습니다.";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
