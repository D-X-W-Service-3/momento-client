import { useEffect, useRef, useState } from 'react';

export function useInviteSharing(
  open: boolean,
  inviteUrl: string,
  title: string,
  onClose: () => void,
) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    setCopied(false);
    setError('');
    return () => {
      clearTimeout(timer.current);
    };
  }, [open, inviteUrl]);

  const copyLink = async () => {
    if (!inviteUrl) return;
    setError('');
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('링크를 복사하지 못했어요. 다시 시도해 주세요.');
    }
  };
  const share = async () => {
    if (!inviteUrl) return;
    if (!navigator.share) return copyLink();
    setError('');
    try {
      await navigator.share({ url: inviteUrl, title });
      onClose();
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'AbortError')) {
        setError('링크를 공유하지 못했어요. 복사 버튼을 이용해 주세요.');
      }
    }
  };
  return { copied, error, copyLink, share };
}
