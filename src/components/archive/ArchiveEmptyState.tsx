import ContentState from '@/components/common/ContentState';

export default function ArchiveEmptyState({
  hasSearchQuery,
}: {
  hasSearchQuery: boolean;
}) {
  return (
    <ContentState
      title={
        hasSearchQuery ? '검색 결과가 없어요' : '새로운 아카이브를 만들어보세요'
      }
      description={
        hasSearchQuery
          ? '다른 검색어로 다시 찾아보세요.'
          : '사진과 글로 오늘의 소중한 순간을 남겨보세요.'
      }
    />
  );
}
