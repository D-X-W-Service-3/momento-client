interface Props {
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => unknown;
  empty?: boolean;
  emptyMessage?: string;
}
export default function QueryFeedback({
  loading,
  error,
  onRetry,
  empty,
  emptyMessage = '아직 표시할 내용이 없어요.',
}: Props) {
  if (loading)
    return (
      <p className="text-body-sm text-text-muted p-5" role="status">
        불러오는 중이에요…
      </p>
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
    <p className="text-body-sm text-text-muted p-5">{emptyMessage}</p>
  ) : null;
}
