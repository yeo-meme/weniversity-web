import React from 'react';

// 임시로 타입을 여기에 직접 정의
interface CreateWatchProgressParams {
  userId: string;
  chapterId: number;
  courseId?: number;
}

interface Chapter {
  id: number;
  title: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  courseId?: number;
  order?: number;
}

const App: React.FC = () => {
  // 타입 사용 테스트
  const testData: CreateWatchProgressParams = {
    userId: 'test123',
    chapterId: 1,
    courseId: 1
  };

  console.log('✅ CreateWatchProgressParams 타입 사용 성공:', testData);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ 타입 정의 성공!
        </h1>
        <p className="text-gray-600">
          파일 내부에서 타입을 정의했습니다.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          이제 개발 서버 설정을 수정해봅시다.
        </p>
      </div>
    </div>
  );
};

export default App;