import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  register,
  // checkEmailDuplicate,
  resetAuthState,
} from "../../store/authSlice";
import type { RegisterFormData, ValidationMessages } from "../../types/user";
import { validateForm, isFormValid } from "../../services/validation";

const RegisterPage: React.FC = () => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    gender: "",
    birth_date: "",
  });

  const [validationMessages, setValidationMessages] =
    useState<ValidationMessages>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  // const [emailChecked, setEmailChecked] = useState(false);
  // const [emailAvailable, setEmailAvailable] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      alert("회원가입이 완료되었습니다!");
    }
  }, [success]);

  // useEffect(() => {
  //   if (success) {
  //     alert("회원가입이 완료되었습니다!");
  //     navigate("/");
  //   }
  // }, [success, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 이메일이 변경되면 중복확인 상태 초기화
    // if (name === "email") {
    // setEmailChecked(false);
    // setEmailAvailable(false);
    // }

    // 실시간 유효성 검사
    const newValidationMessages = validateForm({ ...formData, [name]: value });
    setValidationMessages(newValidationMessages);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  // const handleEmailCheck = async () => {
  //   if (!formData.email || validationMessages.email) {
  //     return;
  //   }

  //   try {
  //     const isDuplicate = await dispatch(
  //       checkEmailDuplicate(formData.email)
  //     ).unwrap();
  //     setEmailChecked(true);
  //     setEmailAvailable(!isDuplicate);

  //     if (isDuplicate) {
  //       setValidationMessages(prev => ({
  //         ...prev,
  //         email: "이미 사용 중인 이메일입니다.",
  //       }));
  //     } else {
  //       setValidationMessages(prev => ({
  //         ...prev,
  //         email: undefined,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setValidationMessages(prev => ({
  //       ...prev,
  //       email: "이메일 확인 중 오류가 발생했습니다.",
  //     }));
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const messages = validateForm(formData);
    setValidationMessages(messages);

    if (
      !isFormValid(messages) ||
      // !emailChecked ||
      // !emailAvailable ||
      !termsAgreed
    ) {
      return;
    }

    dispatch(register(formData));
  };

  const isSubmitDisabled =
    !isFormValid(validationMessages) ||
    // !emailChecked ||
    // !emailAvailable ||
    !termsAgreed ||
    loading;

  const getCurrentErrorMessage = () => {
    const fieldOrder = [
      "email",
      "password",
      "passwordConfirm",
      "name",
      "gender",
      "birth_date",
    ];

    // 순서대로 확인하면서 첫 번째 에러 메시지 반환
    for (const field of fieldOrder) {
      if (
        touchedFields[field] &&
        validationMessages[field as keyof ValidationMessages]
      ) {
        return validationMessages[field as keyof ValidationMessages];
      }
    }

    // 이메일 중복확인 관련 메시지
    // if (touchedFields.email && formData.email && !emailChecked) {
    //   return "이메일 중복확인을 해주세요.";
    // }

    // API 에러
    if (error) {
      return error;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="이메일을 입력하세요"
                />
                {/* <button
                  type="button"
                  onClick={handleEmailCheck}
                  disabled={
                    !formData.email || !!validationMessages.email || loading
                  }
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  인증
                </button> */}
              </div>
              {/* {emailChecked && emailAvailable && (
                <p className="mt-1 text-sm text-green-600">
                  사용 가능한 이메일입니다.
                </p>
              )} */}
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 성별 */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                성별
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">성별을 선택하세요</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>

            {/* 생년월일 */}
            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium text-gray-700"
              >
                생년월일
              </label>
              <div className="mt-1">
                <input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {getCurrentErrorMessage() && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">
                  {getCurrentErrorMessage()}
                </p>
              </div>
            )}

            {/* 약관 동의 */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={termsAgreed}
                onChange={e => setTermsAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                본인은 만 14세 이상이며,{" "}
                <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                  이용 약관
                </span>
                ,{" "}
                <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                  개인정보취급방침
                </span>
                을 확인하였습니다.
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {!loading ? "동의하고 회원가입" : "회원가입 신청중.."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
