import React, { useState } from "react";
import FindPasswordModal from "./findPasswordModal";

const AccountManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePasswordReset = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">계정 관리</h2>

        <div className="space-y-6">
          {/* 이메일 섹션 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                value="paul-lab@naver.com"
                disabled
                className="block w-[257px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
              />
            </div>

            {/* GitHub 계정 로그인 링크 */}
            <div className="mt-3">
              <a
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub 계정 로그인
              </a>
            </div>
          </div>

          {/* 비밀번호 섹션 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                비밀번호 재설정
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 모달 */}
      <FindPasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default AccountManagement;
