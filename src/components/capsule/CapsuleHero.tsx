import CapsuleIcon from '@/components/capsule/CapsuleIcon';

export type CapsuleHeroSize = 'md' | 'lg';

const HERO_SIZES: Record<
  CapsuleHeroSize,
  { width: number; height: number; glowWidth: number; glowHeight: number }
> = {
  /** 수정가능 상세 */
  md: { width: 220, height: 200, glowWidth: 220, glowHeight: 200 },
  /**
   * 잠긴/열린 캡슐 상세.
   * 원본만 키우고 글로우는 그대로 둬서 빛이 왼쪽 위로 치우친다 (Figma 그대로).
   */
  lg: { width: 329, height: 300, glowWidth: 220, glowHeight: 200 },
};

/** 선명한 원본 위에 블러 두 겹을 깔아 발광 효과를 낸다. */
const GLOW_BLURS = ['blur-[25px]', 'blur-[2.5px]'];

interface CapsuleHeroProps {
  src: string;
  size?: CapsuleHeroSize;
}

export default function CapsuleHero({ src, size = 'md' }: CapsuleHeroProps) {
  const { width, height, glowWidth, glowHeight } = HERO_SIZES[size];

  return (
    <div aria-hidden className="relative shrink-0" style={{ width, height }}>
      {/* CapsuleIcon 자체가 relative 라 위치 지정은 바깥 div 가 맡는다 */}
      {GLOW_BLURS.map((blur) => (
        <div key={blur} className={`absolute top-0 left-0 ${blur}`}>
          <CapsuleIcon src={src} width={glowWidth} height={glowHeight} />
        </div>
      ))}
      <div className="absolute top-0 left-0">
        <CapsuleIcon src={src} width={width} height={height} />
      </div>
    </div>
  );
}
