import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UILecture {
  id: number;
  title: string;
  time: string;        // "0:00"
  duration: string;    // "5:00"  
  durationSeconds: number;
  videoFile: string;
  completed: boolean;
}

interface WatchProgressState {
  userId: string;
  lectureId: number;
  lectures: UILecture[];
  totalLectures: number;
  completedLectures: number;
}

interface ProgressState {
  cachedProgress: Record<number, WatchProgressState>;
  realtimeCache: any;
  currentLectureIndex: number;
  currentTime: number;
  duration: number;
  completedLectures: number[];
  lectureProgress: Record<number, number>;
  startTime: number;
  hasProgressData: boolean;
  isVideoPlaying: boolean;
  lastSaveTime: number;
  expandedGroups: number[];
  lectureTitle: string;
  lectures: UILecture[]; // 🔥 UILecture 타입 사용
}

const initialState: ProgressState = {
  cachedProgress: {},
  realtimeCache: {},
  currentLectureIndex: -1,
  currentTime: 0,
  duration: 0,
  completedLectures: [],
  lectureProgress: {},
  startTime: 0,
  hasProgressData: false,
  isVideoPlaying: false,
  lastSaveTime: 0,
  expandedGroups: [1, 2],
  lectureTitle: "강의를 선택해주세요",
  lectures: [],
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // 🔥 UILecture 배열 설정
    setLectures: (state, action: PayloadAction<UILecture[]>) => {
      state.lectures = action.payload;
      console.log('🔥 Redux: 강의 설정됨', action.payload.length, '개');
      
      // 완료된 강의들을 배열로 업데이트
      state.completedLectures = action.payload
        .filter(lecture => lecture.completed)
        .map(lecture => lecture.id)
        .filter((lectureId, index, self) => self.indexOf(lectureId) === index);
    },
    
    setLectureTitle: (state, action: PayloadAction<string>) => {
      state.lectureTitle = action.payload;
      console.log('🔥 Redux: 코스 제목 설정됨', action.payload);
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    setCurrentLectureIndex: (state, action: PayloadAction<number>) => {
      state.currentLectureIndex = action.payload;
      console.log('🔥 Redux: 현재 강의 인덱스 설정됨', action.payload);
    },
    
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
      console.log('🔥 Redux: 시작 시간 설정됨', action.payload);
    },
    
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    
    setIsVideoPlaying: (state, action: PayloadAction<boolean>) => {
      state.isVideoPlaying = action.payload;
      console.log('🔥 Redux: 비디오 재생 상태', action.payload);
    },
    
    // 완료된 강의 관리
    addCompletedLecture: (state, action: PayloadAction<number>) => {
      const lectureId = action.payload;
      if (!state.completedLectures.includes(lectureId)) {
        state.completedLectures.push(lectureId);
        console.log('🔥 Redux: 완료된 강의 추가됨', lectureId);
      }
    },
    
    setCompletedLectures: (state, action: PayloadAction<number[]>) => {
      state.completedLectures = action.payload;
    },
    
    // 강의 진행률 업데이트
    updateLectureProgress: (state, action: PayloadAction<{ lectureId: number; progress: number }>) => {
      const { lectureId, progress } = action.payload;
      state.lectureProgress[lectureId] = progress;
    },
    
    // 진행률 데이터 존재 여부
    setHasProgressData: (state, action: PayloadAction<boolean>) => {
      state.hasProgressData = action.payload;
      console.log('🔥 Redux: 진행률 데이터 여부', action.payload);
    },
    
    // 마지막 저장 시간 업데이트
    setLastSaveTime: (state, action: PayloadAction<number>) => {
      state.lastSaveTime = action.payload;
    },
    
    updateLastSaveTime: (state) => {
      state.lastSaveTime = Date.now();
    },
    
    // 상태 초기화
    resetProgressState: (state) => {
      Object.assign(state, initialState);
      console.log('🔥 Redux: 진행률 상태 초기화됨');
    },
  },
});

export const {
  setLectures,
  setLectureTitle,
  setDuration,
  setCurrentLectureIndex,
  setStartTime,
  setCurrentTime,
  setIsVideoPlaying,
  addCompletedLecture,
  setCompletedLectures,
  updateLectureProgress,
  setHasProgressData,
  setLastSaveTime,
  updateLastSaveTime,
  resetProgressState,
} = progressSlice.actions;

export default progressSlice.reducer;

// 🔥 셀렉터들
export const selectLectures = (state: { progress: ProgressState }) => state.progress.lectures;
export const selectCurrentLectureIndex = (state: { progress: ProgressState }) => state.progress.currentLectureIndex;
export const selectCurrentLecture = (state: { progress: ProgressState }) => {
  const { lectures, currentLectureIndex } = state.progress;
  return currentLectureIndex >= 0 && currentLectureIndex < lectures.length 
    ? lectures[currentLectureIndex] 
    : null;
};
export const selectCompletedLectures = (state: { progress: ProgressState }) => state.progress.completedLectures;