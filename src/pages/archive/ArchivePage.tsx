import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ArchiveCard from '@/components/archive/ArchiveCard';
import { PlusIcon, SearchIcon } from '@/components/common/Icons';
import { BrandHeader } from '@/components/layout/Headers';
import MobileLayout from '@/components/layout/MobileLayout';
import { useMomentoStore } from '@/stores/useMomentoStore';
import type { Archive } from '@/types/momento';

export default function ArchivePage() {
  const archives = useMomentoStore((state) => state.archives);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      archives.filter((archive) =>
        `${archive.title} ${archive.content}`.includes(query),
      ),
    [archives, query],
  );
  const grouped = filtered.reduce<Record<string, Archive[]>>(
    (result, archive) => {
      const year = String(archive.year);
      result[year] = [...(result[year] ?? []), archive];
      return result;
    },
    {},
  );

  return (
    <MobileLayout withNav>
      <BrandHeader />
      <section className="archive-hero">
        <div>
          <h1>아카이브</h1>
          <p>
            오늘의
            <br />
            추억을 저장해보세요
          </p>
        </div>
        <img className="hero-cloud" src="/assets/archive/list-01.png" alt="" />
        <div className="hero-mascot">
          <img src="/assets/archive/list-02.png" alt="" />
        </div>
      </section>
      <section className="page-body archive-body">
        <label className="search-field">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="아카이브 제목, 내용으로 검색"
          />
          <SearchIcon />
        </label>
        <Link to="/archives/shared" className="shared-banner">
          <span>
            <small>공유받은 아카이브가 있어요</small>
            <strong>지금 확인하기</strong>
          </span>
          <span>›</span>
        </Link>
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
        <PlusIcon />
      </Link>
    </MobileLayout>
  );
}
