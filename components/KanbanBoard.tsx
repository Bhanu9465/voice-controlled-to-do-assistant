import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { KANBAN_COLUMNS } from '../constants';
import { AnimatePresence } from 'framer-motion';

const KanbanColumn: React.FC<{ status: TaskStatus; tasks: Task[] }> = ({ status, tasks }) => {
    const { updateTaskStatus } = useAppContext();
    const [isOver, setIsOver] = useState(false);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            updateTaskStatus(taskId, status);
        }
        setIsOver(false);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const onDragLeave = () => {
        setIsOver(false);
    };

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`flex-1 bg-muted/30 p-4 rounded-lg transition-colors duration-300 ${isOver ? 'bg-primary/20' : ''}`}
        >
            <h3 className="font-semibold mb-4 text-center text-sm uppercase tracking-wider">{status} ({tasks.length})</h3>
            <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                     <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg border-border h-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Drop tasks here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanBoard: React.FC = () => {
    const { tasks, searchTerm, filter } = useAppContext();
    const today = new Date().toISOString().split('T')[0];

    const filteredTasks = tasks
        .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(task => {
            if (filter === 'today') {
                return task.dueDate === today;
            }
            return true;
        });

    if (filteredTasks.length === 0 && (searchTerm || filter === 'today')) {
        return (
             <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg border-border">
                <h3 className="text-lg font-semibold">No tasks found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter.</p>
            </div>
        )
    }

    const tasksByStatus = KANBAN_COLUMNS.reduce((acc, status) => {
        acc[status as TaskStatus] = filteredTasks.filter(task => task.status === status);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {KANBAN_COLUMNS.map(status => (
                <KanbanColumn
                    key={status}
                    status={status as TaskStatus}
                    tasks={tasksByStatus[status as TaskStatus]}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;