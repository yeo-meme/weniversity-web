import type {
  ProfileFormData,
  ProfileValidationMessages,
} from "../../types/myPage/myPage";

export const validateProfileName = (name: string): string | undefined => {
  if (!name) {
    return "이름을 입력해주세요.";
  }

  const koreanRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣ\s]+$/;

  if (!koreanRegex.test(name)) {
    return "이름은 한글만 입력 가능합니다.";
  }

  if (name.length < 2) {
    return "이름은 2자 이상이어야 합니다.";
  }

  if (name.length > 10) {
    return "이름은 10자 이하여야 합니다.";
  }

  return undefined;
};

export const validateProfileGender = (gender: string): string | undefined => {
  if (!gender) {
    return "성별을 선택해주세요.";
  }

  return undefined;
};

export const validateProfileBirthDate = (
  birthDate: string
): string | undefined => {
  if (!birthDate) {
    return "생년월일을 입력해주세요.";
  }

  const today = new Date();
  const birth = new Date(birthDate);

  if (birth > today) {
    return "올바른 생년월일을 입력해주세요.";
  }

  const age = today.getFullYear() - birth.getFullYear();
  if (age < 14) {
    return "만 14세 이상만 가입 가능합니다.";
  }

  return undefined;
};

export const validateProfileForm = (
  formData: ProfileFormData
): ProfileValidationMessages => {
  return {
    name: validateProfileName(formData.name),
    gender: validateProfileGender(formData.gender),
    birth_date: validateProfileBirthDate(formData.birth_date),
  };
};

export const isProfileFormValid = (
  validationMessages: ProfileValidationMessages
): boolean => {
  return Object.values(validationMessages).every(message => !message);
};
