
export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Employee {
    id: string;
    name: string;
    created_at: string;
}

export interface Task {
    id: string;
    employee_id: string;
    task_title: string;
    status: TaskStatus;
    updated_at: string;
    // Joins
    employee_name?: string;
}

export interface AdmissionsStats {
    id: string;
    total_target: number;
    confirmed: number;
    updated_at: string;
    // Calculated
    remaining?: number;
}

export interface DailyUpdate {
    id: string;
    employee_id: string | null;
    message: string;
    created_at: string;
    // Joins
    employee_name?: string;
}

export interface DashboardData {
    kpi: {
        total_target: number;
        confirmed: number;
        remaining: number;
    };
    tasks: Task[];
    updates: DailyUpdate[];
}
