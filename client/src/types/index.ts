//user related
export interface User{
    id: string;
    name:string;
    email: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    message?: string;
    token: string;
    user: User;
}

//task related
export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' | 'done';
    priority: 'high' | 'medium' | 'low'
    dueDate?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface CreateTaskData {
    title: string;
    description?:string;
    priority:string;
    dueDate?: string;
}