import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { loginUser, clearError } from "../../store/auth-slice";
import logoIcon from "../../assets/logo-icon.png";
import githubIcon from "../../assets/github-mark.png";
import googleIcon from "../../assets/google.png";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC<{
  onLoginSuccess: () => void;
  onGoToMain: () => void;
}> = ({ onLoginSuccess, onGoToMain }) => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 로그인 성공시 처리
  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  // Redux 에러를 폼 에러로 변환
  useEffect(() => {
    if (error) {
      if (error.includes("이메일") || error.includes("email")) {
        setErrors({ email: "* 이메일을 확인해주세요" });
      } else if (error.includes("비밀번호") || error.includes("password")) {
        setErrors({ password: "* 비밀번호를 확인해주세요" });
      } else {
        setErrors({
          email: "* 이메일을 확인해주세요",
          password: "* 비밀번호를 확인해주세요",
        });
      }
    }
  }, [error]);

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    // 포커스시 에러 클리어
    if (error) {
      dispatch(clearError());
    }
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력시 해당 필드 에러 클리어
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "* 이메일을 확인해주세요";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "* 비밀번호를 확인해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(loginUser(formData));
  };

  const isFormValid =
    formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleSocialLogin = (provider: "github" | "google") => {
    console.log(`Social login with ${provider}`);
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="flex flex-col justify-center items-center pt-20">
          <div className="mb-6">
            <img
              src={logoIcon}
              alt="위니버시티 로고"
              className="w-auto h-auto cursor-pointer"
              onClick={onGoToMain}
            />
          </div>

          <p className="text-2xl text-center font-semibold leading-8 mb-[60px]">
            위니버시티에 로그인 후 <br />
            커뮤니티와 함께 성장해보세요.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col"
          >
            <div className="flex flex-col justify-center border-none p-0 m-0 mb-6">
              <div className="flex flex-col mb-5">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    focusedField === "email" ? "text-primary" : "text-gray700"
                  }`}
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  placeholder="이메일을 입력하세요."
                  className={`w-80 h-11 px-2 py-1 border-0 border-b-2 text-base bg-transparent focus:outline-none text-main-text ${
                    focusedField === "email"
                      ? "border-primary bg-gray100"
                      : "border-gray200"
                  }`}
                />
                {errors.email && (
                  <span className="mt-2.5 text-sm text-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col mb-5">
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    focusedField === "password"
                      ? "text-primary"
                      : "text-gray700"
                  }`}
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  placeholder="비밀번호를 입력하세요."
                  className={`w-80 h-11 px-2 py-1 border-0 border-b-2 text-base bg-transparent focus:outline-none text-main-text ${
                    focusedField === "password"
                      ? "border-primary bg-gray100"
                      : "border-gray200"
                  }`}
                />
                {errors.password && (
                  <span className="mt-2.5 text-sm text-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`py-3 my-6 rounded-lg transition-colors duration-200 ${
                  isFormValid && !loading
                    ? "text-white bg-primary cursor-pointer"
                    : "text-gray500 bg-gray200 cursor-not-allowed"
                }`}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center mb-8 gap-2">
            <button className="text-sm font-medium text-primary">
              이메일로 회원가입
            </button>
            <span className="text-gray500">|</span>
            <button className="text-sm font-medium text-gray500">
              비밀번호 찾기
            </button>
          </div>

          <div className="relative mb-6 text-sm flex items-center justify-center w-80 text-gray500">
            <div className="flex-1 h-px bg-gray200"></div>
            <span className="bg-white px-4">또는</span>
            <div className="flex-1 h-px bg-gray200"></div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSocialLogin("github")}
              className="flex items-center justify-start w-80 p-3 border border-gray200 rounded-lg text-sm font-medium gap-20 hover:bg-gray-50 transition-colors duration-200 text-main-text"
            >
              <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
              <span>GitHub 계정으로 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-start w-80 p-3 border border-gray200 rounded-lg text-sm font-medium gap-20 hover:bg-gray-50 transition-colors duration-200 text-main-text"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span>Google 계정으로 로그인</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
