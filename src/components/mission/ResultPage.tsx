import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hook";
import { closeResultPage } from "../../store/problemSlice";
import type { RootState } from "../../store/index";
import { useGetMissionResultsQuery, useGetMissionStatisticsQuery } from "../../auth/missionApiSlice";

const ResultPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { problems, problemResults } = useAppSelector((state: RootState) => state.problem);

  // RTK Query Hooks - 자동으로 요청하고 상태를 관리
  const { data: missionResults, error, isLoading } = useGetMissionResultsQuery();
  const { data: statistics } = useGetMissionStatisticsQuery();

  const getProblemResult = (problem: any, userCode: string) => {
    if (userCode === "") {
      return { isCorrect: false, message: "코드가 없습니다" };
    }

    if (!userCode.trim()) {
      return { isCorrect: false, message: "코드가 없습니다" };
    }

    try {
      const functionSignatureMatch = userCode.match(/function\s+solution\s*\(([^)]*)\)/);
      const paramsString = functionSignatureMatch?.[1]?.trim() || "";
      const paramNames = paramsString
        ? paramsString
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p)
        : [];

      const functionMatch = userCode.match(/function\s+solution\s*\([^)]*\)\s*{([\s\S]*)}/);
      let functionBody = "";
      if (functionMatch && functionMatch[1]) {
        functionBody = functionMatch[1].trim();
      } else {
        throw new Error("solution 함수의 정의 또는 본문을 찾을 수 없습니다.");
      }

      if (!functionBody) {
        throw new Error("함수 본문이 비어 있습니다.");
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
              message: `테스트 케이스 실패: 입력 ${JSON.stringify(testCase.input)} -> 기대값 ${JSON.stringify(testCase.output)}, 실제 출력 ${JSON.stringify(result)}`,
            };
          }
        } catch (testError: any) {
          return {
            isCorrect: false,
            message: `테스트 케이스 실행 오류 (입력: ${JSON.stringify(testCase.input)}): ${testError.message || "알 수 없는 오류"}`,
          };
        }
      }
      return { isCorrect: true, message: "정답입니다!" };
    } catch (error: any) {
      return { isCorrect: false, message: `코드 실행 오류: ${error.message || "알 수 없는 오류"}` };
    }
  };

  const handleClose = () => {
    dispatch(closeResultPage());
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  // 오류 표시
  if (error) {
    return <div className="text-center py-8 text-red-500">데이터 로드 실패: {error?.data?.detail || error?.message || '알 수 없는 오류'}</div>;
  }

  // 통계 데이터가 없을 경우 로컬 계산 (백업)
  const displayStatistics = statistics || {
    total_submitted: 0,
    solved_count: 0,
    skipped_count: 0,
    accuracy: 0
  };

  // 로컬 평가 결과 계산
  const submittedProblemIds = Object.keys(problemResults).map(Number);
  const submittedProblems = problems.filter((problem) => submittedProblemIds.includes(problem.id));

  const evaluatedResults = submittedProblems.map((problem) => {
    const result = problemResults[problem.id];
    return {
      problemId: problem.id,
      evaluation: getProblemResult(problem, result.userCode),
    };
  });

  const submittedCount = submittedProblems.length;
  const solvedCount = evaluatedResults.filter((res) => res.evaluation.isCorrect).length;
  const skippedCount = evaluatedResults.filter((res) => !res.evaluation.isCorrect && res.evaluation.message === "코드가 없습니다").length;
  const accuracy = submittedCount > 0 ? Math.round((solvedCount / submittedCount) * 100) : 0;

  // 서버 데이터 사용 (우선순위 높음)
  const displaySubmittedCount = displayStatistics.total_submitted || submittedCount;
  const displaySolvedCount = displayStatistics.solved_count || solvedCount;
  const displaySkippedCount = displayStatistics.skipped_count || skippedCount;
  const displayAccuracy = displayStatistics.accuracy || accuracy;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white text-gray-800 p-4 md:p-6 overflow-y-auto">
      {/* --- 통계 정보 영역 --- */}
      <div className="w-full max-w-4xl bg-gray-50 rounded-lg p-4 md:p-6 mb-6 border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-center text-gray-900">📊 제출 결과 요약</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">{displaySubmittedCount}</div>
            <div className="text-gray-600 text-xs md:text-sm">제출한 문제</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-indigo-600">{displaySkippedCount}</div>
            <div className="text-gray-600 text-xs md:text-sm">건너뛴 문제</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-green-600">{displaySolvedCount}</div>
            <div className="text-gray-600 text-xs md:text-sm">맞춘 문제</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl md:text-2xl font-bold text-purple-600">{displayAccuracy}%</div>
            <div className="text-gray-600 text-xs md:text-sm">정답률</div>
          </div>
        </div>
      </div>

      {/* --- 문제별 상세 결과 영역 --- */}
      <div className="w-full max-w-4xl bg-gray-50 rounded-lg p-4 md:p-6 mb-6 flex-1 overflow-hidden flex flex-col border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-center text-gray-900">📋 제출한 문제 결과</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">로딩 중...</div>
        ) : missionResults && missionResults.length > 0 ? (
          // 서버 데이터 표시
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="space-y-3 md:space-y-4">
              {missionResults.map((mission: any) => {
                let statusLabel = "시도 안함";
                let statusClass = "bg-gray-500 text-white";

                if (mission.message === "코드가 없습니다") {
                  statusLabel = "건너뜀";
                  statusClass = "bg-indigo-500 text-white";
                } else if (mission.is_correct) {
                  statusLabel = "정답";
                  statusClass = "bg-green-500 text-white";
                } else {
                  statusLabel = "오답";
                  statusClass = "bg-red-500 text-white";
                }

                return (
                  <div key={mission.problem_id} className="border border-gray-300 rounded-lg p-3 md:p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-900">{mission.title}</h3>
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                    </div>

                    <div className="mt-2 text-xs text-gray-600">{mission.message}</div>

                    <div className="mt-1 text-xs text-gray-500">제출일: {new Date(mission.submitted_at).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : submittedProblems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">제출한 문제가 없습니다.</div>
        ) : (
          // 로컬 데이터 표시
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="space-y-3 md:space-y-4">
              {submittedProblems.map((problem) => {
                const result = problemResults[problem.id];
                const evaluatedResult = evaluatedResults.find((res) => res.problemId === problem.id);
                const evaluation = evaluatedResult?.evaluation;

                let statusLabel = "시도 안함";
                let statusClass = "bg-gray-500 text-white";
                if (evaluation) {
                  if (evaluation.message === "코드가 없습니다") {
                    statusLabel = "건너뜀";
                    statusClass = "bg-indigo-500 text-white";
                  } else if (evaluation.isCorrect) {
                    statusLabel = "정답";
                    statusClass = "bg-green-500 text-white";
                  } else {
                    statusLabel = "오답";
                    statusClass = "bg-red-500 text-white";
                  }
                }

                return (
                  <div key={problem.id} className="border border-gray-300 rounded-lg p-3 md:p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-900">{problem.title}</h3>
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                    </div>

                    {evaluation && <div className="mt-2 text-xs text-gray-600">{evaluation.message}</div>}

                    {result && result.userCode && statusLabel !== "건너뜀" && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-1">제출한 코드:</p>
                        <pre className="bg-gray-100 p-2 md:p-3 rounded text-xs overflow-x-auto max-h-32 md:max-h-40 overflow-y-auto border border-gray-200">{result.userCode}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button onClick={handleClose} className="w-full px-6 py-2 md:px-8 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base md:text-lg font-semibold shadow-md">
        닫기
      </button>
    </div>
  );
};

export default ResultPage;
