interface CharacterCountProps {
  value: number;
  max: number;
  className?: string;
}

/** 입력 필드 우측의 "0/200" 글자수 표시 */
export default function CharacterCount({
  value,
  max,
  className = '',
}: CharacterCountProps) {
  return (
    <p
      className={`font-display text-note font-medium whitespace-nowrap ${className}`}
    >
      {value}/{max}
    </p>
  );
}
