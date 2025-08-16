export interface Tag {
  text: string;
  type: "type" | "kind";
}

export interface Course {
  course_id: number;
  course_image: string;
  description: string;
  title: string;
}

export interface MyLecture {
  id?: string;
  course: Course;
  isExpired: boolean;
  progress: string;
  status: "active" | "completed" | "dropped";
  type: "vod" | "boost";
  thumbnailSrc?: string;
  tags?: Tag[];
  currentProgress?: number;
  totalLessons?: number;
  progressPercentage?: number;
}

export interface MyLectureFilters {
  types: string[];
  statuses: string[];
}

export interface MyLectureState {
  myLectures: MyLecture[];
  filters: {
    types: string[];
    statuses: string[];
  };
  activeFilters: {
    types: string[];
    statuses: string[];
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
  loading: boolean;
  error: string | null;
}

export interface MyLectureApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MyLecture[];
}

export interface FetchMyLecturesParams {
  page?: number;
  types?: string[];
  statuses?: string[];
}

export interface EnrollCourseRequest {
  courseId: string;
}

export interface EnrollCourseResponse {
  success: boolean;
  message: string;
  enrollment_id: number;
  course_id: number;
  is_enrolled: boolean;
  status: string;
}
