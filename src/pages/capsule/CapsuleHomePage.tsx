import PageIntro from '@/components/layout/PageIntro';
import capsuleHomeMascotImg from '@/assets/images/capsule-home-mascot.png';
import CapsuleFab from '@/components/capsule/CapsuleFab';
import ReceivedInvitesSheet from '@/components/capsule/ReceivedInvitesSheet';
import QueryFeedback from '@/components/common/QueryFeedback';
import CapsuleFeaturedSection from '@/components/capsule/CapsuleFeaturedSection';
import CapsuleHorizontalSection from '@/components/capsule/CapsuleHorizontalSection';
import CapsuleRequestBanner from '@/components/capsule/CapsuleRequestBanner';
import CapsuleSearchBar from '@/components/capsule/CapsuleSearchBar';
import HomeHeader from '@/components/layout/HomeHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useCapsuleHome } from '@/hooks/useCapsuleHome';

export default function CapsuleHomePage() {
  const {
    data,
    isLoading,
    error,
    retry,
    invitesOpen,
    openInvites,
    closeInvites,
    activeSlide,
    editableCapsules,
    lockedCapsules,
    openedCapsules,
    handleSearchClick,
    handleNotifications,
    handleViewList,
    handleSelectCapsule,
    handleSelectSlide,
  } = useCapsuleHome();

  return (
    <MobileLayout withNav>
      <HomeHeader onClickBell={handleNotifications} />

      <div className="flex flex-col gap-5 px-5 pb-8">
        <PageIntro
          title="타임캡슐"
          description={
            <>
              우리의 시간이
              <br />
              차곡차곡 쌓이고 있어요
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
          <CapsuleSearchBar readOnly onClick={handleSearchClick} />
          {data?.hasPendingRequest && (
            <CapsuleRequestBanner onClick={openInvites} />
          )}
        </PageIntro>
        {data && (
          <CapsuleFeaturedSection
            capsules={data.featuredCapsules}
            activeSlide={activeSlide}
            onSelectSlide={handleSelectSlide}
            onViewAll={() => handleViewList()}
            onSelectCapsule={handleSelectCapsule}
          />
        )}
        <QueryFeedback loading={isLoading} error={error} onRetry={retry} />
        {data && (
          <>
            <CapsuleHorizontalSection
              title="수정할 수 있어요"
              emptyDescription="새로운 캡슐을 만들어 편지를 모아보세요."
              items={editableCapsules}
              onViewAll={() => handleViewList('editable')}
              onSelectCapsule={handleSelectCapsule}
            />

            <CapsuleHorizontalSection
              title="캡슐이 잠겨있어요"
              emptyDescription="편지 작성이 끝나면 이곳에 모여요."
              items={lockedCapsules}
              onViewAll={() => handleViewList('locked')}
              onSelectCapsule={handleSelectCapsule}
            />

            <CapsuleHorizontalSection
              title="추억이 열렸어요"
              emptyDescription="개봉일이 지나면 이곳에서 만나요."
              items={openedCapsules}
              onViewAll={() => handleViewList('opened')}
              onSelectCapsule={handleSelectCapsule}
            />
          </>
        )}
      </div>

      <CapsuleFab />
      <ReceivedInvitesSheet open={invitesOpen} onClose={closeInvites} />
    </MobileLayout>
  );
}
