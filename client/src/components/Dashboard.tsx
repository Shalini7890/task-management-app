import React, { useEffect, useState } from 'react';
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';
import { CreateTaskData, Task, User } from '../types';
import { createNewTask, deleteTask, getAllTasks, updateTask, updateTaskStatus } from '../services/api';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import EditTaskModal from './EditTaskModal';


interface DashboardProps {
    user:User;
    onLogout:() => void;

}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);


    useEffect(()=> {
        loadTasks();
    },[]);

    const loadTasks = async() => {
        try{
        setLoading(true);
        const response = await getAllTasks();
        setTasks(response.tasks);
        }
        catch(error:any)
        {
            console.error('Failed to fetch tasks', error)
        }
        finally{
            setLoading(false);
        }
    }
    //Calculate count of each status
    let todoTasks = tasks.filter((task => task.status === 'to-do'));
    let inProgressTasks = tasks.filter((task => task.status === 'in-progress'));
    let doneTasks = tasks.filter((task => task.status === 'done'));

console.log('All tasks:', tasks);
console.log('Todo tasks:', todoTasks);
console.log('In Progress tasks:', inProgressTasks);
console.log('Done tasks:', doneTasks);

const handleDeleteTask = async(taskId: string) => {
    try{
        setLoading(true);
        const response = await deleteTask(taskId);
        setTasks(prev => prev.filter((task)=> task._id !== taskId));
    }
    catch(error:any){
        console.error('Unable to delete task', error)
    }
    finally {
        setLoading(false);
    }
}

const handleEditTask = async (taskId: string, data: Partial<CreateTaskData>) => {
    console.log('Editing task:', taskId, data); // Debug log
    try {
        const response = await updateTask(taskId, data);
        setTasks(prev => prev.map(task => 
            task._id === taskId ? response.task : task
        ));
        setEditingTask(null);
        console.log('Task updated successfully'); // Debug log
    } catch (error: any) {
        console.error('Failed to update task', error);
    }
}
const handleDragEnd = async(event: DragEndEvent) => {
    const {active, over} = event;
    if(!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // ✅ Add debug logging
    console.log('Drag ended:');
    console.log('Task ID:', taskId);
    console.log('New Status:', newStatus);
    console.log('Should be one of: to-do, in-progress, done');

    // Check if newStatus is valid
    if (!['to-do', 'in-progress', 'done'].includes(newStatus)) {
        console.error('Invalid status:', newStatus);
        return;
    }

    setTasks(prev => prev.map(task => task._id === taskId ? {...task,status: newStatus as any}: task));

    //updating BE
    try{
        setLoading(true);
        const response = await updateTaskStatus(taskId, newStatus);
    }
    catch(error:any){
        console.error('Unable to update task status', error);
        loadTasks();
    }
    finally {
        setLoading(false);
    }

}
const handleCreateTask = async(data: CreateTaskData) => {
    try{
        setLoading(true);
        const response = await createNewTask(data);
        setTasks(prev => [...prev,response.task]);
        setShowModal(false);
    }
    catch(error:any){
        console.error('Failed to create task', error);
    }
    finally{
        setLoading(false);
    }
}
    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }
    return (

        <div className='min-h-screen bg-gray-50'>
            <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">Welcome, {user.name}</span>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              + New Task
            </button>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
            <main className='max-w-7xl mx-auto px-4 md:px-6 py-8'>
                {/* Stats Cards - All 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* TO DO Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">To Do</p>
                                <p className="text-2xl font-bold text-gray-900">{todoTasks.length}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* IN PROGRESS Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-orange-600">{inProgressTasks.length}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* COMPLETED Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{doneTasks.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Kanban Board - Always 3 columns */}
                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
                        <TaskColumn title="To Do" status="to-do" tasks={todoTasks} onDeleteTask = {handleDeleteTask} onEditTask={setEditingTask}/>
                        <TaskColumn title="In Progress" status="in-progress" tasks={inProgressTasks} onDeleteTask = {handleDeleteTask} onEditTask={setEditingTask}/>
                        <TaskColumn title="Completed" status="done" tasks={doneTasks} onDeleteTask = {handleDeleteTask} onEditTask={setEditingTask}/>
                    </div>
                </DndContext>

            </main >
            {/* Task Creation Modal */}
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
      {/* ✅ Edit Task Modal */}
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSubmit={handleEditTask}
                />
            )}
        </div >
    )
}