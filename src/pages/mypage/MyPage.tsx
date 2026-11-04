import BackHeader from '@/components/layout/BackHeader';
import QueryFeedback from '@/components/common/QueryFeedback';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MobileLayout from '@/components/layout/MobileLayout';
import AccountMenuCard from '@/components/mypage/AccountMenuCard';
import ActivitySummarySection from '@/components/mypage/ActivitySummarySection';
import ProfileSummaryCard from '@/components/mypage/ProfileSummaryCard';
import { useMyPage } from '@/hooks/useMyPage';

export default function MyPage() {
  const {
    profile,
    activityStats,
    isLoading,
    error,
    retry,
    withdrawOpen,
    isWithdrawing,
    withdrawError,
    cancelWithdraw,
    confirmWithdraw,
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
        <QueryFeedback loading={isLoading} error={error} onRetry={retry} />
        {profile && (
          <ProfileSummaryCard
            profile={profile}
            onEditProfile={handleEditProfile}
          />
        )}

        {activityStats && <ActivitySummarySection stats={activityStats} />}

        <AccountMenuCard
          onNotificationSettings={handleNotificationSettings}
          onLogout={handleLogout}
          onWithdraw={handleWithdraw}
        />
      </main>
      <ConfirmDialog
        open={withdrawOpen}
        title="회원 탈퇴할까요?"
        description="탈퇴하면 로그아웃되며, 다시 로그인하면 계정이 복구돼요."
        confirmLabel={isWithdrawing ? '처리 중…' : '탈퇴하기'}
        onConfirm={confirmWithdraw}
        onCancel={cancelWithdraw}
      >
        <QueryFeedback error={withdrawError} />
      </ConfirmDialog>
    </MobileLayout>
  );
}
