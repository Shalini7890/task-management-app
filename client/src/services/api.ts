import axios from 'axios';
import { config } from '../config';
import { CreateTaskData, LoginData, RegisterData, Task } from '../types';

const apiUrl = config.API_BASE_URL;

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": 'application/json'
    },
});

//login
export const loginUser = async (data: LoginData) => {
    const response = await api.post('/auth/login',data);
    return response.data;
}

//register
export const registerUser = async (data:RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}

//get all tasks
export const getAllTasks = async() : Promise<{tasks: Task[]}>=> {
    const token = localStorage.getItem('token');
    const response = await api.get('/tasks', {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data;
}

//create a task
export const createNewTask = async(data: CreateTaskData): Promise<{task:Task}> => {
    const token = localStorage.getItem('token');
    const response = await api.post('/tasks', data, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data;
}

//update a task
export const updateTask = async(taskId:string,data: Partial<CreateTaskData>) : Promise<{task: Task}>=> {
    const token = localStorage.getItem('token');
    const response = await api.put(`/tasks/${taskId}`, data, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data;
}

//update a task's status
export const updateTaskStatus = async(taskId: string, status: string) : Promise<{task: Task}>=> {
    const token = localStorage.getItem('token');
    const response = await api.patch(`/tasks/${taskId}/status`, {status}, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data;
}

//delete a task's status
export const deleteTask = async(taskId: string) : Promise<{message: string}>=> {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/tasks/${taskId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data;
}