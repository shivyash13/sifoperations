
import { DailyUpdate } from '@/types/database';
import { MessageSquare, User, Clock } from 'lucide-react';

export default function UpdatesPanel({ updates }: { updates: DailyUpdate[] }) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex-1">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <MessageSquare className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Daily Updates</h2>
                </div>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {updates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <MessageSquare size={32} className="text-slate-300 mb-2" />
                        <p>No updates yet</p>
                    </div>
                ) : (
                    updates.map((update, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-gradient-to-r from-blue-50/50 to-slate-50/50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <User size={16} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    {update.employee_name && (
                                        <p className="text-sm font-semibold text-blue-700 mb-1">
                                            {update.employee_name}
                                        </p>
                                    )}
                                    <p className="text-slate-700 leading-relaxed">{update.message}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                                        <Clock size={12} />
                                        <span>{new Date(update.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
