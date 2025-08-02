import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchProfile,
  updateProfile,
  resetProfileState,
} from "../../store/profileSlice";
import type {
  ProfileFormData,
  ProfileValidationMessages,
} from "../../types/profile";
import {
  validateProfileForm,
  isProfileFormValid,
} from "../../services/mypage/profileValidation";
import RegisterInput from "../../components/auth/RegisterInput";
import RegisterSelect from "../../components/auth/RegisterSelect";

const MyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, success } = useAppSelector(
    state => state.profile
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    gender: "",
    birth_date: "",
    profile_image: null,
  });

  const [validationMessages, setValidationMessages] =
    useState<ProfileValidationMessages>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 성별 옵션
  const genderOptions = [
    { value: "M", label: "남성" },
    { value: "F", label: "여성" },
  ];

  // 컴포넌트 마운트 시 프로필 정보 로드
  useEffect(() => {
    dispatch(fetchProfile());
    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch]);

  // 프로필 정보 로드 후 폼 데이터 설정
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        gender: profile.gender || "",
        birth_date: profile.birth_date || "",
        profile_image: null,
      });

      // 프로필 이미지 설정 (있으면 DB 이미지, 없으면 기본 이미지)
      const imageSrc = profile.profile_image
        ? profile.profile_image
        : "/img.jpg";
      setPreviewImage(imageSrc);
    }
  }, [profile]);

  // 수정 성공 시 메시지
  useEffect(() => {
    if (success) {
      alert("프로필이 성공적으로 수정되었습니다!");
      dispatch(resetProfileState());
    }
  }, [success, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    const newValidationMessages = validateProfileForm({
      ...formData,
      [name]: value,
    });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_image: file,
      }));

      // 이미지 미리보기
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const messages = validateProfileForm(formData);
    setValidationMessages(messages);

    // 모든 필드를 touched 상태로 설정
    setTouchedFields({
      name: true,
      gender: true,
      birth_date: true,
    });

    if (!isProfileFormValid(messages)) {
      return;
    }

    dispatch(updateProfile(formData));
  };

  // 폼이 비어있는지 확인하는 함수
  const isFormEmpty = () => {
    return !formData.name || !formData.gender || !formData.birth_date;
  };

  const isSubmitDisabled =
    isFormEmpty() || !isProfileFormValid(validationMessages) || loading;

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              프로필 설정
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    onClick={handleImageClick}
                    className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="프로필"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <div className="text-sm">이미지 업로드</div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
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

              {/* API 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* 수정하기 버튼 */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`px-8 py-2 rounded-md text-sm font-medium ${
                    isSubmitDisabled
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  {loading ? "수정 중..." : "수정하기"}
                </button>
              </div>
            </form>
          </div>
        );
      case "certificates":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              수료증 발급
            </h2>
            <p className="text-gray-600">
              수료증 발급 기능은 추후 구현 예정입니다.
            </p>
          </div>
        );
      case "payments":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 내역</h2>
            <p className="text-gray-600">
              결제 내역 기능은 추후 구현 예정입니다.
            </p>
          </div>
        );
      case "account":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">계정 관리</h2>
            <p className="text-gray-600">
              계정 관리 기능은 추후 구현 예정입니다.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            프로필 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <div className="w-64 bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                프로필 설정
              </button>
              <button
                onClick={() => setActiveTab("certificates")}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "certificates"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                수료증 발급
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "payments"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                결제 내역
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "account"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                계정 관리
              </button>
            </nav>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
