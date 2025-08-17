export interface RegisterFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  gender: "M" | "F" | "";
  birth_date: string;
}

export interface RegisterRequestData {
  email: string;
  password: string;
  name: string;
  gender: "M" | "F";
  birth_date: string;
}

export interface ValidationMessages {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  gender?: string;
  birth_date?: string;
}

export interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
