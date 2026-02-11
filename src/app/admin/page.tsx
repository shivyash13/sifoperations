
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import EmployeeManager from '@/components/admin/EmployeeManager';
import TaskManager from '@/components/admin/TaskManager';
import StatsManager from '@/components/admin/StatsManager';
import UpdatePoster from '@/components/admin/UpdatePoster';

export const dynamic = 'force-dynamic';

async function getAdminData() {
    const [employees, allTasks, stats, updates] = await Promise.all([
        supabaseAdmin.from('employees').select('*').order('name'),
        supabaseAdmin.from('tasks').select('*').order('updated_at', { ascending: false }),
        supabaseAdmin.from('admissions_stats').select('*').limit(1).single(),
        supabaseAdmin.from('daily_updates').select('*').order('created_at', { ascending: false }).limit(50)
    ]);

    // Get only the most recent task per employee
    const taskMap = new Map();
    (allTasks.data || []).forEach(task => {
        if (!taskMap.has(task.employee_id)) {
            taskMap.set(task.employee_id, task);
        }
    });
    const tasks = Array.from(taskMap.values());

    console.log('Admin Data - Employees:', employees.data?.length);
    console.log('Admin Data - Tasks:', tasks.length);

    return {
        employees: employees.data || [],
        tasks: tasks,
        stats: stats.data || { total_target: 100, confirmed: 0, id: 'placeholder' },
        updates: updates.data || []
    };
}

export default async function AdminPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    const { employees, tasks, stats, updates } = await getAdminData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
            <AdminHeader />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Stats & Management */}
                <div className="space-y-6">
                    <StatsManager stats={stats as any} />
                    <EmployeeManager />
                    <UpdatePoster employees={employees} updates={updates} />
                </div>

                {/* Right Column: Task Management (Wider) */}
                <div className="lg:col-span-2">
                    <TaskManager employees={employees} tasks={tasks} />
                </div>
            </main>
        </div>
    );
}
