import React from 'react';
import { Video, Clock, Users, BookOpen, BookMarked } from 'lucide-react';

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


interface CourseListProps {
  onStartLearning: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onStartLearning }) => {
  const courses: Course[] = [
    {
      id: 1,
      title: "JavaScript 기초",
      description: "프로그래밍의 기본부터 실무까지",
      thumbnail: "https://via.placeholder.com/300x200/4F46E5/white?text=JavaScript",
      duration: "18시간",
      chapters: 12,
      students: 1234,
      level: "초급"
    },
    {
      id: 2,
      title: "React 마스터클래스",
      description: "현대적인 웹 개발의 핵심 기술",
      thumbnail: "https://via.placeholder.com/300x200/06B6D4/white?text=React",
      duration: "24시간",
      chapters: 16,
      students: 890,
      level: "중급"
    },
    {
      id: 3,
      title: "Python 데이터 분석",
      description: "데이터 과학의 첫걸음",
      thumbnail: "https://via.placeholder.com/300x200/10B981/white?text=Python",
      duration: "20시간",
      chapters: 14,
      students: 756,
      level: "초급"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookMarked className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Learning Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">안녕하세요, 김학생님!</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">김</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">내 강의</h2>
          <p className="text-gray-600">진행 중인 강의를 계속 학습하거나 새로운 강의를 시작해보세요.</p>
        </div>

        {/* 강의 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.chapters}개 챕터</span>
                  </div>
                  
                  <button
                    onClick={() => onStartLearning(course)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    학습 시작
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CourseList;
