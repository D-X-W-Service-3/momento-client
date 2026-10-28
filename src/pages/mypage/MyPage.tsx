import BackHeader from '@/components/layout/BackHeader';
import MobileLayout from '@/components/layout/MobileLayout';
import AccountMenuCard from '@/components/mypage/AccountMenuCard';
import ActivitySummarySection from '@/components/mypage/ActivitySummarySection';
import ProfileSummaryCard from '@/components/mypage/ProfileSummaryCard';
import { useMyPage } from '@/hooks/useMyPage';

export default function MyPage() {
  const {
    profile,
    activityStats,
    handleBack,
    handleEditProfile,
    handleNotificationSettings,
    handleLogout,
    handleWithdraw,
  } = useMyPage();

  return (
    <MobileLayout variant="gray">
      <BackHeader
        title="마이페이지"
        onBack={handleBack}
        showMore
        className="bg-surface-gray"
      />

      <main className="flex flex-1 flex-col gap-8 p-5">
        <ProfileSummaryCard
          profile={profile}
          onEditProfile={handleEditProfile}
        />

        <ActivitySummarySection stats={activityStats} />

        <AccountMenuCard
          onNotificationSettings={handleNotificationSettings}
          onLogout={handleLogout}
          onWithdraw={handleWithdraw}
        />
      </main>
    </MobileLayout>
  );
}
