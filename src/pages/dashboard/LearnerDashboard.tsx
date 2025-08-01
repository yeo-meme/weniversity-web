import React from 'react';
import { User, BookOpen, Clock, Award, Bell, Calendar, Play, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  daysRemaining: number;
  isBoostCommunity: boolean;
  thumbnail: string;
}

interface Mission {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const LearnerDashboard: React.FC = () => {
  const courses: Course[] = [
    {
      id: '1',
      title: '리액트 마스터 클래스',
      category: '프론트엔드',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      daysRemaining: 15,
      isBoostCommunity: true,
      thumbnail: 'https://via.placeholder.com/200x120/4F46E5/ffffff?text=React'
    },
    {
      id: '2',
      title: 'Node.js 백엔드 개발',
      category: '백엔드',
      progress: 45,
      totalLessons: 32,
      completedLessons: 14,
      daysRemaining: 30,
      isBoostCommunity: false,
      thumbnail: 'https://via.placeholder.com/200x120/059669/ffffff?text=Node.js'
    },
    {
      id: '3',
      title: 'Python 데이터 분석',
      category: '데이터분석',
      progress: 90,
      totalLessons: 20,
      completedLessons: 18,
      daysRemaining: 7,
      isBoostCommunity: true,
      thumbnail: 'https://via.placeholder.com/200x120/DC2626/ffffff?text=Python'
    }
  ];

  const missions: Mission[] = [
    { id: '1', title: '리액트 컴포넌트 과제 제출', dueDate: '2025-08-05', completed: false },
    { id: '2', title: '백엔드 API 구현 프로젝트', dueDate: '2025-08-10', completed: false },
    { id: '3', title: '데이터 시각화 과제', dueDate: '2025-07-28', completed: true },
    { id: '4', title: '코드 리뷰 참여', dueDate: '2025-08-01', completed: true }
  ];

  const incompleteMissions = missions.filter(m => !m.completed);
  const completedMissions = missions.filter(m => m.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">weolversity</div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요, 김학생님!</h1>
          <p className="text-gray-600">오늘도 성장하는 하루 보내세요 🚀</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">수강 중인 강의</p>
                <p className="text-2xl font-bold text-gray-900">3개</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">완료한 강의</p>
                <p className="text-2xl font-bold text-gray-900">12개</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">학습 시간</p>
                <p className="text-2xl font-bold text-gray-900">24시간</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">획득 뱃지</p>
                <p className="text-2xl font-bold text-gray-900">8개</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">수강 중인 강의</h2>
              </div>
              <div className="p-6 space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-20 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {course.category}
                          </span>
                          {course.isBoostCommunity && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                              부스트 커뮤니티
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {course.completedLessons}/{course.totalLessons} 강의 완료
                          </span>
                          <span className={`text-sm font-medium ${
                            course.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {course.daysRemaining}일 남음
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            <Play className="h-4 w-4" />
                            <span>계속 학습</span>
                          </button>
                          {course.isBoostCommunity && (
                            <button className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors">
                              디스코드 참여
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Missions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">미션 현황</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">진행 중인 미션</h4>
                  <div className="space-y-2">
                    {incompleteMissions.map((mission) => (
                      <div key={mission.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{mission.title}</p>
                          <p className="text-xs text-gray-500">마감: {mission.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">완료된 미션</h4>
                  <div className="space-y-2">
                    {completedMissions.map((mission) => (
                      <div key={mission.id} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-through">{mission.title}</p>
                          <p className="text-xs text-gray-500">완료: {mission.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">빠른 액션</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded transition-colors">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">프로필 설정</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded transition-colors">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">학습 일정 관리</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded transition-colors">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">알림 설정</span>
                </button>
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-2">학습 연속 기록</h3>
              <div className="text-3xl font-bold mb-1">7일</div>
              <p className="text-blue-100 text-sm">연속으로 학습하고 있어요! 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;