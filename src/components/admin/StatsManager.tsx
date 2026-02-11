
'use client'

import { useState } from 'react';
import { updateStats } from '@/actions/admin';
import { AdmissionsStats } from '@/types/database';

export default function StatsManager({ stats }: { stats: AdmissionsStats }) {
    const [confirmed, setConfirmed] = useState(stats.confirmed);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateStats(confirmed);
        } catch (e) {
            alert('Failed to update stats');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Admissions Update</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Target</label>
                    <div className="text-2xl font-bold text-slate-800">{stats.total_target}</div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmed</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-24 px-3 py-1 border rounded"
                            value={confirmed}
                            onChange={(e) => setConfirmed(parseInt(e.target.value) || 0)}
                        />
                        <button
                            onClick={handleUpdate}
                            disabled={loading || confirmed === stats.confirmed}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
