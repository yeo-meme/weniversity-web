import React, { useState } from "react";
import CourseList from "./pages/courses/CourseList";
import VideoLearningSystem from "./components/video/VideoLearningSystem";


interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  chapters: number;
  students: number;
  level: string;
}

const App2: React.FC = () => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // 👈 타입 수정

  // handleStartLearning 타입 수정
  const handleStartLearning = (course: Course) => { // 👈 any → Course
    console.log('handleStartLearning 실행됨:', course); // 디버깅
    setSelectedCourse(course);
    setShowVideoPlayer(true);
    console.log('showVideoPlayer 상태:', true); // 디버깅
  };

  const handleCloseVideo = () => {
    setShowVideoPlayer(false);
    setSelectedCourse(null);
  };

  return (
    <div>
      {/* 조건부 렌더링: 둘 중 하나만 보여주기 */}
      {!showVideoPlayer ? (
        <CourseList onStartLearning={handleStartLearning} />
      ) : (
        <VideoLearningSystem 
          onClose={handleCloseVideo}
          courseData={selectedCourse}
        />
      )}
    </div>
  );
};

export default App2;