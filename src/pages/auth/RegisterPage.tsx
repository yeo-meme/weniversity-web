import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { register, resetAuthState } from "../../store/authSlice";
import type { RegisterFormData, ValidationMessages } from "../../types/user";
import { validateForm, isFormValid } from "../../services/auth/validation";
import RegisterInput from "../../components/auth/RegisterInput";
import RegisterSelect from "../../components/auth/RegisterSelect";

const RegisterPage: React.FC = () => {
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
  const [termsAgreed, setTermsAgreed] = useState(false);

  // 성별 옵션
  const genderOptions = [
    { value: "M", label: "남성" },
    { value: "F", label: "여성" },
  ];

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    const newValidationMessages = validateForm({ ...formData, [name]: value });
    setValidationMessages(newValidationMessages);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // 값이 있을 때만 touched 상태로 설정
    if (value.trim()) {
      setTouchedFields(prev => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const messages = validateForm(formData);
    setValidationMessages(messages);

    if (isFormEmpty() || !isFormValid(messages) || !termsAgreed) {
      return;
    }

    dispatch(register(formData));
  };

  // 폼이 비어있는지 확인하는 함수
  const isFormEmpty = () => {
    return (
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm ||
      !formData.name ||
      !formData.gender ||
      !formData.birth_date
    );
  };

  const isSubmitDisabled =
    isFormEmpty() ||
    !isFormValid(validationMessages) ||
    !termsAgreed ||
    loading;

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
            <RegisterInput
              id="email"
              label="이메일"
              type="email"
              value={formData.email}
              placeholder="이메일을 입력하세요"
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.email}
              showError={touchedFields.email}
            />

            {/* 비밀번호 */}
            <RegisterInput
              id="password"
              label="비밀번호"
              type="password"
              value={formData.password}
              placeholder="비밀번호를 입력하세요"
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.password}
              showError={touchedFields.password}
            />

            {/* 비밀번호 확인 */}
            <RegisterInput
              id="passwordConfirm"
              label="비밀번호 확인"
              type="password"
              value={formData.passwordConfirm}
              placeholder="비밀번호를 다시 입력하세요"
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.passwordConfirm}
              showError={touchedFields.passwordConfirm}
            />

            {/* 이름 */}
            <RegisterInput
              id="name"
              label="이름"
              type="text"
              value={formData.name}
              placeholder="이름을 입력하세요"
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.name}
              showError={touchedFields.name}
            />

            {/* 성별 */}
            <RegisterSelect
              id="gender"
              label="성별"
              value={formData.gender}
              options={genderOptions}
              placeholder="성별을 선택하세요"
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.gender}
              showError={touchedFields.gender}
            />

            {/* 생년월일 */}
            <RegisterInput
              id="birth_date"
              label="생년월일"
              type="date"
              value={formData.birth_date}
              onChange={handleInputChange}
              onBlur={handleBlur}
              errorMessage={validationMessages.birth_date}
              showError={touchedFields.birth_date}
            />

            {/* API 에러 메시지 (서버 에러가 있을 때만 표시) */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
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
