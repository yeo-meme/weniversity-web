import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LinkTestComponent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          🎉 테스트 페이지입니다!
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✅ 라우팅이 성공적으로 작동했습니다!</h2>
          <p className="text-gray-600 mb-4">
            이 페이지가 보인다면 React Router 네비게이션이 정상적으로 작동하고 있습니다.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">🔗 네비게이션 테스트</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="block w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                홈으로 이동 (useNavigate)
              </button>
              
              <Link 
                to="/"
                className="block w-full text-left px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                홈으로 이동 (Link)
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="block w-full text-left px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                뒤로 가기
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">📊 현재 상태</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>현재 URL:</strong> {window.location.href}</li>
              <li><strong>Pathname:</strong> {window.location.pathname}</li>
              <li><strong>Hash:</strong> {window.location.hash || '없음'}</li>
              <li><strong>Timestamp:</strong> {new Date().toLocaleString()}</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">🎯 다음 단계</h3>
            <p className="text-gray-600">
              이 테스트 페이지가 정상적으로 로드되었다면, 
              이제 실제 StudyLayoutPlayer 컴포넌트의 오류를 수정하시면 됩니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTestComponent;