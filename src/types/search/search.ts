export interface SearchState {
  courses: Course[];
  searchQuery: string;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

export interface SearchParams {
  title: string;
  page?: number;
}

export interface SearchApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

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

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
