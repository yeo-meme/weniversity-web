import React, { useState } from 'react';
import { WatchProgressService } from './services/WatchProgressService';
// chaptersData import 제거 - WatchProgressService 내부에서 사용

//진행률생성 업데이트 실제 돌아가는 목업 테스트 
// 챕터 데이터를 직접 정의 (임시)
const chaptersData = [
  { id: 1, title: "변수와 상수", duration: "5:00" },
  { id: 2, title: "연산자 종류", duration: "10:00" },
  { id: 3, title: "조건문 기초", duration: "8:00" },
  { id: 4, title: "반복문 활용", duration: "12:00" },
  { id: 5, title: "함수 정의", duration: "15:00" },
  { id: 6, title: "실습 문제", duration: "10:00" }
];

const App3: React.FC = () => {
  const [testUser] = useState('testuser123');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [testResults, setTestResults] = useState<string[]>([]);

  // 로그를 화면에 표시하는 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setTestResults(prev => [...prev.slice(-9), logMessage]); // 최근 10개만 유지
    console.log(logMessage);
  };

  // 1. 새 진행률 생성 테스트
  const testCreateProgress = () => {
    addLog(`🔧 챕터 ${selectedChapter} 진행률 생성 시작...`);
    
    const result = WatchProgressService.createWatchProgress({
      userId: testUser,
      chapterId: selectedChapter,
      courseId: 1
    });
    
    if (result) {
      addLog(`✅ 생성 성공: ${result.id}`);
      addLog(`📊 초기 데이터: ${result.watchedPercentage}% 완료`);
    } else {
      addLog(`❌ 생성 실패`);
    }
  };

  // 2. 진행률 업데이트 테스트
  const testUpdateProgress = () => {
    const randomProgress = Math.floor(Math.random() * 100);
    const randomTime = Math.floor(Math.random() * 300); // 0~300초
    
    addLog(`🔧 챕터 ${selectedChapter} 진행률 업데이트: ${randomProgress}%`);
    
    const result = WatchProgressService.updateWatchProgress(testUser, selectedChapter, {
      currentTime: randomTime,
      watchedPercentage: randomProgress,
      totalWatchTime: randomTime * 1000, // 밀리초로 변환
      sessionCount: 1,
      watchSpeed: 1.0
    });
    
    if (result) {
      addLog(`✅ 업데이트 성공: ${result.watchedPercentage}% (${result.isCompleted ? '완료' : '진행중'})`);
      if (result.isCompleted) {
        addLog(`🎉 챕터 완료! 완료 시각: ${result.completedAt}`);
      }
    } else {
      addLog(`❌ 업데이트 실패 - 진행률 데이터가 없습니다.`);
    }
  };

  // 3. 진행률 조회 테스트
  const testGetProgress = () => {
    addLog(`🔍 챕터 ${selectedChapter} 진행률 조회...`);
    
    const result = WatchProgressService.getWatchProgress(testUser, selectedChapter);
    
    if (result) {
      addLog(`✅ 조회 성공: ${result.watchedPercentage}% 완료`);
      addLog(`📈 상세 정보: ${result.currentTime}초 / ${result.totalDuration}초`);
      addLog(`⏱️ 마지막 시청: ${new Date(result.lastWatchedAt).toLocaleString()}`);
    } else {
      addLog(`❌ 조회 실패 - 데이터가 없습니다.`);
    }
  };

  // 4. 전체 진행률 요약 테스트
  const testGetSummary = () => {
    addLog(`📊 ${testUser} 전체 진행률 요약 조회...`);
    
    const summary = WatchProgressService.getUserProgressSummary(testUser);
    
    addLog(`✅ 전체 진행률: ${summary.overallProgress.toFixed(1)}%`);
    addLog(`📚 완료 챕터: ${summary.completedChapters}/${summary.totalChapters}`);
    addLog(`⏱️ 총 학습 시간: ${Math.floor(summary.totalWatchTime / 1000)}초`);
    addLog(`📖 현재 챕터: ${summary.currentChapter}`);
  };

  // 5. 사용자별 모든 진행률 조회
  const testGetAllProgress = () => {
    addLog(`📋 ${testUser} 모든 챕터 진행률 조회...`);
    
    const allProgress = WatchProgressService.getUserProgress(testUser);
    
    if (allProgress.length > 0) {
      addLog(`✅ 총 ${allProgress.length}개 챕터 데이터 발견`);
      allProgress.forEach(progress => {
        addLog(`📹 ${progress.chapterInfo.title}: ${progress.watchedPercentage}% ${progress.isCompleted ? '✅' : '⏳'}`);
      });
    } else {
      addLog(`❌ 진행률 데이터가 없습니다.`);
    }
  };

  // 6. 데이터 삭제 테스트
  const testClearData = () => {
    addLog(`🗑️ ${testUser} 모든 데이터 삭제...`);
    WatchProgressService.clearAllUserData(testUser);
    addLog(`✅ 삭제 완료`);
  };

  // 로컬스토리지 확인
  const checkLocalStorage = () => {
    addLog(`💾 로컬스토리지 확인...`);
    
    let found = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('watch_progress_')) {
        found++;
        addLog(`🔑 발견: ${key}`);
      }
    }
    
    if (found === 0) {
      addLog(`❌ 관련 데이터가 없습니다.`);
    } else {
      addLog(`✅ 총 ${found}개 데이터 발견`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🧪 WatchProgressService 테스트
        </h1>

        {/* 테스트 설정 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 설정</h2>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                테스트 사용자: <span className="font-mono text-blue-600">{testUser}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                선택된 챕터:
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {chaptersData.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.id}. {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 테스트 버튼들 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 기능</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={testCreateProgress}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
            >
              1️⃣ 진행률 생성
            </button>
            <button
              onClick={testUpdateProgress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
            >
              2️⃣ 진행률 업데이트
            </button>
            <button
              onClick={testGetProgress}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
            >
              3️⃣ 진행률 조회
            </button>
            <button
              onClick={testGetSummary}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium"
            >
              4️⃣ 전체 요약
            </button>
            <button
              onClick={testGetAllProgress}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-medium"
            >
              5️⃣ 모든 진행률
            </button>
            <button
              onClick={checkLocalStorage}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium"
            >
              6️⃣ 스토리지 확인
            </button>
            <button
              onClick={testClearData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
            >
              🗑️ 데이터 삭제
            </button>
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
            >
              🧹 로그 클리어
            </button>
          </div>
        </div>

        {/* 테스트 결과 로그 */}
        <div className="bg-black rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">📝 테스트 로그</h2>
          <div className="font-mono text-sm text-green-400 space-y-1 max-h-80 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">테스트 버튼을 클릭하여 시작하세요...</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">{result}</div>
              ))
            )}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center text-gray-600">
          <p>💡 브라우저 개발자 도구(F12) → Console 탭에서도 상세한 로그를 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default App3;