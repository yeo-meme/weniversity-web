export interface Chapter {
    id: number;
    title: string;
    videoFile: string;
    durationSeconds: number;
    time: string;        // "15:00" 형태
    duration: string;    // "8:00" 형태
    order: number;
  }
  
export interface Course {
    id: number;
    title: string;
    description: string;
    chapters: Chapter[];
    totalDuration: number;
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  