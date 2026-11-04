export interface NicknameValidationResult {
  isValid: boolean;
  isError: boolean;
  message: string;
}
export function validateNickname(nickname: string): NicknameValidationResult {
  const length = nickname.trim().length;
  return {
    isValid: length >= 2 && length <= 20,
    isError: length > 0 && (length < 2 || length > 20),
    message:
      length === 0
        ? ''
        : length < 2 || length > 20
          ? '닉네임은 2~20자로 입력해 주세요.'
          : '',
  };
}
