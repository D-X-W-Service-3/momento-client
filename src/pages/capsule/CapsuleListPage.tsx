import capsuleListMascotImg from '@/assets/images/capsule-list-mascot.png';
import CapsuleFab from '@/components/capsule/CapsuleFab';
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
    handleFilterChange,
    handleSearchChange,
    handleNotifications,
  } = useCapsuleList();

  return (
    <MobileLayout withNav>
      <HomeHeader showProfile={false} onClickBell={handleNotifications} />

      <div className="flex flex-col gap-5 px-5 pb-8">
        <section className="flex w-full flex-col">
          <div className="flex h-[200px] w-full items-center justify-between">
            <div className="flex w-[182px] flex-col gap-2 py-10">
              <h1 className={`text-text-primary ${textStyles['heading-h2']}`}>
                타임캡슐 목록
              </h1>
              <p className={`text-text-secondary ${textStyles['body-xs']}`}>
                모든 타임캡슐을
                <br />
                상태별로 확인할 수 있어요
              </p>
            </div>

            <img
              src={capsuleListMascotImg}
              alt="돋보기를 든 모모 캐릭터"
              className="h-[168px] w-[171px] shrink-0 object-contain"
            />
          </div>

          <div className="relative z-10 -mt-[30px] flex w-full flex-col gap-3">
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
          </div>
        </section>

        <div className="flex w-full flex-col gap-5">
          {groupedByYear.map((group) => (
            <section key={group.year} className="flex w-full flex-col gap-4">
              <h2 className={`text-text-primary ${textStyles['header-title']}`}>
                {group.year}년
              </h2>

              <div className="flex w-full flex-col gap-4">
                {group.items.map((item) => (
                  <CapsuleListCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <CapsuleFab />
    </MobileLayout>
  );
}
