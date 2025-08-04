// import React, { useState } from "react";
// import { createPortal } from "react-dom";
// import FindPasswordInput from "../../components/mypage/accountmanagement/findPasswordInput";

// interface FindPasswordModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const FindPasswordModal: React.FC<FindPasswordModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("이메일 전송:", email);
//     // 여기에 실제 비밀번호 재설정 로직 구현
//     alert("비밀번호 재설정 링크를 이메일로 보냈습니다.");
//     onClose();
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return createPortal(
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
//         {/* 자물쇠 아이콘 */}
//         <div className="flex justify-center mb-4">
//           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-6 h-6 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V9a4 4 0 00-8 0v2m8 0H6"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* 제목 */}
//         <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
//           비밀번호 찾기
//         </h2>

//         {/* 설명 텍스트 */}
//         <div className="text-center text-gray-600 mb-6">
//           <p className="mb-1">가입시 등록한 이메일을 입력해 주세요.</p>
//           <p>비밀번호 재설정 링크를 이메일로 보내드릴게요.</p>
//         </div>

//         {/* 폼 */}
//         <form onSubmit={handleSubmit}>
//           <FindPasswordInput
//             id={email}
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             // errorMessage={}
//             // showError={}
//           />

//           {/* 버튼 */}
//           <button
//             type="submit"
//             disabled={!email.trim()}
//             className={`w-full mt-6 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//               email.trim()
//                 ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             이메일 보내기
//           </button>
//         </form>

//         {/* 닫기 버튼 (X) */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default FindPasswordModal;
import React, { useState } from "react";
import { createPortal } from "react-dom";
import FindPasswordInput from "../../components/mypage/accountmanagement/findPasswordInput";

interface FindPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindPasswordModal: React.FC<FindPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [touched, setTouched] = useState(false);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): string => {
    if (!email) {
      return "이메일을 입력해주세요.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식을 입력해주세요.";
    }

    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // 실시간 유효성 검사
    const error = validateEmail(value);
    setErrorMessage(error);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateEmail(email);
    setErrorMessage(error);
    setTouched(true);

    if (error) {
      return;
    }

    console.log("이메일 전송:", email);
    // 여기에 실제 비밀번호 재설정 로직 구현
    alert("비밀번호 재설정 링크를 이메일로 보냈습니다.");

    // 폼 초기화 및 모달 닫기
    setEmail("");
    setErrorMessage("");
    setTouched(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    // 모달 닫을 때 상태 초기화
    setEmail("");
    setErrorMessage("");
    setTouched(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4 relative">
        {/* 자물쇠 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V9a4 4 0 00-8 0v2m8 0H6"
              />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          비밀번호 찾기
        </h2>

        {/* 설명 텍스트 */}
        <div className="text-center text-gray-600 mb-6">
          <p className="mb-1">가입시 등록한 이메일을 입력해 주세요.</p>
          <p>비밀번호 재설정 링크를 이메일로 보내드릴게요.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <FindPasswordInput
              id="resetEmail"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              errorMessage={errorMessage}
              showError={touched}
            />
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            disabled={!email.trim() || !!errorMessage}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !email.trim() || !!errorMessage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            이메일 보내기
          </button>
        </form>

        {/* 닫기 버튼 (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FindPasswordModal;
