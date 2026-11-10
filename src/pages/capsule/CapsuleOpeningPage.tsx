import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import letterGalaxy from '@/assets/videos/letter-galaxy.mp4';
import { capsuleCoverPath } from '@/constants/routes';

/** 영상 길이(6.6초)에 버퍼를 둔 값. 재생이 멎어도 여기서 넘긴다. */
const FALLBACK_MS = 9000;

/**
 * 개봉 확인 직후 잠깐 보여주는 연출 화면.
 * 영상이 끝나면 캡슐 커버로 넘어간다.
 */
export default function CapsuleOpeningPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  // 영상 로드 전 첫 프레임이 뜨기 전까지 흰 화면이 보이지 않도록 가려둔다.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const goCover = () =>
      navigate(capsuleCoverPath(capsuleId), { replace: true });

    // 재생이 막히거나 버퍼링으로 멎어도 사용자가 갇히지 않게 한다.
    const timer = setTimeout(goCover, FALLBACK_MS);
    const video = videoRef.current;
    if (!video) return () => clearTimeout(timer);

    const handleEnd = () => {
      clearTimeout(timer);
      goCover();
    };
    video.addEventListener('ended', handleEnd);
    video.addEventListener('error', handleEnd);

    // 자동재생이 거부되면 기다릴 이유가 없다. 바로 넘긴다.
    void video.play().catch(handleEnd);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('ended', handleEnd);
      video.removeEventListener('error', handleEnd);
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
