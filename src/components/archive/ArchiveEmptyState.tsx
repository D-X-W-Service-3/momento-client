import archiveEmptyMomo from '@/assets/images/home-recommend-momo.png';
import { textStyles } from '@/styles/tokens';

export default function ArchiveEmptyState({
  hasSearchQuery,
}: {
  hasSearchQuery: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
      <img
        src={archiveEmptyMomo}
        alt="추억을 기록하는 모모"
        className="mb-2 h-28 w-28 object-contain"
      />
      <h2 className={`text-text-primary ${textStyles['body-large-semi']}`}>
        {hasSearchQuery
          ? '검색 결과가 없어요'
          : '새로운 아카이브를 만들어보세요'}
      </h2>
      <p
        className={`text-text-secondary max-w-[260px] ${textStyles['body-xs']}`}
      >
        {hasSearchQuery
          ? '다른 검색어로 다시 찾아보세요.'
          : '사진과 글로 오늘의 소중한 순간을 남겨보세요.'}
      </p>
    </div>
  );
}
