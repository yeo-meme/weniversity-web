import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Code, FileText, Trophy, Calendar, User, ChevronRight, Play, Award } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  type: 'quiz' | 'code';
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // minutes
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const MissionEvaluationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const missions: Mission[] = [
    {
      id: '1',
      title: 'JavaScript 기초 문법 테스트',
      type: 'quiz',
      course: '리액트 마스터 클래스',
      dueDate: '2025-08-15',
      status: 'pending',
      maxScore: 100,
      difficulty: 'easy',
      timeLimit: 30
    },
    {
      id: '2',
      title: '홀수 합계 알고리즘 구현',
      type: 'code',
      course: 'JavaScript 알고리즘',
      dueDate: '2025-08-20',
      status: 'pending',
      maxScore: 100,
      difficulty: 'medium',
      timeLimit: 60
    },
    {
      id: '3',
      title: 'React 컴포넌트 설계',
      type: 'code',
      course: '리액트 마스터 클래스',
      dueDate: '2025-08-10',
      status: 'graded',
      score: 85,
      maxScore: 100,
      difficulty: 'hard',
      timeLimit: 90
    }
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: '다음 중 JavaScript의 자료형이 아닌 것은?',
      options: ['string', 'number', 'boolean', 'character'],
      correctAnswer: 3,
      explanation: 'JavaScript에는 character 자료형이 없습니다. 문자는 string으로 처리됩니다.'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'submitted': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'graded': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const QuizModal = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

    React.useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">JavaScript 기초 문법 테스트</h2>
              <p className="text-gray-600">문제 {currentQuestion + 1} / {quizQuestions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <button 
                onClick={() => setShowQuizModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {quizQuestions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAnswer === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-700">{index + 1}. {option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={currentQuestion === 0}
              >
                이전 문제
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  임시저장
                </button>
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion === quizQuestions.length - 1 ? '제출하기' : '다음 문제'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CodeModal = () => {
    const [code, setCode] = useState(`function solution(numbers) {
  // 주어진 리스트 내에 홀수를 찾아 합을 반환하는 함수를 완성하세요
  
}`);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTests = () => {
      setIsRunning(true);
      // 실제로는 서버에서 테스트를 실행
      setTimeout(() => {
        setTestResults([
          { input: '[1, 2, 3, 4, 5]', expected: '9', actual: '9', passed: true },
          { input: '[2, 4, 6, 8]', expected: '0', actual: '0', passed: true },
          { input: '[1, 3, 5, 7, 9]', expected: '25', actual: '25', passed: true }
        ]);
        setIsRunning(false);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">홀수 합계 알고리즘 구현</h2>
              <p className="text-gray-600">제한시간: 60분</p>
            </div>
            <button 
              onClick={() => setShowCodeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Problem Description */}
            <div className="w-1/3 p-6 border-r bg-gray-50 overflow-auto">
              <h3 className="font-semibold mb-4">문제 설명</h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p>주어진 숫자 배열에서 홀수만을 찾아 그 합을 반환하는 함수를 작성하세요.</p>
                
                <div>
                  <h4 className="font-medium mb-2">입력</h4>
                  <p>숫자로 이루어진 배열 numbers</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">출력</h4>
                  <p>홀수들의 합 (정수)</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">예시</h4>
                  <div className="bg-white p-3 rounded border">
                    <p>입력: [1, 2, 3, 4, 5]</p>
                    <p>출력: 9 (1 + 3 + 5)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b bg-gray-100">
                <div className="flex gap-2">
                  <button 
                    onClick={runTests}
                    disabled={isRunning}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {isRunning ? '실행 중...' : '코드 실행'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    초기화
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm resize-none border-none outline-none"
                  placeholder="여기에 코드를 작성하세요..."
                />
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="border-t p-4 bg-gray-50 max-h-48 overflow-auto">
                  <h4 className="font-medium mb-3">테스트 결과</h4>
                  {testResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`mb-2 p-3 rounded text-sm ${
                        result.passed ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.passed ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        <span className="font-medium">테스트 케이스 {index + 1}</span>
                      </div>
                      <div className="ml-6 text-gray-700">
                        <p>입력: {result.input}</p>
                        <p>기대값: {result.expected}</p>
                        <p>실제값: {result.actual}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-between">
            <div className="text-sm text-gray-600">
              마지막 자동저장: 방금 전
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                임시저장
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                최종 제출
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">미션 및 평가</h1>
              <p className="text-gray-600 mt-1">과제를 완료하고 실력을 점검해보세요</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">평균 점수: 87점</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'ongoing' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            진행 중인 미션
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'completed' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            완료된 미션
          </button>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {missions
            .filter(mission => 
              activeTab === 'ongoing' 
                ? mission.status !== 'graded' 
                : mission.status === 'graded'
            )
            .map((mission) => (
              <div 
                key={mission.id} 
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedMission(mission)}
              >
                {/* Mission Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      mission.type === 'quiz' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {mission.type === 'quiz' ? 
                        <FileText className={`w-5 h-5 ${
                          mission.type === 'quiz' ? 'text-blue-600' : 'text-green-600'
                        }`} /> :
                        <Code className="w-5 h-5 text-green-600" />
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                      <p className="text-sm text-gray-600">{mission.course}</p>
                    </div>
                  </div>
                  {getStatusIcon(mission.status)}
                </div>

                {/* Mission Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty === 'easy' && '초급'}
                      {mission.difficulty === 'medium' && '중급'}
                      {mission.difficulty === 'hard' && '고급'}
                    </span>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mission.timeLimit}분
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      마감: {new Date(mission.dueDate).toLocaleDateString('ko-KR')}
                    </div>
                  </div>

                  {mission.status === 'graded' && mission.score && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">점수</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            mission.score >= 80 ? 'text-green-600' : 
                            mission.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {mission.score}점
                          </span>
                          <span className="text-gray-400">/ {mission.maxScore}점</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            mission.score >= 80 ? 'bg-green-500' : 
                            mission.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(mission.score / mission.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (mission.type === 'quiz') {
                        setShowQuizModal(true);
                      } else {
                        setShowCodeModal(true);
                      }
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      mission.status === 'pending' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : mission.status === 'submitted'
                        ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                        : 'bg-green-100 text-green-800'
                    }`}
                    disabled={mission.status === 'submitted'}
                  >
                    {mission.status === 'pending' && '시작하기'}
                    {mission.status === 'submitted' && '채점 중'}
                    {mission.status === 'graded' && '결과 보기'}
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Modals */}
      {showQuizModal && <QuizModal />}
      {showCodeModal && <CodeModal />}
    </div>
  );
};

export default MissionEvaluationSystem;