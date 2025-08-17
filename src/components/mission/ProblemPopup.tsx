// components/mission/ProblemPopup.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hook';
import { setUserCode, nextProblem, saveProblemResult } from '../../store/problemSlice';
import type { RootState } from '../../store/index';
import { useSubmitMissionMutation } from '../../auth/missionApiSlice';

const ProblemPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentVideoIndex = useAppSelector((state: RootState) => state.problem.currentVideoIndex);
  const problems = useAppSelector((state: RootState) => state.problem.problems);
  const currentProblem = problems[currentVideoIndex]; // 인덱스 기반 접근
  const userCodeFromState = useAppSelector((state: RootState) => state.problem.userCode); // userCode는 Redux 상태에서 가져오되, 문제 변경 시 기본값 설정
  const [submitMission, { isLoading, isError, error }] = useSubmitMissionMutation(); // RTK Query Mutation 훅
  
  // 문제 변경 시 userCode를 해당 문제의 defaultCode로 설정
  useEffect(() => {
    if (currentProblem && userCodeFromState === '') {
       dispatch(setUserCode(currentProblem.defaultCode));
    }
  }, [currentProblem, userCodeFromState, dispatch]);
  
  // 문제 평가 함수 (기존 ResultPage에서 가져옴)
  const getProblemResult = (problem: any, userCode: string) => {
    if (userCode === '') {
      return { isCorrect: false, message: '코드가 없습니다' };
    }
    
    if (!userCode.trim()) {
      return { isCorrect: false, message: '코드가 없습니다' };
    }

    try {
      const functionSignatureMatch = userCode.match(/function\s+solution\s*\(([^)]*)\)/);
      const paramsString = functionSignatureMatch?.[1]?.trim() || '';
      const paramNames = paramsString
        ? paramsString.split(',').map(p => p.trim()).filter(p => p)
        : [];

      const functionMatch = userCode.match(/function\s+solution\s*\([^)]*\)\s*{([\s\S]*)}/);
      let functionBody = '';
      if (functionMatch && functionMatch[1]) {
        functionBody = functionMatch[1].trim();
      } else {
        throw new Error('solution 함수의 정의 또는 본문을 찾을 수 없습니다.');
      }

      if (!functionBody) {
         throw new Error('함수 본문이 비어 있습니다.');
      }

      const functionConstructorArgs = [...paramNames, functionBody];
      // eslint-disable-next-line no-new-func
      const userFunction = new Function(...functionConstructorArgs);

      for (const testCase of problem.testCases) {
        try {
          const result = userFunction(...testCase.input);
          
          if (result !== testCase.output) {
            return {
              isCorrect: false,
              message: `테스트 케이스 실패: 입력 ${JSON.stringify(testCase.input)} -> 기대값 ${JSON.stringify(testCase.output)}, 실제 출력 ${JSON.stringify(result)}`
            };
          }
        } catch (testError: any) {
          return {
            isCorrect: false,
            message: `테스트 케이스 실행 오류 (입력: ${JSON.stringify(testCase.input)}): ${testError.message || '알 수 없는 오류'}`
          };
        }
      }
      return { isCorrect: true, message: '정답입니다!' };
    } catch (error: any) {
      return { isCorrect: false, message: `코드 실행 오류: ${error.message || '알 수 없는 오류'}` };
    }
  };

  const handleSubmit = async () => {
    if (!currentProblem) return;
    
    // 로컬 평가
    const evaluation = getProblemResult(currentProblem, userCodeFromState);
    
    // 1. Redux 상태 저장
    dispatch(saveProblemResult({
      problemId: currentProblem.id,
      userCode: userCodeFromState
    }));
    
    // 2. 서버에 제출
    try {
      await submitMission({
        problem_id: currentProblem.id,
        title: currentProblem.title,
        user_code: userCodeFromState,
        is_correct: evaluation.isCorrect,
        message: evaluation.message,
      }).unwrap(); // Promise를 unwrap하여 오류를 직접 throw
      console.log("미션 제출 성공");
    } catch (err) {
      console.error("미션 제출 실패:", err);
      return; // 오류 시 다음 문제로 넘어가지 않음
    }

    // 3. 성공 시 다음 문제로
    dispatch(nextProblem());
  };

  const handleSkip = async () => {
    if (!currentProblem) return;
    
    // 1. Redux 상태에 빈 코드로 저장
    dispatch(saveProblemResult({
      problemId: currentProblem.id,
      userCode: ''
    }));

    // 2. 서버에 건너뛴 문제 제출
    try {
      await submitMission({
        problem_id: currentProblem.id,
        title: currentProblem.title,
        user_code: '',
        is_correct: false,
        message: '코드가 없습니다',
      }).unwrap();
      console.log("미션 건너뛰기 제출 성공");
    } catch (err) {
      console.error("미션 건너뛰기 제출 실패:", err);
      return;
    }

    // 3. 성공 시 다음 문제로
    dispatch(nextProblem());
  };

  return (
  <div className="absolute inset-0 bg-white text-gray-800 p-4 md:p-8 overflow-y-auto transition-opacity duration-500 ease-in-out">
    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">{currentProblem.title}</h2>
    
    <div className="mb-4 md:mb-6 text-sm md:text-base text-gray-700">{currentProblem.description}</div>
    
    <div className="bg-gray-100 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm">
      <textarea
        className="w-full h-32 md:h-40 bg-white text-gray-800 outline-none resize-none border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={userCodeFromState}
        onChange={(e) => dispatch(setUserCode(e.target.value))}
        placeholder="여기에 코드를 입력하세요..."
      />
    </div>
    
    <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
      <button
        onClick={handleSubmit}
        className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base shadow-sm"
      >
        코드 제출
      </button>
      <button
        onClick={handleSkip}
        className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm md:text-base shadow-sm"
      >
        건너뛰기
      </button>
    </div>
    
    <div className="mt-3 md:mt-4 text-gray-500 text-xs md:text-sm">
      * 코드를 입력하고 제출하거나 건너뛸 수 있습니다. 제출 후 다음 문제가 제공됩니다.
    </div>
  </div>
);
};

export default ProblemPopup;