interface CapsuleStepProgressProps {
  activeSegments: number;
  totalSegments?: number;
}

export default function CapsuleStepProgress({
  activeSegments,
  totalSegments = 4,
}: CapsuleStepProgressProps) {
  const widthPercent = Math.min(
    100,
    Math.max(0, (activeSegments / totalSegments) * 100),
  );

  return (
    <div
      className="bg-border-default h-1 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow={activeSegments}
      aria-valuemin={1}
      aria-valuemax={totalSegments}
    >
      <div
        className="bg-primary h-full rounded-full transition-all duration-300"
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  );
}
