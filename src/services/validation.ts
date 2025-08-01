import type { RegisterFormData, ValidationMessages } from "../types/user";

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "이메일을 입력해주세요.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "올바른 이메일 형식을 입력해주세요.";
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "비밀번호를 입력해주세요.";
  }

  if (password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!passwordRegex.test(password)) {
    return "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.";
  }

  return undefined;
};

export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
): string | undefined => {
  if (!passwordConfirm) {
    return "비밀번호 확인을 입력해주세요.";
  }

  if (password !== passwordConfirm) {
    return "비밀번호가 일치하지 않습니다.";
  }

  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name) {
    return "이름을 입력해주세요.";
  }

  if (name.length < 2) {
    return "이름은 2자 이상이어야 합니다.";
  }

  if (name.length > 10) {
    return "이름은 10자 이하여야 합니다.";
  }

  const koreanRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣ\s]+$/;

  if (!koreanRegex.test(name)) {
    return "이름은 한글만 입력 가능합니다.";
  }

  return undefined;
};

export const validateGender = (gender: string): string | undefined => {
  if (!gender) {
    return "성별을 선택해주세요.";
  }

  return undefined;
};

export const validateBirthDate = (birthDate: string): string | undefined => {
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

export const validateForm = (
  formData: RegisterFormData
): ValidationMessages => {
  return {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
    passwordConfirm: validatePasswordConfirm(
      formData.password,
      formData.passwordConfirm
    ),
    name: validateName(formData.name),
    gender: validateGender(formData.gender),
    birth_date: validateBirthDate(formData.birth_date),
  };
};

export const isFormValid = (
  validationMessages: ValidationMessages
): boolean => {
  return Object.values(validationMessages).every(message => !message);
};
