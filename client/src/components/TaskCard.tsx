import React from 'react';
import { Task } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;

}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-2">
                {/* ✅ Drag handle - only this icon is draggable */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move p-1 hover:bg-gray-100 rounded"
                    title="Drag to move task"
                >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                    </svg>
                </div>

                <h3 className="font-medium text-gray-900 flex-1 mx-2">{task.title}</h3>

                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                    {task.dueDate ? `Due: ${formatDate(task.dueDate)}` : 'No due date'}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Edit button clicked for task:', task._id);
                            onEdit(task);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(task._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskCard;