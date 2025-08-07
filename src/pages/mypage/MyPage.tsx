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
import ProfileSettings from "./ProfileSettings";
import PaymentHistory from "./PaymentHistory";
import AccountManagement from "./AccoountManagement";

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
  const isUpdatingRef = useRef(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // 프로필 정보 로드
  useEffect(() => {
    dispatch(fetchProfile());
    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch]);

  // 프로필 정보 로드 후 폼 데이터 설정
  useEffect(() => {
    if (profile) {
      // 업데이트 중이 아니거나 초기 로드일 때만 폼 데이터 설정
      if (!isUpdatingRef.current || !isInitialLoadComplete) {
        setFormData({
          name: profile.name || "",
          gender: profile.gender || "",
          birth_date: profile.birth_date || "",
          profile_image: null,
        });

        // 프로필 이미지 설정
        if (profile.profile_image) {
          // 서버에서 전체 URL을 제공하는 경우
          if (profile.profile_image.startsWith("http")) {
            setPreviewImage(profile.profile_image);
          } else {
            // 상대 경로인 경우 서버 URL과 결합
            setPreviewImage(`http://13.125.180.222${profile.profile_image}`);
          }
        } else {
          // 기본 이미지
          setPreviewImage("../../assets/profile-none.png");
        }

        setIsInitialLoadComplete(true);
      }
    }
  }, [profile, isInitialLoadComplete]);

  // 이미지 업데이트
  useEffect(() => {
    if (success) {
      alert("프로필이 성공적으로 수정되었습니다!");
      isUpdatingRef.current = false;

      dispatch(resetProfileState());

      // previewImage 업데이트
      if (profile && profile.profile_image) {
        if (profile.profile_image.startsWith("http")) {
          setPreviewImage(profile.profile_image);
        } else {
          setPreviewImage(`http://13.125.180.222${profile.profile_image}`);
        }
      }
    }
  }, [success, dispatch, profile]);

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
      // 파일 크기 검사 (5MB 제한)
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        e.target.value = "";
        return;
      }

      // 파일 타입 검사
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("지원되는 이미지 형식은 JPEG, PNG, GIF, WebP입니다.");
        e.target.value = "";
        return;
      }

      setFormData(prev => ({
        ...prev,
        profile_image: file,
      }));

      //  이미지 미리보기
      const reader = new FileReader();

      reader.onload = event => {
        const result = event.target?.result;
        if (result && typeof result === "string") {
          setPreviewImage(result);
        }
      };

      reader.onerror = error => {
        alert("이미지 파일을 읽는 중 오류가 발생했습니다.");
      };

      reader.readAsDataURL(file);
    } else {
      // 파일이 선택되지 않았을 때는 미리보기 초기화하지 않음
      console.log("❌ No file selected");
    }
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

    // 업데이트 시작
    isUpdatingRef.current = true;

    dispatch(updateProfile(formData));
  };

  // 폼이 비어있는지 확인
  const isFormEmpty = () => {
    return !formData.name || !formData.gender || !formData.birth_date;
  };

  const isSubmitDisabled =
    isFormEmpty() || !isProfileFormValid(validationMessages) || loading;

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSettings
            formData={formData}
            validationMessages={validationMessages}
            touchedFields={touchedFields}
            previewImage={previewImage}
            loading={loading}
            error={error}
            isSubmitDisabled={isSubmitDisabled}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
          />
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
        return <PaymentHistory />;
      case "account":
        return <AccountManagement />;
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
