
'use client'

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { DashboardData } from '@/types/database';
import KPICards from './KPICards';
import TaskTable from './TaskTable';
import UpdatesPanel from './UpdatesPanel';
import { Loader2 } from 'lucide-react';

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
    // Create a stable supabase client instance for this component
    const [supabase] = useState(() => createClient());
    const queryClient = useQueryClient();

    // Fetch function that uses the stable client
    const fetchDashboard = async () => {
        const { data, error } = await supabase.rpc('get_dashboard_summary');
        if (error) throw error;
        return data as unknown as DashboardData;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboard,
        initialData,
        // Don't refetch on window focus to avoid thrashing, let Realtime handle updates
        refetchOnWindowFocus: false,
    });

    // Realtime Subscription
    useEffect(() => {
        // Unique channel name to avoid conflicts if multiple tabs open
        const channelName = 'operations-dashboard-realtime';

        console.log('Setting up Realtime subscription...', channelName);

        const channel = supabase.channel(channelName)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                (payload) => {
                    console.log('Realtime Change (Tasks):', payload);
                    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'daily_updates' },
                (payload) => {
                    console.log('Realtime Change (Updates):', payload);
                    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'admissions_stats' },
                (payload) => {
                    console.log('Realtime Change (Stats):', payload);
                    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                }
            )
            .subscribe((status) => {
                console.log('Realtime Subscription Status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Connected to Realtime');
                }
                if (status === 'CLOSED') {
                    console.log('❌ Realtime Disconnected');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('⚠️ Realtime Channel Error');
                }
            });

        return () => {
            console.log('Cleaning up Realtime subscription...');
            supabase.removeChannel(channel);
        };
    }, [supabase, queryClient]); // Dependencies: stable supabase instance

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen text-primary">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    // Fallbacks for data integrity
    const tasks = data.tasks || [];
    const updates = data.updates || [];
    const kpi = data.kpi || { total_target: 0, confirmed: 0, remaining: 0 };

    return (
        <div className="space-y-8">
            {/* KPI Section */}
            <KPICards data={kpi} />

            {/* Main Grid: Tasks (2 cols) + Updates (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col">
                    <TaskTable tasks={tasks} />
                </div>
                <div className="lg:col-span-1 flex flex-col">
                    <UpdatesPanel updates={updates} />
                </div>
            </div>
        </div>
    );
}
