import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, BookOpen, Clock, CheckCircle, X } from 'lucide-react';

// VideoPlayer 컴포넌트
const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  
  // 재생 시간 감지
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };
  
  return (
    <div className="w-full">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        controls
        className="w-full aspect-video rounded-lg"
      >
        <source src="../../../public/video/video1.mp4" type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>
      <div className="mt-2 w-full h-2 bg-gray-300 rounded">
        <div className="h-full bg-blue-500 rounded" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

// Props 타입 정의
interface VideoLearningSystemProps {
  onClose: () => void;
  courseData: {
    id: number;
    title: string;
    description?: string;
    // 필요하면 다른 필드들도 추가
  } | null;
}

const VideoLearningSystem: React.FC<VideoLearningSystemProps> = ({ onClose, courseData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(125);
  const [duration] = useState(3600);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [watchedSections, setWatchedSections] = useState([
    { start: 0, end: 300, completed: true },
    { start: 300, end: 600, completed: true },
    { start: 600, end: 900, completed: false },
  ]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / duration) * 100;
  const watchedPercent = (watchedSections.reduce((acc, section) => 
    acc + (section.completed ? section.end - section.start : 0), 0) / duration) * 100;

  return (
    // 전체 페이지
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              <span>강의 목록으로</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {courseData?.title || '강의 제목'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Video Container */}
          <div className="relative bg-black group">
            <VideoPlayer />
            
            {/* Resume watching notification */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-90">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>2:05에서 이어보기</span>
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {courseData?.title || '강의 제목'}
                </h1>
                <p className="text-gray-600">
                  {courseData?.description || '프로그래밍의 기본 연산과 구문에 대해 학습합니다.'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>60분</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{Math.round(watchedPercent)}% 완료</span>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">학습 진행률</h3>
                <span className="text-sm text-gray-600">{Math.round(watchedPercent)}% 완료</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${watchedPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>시청 시간: {formatTime(watchedSections.reduce((acc, section) => 
                  acc + (section.completed ? section.end - section.start : 0), 0))}</span>
                <span>남은 시간: {formatTime(duration - watchedSections.reduce((acc, section) => 
                  acc + (section.completed ? section.end - section.start : 0), 0))}</span>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                목차
              </h3>
              <div className="space-y-2">
                {[
                  { title: "변수와 상수", time: "0:00", duration: "5:00", completed: true },
                  { title: "연산자 종류", time: "5:00", duration: "10:00", completed: true },
                  { title: "조건문 기초", time: "15:00", duration: "8:00", completed: false, current: true },
                  { title: "반복문 활용", time: "23:00", duration: "12:00", completed: false },
                  { title: "함수 정의", time: "35:00", duration: "15:00", completed: false },
                  { title: "실습 문제", time: "50:00", duration: "10:00", completed: false },
                ].map((section, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      section.current 
                        ? 'bg-blue-50 border border-blue-200' 
                        : section.completed 
                          ? 'bg-green-50 hover:bg-green-100' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        section.completed 
                          ? 'bg-green-500 text-white' 
                          : section.current
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {section.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-500">
                          {section.time} • {section.duration}
                        </p>
                      </div>
                    </div>
                    {section.current && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        현재 시청 중
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLearningSystem;