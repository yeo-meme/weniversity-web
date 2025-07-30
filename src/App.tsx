import React, { useState } from 'react';
import LearnerDashboard from './pages/dashboard/LearnerDashboard';
import MissionPage from './pages/mission/MissionPage';
import VideoPage from './pages/video/VideoPage';
import './index.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  if (showDashboard) {
    return <LearnerDashboard />;
  }

  if (showMission) {
    return <MissionPage />;
  }

  if (showVideo) {
    return <VideoPage />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <button 
        onClick={() => setShowDashboard(true)}
        className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        대시보드로 이동
      </button>
      <button 
        onClick={() => setShowMission(true)}
        className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        미션 이동
      </button>
      <button 
        onClick={() => setShowVideo(true)}
        className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        비디오 이동
      </button>
    </div>
  );
}

export default App;