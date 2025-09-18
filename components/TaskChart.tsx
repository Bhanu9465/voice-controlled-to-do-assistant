import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../constants';

const statusColors: Record<TaskStatus, string> = {
    Todo: 'bg-blue-500',
    InProgress: 'bg-yellow-500',
    Done: 'bg-green-500',
};

export const TaskChart: React.FC = () => {
    const { tasks } = useAppContext();

    const taskCounts = KANBAN_COLUMNS.reduce((acc, status) => {
        acc[status as TaskStatus] = tasks.filter(task => task.status === status).length;
        return acc;
    }, {} as Record<TaskStatus, number>);

    const totalTasks = tasks.length;
    if (totalTasks === 0) {
        return (
            <div className="bg-card p-4 rounded-lg border border-border h-full flex items-center justify-center">
                <p className="text-muted-foreground">No task data to display.</p>
            </div>
        );
    }

    return (
        <div className="bg-card p-6 rounded-lg border border-border col-span-2 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
            <div className="flex gap-4 items-end h-40">
                {KANBAN_COLUMNS.map(status => {
                    const count = taskCounts[status as TaskStatus];
                    const height = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                    return (
                        <div key={status} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex-1 flex items-end">
                                <div
                                    className={`w-full rounded-t-md ${statusColors[status as TaskStatus]}`}
                                    style={{ height: `${height}%` }}
                                    title={`${count} tasks`}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{status} ({count})</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskChart;
