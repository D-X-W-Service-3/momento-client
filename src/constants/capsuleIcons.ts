import airplaneIcon from '@/assets/images/capsule-icons/airplane.webp';
import cameraIcon from '@/assets/images/capsule-icons/camera.webp';
import giftIcon from '@/assets/images/capsule-icons/gift.webp';
import heartIcon from '@/assets/images/capsule-icons/heart.webp';
import hourglassIcon from '@/assets/images/capsule-icons/hourglass.webp';
import letterIcon from '@/assets/images/capsule-icons/letter.webp';
import starIcon from '@/assets/images/capsule-icons/star.webp';
import capsuleHero from '@/assets/images/capsule/capsule-hero.webp';
import type { CapsuleIconOption } from '@/types/capsule';

export const CAPSULE_ICONS: CapsuleIconOption[] = [
  { id: 'LETTER', imageUrl: letterIcon },
  { id: 'HEART', imageUrl: heartIcon },
  { id: 'CAMERA', imageUrl: cameraIcon },
  { id: 'GIFT', imageUrl: giftIcon },
  { id: 'AIRPLANE', imageUrl: airplaneIcon },
  { id: 'STAR', imageUrl: starIcon },
  { id: 'HOURGLASS', imageUrl: hourglassIcon },
];

export const DEFAULT_CAPSULE_ICON_TYPE = CAPSULE_ICONS[0].id;

const CAPSULE_ICON_BY_TYPE = new Map(
  CAPSULE_ICONS.map(({ id, imageUrl }) => [id, imageUrl]),
);

/** 기존에 저장된 아이콘 값은 종전 이미지를 유지한다. */
export const capsuleIconSrc = (iconType: string) =>
  CAPSULE_ICON_BY_TYPE.get(iconType) ?? capsuleHero;
