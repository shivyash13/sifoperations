
'use client'

import { logout } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

export default function AdminHeader() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/admin');
        router.refresh();
    };

    return (
        <header className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="">
                            <Image
                                src="/logo.jpg"
                                alt="The Sunyatee Retreat Logo"
                                width={48}
                                height={48}
                                className="rounded-lg object-cover mix-blend-screen"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Admin Control Panel
                            </h1>
                            <p className="text-primary-lightest text-sm mt-1">
                                Manage operations & team activities
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
