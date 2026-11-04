import ContentState from '@/components/common/ContentState';

interface Props {
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => unknown;
  empty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}
export default function QueryFeedback({
  loading,
  error,
  onRetry,
  empty,
  emptyDescription = '새로운 추억을 남겨보세요.',
  emptyMessage = '아직 표시할 내용이 없어요.',
}: Props) {
  if (loading)
    return (
      <ContentState
        title="불러오는 중이에요"
        description="잠시만 기다려주세요."
        loading
      />
    );
  if (error)
    return (
      <div className="text-body-sm text-text-secondary p-5" role="alert">
        <p>{error.message || '불러오지 못했어요.'}</p>
        {onRetry && (
          <button
            type="button"
            className="text-primary mt-2 underline"
            onClick={() => void onRetry()}
          >
            다시 시도
          </button>
        )}
      </div>
    );
  return empty ? (
    <ContentState title={emptyMessage} description={emptyDescription} />
  ) : null;
}
