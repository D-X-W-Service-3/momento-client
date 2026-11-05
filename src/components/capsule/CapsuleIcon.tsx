interface CapsuleIconProps {
  src: string;
  /** 표시 크기 (Figma px) */
  width: number;
  height: number;
}

/** 캡슐 아이콘 이미지를 원본 비율 그대로 표시한다. */
export default function CapsuleIcon({ src, width, height }: CapsuleIconProps) {
  return (
    <div className="relative" style={{ width, height }}>
      <img src={src} alt="" className="h-full w-full object-contain" />
    </div>
  );
}
