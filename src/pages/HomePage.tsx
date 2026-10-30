import AttendanceStreakCard from '@/components/home/AttendanceStreakCard';
import CapsuleCreateBanner from '@/components/home/CapsuleCreateBanner';
import HeroCapsuleCard from '@/components/home/HeroCapsuleCard';
import HomeCapsuleSection from '@/components/home/HomeCapsuleSection';
import HomeHeader from '@/components/layout/HomeHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';

export default function HomePage() {
  const {
    dashboard,
    handleNotifications,
    handleProfile,
    handleCreateCapsule,
    handleViewAllCapsules,
  } = useHomeDashboard();

  return (
    <MobileLayout withNav>
      <HomeHeader
        onClickBell={handleNotifications}
        onClickProfile={handleProfile}
      />

      {dashboard && (
        <div className="bg-surface-gray flex flex-col gap-5 px-5 pt-[10px] pb-5">
          <section className="flex flex-col gap-3">
            <HeroCapsuleCard capsule={dashboard.heroCapsule} />
            <CapsuleCreateBanner onClick={handleCreateCapsule} />
          </section>

          <HomeCapsuleSection
            capsule={dashboard.featuredCapsule}
            onViewAll={handleViewAllCapsules}
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
