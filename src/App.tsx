import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ApiError } from '@/apis/client';
import ToastHost from '@/components/common/ToastHost';
import { ROUTES } from '@/constants/routes';
import { usePushBridge } from '@/hooks/usePushBridge';
import RequireAuth from '@/routes/RequireAuth';
import RequireLetterWriting from '@/routes/RequireLetterWriting';
import CapsuleCoverPage from '@/pages/capsule/CapsuleCoverPage';
import CapsuleDetailPage from '@/pages/capsule/CapsuleDetailPage';
import CapsuleEditPage from '@/pages/capsule/CapsuleEditPage';
import CapsuleInviteDetailPage from '@/pages/capsule/CapsuleInviteDetailPage';
import CapsuleInvitePage from '@/pages/capsule/CapsuleInvitePage';
import CapsuleMembersPage from '@/pages/capsule/CapsuleMembersPage';
import CapsuleRevealPage from '@/pages/capsule/CapsuleRevealPage';
import HomePage from '@/pages/HomePage';
import LetterCreatePage from '@/pages/capsule/LetterCreatePage';
import LetterPaperSelectPage from '@/pages/capsule/LetterPaperSelectPage';
import LetterTypeSelectPage from '@/pages/capsule/LetterTypeSelectPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotificationPage from '@/pages/NotificationPage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import OnboardingPage from '@/pages/OnboardingPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import AnniversaryFormPage from '@/pages/anniversary/AnniversaryFormPage';
import ArchiveDetailPage from '@/pages/archive/ArchiveDetailPage';
import ArchiveFormPage from '@/pages/archive/ArchiveFormPage';
import ArchivePage from '@/pages/archive/ArchivePage';
import SharedArchivePage from '@/pages/archive/SharedArchivePage';
import CalendarPage from '@/pages/calendar/CalendarPage';
import CalendarSearchPage from '@/pages/calendar/CalendarSearchPage';
import CapsuleCreatePage from '@/pages/capsule/CapsuleCreatePage';
import CapsuleHomePage from '@/pages/capsule/CapsuleHomePage';
import CapsuleListPage from '@/pages/capsule/CapsuleListPage';
import MyPage from '@/pages/mypage/MyPage';
import NotificationSettingsPage from '@/pages/mypage/NotificationSettingsPage';
import ProfileEditPage from '@/pages/mypage/ProfileEditPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 권한·검증 실패(4xx)는 다시 해도 같은 결과라 바로 포기한다.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

export default function App() {
  usePushBridge();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="/oauth/kakao" element={<OAuthCallbackPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/profile-setup"
          element={
            <RequireAuth>
              <ProfileSetupPage />
            </RequireAuth>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <NotificationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />
        <Route
          path="/mypage/edit"
          element={
            <RequireAuth>
              <ProfileEditPage />
            </RequireAuth>
          }
        />
        <Route
          path="/mypage/notifications"
          element={
            <RequireAuth>
              <NotificationSettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/capsules"
          element={
            <RequireAuth>
              <CapsuleHomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/capsules/list"
          element={
            <RequireAuth>
              <CapsuleListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/capsules/new"
          element={
            <RequireAuth>
              <CapsuleCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path="/archives"
          element={
            <RequireAuth>
              <ArchivePage />
            </RequireAuth>
          }
        />
        <Route path="/archives/shared" element={<SharedArchivePage />} />
        <Route
          path="/archives/new"
          element={
            <RequireAuth>
              <ArchiveFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/archives/:archiveId"
          element={
            <RequireAuth>
              <ArchiveDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/archives/:archiveId/edit"
          element={
            <RequireAuth>
              <ArchiveFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <CalendarPage />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/search"
          element={
            <RequireAuth>
              <CalendarSearchPage />
            </RequireAuth>
          }
        />
        <Route
          path="/anniversaries/new"
          element={
            <RequireAuth>
              <AnniversaryFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/anniversaries/:anniversaryId/edit"
          element={
            <RequireAuth>
              <AnniversaryFormPage />
            </RequireAuth>
          }
        />

        {/* 캡슐은 몰입 화면이라 하단 네비게이션 없이 단독으로 띄운다. */}
        <Route path={ROUTES.CAPSULE_COVER} element={<CapsuleCoverPage />} />
        <Route path={ROUTES.CAPSULE_DETAIL} element={<CapsuleDetailPage />} />
        <Route path={ROUTES.CAPSULE_EDIT} element={<CapsuleEditPage />} />
        <Route
          path={ROUTES.CAPSULE_PARTICIPANTS}
          element={<CapsuleMembersPage role="PARTICIPANT" />}
        />
        <Route
          path={ROUTES.CAPSULE_RECEIVERS}
          element={<CapsuleMembersPage role="RECIPIENT" />}
        />
        <Route path={ROUTES.CAPSULE_REVEAL} element={<CapsuleRevealPage />} />
        {/* 초대 링크는 비로그인 상태로 열리는 게 정상이라 가드를 둔다. */}
        <Route
          path={ROUTES.INVITE}
          element={
            <RequireAuth>
              <CapsuleInvitePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.INVITE_DETAIL}
          element={
            <RequireAuth>
              <CapsuleInviteDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.LETTER_TYPE}
          element={
            <RequireAuth>
              <RequireLetterWriting>
                <LetterTypeSelectPage />
              </RequireLetterWriting>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.LETTER_PAPER}
          element={
            <RequireAuth>
              <RequireLetterWriting>
                <LetterPaperSelectPage />
              </RequireLetterWriting>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.LETTER_WRITE}
          element={
            <RequireAuth>
              <RequireLetterWriting>
                <LetterCreatePage />
              </RequireLetterWriting>
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastHost />
    </QueryClientProvider>
  );
}
