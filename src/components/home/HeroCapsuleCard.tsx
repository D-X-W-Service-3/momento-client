import homeHeroBg from '@/assets/images/home-hero-bg.png';
import homeHeroCharacter from '@/assets/images/home-hero-character.png';
import { textStyles } from '@/styles/tokens';
import type { HeroCapsuleInfo } from '@/types/home';

interface HeroCapsuleCardProps {
  capsule: HeroCapsuleInfo;
  onClick?: () => void;
}

export default function HeroCapsuleCard({
  capsule,
  onClick,
}: HeroCapsuleCardProps) {
  return (
    <article
      onClick={onClick}
      className={`relative h-[330px] w-full overflow-hidden rounded-xl ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <img
        src={homeHeroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <img
        src={homeHeroCharacter}
        alt="편지를 든 모모 캐릭터"
        className="pointer-events-none absolute right-0 bottom-0 h-[193px] w-[184px] object-contain"
      />

      <div className="relative z-10 flex h-full flex-col justify-between pt-[43px] pb-[31px] pl-[29px] pr-5">
        <div className="flex flex-col items-start gap-3">
          <span
            className={`bg-primary-badge text-primary inline-flex h-[30px] items-center justify-center rounded-full px-[10px] py-[7px] ${textStyles['body-small-med']}`}
          >
            {capsule.tag}
          </span>

          <div className="flex flex-col gap-[5px]">
            <h2 className={`text-text-primary ${textStyles['heading-h1']}`}>
              {capsule.title}
            </h2>
            <p className={`text-primary ${textStyles['display-dday']}`}>
              {capsule.dDay}
            </p>
            <p className={`text-text-secondary ${textStyles['body-medium']}`}>
              {capsule.releaseDate}
            </p>
          </div>
        </div>

        <div className="bg-surface-white rounded-badge inline-flex h-[30px] w-fit items-center justify-center px-[7px] py-[7px]">
          <p className={textStyles['body-small-med']}>
            <span className="text-primary">{capsule.remainingTime} </span>
            <span className="text-gray-450">{capsule.remainingSuffix}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
