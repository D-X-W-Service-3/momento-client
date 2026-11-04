import capsuleHomeMascotImg from '@/assets/images/capsule-home-mascot.png';
import PageIntro from '@/components/layout/PageIntro';
import CapsuleSearchBar from '@/components/capsule/CapsuleSearchBar';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import ArchiveCard from '@/components/archive/ArchiveCard';
import ArchiveEmptyState from '@/components/archive/ArchiveEmptyState';
import QueryFeedback from '@/components/common/QueryFeedback';
import { PlusIcon } from '@/components/common/Icons';
import { BrandHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { getMemories, toKoreanDate } from '@/apis/momento';
import type { Archive } from '@/types/momento';

export default function ArchivePage() {
  const [query, setQuery] = useState('');
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ['memories', query],
    queryFn: () => getMemories(query),
    retry: false,
  });
  const hasReceived = data?.hasReceivedMemory ?? false;
  const archives: Archive[] = (data?.memories ?? []).map((item) => ({
    id: item.memoryId,
    title: item.title,
    date: toKoreanDate(item.memoryDate),
    year: Number(item.memoryDate.slice(0, 4)),
    author: item.authorNickname,
    content: '',
    images: item.thumbnailUrl ? [item.thumbnailUrl] : [],
    imageCount: item.imageCount,
  }));
  const grouped = archives.reduce<Record<string, Archive[]>>(
    (result, archive) => {
      const year = String(archive.year);
      result[year] = [...(result[year] ?? []), archive];
      return result;
    },
    {},
  );

  return (
    <MobileLayout withNav className="archive-page">
      <div className="flex min-h-[calc(100dvh-70px)] flex-col">
        <BrandHeader />
        <section className="page-body archive-body flex-1">
          <PageIntro
            title="아카이브"
            description={
              <>
                오늘의
                <br />
                추억을 저장해보세요
              </>
            }
            illustration={
              <img
                src={capsuleHomeMascotImg}
                alt="모모 캐릭터"
                className="h-[168px] w-auto"
              />
            }
          >
            <CapsuleSearchBar
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="아카이브 제목, 내용으로 검색"
            />
          </PageIntro>
          <QueryFeedback loading={isPending} error={error} onRetry={refetch} />
          {hasReceived && (
            <Link to="/archives/shared" className="shared-banner">
              <span>
                <small>공유받은 아카이브가 있어요</small>
                <strong>지금 확인하기</strong>
              </span>
              <span>›</span>
            </Link>
          )}
          {data && !error && archives.length === 0 && (
            <ArchiveEmptyState hasSearchQuery={Boolean(query.trim())} />
          )}
          {Object.entries(grouped).map(([year, yearArchives]) => (
            <section className="archive-year" key={year}>
              <h2>{year}년</h2>
              {yearArchives?.map((archive) => (
                <ArchiveCard key={archive.id} archive={archive} />
              ))}
            </section>
          ))}
        </section>
        <Link
          className="floating-button"
          to="/archives/new"
          aria-label="아카이브 추가"
        >
          <PlusIcon className="h-6 w-6" />
        </Link>
      </div>
    </MobileLayout>
  );
}
