interface CapsuleIconProps {
  src: string;
  /** 표시 크기 (Figma px) */
  width: number;
  height: number;
}

/**
 * 캡슐 아이콘 이미지.
 * 원본 PNG 의 여백을 Figma 와 같은 비율로 잘라낸다.
 * 자체가 relative 라 위치를 옮기려면 바깥에서 감싸야 한다.
 */
export default function CapsuleIcon({ src, width, height }: CapsuleIconProps) {
  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <img
        src={src}
        alt=""
        className="absolute top-[-14.84%] left-[-9%] h-[129.67%] w-[118%] max-w-none"
      />
    </div>
  );
}
