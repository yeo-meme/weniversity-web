export interface TestCase {
  input: any[];
  output: any;
}

//문제 데이터 구조 정의
export interface Problem {
  id: number;
  title: string;
  description: string;
  testCases: TestCase[];
  defaultCode: string;
}

export interface ProblemResult {
  userCode: string;
  submittedAt?: Date;
}

export interface ProblemState {
  problems: Problem[];
  currentVideoIndex: number;
  currentProblemId: number;
  isPopupOpen: boolean;
  userCode: string;
  showResultPage: boolean;
  problemResults: Record<number, ProblemResult>;
  quizTriggerIndices: number[];
  missionResults: any[]; // 서버에서 가져온 미션 결과
  statistics: {
    total_submitted: number;
    solved_count: number;
    skipped_count: number;
    accuracy: number;
  };
  loading: boolean;
  error: string | null;
}