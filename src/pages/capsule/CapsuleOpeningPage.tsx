import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import letterGalaxy from '@/assets/videos/letter-galaxy.mp4';
import { capsuleCoverPath } from '@/constants/routes';

/** 영상 길이(5초)에 버퍼를 둔 값. 재생이 멎어도 여기서 넘긴다. */
const FALLBACK_MS = 7500;

/**
 * 개봉 확인 직후 잠깐 보여주는 연출 화면.
 * 영상(5초)이 끝나면 캡슐 커버로 넘어간다.
 */
export default function CapsuleOpeningPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  // 영상 로드 전 첫 프레임이 뜨기 전까지 흰 화면이 보이지 않도록 가려둔다.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // StrictMode 는 effect 를 두 번 돌린다. 정리된 쪽의 play() 는 AbortError 로
    // reject 되는데, 그걸 재생 실패로 보고 넘기면 영상이 시작하자마자 화면이
    // 넘어가 버린다.
    let cancelled = false;

    /**
     * flashed: 영상이 끝까지 재생돼 흰 플래시로 마무리된 경우에만 true.
     * 커버가 그 흰빛을 이어받아 떠오르도록 알려준다. 재생이 실패했을 때는
     * 화면이 희지 않으므로 커버가 그냥 떠야 한다.
     */
    const goCover = (flashed: boolean) => {
      if (cancelled) return;
      navigate(capsuleCoverPath(capsuleId), {
        replace: true,
        state: { fromOpening: flashed },
      });
    };

    // 재생이 막히거나 버퍼링으로 멎어도 사용자가 갇히지 않게 한다.
    const timer = setTimeout(() => goCover(false), FALLBACK_MS);

    const video = videoRef.current;
    if (!video) {
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    const finish = (flashed: boolean) => {
      clearTimeout(timer);
      goCover(flashed);
    };
    const handleEnded = () => finish(true);
    const handleError = () => finish(false);

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // 자동재생이 거부되면 기다릴 이유가 없다. 바로 넘긴다.
    void video.play().catch(handleError);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [capsuleId, navigate]);

  return (
    // 영상 가장자리 색이 리빌 화면 배경과 같은 계열이다. 같은 그라데이션을
    // 깔아 두면 넓은 화면에서 양옆이 비지 않고, 직전 화면에서 넘어올 때도
    // 배경색이 튀지 않는다.
    <div className="min-h-[100dvh] bg-gradient-to-b from-reveal-bg-from via-reveal-bg-via to-reveal-bg-to">
      <div className="relative mx-auto h-[100dvh] w-full max-w-app overflow-hidden">
        <video
          ref={videoRef}
          src={letterGalaxy}
          // 모바일 브라우저는 muted + playsInline 이어야 자동재생을 허용한다.
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          aria-hidden
          className={`size-full object-cover transition-opacity duration-300 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
}
