
'use client'

import { useState } from 'react';
import { updateStats } from '@/actions/admin';
import { AdmissionsStats } from '@/types/database';

export default function StatsManager({ stats }: { stats: AdmissionsStats }) {
    const [confirmed, setConfirmed] = useState(stats.confirmed);
    const [totalTarget, setTotalTarget] = useState(stats.total_target);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateStats(confirmed, totalTarget);
        } catch (e) {
            alert('Failed to update stats');
        } finally {
            setLoading(false);
        }
    };

    const hasChanged = confirmed !== stats.confirmed || totalTarget !== stats.total_target;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Admissions Update</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Target</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            value={totalTarget}
                            onChange={(e) => setTotalTarget(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmed</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            value={confirmed}
                            onChange={(e) => setConfirmed(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleUpdate}
                    disabled={loading || !hasChanged}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:hover:bg-primary shadow-sm"
                >
                    {loading ? 'Updating...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
}
