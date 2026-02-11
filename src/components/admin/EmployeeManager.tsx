
'use client'

import { useState } from 'react';
import { addEmployee } from '@/actions/admin';
import { Loader2, Plus } from 'lucide-react';

export default function EmployeeManager() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await addEmployee(name);
            setName('');
        } catch (error) {
            alert('Failed to add employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Employee</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Employee Name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 w-full"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Add
                </button>
            </form>
        </div>
    );
}
