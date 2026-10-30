import capsuleHomeMascotImg from '@/assets/images/capsule-home-mascot.png';
import CapsuleFab from '@/components/capsule/CapsuleFab';
import CapsuleFeaturedSection from '@/components/capsule/CapsuleFeaturedSection';
import CapsuleHorizontalSection from '@/components/capsule/CapsuleHorizontalSection';
import CapsuleRequestBanner from '@/components/capsule/CapsuleRequestBanner';
import CapsuleSearchBar from '@/components/capsule/CapsuleSearchBar';
import HomeHeader from '@/components/layout/HomeHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useCapsuleHome } from '@/hooks/useCapsuleHome';
import { textStyles } from '@/styles/tokens';

export default function CapsuleHomePage() {
  const {
    data,
    activeSlide,
    editableCapsules,
    lockedCapsules,
    openedCapsules,
    handleSearchClick,
    handleNotifications,
    handleViewList,
    handleSelectSlide,
  } = useCapsuleHome();

  return (
    <MobileLayout withNav>
      <HomeHeader onClickBell={handleNotifications} />

      <div className="flex flex-col gap-8 px-5 pb-8">
        <section className="relative flex w-full flex-col">
          <div className="relative flex h-[200px] w-full items-center justify-between">
            <div className="relative z-10 flex w-[198px] flex-col gap-2 py-10">
              <h1 className={`text-text-primary ${textStyles['heading-h2']}`}>
                타임캡슐
              </h1>
              <p className={`text-text-secondary ${textStyles['body-xs']}`}>
                우리의 시간이
                <br />
                차곡차곡 쌓이고 있어요
              </p>
            </div>

            <img
              src={capsuleHomeMascotImg}
              alt="타임캡슐 모모 캐릭터"
              className="relative z-10 h-[168px] w-[155px] shrink-0 object-contain"
            />
          </div>

          <div className="relative z-20 -mt-[30px] flex w-full flex-col gap-3">
            <CapsuleSearchBar readOnly onClick={handleSearchClick} />
            {data?.hasPendingRequest && (
              <CapsuleRequestBanner onClick={handleNotifications} />
            )}
          </div>
        </section>

        {data?.featuredCapsules && data.featuredCapsules.length > 0 && (
          <CapsuleFeaturedSection
            capsules={data.featuredCapsules}
            activeSlide={activeSlide}
            onSelectSlide={handleSelectSlide}
            onViewAll={() => handleViewList('all')}
          />
        )}

        <CapsuleHorizontalSection
          title="수정할 수 있어요"
          items={editableCapsules}
          onViewAll={() => handleViewList('editable')}
        />

        <CapsuleHorizontalSection
          title="캡슐이 잠겨있어요"
          items={lockedCapsules}
          onViewAll={() => handleViewList('locked')}
        />

        <CapsuleHorizontalSection
          title="추억이 열렸어요"
          items={openedCapsules}
          onViewAll={() => handleViewList('opened')}
        />
      </div>

      <CapsuleFab />
    </MobileLayout>
  );
}
