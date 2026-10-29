import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import { ROUTES } from '@/constants/routes';
import CalendarPage from '@/pages/CalendarPage';
import CalendarSearchPage from '@/pages/CalendarSearchPage';
import CapsuleCoverPage from '@/pages/CapsuleCoverPage';
import CapsuleDetailPage from '@/pages/CapsuleDetailPage';
import CapsuleEditPage from '@/pages/CapsuleEditPage';
import CapsuleRevealPage from '@/pages/CapsuleRevealPage';
import HomePage from '@/pages/HomePage';
import LetterCreatePage from '@/pages/LetterCreatePage';
import LetterPaperSelectPage from '@/pages/LetterPaperSelectPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        {/* 캡슐 커버는 몰입 화면이라 하단 네비게이션 없이 단독으로 띄운다. */}
        <Route path={ROUTES.CAPSULE_COVER} element={<CapsuleCoverPage />} />
        <Route path={ROUTES.CAPSULE_DETAIL} element={<CapsuleDetailPage />} />
        <Route path={ROUTES.LETTER_PAPER} element={<LetterPaperSelectPage />} />
        <Route path={ROUTES.CAPSULE_EDIT} element={<CapsuleEditPage />} />
        <Route path={ROUTES.CAPSULE_REVEAL} element={<CapsuleRevealPage />} />
        <Route path={ROUTES.LETTER_WRITE} element={<LetterCreatePage />} />
        <Route element={<MainLayout />}>
          {/* 검색은 캘린더 위에 겹쳐 뜨는 화면이라 하위 라우트로 둔다 */}
          <Route path={ROUTES.CALENDAR} element={<CalendarPage />}>
            <Route path="search" element={<CalendarSearchPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
