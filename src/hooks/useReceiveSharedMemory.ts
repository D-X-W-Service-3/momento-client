import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { receiveMemory } from '@/apis/momento';

export function useReceiveSharedMemory(token: string | null) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const request = useRef<{ token: string; promise: Promise<void> } | null>(
    null,
  );
  const [failure, setFailure] = useState<{ token: string; message: string }>();

  useEffect(() => {
    if (!token) return;
    let active = true;
    // StrictMode 재실행은 같은 요청을 기다리고, 토큰이 바뀌면 새로 받는다.
    if (request.current?.token !== token) {
      request.current = { token, promise: receiveMemory(token) };
    }
    void request.current.promise
      .then(async () => {
        if (!active) return;
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['received-memories'] }),
          queryClient.invalidateQueries({ queryKey: ['memories'] }),
        ]);
        if (active) navigate('/archives/shared', { replace: true });
      })
      .catch((reason: Error) => {
        if (active) setFailure({ token, message: reason.message });
      });
    return () => {
      active = false;
    };
  }, [token, navigate, queryClient]);

  return failure?.token === token ? failure.message : '';
}
