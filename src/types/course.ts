export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  level: "초급" | "중급" | "고급";
  duration?: string;
  price?: number;
}

export interface CourseFilters {
  categories: string[];
  subjects: string[];
  levels: string[];
  formats: string[];
  prices: string[];
}

export interface CourseState {
  courses: Course[];
  filteredCourses: Course[];
  filters: CourseFilters;
  activeFilters: {
    categories: string[];
    subjects: string[];
    levels: string[];
    formats: string[];
    prices: string[];
  };
  loading: boolean;
  error: string | null;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
