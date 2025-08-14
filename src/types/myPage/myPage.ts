export interface Option {
  value: string;
  label: string;
}

export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  gender: "M" | "F";
  birth_date: string;
  profile_image?: string;
}

export interface ProfileFormData {
  name: string;
  gender: "M" | "F" | "";
  birth_date: string;
  profile_image?: File | null;
}

export interface ProfileValidationMessages {
  name?: string;
  gender?: string;
  birth_date?: string;
}

export interface MyPageState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}
