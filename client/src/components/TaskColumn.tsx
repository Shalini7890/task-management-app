import React from 'react';
import { Task } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

interface TaskColumnProps {
    title: string;
    status: string;
    tasks: Task[];
    onDeleteTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDeleteTask, onEditTask }) => {

    const { setNodeRef, isOver } = useDroppable({ id: status });

    const getStatusStyles = () => {
        switch (status) {
            case 'to-do': 
                return {
                    border: 'border-gray-200',
                    dot: 'bg-gray-400',
                    badge: 'bg-gray-100 text-gray-600'
                };
            case 'in-progress': 
                return {
                    border: 'border-orange-200',
                    dot: 'bg-orange-400',
                    badge: 'bg-orange-100 text-orange-600'
                };
            case 'done': 
                return {
                    border: 'border-green-200',
                    dot: 'bg-green-400',
                    badge: 'bg-green-100 text-green-600'
                };
            default: 
                return {
                    border: 'border-gray-200',
                    dot: 'bg-gray-400',
                    badge: 'bg-gray-100 text-gray-600'
                };
        }
    };

    const styles = getStatusStyles();


    return (
        <div ref={setNodeRef} className={`bg-white rounded-xl shadow-sm border ${styles.border} p-6 ${isOver ? 'bg-gray-50' : ''}`} style={{ minHeight: '500px' }}>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center'>
                    <span className={`w-3 h-3 bg-${styles.dot} rounded-full mr-3`} ></span>
                    {title}
                    <span className={`ml-2 ${styles.badge} text-sm px-2 py-1 rounded-full`}>
                        {tasks.length}
                    </span>
                </h2>
            </div>
            <div className='space-y-4'>
                <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (<TaskCard key={task._id} task={task} onDelete={onDeleteTask} onEdit={onEditTask}/>))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No tasks yet</p>
                        <p className="text-xs">Drag tasks here or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskColumn;