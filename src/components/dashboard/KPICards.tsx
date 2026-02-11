
import { Users, CheckCircle, Target } from 'lucide-react';

export default function KPICards({ data }: { data: { total_target: number; confirmed: number; remaining: number } }) {
    const { total_target, confirmed, remaining } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Target */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-primary rounded-lg">
                    <Target size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Target</p>
                    <p className="text-3xl font-bold text-slate-800">{total_target}</p>
                </div>
            </div>

            {/* Confirmed - Using Primary Theme Gradient */}
            <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-xl shadow-md flex items-center space-x-4 text-white">
                <div className="p-3 bg-white/20 rounded-lg">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-primary-lightest uppercase tracking-wider">Confirmed</p>
                    <p className="text-3xl font-bold">{confirmed}</p>
                </div>
            </div>

            {/* Remaining */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Remaining</p>
                    <p className="text-3xl font-bold text-slate-800">{remaining}</p>
                </div>
            </div>
        </div>
    );
}
