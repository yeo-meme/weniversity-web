import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundImg from "../assets/not-found.png";
import logoImg from "../assets/logo.png";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full border-b border-gray200 shadow-sm p-5 flex items-center justify-center">
        <img
          src={logoImg}
          alt="위니버시티"
          className="h-8 cursor-pointer"
          onClick={handleGoHome}
        />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-3">
          <img src={NotFoundImg} alt="404 에러" className="w-64 h-auto" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">
            페이지를 찾을 수 없습니다.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            앗, 이 페이지는 없는 것 같아요. 주소를 다시 확인하거나 메인 페이지로
            돌아가세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            메인으로
          </button>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border border-gray-400 text-gray-400 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            이전 페이지
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
