interface LikedCourse {
  course_id: number;
  course_image: string;
  description: string;
  title: string;
}

export interface LikedCourseItem {
  course: {
    course_id: number;
    course_image: string;
    description: string;
    title: string;
  };
  liked_at: string;
}

export interface LikedCoursesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LikedCourseItem[];
}

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
  likedCourses: LikedCourse[];
  likedCoursesLoading: boolean;
}
