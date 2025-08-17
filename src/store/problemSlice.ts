import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProblemState } from '../types/mission/problem';
import { problems } from '../data/problems';

const initialState: ProblemState = {
  problems,
  currentVideoIndex: 0,
  currentProblemId: 1,
  isPopupOpen: false,
  userCode: '',
  showResultPage: false,
  problemResults: {},
  quizTriggerIndices: [3, 5], // 기본값 : 3번째, 5번째 영상완료 후 퀴즈 팝업
  missionResults: [], // 서버에서 가져온 미션 결과
  statistics: {
    total_submitted: 0,
    solved_count: 0,
    skipped_count: 0,
    accuracy: 0,
  },
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setCurrentVideoIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.problems.length) {
        state.currentVideoIndex = action.payload;
      }
    },
    openPopup: (state) => {
      state.isPopupOpen = true;
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
    },
    setUserCode: (state, action: PayloadAction<string>) => {
      state.userCode = action.payload;
    },
    saveProblemResult: (state, action: PayloadAction<{ problemId: number; userCode: string }>) => {
      state.problemResults[action.payload.problemId] = {
        userCode: action.payload.userCode,
        submittedAt: new Date(),
      };
    },
    nextProblem: (state) => {
      // 문제를 제출하거나 건너뛰면:
      state.currentVideoIndex = state.currentVideoIndex + 1;;

      const currentIndex = state.problems.findIndex((p) => p.id === state.currentProblemId);
      if (currentIndex < state.problems.length - 1) {
        state.currentProblemId = state.problems[currentIndex + 1].id;
        state.isPopupOpen = false;
        // 문제 배열에서 다음 문제를 찾아 defaultCode를 userCode 상태에 설정
        const nextProblem = state.problems[currentIndex + 1];
        if (nextProblem) {
            state.userCode = nextProblem.defaultCode;
        } else {
            // 만약 다음 문제가 예상과 다르게 없다면 기본 템플릿
            state.userCode = 'function solution() {\n  // 여기에 코드를 작성하세요.\n}';
        }
      } else {
        state.showResultPage = true;
        state.isPopupOpen = false;
      }
    },
    closeResultPage: (state) => {
      state.showResultPage = false;
      state.isPopupOpen = false;
    },
    setShowResultPage: (state, action: PayloadAction<boolean>) => {
      state.showResultPage = action.payload;
    },
    setQuizTriggerIndices: (state, action: PayloadAction<number[]>) => {
      // 유효성 검사: 1 이상, 문제 수 이하
      const maxIndex = state.problems.length;
      const validIndices = action.payload.filter((index) => index >= 1 && index <= maxIndex).sort((a, b) => a - b); // 정렬 (선택사항)

      state.quizTriggerIndices = validIndices;
    },
  },
});

export const { 
  setCurrentVideoIndex, 
  openPopup, 
  closePopup, 
  setUserCode, 
  nextProblem, 
  saveProblemResult, 
  closeResultPage, 
  setShowResultPage, 
  setQuizTriggerIndices 
} = problemSlice.actions;
export default problemSlice.reducer;