import { useEffect, useState } from 'react';

/** 플래시가 걷히는 시간. 영상의 흰빛이 서서히 가라앉는 정도로 잡았다. */
const FADE_MS = 700;

/**
 * 연출 영상이 끝에서 흰빛으로 플래시되는데, 그 직후 캡슐 커버로 바로 넘어가면
 * 흰 화면에서 짙은 보라로 뚝 끊긴다. 영상의 마지막 프레임 색을 그대로 덮고
 * 서서히 걷어내 두 화면이 이어지게 한다.
 */
interface OpeningFlashProps {
  ready: boolean;
  onFinished: () => void;
}

export default function OpeningFlash({ ready, onFinished }: OpeningFlashProps) {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // 캐시된 커버에서도 흰빛이 한 프레임 표시된 뒤 페이드한다.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setFaded(true));
    });
    return () => cancelAnimationFrame(id);
  }, [ready]);

  return (
    <div
      aria-hidden
      onTransitionEnd={onFinished}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`pointer-events-none fixed inset-0 z-50 bg-capsule-flash transition-opacity ease-out ${
        faded ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}
