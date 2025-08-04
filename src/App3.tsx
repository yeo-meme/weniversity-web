import React, { useState } from 'react';
import { VideoPlayer } from './components/video/VideoPlayer';
import { WatchProgressService } from './services/ WatchProgressService';
import { chaptersData } from './data/chapters';
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string>('user123');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [view, setView] = useState<'player' | 'dashboard'>('player');

  const clearUserData = () => {
    WatchProgressService.clearAllUserData(currentUser);
    // 강제 리렌더링을 위해 다른 사용자로 변경 후 다시 변경
    const temp = currentUser;
    setCurrentUser('temp');
    setTimeout(() => setCurrentUser(temp), 100);
  };

  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setView('player');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 TypeScript React 비디오 진행률 시스템
          </h1>
          
          {/* 컨트롤 패널 */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user123">사용자 123</option>
              <option value="user456">사용자 456</option>
              <option value="user789">사용자 789</option>
            </select>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {chaptersData.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title} ({chapter.duration})
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('player')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'player' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Play className="w-4 h-4 inline mr-2" />
                플레이어
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'dashboard' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                대시보드
              </button>
            </div>

            <button
              onClick={clearUserData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              🗑️ {currentUser} 데이터 삭제
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {view === 'player' ? (
              <VideoPlayer 
                userId={currentUser} 
                chapterId={selectedChapter}
                onProgressUpdate={(progress) => {
                  console.log('Progress updated:', progress);
                }}
              />
            ) : (
              <ProgressDashboard 
                userId={currentUser}
                onChapterSelect={handleChapterSelect}
              />
            )}
          </div>
          
          {/* 사이드바 */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3 text-gray-700">
                📁 파일 구조
              </h3>
              <div className="text-xs text-gray-600 space-y-2">
                <div>📁 <strong>types/</strong></div>
                <div className="ml-4">📄 video.ts</div>
                <div>📁 <strong>data/</strong></div>
                <div className="ml-4">📄 chapters.ts</div>
                <div>📁 <strong>services/</strong></div>
                <div className="ml-4">📄 WatchProgressService.ts</div>
                <div>📁 <strong>hooks/</strong></div>
                <div className="ml-4">📄 useWatchProgress.ts</div>
                <div>📁 <strong>components/</strong></div>
                <div className="ml-4">📄 VideoPlayer.tsx</div>
                <div className="ml-4">📄 ProgressDashboard.tsx</div>
                <div>📁 <strong>utils/</strong></div>
                <div className="ml-4">📄 formatters.ts</div>
                <div>📄 <strong>App.tsx</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
