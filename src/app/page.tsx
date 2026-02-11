import Image from 'next/image';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { createClient } from '@/lib/supabase';
import { DashboardData } from '@/types/database';
import { Activity } from 'lucide-react';

// Revalidate every 0 seconds (always fresh on refresh) or relies on Client Side Realtime
export const revalidate = 0;

async function getInitialDashboardData(): Promise<DashboardData> {
  const supabase = createClient(); // This uses the standard client (anon)

  const { data, error } = await supabase.rpc('get_dashboard_summary');

  if (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty structure on error to prevent crash, Client will attempt refetch
    return {
      kpi: { total_target: 0, confirmed: 0, remaining: 0 },
      tasks: [],
      updates: []
    };
  }

  return data as unknown as DashboardData;
}

export default async function Home() {
  const initialData = await getInitialDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header - Using Primary Theme Color */}
      <header className="bg-gradient-to-r from-primary to-primary-light shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="">
              <Image
                src="/logo.jpg"
                alt="The Sunyatee Retreat Logo"
                width={60}
                height={60}
                className="rounded-lg object-cover mix-blend-screen"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Operations Dashboard
              </h1>
              <p className="text-primary-lightest mt-1 flex items-center gap-2">
                <Activity size={16} />
                Real-time Operations Monitoring
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <DashboardClient initialData={initialData} />
      </main>
    </div>
  );
}
