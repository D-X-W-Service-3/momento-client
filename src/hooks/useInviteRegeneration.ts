import { useEffect, useRef } from 'react';
import { useRegenerateInviteLink } from '@/hooks/useCapsule';
import type { CapsuleInviteRole } from '@/types/capsule';

export function useInviteRegeneration(
  open: boolean,
  capsuleId: string,
  role: CapsuleInviteRole,
) {
  const { mutateAsync, reset, ...mutation } = useRegenerateInviteLink(
    capsuleId,
    role,
  );
  const inFlight = useRef(false);
  useEffect(() => {
    reset();
  }, [open, capsuleId, role, reset]);
  const regenerate = async () => {
    if (inFlight.current || !capsuleId) return;
    inFlight.current = true;
    try {
      await mutateAsync();
    } catch {
      /* 오류는 시트에 표시하고 기존 링크는 유지한다. */
    } finally {
      inFlight.current = false;
    }
  };
  return { ...mutation, regenerate };
}
