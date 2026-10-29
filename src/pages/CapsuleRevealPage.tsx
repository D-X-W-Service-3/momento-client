import { useNavigate, useParams } from 'react-router-dom';

import revealBg from '@/assets/images/capsule/reveal-bg.webp';
import Button from '@/components/common/Button';
import { ROUTES, capsuleCoverPath } from '@/constants/routes';

/** 개봉일이 된 캡슐을 열기 전에 보여주는 인트로 화면 */
export default function CapsuleRevealPage() {
  const { capsuleId = '' } = useParams();
  const navigate = useNavigate();

  return (
    // 배경 이미지는 모바일 폭(max-w-md) 안에만 깔고,
    // 그보다 넓은 화면에서는 이미지 가장자리 색 그라데이션으로 메운다.
    <div className="min-h-[100dvh] bg-gradient-to-b from-reveal-bg-from via-reveal-bg-via to-reveal-bg-to">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-between overflow-hidden px-5 pt-[max(37px,env(safe-area-inset-top))] pb-[max(37px,env(safe-area-inset-bottom))]">
        <img
          src={revealBg}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />

        <h1 className="relative text-center font-serif text-display-serif font-bold text-on-primary">
          그때의 우리가 남긴 마음을
          <br />
          지금 만나볼까요?
        </h1>

        <div className="relative flex flex-col gap-[5px]">
          <Button
            variant="plain"
            className="bg-surface text-black/85"
            onClick={() => navigate(capsuleCoverPath(capsuleId))}
          >
            타임캡슐 확인하기
          </Button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.HOME)}
            className="flex h-[18px] items-center justify-center font-display text-caption text-on-primary underline"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
