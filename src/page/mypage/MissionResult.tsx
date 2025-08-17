// components/mission/MyPage.tsx
import React from "react";
import { useGetMissionResultsQuery, useGetMissionStatisticsQuery } from '../../auth/missionApiSlice';

const MissionResult: React.FC = () => {
  // RTK Query Hooks - 자동으로 요청하고 상태를 관리
  const { data: missionResults, error, isLoading } = useGetMissionResultsQuery();
  const { data: statistics } = useGetMissionStatisticsQuery();

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

  const resultsToDisplay = missionResults ?? []; // undefined일 경우 빈 배열 사용

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-50 text-gray-800 ">
      <div className="w-full max-w-4xl">
        {/* 통계 정보 영역 */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-gray-900">학습 통계</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              <div className="text-xl md:text-2xl font-bold text-yellow-600">{displayStatistics.total_submitted}</div>
              <div className="text-gray-600 text-xs md:text-sm">제출한 문제</div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              <div className="text-xl md:text-2xl font-bold text-indigo-600">{displayStatistics.skipped_count}</div>
              <div className="text-gray-600 text-xs md:text-sm">건너뛴 문제</div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              <div className="text-xl md:text-2xl font-bold text-green-600">{displayStatistics.solved_count}</div>
              <div className="text-gray-600 text-xs md:text-sm">맞춘 문제</div>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{displayStatistics.accuracy}%</div>
              <div className="text-gray-600 text-xs md:text-sm">정답률</div>
            </div>
          </div>
        </div>

        {/* 문제별 상세 결과 영역 */}
        <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-gray-900">제출한 문제 목록</h2>
          {resultsToDisplay.length === 0 ? (
            <div className="text-center text-gray-500 py-8">제출한 문제가 없습니다.</div>
          ) : (
            <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
              {resultsToDisplay.map((mission: any) => {
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
                  <div
                    key={mission.problem_id}
                    className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-900">{mission.title}</h3>
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                    </div>

                    {/* 코드 블록 */}
                    <pre className="mt-2 p-3 text-sm md:text-base bg-gray-100 rounded-md overflow-x-auto text-gray-800">
                      <code className="whitespace-pre-wrap font-mono">{mission.user_code}</code>
                    </pre>

                    {/* 제출일 */}
                    <div className="mt-3 text-xs text-gray-500 text-right">제출일: {new Date(mission.submitted_at).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionResult;