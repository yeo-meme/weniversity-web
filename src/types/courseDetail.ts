// types/courseDetail.ts

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isActive?: boolean;
  videoUrl?: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isExpanded?: boolean;
}

export interface CourseInstructor {
  id: string;
  name: string;
  englishName?: string;
  profileImage: string;
  role: string;
  currentPositions: string[];
  previousPositions: string[];
  education: string[];
  achievements: string[];
  bio?: string;
}

export interface CourseFAQ {
  id: string;
  question: string;
  answer: string;
  isExpanded?: boolean;
}

export interface CourseSchedule {
  recruitmentPeriod: {
    start: string;
    end: string;
  };
  coursePeriod: {
    start: string;
    end: string;
    duration: string;
    totalHours: string;
    schedule: string;
  };
}

export interface CourseDetailInfo {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructor: CourseInstructor;
  category: string;
  level: "초급" | "중급" | "고급" | "실무";
  type: string; // 부스트 커뮤니티, VOD, KDC 등
  subject: string; // 백엔드 개발, 프론트엔드 등
  price: number;
  currency: string;
  thumbnailImage: string;
  bannerImage?: string;
  totalLessons: number;
  totalDuration: string;
  validityPeriod: string; // 수강 기간
  tags: string[];
  schedule: CourseSchedule;
  curriculum: CourseChapter[];
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
