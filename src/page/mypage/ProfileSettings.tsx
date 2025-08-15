import React, { useRef, useCallback, useMemo } from "react";
import type {
  ProfileFormData,
  ProfileValidationMessages,
} from "../../types/myPage/myPage";
import imgIcon from "../../assets/img-icon.png";
import MyPageInput from "../../components/mypage/profilesettings/MyPageInput";
import MyPageSelect from "../../components/mypage/profilesettings/MyPageSelector";
import profileNoneImage from "../../assets/profile-none.png";

interface ProfileSettingsProps {
  formData: ProfileFormData;
  validationMessages: ProfileValidationMessages;
  touchedFields: Record<string, boolean>;
  previewImage: string;
  loading: boolean;
  error: string | null;
  isSubmitDisabled: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  formData,
  validationMessages,
  touchedFields,
  previewImage,
  loading,
  error,
  isSubmitDisabled,
  onInputChange,
  onBlur,
  onImageChange,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 성별 옵션
  const genderOptions = useMemo(
    () => [
      { value: "M", label: "남성" },
      { value: "F", label: "여성" },
    ],
    []
  );

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 이미지 표시 로직
  const getDisplayImage = useCallback(() => {
    return previewImage || profileNoneImage;
  }, [previewImage]);

  // 이미지 에러 핸들러
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = profileNoneImage;
    },
    []
  );

  // 파일 입력 클릭 핸들러
  const handleFileInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      // 같은 파일도 다시 선택 가능하도록 value 초기화
      (e.target as HTMLInputElement).value = "";
    },
    []
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 설정</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
                <img
                  src={getDisplayImage()}
                  alt="프로필"
                  className="w-full h-full object-cover rounded-full"
                  onError={handleImageError}
                />
              </div>

              {/* 이미지 변경 버튼 */}
              <div
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <img src={imgIcon} alt="이미지 변경" />
              </div>
            </div>
          </div>

          {/* 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            onClick={handleFileInputClick}
          />

          <div className="flex-1 space-y-4">
            {/* 이름 */}
            <MyPageInput
              id="name"
              label="이름"
              type="text"
              value={formData.name}
              placeholder="이름을 입력하세요"
              onChange={onInputChange}
              onBlur={onBlur}
              errorMessage={validationMessages.name}
              showError={touchedFields.name}
            />

            <div className="flex gap-6">
              {/* 성별 */}
              <MyPageSelect
                id="gender"
                label="성별"
                value={formData.gender}
                options={genderOptions}
                placeholder="선택"
                onChange={onInputChange}
                onBlur={onBlur}
                errorMessage={validationMessages.gender}
                showError={touchedFields.gender}
              />

              {/* 생년월일 */}
              <MyPageInput
                id="birth_date"
                label="생년월일"
                type="date"
                value={formData.birth_date}
                onChange={onInputChange}
                onBlur={onBlur}
                errorMessage={validationMessages.birth_date}
                showError={touchedFields.birth_date}
              />
            </div>
          </div>
        </div>

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
};

export default React.memo(ProfileSettings);
