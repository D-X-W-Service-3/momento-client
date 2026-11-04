import momo from '@/assets/images/home-recommend-momo.png';
import { textStyles } from '@/styles/tokens';

interface ContentStateProps {
  title: string;
  description?: string;
  loading?: boolean;
}

export default function ContentState({
  title,
  description,
  loading,
}: ContentStateProps) {
  return (
    <div
      className="flex min-h-60 flex-1 flex-col items-center justify-center gap-3 py-8 text-center"
      role="status"
      aria-live="polite"
      aria-busy={loading || undefined}
    >
      <img src={momo} alt="" className="mb-2 size-28 object-contain" />
      <h2 className={`text-text-primary ${textStyles['body-large-semi']}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-[260px] text-text-secondary ${textStyles['body-xs']}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
