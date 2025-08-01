import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, BookOpen, Clock, CheckCircle, X } from 'lucide-react';

const chapters = [
  { 
    id: 1,
    title: "변수와 상수", 
    time: "0:00", 
    duration: "5:00", 
    durationSeconds: 300,
    videoFile: "video1.mp4",
    completed: false 
  },
  { 
    id: 2,
    title: "연산자 종류", 
    time: "5:00", 
    duration: "10:00", 
    durationSeconds: 600,
    videoFile: "video2.mp4",
    completed: false 
  },
  { 
    id: 3,
    title: "조건문 기초", 
    time: "15:00", 
    duration: "8:00", 
    durationSeconds: 480,
    videoFile: "video3.mp4",
    completed: false 
  },
  { 
    id: 4,
    title: "반복문 활용", 
    time: "23:00", 
    duration: "12:00", 
    durationSeconds: 720,
    videoFile: "video4.mp4",
    completed: false 
  },
  { 
    id: 5,
    title: "함수 정의", 
    time: "35:00", 
    duration: "15:00", 
    durationSeconds: 900,
    videoFile: "video5.mp4",
    completed: false 
  },
  { 
    id: 6,
    title: "실습 문제", 
    time: "50:00", 
    duration: "10:00", 
    durationSeconds: 600,
    videoFile: "video6.mp4",
    completed: false 
  },
];

const VideoPlayer = ({ currentVideo, onTimeUpdate, onLoadedMetadata, onEnded }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // 새 비디오 로드
    }
  }, [currentVideo]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      onTimeUpdate(currentTime, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { duration } = videoRef.current;
      console.log('비디오 메타데이터 로드 완료:', {
        currentVideo,
        duration: duration,
        formattedDuration: `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`
      });
      onLoadedMetadata(duration);
    }
  };

  const handleEnded = () => {
    onEnded();
  };
  
  return (
    <div className="w-full">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        controls
        className="w-full aspect-video rounded-lg"
      >
        <source src={`/video/${currentVideo}`} type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>
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
  } | null;
}

const VideoLearningSystem: React.FC<VideoLearningSystemProps> = ({ onClose, courseData }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [chapterProgress, setChapterProgress] = useState({});

  const currentChapter = chapters[currentChapterIndex];
  const totalDuration = chapters.reduce((acc, chapter) => acc + chapter.durationSeconds, 0);
  
  // 전체 완료된 시간 계산
  const completedTime = Array.from(completedChapters).reduce((acc, chapterIndex) => {
    return acc + chapters[chapterIndex].durationSeconds;
  }, 0) + (chapterProgress[currentChapterIndex] || 0);

  const overallProgress = totalDuration > 0 ? (completedTime / totalDuration) * 100 : 0;

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 비디오 시간 업데이트 핸들러
  const handleTimeUpdate = (currentTime, videoDuration) => {
    setCurrentTime(currentTime);
    
    // 현재 챕터의 진행률 업데이트
    const progress = Math.min(currentTime, videoDuration);
    setChapterProgress(prev => ({
      ...prev,
      [currentChapterIndex]: progress
    }));

    // 비디오가 90% 이상 재생되면 완료로 표시
    if (videoDuration > 0 && currentTime / videoDuration >= 0.9) {
      setCompletedChapters(prev => new Set([...prev, currentChapterIndex]));
    }
  };

  // 비디오 메타데이터 로드 핸들러
  const handleLoadedMetadata = (videoDuration) => {
    setDuration(videoDuration);
  };

  // 비디오 끝남 핸들러
  const handleVideoEnded = () => {
    // 현재 챕터를 완료로 표시
    setCompletedChapters(prev => new Set([...prev, currentChapterIndex]));
    
    // 다음 챕터로 자동 이동
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  // 챕터 클릭 핸들러
  const handleChapterClick = (chapterIndex) => {
    const selectedChapter = chapters[chapterIndex];
    console.log('챕터 클릭:', {
      chapterIndex,
      title: selectedChapter.title,
      videoFile: selectedChapter.videoFile,
      fullPath: `/video/${selectedChapter.videoFile}`
    });
    setCurrentChapterIndex(chapterIndex);
    setCurrentTime(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
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
                {courseData?.title || '프로그래밍 기초 강의'}
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
            <VideoPlayer 
              currentVideo={currentChapter.videoFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
            />
            
            {/* Current chapter info */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-90">
              <div className="flex items-center gap-2 text-sm">
                <Play className="w-4 h-4" />
                <span>{currentChapter.title}</span>
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentChapter.title}
                </h1>
                <p className="text-gray-600">
                  {courseData?.description || '프로그래밍의 기본 연산과 구문에 대해 학습합니다.'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{Math.round(overallProgress)}% 완료</span>
                </div>
              </div>
            </div>

            {/* Progress Summary - 실시간 동기화 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">학습 진행률</h3>
                <span className="text-sm text-gray-600">{Math.round(overallProgress)}% 완료</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>시청 시간: {formatTime(completedTime)}</span>
                <span>남은 시간: {formatTime(totalDuration - completedTime)}</span>
              </div>
              
              {/* 현재 챕터 진행률 */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>현재 챕터: {currentChapter.title}</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                목차
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter, index) => {
                  const isCompleted = completedChapters.has(index);
                  const isCurrent = index === currentChapterIndex;
                  const chapterProgressPercent = chapterProgress[index] 
                    ? (chapterProgress[index] / chapter.durationSeconds) * 100 
                    : 0;

                  return (
                    <div
                      key={chapter.id}
                      onClick={() => handleChapterClick(index)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-blue-50 border border-blue-200' 
                          : isCompleted 
                            ? 'bg-green-50 hover:bg-green-100' 
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500">
                              {chapter.time} • {chapter.duration}
                            </p>
                            {/* 개별 챕터 진행률 표시 */}
                            {chapterProgressPercent > 0 && chapterProgressPercent < 100 && (
                              <div className="flex-1 max-w-20">
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-blue-400 h-1 rounded-full"
                                    style={{ width: `${chapterProgressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          재생 중
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLearningSystem;