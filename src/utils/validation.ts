export interface NicknameValidationResult {
  isValid: boolean;
  isError: boolean;
  message: string;
}

export function validateNickname(nickname: string): NicknameValidationResult {
  const trimmed = nickname.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      isError: false,
      message: '',
    };
  }

  if (trimmed.length > 10) {
    return {
      isValid: false,
      isError: true,
      message: '닉네임은 10자 이하로 입력해주세요',
    };
  }

  return {
    isValid: true,
    isError: false,
    message: '사용 가능한 닉네임입니다',
  };
}
