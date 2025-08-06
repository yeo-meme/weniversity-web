// src/App.tsx
import React, { useState } from 'react';
import StudyPlayeringSystem from './components/video/StudyPlayer';
import PlayeringSystem from './components/video/StudyLayoutPlayer';

const App: React.FC = () => {
  const [showVideoSystem, setShowVideoSystem] = useState(false);
  const [currentUser, setCurrentUser] = useState('user123');

  const courseData = {
    id: 1,
    title: "프로그래밍 기초 강의",
    description: "변수, 연산자, 조건문, 반복문, 함수의 기본 개념을 학습합니다."
  };

  if (showVideoSystem) {
    return (
      <PlayeringSystem
        onClose={() => setShowVideoSystem(false)}
        courseData={courseData}
        userId={currentUser}
      />
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">강의 목록</h1>
      <button
        onClick={() => setShowVideoSystem(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        강의 시작
      </button>
    </div>
  );
};

export default App;