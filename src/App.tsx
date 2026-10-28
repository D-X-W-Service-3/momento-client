import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
