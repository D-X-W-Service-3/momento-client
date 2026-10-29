import { Outlet } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="mx-auto w-full max-w-md overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[120px]">
        <AppHeader />
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
