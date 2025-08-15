export interface ApiLectureTag {
  id: number;
  name: string;
  category: "type" | "level" | "subject";
}

export interface ApiLecture {
  id: number;
  title: string;
  thumbnail_url: string;
  description: string;
  instructor: string;
  tags: ApiLectureTag[];
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  status: "active" | "completed" | "dropped";
  type: "vod" | "boost";
  start_date: string;
  end_date: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiLecturesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiLecture[];
}

export interface LectureTag {
  text: string;
  type: "type" | "kind";
}

export interface Lecture {
  id: string;
  title: string;
  thumbnail: string;
  tags: LectureTag[];
  current_progress: number;
  total_lessons: number;
  progress_percentage: number;
  status: "active" | "completed" | "dropped";
  type: "vod" | "boost";
  is_expired: boolean;
}

export interface LecturesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lecture[];
}

export interface LectureQueryParams {
  type?: "vod" | "boost";
  status?: "active" | "completed" | "dropped" | "available" | "expired";
  page?: number;
  limit?: number;
}

export const transformApiLecture = (apiLecture: ApiLecture): Lecture => {
  return {
    id: apiLecture.id.toString(),
    title: apiLecture.title,
    thumbnail: apiLecture.thumbnail_url,
    tags: apiLecture.tags.map((tag) => ({
      text: tag.name,
      type: tag.category === "type" ? "type" : "kind",
    })),
    current_progress: apiLecture.completed_lessons,
    total_lessons: apiLecture.total_lessons,
    progress_percentage: apiLecture.progress_percentage,
    status: apiLecture.status,
    type: apiLecture.type,
    is_expired: apiLecture.is_expired,
  };
};
