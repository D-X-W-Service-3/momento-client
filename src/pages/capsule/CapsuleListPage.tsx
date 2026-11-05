import PageIntro from '@/components/layout/PageIntro';
import capsuleListMascotImg from '@/assets/images/capsule-list-mascot.png';
import CapsuleFab from '@/components/capsule/CapsuleFab';
import QueryFeedback from '@/components/common/QueryFeedback';
import CapsuleFilterChips from '@/components/capsule/CapsuleFilterChips';
import CapsuleListCard from '@/components/capsule/CapsuleListCard';
import CapsuleSearchBar from '@/components/capsule/CapsuleSearchBar';
import HomeHeader from '@/components/layout/HomeHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useCapsuleList } from '@/hooks/useCapsuleList';
import { textStyles } from '@/styles/tokens';

export default function CapsuleListPage() {
  const {
    filters,
    selectedFilter,
    searchQuery,
    searchInputRef,
    shouldFocusSearch,
    groupedByYear,
    isLoading,
    error,
    retry,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    handleFilterChange,
    handleSearchChange,
    handleNotifications,
    handleSelectCapsule,
  } = useCapsuleList();

  return (
    <MobileLayout withNav>
      <HomeHeader onClickBell={handleNotifications} />

      <div className="flex min-h-[calc(100dvh-126px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col gap-5 px-5 pb-8">
        <PageIntro
          title="타임캡슐 목록"
          description={
            <>
              모든 타임캡슐을
              <br />
              상태별로 확인할 수 있어요
            </>
          }
          illustration={
            <img
              src={capsuleListMascotImg}
              alt="모모 캐릭터"
              className="h-[168px] w-auto"
            />
          }
        >
          <CapsuleSearchBar
            inputRef={searchInputRef}
            autoFocus={shouldFocusSearch}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CapsuleFilterChips
            options={filters}
            selected={selectedFilter}
            onSelect={handleFilterChange}
          />
        </PageIntro>
        <div className="flex w-full flex-1 flex-col gap-5">
          <QueryFeedback
            loading={isLoading}
            error={error}
            onRetry={retry}
            empty={groupedByYear.length === 0}
            emptyDescription={
              searchQuery.trim()
                ? '다른 검색어로 다시 찾아보세요.'
                : '소중한 사람들과 미래에 열어볼 추억을 남겨보세요.'
            }
            emptyMessage={
              searchQuery.trim()
                ? '검색 결과가 없어요'
                : selectedFilter === 'all'
                  ? '새로운 캡슐을 만들어보세요'
                  : '이 상태의 캡슐이 아직 없어요'
            }
          />
          {groupedByYear.map((group) => (
            <section key={group.year} className="flex w-full flex-col gap-4">
              <h2 className={`text-text-primary ${textStyles['header-title']}`}>
                {group.year}년
              </h2>

              <div className="flex w-full flex-col gap-4">
                {group.items.map((item) => (
                  <CapsuleListCard
                    key={item.id}
                    item={item}
                    onClick={() => handleSelectCapsule(item.id)}
                  />
                ))}
              </div>
            </section>
          ))}
          {hasNextPage && (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => void loadMore()}
              className="text-primary rounded-lg border p-3 disabled:opacity-50"
            >
              {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
            </button>
          )}
        </div>
      </div>

      <CapsuleFab />
    </MobileLayout>
  );
}
