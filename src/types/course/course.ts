export interface Course {
  course_id: string;
  title: string;
  instructors: Instructors[];
  course_image: string;
  type: string;
  category: string;
  level: string;
  duration?: string;
  price?: number;
  description: string;
}

export interface Instructors {
  name: string;
  profile_image: string;
  affiliation: string;
}

export interface CourseFilters {
  categories: string[];
  types: string[];
  levels: string[];
  prices: string[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface CourseState {
  courses: Course[];
  filters: CourseFilters;
  activeFilters: {
    categories: string[];
    types: string[];
    levels: string[];
    prices: string[];
  };
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  likedCourses: string[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
