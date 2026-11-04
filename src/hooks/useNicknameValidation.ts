import { useQuery } from '@tanstack/react-query';
import { checkNickname } from '@/apis/mypage';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { validateNickname } from '@/utils/validation';

export function useNicknameValidation(value: string, original?: string) {
  const nickname = value.trim();
  const debounced = useDebouncedValue(nickname);
  const local = validateNickname(nickname);
  const unchanged = original !== undefined && nickname === original.trim();
  const query = useQuery({
    queryKey: ['nicknameAvailability', debounced],
    queryFn: () => checkNickname(debounced),
    enabled: local.isValid && debounced === nickname && !unchanged,
    staleTime: 0,
    retry: false,
  });
  if (!local.isValid) return local;
  if (unchanged)
    return {
      isValid: true,
      isError: false,
      message: '현재 사용 중인 닉네임이에요.',
    };
  if (nickname !== debounced || query.isPending || query.isFetching)
    return {
      isValid: false,
      isError: false,
      message: '닉네임을 확인하고 있어요…',
    };
  if (query.error)
    return {
      isValid: false,
      isError: true,
      message: '닉네임 확인에 실패했어요. 잠시 후 다시 입력해 주세요.',
    };
  const available = query.data?.nickname === nickname && query.data.available;
  return {
    isValid: Boolean(available),
    isError: !available,
    message: available
      ? '사용 가능한 닉네임이에요.'
      : '이미 사용 중인 닉네임이에요.',
  };
}
