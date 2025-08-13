export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isActive?: boolean;
  videoUrl?: string;
}

export interface CourseChapter {
  chapter_id: number;
  order_index: number;
  title: string;
  isExpanded?: boolean;
}

export interface CourseInstructor {
  instructor_id: string;
  name: string;
  english_name: string;
  profile_image: string;
  affiliation: string;
}

export interface CourseFAQ {
  id: string;
  question: string;
  answer: string;
  isExpanded?: boolean;
}

export interface CourseDetailInfo {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructors: CourseInstructor[];
  category: string;
  level: "초급" | "중급" | "실무";
  type: string;
  price: number;
  currency: string;
  thumbnailImage: string;
  bannerImage?: string;
  totalLessons: number;
  totalDuration: string;
  validityPeriod: string;
  course_duedate: string;
  course_time: string;
  chapters: CourseChapter[];
  faqs: CourseFAQ[];
  enrollmentCount?: number;
  rating?: number;
}

export type TabType =
  | "overview"
  | "schedule"
  | "curriculum"
  | "instructor"
  | "faq"
  | "apply";

export interface CourseDetailState {
  courseDetail: CourseDetailInfo | null;
  activeTab: TabType;
  loading: boolean;
  error: string | null;
  shareLoading: boolean;
  enrollmentLoading: boolean;
}
