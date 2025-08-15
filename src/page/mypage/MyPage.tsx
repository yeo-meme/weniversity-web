import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
  fetchProfile,
  updateProfile,
  resetMyPageState,
} from "../../store/myPageSlice";
import type {
  ProfileFormData,
  ProfileValidationMessages,
} from "../../types/myPage/myPage";
import {
  validateProfileForm,
  isProfileFormValid,
} from "../../services/mypage/profileValidation";
import ProfileSettings from "./ProfileSettings";
import PaymentHistory from "./PaymentHistory";
import AccountManagement from "./AccoountManagement";
import LoadingMessage from "../../components/courseDetail/LoadingMessage";

type TabType = "profile" | "certificates" | "payments" | "account";

const MyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, success } = useAppSelector(
    state => state.myPage
  );

  const [activeTab, setActiveTab] = useState<TabType>("profile");
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

  // 탭 정보
  const tabs = useMemo(
    () => [
      { key: "profile" as TabType, label: "프로필 설정" },
      { key: "certificates" as TabType, label: "수료증 발급" },
      { key: "payments" as TabType, label: "결제 내역" },
      { key: "account" as TabType, label: "계정 관리" },
    ],
    []
  );

  // 폼이 비어있는지 확인
  const isFormEmpty = useCallback(() => {
    return !formData.name || !formData.gender || !formData.birth_date;
  }, [formData]);

  // Submit 버튼 비활성화 상태
  const isSubmitDisabled = useMemo(() => {
    return isFormEmpty() || !isProfileFormValid(validationMessages) || loading;
  }, [isFormEmpty, validationMessages, loading]);

  // 프로필 정보 로드
  useEffect(() => {
    dispatch(fetchProfile());
    return () => {
      dispatch(resetMyPageState());
    };
  }, [dispatch]);

  // 프로필 정보 로드 후 폼 데이터 설정
  useEffect(() => {
    if (profile) {
      if (!isUpdatingRef.current || !isInitialLoadComplete) {
        setFormData({
          name: profile.name || "",
          gender: profile.gender || "",
          birth_date: profile.birth_date || "",
          profile_image: null,
        });

        // 프로필 이미지 설정
        if (profile.profile_image) {
          const imageUrl = profile.profile_image.startsWith("http")
            ? profile.profile_image
            : `http://13.125.180.222${profile.profile_image}`;
          setPreviewImage(imageUrl);
        } else {
          setPreviewImage("../../assets/profile-none.png");
        }

        setIsInitialLoadComplete(true);
      }
    }
  }, [profile, isInitialLoadComplete]);

  // 업데이트 성공 처리
  useEffect(() => {
    if (success) {
      alert("프로필이 성공적으로 수정되었습니다!");
      isUpdatingRef.current = false;
      dispatch(resetMyPageState());

      // 프리뷰 이미지 업데이트
      if (profile?.profile_image) {
        const imageUrl = profile.profile_image.startsWith("http")
          ? profile.profile_image
          : `http://13.125.180.222${profile.profile_image}`;
        setPreviewImage(imageUrl);
      }
    }
  }, [success, dispatch, profile]);

  // 탭 클릭 핸들러
  const handleTabClick = useCallback((tabKey: TabType) => {
    setActiveTab(tabKey);
  }, []);

  // 입력 변경 핸들러
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    },
    [formData]
  );

  // 블러 핸들러
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (value.trim()) {
        setTouchedFields(prev => ({
          ...prev,
          [name]: true,
        }));
      }
    },
    []
  );

  // 이미지 변경 핸들러
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // 이미지 미리보기
        const reader = new FileReader();
        reader.onload = event => {
          const result = event.target?.result;
          if (result && typeof result === "string") {
            setPreviewImage(result);
          }
        };
        reader.onerror = () => {
          alert("이미지 파일을 읽는 중 오류가 발생했습니다.");
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
    },
    [formData, dispatch]
  );

  // 탭 콘텐츠 렌더링
  const renderTabContent = useCallback(() => {
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
  }, [
    activeTab,
    formData,
    validationMessages,
    touchedFields,
    previewImage,
    loading,
    error,
    isSubmitDisabled,
    handleInputChange,
    handleBlur,
    handleImageChange,
    handleSubmit,
  ]);

  if (loading && !profile) {
    return <LoadingMessage message="프로필 정보를 불러오는 중..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <div className="w-64 bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MyPage);
