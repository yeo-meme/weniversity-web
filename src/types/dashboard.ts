export interface Course {
    id: string;
    title: string;
    category: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    daysRemaining: number;
    isBoostCommunity: boolean;
    thumbnail: string;
  }
  
  export interface Mission {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }