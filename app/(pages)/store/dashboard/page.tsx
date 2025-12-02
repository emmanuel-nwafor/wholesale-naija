'use client';

import StoreAnalytics from '@/app/components/analytics/StoreAnalytics';
import StoreCarousel from '@/app/components/carousels/StoreCarousel';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import QuickActions from '@/app/components/quick-actions/QuickActions';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <StoreSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Dashboard
            </h1>
            <StoreAnalytics />
            <QuickActions />
            <StoreCarousel />
          </div>
        </main>
      </div>
    </div>
  );
}
