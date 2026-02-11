
import { Task } from '@/types/database';
import clsx from 'clsx';
import { Briefcase } from 'lucide-react';

export default function TaskTable({ tasks }: { tasks: Task[] }) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex-1">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Briefcase className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Employee Tasks</h2>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm font-semibold uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Current Task</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Briefcase size={32} className="text-slate-300" />
                                        <p>No active tasks found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {task.employee_name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {task.task_title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={clsx(
                                                'status-pending status-in-progress status-done',
                                                {
                                                    'status-pending': task.status === 'pending',
                                                    'status-in-progress': task.status === 'in_progress',
                                                    'status-done': task.status === 'done',
                                                }
                                            )}
                                        >
                                            {task.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
