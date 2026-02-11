
'use client'

import { useState } from 'react';
import { assignTask, updateTaskStatus, deleteTask, deleteEmployee } from '@/actions/admin';
import { Employee, Task } from '@/types/database';
import { Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function TaskManager({ employees, tasks }: { employees: Employee[], tasks: Task[] }) {
    const [selectedEmp, setSelectedEmp] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmp || !taskTitle.trim()) return;

        setLoading(true);
        try {
            await assignTask(selectedEmp, taskTitle);
            setTaskTitle('');
        } catch (error) {
            alert('Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    const activeTasks = tasks.reduce((acc, task) => {
        if (task && task.employee_id) {
            acc[task.employee_id] = task;
        }
        return acc;
    }, {} as Record<string, Task>);

    console.log('--- DEBUG START ---');
    console.log('Employees:', employees.map(e => ({ id: e.id, name: e.name })));
    console.log('Tasks raw:', tasks);
    console.log('Active Tasks Keys:', Object.keys(activeTasks));
    employees.forEach(emp => {
        const task = activeTasks[emp.id];
        console.log(`Checking Employee: ${emp.name} (${emp.id}) -> Has Task? ${!!task}`);
    });
    console.log('--- DEBUG END ---');

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Task Management</h3>

            {/* Assignment Form */}
            <form onSubmit={handleAssign} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">Assign New Task</h4>
                <div className="space-y-3">
                    <select
                        value={selectedEmp}
                        onChange={(e) => setSelectedEmp(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task Description"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading || !selectedEmp || !taskTitle}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Assigning...' : 'Assign Task'}
                    </button>
                </div>
            </form>

            {/* Active Employee List */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Active Employees</h4>
                {employees.length === 0 && <p className="text-slate-400 text-sm">No employees added yet.</p>}

                {employees.map(emp => {
                    const currentTask = activeTasks[emp.id];

                    return (
                        <div key={emp.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-slate-800">{emp.name}</span>
                                <button
                                    onClick={async () => {
                                        if (confirm(`Delete employee "${emp.name}" and all their tasks?`)) {
                                            await deleteEmployee(emp.id);
                                        }
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete employee"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {currentTask ? (
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-slate-600 flex-1">{currentTask.task_title}</p>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this task?')) {
                                                    await deleteTask(currentTask.id);
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                            title="Delete task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateTaskStatus(currentTask.id, 'pending')}
                                            className={clsx("text-xs px-2 py-1 rounded border", currentTask.status === 'pending' ? "bg-yellow-100 border-yellow-200 text-yellow-800" : "bg-white text-slate-500")}
                                        >Pending</button>
                                        <button
                                            onClick={() => updateTaskStatus(currentTask.id, 'in_progress')}
                                            className={clsx("text-xs px-2 py-1 rounded border", currentTask.status === 'in_progress' ? "bg-blue-100 border-blue-200 text-blue-800" : "bg-white text-slate-500")}
                                        >In Progress</button>
                                        <button
                                            onClick={() => updateTaskStatus(currentTask.id, 'done')}
                                            className={clsx("text-xs px-2 py-1 rounded border", currentTask.status === 'done' ? "bg-green-100 border-green-200 text-green-800" : "bg-white text-slate-500")}
                                        >Done</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">No active task</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
