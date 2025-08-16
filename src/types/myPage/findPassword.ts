export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}

export interface PasswordResetState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}
