
'use client'

import { useState } from 'react';
import { postUpdate, deleteDailyUpdate, deleteAllDailyUpdates } from '@/actions/admin';
import { Employee, DailyUpdate } from '@/types/database';
import { Loader2, Trash2, XCircle } from 'lucide-react';

export default function UpdatePoster({ employees, updates }: { employees: Employee[], updates: DailyUpdate[] }) {
    const [message, setMessage] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [clearingAll, setClearingAll] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        // ... existing submit logic ...
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        try {
            await postUpdate(message, selectedEmployee || undefined);
            setMessage('');
            setSelectedEmployee('');
        } catch (e) {
            alert('Failed to post update');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const password = window.prompt("Enter password to delete:");
        if (!password) return;

        if (password !== 'deletekar') {
            alert('Incorrect password!');
            return;
        }

        if (!confirm('Are you sure you want to delete this update?')) return;

        setDeletingId(id);
        try {
            await deleteDailyUpdate(id, password);
        } catch (e) {
            alert('Failed to delete update');
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearAll = async () => {
        const password = window.prompt("Enter password to DELETE ALL updates:");
        if (!password) return;

        if (password !== 'deletekar') {
            alert('Incorrect password!');
            return;
        }

        if (!confirm('WARNING: This will delete ALL daily updates. Are you sure?')) return;

        setClearingAll(true);
        try {
            await deleteAllDailyUpdates(password);
        } catch (e) {
            alert('Failed to delete all updates');
        } finally {
            setClearingAll(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {/* ... existing form ... */}
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Post Daily Update</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                        <option value="">General Update (No Employee)</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>

                    <textarea
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-32 resize-none"
                        placeholder="Type an announcement or update..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Post Update'}
                    </button>
                </form>
            </div>

            {/* Recent Updates List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Updates</h3>
                    {updates.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            disabled={clearingAll}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
                        >
                            {clearingAll ? <Loader2 className="animate-spin" size={12} /> : <XCircle size={14} />}
                            Delete All
                        </button>
                    )}
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto">

                    {updates.length === 0 ? (
                        <p className="text-slate-400 text-center text-sm">No updates found.</p>
                    ) : (
                        updates.map((update) => (
                            <div key={update.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm relative group">
                                <div className="pr-8">
                                    {update.employee_name && (
                                        <div className="font-semibold text-blue-700 mb-1">
                                            {update.employee_name}
                                        </div>
                                    )}
                                    <p className="text-slate-700 whitespace-pre-wrap">{update.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {new Date(update.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(update.id)}
                                    disabled={deletingId === update.id}
                                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors p-1"
                                    title="Delete Update"
                                >
                                    {deletingId === update.id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
