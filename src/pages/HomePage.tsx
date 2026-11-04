import AttendanceStreakCard from '@/components/home/AttendanceStreakCard';
import QueryFeedback from '@/components/common/QueryFeedback';
import CapsuleCreateBanner from '@/components/home/CapsuleCreateBanner';
import HeroCapsuleCard from '@/components/home/HeroCapsuleCard';
import HomeCapsuleSection from '@/components/home/HomeCapsuleSection';
import HomeHeader from '@/components/layout/HomeHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';

export default function HomePage() {
  const {
    dashboard,
    isLoading,
    error,
    retry,
    handleNotifications,
    handleProfile,
    handleCreateCapsule,
    handleViewAllCapsules,
    handleSelectCapsule,
  } = useHomeDashboard();

  return (
    <MobileLayout withNav>
      <HomeHeader
        onClickBell={handleNotifications}
        onClickProfile={handleProfile}
        hasUnreadNotification={dashboard?.hasUnreadNotification}
      />

      <QueryFeedback loading={isLoading} error={error} onRetry={retry} />
      {dashboard && (
        <div className="bg-surface-gray flex flex-col gap-5 px-5 pt-[10px] pb-5">
          <section className="flex flex-col gap-3">
            {dashboard.heroCapsule && (
              <HeroCapsuleCard
                capsule={dashboard.heroCapsule}
                onClick={() =>
                  handleSelectCapsule(String(dashboard.heroCapsule!.id))
                }
              />
            )}
            <CapsuleCreateBanner onClick={handleCreateCapsule} />
          </section>

          {dashboard.featuredCapsules.map((capsule, index) => (
            <HomeCapsuleSection
              key={capsule.id}
              capsule={capsule}
              showHeading={index === 0}
              onViewAll={handleViewAllCapsules}
              onSelectCapsule={handleSelectCapsule}
            />
          ))}
          <QueryFeedback
            empty={dashboard.featuredCapsules.length === 0}
            emptyMessage="첫 타임캡슐을 만들어 보세요."
          />

          <AttendanceStreakCard
            days={dashboard.attendanceDays}
            streakCount={dashboard.streakCount}
          />
        </div>
      )}
    </MobileLayout>
  );
}
