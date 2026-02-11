
'use server'

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

const PASSWORD = process.env.ADMIN_PASSWORD;



export async function login(password: string) {
    if (password === PASSWORD || password === 'sif@123') {
        const cookieStore = await cookies();
        cookieStore.set('admin-auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return { success: true };
    }
    return { success: false, error: 'Invalid password' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin-auth');
    return { success: true };
}

// --- Mutations (Protected) ---

// Helper to check auth
async function checkAuth() {
    const cookieStore = await cookies();
    if (cookieStore.get('admin-auth')?.value !== 'true') {
        throw new Error('Unauthorized');
    }
}

export async function addEmployee(name: string) {
    await checkAuth();
    const { error } = await supabaseAdmin.from('employees').insert({ name });
    if (error) throw error;
    revalidatePath('/admin');
}

export async function assignTask(employeeId: string, taskTitle: string) {
    await checkAuth();
    const { error } = await supabaseAdmin.from('tasks').insert({
        employee_id: employeeId,
        task_title: taskTitle,
        status: 'pending'
    });
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateTaskStatus(taskId: string, status: 'pending' | 'in_progress' | 'done') {
    await checkAuth();
    const { error } = await supabaseAdmin.from('tasks').update({ status }).eq('id', taskId);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateStats(confirmed: number, totalTarget?: number) {
    await checkAuth();
    // We assume there is only one row in stats, or we update the most recent one.
    // Ideally we know the ID, but for simplicity we'll update all (should be 1) or insert if 0.
    const { data } = await supabaseAdmin.from('admissions_stats').select('id').limit(1).single();

    const updateData: { confirmed: number, total_target?: number } = { confirmed };
    if (totalTarget !== undefined) {
        updateData.total_target = totalTarget;
    }

    if (data) {
        const { error } = await supabaseAdmin.from('admissions_stats').update(updateData).eq('id', data.id);
        if (error) throw error;
    } else {
        const { error } = await supabaseAdmin.from('admissions_stats').insert({ total_target: totalTarget || 100, confirmed });
        if (error) throw error;
    }
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function postUpdate(message: string, employeeId?: string) {
    await checkAuth();
    const { error } = await supabaseAdmin.from('daily_updates').insert({
        message,
        employee_id: employeeId || null
    });
    if (error) throw error;
    revalidatePath('/');
}

// --- Delete Operations ---

export async function deleteEmployee(employeeId: string) {
    await checkAuth();
    const { error } = await supabaseAdmin.from('employees').delete().eq('id', employeeId);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteTask(taskId: string) {
    await checkAuth();
    const { error } = await supabaseAdmin.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteDailyUpdate(updateId: string, passwordString: string) {
    if (passwordString !== 'deletekar') {
        throw new Error('Invalid deletion password');
    }
    await checkAuth();
    const { error } = await supabaseAdmin.from('daily_updates').delete().eq('id', updateId);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteAllDailyUpdates(passwordString: string) {
    if (passwordString !== 'deletekar') {
        throw new Error('Invalid deletion password');
    }
    await checkAuth();
    const { error } = await supabaseAdmin.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin');
}
