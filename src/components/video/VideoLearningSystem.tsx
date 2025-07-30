import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, BookOpen, Clock, CheckCircle } from 'lucide-react';

const VideoLearningSystem: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(125); // seconds
  const [duration] = useState(3600); // 1 hour
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
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black aspect-video group">
        {/* Video placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 ml-1" />
            </div>
            <p className="text-lg font-medium">Chapter 1: 연산과 구문</p>
            <p className="text-sm text-gray-300 mt-2">마지막 시청: 2:05</p>
          </div>
        </div>

        {/* Resume watching notification */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-90">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>2:05에서 이어보기</span>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative h-2 bg-gray-600 rounded-full cursor-pointer">
              {/* Watched sections background */}
              <div className="absolute inset-0 bg-gray-500 rounded-full overflow-hidden">
                {watchedSections.map((section, index) => (
                  <div
                    key={index}
                    className={`absolute h-full ${section.completed ? 'bg-green-500' : 'bg-gray-400'}`}
                    style={{
                      left: `${(section.start / duration) * 100}%`,
                      width: `${((section.end - section.start) / duration) * 100}%`
                    }}
                  />
                ))}
              </div>
              {/* Current progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Progress handle */}
              <div 
                className="absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                <div className="w-20 h-1 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>

              {/* Time Display */}
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors text-sm font-medium relative"
              >
                {playbackSpeed}x
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg p-2 min-w-24">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                      <button
                        key={speed}
                        onClick={() => {setPlaybackSpeed(speed); setShowSettings(false);}}
                        className={`block w-full text-left px-3 py-1 rounded text-sm hover:bg-gray-700 ${
                          speed === playbackSpeed ? 'bg-blue-600' : ''
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </button>
              
              <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Information */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">1. 연산과 구문</h1>
            <p className="text-gray-600">프로그래밍의 기본 연산과 구문에 대해 학습합니다.</p>
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
  );
};

export default VideoLearningSystem;