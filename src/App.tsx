import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
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
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotificationPage from '@/pages/NotificationPage';
import OnboardingPage from '@/pages/OnboardingPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import AnniversaryFormPage from '@/pages/anniversary/AnniversaryFormPage';
import ArchiveDetailPage from '@/pages/archive/ArchiveDetailPage';
import ArchiveFormPage from '@/pages/archive/ArchiveFormPage';
import ArchivePage from '@/pages/archive/ArchivePage';
import SharedArchivePage from '@/pages/archive/SharedArchivePage';
import CalendarPage from '@/pages/calendar/CalendarPage';
import CalendarSearchPage from '@/pages/calendar/CalendarSearchPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/archives" element={<ArchivePage />} />
        <Route path="/archives/shared" element={<SharedArchivePage />} />
        <Route path="/archives/new" element={<ArchiveFormPage />} />
        <Route path="/archives/:archiveId" element={<ArchiveDetailPage />} />
        <Route path="/archives/:archiveId/edit" element={<ArchiveFormPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/search" element={<CalendarSearchPage />} />
        <Route path="/anniversaries/new" element={<AnniversaryFormPage />} />
        <Route
          path="/anniversaries/:anniversaryId/edit"
          element={<AnniversaryFormPage />}
        />

        {/* 캡슐은 몰입 화면이라 하단 네비게이션 없이 단독으로 띄운다. */}
        <Route path={ROUTES.CAPSULE_COVER} element={<CapsuleCoverPage />} />
        <Route path={ROUTES.CAPSULE_DETAIL} element={<CapsuleDetailPage />} />
        <Route path={ROUTES.CAPSULE_EDIT} element={<CapsuleEditPage />} />
        <Route
          path={ROUTES.CAPSULE_PARTICIPANTS}
          element={<CapsuleMembersPage role="participant" />}
        />
        <Route
          path={ROUTES.CAPSULE_RECEIVERS}
          element={<CapsuleMembersPage role="receiver" />}
        />
        <Route path={ROUTES.CAPSULE_REVEAL} element={<CapsuleRevealPage />} />
        <Route path={ROUTES.CAPSULE_INVITE} element={<CapsuleInvitePage />} />
        <Route
          path={ROUTES.CAPSULE_INVITE_DETAIL}
          element={<CapsuleInviteDetailPage />}
        />
        <Route path={ROUTES.LETTER_PAPER} element={<LetterPaperSelectPage />} />
        <Route path={ROUTES.LETTER_WRITE} element={<LetterCreatePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
